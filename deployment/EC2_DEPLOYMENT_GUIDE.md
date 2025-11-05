# EC2 Deployment Guide

This guide will help you deploy your Be Smart application to your EC2 instance.

## Prerequisites

1. **EC2 Instance**: Running Ubuntu (t3.micro)
   - Public IP: `52.15.61.144`
   - Public DNS: `ec2-52-15-61-144.us-east-2.compute.amazonaws.com`

2. **Security Group Configuration**: 
   - Ensure port **3000** (or your chosen port) is open for HTTP traffic
   - Ensure port **22** is open for SSH

3. **SSH Access**: 
   - You need SSH key access to your EC2 instance
   - If you don't have a key pair, create one in AWS EC2 console

## Quick Deployment (Automated)

### Option 1: Using the Deployment Script

```bash
# Make the script executable
chmod +x deploy_to_ec2.sh

# Deploy (replace with your EC2 user and host)
./deploy_to_ec2.sh ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com
```

## Manual Deployment

### Step 1: Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com
```

### Step 2: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### Step 3: Prepare Application Directory

```bash
# Create application directory
mkdir -p /home/ubuntu/be-smart-app
cd /home/ubuntu/be-smart-app
```

### Step 4: Transfer Your Application

From your local machine:

```bash
# Build React app first
cd /path/to/BE_SMART_HACKATHON
bash ./scripts/build_react.sh

# Create a deployment package
tar -czf deploy.tar.gz \
  server_side/ \
  be-smart/dist/ \
  --exclude='node_modules' \
  --exclude='*.log'

# Transfer to EC2
scp -i your-key.pem deploy.tar.gz ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com:/tmp/

# On EC2, extract
ssh -i your-key.pem ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com
cd /home/ubuntu/be-smart-app
tar -xzf /tmp/deploy.tar.gz
```

### Step 5: Setup Environment Variables

```bash
# Create production .env file
cd /home/ubuntu/be-smart-app
cat > .env.production << 'EOF'
# Database Configuration
DB_HOST=be-smart-db.cn8ygsogocy8.us-east-2.rds.amazonaws.com
DB_PORT=3306
DB_NAME=besmart
DB_USER=admin
DB_PASSWORD=be-smart-password
DB_REGION=us-east-2
DB_SSL=true
DB_USE_IAM_AUTH=false
DB_CONNECTION_LIMIT=20

# Server Configuration
PORT=3000
BASE_URL=http://ec2-52-15-61-144.us-east-2.compute.amazonaws.com:3000
EOF
```

### Step 6: Install Dependencies

```bash
cd /home/ubuntu/be-smart-app
npm install --production
```

### Step 7: Setup React Build

```bash
# Create the directory structure for React build
mkdir -p /home/ubuntu/be-smart/dist
cp -r /tmp/deploy.tar.gz extracted content to /home/ubuntu/be-smart/dist/
# OR if you extracted in the right place:
# The be-smart/dist should already be in the right location relative to server_side
```

Actually, ensure the structure is:
```
/home/ubuntu/be-smart-app/         # server_side files
/home/ubuntu/be-smart/dist/        # React build files
```

### Step 8: Configure PM2

```bash
cd /home/ubuntu/be-smart-app

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'be-smart-server',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
EOF

mkdir -p logs
```

### Step 9: Start the Application

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Follow the instructions it prints
```

### Step 10: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs be-smart-server

# Test the application
curl http://localhost:3000
```

## Accessing Your Application

Your application should now be accessible at:
- **URL**: `http://ec2-52-15-61-144.us-east-2.compute.amazonaws.com:3000`
- **IP**: `http://52.15.61.144:3000`

## PM2 Management Commands

```bash
# View status
pm2 status

# View logs
pm2 logs be-smart-server

# Restart application
pm2 restart be-smart-server

# Stop application
pm2 stop be-smart-server

# Delete application from PM2
pm2 delete be-smart-server

# Monitor
pm2 monit
```

## Updating the Application

### Option 1: Quick Update Script

```bash
# On your local machine
./deploy_to_ec2.sh ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com
```

### Option 2: Manual Update

```bash
# On EC2
cd /home/ubuntu/be-smart-app
pm2 stop be-smart-server

# Transfer new files (from local machine)
# ... (same as initial deployment)

# Install new dependencies
npm install --production

# Restart
pm2 start be-smart-server
```

## Troubleshooting

### Application not accessible

1. **Check Security Group**: Ensure port 3000 is open
   ```bash
   # Test from EC2
   curl http://localhost:3000
   ```

2. **Check PM2 Status**:
   ```bash
   pm2 status
   pm2 logs be-smart-server
   ```

3. **Check Port**:
   ```bash
   sudo netstat -tlnp | grep 3000
   ```

### Database Connection Issues

1. **Check RDS Security Group**: Ensure your EC2 security group can access RDS on port 3306
2. **Test Database Connection**:
   ```bash
   # On EC2, test connection
   mysql -h be-smart-db.cn8ygsogocy8.us-east-2.rds.amazonaws.com -u admin -p
   ```

### View Application Logs

```bash
# PM2 logs
pm2 logs be-smart-server

# System logs
journalctl -u pm2-ubuntu -f
```

## Optional: Setup Nginx Reverse Proxy

If you want to use port 80/443 and add SSL:

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/be-smart

# Add configuration:
server {
    listen 80;
    server_name ec2-52-15-61-144.us-east-2.compute.amazonaws.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/be-smart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Security Considerations

1. **Firewall**: Consider using `ufw` to restrict access
2. **SSL/TLS**: For production, set up SSL certificates (Let's Encrypt)
3. **Environment Variables**: Never commit `.env` files to git
4. **Database**: Use IAM authentication for RDS if possible
5. **Regular Updates**: Keep your EC2 instance and dependencies updated

