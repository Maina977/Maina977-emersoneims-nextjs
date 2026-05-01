import requests
from datetime import datetime
from typing import Dict, Any, Optional
from .base import PaymentProvider

class FlutterwaveProvider(PaymentProvider):
    def __init__(self):
        self.public_key = "YOUR_FLUTTERWAVE_PUBLIC_KEY"
        self.secret_key = "YOUR_FLUTTERWAVE_SECRET_KEY"
        self.encryption_key = "YOUR_FLUTTERWAVE_ENCRYPTION_KEY"
        self.api_url = "https://api.flutterwave.com/v3"
        self.webhook_url = "https://api.borehole-ai.com/api/v1/webhooks/flutterwave"
    
    async def initialize_payment(self, amount: float, currency: str,
                                  customer_email: str, customer_phone: Optional[str] = None,
                                  metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Initialize Flutterwave payment"""
        
        payload = {
            "tx_ref": f"BH-{metadata.get('report_id', '')}-{datetime.now().timestamp()}",
            "amount": amount,
            "currency": currency,
            "redirect_url": "https://app.borehole-ai.com/payment/callback",
            "payment_options": "card,ussd,mobilemoney,banktransfer",
            "meta": {
                "report_id": metadata.get('report_id', ''),
                "analysis_id": metadata.get('analysis_id', '')
            },
            "customer": {
                "email": customer_email,
                "phonenumber": customer_phone,
                "name": metadata.get('customer_name', 'Customer')
            },
            "customizations": {
                "title": "Borehole AI Analysis Report",
                "description": f"Full report for analysis {metadata.get('report_id', '')}",
                "logo": "https://app.borehole-ai.com/logo.png"
            }
        }
        
        headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{self.api_url}/payments",
            json=payload,
            headers=headers
        )
        
        result = response.json()
        
        return {
            "success": result.get("status") == "success",
            "provider": "flutterwave",
            "checkout_url": result.get("data", {}).get("link"),
            "transaction_reference": result.get("data", {}).get("tx_ref"),
            "transaction_id": result.get("data", {}).get("id"),
            "status": "pending"
        }
    
    async def verify_payment(self, reference: str) -> Dict[str, Any]:
        """Verify Flutterwave payment"""
        
        headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{self.api_url}/transactions/{reference}/verify",
            headers=headers
        )
        
        result = response.json()
        
        if result.get("status") == "success":
            data = result.get("data", {})
            return {
                "status": "completed" if data.get("status") == "successful" else "pending",
                "provider": "flutterwave",
                "reference": reference,
                "amount": data.get("amount"),
                "currency": data.get("currency"),
                "transaction_id": data.get("id")
            }
        
        return {
            "status": "failed",
            "provider": "flutterwave",
            "reference": reference
        }
    
    async def webhook_handler(self, payload: Dict, headers: Dict) -> Dict[str, Any]:
        """Handle Flutterwave webhook"""
        
        # Verify webhook signature
        # signature = headers.get("verif-hash")
        
        event_type = payload.get("event")
        data = payload.get("data", {})
        
        if event_type == "charge.completed":
            return {
                "status": "completed" if data.get("status") == "successful" else "failed",
                "transaction_reference": data.get("tx_ref"),
                "transaction_id": data.get("id"),
                "amount": data.get("amount"),
                "currency": data.get("currency")
            }
        
        return {"status": "ignored", "event": event_type}