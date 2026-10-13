const express = require('express');
const router = express.Router();
const {
  getVideos,
  getFeatured,
  getVideoById,
  incrementViews,
  checkAccess,
  streamProxy,
} = require('../controllers/videoController');
const { optionalAuth, verifyToken } = require('../middleware/auth');

router.get('/stream-proxy', streamProxy);
router.get('/', getVideos);
router.get('/featured', getFeatured);
router.get('/:id', optionalAuth, getVideoById);
router.post('/:id/view', incrementViews);
router.get('/:id/access', optionalAuth, checkAccess);

module.exports = router;
