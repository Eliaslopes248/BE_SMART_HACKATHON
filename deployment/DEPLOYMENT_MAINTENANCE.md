# Deployment Maintenance Guide

## What Needs Updating and When

### ✅ **Rarely/Never Needs Updates** (Set Once)

1. **PM2 Ecosystem Config Structure** (`server_side/ecosystem.config.js`)
   - ✅ **Update only if**: You need to change port, memory limits, or scaling
   - ✅ **Current settings work for**: Most applications
   - ✅ **No updates needed** for regular code deployments

2. **Deployment Script Structure** (`deploy_to_ec2.sh`)
   - ✅ **Update only if**: You change EC2 instance, deployment paths, or build process
   - ✅ **Works for**: All future deployments as-is

### 🔄 **Needs Updates When Changed**

1. **EC2 Instance Details** (in `deploy_to_ec2.sh`)
   ```bash
   EC2_USER="ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com"
   EC2_HOST="ec2-52-15-61-144.us-east-2.compute.amazonaws.com"
   ```
   - 🔄 **Update when**: You deploy to a different EC2 instance

2. **Environment Variables** (`.env.production`)
   - 🔄 **Update when**: 
     - Database credentials change
     - API keys change
     - Base URL changes
     - New environment variables are added

3. **CORS Origins** (in `server_side/server.js`)
   - 🔄 **Update when**: You add a new frontend domain or change deployment URL

4. **Port Numbers**
   - 🔄 **Update in 3 places if changed**:
     - `server_side/ecosystem.config.js` (PORT: 3000)
     - `.env.production` (PORT=3000)
     - Security group rules on EC2

5. **Dependencies** (`server_side/package.json`)
   - 🔄 **Automatically updated**: When you run `npm install` and deploy
   - ✅ **No manual updates needed** in deployment script

### 📝 **Regular Deployment Process** (No Config Changes Needed)

For regular code updates, you **don't need to update any config files**:

```bash
# Just run the deployment script - it handles everything
./deploy_to_ec2.sh
```

The script will:
- ✅ Use existing `ecosystem.config.js` (if present)
- ✅ Use existing `.env.production`
- ✅ Build and deploy latest code
- ✅ Restart the application

## When to Update PM2 Config

Update `server_side/ecosystem.config.js` only if you need to:

1. **Change Port**: Update `PORT` in `env` section
2. **Scale Up**: Increase `instances` (e.g., for load balancing)
3. **Adjust Memory**: Change `max_memory_restart` if app uses more memory
4. **Add Environment Variables**: Add to `env` section
5. **Change Log Locations**: Update log file paths

### Example: Updating Port

```javascript
// server_side/ecosystem.config.js
env: {
  NODE_ENV: 'production',
  PORT: 8080  // Changed from 3000
}
```

Then update:
- `.env.production`: `PORT=8080`
- Security group: Allow port 8080
- EC2 deployment script: Update BASE_URL if needed

## When to Update Deployment Script

Update `deploy_to_ec2.sh` only if:

1. **Different EC2 Instance**: Change `EC2_USER` and `EC2_HOST` variables
2. **Different Deployment Path**: Change `/home/ubuntu/be-smart-app`
3. **Different Build Process**: Modify build steps
4. **New Dependencies to Install**: Add installation steps

## Best Practices

### ✅ **Do This Regularly**
- Deploy code updates using the script
- Keep dependencies updated
- Monitor logs: `pm2 logs be-smart-server`

### ❌ **Don't Do This**
- Don't manually edit PM2 config on EC2 (will be overwritten)
- Don't commit `.env` files to git
- Don't hardcode values that should be in `.env`

## Configuration File Locations

```
BE_SMART_HACKATHON/
├── deploy_to_ec2.sh              # Deployment script (update EC2 details here)
├── server_side/
│   ├── ecosystem.config.js       # PM2 config (version controlled, update as needed)
│   ├── .env.production           # Environment variables (update when needed)
│   └── server.js                  # CORS config (update when adding domains)
└── be-smart/
    ├── .env.production            # Frontend env vars (update when BASE_URL changes)
    └── .env.development           # Frontend dev vars
```

## Quick Reference: Update Checklist

When changing deployment settings:

- [ ] Update `server_side/ecosystem.config.js` (if port/memory/scaling changes)
- [ ] Update `server_side/.env.production` (if env vars change)
- [ ] Update `be-smart/.env.production` (if API URL changes)
- [ ] Update `server_side/server.js` (if CORS origins change)
- [ ] Update `deploy_to_ec2.sh` (if EC2 instance changes)
- [ ] Update EC2 security group (if port changes)
- [ ] Redeploy: `./deploy_to_ec2.sh`

## Summary

**For regular code deployments**: Just run `./deploy_to_ec2.sh` - no config updates needed!

**For infrastructure changes**: Update the relevant config files listed above, then deploy.

The PM2 ecosystem config is now version-controlled in `server_side/ecosystem.config.js`, so you can update it when needed and it will be included in deployments.

