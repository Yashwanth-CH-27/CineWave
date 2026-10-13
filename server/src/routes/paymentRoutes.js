const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  getPaymentHistory,
} = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/status', getSubscriptionStatus);
router.get('/history', getPaymentHistory);

module.exports = router;
