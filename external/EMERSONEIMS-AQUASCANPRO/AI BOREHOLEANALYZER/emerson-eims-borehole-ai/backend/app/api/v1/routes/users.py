import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.database.models.user import User
from app.database.models.borehole import Analysis
from app.database.models.subscription import Subscription
from app.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


def _get_user(current_user, db: Session) -> User:
    user_id = int(current_user) if isinstance(current_user, str) else current_user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/me")
async def get_current_user_info(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = _get_user(current_user, db)
    sub = db.query(Subscription).filter(
        Subscription.user_id == user.id,
        Subscription.status == "active",
    ).first()

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "role": user.role,
        "is_verified": user.is_verified,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "subscription_tier": sub.tier if sub else "free",
        "credits_remaining": user.credits_remaining,
    }


@router.put("/me")
async def update_user(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = _get_user(current_user, db)

    if body.email and body.email != user.email:
        existing = db.query(User).filter(User.email == body.email).first()
        if existing:
            raise HTTPException(status_code=409, detail="Email already in use")
        user.email = body.email

    if body.name is not None:
        user.name = body.name
    if body.phone is not None:
        user.phone = body.phone

    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone": user.phone,
        "updated_at": user.updated_at.isoformat(),
    }


@router.get("/me/analyses")
async def get_user_analyses(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user = _get_user(current_user, db)
    total = db.query(func.count(Analysis.id)).filter(Analysis.user_id == user.id).scalar() or 0
    analyses = (
        db.query(Analysis)
        .filter(Analysis.user_id == user.id)
        .order_by(Analysis.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "analyses": [
            {
                "id": a.id,
                "latitude": a.latitude,
                "longitude": a.longitude,
                "probability": a.probability,
                "recommended_depth_m": a.recommended_depth_m,
                "status": a.status,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in analyses
        ],
    }