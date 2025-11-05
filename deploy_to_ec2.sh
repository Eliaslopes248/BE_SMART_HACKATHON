#!/bin/bash
# ======================================================
# EC2 Deployment Script
# ======================================================
# This script deploys the application to EC2
# Usage: ./deploy_to_ec2.sh [ec2-user@your-instance]
# ======================================================

set -e  # Exit on error

# Get the directory where the script is located (project root)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Default EC2 instance (update with your details)
# Usage: ./deploy_to_ec2.sh [user@host] [ssh-key-path]
# Example: ./deploy_to_ec2.sh ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com ~/.ssh/my-key.pem

EC2_USER_HOST="${1:-ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com}"
SSH_KEY="${2:-}"
EC2_HOST="ec2-52-15-61-144.us-east-2.compute.amazonaws.com"
APP_DIR="/home/ubuntu/be-smart-app"

# Build SSH command with key if provided
if [ -n "$SSH_KEY" ]; then
    SSH_CMD="ssh -i $SSH_KEY"
    SCP_CMD="scp -i $SSH_KEY"
else
    SSH_CMD="ssh"
    SCP_CMD="scp"
fi

echo "=========================================="
echo "Deploying to EC2: $EC2_HOST"
echo "=========================================="

# Build React app locally
echo "Step 1: Building React app..."
cd "$PROJECT_ROOT"
bash ./scripts/build_react.sh

# Create deployment package
echo "Step 2: Creating deployment package..."
TEMP_DIR=$(mktemp -d)
DEPLOY_DIR="$TEMP_DIR/be-smart-app"

mkdir -p "$DEPLOY_DIR"

# Copy server files
echo "Step 3: Copying server files..."
cp -r "$PROJECT_ROOT/server_side"/* "$DEPLOY_DIR/"
cp "$PROJECT_ROOT/server_side/.env.production" "$DEPLOY_DIR/" 2>/dev/null || true

# Copy React build (needs to be at ../be-smart/dist relative to server_side)
echo "Step 4: Copying React build..."
mkdir -p "$TEMP_DIR/be-smart/dist"
cp -r "$PROJECT_ROOT/be-smart/dist"/* "$TEMP_DIR/be-smart/dist/"

# Copy package.json from server_side (it already has all dependencies)
cp "$PROJECT_ROOT/server_side/package.json" "$DEPLOY_DIR/package.json"

# Copy PM2 ecosystem config (if it exists, otherwise create default)
if [ -f "$PROJECT_ROOT/server_side/ecosystem.config.js" ]; then
    cp "$PROJECT_ROOT/server_side/ecosystem.config.js" "$DEPLOY_DIR/ecosystem.config.js"
else
    # Create default PM2 ecosystem file if it doesn't exist
    cat > "$DEPLOY_DIR/ecosystem.config.js" << 'EOF'
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
fi

mkdir -p "$DEPLOY_DIR/logs"

# Create deployment archive
echo "Step 5: Creating deployment archive..."
cd "$TEMP_DIR"
tar -czf be-smart-app.tar.gz be-smart-app/ be-smart/

echo "Step 6: Uploading to EC2..."
$SCP_CMD be-smart-app.tar.gz "$EC2_USER_HOST:/tmp/"

echo "Step 7: Extracting and setting up on EC2..."
$SSH_CMD "$EC2_USER_HOST" << 'ENDSSH'
# Create app directory
sudo mkdir -p /home/ubuntu/be-smart-app
sudo mkdir -p /home/ubuntu/be-smart
sudo chown -R ubuntu:ubuntu /home/ubuntu/be-smart-app
sudo chown -R ubuntu:ubuntu /home/ubuntu/be-smart

# Extract deployment
cd /home/ubuntu
tar -xzf /tmp/be-smart-app.tar.gz

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install dependencies
cd /home/ubuntu/be-smart-app
npm install --production

# Setup PM2 to start on boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

# Restart application
pm2 delete be-smart-server 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "Deployment complete!"
echo "Application is running on http://$(curl -s ifconfig.me):3000"
ENDSSH

# Cleanup
rm -rf "$TEMP_DIR"

echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
echo "Your app is available at:"
echo "http://$EC2_HOST:3000"
echo ""
if [ -n "$SSH_KEY" ]; then
    echo "To check status: ssh -i $SSH_KEY $EC2_USER_HOST 'pm2 status'"
    echo "To view logs: ssh -i $SSH_KEY $EC2_USER_HOST 'pm2 logs be-smart-server'"
else
    echo "To check status: ssh $EC2_USER_HOST 'pm2 status'"
    echo "To view logs: ssh $EC2_USER_HOST 'pm2 logs be-smart-server'"
fi

