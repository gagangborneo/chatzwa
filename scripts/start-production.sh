#!/bin/bash

# Production startup script for Attallah Assistant
# This script handles memory management, logging, and monitoring

set -e

echo "🚀 Starting Attallah Assistant Production Server..."

# Environment variables for production
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Memory management
export NODE_OPTIONS="--max-old-space-size=512 --optimize-for-size --max-executable-size=96"

# Log management
export LOG_LEVEL=info
export LOG_FILE_PATH=/app/logs/app.log

# Create logs directory if it doesn't exist
mkdir -p /app/logs

# Rotate logs if they're too large
rotate_logs() {
    if [ -f "/app/logs/app.log" ] && [ $(stat -f%z "/app/logs/app.log" 2>/dev/null || stat -c%s "/app/logs/app.log" 2>/dev/null) -gt 10485760 ]; then
        echo "📝 Rotating logs..."
        mv /app/logs/app.log "/app/logs/app.log.$(date +%Y%m%d_%H%M%S)"
        gzip "/app/logs/app.log.$(date +%Y%m%d_%H%M%S)" &
    fi
}

# Clean up old logs (keep last 7 days)
cleanup_old_logs() {
    echo "🧹 Cleaning up old logs..."
    find /app/logs -name "*.log.*" -type f -mtime +7 -delete
}

# Memory monitoring
monitor_memory() {
    echo "📊 Starting memory monitoring..."
    while true; do
        MEMORY_USAGE=$(ps -o pid,ppid,cmd,%mem,%cpu --sort=-%mem -C node | head -2 | tail -1 | awk '{print $4}')
        CPU_USAGE=$(ps -o pid,ppid,cmd,%mem,%cpu --sort=-%cpu -C node | head -2 | tail -1 | awk '{print $5}')
        
        echo "$(date): Memory Usage: ${MEMORY_USAGE}%, CPU Usage: ${CPU_USAGE}%" >> /app/logs/monitoring.log
        
        # Restart if memory usage is too high (above 85%)
        if (( $(echo "$MEMORY_USAGE > 85" | bc -l) )); then
            echo "⚠️  High memory usage detected: ${MEMORY_USAGE}%"
            echo "$(date): High memory usage detected, restarting service..." >> /app/logs/monitoring.log
            # Send signal to restart (handled by process manager)
            kill -HUP 1
        fi
        
        sleep 30
    done
}

# Health check
health_check() {
    echo "🏥 Starting health check..."
    while true; do
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            echo "$(date): Health check passed" >> /app/logs/health.log
        else
            echo "$(date): Health check failed" >> /app/logs/health.log
            # Attempt to restart
            kill -HUP 1
        fi
        sleep 60
    done
}

# Graceful shutdown
graceful_shutdown() {
    echo "🛑 Received shutdown signal, gracefully shutting down..."
    # Add any cleanup tasks here
    exit 0
}

# Trap signals
trap graceful_shutdown SIGTERM SIGINT

# Start monitoring in background
monitor_memory &
MONITOR_PID=$!

health_check &
HEALTH_PID=$!

# Start the application
echo "🌟 Starting Attallah Assistant application..."
node server.js &

# Wait for the application to start
sleep 5

# Main loop
while true; do
    # Rotate logs daily
    rotate_logs
    
    # Clean up old logs weekly
    if [ $(date +%u) -eq 1 ]; then  # Monday
        cleanup_old_logs
    fi
    
    sleep 86400  # 24 hours
done &

# Wait for all background processes
wait $MONITOR_PID
wait $HEALTH_PID