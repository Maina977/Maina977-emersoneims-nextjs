import logging
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.database.models.user import User
from app.database.models.borehole import Analysis
from app.database.models.payment import Payment
from app.database.models.subscription import Subscription
from app.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


def _require_admin(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user) if isinstance(current_user, str) else current_user
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


@router.get("/stats")
async def get_admin_stats(admin: User = Depends(_require_admin), db: Session = Depends(get_db)):
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    total_users = db.query(func.count(User.id)).scalar() or 0
    total_analyses = db.query(func.count(Analysis.id)).scalar() or 0
    total_revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).filter(Payment.status == "completed").scalar()
    active_subs = db.query(func.count(Subscription.id)).filter(Subscription.status == "active").scalar() or 0
    analyses_today = db.query(func.count(Analysis.id)).filter(Analysis.created_at >= today).scalar() or 0
    new_users_today = db.query(func.count(User.id)).filter(User.created_at >= today).scalar() or 0

    return {
        "total_users": total_users,
        "total_analyses": total_analyses,
        "total_revenue": float(total_revenue),
        "active_subscriptions": active_subs,
        "analyses_today": analyses_today,
        "new_users_today": new_users_today,
    }


@router.get("/users")
async def list_users(
    limit: int = 100,
    offset: int = 0,
    admin: User = Depends(_require_admin),
    db: Session = Depends(get_db),
):
    total = db.query(func.count(User.id)).scalar() or 0
    users = db.query(User).order_by(User.created_at.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "name": u.name,
                "role": u.role,
                "is_active": u.is_active,
                "credits_remaining": u.credits_remaining,
                "created_at": u.created_at.isoformat() if u.created_at else None,
                "last_login": u.last_login.isoformat() if u.last_login else None,
            }
            for u in users
        ],
    }


@router.get("/analyses")
async def list_analyses(
    limit: int = 100,
    offset: int = 0,
    admin: User = Depends(_require_admin),
    db: Session = Depends(get_db),
):
    total = db.query(func.count(Analysis.id)).scalar() or 0
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "analyses": [
            {
                "id": a.id,
                "user_id": a.user_id,
                "latitude": a.latitude,
                "longitude": a.longitude,
                "probability": a.probability,
                "status": a.status,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in analyses
        ],
    }