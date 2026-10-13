import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import {
  Film,
  Search,
  Bookmark,
  Crown,
  Video,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { user, isLoggedIn, isCreator, isPremium, logout } = useAuth();
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'Watchlist', path: '/watchlist', requiresAuth: true, badge: watchlist.length },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-400 font-sans">
                CINE<span className="text-purple-500 font-black">WAVE</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase -mt-1 font-semibold">
                OTT Streaming
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              if (link.requiresAuth && !isLoggedIn) return null;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-white bg-white/10 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {link.badge > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Creator Studio Link (if creator) */}
            {isLoggedIn && isCreator && (
              <Link
                to="/creator/studio"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/creator')
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-purple-300 hover:text-purple-100 hover:bg-purple-950/40 border border-purple-500/30'
                }`}
              >
                <Video className="w-4 h-4 text-purple-400" />
                <span>Creator Studio</span>
              </Link>
            )}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search movies, shorts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* VIP Status or Upgrade Button */}
            {isLoggedIn ? (
              isPremium ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-yellow-500/20 to-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>VIP ACTIVE</span>
                </div>
              ) : (
                <Link
                  to="/subscription"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>GET VIP PASS</span>
                </Link>
              )
            ) : (
              <Link
                to="/subscription"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold transition-all shadow-md shadow-purple-600/20"
              >
                <Crown className="w-3.5 h-3.5 text-yellow-300" />
                <span>Go VIP</span>
              </Link>
            )}

            {/* Profile Dropdown / Auth Buttons */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#12121a] border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-slate-800/80">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isCreator
                              ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {user?.role}
                        </span>
                        {isPremium && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-600/50">
                            VIP MEMBER
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1 text-sm text-slate-300">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-purple-400" />
                        <span>My Profile & Settings</span>
                      </Link>

                      <Link
                        to="/watchlist"
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-purple-400" />
                        <span>My Watchlist ({watchlist.length})</span>
                      </Link>

                      <Link
                        to="/subscription"
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>VIP Subscription</span>
                      </Link>

                      {isCreator && (
                        <Link
                          to="/creator/studio"
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 hover:text-white transition-colors border-t border-slate-800/60"
                        >
                          <Video className="w-4 h-4 text-pink-400" />
                          <span>Creator Studio</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800/80">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-md shadow-purple-600/30 transition-all hover:scale-105"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-slate-800 mt-3 space-y-2 animate-in slide-in-from-top-3">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              Explore Catalog
            </Link>
            {isLoggedIn && (
              <Link
                to="/watchlist"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10"
              >
                My Watchlist ({watchlist.length})
              </Link>
            )}
            <Link
              to="/subscription"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-white/10"
            >
              VIP Subscription
            </Link>
            {isLoggedIn && isCreator && (
              <Link
                to="/creator/studio"
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-purple-400 hover:bg-white/10"
              >
                🎬 Creator Studio
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
