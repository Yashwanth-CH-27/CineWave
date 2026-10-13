import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { videoAPI } from '../services/api';
import VideoCard from '../components/VideoCard';
import { Search, Filter, SlidersHorizontal, Crown, Loader2, X } from 'lucide-react';

const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Thriller', 'Animation', 'Short Films', 'Sci-Fi'];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const querySearch = searchParams.get('search') || '';
  const queryGenre = searchParams.get('genre') || 'All';
  const queryFilter = searchParams.get('filter') || 'all';

  const [search, setSearch] = useState(querySearch);
  const [genre, setGenre] = useState(queryGenre);
  const [accessFilter, setAccessFilter] = useState(queryFilter);
  const [sortBy, setSortBy] = useState('latest');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state when URL params change
  useEffect(() => {
    if (searchParams.get('search')) setSearch(searchParams.get('search'));
    if (searchParams.get('genre')) setGenre(searchParams.get('genre'));
    if (searchParams.get('filter')) setAccessFilter(searchParams.get('filter'));
  }, [searchParams]);

  // Fetch videos matching current filters
  useEffect(() => {
    async function fetchFilteredVideos() {
      setLoading(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (genre !== 'All') params.genre = genre;
        if (accessFilter !== 'all') params.filter = accessFilter;
        if (sortBy === 'popular') params.sort = 'popular';
        if (sortBy === 'title') params.sort = 'title';

        const res = await videoAPI.getVideos(params);
        if (res.data.success) {
          setVideos(res.data.videos || []);
        }
      } catch (err) {
        console.error('Failed to load explore videos:', err);
      } finally {
        setLoading(false);
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchFilteredVideos();
    }, 250);

    return () => clearTimeout(debounceTimer);
  }, [search, genre, accessFilter, sortBy]);

  const handleClearFilters = () => {
    setSearch('');
    setGenre('All');
    setAccessFilter('all');
    setSortBy('latest');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Explore Library</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search across our comprehensive catalog of movies, animations, and indie short films.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-4 sm:p-6 mb-8 space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search titles, actors, directors, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-3 pl-11 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Rails */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2">
          {/* Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  genre === g
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Access Filter & Sort Selector */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Free vs VIP */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setAccessFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  accessFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAccessFilter('free')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  accessFilter === 'free' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Free
              </button>
              <button
                onClick={() => setAccessFilter('premium')}
                className={`px-2.5 py-1 rounded font-semibold flex items-center gap-1 transition-colors ${
                  accessFilter === 'premium' ? 'bg-amber-500 text-slate-950' : 'text-amber-400'
                }`}
              >
                <Crown className="w-3 h-3 fill-current" />
                <span>VIP</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500"
              >
                <option value="latest">Sort: Newest First</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(search || genre !== 'All' || accessFilter !== 'all' || sortBy !== 'latest') && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-medium px-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Found <strong className="text-white">{videos.length}</strong> streaming titles
          </span>
          {genre !== 'All' && <span className="text-purple-400 font-semibold">{genre}</span>}
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-xs text-slate-400">Searching CineWave collection...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="py-24 text-center bg-[#12121a]/50 rounded-2xl border border-dashed border-slate-800">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No matching videos found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Try searching for different keywords, clearing filters, or browsing all genres.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
