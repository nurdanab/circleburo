# Circle Buro Backend - Deployment Guide

## 📋 Overview

This backend replaces Supabase with a self-hosted solution on your NovaCloud server:
- **PostgreSQL** for database
- **Node.js/Express** for REST API
- **Nginx** for reverse proxy and SSL
- **Docker Compose** for easy deployment

---

## 🚀 Quick Start

### 1. Prepare Your Server

```bash
# SSH into your NovaCloud server
ssh user@your-server-ip

# Install Docker and Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

### 2. Clone and Setup

```bash
# Upload the server folder to your server
scp -r ./server user@your-server-ip:/home/user/circle-buro-backend

# SSH into server and navigate to folder
cd /home/user/circle-buro-backend

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### 3. Configure Environment Variables

Edit `.env` file:

```bash
# Database
DB_USER=circle_user
DB_PASSWORD=your_secure_password_123

# Telegram (copy from your current Netlify env)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Admin password (copy from VITE_ADMIN_PASSWORD)
ADMIN_PASSWORD=your_admin_password

# Google Calendar (copy from Netlify)
G_CAL_ID=your_calendar_id@group.calendar.google.com
G_CAL_SERVICE_ACCOUNT_KEY='{"type":"service_account"...}'

# CORS - your frontend URL
CORS_ORIGIN=https://your-domain.com
```

### 4. Deploy

```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Check if everything is running
docker-compose ps
```

---

## 📊 Export Data from Supabase

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project
2. Navigate to **Table Editor** → `leads` table
3. Click **Export** → **CSV**
4. Save the file

### Option 2: Using SQL

```sql
-- In Supabase SQL Editor, run:
COPY (SELECT * FROM leads) TO STDOUT WITH CSV HEADER;
```

### Import Data to New Database

```bash
# Create import.sql file with your data
cat > import.sql << 'EOF'
INSERT INTO leads (name, phone, meeting_date, meeting_time, status, notes, created_at, updated_at)
VALUES
  ('John Doe', '77001234567', '2024-01-15', '10:00', 'confirmed', 'First client', '2024-01-01 12:00:00', '2024-01-01 12:00:00'),
  ('Jane Smith', '77007654321', '2024-01-16', '14:00', 'pending', '', '2024-01-02 15:30:00', '2024-01-02 15:30:00');
EOF

# Import into database
docker exec -i circle-buro-db psql -U circle_user -d circle_buro < import.sql
```

---

## 🔄 Update Frontend

### Step 1: Update API Client

Replace `src/supabaseClient.js` with the new client:

```javascript
// src/apiClient.js
import { apiClient as supabase } from '../server/frontend-client/apiClient.js';
export { supabase };
```

Or copy the file:
```bash
cp server/frontend-client/apiClient.js src/apiClient.js
```

### Step 2: Update Imports

In all files that import Supabase:

**Before:**
```javascript
import { supabase } from './supabaseClient';
```

**After:**
```javascript
import { supabase } from './apiClient';
```

### Step 3: Update Environment Variables

In Netlify (or local `.env`):

```bash
# Replace Supabase URL with your backend URL
VITE_API_URL=http://your-server-ip:3000

# Remove these (no longer needed):
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

### Step 4: Test Locally

```bash
# In your project root
npm run dev

# Check if API calls work
# Visit http://localhost:5173 and test the booking form
```

### Step 5: Deploy to Netlify

```bash
# Build and deploy
npm run build
netlify deploy --prod
```

---

## 🔐 Security

### 1. SSL/HTTPS Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Update nginx/nginx.conf to uncomment HTTPS section
# Restart nginx
docker-compose restart nginx
```

### 2. Firewall Setup

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 3. Database Security

```bash
# Change default passwords in .env
# Restrict PostgreSQL to local connections only (already configured in docker-compose)
```

---

## 📈 Monitoring

### Check Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres

# Backend logs (inside container)
docker exec circle-buro-backend tail -f logs/combined.log
```

### Health Check

```bash
# Check API health
curl http://your-server-ip:3000/health

# Check database
docker exec circle-buro-db psql -U circle_user -d circle_buro -c "SELECT COUNT(*) FROM leads;"
```

---

## 🔄 Backup Strategy

### Automatic Daily Backup

Create a cron job:

```bash
# Create backup script
cat > /home/user/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec circle-buro-db pg_dump -U circle_user circle_buro > /home/user/backups/db_$DATE.sql
# Keep only last 7 days
find /home/user/backups -name "db_*.sql" -mtime +7 -delete
EOF

chmod +x /home/user/backup.sh

# Add to crontab
crontab -e
# Add line:
0 2 * * * /home/user/backup.sh
```

### Manual Backup

```bash
# Backup database
docker exec circle-buro-db pg_dump -U circle_user circle_buro > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i circle-buro-db psql -U circle_user circle_buro < backup_20240101.sql
```

---

## 🛠 Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Database not ready: Wait 30 seconds and try again
# - Port already in use: Change PORT in docker-compose.yml
```

### Database connection errors

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Cannot connect from frontend

```bash
# Check CORS settings
# Make sure CORS_ORIGIN in .env matches your frontend URL

# Check if port 3000 is accessible
curl http://your-server-ip:3000/health

# Check firewall
sudo ufw status
```

---

## 📊 Performance Optimization

### 1. Database Indexing (Already configured in init.sql)

### 2. Connection Pooling (Already configured in server.js)

### 3. Nginx Caching

Uncomment caching section in nginx.conf for static API responses.

---

## 🎯 Migration Checklist

- [ ] Server prepared (Docker installed)
- [ ] Environment variables configured
- [ ] Docker Compose started successfully
- [ ] Database schema created
- [ ] Data exported from Supabase
- [ ] Data imported to new database
- [ ] Frontend updated with new API client
- [ ] Environment variables updated in Netlify
- [ ] Tested locally
- [ ] Deployed to production
- [ ] SSL configured
- [ ] Backup script configured
- [ ] Old Supabase project can be deleted

---

## 💰 Cost Comparison

**Before (Supabase):**
- Free tier or $25/month

**After (Self-hosted):**
- NovaCloud VPS: ~$5-20/month (you already have this)
- All inclusive (DB + Backend + Storage)

**Savings:** $25/month or more!

---

## 📞 Support

If you need help:
1. Check logs: `docker-compose logs -f`
2. Check this README
3. Check server/backend/server.js for API endpoints

---

## 🔄 Updates

To update the backend:

```bash
# Pull new code
cd /home/user/circle-buro-backend
git pull  # if using git

# Rebuild and restart
docker-compose build
docker-compose up -d
```

---

Good luck with your migration! 🚀
