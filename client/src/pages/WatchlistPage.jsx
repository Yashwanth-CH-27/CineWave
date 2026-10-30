
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import VideoCard from '../components/VideoCard';
import {
  Bookmark,
  Film,
  Loader2,
  Sparkles,
  Brain,
  Lightbulb,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { watchlistAPI } from '../services/api';

export default function WatchlistPage() {
  const { watchlist, loading, refreshWatchlist } = useWatchlist();

  const [insights, setInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    refreshWatchlist();
  }, []);

  // Generate AI Watchlist Insights
  const handleGenerateInsights = async () => {
    try {
      setAiLoading(true);
      setAiError('');
      setInsights(null);

      const response = await watchlistAPI.getAIInsights();

      setInsights(response.data.insights);
    } catch (error) {
      setAiError(
        error.response?.data?.message ||
        'Unable to generate AI insights. Please try again.'
      );
    } finally {
      setAiLoading(false);
    }
  };

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

          <h3 className="text-xl font-bold text-white mb-2">
            Your Watchlist is empty
          </h3>

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
        <>
          {/* AI Watchlist Insights */}
          <div className="mb-8 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-[#12121a] p-5 sm:p-6">

            {/* AI Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-6 h-6" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">
                    CineWave AI Insights
                  </h2>

                  <p className="text-xs text-slate-400">
                    Discover your viewing preferences with AI
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateInsights}
                disabled={aiLoading || watchlist.length < 3}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze My Watchlist
                  </>
                )}
              </button>
            </div>

            {/* Minimum Videos Message */}
            {watchlist.length < 3 && (
              <div className="mt-5 flex items-start gap-2 text-sm text-amber-400">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  Save at least 3 videos to generate personalized AI insights.
                </p>
              </div>
            )}

            {/* AI Error */}
            {aiError && (
              <div className="mt-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {aiError}
              </div>
            )}

            {/* AI Results */}
            {insights && (
              <div className="mt-6 pt-6 border-t border-purple-500/20 space-y-6">

                {/* Summary */}
                <div>
                  <h3 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Your Viewing Summary
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {insights.summary}
                  </p>
                </div>

                {/* Favorite Genres */}
                <div>
                  <h3 className="text-sm font-bold text-purple-300 mb-3">
                    Your Favorite Genres
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {insights.favoriteGenres?.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Viewing Pattern */}
                <div>
                  <h3 className="text-sm font-bold text-purple-300 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Viewing Pattern
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {insights.viewingPattern}
                  </p>
                </div>

                {/* AI Suggestions */}
                <div>
                  <h3 className="text-sm font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    AI Suggestions
                  </h3>

                  <ul className="space-y-2">
                    {insights.recommendations?.map((item, index) => (
                      <li
                        key={index}
                        className="text-sm text-slate-300 flex items-start gap-2"
                      >
                        <span className="text-purple-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fun Fact */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <p className="text-xs text-purple-300 font-semibold mb-2">
                    ✨ CineWave AI Fun Fact
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {insights.funFact}
                  </p>
                </div>

              </div>
            )}
          </div>

          {/* Saved Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {watchlist.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
