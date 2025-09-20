#!/bin/bash
# Resource monitoring script for social media scheduler

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
MAX_CPU_PERCENT=150  # Alert if CPU > 150%
MAX_MEM_PERCENT=80   # Alert if Memory > 80%
LOG_FILE="/home/noelceta/projects/social-media-scheduler/logs/resource-monitor.log"

# Create logs directory if it doesn't exist
mkdir -p $(dirname "$LOG_FILE")

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check Docker container resources
check_container_resources() {
    local container_name="xc8okk8soc0gk4so4g4sckoc"
    
    # Get container stats
    local stats=$(docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" "$container_name" 2>/dev/null | tail -n 1)
    
    if [ -z "$stats" ]; then
        log_message "WARNING: Container $container_name not found or not running"
        return 1
    fi
    
    # Parse CPU and Memory percentages
    local cpu_percent=$(echo "$stats" | awk '{print $2}' | sed 's/%//')
    local mem_percent=$(echo "$stats" | awk '{print $4}' | sed 's/%//')
    
    # Convert to integer for comparison (bash doesn't do float comparison)
    cpu_int=${cpu_percent%.*}
    mem_int=${mem_percent%.*}
    
    log_message "Container Stats - CPU: ${cpu_percent}%, Memory: ${mem_percent}%"
    
    # Check CPU threshold
    if [ "$cpu_int" -gt "$MAX_CPU_PERCENT" ]; then
        log_message "ALERT: High CPU usage detected! ${cpu_percent}% > ${MAX_CPU_PERCENT}%"
        echo -e "${RED}⚠️  High CPU Alert: ${cpu_percent}%${NC}"
        return 2
    fi
    
    # Check Memory threshold
    if [ "$mem_int" -gt "$MAX_MEM_PERCENT" ]; then
        log_message "ALERT: High memory usage detected! ${mem_percent}% > ${MAX_MEM_PERCENT}%"
        echo -e "${RED}⚠️  High Memory Alert: ${mem_percent}%${NC}"
        return 3
    fi
    
    echo -e "${GREEN}✓ Resources OK - CPU: ${cpu_percent}%, Memory: ${mem_percent}%${NC}"
    return 0
}

# Function to check system resources
check_system_resources() {
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    local mem_info=$(free -m | awk 'NR==2{printf "%.1f", $3*100/$2}')
    
    log_message "System Stats - CPU: ${cpu_usage}%, Memory: ${mem_info}%"
    echo -e "${YELLOW}System - CPU: ${cpu_usage}%, Memory: ${mem_info}%${NC}"
}

# Function to check for restart loops
check_restart_loops() {
    local container_name="xc8okk8soc0gk4so4g4sckoc"
    local restart_count=$(docker inspect "$container_name" 2>/dev/null | grep -o '"RestartCount": [0-9]*' | awk '{print $2}')
    
    if [ -z "$restart_count" ]; then
        return 1
    fi
    
    if [ "$restart_count" -gt 5 ]; then
        log_message "WARNING: Container has restarted $restart_count times"
        echo -e "${RED}⚠️  Container restart loop detected: $restart_count restarts${NC}"
        return 2
    fi
    
    echo -e "${GREEN}✓ Container stable (Restarts: $restart_count)${NC}"
    return 0
}

# Main monitoring loop
echo -e "${YELLOW}Starting resource monitoring for Social Media Scheduler...${NC}"
log_message "Starting resource monitoring"

# Run checks
check_system_resources
check_container_resources
check_restart_loops

# If running as a continuous monitor (pass "watch" as argument)
if [ "$1" == "watch" ]; then
    echo -e "${YELLOW}Continuous monitoring mode - Press Ctrl+C to stop${NC}"
    while true; do
        sleep 10
        clear
        echo -e "${YELLOW}=== Resource Monitor - $(date '+%Y-%m-%d %H:%M:%S') ===${NC}"
        check_system_resources
        check_container_resources
        check_restart_loops
    done
fi