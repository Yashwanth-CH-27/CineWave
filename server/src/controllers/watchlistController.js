
const Watchlist = require('../models/Watchlist');
const Video = require('../models/Video');
const Groq = require('groq-sdk');

/**
 * Get user's saved watchlist
 * GET /api/watchlist
 */
async function getWatchlist(req, res) {
  try {
    let watchlist = await Watchlist.findOne({
      user: req.user._id,
    }).populate({
      path: 'videos',
      populate: {
        path: 'creator',
        select: 'name email',
      },
    });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: req.user._id,
        videos: [],
      });
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

    let watchlist = await Watchlist.findOne({
      user: req.user._id,
    });

    if (!watchlist) {
      watchlist = new Watchlist({
        user: req.user._id,
        videos: [],
      });
    }

    const videoIndex = watchlist.videos.findIndex(
      (id) => id.toString() === videoId.toString()
    );

    let isSaved = false;
    let message = '';

    if (videoIndex > -1) {
      // Remove video
      watchlist.videos.splice(videoIndex, 1);
      isSaved = false;
      message = 'Removed from your Watchlist';
    } else {
      // Add video
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

    const watchlist = await Watchlist.findOne({
      user: req.user._id,
    });

    if (!watchlist) {
      return res.status(200).json({
        success: true,
        isSaved: false,
      });
    }

    const isSaved = watchlist.videos.some(
      (id) => id.toString() === videoId.toString()
    );

    return res.status(200).json({
      success: true,
      isSaved,
    });
  } catch (error) {
    console.error('[CheckWatchlist Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to check watchlist status.',
    });
  }
}

/**
 * Generate AI insights from user's watchlist
 * GET /api/watchlist/ai-insights
 */
async function getAIInsights(req, res) {
  try {
    // Check API key
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is missing from server .env file.');
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Fetch user's watchlist
    const watchlist = await Watchlist.findOne({
      user: req.user._id,
    }).populate('videos');

    // Minimum 3 videos required
    if (!watchlist || watchlist.videos.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Save at least 3 videos to generate AI insights.',
      });
    }

    // Prepare video information for AI
    const videos = watchlist.videos.map((video) => ({
      title: video.title,
      genre: video.genre,
      description: video.description,
      duration: video.duration,
      isPremium: video.isPremium,
    }));

    // Generate AI insights using Groq
    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',

      messages: [
        {
          role: 'system',
          content: `You are CineWave's AI viewing analyst.

Analyze the user's saved videos and generate personalized watchlist insights.

Only use information present in the supplied video data.
Do not invent viewing history or user behavior.

Keep all responses concise, useful, and personalized.`,
        },
        {
          role: 'user',
          content: JSON.stringify(videos),
        },
      ],

      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'watchlist_insights',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              summary: {
                type: 'string',
              },
              favoriteGenres: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              viewingPattern: {
                type: 'string',
              },
              recommendations: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              funFact: {
                type: 'string',
              },
            },
            required: [
              'summary',
              'favoriteGenres',
              'viewingPattern',
              'recommendations',
              'funFact',
            ],
            additionalProperties: false,
          },
        },
      },

      reasoning_effort: 'low',
      max_completion_tokens: 1500,
    });

    // Extract AI response
    const rawResponse =
      completion.choices[0]?.message?.content;

    if (!rawResponse) {
      throw new Error('Groq returned an empty response.');
    }

    // Parse structured JSON response
    const insights = JSON.parse(rawResponse);

    // Send response to frontend
    return res.status(200).json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error('[AI Watchlist Insights Error]:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to generate AI insights. Please try again.',
    });
  }
}

module.exports = {
  getWatchlist,
  toggleWatchlist,
  checkWatchlist,
  getAIInsights,
};
