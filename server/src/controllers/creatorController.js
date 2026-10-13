const Video = require('../models/Video');

/**
 * Get all videos created by the currently authenticated creator
 * GET /api/creator/videos
 */
async function getCreatorVideos(req, res) {
  try {
    const creatorId = req.user._id;

    const videos = await Video.find({ creator: creatorId }).sort({ createdAt: -1 });

    // Calculate quick stats
    const totalVideos = videos.length;
    const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
    const premiumVideos = videos.filter((v) => v.isPremium).length;
    const freeVideos = totalVideos - premiumVideos;

    return res.status(200).json({
      success: true,
      stats: {
        totalVideos,
        totalViews,
        premiumVideos,
        freeVideos,
      },
      videos,
    });
  } catch (error) {
    console.error('[GetCreatorVideos Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve creator videos.',
    });
  }
}

/**
 * Add a new video
 * POST /api/creator/videos
 */
async function createVideo(req, res) {
  try {
    const {
      title,
      description,
      genre,
      thumbnailUrl,
      videoUrl,
      isPremium,
      duration,
      featured,
    } = req.body;

    // Validation
    if (!title || !description || !genre || !thumbnailUrl || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (title, description, genre, thumbnail, video URL).',
      });
    }

    const newVideo = await Video.create({
      title: title.trim(),
      description: description.trim(),
      genre,
      thumbnailUrl: thumbnailUrl.trim(),
      videoUrl: videoUrl.trim(),
      creator: req.user._id,
      isPremium: Boolean(isPremium),
      duration: duration || '10m',
      featured: Boolean(featured),
      views: 0,
    });

    const populatedVideo = await Video.findById(newVideo._id).populate('creator', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Video published successfully!',
      video: populatedVideo,
    });
  } catch (error) {
    console.error('[CreateVideo Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create video.',
    });
  }
}

/**
 * Update an existing video
 * PUT /api/creator/videos/:id
 * Enforces ownership check: Creator can only edit their own videos!
 */
async function updateVideo(req, res) {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found.',
      });
    }

    // Ownership check
    if (video.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit videos you created.',
      });
    }

    const {
      title,
      description,
      genre,
      thumbnailUrl,
      videoUrl,
      isPremium,
      duration,
      featured,
    } = req.body;

    if (title) video.title = title.trim();
    if (description) video.description = description.trim();
    if (genre) video.genre = genre;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl.trim();
    if (videoUrl) video.videoUrl = videoUrl.trim();
    if (typeof isPremium !== 'undefined') video.isPremium = Boolean(isPremium);
    if (duration) video.duration = duration.trim();
    if (typeof featured !== 'undefined') video.featured = Boolean(featured);

    await video.save();
    const updated = await Video.findById(id).populate('creator', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Video updated successfully!',
      video: updated,
    });
  } catch (error) {
    console.error('[UpdateVideo Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update video.',
    });
  }
}

/**
 * Delete a creator's video
 * DELETE /api/creator/videos/:id
 * Enforces ownership check: Creator can only delete their own videos!
 */
async function deleteVideo(req, res) {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found.',
      });
    }

    // Ownership check
    if (video.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete videos you created.',
      });
    }

    await Video.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Video deleted successfully.',
      id,
    });
  } catch (error) {
    console.error('[DeleteVideo Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete video.',
    });
  }
}

module.exports = {
  getCreatorVideos,
  createVideo,
  updateVideo,
  deleteVideo,
};
