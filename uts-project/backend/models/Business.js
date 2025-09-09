const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tier: {
    type: Number,
    default: 1, // 1: Basic, 2: Data Collection, 3: Prepaid
  },
  qrCode: {
    type: String,
  },
  tokenCounter: {
    type: Number,
    default: 0,
  },
  waitTimePerToken: {
    type: Number,
    default: 5, // minutes per token
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Business', BusinessSchema);