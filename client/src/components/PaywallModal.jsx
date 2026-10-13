import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, CheckCircle2, X } from 'lucide-react';

export default function PaywallModal({ isOpen, onClose, videoTitle }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#13131f] border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Golden Emblem */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/30 mb-5">
          <div className="w-full h-full bg-[#0a0a0f] rounded-[14px] flex items-center justify-center">
            <Crown className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Unlock CineWave <span className="text-amber-400">VIP</span>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {videoTitle ? (
            <>
              <strong className="text-white">"{videoTitle}"</strong> is an exclusive VIP release reserved for CineWave Premium members.
            </>
          ) : (
            'This title is reserved exclusively for CineWave VIP Premium members.'
          )}
        </p>

        {/* VIP Perks */}
        <div className="my-5 bg-[#181828] border border-white/5 rounded-xl p-4 text-left space-y-2 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Unlimited access to all VIP exclusive movies & shorts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>High Definition 1080p browser playback</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Only ₹199 / month • Cancel anytime</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => navigate('/subscription')}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Subscribe for ₹199 / Month</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Explore Free Catalog Instead
          </button>
        </div>
      </div>
    </div>
  );
}
