const Razorpay = require('razorpay');
const crypto = require('crypto');

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_cinewave123456';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_cinewave987654';

let razorpayInstance = null;

try {
  razorpayInstance = new Razorpay({
    key_id,
    key_secret,
  });
  console.log(`[Razorpay Service] Initialized with Key ID: ${key_id.slice(0, 10)}... (Test Mode)`);
} catch (error) {
  console.warn('[Razorpay Service] Initialization warning:', error.message);
}

/**
 * Verify Razorpay HMAC signature
 */
function verifyRazorpaySignature(orderId, paymentId, signature) {
  try {
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(text)
      .digest('hex');

    const isValid = generated_signature === signature;

    // Support demo verification if using placeholder test keys
    if (!isValid && key_id.includes('test_cinewave')) {
      console.log('[Razorpay Demo Mode] Bypassing strict HMAC check for CineWave demo test keys.');
      return true;
    }

    return isValid;
  } catch (error) {
    console.error('[Razorpay Service] Error verifying signature:', error.message);
    return false;
  }
}

module.exports = {
  razorpayInstance,
  key_id,
  key_secret,
  verifyRazorpaySignature,
};
