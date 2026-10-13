import React, { useState, useEffect, useRef } from 'react';
import { videoAPI } from '../services/api';
import { AlertCircle, RefreshCw, ExternalLink, Play, Lock, ShieldCheck, Zap } from 'lucide-react';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
}

export default function VideoPlayer({
  video,
  hasAccess = true,
  onUnlockClick,
}) {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewRecorded, setViewRecorded] = useState(false);
  const [useProxy, setUseProxy] = useState(false);

  const youtubeEmbedUrl = video ? getYouTubeEmbedUrl(video.videoUrl) : null;

  // Determine source stream URL
  const currentStreamUrl = useProxy
    ? `/api/videos/stream-proxy?url=${encodeURIComponent(video?.videoUrl || '')}`
    : video?.videoUrl;

  // Reset states when video changes
  useEffect(() => {
    setHasError(false);
    setErrorMessage('');
    setViewRecorded(false);
    setUseProxy(false);
  }, [video?._id]);

  // Record view count once playback begins or loaded
  const recordViewOnce = async () => {
    if (!viewRecorded && video?._id) {
      setViewRecorded(true);
      try {
        await videoAPI.recordView(video._id);
      } catch (err) {
        console.warn('Could not record view:', err.message);
      }
    }
  };

  const handlePlay = () => {
    recordViewOnce();
  };

  const handleError = (e) => {
    console.warn('Direct media playback error. Attempting backend stream proxy...');
    // If not already using proxy, automatically fallback to server proxy
    if (!useProxy && !youtubeEmbedUrl) {
      setUseProxy(true);
      if (videoRef.current) {
        videoRef.current.load();
      }
      return;
    }

    setHasError(true);
    setErrorMessage(
      'Unable to stream media directly due to remote CDN CORS policy or restricted media origin.'
    );
  };

  const handleRetryDirect = () => {
    setHasError(false);
    setUseProxy(false);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const handleRetryProxy = () => {
    setHasError(false);
    setUseProxy(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  if (!video) return null;

  // Paywall Lock Screen
  if (!hasAccess && video.isPremium) {
    return (
      <div className="relative w-full aspect-video bg-[#0d0d15] rounded-2xl overflow-hidden border border-amber-500/30 flex flex-col items-center justify-center p-6 text-center shadow-2xl">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover filter blur-md brightness-30 opacity-40"
        />
        <div className="relative z-10 max-w-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            VIP Premium Content Locked
          </h3>

          <p className="text-xs sm:text-sm text-slate-300">
            This film is an exclusive CineWave VIP title. Unlock instant unlimited access for only{' '}
            <strong className="text-amber-400">₹199 / month</strong>.
          </p>

          <button
            onClick={onUnlockClick}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95"
          >
            Unlock VIP Access
          </button>
        </div>
      </div>
    );
  }

  // YouTube Embed Player
  if (youtubeEmbedUrl) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <iframe
          src={youtubeEmbedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={recordViewOnce}
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  // Fallback Error Screen with Proxy Selector
  if (hasError) {
    return (
      <div className="relative w-full aspect-video bg-[#0d0d15] rounded-2xl overflow-hidden border border-rose-500/30 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h4 className="text-base font-bold text-white mb-1">CORS or Stream Loading Issue</h4>
        <p className="text-xs text-slate-400 max-w-md mb-4">{errorMessage}</p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={handleRetryProxy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Stream via Server Proxy</span>
          </button>

          <button
            onClick={handleRetryDirect}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Direct Stream</span>
          </button>

          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in New Tab</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
      <video
        ref={videoRef}
        key={currentStreamUrl}
        controls
        playsInline
        poster={video.thumbnailUrl}
        onPlay={handlePlay}
        onError={handleError}
        className="w-full h-full object-contain bg-black"
      >
        <source src={currentStreamUrl} type="video/mp4" />
        <source src={currentStreamUrl} type="video/webm" />
        Your browser does not support the HTML5 video element.
      </video>

      {/* Stream Proxy Indicator */}
      {useProxy && (
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/40 text-[10px] text-purple-300 font-semibold flex items-center gap-1 pointer-events-none backdrop-blur-md">
          <ShieldCheck className="w-3 h-3 text-purple-400" />
          <span>Proxy Stream Mode Active</span>
        </div>
      )}
    </div>
  );
}
