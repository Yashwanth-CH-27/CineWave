import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, Loader2, AlertCircle, ArrowRight, Video, Crown, User } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Demo credential autofill helper
  const fillCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#12121a] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5">
              <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <span className="text-xl font-black text-white tracking-wider">
              CINE<span className="text-purple-500">WAVE</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your personalized watchlist, streaming history, and creator tools.
          </p>
        </div>

        {/* Demo Fast Fill Buttons for College Grading / Evaluators */}
        <div className="mb-6 p-3 bg-purple-950/20 border border-purple-800/40 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold px-1">
            <span>⚡ Demo Quick-Fill Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillCredentials('user@cinewave.com', 'user123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center justify-center gap-1 border border-slate-700"
            >
              <User className="w-3 h-3 text-emerald-400" />
              <span>Free User</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('premium@cinewave.com', 'premium123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-semibold flex items-center justify-center gap-1 border border-slate-700"
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span>VIP User</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('creator@cinewave.com', 'creator123')}
              className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-[10px] font-semibold flex items-center justify-center gap-1 border border-slate-700"
            >
              <Video className="w-3 h-3 text-purple-400" />
              <span>Creator</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all hover:scale-102 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-semibold underline">
            Register for CineWave
          </Link>
        </p>
      </div>
    </div>
  );
}
