from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FeedbackRequest(BaseModel):
    rating: int
    comment: Optional[str] = None
    analysis_id: Optional[int] = None

class FeedbackResponse(BaseModel):
    id: int
    rating: int
    comment: Optional[str]
    created_at: datetime
    status: str