import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Crown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  CreditCard,
  Loader2,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

export default function SubscriptionPage() {
  const { user, isLoggedIn, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [subStatus, setSubStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadStatus() {
      if (isLoggedIn) {
        try {
          const res = await paymentAPI.getStatus();
          if (res.data.success) {
            setSubStatus(res.data);
          }
        } catch (err) {
          console.warn('Could not load subscription status:', err.message);
        }
      }
      setLoading(false);
    }
    loadStatus();
  }, [isLoggedIn]);

  // Razorpay Checkout handler
  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      // 1. Call backend to create Razorpay Order
      const orderRes = await paymentAPI.createOrder();
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to initialize payment order');
      }

      const { order, keyId, planName } = orderRes.data;

      // 2. Configure Razorpay Checkout options
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_cinewave123456',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'CineWave OTT',
        description: planName || 'VIP Monthly Pass (30 Days)',
        order_id: order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: '9999999999',
        },
        theme: {
          color: '#7c3aed',
        },
        handler: async function (response) {
          try {
            // 3. Send payment details to backend for cryptographic signature verification
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              await refreshUser();
              navigate('/payment/success', {
                state: {
                  receipt: verifyRes.data.payment,
                  user: verifyRes.data.user,
                },
              });
            } else {
              setErrorMessage(verifyRes.data.message || 'Signature verification failed.');
              setProcessing(false);
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr);
            setErrorMessage(verifyErr.response?.data?.message || 'Payment verification failed.');
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      // 3. Open Razorpay Checkout modal
      if (typeof window.Razorpay !== 'undefined') {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setErrorMessage(`Payment Failed: ${response.error.description}`);
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Fallback simulation in test mode if Razorpay script is blocked by browser adblock
        console.warn('Razorpay SDK not loaded in window. Using test mode simulation.');
        simulateTestPayment(order.id);
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Payment initiation failed.');
      setProcessing(false);
    }
  };

  // Helper for test mode demonstration (generates test signature verify call)
  const simulateTestPayment = async (orderId) => {
    try {
      const fakePaymentId = `pay_test_${Date.now().toString().slice(-8)}`;
      const verifyRes = await paymentAPI.verifyPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: 'sig_mock_test_mode_signature',
      });

      if (verifyRes.data.success) {
        await refreshUser();
        navigate('/payment/success', {
          state: {
            receipt: verifyRes.data.payment,
            user: verifyRes.data.user,
          },
        });
      }
    } catch (err) {
      setErrorMessage('Test simulation failed: ' + err.message);
      setProcessing(false);
    }
  };

  const isActiveVIP = subStatus?.isPremium;

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span>CineWave VIP Membership</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Stream Every Story, <span className="text-amber-400">Zero Limits</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300">
          Unlock our complete library of exclusive feature films, award-winning indie shorts, and 1080p full-length streaming.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="max-w-xl mx-auto mb-8 p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Payment Issue:</p>
            <p className="mt-0.5 text-xs text-rose-300">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Subscription Card */}
      <div className="max-w-md mx-auto relative bg-[#13131f] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
        {/* VIP Gold Tag */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg">
          {isActiveVIP ? 'ACTIVE SUBSCRIPTION' : 'MOST POPULAR'}
        </div>

        <div className="text-center pt-2 pb-6 border-b border-slate-800">
          <h2 className="text-2xl font-black text-white">VIP Monthly Pass</h2>
          <p className="text-xs text-slate-400 mt-1">Full All-Access Streaming Entitlement</p>

          <div className="mt-5 flex items-baseline justify-center gap-1">
            <span className="text-4xl sm:text-5xl font-black text-white">₹199</span>
            <span className="text-xs font-semibold text-slate-400">/ 30 days</span>
          </div>

          <p className="text-[11px] text-amber-400/90 font-medium mt-1">
            Non-recurring single month entitlement • Razorpay Test Mode
          </p>
        </div>

        {/* Plan Perks */}
        <div className="py-6 space-y-3.5 text-xs sm:text-sm text-slate-200">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Unlimited access to all VIP exclusive movies</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>High-definition 1080p full screen playback</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Instant access to new indie short releases</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Instant email confirmation and receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>No long-term contracts or hidden fees</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isActiveVIP ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
              <p className="text-xs font-bold text-amber-300">
                ✨ Your CineWave VIP is currently active!
              </p>
              <p className="text-[11px] text-slate-300">
                Expires on:{' '}
                <strong className="text-white">
                  {new Date(subStatus.subscriptionExpiry).toLocaleDateString()}
                </strong>{' '}
                ({subStatus.daysRemaining} days remaining)
              </p>
              <button
                onClick={handleSubscribe}
                disabled={processing}
                className="mt-2 w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors"
              >
                {processing ? 'Processing...' : 'Extend Subscription (+30 Days)'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={processing}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Contacting Razorpay Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  <span>Subscribe with Razorpay (₹199)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Test Mode Note */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            🛡️ <strong>Razorpay Test Mode:</strong> No real bank charges. Use Razorpay test card / UPI or click Subscribe to test complete payment verification and email dispatch.
          </p>
        </div>
      </div>
    </div>
  );
}
