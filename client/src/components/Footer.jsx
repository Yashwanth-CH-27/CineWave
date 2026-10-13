import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ShieldCheck, Zap, Mail, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#07070b] border-t border-slate-900/80 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-wider text-white">
                CINE<span className="text-purple-500">WAVE</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Next-generation entertainment video streaming platform featuring curated short films, indie releases, and creator studio publishing.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Full-Stack MERN Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">
                  Featured Movies
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=free" className="hover:text-purple-400 transition-colors">
                  Free Short Films
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=premium" className="hover:text-purple-400 transition-colors">
                  VIP Exclusives
                </Link>
              </li>
              <li>
                <Link to="/explore?genre=Animation" className="hover:text-purple-400 transition-colors">
                  Animation & 3D Cinema
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Account & VIP
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/subscription" className="hover:text-amber-400 transition-colors">
                  VIP Premium (₹199/mo)
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-purple-400 transition-colors">
                  My Watchlist
                </Link>
              </li>
              <li>
                <Link to="/creator/studio" className="hover:text-purple-400 transition-colors">
                  Creator Studio Portal
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-purple-400 transition-colors">
                  Profile & Billing History
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech & Integration Highlights */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Powered By
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Razorpay Payment Gateway</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-pink-400" />
                <span>Nodemailer SMTP Dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>MongoDB & Express.js REST</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Film className="w-3.5 h-3.5 text-purple-400" />
                <span>HTML5 Video Engine</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} CineWave OTT Platform. Built for college demonstration.</p>
          <p className="text-slate-400">
            Open-source sample videos courtesy of Blender Open Movie Projects & Google Cloud Bucket.
          </p>
        </div>
      </div>
    </footer>
  );
}
