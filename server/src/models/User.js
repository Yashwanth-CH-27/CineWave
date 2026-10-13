const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please enter a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['USER', 'CREATOR'],
      default: 'USER',
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to check if subscription is actively valid
userSchema.methods.hasActivePremium = function () {
  if (!this.isPremium) return false;
  if (!this.subscriptionExpiry) return false;
  return new Date(this.subscriptionExpiry) > new Date();
};

module.exports = mongoose.model('User', userSchema);
