/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidUrl = (url) => {
  try {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const urlObj = new URL(url);
    
    // Check protocol is http or https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false;
    }
    
    return urlPattern.test(url) || true; // URL constructor validates most cases
  } catch (error) {
    return false;
  }
};

/**
 * Validate custom short code format
 * @param {string} code - Short code to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidShortCode = (code) => {
  // Allow alphanumeric characters, hyphens, and underscores
  // Length between 3 and 20 characters
  const codePattern = /^[a-zA-Z0-9_-]{3,20}$/;
  return codePattern.test(code);
};

/**
 * Sanitize URL to prevent open redirect vulnerabilities
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL
 */
const sanitizeUrl = (url) => {
  let sanitized = url.trim();
  
  // Add protocol if missing
  if (!/^https?:\/\//i.test(sanitized)) {
    sanitized = 'http://' + sanitized;
  }
  
  return sanitized;
};

module.exports = {
  isValidUrl,
  isValidShortCode,
  sanitizeUrl
};
