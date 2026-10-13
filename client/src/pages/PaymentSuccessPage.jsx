import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Crown, Sparkles, Film, ArrowRight, Mail } from 'lucide-react';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { receipt, user } = state;

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-2xl mx-auto px-4 sm:px-6">
      <div className="bg-[#13131f] border border-amber-500/40 rounded-3xl p-6 sm:p-10 text-center shadow-2xl shadow-amber-500/10">
        {/* Animated Badge */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-1 mx-auto mb-6 shadow-xl shadow-amber-500/30">
          <div className="w-full h-full bg-[#0a0a0f] rounded-full flex items-center justify-center">
            <Crown className="w-10 h-10 text-amber-400 fill-amber-400" />
          </div>
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Payment Verified Successfully</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
          Welcome to CineWave VIP! 🍿
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          Your payment has been verified by the server. Your VIP Premium membership is active immediately.
        </p>

        {/* Invoice Receipt Box */}
        <div className="my-6 p-5 rounded-2xl bg-[#181828] border border-white/5 text-left space-y-2.5 text-xs text-slate-300">
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-slate-400">Plan:</span>
            <span className="text-white font-bold">CineWave VIP Monthly (30 Days)</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-white/5">
            <span className="text-slate-400">Amount Paid:</span>
            <span className="text-emerald-400 font-extrabold text-sm">
              ₹{receipt?.amount ? (receipt.amount / 100).toFixed(2) : '199.00'}
            </span>
          </div>
          {receipt?.orderId && (
            <div className="flex justify-between items-center py-1 border-b border-white/5 font-mono text-[11px]">
              <span className="text-slate-400">Order ID:</span>
              <span className="text-slate-200 truncate max-w-[200px]">{receipt.orderId}</span>
            </div>
          )}
          {receipt?.paymentId && (
            <div className="flex justify-between items-center py-1 border-b border-white/5 font-mono text-[11px]">
              <span className="text-slate-400">Payment ID:</span>
              <span className="text-slate-200 truncate max-w-[200px]">{receipt.paymentId}</span>
            </div>
          )}
          {receipt?.expiresAt && (
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Valid Through:</span>
              <span className="text-amber-400 font-bold">
                {new Date(receipt.expiresAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Email Notification Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-purple-300 bg-purple-950/40 border border-purple-800/40 rounded-xl p-3 mb-6">
          <Mail className="w-4 h-4 text-purple-400" />
          <span>A confirmation receipt has been dispatched to your email address!</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link
            to="/explore?filter=premium"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Film className="w-4 h-4 fill-slate-950" />
            <span>Stream VIP Exclusives Now</span>
          </Link>

          <Link
            to="/profile"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            View Account Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
