const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
