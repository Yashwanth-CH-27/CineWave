const express = require('express');
const router = express.Router();
const {
  getWatchlist,
  toggleWatchlist,
  checkWatchlist,
} = require('../controllers/watchlistController');
const { verifyToken } = require('../middleware/auth');

// All watchlist routes require authentication
router.use(verifyToken);

router.get('/', getWatchlist);
router.post('/toggle/:videoId', toggleWatchlist);
router.get('/check/:videoId', checkWatchlist);

module.exports = router;
