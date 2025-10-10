#!/bin/bash

set -e

echo "🌟 Attallah Assistant Docker Entrypoint"

# Create logs directory
mkdir -p /app/logs

# Set permissions
chown -R nextjs:nodejs /app/logs

# Switch to non-root user
exec su nextjs -c "$@"