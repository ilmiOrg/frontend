# Production Deployment Guide - ilmi.live

## 🌐 Docker-Based Deployment

Since your app is containerized with Docker, the deployment process is different from traditional nginx setups.

## 📋 Prerequisites

1. **Server Requirements**:
   - Ubuntu/Debian server with root/sudo access
   - Docker and Docker Compose installed
   - Domain `ilmi.live` pointing to your server's IP address

2. **DNS Configuration** (Already done ✅):
   - A record: `ilmi.live` → Your server IP
   - A record: `www.ilmi.live` → Your server IP

## 🚀 Deployment Steps

### Step 1: Install Docker on Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
```

### Step 2: Transfer Your Project to Server

```bash
# On your local machine, from the project directory
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /home/manu/Desktop/quad-front/ \
  user@your-server-ip:/home/user/quad-front/

# Or use git (recommended)
# On server:
git clone https://github.com/your-repo/quad-front.git
cd quad-front
```

### Step 3: Update docker-compose.yml for Production

On your server, update the port mapping in `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: quad-frontend
    ports:
      - "80:80"  # Changed from 3000:80 to 80:80 for production
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - quad-network

networks:
  quad-network:
    driver: bridge
```

### Step 4: Build and Run on Server

```bash
# Navigate to project directory
cd /home/user/quad-front

# Build and start the container
sudo docker-compose up -d --build

# Check if it's running
sudo docker-compose ps

# View logs
sudo docker-compose logs -f frontend
```

### Step 5: Test Your Site

Visit `http://ilmi.live` in your browser. You should see your React app!

## 🔒 Step 6: Add SSL/HTTPS with Certbot

### Option A: Using Certbot with Reverse Proxy (Recommended)

Install nginx on the host server as a reverse proxy:

```bash
# Install nginx and certbot
sudo apt install nginx certbot python3-certbot-nginx -y

# Create nginx config for reverse proxy
sudo nano /etc/nginx/sites-available/ilmi.live
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name ilmi.live www.ilmi.live;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and get SSL:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/ilmi.live /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d ilmi.live -d www.ilmi.live
```

### Option B: SSL Inside Docker (Alternative)

Update your `docker-compose.yml` to expose both ports:

```yaml
ports:
  - "80:80"
  - "443:443"
volumes:
  - ./ssl:/etc/nginx/ssl
```

Then use Certbot in standalone mode and copy certificates to the `ssl` folder.

## 🔄 Updating Your Application

When you make changes to your code:

```bash
# On your local machine, push to git
git add .
git commit -m "Update frontend"
git push

# On server, pull and rebuild
cd /home/user/quad-front
git pull
sudo docker-compose up -d --build
```

## 🛠️ Troubleshooting

### Port 80 Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80

# If it's nginx, stop it
sudo systemctl stop nginx

# Or use a different port in docker-compose.yml and set up nginx as reverse proxy
```

### Container Not Starting

```bash
# Check logs
sudo docker-compose logs frontend

# Rebuild from scratch
sudo docker-compose down
sudo docker-compose up -d --build
```

### DNS Not Working

```bash
# Check DNS propagation
dig ilmi.live
nslookup ilmi.live

# Verify your server's public IP
curl ifconfig.me
```

## 📊 Monitoring

```bash
# View container status
sudo docker-compose ps

# View logs
sudo docker-compose logs -f frontend

# View resource usage
sudo docker stats quad-frontend

# Restart container
sudo docker-compose restart frontend
```

## 🔐 Security Checklist

- ✅ SSL/HTTPS enabled
- ✅ Firewall configured (UFW)
- ✅ Regular updates scheduled
- ✅ Docker containers auto-restart
- ✅ Security headers in nginx.conf

```bash
# Configure firewall
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

## 📝 Current Configuration

- **Domain**: ilmi.live, www.ilmi.live
- **Container**: quad-frontend
- **Port**: 80 (production) or 3000 (development)
- **Auto-restart**: Enabled
- **Health checks**: Enabled

Your nginx.conf already includes:
- ✅ Gzip compression
- ✅ Security headers
- ✅ Static asset caching
- ✅ React Router support
