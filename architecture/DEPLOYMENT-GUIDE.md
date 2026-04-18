# Quvex ERP - Production Deployment Guide

## Prerequisites
- Docker & Docker Compose v2+
- Domain DNS configured (quvex.app, demo.quvex.app → server IP)
- Ports 80, 443 open
- 4GB+ RAM, 2+ CPU cores

## Quick Start (Demo)
```bash
git clone <repo>
cd smallFactoryApi
docker compose -f docker-compose.demo.yml up -d
```
- UI: http://localhost:3001
- API: http://localhost:5053
- Hangfire: http://localhost:5053/hangfire

## Environment Variables

### API
| Variable | Description | Default |
|----------|-------------|---------|
| `DB_CONNECTION_STRING` | PostgreSQL connection | appsettings value |
| `JWT_SECRET_KEY` | JWT signing key | appsettings value |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `REDIS_CONNECTION` | Redis host:port | (empty = in-memory) |
| `SENTRY_DSN` | Sentry error tracking | (empty = disabled) |
| `ASPNETCORE_FILEPATH` | File upload path | uploads |
| `AZURE_STORAGE_CONNECTION` | Azure Blob storage | (empty = local disk) |

### UI
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_ENDPOINT` | API base URL |

## Services

### PostgreSQL
- Image: postgres:16-alpine
- Port: 5432 (internal), 5434 (demo external)
- Auto-migration on API startup

### Redis
- Image: redis:7-alpine
- Port: 6379 (internal), 6380 (demo external)
- Used for distributed caching (tenant resolution, session)

### Hangfire
- Dashboard: /hangfire (local requests only)
- Storage: PostgreSQL (auto-creates hangfire schema)
- Jobs: stock alerts, delayed orders (daily 08:00 UTC)

### Backup
- Daily pg_dump with gzip compression
- 30-day retention
- Volume: backup-data

## SSL Setup
See [SSL-SETUP.md](SSL-SETUP.md)

## Monitoring
See [SLA-MONITORING.md](SLA-MONITORING.md)

## Health Check
```bash
curl https://demo.quvex.app/health
```

## Scaling
- API: Stateless, scale horizontally with load balancer
- Redis required for multi-instance (distributed cache)
- File storage: Switch to Azure Blob/S3 for multi-instance
- Database: Read replicas for reporting queries
