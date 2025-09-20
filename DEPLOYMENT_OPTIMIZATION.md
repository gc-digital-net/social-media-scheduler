# Social Media Scheduler - Deployment Optimization Guide

## Root Cause Analysis of 200% CPU Issue

Based on the investigation, the high CPU usage (200%) was likely caused by:

### 1. **Middleware Running on Every Request**
- The middleware was checking authentication on EVERY request, including static assets
- This created thousands of Supabase client instances
- Each auth check involves cryptographic operations (JWT validation)

### 2. **Unoptimized Next.js Configuration**
- Default Next.js settings not optimized for low-resource VPS
- No memory limits set for Node.js process
- Multiple worker threads on a 2-core system

### 3. **Container Restart Loop**
- The workflow-automation container is in a restart loop
- Missing package.json causing continuous failures
- Each restart consumes CPU resources

### 4. **Missing Resource Limits**
- No Docker memory/CPU limits
- PM2 not configured with proper memory limits
- Node.js heap size not constrained

## Immediate Fixes Applied

### 1. **Optimized Middleware** (`middleware.ts`)
```typescript
// Only runs on specific auth-required routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/composer/:path*',
    // ... other protected routes
  ],
}
```

### 2. **Resource-Limited PM2 Config** (`ecosystem.config.optimized.js`)
- Single instance (fork mode)
- 700MB memory limit
- Node.js heap limited to 512MB
- Frequent garbage collection

### 3. **Monitoring Scripts Created**
- `scripts/monitor-resources.sh` - Real-time resource monitoring
- `scripts/deploy-safe.sh` - Safe deployment with rollback

## Deployment Best Practices

### Option 1: PM2 Deployment (Recommended for VPS)

```bash
# 1. Build the application
cd /home/noelceta/projects/social-media-scheduler
npm run build

# 2. Use optimized PM2 config
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.optimized.js

# 3. Save PM2 config
pm2 save
pm2 startup  # Follow the instructions to enable auto-start

# 4. Monitor resources
pm2 monit  # Real-time monitoring
./scripts/monitor-resources.sh watch  # Custom monitoring
```

### Option 2: Docker Deployment (With Coolify)

```bash
# 1. Use the optimized Dockerfile with resource limits
docker build -t social-scheduler:latest .

# 2. Run with resource constraints
docker run -d \
  --name social-scheduler \
  --restart unless-stopped \
  --memory="800m" \
  --memory-swap="1g" \
  --cpus="1.0" \
  -p 3000:3000 \
  social-scheduler:latest

# 3. Monitor container
docker stats social-scheduler
```

### Option 3: Safe Deployment Script

```bash
# Use the automated safe deployment script
./scripts/deploy-safe.sh

# This script will:
# - Check system resources before deployment
# - Build with memory limits
# - Deploy with either PM2 or Docker
# - Run health checks
# - Monitor for 30 seconds post-deployment
# - Automatically rollback if issues detected
```

## Performance Optimizations

### 1. **Next.js Optimizations**
- Use `output: 'standalone'` for smaller deployments
- Disable source maps in production
- Enable SWC minification
- Implement proper code splitting

### 2. **Database Optimizations**
```sql
-- Add these indexes to Supabase
CREATE INDEX idx_posts_scheduled ON posts(scheduled_for, status);
CREATE INDEX idx_queue_status ON post_queue(status, process_after);
```

### 3. **Caching Strategy**
- Use Cloudflare for static assets
- Implement Redis for session caching
- Cache Supabase queries where possible

### 4. **API Rate Limiting**
```typescript
// Implement rate limiting on API routes
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per minute
});
```

## Monitoring and Alerts

### 1. **PM2 Monitoring**
```bash
# View logs
pm2 logs social-media-scheduler

# View metrics
pm2 show social-media-scheduler

# Web dashboard
pm2 web  # Access at http://localhost:9615
```

### 2. **System Monitoring**
```bash
# CPU and Memory
htop

# Network connections
netstat -tulpn | grep 3000

# Disk usage
df -h

# Process monitoring
ps aux | grep node
```

### 3. **Application Health Endpoint**
Create `/app/api/health/route.ts`:
```typescript
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };
  return Response.json(health);
}
```

## Preventive Measures

### 1. **Pre-deployment Checklist**
- [ ] Run `npm run build` locally first
- [ ] Check system resources: `free -m`, `df -h`, `uptime`
- [ ] Review logs for errors: `pm2 logs`
- [ ] Test with limited resources locally
- [ ] Have rollback plan ready

### 2. **Regular Maintenance**
```bash
# Weekly tasks
- Clear old logs: find ./logs -name "*.log" -mtime +7 -delete
- Check for memory leaks: pm2 show social-media-scheduler
- Review error logs: grep ERROR logs/*.log

# Monthly tasks
- Update dependencies: npm update
- Optimize database: vacuum and analyze tables
- Review resource usage trends
```

### 3. **Scaling Strategy**
If resource issues persist:
1. **Vertical Scaling**: Upgrade VPS to 4GB RAM / 4 CPUs
2. **Horizontal Scaling**: Use multiple smaller instances with load balancer
3. **Serverless**: Move to Vercel/Netlify for frontend, keep API on VPS
4. **Optimize Further**: 
   - Implement worker threads for heavy tasks
   - Use queue system (Bull/BullMQ) for background jobs
   - Move to edge functions for auth checks

## Emergency Response

### If CPU Spikes Again:

```bash
# 1. Immediate response
docker stop xc8okk8soc0gk4so4g4sckoc  # or pm2 stop all

# 2. Check what's consuming resources
top -c
ps aux --sort=-%cpu | head

# 3. Check logs
docker logs xc8okk8soc0gk4so4g4sckoc --tail 100
pm2 logs --lines 100

# 4. Restart with limits
pm2 start ecosystem.config.optimized.js
# or
docker run with resource limits (see above)

# 5. Monitor closely
./scripts/monitor-resources.sh watch
```

## Configuration Files Summary

1. **`next.config.optimized.ts`** - Optimized Next.js configuration
2. **`ecosystem.config.optimized.js`** - PM2 config with resource limits
3. **`scripts/monitor-resources.sh`** - Resource monitoring script
4. **`scripts/deploy-safe.sh`** - Safe deployment with checks
5. **`middleware.ts`** - Already optimized to run only on specific routes

## Recommended Deployment Method

For your 2-core, 1.9GB RAM VPS, **PM2 with the optimized config** is recommended:

```bash
# Quick deployment
cd /home/noelceta/projects/social-media-scheduler
npm run build
pm2 start ecosystem.config.optimized.js
pm2 save
```

This ensures:
- Memory limited to 700MB
- Automatic restart on crashes
- Proper logging
- Resource monitoring
- Graceful shutdowns

## Support and Monitoring

- Monitor continuously for the first 24 hours after deployment
- Set up alerts for CPU > 150% or Memory > 80%
- Keep logs for at least 7 days
- Document any issues in this file

Remember: **Prevention is better than recovery**. Always test deployments during low-traffic periods and have a rollback plan ready.