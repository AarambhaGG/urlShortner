const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  getAllUrls
} = require('../controllers/urlController');

// API Routes
router.post('/api/shorten', createShortUrl);


module.exports = router;

