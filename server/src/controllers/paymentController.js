const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { razorpayInstance, key_id, key_secret, verifyRazorpaySignature } = require('../config/razorpay');
const { sendPaymentReceiptEmail } = require('../config/email');

const SUBSCRIPTION_PRICE = parseInt(process.env.SUBSCRIPTION_PRICE_PAISE || '19900', 10);
const SUBSCRIPTION_DAYS = parseInt(process.env.SUBSCRIPTION_DURATION_DAYS || '30', 10);

/**
 * Create a new Razorpay order for premium subscription
 * POST /api/payment/create-order
 */
async function createOrder(req, res) {
  try {
    const user = req.user;
    const amount = SUBSCRIPTION_PRICE;
    const currency = process.env.SUBSCRIPTION_CURRENCY || 'INR';
    const receipt = `cinewave_rcpt_${Date.now().toString().slice(-8)}`;

    let order;

    try {
      if (razorpayInstance && !key_id.includes('test_cinewave')) {
        // Real Razorpay API call with user-provided credentials
        order = await razorpayInstance.orders.create({
          amount,
          currency,
          receipt,
          notes: {
            userId: user._id.toString(),
            userName: user.name,
            plan: 'CineWave VIP Monthly',
          },
        });
      } else {
        // Demo mode fallback when test placeholder keys are used
        order = {
          id: `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          amount,
          currency,
          receipt,
          status: 'created',
        };
      }
    } catch (rzpError) {
      console.warn('[Razorpay API Warning] Using fallback order generator:', rzpError.message);
      order = {
        id: `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        amount,
        currency,
        receipt,
        status: 'created',
      };
    }

    // Record pending payment in MongoDB
    await Payment.create({
      user: user._id,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: 'created',
      plan: 'CineWave VIP Monthly',
      subscriptionDays: SUBSCRIPTION_DAYS,
    });

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: key_id,
      planName: 'CineWave VIP Monthly (30 Days)',
    });
  } catch (error) {
    console.error('[CreateOrder Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order. ' + error.message,
    });
  }
}

/**
 * Verify Razorpay payment signature & activate VIP subscription
 * POST /api/payment/verify
 */
async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing order_id or payment_id for verification.',
      });
    }

    // Server-side HMAC Signature Verification
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.warn(`[Payment] Invalid signature for order: ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid cryptographic signature.',
      });
    }

    // Calculate subscription expiry (now + 30 days)
    const currentExpiry = req.user.subscriptionExpiry && new Date(req.user.subscriptionExpiry) > new Date()
      ? new Date(req.user.subscriptionExpiry)
      : new Date();
    const newExpiry = new Date(currentExpiry.getTime() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);

    // Update payment record in MongoDB
    let payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      payment = new Payment({
        user: req.user._id,
        razorpayOrderId: razorpay_order_id,
        amount: SUBSCRIPTION_PRICE,
        currency: 'INR',
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature || 'verified_mock';
    payment.status = 'successful';
    await payment.save();

    // Activate user's VIP Premium status in MongoDB
    const user = await User.findById(req.user._id);
    user.isPremium = true;
    user.subscriptionExpiry = newExpiry;
    await user.save();

    console.log(`[Payment] VIP Activated for user ${user.email} until ${newExpiry.toISOString()}`);

    // Send confirmation receipt email in background
    sendPaymentReceiptEmail(user, {
      amount: payment.amount,
      razorpayPaymentId: payment.razorpayPaymentId,
      razorpayOrderId: payment.razorpayOrderId,
      subscriptionExpiry: newExpiry,
    }).catch((err) =>
      console.warn('[Payment] Non-blocking receipt email error:', err.message)
    );

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully! Welcome to CineWave VIP.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: true,
        subscriptionExpiry: user.subscriptionExpiry,
      },
      payment: {
        orderId: payment.razorpayOrderId,
        paymentId: payment.razorpayPaymentId,
        amount: payment.amount,
        status: payment.status,
        expiresAt: newExpiry,
      },
    });
  } catch (error) {
    console.error('[VerifyPayment Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying payment. ' + error.message,
    });
  }
}

/**
 * Get current user's subscription status
 * GET /api/payment/status
 */
async function getSubscriptionStatus(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const hasActivePremium = user.hasActivePremium();

    let daysRemaining = 0;
    if (hasActivePremium && user.subscriptionExpiry) {
      const msDiff = new Date(user.subscriptionExpiry) - new Date();
      daysRemaining = Math.max(0, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));
    }

    return res.status(200).json({
      success: true,
      isPremium: hasActivePremium,
      subscriptionExpiry: user.subscriptionExpiry,
      daysRemaining,
      planName: hasActivePremium ? 'CineWave VIP Monthly' : 'Free Tier',
      price: SUBSCRIPTION_PRICE / 100,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscription status.',
    });
  }
}

/**
 * Get user's payment history
 * GET /api/payment/history
 */
async function getPaymentHistory(req, res) {
  try {
    const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment history.',
    });
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  getPaymentHistory,
};
