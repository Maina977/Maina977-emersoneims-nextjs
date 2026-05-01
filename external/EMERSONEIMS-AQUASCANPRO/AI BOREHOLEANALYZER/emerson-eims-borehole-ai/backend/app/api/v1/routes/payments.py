import logging
import uuid
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models.payment import Payment
from app.database.models.borehole import Analysis
from app.services.payment import payment_service

router = APIRouter()
logger = logging.getLogger(__name__)


class PaymentInitRequest(BaseModel):
    provider: str  # mpesa, flutterwave, paystack
    amount: float
    currency: str = "KES"
    report_id: Optional[str] = None
    analysis_id: int
    customer_email: str
    customer_phone: Optional[str] = None
    customer_name: Optional[str] = None


@router.post("/initialize")
async def initialize_payment(request: PaymentInitRequest, db: Session = Depends(get_db)):
    """Initialize payment for unlocking full report."""
    analysis = db.query(Analysis).filter(Analysis.id == request.analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    txn_id = str(uuid.uuid4())
    payment = Payment(
        user_id=analysis.user_id,
        transaction_id=txn_id,
        amount=request.amount,
        currency=request.currency,
        status="pending",
        payment_method=request.provider,
        description=f"Report unlock for analysis {request.analysis_id}",
    )
    db.add(payment)
    db.commit()

    try:
        result = await payment_service.process_payment(
            provider_name=request.provider,
            amount=request.amount,
            currency=request.currency,
            customer_email=request.customer_email,
            customer_phone=request.customer_phone,
            metadata={
                "report_id": request.report_id,
                "analysis_id": str(request.analysis_id),
                "customer_name": request.customer_name,
            },
        )

        if request.provider == "mpesa":
            payment.mpesa_receipt_number = result.get("checkout_request_id")
        else:
            payment.stripe_payment_intent_id = result.get("reference") or result.get("transaction_reference")
        db.commit()

        return {
            "success": True,
            "payment_id": txn_id,
            "provider": request.provider,
            "checkout_url": result.get("checkout_url"),
            "checkout_request_id": result.get("checkout_request_id"),
            "message": result.get("message", "Payment initiated successfully"),
            "status": "pending",
        }

    except Exception as e:
        payment.status = "failed"
        db.commit()
        logger.error(f"Payment init failed: {e}")
        raise HTTPException(status_code=502, detail="Payment provider error")


@router.get("/verify/{payment_id}")
async def verify_payment(payment_id: str, db: Session = Depends(get_db)):
    """Verify payment status."""
    payment = db.query(Payment).filter(Payment.transaction_id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status == "completed":
        return {
            "payment_id": payment_id,
            "status": payment.status,
            "amount": payment.amount,
            "currency": payment.currency,
            "completed_at": payment.completed_at.isoformat() if payment.completed_at else None,
        }

    reference = payment.mpesa_receipt_number or payment.stripe_payment_intent_id
    if reference:
        try:
            verification = await payment_service.verify_payment(
                provider_name=payment.payment_method,
                reference=reference,
            )
            if verification.get("status") == "completed":
                payment.status = "completed"
                payment.completed_at = datetime.utcnow()
                db.commit()
        except Exception as e:
            logger.warning(f"Payment verification error: {e}")

    return {
        "payment_id": payment_id,
        "status": payment.status,
        "amount": payment.amount,
        "currency": payment.currency,
        "completed_at": payment.completed_at.isoformat() if payment.completed_at else None,
    }


@router.post("/webhook/{provider}")
async def payment_webhook(provider: str, request: Request, db: Session = Depends(get_db)):
    """Webhook endpoint for payment providers."""
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    headers = dict(request.headers)

    if provider not in payment_service.providers:
        raise HTTPException(status_code=400, detail=f"Unknown provider: {provider}")

    result = await payment_service.providers[provider].webhook_handler(payload, headers)

    if result.get("status") == "completed":
        reference = result.get("reference") or result.get("checkout_request_id") or result.get("transaction_reference")
        if reference:
            payment = db.query(Payment).filter(
                (Payment.mpesa_receipt_number == reference)
                | (Payment.stripe_payment_intent_id == reference)
                | (Payment.transaction_id == reference)
            ).first()
            if payment and payment.status != "completed":
                payment.status = "completed"
                payment.completed_at = datetime.utcnow()
                db.commit()
                logger.info(f"Payment {payment.id} completed via {provider} webhook")

    return {"status": "received"}