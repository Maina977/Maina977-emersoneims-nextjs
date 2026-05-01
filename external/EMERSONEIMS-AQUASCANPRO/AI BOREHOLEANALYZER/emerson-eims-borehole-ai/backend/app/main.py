"""
FastAPI Main Application
Initializes the Borehole AI analysis platform API with all routes and middleware
"""

import logging
import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.database.config import init_db, db_manager, get_db
from app.services.celery_app import celery_app
from app.api.routes import health
from app.api import api_router

# ============ LOGGING SETUP ============

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============ LIFESPAN CONTEXT ============

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan (startup/shutdown)"""
    # Startup
    logger.info("=" * 70)
    logger.info("BOREHOLE AI PLATFORM - STARTUP")
    logger.info("=" * 70)

    try:
        # Initialize database
        logger.info("Initializing database tables...")
        init_db()
        logger.info("✓ Database initialized")

        # Health checks
        if db_manager.health_check():
            logger.info("✓ Database connection: OK")
        else:
            logger.warning("✗ Database connection failed")

        if db_manager.test_postgis():
            logger.info("✓ PostGIS: Available")
        else:
            logger.warning("✗ PostGIS: Not available")

        # Celery health
        try:
            celery_health = celery_app.send_task('app.services.tasks.health_check').get(timeout=5)
            logger.info(f"✓ Celery queue: {celery_health.get('status', 'unknown')}")
        except Exception as e:
            logger.warning(f"Celery health check failed: {e}")

        logger.info("API server ready for requests")
        logger.info("=" * 70)

    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise

    yield  # Application running

    # Shutdown
    logger.info("Shutting down application...")
    try:
        db_manager.engine.dispose()
        logger.info("✓ Database connections closed")
    except Exception as e:
        logger.error(f"Shutdown error: {e}")


# ============ FASTAPI APP CREATION ============

app = FastAPI(
    title="Borehole AI Analysis Platform",
    description="Comprehensive hydrogeological analysis using satellite data, ML, and field geophysics",
    version="1.0.0",
    lifespan=lifespan
)

# ============ MIDDLEWARE ============

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:8080").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


# ============ EXCEPTION HANDLERS ============

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )


# ============ ROUTE REGISTRATION ============

# Health & Status
app.include_router(health.router)

# v1 API routes (auth, analysis, reports, payments, feedback, export, admin, users, webhooks)
app.include_router(api_router, prefix="/api/v1")


# ============ ROOT ENDPOINTS ============

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "Borehole AI Analysis Platform",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


@app.get("/api/v1")
async def api_root():
    """API v1 root"""
    return {
        "api_version": "v1",
        "endpoints": {
            "health": "/api/v1/health",
            "status": "/api/v1/status",
            "satellite": "/api/v1/satellite",
            "analysis": "/api/v1/analysis",
            "docs": "/docs"
        }
    }


# ============ STARTUP EVENTS ============

@app.on_event("startup")
async def startup_event():
    """Additional startup event"""
    logger.info("FastAPI startup event triggered")


@app.on_event("shutdown")
async def shutdown_event():
    """Additional shutdown event"""
    logger.info("FastAPI shutdown event triggered")


# ============ MAIN ENTRY POINT ============

if __name__ == "__main__":
    import uvicorn

    # Get configuration from environment
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    reload = os.getenv("API_RELOAD", "true").lower() == "true"

    logger.info(f"Starting Uvicorn: {host}:{port}")

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )