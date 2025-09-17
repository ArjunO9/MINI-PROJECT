const mongoose = require('mongoose');

const formFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'number', 'email'] },
  required: { type: Boolean, default: false }
});

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tier: {
    type: String,
    enum: ['Basic', 'Data Collection', 'Prepaid'],
    default: 'Basic',
  },
  formSchema: [formFieldSchema],
  servicePrice: {
    type: Number,
    default: 0
  },
  qrCode: {
    type: String // Will store the data URL of the QR code
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Business', businessSchema);