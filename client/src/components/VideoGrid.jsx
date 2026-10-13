import React from 'react';
import VideoCard from './VideoCard';

export default function VideoGrid({ title, subtitle, icon: Icon, videos = [], emptyMessage }) {
  if (!videos || videos.length === 0) {
    if (!emptyMessage) return null;
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <section className="my-8">
      {/* Shelf Header */}
      {(title || subtitle) && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>}
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {videos.length} {videos.length === 1 ? 'title' : 'titles'}
          </span>
        </div>
      )}

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </section>
  );
}
