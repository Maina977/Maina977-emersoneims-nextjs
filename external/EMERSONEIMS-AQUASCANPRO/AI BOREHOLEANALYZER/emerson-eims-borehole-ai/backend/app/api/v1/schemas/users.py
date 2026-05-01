from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    phone: Optional[str]
    subscription_tier: str
    credits_remaining: int
    created_at: datetime

class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None