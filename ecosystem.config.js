module.exports = {
  apps: [{
    name: 'social-media-scheduler',
    script: 'node_modules/.bin/next',
    args: 'start',
    instances: 1, // Use only 1 instance on 2-core VPS
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // CPU optimization
    max_restarts: 10,
    min_uptime: '10s',
    // Graceful shutdown
    kill_timeout: 3000,
    listen_timeout: 3000,
    // Node.js optimizations
    node_args: '--max-old-space-size=512',
  }]
};