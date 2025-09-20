#!/bin/bash
# Safe deployment script with resource checks and rollback capability

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_DIR="/home/noelceta/projects/social-media-scheduler"
CONTAINER_NAME="xc8okk8soc0gk4so4g4sckoc"
MAX_BUILD_TIME=300  # 5 minutes max build time
HEALTH_CHECK_RETRIES=10
HEALTH_CHECK_INTERVAL=5

# Logging
LOG_FILE="$PROJECT_DIR/logs/deployment-$(date +%Y%m%d-%H%M%S).log"
mkdir -p $(dirname "$LOG_FILE")

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Pre-deployment checks
pre_deployment_checks() {
    info "Running pre-deployment checks..."
    
    # Check available memory
    local available_mem=$(free -m | awk 'NR==2{print $7}')
    if [ "$available_mem" -lt 500 ]; then
        error "Insufficient memory available: ${available_mem}MB (need at least 500MB)"
        exit 1
    fi
    success "Memory check passed: ${available_mem}MB available"
    
    # Check CPU load
    local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | cut -d, -f1)
    local load_int=${load_avg%.*}
    if [ "$load_int" -gt 3 ]; then
        warning "High system load detected: $load_avg"
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        success "CPU load check passed: $load_avg"
    fi
    
    # Check disk space
    local disk_usage=$(df -h "$PROJECT_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 90 ]; then
        error "Disk usage too high: ${disk_usage}%"
        exit 1
    fi
    success "Disk space check passed: ${disk_usage}% used"
}

# Build application with resource limits
build_application() {
    info "Building application..."
    
    cd "$PROJECT_DIR"
    
    # Clean previous build
    rm -rf .next
    
    # Set memory limits for build process
    export NODE_OPTIONS="--max-old-space-size=1024"
    
    # Build with timeout
    timeout $MAX_BUILD_TIME npm run build 2>&1 | tee -a "$LOG_FILE"
    
    if [ $? -ne 0 ]; then
        error "Build failed or timed out"
        exit 1
    fi
    
    success "Build completed successfully"
}

# Deploy with Docker (if using Docker)
deploy_docker() {
    info "Deploying with Docker..."
    
    # Build Docker image
    docker build -t social-scheduler:latest \
        --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}" \
        --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
        --build-arg NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}" \
        . 2>&1 | tee -a "$LOG_FILE"
    
    if [ $? -ne 0 ]; then
        error "Docker build failed"
        exit 1
    fi
    
    # Stop old container if exists
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
    
    # Run new container with resource limits
    docker run -d \
        --name "$CONTAINER_NAME" \
        --restart unless-stopped \
        --memory="800m" \
        --memory-swap="1g" \
        --cpus="1.0" \
        -p 3000:3000 \
        social-scheduler:latest 2>&1 | tee -a "$LOG_FILE"
    
    if [ $? -ne 0 ]; then
        error "Docker run failed"
        exit 1
    fi
    
    success "Docker container started"
}

# Deploy with PM2 (if using PM2)
deploy_pm2() {
    info "Deploying with PM2..."
    
    cd "$PROJECT_DIR"
    
    # Stop existing process
    pm2 stop social-media-scheduler 2>/dev/null || true
    pm2 delete social-media-scheduler 2>/dev/null || true
    
    # Start with ecosystem config
    pm2 start ecosystem.config.js 2>&1 | tee -a "$LOG_FILE"
    
    if [ $? -ne 0 ]; then
        error "PM2 start failed"
        exit 1
    fi
    
    # Save PM2 config
    pm2 save
    
    success "PM2 process started"
}

# Health check
health_check() {
    info "Running health checks..."
    
    for i in $(seq 1 $HEALTH_CHECK_RETRIES); do
        sleep $HEALTH_CHECK_INTERVAL
        
        # Check if service is responding
        if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health | grep -q "200"; then
            success "Health check passed (attempt $i/$HEALTH_CHECK_RETRIES)"
            return 0
        else
            warning "Health check failed (attempt $i/$HEALTH_CHECK_RETRIES)"
        fi
    done
    
    error "Health checks failed after $HEALTH_CHECK_RETRIES attempts"
    return 1
}

# Resource monitoring after deployment
post_deployment_monitoring() {
    info "Monitoring resources post-deployment..."
    
    # Monitor for 30 seconds
    for i in {1..6}; do
        sleep 5
        
        if [ -f "$PROJECT_DIR/scripts/monitor-resources.sh" ]; then
            "$PROJECT_DIR/scripts/monitor-resources.sh"
        fi
        
        # Check for high CPU
        if [ "$DEPLOYMENT_TYPE" = "docker" ]; then
            local cpu=$(docker stats --no-stream --format "{{.CPUPerc}}" "$CONTAINER_NAME" | sed 's/%//')
            local cpu_int=${cpu%.*}
            if [ "$cpu_int" -gt 150 ]; then
                error "High CPU detected: ${cpu}%"
                rollback
                exit 1
            fi
        fi
    done
    
    success "Post-deployment monitoring completed"
}

# Rollback function
rollback() {
    error "Initiating rollback..."
    
    if [ "$DEPLOYMENT_TYPE" = "docker" ]; then
        docker stop "$CONTAINER_NAME" 2>/dev/null || true
        # Restore previous container if tagged
        if docker images | grep -q "social-scheduler:previous"; then
            docker run -d \
                --name "${CONTAINER_NAME}_rollback" \
                --restart unless-stopped \
                --memory="800m" \
                --memory-swap="1g" \
                --cpus="1.0" \
                -p 3000:3000 \
                social-scheduler:previous
            success "Rollback completed"
        fi
    elif [ "$DEPLOYMENT_TYPE" = "pm2" ]; then
        pm2 restart social-media-scheduler
        success "PM2 process restarted"
    fi
}

# Main deployment flow
main() {
    info "Starting safe deployment process..."
    log "Deployment started by $(whoami) from $(pwd)"
    
    # Determine deployment type
    read -p "Deploy with Docker or PM2? (docker/pm2) " -r DEPLOYMENT_TYPE
    
    # Run pre-deployment checks
    pre_deployment_checks
    
    # Build application
    build_application
    
    # Deploy based on type
    if [ "$DEPLOYMENT_TYPE" = "docker" ]; then
        # Tag current image as previous for rollback
        docker tag social-scheduler:latest social-scheduler:previous 2>/dev/null || true
        deploy_docker
    elif [ "$DEPLOYMENT_TYPE" = "pm2" ]; then
        deploy_pm2
    else
        error "Invalid deployment type"
        exit 1
    fi
    
    # Health check
    if health_check; then
        success "Deployment successful!"
    else
        error "Deployment failed health checks"
        rollback
        exit 1
    fi
    
    # Post-deployment monitoring
    post_deployment_monitoring
    
    success "Safe deployment completed successfully!"
    info "Logs saved to: $LOG_FILE"
}

# Run main function
main "$@"