# Deployment Documentation

This directory contains all deployment-related documentation and guides.

## Documentation Files

### 📘 [EC2_INSTANCE_DEPLOYMENT.md](./EC2_INSTANCE_DEPLOYMENT.md)
**Deploy from EC2 Instance** - Guide for deploying directly from the EC2 terminal. This is the recommended approach if you want to run deployments from within AWS.

### 📘 [EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md)
**Deploy from Local Machine** - Complete guide for deploying from your local machine to EC2. Includes manual step-by-step instructions and troubleshooting.

### 📘 [DEPLOYMENT_MAINTENANCE.md](./DEPLOYMENT_MAINTENANCE.md)
**Maintenance Guide** - Information about what needs to be updated and when. Explains which configuration files require updates vs. which are stable.

## Quick Start

### Deploy from EC2 (Recommended)
1. SSH into your EC2 instance
2. Upload `deploy_on_ec2.sh` to EC2
3. Run: `./deploy_on_ec2.sh`
4. See [EC2_INSTANCE_DEPLOYMENT.md](./EC2_INSTANCE_DEPLOYMENT.md) for details

### Deploy from Local Machine
1. Run: `./deploy_to_ec2.sh ubuntu@ec2-host ~/.ssh/key.pem`
2. See [EC2_DEPLOYMENT_GUIDE.md](./EC2_DEPLOYMENT_GUIDE.md) for details

## Deployment Scripts

The deployment scripts are located in the project root:
- `deploy_on_ec2.sh` - Run on EC2 instance
- `deploy_to_ec2.sh` - Run from local machine

## Configuration Files

- `server_side/ecosystem.config.js` - PM2 configuration
- `server_side/.env.production` - Production environment variables
- `be-smart/.env.production` - Frontend production environment variables

