# Attallah Assistant - Docker Deployment Guide

## 🐳 Docker Setup

### Prerequisites
- Docker and Docker Compose installed
- At least 2GB RAM available
- Port 3000 available

### Quick Start

1. **Clone and prepare the repository:**
```bash
git clone <repository-url>
cd attallah-assistant
```

2. **Environment Configuration:**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

3. **Build and run with Docker Compose:**
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Variables

#### Required Variables
```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

#### Optional Variables (for Ollama)
```env
# Use Ollama instead of ZAI
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=llama2
```

### Docker Services

#### Main Services
- **attallah-assistant**: Main application (Next.js)
- **redis**: Caching and session management
- **nginx**: Reverse proxy and load balancer

#### Optional Services
- **ollama**: Local LLM service (uncomment in docker-compose.yml)

### 📊 Performance Monitoring

#### Memory Management
- **Container Limits**: 1GB RAM, 0.5 CPU
- **Node.js Memory**: 512MB max old space
- **Automatic Restart**: If memory > 85%

#### Log Management
- **Log Rotation**: Automatic when logs > 10MB
- **Log Retention**: Keep logs for 7 days
- **Structured Logging**: JSON format for easy parsing

#### Health Checks
- **Application Health**: Every 30 seconds
- **Redis Health**: Every 30 seconds
- **Automatic Recovery**: Restart on failure

### 🔧 Configuration Files

#### Docker Compose (`docker-compose.yml`)
- Service definitions
- Resource limits
- Network configuration
- Volume mappings

#### Nginx Configuration (`nginx.conf`)
- Reverse proxy setup
- SSL/TLS termination
- Rate limiting
- Caching rules
- Security headers

#### Redis Configuration (`redis.conf`)
- Memory limits: 256MB
- LRU eviction policy
- Persistence settings
- Security configurations

### 🚀 Production Deployment

#### 1. Production Build
```bash
# Build production image
docker-compose build

# Start production services
docker-compose -f docker-compose.yml up -d
```

#### 2. SSL/TLS Setup
```bash
# Create SSL directory
mkdir -p ssl

# Add your SSL certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Update nginx.conf to use SSL
```

#### 3. Monitoring Setup
```bash
# View real-time logs
docker-compose logs -f attallah-assistant

# Monitor resource usage
docker stats

# Check health status
curl http://localhost/health
```

### 📈 Scaling and Performance

#### Horizontal Scaling
```bash
# Scale application instances
docker-compose up -d --scale attallah-assistant=3
```

#### Resource Optimization
- **Memory**: Adjust limits in docker-compose.yml
- **CPU**: Set appropriate CPU limits
- **Storage**: Use persistent volumes for data

#### Caching Strategy
- **Redis**: Application-level caching
- **Nginx**: Static file caching
- **Browser**: Cache headers for static assets

### 🔒 Security Considerations

#### Container Security
- Non-root user execution
- Read-only filesystem where possible
- Limited capabilities
- Network isolation

#### Application Security
- Rate limiting (10 requests/second)
- Security headers
- Input validation
- Environment variable protection

#### Network Security
- Private network for internal services
- Firewall rules
- SSL/TLS encryption
- API endpoint protection

### 🛠️ Maintenance

#### Log Management
```bash
# View application logs
docker-compose logs attallah-assistant

# View nginx logs
docker-compose logs nginx

# View redis logs
docker-compose logs redis

# Clean up old logs
docker exec attallah-assistant find /app/logs -name "*.log.*" -mtime +7 -delete
```

#### Backup and Recovery
```bash
# Backup Redis data
docker exec attallah-redis redis-cli BGSAVE

# Backup logs
docker cp attallah-assistant:/app/logs ./backup/logs

# Restore from backup
docker cp ./backup/logs attallah-assistant:/app/
```

#### Updates and Upgrades
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build

# Clean up unused images
docker image prune
```

### 🐛 Troubleshooting

#### Common Issues

1. **High Memory Usage**
```bash
# Check memory usage
docker stats attallah-assistant

# Restart service
docker-compose restart attallah-assistant

# Check memory logs
docker-compose logs attallah-assistant | grep -i memory
```

2. **Application Not Starting**
```bash
# Check logs
docker-compose logs attallah-assistant

# Check health
curl http://localhost:3000/api/health

# Restart service
docker-compose restart attallah-assistant
```

3. **Redis Connection Issues**
```bash
# Check Redis status
docker-compose logs redis

# Test Redis connection
docker exec -it attallah-redis redis-cli ping

# Restart Redis
docker-compose restart redis
```

#### Performance Tuning
- Adjust memory limits based on usage
- Optimize Redis memory settings
- Tune nginx worker processes
- Monitor and adjust caching strategies

### 📊 Monitoring and Metrics

#### Application Metrics
- Response times
- Error rates
- Memory usage
- CPU usage

#### System Metrics
- Container resource usage
- Network traffic
- Disk I/O
- System load

#### Logging and Analytics
- Structured JSON logs
- Error tracking
- Performance monitoring
- User analytics

---

## 🚀 Quick Commands Reference

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart attallah-assistant

# Execute command in container
docker exec -it attallah-assistant sh

# Check health
curl http://localhost:3000/api/health

# Monitor resources
docker stats

# Clean up
docker system prune -a
```