# API Documentation

Complete API reference for the URL Shortener application.

## Base URL

```
Development: http://localhost:5000
Production: https://your-domain.com
```

## Endpoints

### 1. Create Short URL

Create a new shortened URL.

**Endpoint**: `POST /api/shorten`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "originalUrl": "https://example.com/very-long-url",
  "customCode": "my-custom-link",    // Optional
  "expiresIn": 30                     // Optional (days)
}
```

**Field Descriptions**:
- `originalUrl` (required): The long URL to shorten. Must be a valid HTTP/HTTPS URL.
- `customCode` (optional): Custom short code (3-20 alphanumeric characters, hyphens, or underscores).
- `expiresIn` (optional): Number of days until the URL expires.

**Success Response** (201 Created):
```json
{
  "success": true,
  "shortUrl": "http://localhost:5000/my-custom-link",
  "shortCode": "my-custom-link",
  "originalUrl": "https://example.com/very-long-url",
  "expiresAt": "2025-01-26T12:00:00.000Z"  // null if no expiration
}
```

**Error Responses**:

*400 Bad Request* - Missing or invalid URL:
```json
{
  "success": false,
  "message": "Original URL is required"
}
```

*400 Bad Request* - Invalid URL format:
```json
{
  "success": false,
  "message": "Invalid URL format"
}
```

*400 Bad Request* - Invalid custom code:
```json
{
  "success": false,
  "message": "Invalid custom code. Use 3-20 alphanumeric characters, hyphens, or underscores."
}
```

*409 Conflict* - Custom code already exists:
```json
{
  "success": false,
  "message": "Custom code already exists. Please choose a different one."
}
```

*500 Internal Server Error*:
```json
{
  "success": false,
  "message": "Internal server error"
}
```

**Example curl Request**:
```bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com/very-long-url",
    "customCode": "my-link",
    "expiresIn": 30
  }'
```

---

### 2. Redirect to Original URL

Redirect from short URL to original URL. This endpoint also tracks analytics.

**Endpoint**: `GET /:shortCode`

**Parameters**:
- `shortCode`: The short code identifier

**Success Response**: 
- HTTP 302 Redirect to original URL
- Analytics are tracked automatically

**Error Responses**:

*404 Not Found* - URL doesn't exist (returns HTML page)

*410 Gone* - URL has expired (returns HTML page)

*500 Internal Server Error* (returns HTML page)

**Analytics Tracked**:
- IP address
- Geographic location (country, city)
- Device type (mobile, desktop, tablet)
- Browser name
- Operating system
- Referrer URL
- Timestamp

**Example**:
```bash
# Browser or curl
http://localhost:5000/abc123

# This will redirect to the original URL and track analytics
```

---

### 3. Get Analytics

Retrieve comprehensive analytics for a shortened URL.

**Endpoint**: `GET /api/analytics/:shortCode`

**Parameters**:
- `shortCode`: The short code identifier

**Success Response** (200 OK):
```json
{
  "success": true,
  "originalUrl": "https://example.com/very-long-url",
  "shortCode": "abc123",
  "totalClicks": 150,
  "createdAt": "2024-12-27T12:00:00.000Z",
  "expiresAt": null,
  "clicksByCountry": {
    "US": 75,
    "UK": 40,
    "CA": 20,
    "Unknown": 15
  },
  "clicksByDevice": {
    "desktop": 90,
    "mobile": 50,
    "tablet": 10
  },
  "clicksByBrowser": {
    "Chrome": 80,
    "Firefox": 40,
    "Safari": 20,
    "Edge": 10
  },
  "clicksOverTime": [
    {
      "date": "2024-12-25",
      "count": 30
    },
    {
      "date": "2024-12-26",
      "count": 50
    },
    {
      "date": "2024-12-27",
      "count": 70
    }
  ],
  "recentClicks": [
    {
      "timestamp": "2024-12-27T15:30:00.000Z",
      "country": "US",
      "city": "New York",
      "device": "mobile",
      "browser": "Chrome",
      "os": "iOS",
      "referer": "https://google.com"
    },
    // ... more clicks (last 10)
  ]
}
```

**Field Descriptions**:
- `totalClicks`: Total number of clicks
- `clicksByCountry`: Click count grouped by country
- `clicksByDevice`: Click count grouped by device type
- `clicksByBrowser`: Click count grouped by browser
- `clicksOverTime`: Daily click counts sorted by date
- `recentClicks`: Last 10 clicks with full details

**Error Responses**:

*404 Not Found*:
```json
{
  "success": false,
  "message": "URL not found"
}
```

*500 Internal Server Error*:
```json
{
  "success": false,
  "message": "Internal server error"
}
```

**Example curl Request**:
```bash
curl http://localhost:5000/api/analytics/abc123
```

---

### 4. Get All URLs

Retrieve a list of all shortened URLs (limited to 100 most recent).

**Endpoint**: `GET /api/urls`

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 10,
  "urls": [
    {
      "originalUrl": "https://example.com/page1",
      "shortCode": "abc123",
      "shortUrl": "http://localhost:5000/abc123",
      "totalClicks": 42,
      "createdAt": "2024-12-27T12:00:00.000Z",
      "expiresAt": null
    },
    {
      "originalUrl": "https://example.com/page2",
      "shortCode": "xyz789",
      "shortUrl": "http://localhost:5000/xyz789",
      "totalClicks": 18,
      "createdAt": "2024-12-26T10:30:00.000Z",
      "expiresAt": "2025-01-26T10:30:00.000Z"
    }
    // ... more URLs
  ]
}
```

**Field Descriptions**:
- `count`: Number of URLs returned
- `urls`: Array of URL objects sorted by creation date (newest first)

**Error Responses**:

*500 Internal Server Error*:
```json
{
  "success": false,
  "message": "Internal server error"
}
```

**Example curl Request**:
```bash
curl http://localhost:5000/api/urls
```

---

### 5. Health Check

Check the health status of the application.

**Endpoint**: `GET /health`

**Success Response** (200 OK):
```json
{
  "status": "OK",
  "timestamp": "2024-12-27T12:00:00.000Z",
  "mongodb": "connected"
}
```

**Field Descriptions**:
- `status`: Overall application status
- `timestamp`: Current server time
- `mongodb`: Database connection status ("connected" or "disconnected")

**Example curl Request**:
```bash
curl http://localhost:5000/health
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider adding rate limiting with `express-rate-limit`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Authentication

Currently, the API is open and does not require authentication. For production use with sensitive data, consider implementing:

- JWT authentication
- API keys
- OAuth 2.0

## CORS

The API allows cross-origin requests from all domains. For production, configure CORS to allow only specific domains:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP status codes used:
- `200` - Success
- `201` - Created
- `302` - Redirect
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `410` - Gone (expired)
- `500` - Internal Server Error

## Data Validation

### URL Validation
- Must be a valid HTTP or HTTPS URL
- Automatically adds `https://` if no protocol specified
- Validated using URL constructor and regex pattern

### Custom Code Validation
- Length: 3-20 characters
- Allowed characters: letters, numbers, hyphens, underscores
- Must be unique
- Case-sensitive

### Expiration Validation
- Must be a positive integer
- Represents number of days from creation
- Optional field

## Analytics Details

### IP Address Detection
The system uses the following methods to detect the user's IP address (in order):
1. `x-forwarded-for` header (for proxied requests)
2. `remoteAddress` from connection
3. `remoteAddress` from socket
4. Express `req.ip`

### Geolocation
- Uses `geoip-lite` library
- Provides country and city based on IP address
- Shows "Unknown" for localhost or unresolvable IPs
- Requires deployment to get real geographic data

### User Agent Parsing
- Uses `ua-parser-js` library
- Extracts:
  - Device type (mobile, tablet, desktop)
  - Browser name and version
  - Operating system name

### Device Type Logic
- If `device.type` is undefined → "desktop"
- Possible values: "mobile", "tablet", "desktop"

## Response Times

Typical response times (on localhost):
- `POST /api/shorten`: 50-100ms
- `GET /:shortCode`: 30-50ms (redirect)
- `GET /api/analytics/:shortCode`: 100-200ms (depends on click count)
- `GET /api/urls`: 50-150ms (depends on total URLs)

## Best Practices

1. **Always validate user input** before sending to API
2. **Handle errors gracefully** in your client application
3. **Use HTTPS** in production for security
4. **Implement rate limiting** to prevent abuse
5. **Monitor performance** and optimize database queries
6. **Add indexes** to frequently queried fields
7. **Implement caching** for frequently accessed analytics
8. **Log errors** for debugging and monitoring

## Testing with Postman

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "URL Shortener API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Short URL",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"originalUrl\":\"https://example.com\",\"customCode\":\"test\"}"
        },
        "url": "{{base_url}}/api/shorten"
      }
    },
    {
      "name": "Get Analytics",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/analytics/test"
      }
    },
    {
      "name": "Get All URLs",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/urls"
      }
    },
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    }
  ]
}
```

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review error messages in console

