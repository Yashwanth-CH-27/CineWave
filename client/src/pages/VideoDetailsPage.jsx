import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';
import PaywallModal from '../components/PaywallModal';
import {
  Crown,
  Eye,
  Clock,
  Calendar,
  Bookmark,
  Check,
  Share2,
  Video,
  User,
  Loader2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function VideoDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isPremium } = useAuth();
  const { isSaved, toggleWatchlist } = useWatchlist();

  const [video, setVideo] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessReason, setAccessReason] = useState('');
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadVideoDetails() {
      setLoading(true);
      try {
        const res = await videoAPI.getVideoById(id);
        if (res.data.success) {
          setVideo(res.data.video);
          setHasAccess(res.data.hasAccess);
          setAccessReason(res.data.accessReason);
          setRelated(res.data.related || []);
        }
      } catch (err) {
        console.error('Failed to load video details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadVideoDetails();
      window.scrollTo(0, 0);
    }
  }, [id, user]);

  const inWatchlist = isSaved(video?._id);

  const handleWatchlistClick = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    await toggleWatchlist(video);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-sm text-slate-400">Loading cinema theater...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen pt-28 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Video Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested movie or short film could not be found or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to={`/explore?genre=${video.genre}`} className="hover:text-purple-400 transition-colors">
            {video.genre}
          </Link>
          <span>/</span>
          <span className="text-slate-200 truncate max-w-xs">{video.title}</span>
        </div>

        {/* Video Player Theater */}
        <div className="relative">
          <VideoPlayer
            video={video}
            hasAccess={hasAccess}
            onUnlockClick={() => setShowPaywall(true)}
          />
        </div>

        {/* Video Info & Controls Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
          {/* Main Info Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-2.5">
              {video.isPremium ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md shadow-amber-500/20">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  VIP EXCLUSIVE
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider">
                  FREE TO STREAM
                </span>
              )}

              <span className="px-2.5 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/50 text-xs font-semibold">
                {video.genre}
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {video.duration || '10m'}
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                {video.views?.toLocaleString()} views
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(video.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {video.title}
            </h1>

            {/* Description */}
            <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Synopsis & Details
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {video.description}
              </p>
            </div>

            {/* Creator Spotlight */}
            {video.creator && (
              <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-purple-600/20">
                    {video.creator.name ? video.creator.name[0].toUpperCase() : 'C'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      Creator & Filmmaker
                    </span>
                    <h4 className="text-base font-bold text-white">{video.creator.name}</h4>
                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                  Verified Creator
                </span>
              </div>
            )}
          </div>

          {/* Action Sidebar Right Column */}
          <div className="space-y-4">
            <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Watch Options
              </h3>

              {/* Watchlist Toggle Button */}
              <button
                onClick={handleWatchlistClick}
                className={`w-full py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  inWatchlist
                    ? 'bg-purple-900/30 border-purple-500/50 text-purple-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-white'
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Saved in Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save to Watchlist</span>
                  </>
                )}
              </button>

              {/* Share Button */}
              <button
                onClick={handleShareClick}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{copied ? 'Link Copied to Clipboard!' : 'Share Movie'}</span>
              </button>

              {/* VIP Upgrade Promo if user doesn't have access */}
              {!hasAccess && video.isPremium && (
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="p-3.5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
                    <p className="text-xs text-amber-200 leading-snug font-medium">
                      💎 CineWave VIP unlocks all premium movies and short films with zero limits.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPaywall(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
                  >
                    Unlock with VIP Pass
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Content Rail */}
        {related.length > 0 && (
          <div className="pt-10 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                More in <span className="text-purple-400">{video.genre}</span>
              </h3>
              <Link
                to={`/explore?genre=${video.genre}`}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((rel) => (
                <VideoCard key={rel._id} video={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        videoTitle={video.title}
      />
    </div>
  );
}
