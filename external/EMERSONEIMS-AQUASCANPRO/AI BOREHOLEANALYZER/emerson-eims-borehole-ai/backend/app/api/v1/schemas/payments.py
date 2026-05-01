from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentRequest(BaseModel):
    amount: float
    currency: str = "KES"
    payment_method: str = "mpesa"
    phone_number: Optional[str] = None
    description: Optional[str] = None

class PaymentResponse(BaseModel):
    payment_id: str
    amount: float
    currency: str
    status: str
    checkout_url: Optional[str] = None
    created_at: datetime