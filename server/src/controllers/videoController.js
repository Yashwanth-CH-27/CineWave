const Video = require('../models/Video');
const User = require('../models/User');

/**
 * Get all videos with search, genre, and free/premium filtering
 * GET /api/videos
 */
async function getVideos(req, res) {
  try {
    const { search, genre, filter, sort, limit = 50 } = req.query;

    const query = {};

    // Search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Genre filter
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    // Free vs Premium filter
    if (filter === 'free') {
      query.isPremium = false;
    } else if (filter === 'premium') {
      query.isPremium = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default: latest
    if (sort === 'popular') {
      sortOptions = { views: -1 };
    } else if (sort === 'title') {
      sortOptions = { title: 1 };
    }

    const videos = await Video.find(query)
      .populate('creator', 'name email')
      .sort(sortOptions)
      .limit(parseInt(limit, 10));

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    console.error('[GetVideos Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve videos.',
    });
  }
}

/**
 * Get featured videos for the OTT Hero Banner
 * GET /api/videos/featured
 */
async function getFeatured(req, res) {
  try {
    let featuredVideos = await Video.find({ featured: true })
      .populate('creator', 'name email')
      .limit(5);

    // If no explicit featured videos, get the top viewed ones
    if (!featuredVideos || featuredVideos.length === 0) {
      featuredVideos = await Video.find()
        .populate('creator', 'name email')
        .sort({ views: -1 })
        .limit(5);
    }

    return res.status(200).json({
      success: true,
      videos: featuredVideos,
    });
  } catch (error) {
    console.error('[GetFeatured Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured banner videos.',
    });
  }
}

/**
 * Get single video by ID
 * GET /api/videos/:id
 */
async function getVideoById(req, res) {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate('creator', 'name email');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found.',
      });
    }

    // Check if current user has playback access
    let hasAccess = false;
    let accessReason = 'Free content';

    if (!video.isPremium) {
      hasAccess = true;
    } else if (req.user) {
      // Creator owns the video OR user has active premium
      const isOwner = video.creator && video.creator._id.toString() === req.user._id.toString();
      const isUserPremium = req.user.hasActivePremium ? req.user.hasActivePremium() : req.user.isPremium;

      if (isOwner) {
        hasAccess = true;
        accessReason = 'Creator ownership';
      } else if (isUserPremium) {
        hasAccess = true;
        accessReason = 'Active VIP subscription';
      } else {
        hasAccess = false;
        accessReason = 'Requires VIP Premium subscription';
      }
    } else {
      hasAccess = false;
      accessReason = 'Requires sign-in and VIP subscription';
    }

    // Fetch related videos from same genre
    const related = await Video.find({
      genre: video.genre,
      _id: { $ne: video._id },
    })
      .limit(6)
      .populate('creator', 'name');

    return res.status(200).json({
      success: true,
      video,
      hasAccess,
      accessReason,
      related,
    });
  } catch (error) {
    console.error('[GetVideoById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve video details.',
    });
  }
}

/**
 * Increment video view count
 * POST /api/videos/:id/view
 */
async function incrementViews(req, res) {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found.',
      });
    }

    return res.status(200).json({
      success: true,
      views: video.views,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record view.',
    });
  }
}

/**
 * Check if the user has access to a specific video
 * GET /api/videos/:id/access
 */
async function checkAccess(req, res) {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found.',
      });
    }

    if (!video.isPremium) {
      return res.status(200).json({
        success: true,
        hasAccess: true,
        isPremium: false,
        message: 'Free video accessible to all.',
      });
    }

    if (!req.user) {
      return res.status(200).json({
        success: true,
        hasAccess: false,
        isPremium: true,
        message: 'Sign in to access VIP content.',
      });
    }

    const isOwner = video.creator.toString() === req.user._id.toString();
    const hasPremium = req.user.hasActivePremium ? req.user.hasActivePremium() : req.user.isPremium;

    const hasAccess = isOwner || hasPremium;

    return res.status(200).json({
      success: true,
      hasAccess,
      isPremium: true,
      isOwner,
      message: hasAccess ? 'Access granted.' : 'VIP Premium subscription required.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to check access.',
    });
  }
}

/**
 * Universal Stream Proxy — bypasses third-party CORS blocks on MP4/video URLs.
 * Uses axios so HTTP 301/302 redirects are automatically followed.
 * GET /api/videos/stream-proxy?url=...
 */
async function streamProxy(req, res) {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    new URL(videoUrl); // Validate URL format
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const axios = require('axios');

    const proxyRes = await axios({
      method: req.method === 'HEAD' ? 'head' : 'get',
      url: videoUrl,
      responseType: 'stream',
      timeout: 30000,
      maxRedirects: 10, // Follow CDN redirects automatically
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CineWave/1.0',
        ...(req.headers.range ? { Range: req.headers.range } : {}),
      },
      validateStatus: (status) => status < 500, // Don't throw on 4xx
    });

    // CORS headers so browser accepts the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

    // Forward relevant headers from upstream
    const forwardHeaders = ['content-type', 'content-length', 'content-range', 'accept-ranges'];
    forwardHeaders.forEach((h) => {
      if (proxyRes.headers[h]) {
        res.setHeader(h, proxyRes.headers[h]);
      }
    });

    // Default content-type for video if upstream doesn't set it
    if (!proxyRes.headers['content-type']) {
      res.setHeader('content-type', 'video/mp4');
    }

    res.status(proxyRes.status);

    if (req.method === 'HEAD') {
      return res.end();
    }

    proxyRes.data.pipe(res);

    proxyRes.data.on('error', (err) => {
      console.warn('[Stream Proxy] Stream error:', err.message);
    });
  } catch (error) {
    console.error('[Stream Proxy Error]:', error.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Proxy failed: ' + error.message });
    }
  }
}

module.exports = {
  getVideos,
  getFeatured,
  getVideoById,
  incrementViews,
  checkAccess,
  streamProxy,
};
