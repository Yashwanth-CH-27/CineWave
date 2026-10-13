import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import VideoDetailsPage from './pages/VideoDetailsPage';
import WatchlistPage from './pages/WatchlistPage';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import CreatorStudioPage from './pages/CreatorStudioPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/video/:id" element={<VideoDetailsPage />} />
          <Route path="/watch/:id" element={<VideoDetailsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* User Protected Routes */}
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Creator Only Protected Route */}
          <Route
            path="/creator/studio"
            element={
              <ProtectedRoute requiredRole="CREATOR">
                <CreatorStudioPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
