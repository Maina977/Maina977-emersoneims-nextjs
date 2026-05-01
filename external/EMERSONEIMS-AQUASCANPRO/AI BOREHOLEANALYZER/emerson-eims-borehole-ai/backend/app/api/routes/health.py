"""
API Route: Health Check & System Status
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import logging
from datetime import datetime

from app.database.config import get_db, db_manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1", tags=["health"])


@router.get("/health")
async def health_check():
    """Health check endpoint - confirms API is running"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }


@router.get("/status")
async def system_status(db: Session = Depends(get_db)):
    """Get system status including database and services"""
    try:
        # Database check
        db_health = db_manager.health_check()
        postgis_available = db_manager.test_postgis()

        return {
            "status": "operational" if db_health else "degraded",
            "timestamp": datetime.utcnow().isoformat(),
            "services": {
                "api": "healthy",
                "database": "healthy" if db_health else "unhealthy",
                "postgis": "available" if postgis_available else "unavailable"
            },
            "version": "1.0.0"
        }

    except Exception as e:
        logger.error(f"Status check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }


@router.get("/version")
async def get_version():
    """Get API version"""
    return {
        "version": "1.0.0",
        "api_version": "v1",
        "build_date": "2024-01-15",
        "components": {
            "satellite_integration": "enabled",
            "ml_models": "enabled",
            "report_generation": "beta"
        }
    }
