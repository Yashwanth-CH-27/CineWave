const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: [
        'Action',
        'Comedy',
        'Drama',
        'Thriller',
        'Animation',
        'Short Films',
        'Sci-Fi',
        'Documentary',
      ],
      default: 'Drama',
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: String,
      default: '10m',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and category filtering
videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({ genre: 1 });
videoSchema.index({ isPremium: 1 });
videoSchema.index({ creator: 1 });

module.exports = mongoose.model('Video', videoSchema);
