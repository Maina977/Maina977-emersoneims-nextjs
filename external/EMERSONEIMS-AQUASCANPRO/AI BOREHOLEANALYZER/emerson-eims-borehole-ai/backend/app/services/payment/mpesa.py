import requests
import base64
from datetime import datetime
from typing import Dict, Any, Optional
from .base import PaymentProvider
import json

class MpesaProvider(PaymentProvider):
    def __init__(self):
        self.consumer_key = "YOUR_MPESA_CONSUMER_KEY"
        self.consumer_secret = "YOUR_MPESA_CONSUMER_SECRET"
        self.shortcode = "174379"
        self.passkey = "YOUR_MPESA_PASSKEY"
        self.api_url = "https://sandbox.safaricom.co.ke"  # Change to production URL for live
        self.callback_url = "https://api.borehole-ai.com/api/v1/webhooks/mpesa"
    
    def _get_access_token(self) -> str:
        """Get OAuth access token"""
        auth_url = f"{self.api_url}/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(
            auth_url,
            auth=(self.consumer_key, self.consumer_secret)
        )
        return response.json().get('access_token')
    
    async def initialize_payment(self, amount: float, currency: str,
                                  customer_email: str, customer_phone: Optional[str] = None,
                                  metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Initialize M-Pesa STK Push"""
        
        access_token = self._get_access_token()
        
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_str = f"{self.shortcode}{self.passkey}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode()
        
        # Format phone number (remove leading 0 or +254)
        phone = customer_phone
        if phone:
            if phone.startswith('0'):
                phone = '254' + phone[1:]
            elif phone.startswith('+'):
                phone = phone[1:]
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone,
            "PartyB": self.shortcode,
            "PhoneNumber": phone,
            "CallBackURL": self.callback_url,
            "AccountReference": metadata.get('report_id', 'BoreholeAI'),
            "TransactionDesc": f"Borehole Analysis Report - {metadata.get('report_id', '')}"
        }
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{self.api_url}/mpesa/stkpush/v1/processrequest",
            json=payload,
            headers=headers
        )
        
        result = response.json()
        
        return {
            "success": result.get("ResponseCode") == "0",
            "provider": "mpesa",
            "checkout_request_id": result.get("CheckoutRequestID"),
            "merchant_request_id": result.get("MerchantRequestID"),
            "message": result.get("CustomerMessage", "Please check your phone to complete payment"),
            "status": "pending"
        }
    
    async def verify_payment(self, reference: str) -> Dict[str, Any]:
        """Verify M-Pesa payment status"""
        access_token = self._get_access_token()
        
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": "placeholder",
            "Timestamp": datetime.now().strftime('%Y%m%d%H%M%S'),
            "CheckoutRequestID": reference
        }
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{self.api_url}/mpesa/stkpushquery/v1/query",
            json=payload,
            headers=headers
        )
        
        result = response.json()
        
        return {
            "status": "completed" if result.get("ResultCode") == "0" else "pending",
            "provider": "mpesa",
            "reference": reference,
            "result_code": result.get("ResultCode"),
            "result_desc": result.get("ResultDesc")
        }
    
    async def webhook_handler(self, payload: Dict, headers: Dict) -> Dict[str, Any]:
        """Handle M-Pesa callback"""
        body = payload.get('Body', {})
        stk_callback = body.get('stkCallback', {})
        
        result_code = stk_callback.get('ResultCode')
        checkout_request_id = stk_callback.get('CheckoutRequestID')
        
        # Extract M-Pesa receipt if available
        receipt = None
        if stk_callback.get('CallbackMetadata'):
            for item in stk_callback['CallbackMetadata'].get('Item', []):
                if item.get('Name') == 'MpesaReceiptNumber':
                    receipt = item.get('Value')
                    break
        
        return {
            "status": "completed" if result_code == "0" else "failed",
            "checkout_request_id": checkout_request_id,
            "receipt": receipt,
            "result_code": result_code
        }