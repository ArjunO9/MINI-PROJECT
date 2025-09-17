const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  tokenNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'serving', 'served', 'skipped'],
    default: 'waiting',
  },
  formData: {
    type: mongoose.Schema.Types.Mixed, // To store custom form data
    default: {}
  },
  paymentId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Token', tokenSchema);