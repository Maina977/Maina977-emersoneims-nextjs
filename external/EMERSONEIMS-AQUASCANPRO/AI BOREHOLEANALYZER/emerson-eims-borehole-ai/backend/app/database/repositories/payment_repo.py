from sqlalchemy.orm import Session
from app.database.models.payment import Payment

class PaymentRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, user_id: int, transaction_id: str, amount: float, currency: str, payment_method: str):
        payment = Payment(
            user_id=user_id,
            transaction_id=transaction_id,
            amount=amount,
            currency=currency,
            payment_method=payment_method,
            status="pending"
        )
        self.db.add(payment)
        self.db.commit()
        self.db.refresh(payment)
        return payment
    
    def update_status(self, transaction_id: str, status: str):
        payment = self.db.query(Payment).filter(Payment.transaction_id == transaction_id).first()
        if payment:
            payment.status = status
            self.db.commit()
        return payment