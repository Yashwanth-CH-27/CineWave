import React, { useState, useEffect } from 'react';
import { videoAPI } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import VideoGrid from '../components/VideoGrid';
import { Flame, Clock, Film, Crown, Sparkles, Filter, Loader2 } from 'lucide-react';

const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Thriller', 'Animation', 'Short Films'];

export default function HomePage() {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [accessFilter, setAccessFilter] = useState('all'); // 'all' | 'free' | 'premium'

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [featuredRes, allRes] = await Promise.all([
          videoAPI.getFeatured(),
          videoAPI.getVideos({ limit: 50 }),
        ]);

        if (featuredRes.data.success) {
          setFeaturedVideos(featuredRes.data.videos || []);
        }
        if (allRes.data.success) {
          setAllVideos(allRes.data.videos || []);
        }
      } catch (error) {
        console.error('Failed to load home page content:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered dataset for category rails
  const filteredVideos = allVideos.filter((v) => {
    const matchesGenre = selectedGenre === 'All' || v.genre === selectedGenre;
    const matchesAccess =
      accessFilter === 'all' ||
      (accessFilter === 'free' && !v.isPremium) ||
      (accessFilter === 'premium' && v.isPremium);
    return matchesGenre && matchesAccess;
  });

  // Categorized shelves
  const popularVideos = [...filteredVideos].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8);
  const recentVideos = [...filteredVideos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
  const shortFilms = filteredVideos.filter((v) => v.genre === 'Short Films').slice(0, 8);
  const vipExclusives = filteredVideos.filter((v) => v.isPremium).slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-sm text-slate-400">Loading CineWave entertainment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner with Featured Movie Showcase */}
      <HeroBanner videos={featuredVideos.length > 0 ? featuredVideos : allVideos.slice(0, 3)} />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-10">
        {/* Category & Access Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b border-slate-800/80">
          {/* Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Access Filter Tabs (All / Free / VIP) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs self-stretch md:self-auto">
            <button
              onClick={() => setAccessFilter('all')}
              className={`flex-1 md:flex-initial px-3 py-1 rounded-lg font-medium transition-colors ${
                accessFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Content
            </button>
            <button
              onClick={() => setAccessFilter('free')}
              className={`flex-1 md:flex-initial px-3 py-1 rounded-lg font-medium transition-colors ${
                accessFilter === 'free'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Free Stream
            </button>
            <button
              onClick={() => setAccessFilter('premium')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1 px-3 py-1 rounded-lg font-semibold transition-colors ${
                accessFilter === 'premium'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Crown className="w-3 h-3 fill-current" />
              <span>VIP Only</span>
            </button>
          </div>
        </div>

        {/* Shelves / Video Sections */}
        {selectedGenre === 'All' && accessFilter === 'all' ? (
          <>
            {/* Shelf 1: Popular & Trending */}
            <VideoGrid
              title="Trending & Most Watched"
              subtitle="Popular movies and indie hits streaming right now"
              icon={Flame}
              videos={popularVideos}
            />

            {/* Shelf 2: Recently Added */}
            <VideoGrid
              title="Recently Added Releases"
              subtitle="Fresh content published by CineWave creators"
              icon={Clock}
              videos={recentVideos}
            />

            {/* Shelf 3: VIP Premium Exclusives */}
            <VideoGrid
              title="VIP Premium Exclusives"
              subtitle="High-definition cinematic productions for CineWave VIP members"
              icon={Crown}
              videos={vipExclusives}
            />

            {/* Shelf 4: Short Films Showcase */}
            {shortFilms.length > 0 && (
              <VideoGrid
                title="Curated Short Films & Festival Winners"
                subtitle="Independent cinema and award-winning shorts"
                icon={Film}
                videos={shortFilms}
              />
            )}
          </>
        ) : (
          /* Filtered Results Grid */
          <VideoGrid
            title={`${selectedGenre === 'All' ? 'Filtered' : selectedGenre} Movies & Shorts`}
            subtitle={`Showing ${filteredVideos.length} titles ${
              accessFilter !== 'all' ? `(${accessFilter.toUpperCase()} tier)` : ''
            }`}
            icon={Filter}
            videos={filteredVideos}
            emptyMessage={`No titles found for "${selectedGenre}" under "${accessFilter}" filter. Try adjusting your filter.`}
          />
        )}
      </div>
    </div>
  );
}
