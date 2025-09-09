const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  tokenNumber: {
    type: Number,
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'serving', 'completed'],
    default: 'waiting',
  },
  estimatedWaitTime: {
    type: Number, // in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Token', TokenSchema);1