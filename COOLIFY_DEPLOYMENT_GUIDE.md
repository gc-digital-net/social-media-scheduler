# Coolify Deployment Guide - Social Media Scheduler

## 🚨 CRITICAL: Why Your Last Deployment Failed (200% CPU)

The CPU spike happened because:
1. **No resource limits** were set in Coolify
2. **Middleware ran on EVERY request** including static files
3. **Multiple Node.js processes** competed for 2 CPU cores
4. **No memory limits** caused memory pressure → CPU thrashing

## ✅ Solution: Optimized Coolify Configuration

### Step 1: Update Your Coolify Application Settings

In your Coolify dashboard for this application:

#### 1.1 Resource Limits (MOST IMPORTANT)
```yaml
# In Coolify UI → Resources tab
CPU Limit: 1000m (1 core)
Memory Limit: 800Mi
CPU Request: 500m
Memory Request: 400Mi
```

#### 1.2 Environment Variables
Copy all variables from `.env.coolify`, especially:
```bash
NODE_OPTIONS=--max-old-space-size=512 --optimize-for-size --gc-interval=100
```
This is CRITICAL - it limits Node.js to 512MB heap.

#### 1.3 Health Check Settings
```yaml
Path: /api/health
Port: 3000
Interval: 30s
Timeout: 10s
Retries: 3
```

### Step 2: Use Optimized Dockerfile

In Coolify, set:
- **Dockerfile Path**: `Dockerfile.optimized`
- **Build Context**: `.`

### Step 3: Deploy Through Coolify

1. **Push your code** with the optimized files:
   ```bash
   git add .
   git commit -m "Add Coolify optimizations and resource limits"
   git push
   ```

2. **In Coolify Dashboard**:
   - Click "Deploy"
   - Monitor the build logs
   - Watch for memory usage during build

3. **If build fails due to memory**:
   - Temporarily stop other containers
   - Or use GitHub Actions to build and push to registry

### Step 4: Post-Deployment Monitoring

```bash
# SSH into your server and run:

# 1. Check container resources
docker stats xc8okk8soc0gk4so4g4sckoc

# 2. Monitor with our script
./scripts/monitor-resources.sh watch

# 3. Check container logs
docker logs xc8okk8soc0gk4so4g4sckoc --tail 100 -f

# 4. Verify resource limits are applied
docker inspect xc8okk8soc0gk4so4g4sckoc | grep -A 5 "Memory\|Cpu"
```

## 🔧 Coolify-Specific Optimizations

### Option A: Direct Docker Deployment (Recommended)
Use the `Dockerfile.optimized` which includes:
- Multi-stage build (smaller image)
- Non-root user (security)
- dumb-init (proper signal handling)
- Health checks built-in
- Memory-optimized Node.js settings

### Option B: Docker Compose
If Coolify supports docker-compose:
1. Use `docker-compose.yml` file
2. It includes all resource limits
3. Proper health checks
4. Volume mounts for logs

### Option C: Build with GitHub Actions (For Low-Memory VPS)
If your VPS can't build the image:

```yaml
# .github/workflows/build-and-push.yml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and push Docker image
        env:
          REGISTRY: ghcr.io
          IMAGE_NAME: ${{ github.repository }}
        run: |
          docker build -t $REGISTRY/$IMAGE_NAME:latest -f Dockerfile.optimized .
          docker push $REGISTRY/$IMAGE_NAME:latest
```

Then in Coolify, use the pre-built image from GitHub Container Registry.

## 📊 Monitoring in Coolify

### Real-time Monitoring
```bash
# Create monitoring dashboard
cat > ~/monitor-coolify.sh << 'EOF'
#!/bin/bash
while true; do
  clear
  echo "=== Coolify Apps Resource Usage ==="
  docker stats --no-stream
  echo ""
  echo "=== Social Media Scheduler Health ==="
  curl -s http://localhost:3000/api/health | jq '.'
  echo ""
  echo "=== System Resources ==="
  free -h
  echo ""
  uptime
  sleep 5
done
EOF

chmod +x ~/monitor-coolify.sh
./monitor-coolify.sh
```

### Coolify Logs
In Coolify dashboard:
1. Go to your application
2. Click "Logs" tab
3. Enable "Follow logs"
4. Look for:
   - Memory warnings
   - Restart messages
   - Error patterns

## 🚀 Deployment Checklist

Before deploying through Coolify:

- [ ] Resource limits set in Coolify UI
- [ ] `NODE_OPTIONS` environment variable added
- [ ] Using `Dockerfile.optimized`
- [ ] Health check endpoint created (`/api/health`)
- [ ] Middleware optimized (only specific routes)
- [ ] Build tested locally with memory limits
- [ ] Monitoring script ready
- [ ] Backup/rollback plan prepared

## 🛡️ Preventing Future Issues

### 1. Pre-deployment Test
```bash
# Test build locally with memory limits
docker build -t test-build -f Dockerfile.optimized \
  --memory="1g" --memory-swap="1g" .
```

### 2. Gradual Rollout
- Deploy during low-traffic hours
- Monitor for 30 minutes post-deployment
- Have rollback ready

### 3. Resource Alerts
Set up Coolify notifications:
- CPU > 80% for 5 minutes
- Memory > 700MB
- Container restarts > 3 in 10 minutes

## 🔴 Emergency Procedures

### If CPU Spikes Again:

1. **Immediate Action**:
   ```bash
   # Stop the container
   docker stop xc8okk8soc0gk4so4g4sckoc
   ```

2. **Check What Happened**:
   ```bash
   # Last 200 lines of logs
   docker logs xc8okk8soc0gk4so4g4sckoc --tail 200 > crash-log.txt
   
   # System state
   top -b -n 1 > system-state.txt
   ps aux --sort=-%cpu | head -20 >> system-state.txt
   ```

3. **Quick Fix**:
   ```bash
   # Restart with strict limits
   docker run -d \
     --name scheduler-emergency \
     --memory="600m" --memory-swap="600m" \
     --cpus="0.8" \
     -p 3000:3000 \
     xc8okk8soc0gk4so4g4sckoc:latest
   ```

4. **Report to Coolify**:
   - Check Coolify dashboard for deployment status
   - Adjust resource limits further if needed
   - Redeploy through Coolify with new limits

## 📈 Scaling Options

If resource limits are too restrictive:

### Option 1: Optimize Further
- Enable Cloudflare caching
- Use Redis for session storage
- Implement query result caching
- Move heavy operations to background jobs

### Option 2: Upgrade VPS
- 4 CPU cores, 4GB RAM recommended
- Allows for 2 container instances
- Better build performance

### Option 3: Serverless Frontend
- Deploy frontend to Vercel/Netlify
- Keep API on Coolify
- Reduces server load by 60%

## 🎯 Recommended Configuration

For your 2-core, 1.9GB VPS with Coolify:

```yaml
# Optimal settings for Coolify
Resources:
  CPU: 1000m (1 core)
  Memory: 800MB
  
Environment:
  NODE_OPTIONS: --max-old-space-size=512 --optimize-for-size
  
Replicas: 1
Strategy: Recreate
Health Check: Enabled
Auto-deploy: Yes (with resource limits!)
```

## Support

- Monitor closely for 24 hours after deployment
- Check `/scripts/monitor-resources.sh` regularly
- Review Coolify logs daily
- Document any issues in this file

Remember: **Coolify makes deployment easy, but resource limits make it stable!**