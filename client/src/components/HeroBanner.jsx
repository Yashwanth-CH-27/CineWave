import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Info, Crown, Eye, Clock, Sparkles } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

export default function HeroBanner({ videos = [] }) {
  const navigate = useNavigate();
  const { isLoggedIn, isPremium } = useAuth();
  const { isSaved, toggleWatchlist } = useWatchlist();

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance banner every 8 seconds if multiple featured videos
  useEffect(() => {
    if (!videos || videos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [videos]);

  if (!videos || videos.length === 0) {
    return null;
  }

  const currentVideo = videos[currentIndex] || videos[0];
  const inWatchlist = isSaved(currentVideo._id);

  const handlePlayClick = () => {
    navigate(`/watch/${currentVideo._id}`);
  };

  const handleWatchlistToggle = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    await toggleWatchlist(currentVideo);
  };

  return (
    <div className="relative w-full h-[70vh] sm:h-[78vh] lg:h-[84vh] overflow-hidden select-none">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={currentVideo.thumbnailUrl}
          alt={currentVideo.title}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Vignette & Bottom Blending Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent max-w-4xl" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-4">
          {/* Badge & Metadata Rail */}
          <div className="flex flex-wrap items-center gap-2.5">
            {currentVideo.isPremium ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20">
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                VIP EXCLUSIVE
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                FREE TO STREAM
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-xs font-medium text-slate-300 border border-white/10">
              {currentVideo.genre}
            </span>

            <span className="flex items-center gap-1 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {currentVideo.duration || '12m'}
            </span>

            <span className="flex items-center gap-1 text-xs text-slate-300">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {currentVideo.views?.toLocaleString()} views
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {currentVideo.title}
          </h1>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-slate-300/90 line-clamp-3 leading-relaxed drop-shadow">
            {currentVideo.description}
          </p>

          {/* Creator Credit */}
          {currentVideo.creator?.name && (
            <p className="text-xs text-slate-400">
              Presented by{' '}
              <span className="text-purple-400 font-semibold">{currentVideo.creator.name}</span>
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handlePlayClick}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all duration-200 shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={handleWatchlistToggle}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-semibold text-sm transition-all duration-200 backdrop-blur-md ${
                inWatchlist
                  ? 'bg-purple-900/40 border-purple-500/50 text-purple-300'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-4 h-4 text-purple-400" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Watchlist</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate(`/video/${currentVideo._id}`)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Details</span>
            </button>
          </div>
        </div>

        {/* Carousel Dots */}
        {videos.length > 1 && (
          <div className="absolute right-4 sm:right-8 bottom-8 flex items-center gap-2">
            {videos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-purple-500 shadow-md shadow-purple-500/50' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
