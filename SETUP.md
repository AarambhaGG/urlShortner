# Setup Guide

This guide will help you set up the URL Shortener application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Choose one option:
  - Local MongoDB - [Download](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (Cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- dotenv
- cors
- nanoid
- geoip-lite
- ua-parser-js

### 2. Set Up MongoDB

#### Option A: Local MongoDB

**Windows:**
1. Download MongoDB Community Edition
2. Install using the installer
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

**macOS:**
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier M0)
4. Wait for cluster to deploy (2-3 minutes)
5. Click "Connect" and choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Update the connection string in your `.env` file

Example Atlas connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/url-shortener?retryWrites=true&w=majority
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example below or create manually
touch .env
```

Add the following content to `.env`:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/url-shortener

# Server Configuration
PORT=5000
BASE_URL=http://localhost:5000

# Environment
NODE_ENV=development
```

**Important Notes:**
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- For production, update `BASE_URL` to your production domain
- Never commit `.env` file to version control

### 4. Verify MongoDB Connection

Test if MongoDB is running:

**Local MongoDB:**
```bash
# Connect to MongoDB shell
mongosh

# Or using mongo (older versions)
mongo

# You should see a MongoDB shell prompt
```

**MongoDB Atlas:**
- Your connection string should work if you've whitelisted your IP
- Go to Network Access in Atlas and add your current IP or allow from anywhere (0.0.0.0/0)

### 5. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ Connected to MongoDB successfully
🚀 Server is running on port 5000
📊 Dashboard: http://localhost:5000
🔗 API: http://localhost:5000/api
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

You should see the URL Shortener dashboard.

## Troubleshooting

### MongoDB Connection Issues

**Error: "connect ECONNREFUSED 127.0.0.1:27017"**
- MongoDB is not running
- Start MongoDB service (see Step 2)

**Error: "Authentication failed"**
- Check your MongoDB username and password
- Ensure user has correct permissions

**Error: "Network timeout" (Atlas)**
- Whitelist your IP address in Atlas Network Access
- Check your internet connection
- Verify connection string is correct

### Port Already in Use

**Error: "Port 5000 is already in use"**

**Find and kill the process:**

Windows:
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

macOS/Linux:
```bash
lsof -i :5000
kill -9 <PID>
```

**Or change the port:**
Update `PORT` in `.env` to another port (e.g., 3000, 8000)

### Module Not Found

**Error: "Cannot find module 'express'"**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### CORS Issues

If you get CORS errors:
- Ensure `cors` package is installed
- Check that CORS middleware is configured in `server.js`
- Clear browser cache

## Testing the Setup

### 1. Test Health Endpoint
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-02T10:30:00.000Z",
  "mongodb": "Connected"
}
```

### 2. Test URL Shortening
```bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://www.example.com"}'
```

Expected response:
```json
{
  "success": true,
  "shortUrl": "http://localhost:5000/abc123d",
  "shortCode": "abc123d",
  "originalUrl": "https://www.example.com",
  "expiresAt": null
}
```

### 3. Test Redirect
Visit the short URL in your browser:
```
http://localhost:5000/abc123d
```

You should be redirected to the original URL.

### 4. Test Analytics
```bash
curl http://localhost:5000/api/analytics/abc123d
```

You should see analytics data for the short URL.

## Development Tips

### Using nodemon for Auto-Reload

The project is configured with nodemon for development:
```bash
npm run dev
```

This automatically restarts the server when you make changes.

### Viewing Database

**MongoDB Compass** (GUI for MongoDB):
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using: `mongodb://localhost:27017`
3. View the `url-shortener` database

**MongoDB Shell**:
```bash
mongosh
use url-shortener
db.urls.find()
```

### Environment Variables Quick Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/url-shortener` |
| `PORT` | Server port | `5000` |
| `BASE_URL` | Base URL for short links | `http://localhost:5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## Next Steps

Once your setup is complete:
1. ✅ Create your first short URL via the dashboard
2. ✅ Share the short URL and generate some clicks
3. ✅ View analytics in the dashboard
4. ✅ Test custom short codes
5. ✅ Try setting expiration dates
6. ✅ Review the [API Documentation](API_DOCUMENTATION.md)
7. ✅ Check the [Deployment Guide](DEPLOYMENT.md) for production deployment

## Getting Help

If you encounter issues:
1. Check this setup guide
2. Review error messages carefully
3. Check MongoDB connection
4. Verify environment variables
5. Ensure all dependencies are installed
6. Check the README.md for additional information

---

**Setup successful? Start shortening URLs! 🚀**

