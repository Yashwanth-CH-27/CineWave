import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
        <Film className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-white">404</h1>
      <p className="text-base font-semibold text-slate-300 mt-2">Scene Not Found</p>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mt-1 mb-6">
        The page you are trying to stream does not exist or may have been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home Cinema</span>
      </Link>
    </div>
  );
}
