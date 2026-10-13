const Watchlist = require('../models/Watchlist');
const Video = require('../models/Video');

/**
 * Get user's saved watchlist
 * GET /api/watchlist
 */
async function getWatchlist(req, res) {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id }).populate({
      path: 'videos',
      populate: { path: 'creator', select: 'name email' },
    });

    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user._id, videos: [] });
    }

    return res.status(200).json({
      success: true,
      count: watchlist.videos.length,
      videos: watchlist.videos,
    });
  } catch (error) {
    console.error('[GetWatchlist Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist.',
    });
  }
}

/**
 * Toggle video in/out of watchlist
 * POST /api/watchlist/toggle/:videoId
 */
async function toggleWatchlist(req, res) {
  try {
    const { videoId } = req.params;

    // Verify video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found.',
      });
    }

    let watchlist = await Watchlist.findOne({ user: req.user._id });
    if (!watchlist) {
      watchlist = new Watchlist({ user: req.user._id, videos: [] });
    }

    const videoIndex = watchlist.videos.findIndex(
      (id) => id.toString() === videoId.toString()
    );

    let isSaved = false;
    let message = '';

    if (videoIndex > -1) {
      // Remove
      watchlist.videos.splice(videoIndex, 1);
      isSaved = false;
      message = 'Removed from your Watchlist';
    } else {
      // Add
      watchlist.videos.unshift(videoId);
      isSaved = true;
      message = 'Added to your Watchlist';
    }

    await watchlist.save();

    return res.status(200).json({
      success: true,
      message,
      isSaved,
      count: watchlist.videos.length,
    });
  } catch (error) {
    console.error('[ToggleWatchlist Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update watchlist.',
    });
  }
}

/**
 * Check if a video is in user's watchlist
 * GET /api/watchlist/check/:videoId
 */
async function checkWatchlist(req, res) {
  try {
    const { videoId } = req.params;
    const watchlist = await Watchlist.findOne({ user: req.user._id });

    if (!watchlist) {
      return res.status(200).json({ success: true, isSaved: false });
    }

    const isSaved = watchlist.videos.some(
      (id) => id.toString() === videoId.toString()
    );

    return res.status(200).json({
      success: true,
      isSaved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to check watchlist status.',
    });
  }
}

module.exports = {
  getWatchlist,
  toggleWatchlist,
  checkWatchlist,
};
