const Url = require('../models/url');


/**
 * Create a shortened URL
 */
const axios = require('axios');

/**
 * Create a shortened URL using is.gd API
 */
const createShortUrl = async (req, res) => {
  try {
    let { originalUrl } = req.body;

    // Validate URL
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: 'Original URL is required'
      });
    }

    // Call is.gd API
    const response = await axios.get(`https://is.gd/create.php`, {
      params: {
        format: 'json',
        url: originalUrl,
        logstats: 1 // Request analytics support if possible
      }
    });

    if (response.data.errorcode) {
       return res.status(400).json({
        success: false,
        message: response.data.errormessage || 'Error from is.gd service'
      });
    }

    const shortUrl = response.data.shorturl;
    // Extract code from https://is.gd/CODE
    const shortCode = shortUrl.split('/').pop();

    // Save to DB for history/logs (optional, but good for UI)
    const url = new Url({
      originalUrl,
      shortCode,
      totalClicks: 0 // We can't track this easily now
    });
    
    // Attempt to save, might fail if code exists, but is.gd codes are unique globally
    try {
      await url.save();
    } catch (dbError) {
      console.log('Error saving to DB (might be duplicate):', dbError.message);
      // Continue anyway, we have the link
    }

    res.status(201).json({
      success: true,
      shortUrl,
      shortCode,
      originalUrl,
      isExternal: true
    });

  } catch (error) {
    console.error('Error creating short URL:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating short URL'
    });
  }
};



/**
 * Get all URLs (optional feature)
 */
const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find()
      .select('originalUrl shortCode totalClicks createdAt expiresAt')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: urls.length,
      urls
    });

  } catch (error) {
    console.error('Error fetching URLs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching URLs'
    });
  }
};

module.exports = {
  createShortUrl,
  getAllUrls
};
