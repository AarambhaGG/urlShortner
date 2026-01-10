const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String,
  country: String,
  city: String,
  device: String,
  browser: String,
  os: String,
  referer: String
});

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  clicks: [clickSchema],
  totalClicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  }
});

// Index for faster queries
urlSchema.index({ shortCode: 1 });
urlSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Url', urlSchema);
