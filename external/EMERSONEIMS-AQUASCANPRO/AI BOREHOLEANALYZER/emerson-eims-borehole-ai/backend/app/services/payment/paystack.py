import requests
from typing import Dict, Any, Optional
from .base import PaymentProvider

class PaystackProvider(PaymentProvider):
    def __init__(self):
        self.secret_key = "YOUR_PAYSTACK_SECRET_KEY"
        self.public_key = "YOUR_PAYSTACK_PUBLIC_KEY"
        self.api_url = "https://api.paystack.co"
        self.callback_url = "https://app.borehole-ai.com/payment/callback"
    
    async def initialize_payment(self, amount: float, currency: str,
                                  customer_email: str, customer_phone: Optional[str] = None,
                                  metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Initialize Paystack payment"""
        
        # Amount in kobo/cents
        amount_kobo = int(amount * 100) if currency == "NGN" else int(amount * 100)
        
        payload = {
            "email": customer_email,
            "amount": amount_kobo,
            "currency": currency,
            "callback_url": self.callback_url,
            "metadata": {
                "report_id": metadata.get('report_id', ''),
                "analysis_id": metadata.get('analysis_id', ''),
                "customer_name": metadata.get('customer_name', 'Customer')
            }
        }
        
        headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{self.api_url}/transaction/initialize",
            json=payload,
            headers=headers
        )
        
        result = response.json()
        
        return {
            "success": result.get("status"),
            "provider": "paystack",
            "checkout_url": result.get("data", {}).get("authorization_url"),
            "reference": result.get("data", {}).get("reference"),
            "access_code": result.get("data", {}).get("access_code"),
            "status": "pending"
        }
    
    async def verify_payment(self, reference: str) -> Dict[str, Any]:
        """Verify Paystack payment"""
        
        headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{self.api_url}/transaction/verify/{reference}",
            headers=headers
        )
        
        result = response.json()
        
        if result.get("status"):
            data = result.get("data", {})
            return {
                "status": "completed" if data.get("status") == "success" else "pending",
                "provider": "paystack",
                "reference": reference,
                "amount": data.get("amount", 0) / 100,
                "currency": data.get("currency"),
                "transaction_id": data.get("id")
            }
        
        return {
            "status": "failed",
            "provider": "paystack",
            "reference": reference
        }
    
    async def webhook_handler(self, payload: Dict, headers: Dict) -> Dict[str, Any]:
        """Handle Paystack webhook"""
        
        # Verify webhook signature
        # signature = headers.get("x-paystack-signature")
        
        event = payload.get("event")
        data = payload.get("data", {})
        
        if event == "charge.success":
            return {
                "status": "completed",
                "reference": data.get("reference"),
                "transaction_id": data.get("id"),
                "amount": data.get("amount", 0) / 100,
                "currency": data.get("currency")
            }
        
        return {"status": "ignored", "event": event}