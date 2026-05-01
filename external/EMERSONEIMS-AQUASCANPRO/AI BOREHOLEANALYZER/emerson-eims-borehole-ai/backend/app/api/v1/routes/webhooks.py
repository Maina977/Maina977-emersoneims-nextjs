import hmac
import hashlib
import logging
import os
from datetime import datetime

from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database.models.payment import Payment

router = APIRouter()
logger = logging.getLogger(__name__)


def _verify_stripe_signature(payload: bytes, sig_header: str, secret: str) -> bool:
    """Verify Stripe webhook signature (v1 scheme)."""
    if not sig_header or not secret:
        return False
    try:
        parts = dict(item.split("=", 1) for item in sig_header.split(","))
        timestamp = parts.get("t", "")
        signature = parts.get("v1", "")
        signed_payload = f"{timestamp}.{payload.decode('utf-8')}"
        expected = hmac.new(
            secret.encode("utf-8"),
            signed_payload.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
    except Exception:
        return False


@router.post("/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    if webhook_secret and not _verify_stripe_signature(payload, sig_header, webhook_secret):
        logger.warning("Stripe webhook signature verification failed")
        raise HTTPException(status_code=400, detail="Invalid signature")

    import json
    try:
        event = json.loads(payload)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event_type = event.get("type", "")
    data_obj = event.get("data", {}).get("object", {})

    if event_type == "payment_intent.succeeded":
        pi_id = data_obj.get("id")
        payment = db.query(Payment).filter(Payment.stripe_payment_intent_id == pi_id).first()
        if payment:
            payment.status = "completed"
            payment.completed_at = datetime.utcnow()
            db.commit()
            logger.info(f"Payment {payment.id} completed via Stripe PI {pi_id}")

    elif event_type == "payment_intent.payment_failed":
        pi_id = data_obj.get("id")
        payment = db.query(Payment).filter(Payment.stripe_payment_intent_id == pi_id).first()
        if payment:
            payment.status = "failed"
            db.commit()
            logger.warning(f"Payment {payment.id} failed via Stripe PI {pi_id}")

    elif event_type == "customer.subscription.deleted":
        sub_id = data_obj.get("id")
        logger.info(f"Subscription {sub_id} cancelled via Stripe")

    return {"status": "received"}


@router.post("/mpesa")
async def mpesa_webhook(request: Request, db: Session = Depends(get_db)):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    result_code = payload.get("Body", {}).get("stkCallback", {}).get("ResultCode")
    callback_metadata = payload.get("Body", {}).get("stkCallback", {}).get("CallbackMetadata", {})
    items = callback_metadata.get("Item", [])

    receipt_number = None
    amount = None
    for item in items:
        if item.get("Name") == "MpesaReceiptNumber":
            receipt_number = item.get("Value")
        elif item.get("Name") == "Amount":
            amount = item.get("Value")

    if receipt_number:
        payment = db.query(Payment).filter(Payment.mpesa_receipt_number == receipt_number).first()
        if payment:
            if result_code == 0:
                payment.status = "completed"
                payment.completed_at = datetime.utcnow()
            else:
                payment.status = "failed"
            db.commit()
            logger.info(f"M-Pesa callback for receipt {receipt_number}: code={result_code}")

    return {"ResultCode": 0, "ResultDesc": "Success"}