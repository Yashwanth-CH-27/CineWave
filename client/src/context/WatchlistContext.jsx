import React, { createContext, useContext, useState, useEffect } from 'react';
import { watchlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext(null);

export function WatchlistProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      loadWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [isLoggedIn]);

  async function loadWatchlist() {
    setLoading(true);
    try {
      const res = await watchlistAPI.getWatchlist();
      if (res.data.success && Array.isArray(res.data.videos)) {
        setWatchlist(res.data.videos);
      }
    } catch (err) {
      console.warn('Could not load watchlist:', err.message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleWatchlist(video) {
    if (!isLoggedIn) {
      return { success: false, requireLogin: true };
    }

    try {
      const videoId = video._id || video;
      const res = await watchlistAPI.toggle(videoId);
      if (res.data.success) {
        if (res.data.isSaved) {
          setWatchlist((prev) => [video, ...prev.filter((v) => (v._id || v) !== videoId)]);
        } else {
          setWatchlist((prev) => prev.filter((v) => (v._id || v) !== videoId));
        }
        return { success: true, isSaved: res.data.isSaved, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  function isSaved(videoId) {
    if (!videoId) return false;
    return watchlist.some((v) => (v._id || v) === videoId);
  }

  const value = {
    watchlist,
    loading,
    toggleWatchlist,
    isSaved,
    refreshWatchlist: loadWatchlist,
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
