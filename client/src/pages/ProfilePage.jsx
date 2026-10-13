import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  User,
  Crown,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isPremium, isCreator, updateProfile, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [subStatus, setSubStatus] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [statusRes, historyRes] = await Promise.all([
          paymentAPI.getStatus(),
          paymentAPI.getHistory(),
        ]);

        if (statusRes.data.success) {
          setSubStatus(statusRes.data);
        }
        if (historyRes.data.success) {
          setPayments(historyRes.data.payments || []);
        }
      } catch (err) {
        console.warn('Failed to load profile details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await updateProfile(name);
      if (res.success) {
        setMessage('Profile updated successfully! ✅');
      } else {
        setMessage(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setMessage('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Account & Subscription Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your credentials, view VIP membership entitlement, and check payment history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Card & Name Form */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-6 text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 mx-auto">
              <div className="w-full h-full bg-[#0a0a0f] rounded-full flex items-center justify-center text-white text-2xl font-black">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-slate-800 text-purple-300 border border-slate-700">
                {user?.role}
              </span>
              {isPremium && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  VIP ACTIVE
                </span>
              )}
            </div>
          </div>

          {/* Edit Name Form */}
          <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm">Personal Information</h3>
            {message && <p className="text-purple-400 font-medium">{message}</p>}

            <form onSubmit={handleUpdateName} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-slate-950/60 border border-slate-900 rounded-xl py-2 px-3 text-slate-500 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Name'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Subscription & Payments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Status Card */}
          <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Membership Status</h3>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  isPremium
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isPremium ? 'VIP Active' : 'Free Tier'}
              </span>
            </div>

            {isPremium ? (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 fill-amber-300" />
                  <span>CineWave VIP Monthly Access Active</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You have full unlimited access to all exclusive movies, 1080p browser streams, and indie releases.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <span>
                    Valid Until:{' '}
                    <strong className="text-white">
                      {user?.subscriptionExpiry
                        ? new Date(user.subscriptionExpiry).toLocaleDateString()
                        : 'N/A'}
                    </strong>
                  </span>
                  <span>
                    Days Remaining:{' '}
                    <strong className="text-amber-400 font-bold">
                      {subStatus?.daysRemaining || 0} days
                    </strong>
                  </span>
                </div>
                <div className="pt-2">
                  <Link
                    to="/subscription"
                    className="inline-block px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                  >
                    Extend VIP Pass
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <p className="text-slate-300">
                  You are currently on the <strong className="text-white">Free Streaming Tier</strong>. You can watch standard free films, but exclusive VIP productions require a pass.
                </p>
                <Link
                  to="/subscription"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black tracking-wide"
                >
                  <Crown className="w-3.5 h-3.5 fill-current" />
                  <span>Upgrade to VIP (₹199 / Month)</span>
                </Link>
              </div>
            )}
          </div>

          {/* Payment History Table */}
          <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">Payment & Billing History</h3>
              </div>
              <span className="text-xs text-slate-400">{payments.length} orders</span>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
              </div>
            ) : payments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No past transactions recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Payment ID</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300 font-mono text-[11px]">
                    {payments.map((p) => (
                      <tr key={p._id}>
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 truncate max-w-[120px]">{p.razorpayOrderId}</td>
                        <td className="py-2.5 px-3 truncate max-w-[120px]">
                          {p.razorpayPaymentId || 'Pending'}
                        </td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">
                          ₹{(p.amount / 100).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
