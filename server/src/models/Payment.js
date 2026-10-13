const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      trim: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      trim: true,
    },
    razorpaySignature: {
      type: String,
      default: null,
      trim: true,
    },
    amount: {
      type: Number,
      required: true, // In paise (e.g. 19900 = 199 INR)
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'successful', 'failed'],
      default: 'created',
    },
    plan: {
      type: String,
      default: 'Premium All-Access Monthly',
    },
    subscriptionDays: {
      type: Number,
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ user: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
