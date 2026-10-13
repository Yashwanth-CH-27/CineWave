const express = require('express');
const router = express.Router();
const {
  getCreatorVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} = require('../controllers/creatorController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All creator endpoints require logged-in user with 'CREATOR' role
router.use(verifyToken, requireRole('CREATOR'));

router.get('/videos', getCreatorVideos);
router.post('/videos', createVideo);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', deleteVideo);

module.exports = router;
