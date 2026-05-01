# Borehole AI Platform - Backend Setup & Deployment Guide

Complete production-grade setup for the comprehensive hydrogeological analysis system.

## Quick Start

```bash
# 1. Create Python environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements/base.txt

# 3. Setup PostgreSQL + PostGIS
# macOS: brew install postgresql postgis
# Ubuntu: sudo apt-get install postgresql postgresql-contrib postgis
# Windows: Use installer

# 4. Create database
createdb borehole_ai
psql borehole_ai -c "CREATE EXTENSION postgis; CREATE EXTENSION postgis_topology;"

# 5. Set environment variables
cp .env.example .env
# Edit .env with your settings

# 6. Initialize database
python backend/app/database/config.py init

# 7. Start Redis
redis-server  # Or: docker run -d -p 6379:6379 redis:latest

# 8. Start Celery worker
celery -A app.services.celery_app worker -l info -Q default,satellite,ml,reports

# 9. Start Celery Beat (scheduler)
celery -A app.services.celery_app beat -l info

# 10. Start FastAPI server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Architecture

### Database Layer
- **PostgreSQL 12+**: Primary data store
- **PostGIS**: Spatial queries and geometry operations
- **Alembic**: Schema versioning and migrations
- **Connection pooling**: Up to 30 concurrent connections

### Task Queue
- **Celery 5.3+**: Async task processing
- **Redis 6+**: Message broker and result backend
- **4 queues**: default, satellite, ml, reports

### API Layer
- **FastAPI**: Modern async web framework
- **Pydantic**: Request/response validation
- **CORS**: Cross-origin support for frontend
- **Auto-docs**: Swagger UI at `/docs`

### Services Layer

#### Satellite Integration
- **Earth Engine Python API**: 6 data sources
  - Sentinel-1/2 (optical + SAR)
  - Landsat 8/9 (multispectral + thermal)
  - GRACE (gravity anomalies)
  - SRTM (30m DEM)
  - CHIRPS (rainfall history)
  - MERRA2 (meteorology)

#### Topographic Analysis (DEM Processor)
- Slope/aspect computation
- D8 flow direction routing
- Flow accumulation
- Topographic Wetness Index (TWI) - **Key success metric (weight 0.15)**
- Curvature analysis
- Valley/ridge/depression detection
- Hillshade generation

#### Spectral Intelligence (28 Indices)
- **Vegetation (8)**: NDVI, EVI, GNDVI, SAVI, MSAVI, NDII, LAI, ARVI
- **Water (6)**: NDWI, MNDWI, AWI, AWEI_sh, AWEI_nsh, WRI
- **Soil (7)**: BSI, BI, SI, NDSI, BI2, CI, FC
- **Thermal (7)**: NDBI, NDMI, NDLI, LST, NDTI, SR, GCVI

#### Geological Analysis
- Automated lineament detection (fault/fracture/contact)
- Aquifer type classification (5 categories)
- Bedrock depth estimation via gravity inversion
- Geological unit clustering
- **Aquifer favorability mapping (0-100 score)**

#### ML Pipeline (Week 2)
- 5-model ensemble (LSTM for temporal, XGBoost for spatial, etc.)
- SHAP explainability
- Groundwater yield prediction
- Contamination risk assessment
- Water quality prediction

#### Financial Analysis (Week 3)
- Itemized cost estimation
- 10-year financial modeling (NPV, IRR, payback)
- Risk-adjusted returns

#### Report Generation (Week 3)
- PDF/DOCX/GeoJSON/Shapefile export
- Maps and visualizations
- Executive summaries

## File Structure

```
backend/
├── app/
│   ├── main.py                           # FastAPI app entry point
│   ├── api/
│   │   └── routes/
│   │       ├── satellite.py              # Earth Engine endpoints
│   │       ├── analysis.py               # Site analysis endpoints
│   │       └── health.py                 # Health/status endpoints
│   ├── core/
│   │   └── schemas.py                    # Pydantic models (request/response)
│   ├── database/
│   │   ├── config.py                     # DB connection & migrations
│   │   └── models.py                     # SQLAlchemy ORM (11 models, 200+ cols)
│   └── services/
│       ├── celery_app.py                 # Celery config & tasks
│       ├── earth_engine_client.py        # Google Earth Engine integration (12 methods)
│       ├── dem_processor.py              # Topographic analysis (D8, TWI, slope, etc.)
│       ├── spectral_indices.py           # 28 spectral index calculations
│       └── geology.py                    # Geological classification & favorability
├── tests/
│   ├── conftest.py                       # Pytest fixtures
│   └── test_integration.py               # 40+ integration tests
├── requirements/
│   └── base.txt                          # Python dependencies
├── docker-compose.yml                    # Local dev environment
├── Dockerfile                            # Production image
├── .env.example                          # Environment template
├── Makefile                              # Common commands
└── README.md                             # This file
```

## Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=borehole_ai
DB_POOL_SIZE=10
DB_POOL_RECYCLE=3600
DB_ECHO_SQL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# API
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true
CORS_ORIGINS=http://localhost:3000,http://localhost:8080

# Earth Engine
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Logging
LOG_LEVEL=INFO
```

## API Endpoints

### Health & Status
- `GET /api/v1/health` - Health check
- `GET /api/v1/status` - System status
- `GET /api/v1/version` - API version

### Satellite Data
- `POST /api/v1/satellite/query` - Query satellite imagery
- `GET /api/v1/satellite/dem/{location_id}` - Get DEM
- `GET /api/v1/satellite/climate/{location_id}` - Get climate data
- `GET /api/v1/satellite/gravity/{location_id}` - Get gravity anomalies

### Spectral Indices
- `POST /api/v1/satellite/indices` - Compute all 28 indices
- `GET /api/v1/satellite/indices/{indices_id}` - Retrieve computed indices

### Site Analysis
- `POST /api/v1/analysis/site` - Analyze site (triggers async pipeline)
- `GET /api/v1/analysis/status/{job_id}` - Check job progress
- `GET /api/v1/analysis/geology/{site_id}` - Get geological analysis
- `POST /api/v1/analysis/risk/{site_id}` - Assess risks (5 dimensions)
- `POST /api/v1/analysis/water-quality/{site_id}` - Predict water quality
- `GET /api/v1/analysis/cost-estimate/{site_id}` - Estimate costs

## Database Models (11 Tables)

1. **BoreholeSite** - Primary site records (40+ columns)
2. **WaterQualityPrediction** - 5 parameters with confidence scores
3. **RiskAssessment** - 5-dimensional risk scoring
4. **CostEstimation** - Itemized costs + financial metrics
5. **HistoricalBorehole** - 10,000+ record reference database
6. **SatelliteData** - Cached satellite query metadata
7. **SpectralIndices** - Computed indices storage (28 fields)
8. **MLModel** - Model registry with versioning
9. **AnalysisJob** - Async job tracking
10. **User** - Account management (future)
11. **AuditLog** - Change tracking (future)

## Celery Tasks

### Satellite Queue (`satellite.*`)
- `query_satellite` - Download satellite imagery
- `compute_spectral_indices` - Calculate 28 indices

### ML Queue (`ml.*`)
- `predict_aquifer` - ML ensemble inference
- `predict_water_quality` - Quality parameters
- `retrain_models` - Daily scheduled retraining

### Reports Queue (`reports.*`)
- `generate_report` - PDF/DOCX/GeoJSON export

### Scheduled Tasks (Beat)
- Every 5 min: `health_check`
- Daily 2 AM: `retrain_models`

## Testing

```bash
# Run all tests
pytest backend/tests/ -v

# Run specific test class
pytest backend/tests/test_integration.py::TestDEMProcessor -v

# Run integration tests with coverage
pytest backend/tests/ --cov=app --cov-report=html

# Test individual components
python -c "from app.database.models import BoreholeSite; print('✓ Models')"
python -c "from app.services.earth_engine_client import EarthEngineClient; print('✓ EE')"
python -c "from app.services.dem_processor import DEMProcessor; print('✓ DEM')"
python -c "from app.services.spectral_indices import SpectralIndicesCalculator; print('✓ Indices')"
python -c "from app.services.geology import GeologicalClassifier; print('✓ Geology')"

# Test database
python backend/app/database/config.py health
python backend/app/database/config.py postgis
```

## Database Management

```bash
# Initialize (create tables)
python backend/app/database/config.py init

# Create migration
python backend/app/database/config.py migrate "Add new column"

# Check migration status
alembic current

# List migrations
alembic branches
```

## Docker Deployment

```bash
# Build image
docker build -f backend/Dockerfile -t borehole-ai-backend:latest .

# Run with compose
docker-compose -f backend/docker-compose.yml up -d

# View logs
docker-compose logs -f api

# Stop everything
docker-compose down
```

## Production Checklist

- [ ] PostgreSQL 12+ with PostGIS extension installed
- [ ] Redis 6+ running (not localhost for HA)
- [ ] Earth Engine service account JSON configured
- [ ] SSL certificates for HTTPS
- [ ] Environment variables secured (use Vault/Secrets Manager)
- [ ] Database backups automated (hourly/daily)
- [ ] Celery workers scaled (min 4 for satellite, 2 for ML)
- [ ] API behind load balancer (nginx/ALB)
- [ ] Monitoring (Prometheus/CloudWatch) configured
- [ ] Alerting (PagerDuty/Slack) set up for failures

## Performance Optimization

### Database
- Indexes on: `user_id`, `location`, `created_at`
- Partitioning for >10M rows
- Read replicas for reporting

### Caching
- Redis for satellite data (24h TTL)
- Model predictions cached (7 days)

### Celery
- Worker prefetch: 4 tasks max
- Task soft limit: 1 hour
- Result expiration: 24 hours

### API
- Gzip compression enabled
- Response caching headers set
- Rate limiting (future)

## Monitoring & Logging

```bash
# API logs
tail -f /var/log/borehole-ai/api.log

# Celery logs
tail -f /var/log/borehole-ai/celery.log

# Database logs
tail -f /var/log/postgresql/postgresql.log

# View Celery stats
celery -A app.services.celery_app inspect stats
celery -A app.services.celery_app inspect active

# Monitor task queue
celery -A app.services.celery_app events
```

## Common Issues & Solutions

### PostgreSQL Connection Fails
```bash
# Check service running
sudo service postgresql status

# Check port
psql -h localhost -U postgres -d postgres

# Verify PostGIS
psql -d borehole_ai -c "SELECT PostGIS_version();"
```

### Redis Connection Issues
```bash
# Check Redis running
redis-cli ping  # Should return PONG

# Check connectivity
redis-cli -h localhost -p 6379 ping
```

### Earth Engine Authentication Failed
```bash
# Validate credentials file
python -c "import ee; ee.Initialize()" 

# Re-authenticate if needed
earthengine authenticate
```

### Celery Tasks Not Processing
```bash
# Check worker status
celery -A app.services.celery_app inspect active

# Check queue depth
redis-cli LLEN celery

# Restart worker
pkill -f "celery worker"
celery -A app.services.celery_app worker -l info -Q default,satellite,ml,reports
```

## Support

For issues or questions:
1. Check logs: `tail -f /var/log/borehole-ai/*.log`
2. Run health checks: `GET /api/v1/status`
3. Verify database: `python backend/app/database/config.py health`
4. Check Celery queue: `celery inspect active`

## License

© 2024 Borehole AI Platform. All rights reserved.
