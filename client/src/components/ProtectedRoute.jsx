import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 bg-[#13131f] border border-rose-500/30 rounded-2xl text-center">
        <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-sm text-slate-400 mb-6">
          This section is reserved for verified <strong className="text-purple-400">{requiredRole}</strong> accounts only.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return children;
}
