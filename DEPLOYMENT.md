# Deployment Guide

Complete guide for deploying the URL Shortener application to various platforms.

## Table of Contents
1. [MongoDB Setup](#mongodb-setup)
2. [Deploy to Railway](#deploy-to-railway)
3. [Deploy to Render](#deploy-to-render)
4. [Deploy to Heroku](#deploy-to-heroku)
5. [Deploy to DigitalOcean](#deploy-to-digitalocean)
6. [Custom VPS Deployment](#custom-vps-deployment)
7. [Post-Deployment Checklist](#post-deployment-checklist)

---

## MongoDB Setup

Before deploying your application, set up a cloud MongoDB database.

### MongoDB Atlas (Recommended - Free Tier Available)

1. **Create Account**:
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**:
   - Click "Build a Database"
   - Select "Shared" (Free tier)
   - Choose cloud provider and region
   - Click "Create Cluster"

3. **Configure Security**:
   - **Database Access**: Create a database user
     - Username: `urlshortener`
     - Password: Generate secure password
     - Role: Read and Write to any database
   
   - **Network Access**: Add IP addresses
     - Click "Add IP Address"
     - Select "Allow Access from Anywhere" (0.0.0.0/0)
     - Or add your server's IP address

4. **Get Connection String**:
   - Click "Connect" on your cluster
   - Select "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `myFirstDatabase` with `url-shortener`

   Example:
   ```
   mongodb+srv://urlshortener:<password>@cluster0.xxxxx.mongodb.net/url-shortener?retryWrites=true&w=majority
   ```

---

## Deploy to Railway

Railway is a modern deployment platform with excellent developer experience.

### Prerequisites
- GitHub account
- Railway account (free tier available)

### Steps

1. **Install Railway CLI** (optional):
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   railway init
   ```

4. **Add MongoDB**:
   - Go to Railway dashboard
   - Click "New" → "Database" → "Add MongoDB"
   - Copy the `MONGO_URL` from the "Connect" tab

5. **Set Environment Variables**:
   In Railway dashboard, go to Variables:
   ```
   MONGODB_URI=mongodb://...  (from MongoDB plugin or Atlas)
   BASE_URL=https://your-app.railway.app
   NODE_ENV=production
   PORT=5000
   ```

6. **Deploy**:
   ```bash
   # Via CLI
   railway up

   # Or connect GitHub repo in Railway dashboard
   # Railway will auto-deploy on push
   ```

7. **Get Deployment URL**:
   - Check Railway dashboard for your deployment URL
   - Update `BASE_URL` environment variable with this URL

### Custom Domain (Optional)
- Go to Settings → Domains
- Add custom domain
- Update DNS records as shown

---

## Deploy to Render

Render offers easy deployments with free tier.

### Prerequisites
- GitHub account
- Render account
- MongoDB Atlas database

### Steps

1. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/url-shortener.git
   git push -u origin main
   ```

2. **Create Web Service**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: url-shortener
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Set Environment Variables**:
   In Environment section, add:
   ```
   MONGODB_URI=mongodb+srv://...  (from Atlas)
   BASE_URL=https://your-app.onrender.com
   NODE_ENV=production
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Get URL from dashboard

5. **Update BASE_URL**:
   - After first deployment, update `BASE_URL` with actual Render URL

### Auto-Deploy
- Render automatically deploys on git push
- Monitor deployments in dashboard

---

## Deploy to Heroku

Heroku is a popular platform-as-a-service.

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku App**:
   ```bash
   heroku create your-url-shortener
   ```

4. **Add MongoDB**:
   ```bash
   # Option 1: Use MongoDB Atlas (recommended)
   # Set MONGODB_URI manually (see step 5)

   # Option 2: Add mLab MongoDB addon (paid)
   heroku addons:create mongolab:sandbox
   ```

5. **Set Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://..."
   heroku config:set BASE_URL="https://your-url-shortener.herokuapp.com"
   heroku config:set NODE_ENV="production"
   ```

6. **Create Procfile**:
   Create a file named `Procfile` (no extension) in root:
   ```
   web: node backend/server.js
   ```

7. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

8. **Open App**:
   ```bash
   heroku open
   ```

### Monitoring
```bash
# View logs
heroku logs --tail

# Check app status
heroku ps
```

---

## Deploy to DigitalOcean App Platform

DigitalOcean offers simple app deployment with good pricing.

### Steps

1. **Create DigitalOcean Account**:
   - Go to [digitalocean.com](https://www.digitalocean.com)
   - Sign up and verify account

2. **Create MongoDB Database**:
   - Use MongoDB Atlas (recommended)
   - Or create DigitalOcean Managed MongoDB

3. **Create App**:
   - Go to Apps → Create App
   - Connect GitHub repository
   - Select repository and branch

4. **Configure App**:
   - **Type**: Web Service
   - **Run Command**: `npm start`
   - **Build Command**: `npm install`
   - **Environment Variables**:
     ```
     MONGODB_URI=mongodb+srv://...
     BASE_URL=https://your-app.ondigitalocean.app
     NODE_ENV=production
     ```

5. **Deploy**:
   - Review and create
   - App will build and deploy

6. **Custom Domain** (Optional):
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records

---

## Custom VPS Deployment

Deploy to any VPS (Ubuntu/Debian example).

### Prerequisites
- VPS with Ubuntu 20.04+ (DigitalOcean, Linode, AWS EC2, etc.)
- Domain name (optional)
- SSH access

### Steps

1. **Connect to VPS**:
   ```bash
   ssh root@your-server-ip
   ```

2. **Update System**:
   ```bash
   apt update && apt upgrade -y
   ```

3. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs
   ```

4. **Install MongoDB** (if running locally):
   ```bash
   # Import MongoDB GPG key
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -

   # Add MongoDB repository
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

   # Install MongoDB
   apt update
   apt install -y mongodb-org

   # Start MongoDB
   systemctl start mongod
   systemctl enable mongod
   ```

5. **Install PM2** (Process Manager):
   ```bash
   npm install -g pm2
   ```

6. **Clone Repository**:
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

7. **Install Dependencies**:
   ```bash
   npm install
   ```

8. **Create Environment File**:
   ```bash
   nano .env
   ```
   Add:
   ```
   MONGODB_URI=mongodb://localhost:27017/url-shortener
   BASE_URL=http://your-domain.com
   PORT=5000
   NODE_ENV=production
   ```

9. **Start Application with PM2**:
   ```bash
   pm2 start backend/server.js --name url-shortener
   pm2 save
   pm2 startup
   ```

10. **Install Nginx**:
    ```bash
    apt install -y nginx
    ```

11. **Configure Nginx**:
    ```bash
    nano /etc/nginx/sites-available/url-shortener
    ```
    Add:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        location / {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

12. **Enable Site**:
    ```bash
    ln -s /etc/nginx/sites-available/url-shortener /etc/nginx/sites-enabled/
    nginx -t
    systemctl restart nginx
    ```

13. **Install SSL Certificate** (Let's Encrypt):
    ```bash
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d your-domain.com -d www.your-domain.com
    ```

14. **Configure Firewall**:
    ```bash
    ufw allow 'Nginx Full'
    ufw allow OpenSSH
    ufw enable
    ```

### Maintenance Commands
```bash
# View logs
pm2 logs url-shortener

# Restart app
pm2 restart url-shortener

# Stop app
pm2 stop url-shortener

# Monitor
pm2 monit
```

---

## Post-Deployment Checklist

After deploying to any platform:

### 1. Verify Environment Variables
- [ ] `MONGODB_URI` is correct
- [ ] `BASE_URL` matches deployment URL
- [ ] `NODE_ENV` is set to `production`

### 2. Test Endpoints
```bash
# Replace with your deployment URL
BASE=https://your-app.com

# Health check
curl $BASE/health

# Create short URL
curl -X POST $BASE/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://example.com"}'

# Test redirect (copy shortCode from above)
curl -I $BASE/abc123

# Get analytics
curl $BASE/api/analytics/abc123
```

### 3. Security Checks
- [ ] HTTPS is enabled
- [ ] MongoDB connection is secure
- [ ] Environment variables are not exposed
- [ ] CORS is configured properly
- [ ] Rate limiting is implemented (optional but recommended)

### 4. Performance Optimization
- [ ] Enable gzip compression
- [ ] Add caching headers
- [ ] Monitor response times
- [ ] Set up database indexes

### 5. Monitoring Setup
- [ ] Set up error logging (e.g., Sentry)
- [ ] Configure uptime monitoring (e.g., UptimeRobot)
- [ ] Set up analytics (e.g., Google Analytics)
- [ ] Monitor server resources

### 6. Backup Strategy
- [ ] Enable MongoDB automated backups
- [ ] Export important URLs regularly
- [ ] Document recovery procedures

---

## Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs url-shortener  # VPS
heroku logs --tail      # Heroku
# Or check platform-specific logs

# Common issues:
# - Missing environment variables
# - MongoDB connection failed
# - Port already in use
# - Missing dependencies
```

### MongoDB Connection Failed
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions
- Test connection string locally

### 502 Bad Gateway (Nginx)
```bash
# Check if app is running
pm2 status

# Check Nginx config
nginx -t

# View Nginx logs
tail -f /var/log/nginx/error.log
```

---

## Additional Resources

- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

---

**Remember**: Always test in a staging environment before deploying to production!

