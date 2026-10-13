const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Watchlist = require('../models/Watchlist');
const { sendWelcomeEmail, sendLoginAlertEmail } = require('../config/email');

const JWT_SECRET = process.env.JWT_SECRET || 'cinewave_super_secure_jwt_secret_key_2026_demo';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(userId, role) {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Register a new User or Creator
 * POST /api/auth/signup
 */
async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Role validation: MVP allows USER or CREATOR selection
    const userRole = role && ['USER', 'CREATOR'].includes(role.toUpperCase())
      ? role.toUpperCase()
      : 'USER';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: userRole,
      isPremium: false,
      subscriptionExpiry: null,
    });

    // Initialize an empty watchlist for the user
    await Watchlist.create({
      user: user._id,
      videos: [],
    });

    // Generate JWT
    const token = generateToken(user._id, user.role);

    // Send Welcome Email in background
    sendWelcomeEmail(user).catch((err) =>
      console.warn('[Signup] Non-blocking welcome email error:', err.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
        subscriptionExpiry: user.subscriptionExpiry,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Signup Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during signup.',
    });
  }
}

/**
 * Sign in existing user
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Refresh subscription status if expired
    if (user.isPremium && user.subscriptionExpiry && new Date(user.subscriptionExpiry) <= new Date()) {
      user.isPremium = false;
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Send Login Alert Email in background
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Localhost';
    sendLoginAlertEmail(user, clientIp).catch((err) =>
      console.warn('[Login] Non-blocking login alert error:', err.message)
    );

    return res.status(200).json({
      success: true,
      message: 'Welcome back to CineWave!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.hasActivePremium(),
        subscriptionExpiry: user.subscriptionExpiry,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
}

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const hasActivePremium = user.hasActivePremium();
    if (user.isPremium !== hasActivePremium) {
      user.isPremium = hasActivePremium;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: hasActivePremium,
        subscriptionExpiry: user.subscriptionExpiry,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[GetMe Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile.',
    });
  }
}

/**
 * Update user profile
 * PUT /api/auth/profile
 */
async function updateProfile(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty.',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.name = name.trim();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.hasActivePremium(),
        subscriptionExpiry: user.subscriptionExpiry,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile.',
    });
  }
}

module.exports = {
  signup,
  login,
  getMe,
  updateProfile,
};
