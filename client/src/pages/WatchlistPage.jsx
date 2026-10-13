import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import VideoCard from '../components/VideoCard';
import { Bookmark, Film, Loader2 } from 'lucide-react';

export default function WatchlistPage() {
  const { watchlist, loading, refreshWatchlist } = useWatchlist();

  useEffect(() => {
    refreshWatchlist();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bookmark className="w-5 h-5 fill-purple-400/20" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              My Watchlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personal collection of saved movies, short films, and animations.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-purple-300">
          {watchlist.length} {watchlist.length === 1 ? 'saved item' : 'saved items'}
        </span>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading your watchlist...</p>
        </div>
      ) : watchlist.length === 0 ? (
        /* Empty State */
        <div className="py-24 text-center bg-[#12121a]/60 rounded-3xl border border-dashed border-slate-800 p-8 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-900/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Your Watchlist is empty</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
            Discover breathtaking short films, thriller series, and animations, and click the bookmark icon to save them for later.
          </p>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Film className="w-4 h-4" />
            <span>Browse All Movies</span>
          </Link>
        </div>
      ) : (
        /* Saved Videos Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {watchlist.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
