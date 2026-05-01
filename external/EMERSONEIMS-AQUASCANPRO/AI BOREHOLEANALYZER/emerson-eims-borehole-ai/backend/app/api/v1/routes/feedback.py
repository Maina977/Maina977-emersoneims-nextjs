import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models.feedback import Feedback
from app.database.models.borehole import Analysis
from app.dependencies import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)


class FeedbackRequest(BaseModel):
    rating: int
    comment: Optional[str] = None
    analysis_id: Optional[int] = None
    actual_depth_m: Optional[float] = None
    actual_yield_m3h: Optional[float] = None
    borehole_success: Optional[str] = None  # success, partial, dry


@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    body: FeedbackRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = int(current_user) if isinstance(current_user, str) else current_user

    if body.rating < 1 or body.rating > 5:
        raise HTTPException(status_code=422, detail="Rating must be between 1 and 5")

    if body.analysis_id:
        analysis = db.query(Analysis).filter(Analysis.id == body.analysis_id).first()
        if not analysis:
            raise HTTPException(status_code=404, detail=f"Analysis {body.analysis_id} not found")

    fb = Feedback(
        user_id=user_id,
        analysis_id=body.analysis_id,
        rating=body.rating,
        comment=body.comment,
        actual_depth_m=body.actual_depth_m,
        actual_yield_m3h=body.actual_yield_m3h,
        borehole_success=body.borehole_success,
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)

    logger.info(f"Feedback {fb.id} submitted by user {user_id} (rating={body.rating})")
    return {
        "id": fb.id,
        "rating": fb.rating,
        "comment": fb.comment,
        "analysis_id": fb.analysis_id,
        "created_at": fb.created_at.isoformat(),
        "status": fb.status,
    }


@router.get("/my")
async def get_my_feedback(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = int(current_user) if isinstance(current_user, str) else current_user
    feedbacks = db.query(Feedback).filter(Feedback.user_id == user_id).order_by(Feedback.created_at.desc()).all()

    return {
        "feedbacks": [
            {
                "id": fb.id,
                "rating": fb.rating,
                "comment": fb.comment,
                "analysis_id": fb.analysis_id,
                "status": fb.status,
                "created_at": fb.created_at.isoformat() if fb.created_at else None,
            }
            for fb in feedbacks
        ]
    }