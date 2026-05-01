from fastapi import APIRouter
from app.api.v1.routes import analysis, reports, auth, users, payments, webhooks, admin, feedback, export

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(webhooks.router, prefix="/webhooks", tags=["webhooks"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(export.router, prefix="/export", tags=["export"])