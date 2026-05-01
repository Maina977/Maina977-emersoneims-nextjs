from fastapi import APIRouter
from app.api.v2.routes import analysis_v2, reports_v2

api_v2_router = APIRouter(prefix="/v2")

api_v2_router.include_router(analysis_v2.router, prefix="/analysis", tags=["analysis-v2"])
api_v2_router.include_router(reports_v2.router, prefix="/reports", tags=["reports-v2"])