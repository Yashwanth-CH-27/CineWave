import React, { useState, useEffect } from 'react';
import { creatorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Video,
  Plus,
  Eye,
  Film,
  Crown,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Sparkles,
  BarChart3,
} from 'lucide-react';

const GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Thriller',
  'Animation',
  'Short Films',
  'Sci-Fi',
  'Documentary',
];

export default function CreatorStudioPage() {
  const { user } = useAuth();

  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    premiumVideos: 0,
    freeVideos: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: 'Drama',
    thumbnailUrl: '',
    videoUrl: '',
    isPremium: false,
    duration: '10m',
    featured: false,
  });

  useEffect(() => {
    loadCreatorContent();
  }, []);

  async function loadCreatorContent() {
    setLoading(true);
    try {
      const res = await creatorAPI.getVideos();
      if (res.data.success) {
        setVideos(res.data.videos || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load creator videos:', err);
    } finally {
      setLoading(false);
    }
  }

  const SAMPLE_URLS = [
    'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    'https://vjs.zencdn.net/v/oceans.mp4',
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  ];

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      genre: 'Action',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      videoUrl: SAMPLE_URLS[0],
      isPremium: false,
      duration: '12m',
      featured: false,
    });
    setFeedback({ message: '', type: '' });
    setIsModalOpen(true);
  };


  const openEditModal = (vid) => {
    setIsEditing(true);
    setEditingId(vid._id);
    setFormData({
      title: vid.title,
      description: vid.description,
      genre: vid.genre,
      thumbnailUrl: vid.thumbnailUrl,
      videoUrl: vid.videoUrl,
      isPremium: Boolean(vid.isPremium),
      duration: vid.duration || '10m',
      featured: Boolean(vid.featured),
    });
    setFeedback({ message: '', type: '' });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ message: '', type: '' });

    try {
      if (isEditing) {
        const res = await creatorAPI.updateVideo(editingId, formData);
        if (res.data.success) {
          setFeedback({ message: 'Video updated successfully! ✅', type: 'success' });
          await loadCreatorContent();
          setTimeout(() => setIsModalOpen(false), 900);
        }
      } else {
        const res = await creatorAPI.createVideo(formData);
        if (res.data.success) {
          setFeedback({ message: 'Video published to CineWave! 🎬', type: 'success' });
          await loadCreatorContent();
          setTimeout(() => setIsModalOpen(false), 900);
        }
      }
    } catch (err) {
      setFeedback({
        message: err.response?.data?.message || 'Operation failed. Check all fields.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await creatorAPI.deleteVideo(id);
      if (res.data.success) {
        setVideos((prev) => prev.filter((v) => v._id !== id));
        setStats((prev) => ({
          ...prev,
          totalVideos: Math.max(0, prev.totalVideos - 1),
        }));
        setDeleteId(null);
      }
    } catch (err) {
      alert('Failed to delete video: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Creator Studio
              </h1>
              <p className="text-xs text-slate-400">
                Welcome back, <strong className="text-purple-300">{user?.name}</strong>. Manage your productions and audience metrics.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Video</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Releases</span>
            <Video className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.totalVideos}</div>
          <p className="text-[10px] text-slate-400 mt-1">Published titles</p>
        </div>

        <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Stream Views</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.totalViews?.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Cumulative audience plays</p>
        </div>

        <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">VIP Premium</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">{stats.premiumVideos}</div>
          <p className="text-[10px] text-slate-400 mt-1">Exclusive paywalled</p>
        </div>

        <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Free to Stream</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.freeVideos}</div>
          <p className="text-[10px] text-slate-400 mt-1">Public access</p>
        </div>
      </div>

      {/* Videos List Table */}
      <div className="bg-[#12121a] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-4 h-4 text-purple-400" />
            <span>Your Content Catalog</span>
          </h2>
          <span className="text-xs text-slate-400">{videos.length} videos</span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            <p className="text-xs text-slate-400">Loading catalog...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="py-20 text-center p-6">
            <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No videos published yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Start building your CineWave showcase by adding your first movie or short film.
            </p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
            >
              Upload First Video
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800/80">
                <tr>
                  <th className="py-3.5 px-4">Title & Media</th>
                  <th className="py-3.5 px-4">Genre</th>
                  <th className="py-3.5 px-4">Tier</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">Date Added</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {videos.map((vid) => (
                  <tr key={vid._id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-14 h-9 object-cover rounded-md bg-slate-900 border border-slate-800 shrink-0"
                        />
                        <div className="max-w-xs">
                          <p className="font-semibold text-white truncate">{vid.title}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{vid.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Genre */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-medium">
                        {vid.genre}
                      </span>
                    </td>

                    {/* Tier */}
                    <td className="py-3 px-4">
                      {vid.isPremium ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                          <Crown className="w-3 h-3" />
                          VIP
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-[10px]">
                          FREE
                        </span>
                      )}
                    </td>

                    {/* Views */}
                    <td className="py-3 px-4 font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {vid.views?.toLocaleString()}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 font-mono text-slate-400">{vid.duration || '10m'}</td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(vid.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(vid)}
                          title="Edit Video"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(vid._id)}
                          title="Delete Video"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#13131f] border border-slate-700 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                  <Film className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {isEditing ? 'Edit Video Details' : 'Publish New Video to CineWave'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Feedback */}
            {feedback.message && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/80 border border-rose-500/40 text-rose-200'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight Cipher: Episode 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Genre & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Genre *</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Duration (e.g. 14m)
                  </label>
                  <input
                    type="text"
                    placeholder="12m"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Poster Thumbnail URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Video URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Video Stream URL (MP4 / YouTube) *</label>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://...mp4  or  https://youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-purple-500 mb-2"
                />

                {/* Sample URL quick-pick */}
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ✅ Quick-pick a free working sample URL:
                  </p>
                  <div className="flex flex-col gap-1">
                    {SAMPLE_URLS.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setFormData({ ...formData, videoUrl: url })}
                        className={`text-left text-[10px] px-2 py-1 rounded-lg truncate transition-colors ${
                          formData.videoUrl === url
                            ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                            : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {url}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1">
                    ⚠️ <span className="text-rose-400 font-semibold">Do NOT use</span> Google Drive, Dropbox web links, or
                    direct <code>commondatastorage.googleapis.com</code> URLs — they block streaming.
                    YouTube links are supported separately.
                  </p>
                </div>
              </div>

              {/* Access Tier Toggle (Free vs VIP) */}

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">VIP Premium Exclusive</span>
                  <span className="text-[11px] text-slate-400">
                    Restricts video playback strictly to active CineWave VIP subscribers
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter a compelling synopsis for viewers..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Publish Content'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#13131f] border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Delete this video?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to remove this video permanently from the CineWave platform?
            </p>
            <div className="flex items-center gap-3 justify-center pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
