import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Crown, Plus, Check, Clock, Eye } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { isSaved, toggleWatchlist } = useWatchlist();

  if (!video) return null;

  const saved = isSaved(video._id);

  const handleCardClick = () => {
    navigate(`/video/${video._id}`);
  };

  const handlePlayDirect = (e) => {
    e.stopPropagation();
    navigate(`/watch/${video._id}`);
  };

  const handleWatchlistToggle = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    await toggleWatchlist(video);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-[#12121a] rounded-xl overflow-hidden border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/30 hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {video.isPremium ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
              <Crown className="w-3 h-3 fill-slate-950" />
              VIP
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              FREE
            </span>
          )}
        </div>

        {/* Quick Watchlist Bookmark Button */}
        <button
          onClick={handleWatchlistToggle}
          title={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-md ${
            saved
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-black/50 hover:bg-purple-600 text-slate-200 hover:text-white'
          }`}
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>

        {/* Duration Badge Bottom Right */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] text-slate-300 flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3 text-slate-400" />
          {video.duration || '10m'}
        </div>

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handlePlayDirect}
            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 hover:scale-110 active:scale-95 transition-all"
            title="Play Now"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1">
            <span className="text-purple-400 font-medium">{video.genre}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" />
              {video.views?.toLocaleString()}
            </span>
          </div>

          <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-purple-300 transition-colors">
            {video.title}
          </h3>
        </div>

        {video.creator?.name && (
          <p className="text-[11px] text-slate-400 truncate">
            By <span className="text-slate-300">{video.creator.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
