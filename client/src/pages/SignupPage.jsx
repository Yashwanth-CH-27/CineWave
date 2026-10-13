import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, User, Video, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // 'USER' | 'CREATOR'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await signup(name, email, password, role);
      if (res.success) {
        if (role === 'CREATOR') {
          navigate('/creator/studio');
        } else {
          navigate('/');
        }
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#12121a] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
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
          <h2 className="text-xl font-bold text-white">Create Your CineWave Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose your account type below to get started on the entertainment platform.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role Selection Option Cards */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Select Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              {/* Viewer Card */}
              <div
                onClick={() => setRole('USER')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  role === 'USER'
                    ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-900/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <User className="w-5 h-5 text-purple-400" />
                  {role === 'USER' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <h4 className="font-bold text-white text-xs">Viewer / Streamer</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Watch free titles, build watchlists, and subscribe to VIP.
                </p>
              </div>

              {/* Creator Card */}
              <div
                onClick={() => setRole('CREATOR')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  role === 'CREATOR'
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-900/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Video className="w-5 h-5 text-indigo-400" />
                  {role === 'CREATOR' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <h4 className="font-bold text-white text-xs">Filmmaker / Creator</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Upload & manage videos in the dedicated Creator Studio.
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Christopher Nolan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Password (min. 6 characters)</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
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
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all hover:scale-102 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
