# Deploying from EC2 Instance

This guide explains how to deploy your application directly from the EC2 instance terminal.

## Prerequisites

1. **SSH Access**: You need to SSH into your EC2 instance
2. **Git Repository**: Your code should be in a git repository (GitHub, GitLab, etc.)
3. **EC2 Security**: Ensure port 3000 is open in your security group

## Quick Start

### Step 1: SSH into EC2

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com
```

### Step 2: Upload Deployment Script

From your local machine, upload the deployment script:

```bash
# From your local machine
scp -i ~/.ssh/your-key.pem deploy_on_ec2.sh ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com:/home/ubuntu/
```

### Step 3: Make Script Executable

On EC2:

```bash
chmod +x ~/deploy_on_ec2.sh
```

### Step 4: Set Git Repository URL (if using git)

```bash
export GIT_REPO_URL=https://github.com/your-username/your-repo.git
```

### Step 5: Run Deployment

```bash
./deploy_on_ec2.sh
```

## Alternative: Manual Deployment

If you prefer to deploy manually or don't use git:

### Step 1: Upload Your Code

From your local machine, upload your project:

```bash
# Create a tarball of your project (excluding node_modules)
cd /path/to/BE_SMART_HACKATHON
tar -czf deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  be-smart/ \
  server_side/

# Upload to EC2
scp -i ~/.ssh/your-key.pem deploy.tar.gz ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com:/tmp/
```

### Step 2: On EC2, Extract and Deploy

```bash
# Extract
cd /home/ubuntu
tar -xzf /tmp/deploy.tar.gz

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (if not installed)
sudo npm install -g pm2

# Build React app
cd BE_SMART_HACKATHON/be-smart
npm install
npm run build

# Install server dependencies
cd ../server_side
npm install --production

# Setup directories
sudo mkdir -p /home/ubuntu/be-smart-app
sudo mkdir -p /home/ubuntu/be-smart/dist
sudo chown -R ubuntu:ubuntu /home/ubuntu/be-smart-app
sudo chown -R ubuntu:ubuntu /home/ubuntu/be-smart

# Copy files
cp -r /home/ubuntu/BE_SMART_HACKATHON/server_side/* /home/ubuntu/be-smart-app/
cp -r /home/ubuntu/BE_SMART_HACKATHON/be-smart/dist/* /home/ubuntu/be-smart/dist/

# Create .env.production if it doesn't exist
cat > /home/ubuntu/be-smart-app/.env.production << 'EOF'
DB_HOST=be-smart-db.cn8ygsogocy8.us-east-2.rds.amazonaws.com
DB_PORT=3306
DB_NAME=besmart
DB_USER=admin
DB_PASSWORD=be-smart-password
DB_REGION=us-east-2
DB_SSL=true
DB_USE_IAM_AUTH=false
DB_CONNECTION_LIMIT=20
PORT=3000
BASE_URL=http://ec2-52-15-61-144.us-east-2.compute.amazonaws.com:3000
EOF

# Copy PM2 config
cp /home/ubuntu/BE_SMART_HACKATHON/server_side/ecosystem.config.js /home/ubuntu/be-smart-app/

# Start with PM2
cd /home/ubuntu/be-smart-app
pm2 delete be-smart-server 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

## Using Git (Recommended)

### Initial Setup

1. **Upload deployment script to EC2**:
   ```bash
   scp -i ~/.ssh/your-key.pem deploy_on_ec2.sh ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com:/home/ubuntu/
   ```

2. **SSH into EC2**:
   ```bash
   ssh -i ~/.ssh/your-key.pem ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com
   ```

3. **Make script executable**:
   ```bash
   chmod +x ~/deploy_on_ec2.sh
   ```

4. **Set your git repository URL** (edit the script or use environment variable):
   ```bash
   export GIT_REPO_URL=https://github.com/your-username/BE_SMART_HACKATHON.git
   ```

5. **Run deployment**:
   ```bash
   ./deploy_on_ec2.sh
   ```

### Updating Your Application

After making changes to your code:

1. **Commit and push to git**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **On EC2, run deployment script again**:
   ```bash
   ./deploy_on_ec2.sh
   ```

The script will:
- Pull latest changes from git
- Rebuild React app
- Reinstall dependencies if needed
- Restart the application with PM2

## Setting Up Git Access on EC2

### Option 1: Public Repository
If your repository is public, no authentication needed:
```bash
export GIT_REPO_URL=https://github.com/your-username/repo.git
```

### Option 2: Private Repository with SSH Key
1. Generate SSH key on EC2 (if needed):
   ```bash
   ssh-keygen -t ed25519 -C "ec2-deploy"
   ```

2. Add public key to GitHub/GitLab:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy output and add to GitHub/GitLab SSH keys
   ```

3. Use SSH URL:
   ```bash
   export GIT_REPO_URL=git@github.com:your-username/repo.git
   ```

### Option 3: Private Repository with Personal Access Token
```bash
export GIT_REPO_URL=https://TOKEN@github.com/your-username/repo.git
```

## Environment Variables

The deployment script will create `.env.production` if it doesn't exist. To customize:

```bash
# On EC2
nano /home/ubuntu/be-smart-app/.env.production
# Edit as needed
pm2 restart be-smart-server
```

## PM2 Management

Once deployed, manage your application with PM2:

```bash
# Check status
pm2 status

# View logs
pm2 logs be-smart-server

# Restart
pm2 restart be-smart-server

# Stop
pm2 stop be-smart-server

# View real-time monitoring
pm2 monit
```

## Troubleshooting

### Build Fails
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Application Won't Start
```bash
# Check logs
pm2 logs be-smart-server

# Check if port is in use
sudo netstat -tlnp | grep 3000

# Check .env file
cat /home/ubuntu/be-smart-app/.env.production
```

### Database Connection Issues
```bash
# Test database connection
mysql -h be-smart-db.cn8ygsogocy8.us-east-2.rds.amazonaws.com -u admin -p

# Check RDS security group allows EC2 security group
```

## Automated Deployment with GitHub Actions (Optional)

You can set up GitHub Actions to automatically deploy when you push to main:

1. Store your EC2 SSH key as a GitHub secret
2. Create `.github/workflows/deploy.yml`
3. Action will SSH into EC2 and run deployment script

## Quick Reference

**Deploy from EC2:**
```bash
./deploy_on_ec2.sh
```

**Update after git push:**
```bash
cd /home/ubuntu/BE_SMART_HACKATHON
git pull
cd be-smart && npm run build
cd ../server_side && npm install --production
pm2 restart be-smart-server
```

**Full redeploy:**
```bash
./deploy_on_ec2.sh
```

