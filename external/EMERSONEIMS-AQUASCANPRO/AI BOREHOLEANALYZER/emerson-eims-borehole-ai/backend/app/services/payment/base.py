from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime

class PaymentProvider(ABC):
    """Base class for all payment providers"""
    
    @abstractmethod
    async def initialize_payment(self, amount: float, currency: str, 
                                  customer_email: str, customer_phone: Optional[str] = None,
                                  metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Initialize payment and return checkout URL or reference"""
        pass
    
    @abstractmethod
    async def verify_payment(self, reference: str) -> Dict[str, Any]:
        """Verify payment status"""
        pass
    
    @abstractmethod
    async def webhook_handler(self, payload: Dict, headers: Dict) -> Dict[str, Any]:
        """Handle webhook from payment provider"""
        pass

class UnifiedPaymentService:
    def __init__(self):
        self.providers = {}
    
    def register_provider(self, name: str, provider: PaymentProvider):
        self.providers[name] = provider
    
    async def process_payment(self, provider_name: str, amount: float, currency: str,
                              customer_email: str, customer_phone: Optional[str] = None,
                              metadata: Optional[Dict] = None) -> Dict[str, Any]:
        provider = self.providers.get(provider_name)
        if not provider:
            raise ValueError(f"Provider {provider_name} not found")
        
        return await provider.initialize_payment(amount, currency, customer_email, customer_phone, metadata)
    
    async def verify_payment(self, provider_name: str, reference: str) -> Dict[str, Any]:
        provider = self.providers.get(provider_name)
        if not provider:
            raise ValueError(f"Provider {provider_name} not found")
        
        return await provider.verify_payment(reference)