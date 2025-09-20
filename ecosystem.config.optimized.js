module.exports = {
  apps: [{
    name: 'social-media-scheduler',
    script: 'node_modules/.bin/next',
    args: 'start',
    
    // Process management
    instances: 1, // Single instance for 2-core VPS
    exec_mode: 'fork', // Use 'fork' instead of 'cluster' for better memory usage
    autorestart: true,
    watch: false,
    
    // Memory management
    max_memory_restart: '700M', // Restart if memory exceeds 700MB
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // Add your Supabase and other env vars here
    },
    
    // Logging
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    
    // Advanced restart strategies
    max_restarts: 10,
    min_uptime: '10s',
    
    // Exponential backoff restart delay
    restart_delay: 4000,
    exp_backoff_restart_delay: 100,
    
    // Graceful start/shutdown
    wait_ready: true,
    listen_timeout: 3000,
    kill_timeout: 5000,
    shutdown_with_message: true,
    
    // Node.js optimizations
    node_args: [
      '--max-old-space-size=512',      // Limit heap to 512MB
      '--optimize-for-size',            // Optimize for memory over speed
      '--gc-interval=100',              // More frequent garbage collection
      '--expose-gc',                    // Allow manual GC if needed
      '--max-semi-space-size=64',       // Reduce semi-space size
    ].join(' '),
    
    // CPU and event loop monitoring
    instance_var: 'INSTANCE_ID',
    
    // Health check endpoint
    health_check: {
      url: 'http://localhost:3000/api/health',
      interval: 30000,  // Check every 30 seconds
      timeout: 5000,
      max_consecutive_failures: 3,
    },
    
    // Monitoring and alerts (optional - integrate with your monitoring service)
    events: {
      restart: 'warning',
      delete: 'error',
      stop: 'info',
      'restart overlimit': 'alert',
      'exit': 'error',
    },
    
    // Resource monitoring hooks
    post_update: ["npm install", "echo 'App updated successfully'"],
    
    // Cron restart (optional - restart daily at 3 AM to clear any memory leaks)
    cron_restart: '0 3 * * *',
  }],
  
  // PM2 deployment configuration
  deploy: {
    production: {
      user: 'noelceta',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/social-media-scheduler.git',
      path: '/home/noelceta/projects/social-media-scheduler',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.optimized.js --env production',
      'pre-deploy-local': 'echo "Deploying to production server"',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};