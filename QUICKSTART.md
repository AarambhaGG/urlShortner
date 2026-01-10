# Quick Start Guide

Get up and running with the URL Shortener in 5 minutes!

## Prerequisites

- ✅ Node.js installed (v14+)
- ✅ MongoDB installed OR MongoDB Atlas account

## Quick Setup (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/url-shortener
BASE_URL=http://localhost:5000
PORT=5000
NODE_ENV=development
```

**Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/url-shortener?retryWrites=true&w=majority
```

### Step 3: Start the Server
```bash
npm start
```

**For development with auto-reload:**
```bash
npm run dev
```

## Access the Application

Open your browser: **http://localhost:5000**

## Quick Test

### Test via Dashboard
1. Open http://localhost:5000
2. Enter a URL: `https://www.google.com`
3. Click "Shorten URL"
4. Click the copy button
5. Open the short URL in a new tab
6. View analytics by clicking the chart icon

### Test via API
```bash
# Create short URL
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://www.example.com"}'

# Response:
# {
#   "success": true,
#   "shortUrl": "http://localhost:5000/abc123d",
#   "shortCode": "abc123d"
# }

# Test redirect
curl -I http://localhost:5000/abc123d

# Get analytics
curl http://localhost:5000/api/analytics/abc123d
```

## Common Issues

### MongoDB Not Connected?

**Local MongoDB:**
```bash
# Start MongoDB
# macOS: brew services start mongodb-community
# Windows: net start MongoDB
# Linux: sudo systemctl start mongod
```

**MongoDB Atlas:**
- Verify connection string in `.env`
- Check Network Access (whitelist your IP)
- Verify database user credentials

### Port Already in Use?

Change port in `.env`:
```env
PORT=3000
```

Or kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

## Next Steps

✅ **You're all set!** Now you can:

1. **Customize**: Modify the frontend in `public/index.html`
2. **Extend**: Add features in `backend/controllers/urlController.js`
3. **Deploy**: Follow [DEPLOYMENT.md](DEPLOYMENT.md) to go live
4. **Learn**: Read [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details

## File Structure Overview

```
url-shortener/
├── backend/
│   ├── models/url.js          # Database schema
│   ├── controllers/           # Business logic
│   ├── routes/                # API endpoints
│   ├── utils/                 # Helper functions
│   └── server.js              # Main server
├── public/
│   └── index.html             # Frontend dashboard
├── .env                       # Environment config (create this)
├── package.json               # Dependencies
└── README.md                  # Full documentation
```

## Available Scripts

```bash
npm start        # Start server
npm run dev      # Start with auto-reload (nodemon)
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | Required |
| `PORT` | Server port | `5000` |
| `BASE_URL` | Base URL for short links | `http://localhost:5000` |
| `NODE_ENV` | Environment mode | `development` |

## Features at a Glance

✨ **URL Shortening**
- Generate short codes automatically
- Create custom short codes
- Set expiration dates

📊 **Analytics**
- Track clicks with geolocation
- Device and browser detection
- Interactive charts and graphs

🎨 **Beautiful Dashboard**
- Responsive design
- Real-time updates
- Copy to clipboard

## Support

📖 **Documentation**:
- [Complete Setup Guide](SETUP.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Main README](README.md)

💬 **Need Help?**
- Check error messages in terminal
- Verify MongoDB is running
- Review environment variables
- Check the documentation files

---

**Ready to shorten some URLs? 🚀**

Visit http://localhost:5000 and start tracking!

