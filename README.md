=====================================================================
FRONTEND
=====================================================================











=====================================================================
BACKEND
=====================================================================







=====================================================================
DATABASE: RDS MySQL
=====================================================================

To connect in MySQL Workbench

IP/HOST:    be-smart-db.cn8ygsogocy8.us-east-2.rds.amazonaws.com
Username:   admin
Password:   be-smart-password

=====================================================================
AWS DEPLOYEMENT IN EC2 INSTANCE
=====================================================================

EC2 Instance Details:
- Public IP: 52.15.61.144
- Public DNS: ec2-52-15-61-144.us-east-2.compute.amazonaws.com
- Instance ID: i-0499b4ab73153c467
- Region: us-east-2

## Deployment Options

### Option 1: Deploy from EC2 Instance (Recommended)

Deploy directly from the EC2 terminal:

```bash
# 1. SSH into EC2
ssh -i ~/.ssh/your-key.pem ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com

# 2. Upload deployment script (from your local machine)
scp -i ~/.ssh/your-key.pem deploy_on_ec2.sh ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com:/home/ubuntu/

# 3. On EC2, make executable and run
chmod +x ~/deploy_on_ec2.sh
export GIT_REPO_URL=https://github.com/your-username/your-repo.git
./deploy_on_ec2.sh
```

See **deployment/EC2_INSTANCE_DEPLOYMENT.md** for detailed instructions.

### Option 2: Deploy from Local Machine

Deploy from your local machine using the deployment script:

```bash
# Make script executable 
chmod +x deploy_to_ec2.sh

# Deploy to EC2 (with SSH key)
./deploy_to_ec2.sh ubuntu@ec2-52-15-61-144.us-east-2.compute.amazonaws.com ~/.ssh/your-key.pem
```

See **deployment/EC2_DEPLOYMENT_GUIDE.md** for detailed instructions.

For detailed deployment instructions, see: **deployment/** directory

Frontend: Served by Node.js Express server (port 3000)
Backend: Node.js Express with PM2 process manager