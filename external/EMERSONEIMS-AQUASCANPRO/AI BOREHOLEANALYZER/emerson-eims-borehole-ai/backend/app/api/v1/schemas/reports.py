from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ReportRequest(BaseModel):
    analysis_id: int
    format: str = "pdf"
    include_charts: bool = True

class ReportResponse(BaseModel):
    id: str
    download_url: str
    created_at: datetime
    expires_at: datetime