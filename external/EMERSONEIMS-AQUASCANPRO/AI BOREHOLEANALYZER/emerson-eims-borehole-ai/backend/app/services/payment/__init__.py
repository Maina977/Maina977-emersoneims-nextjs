from .base import UnifiedPaymentService
from .mpesa import MpesaProvider
from .flutterwave import FlutterwaveProvider
from .paystack import PaystackProvider

# Initialize payment service
payment_service = UnifiedPaymentService()

# Register all providers
payment_service.register_provider("mpesa", MpesaProvider())
payment_service.register_provider("flutterwave", FlutterwaveProvider())
payment_service.register_provider("paystack", PaystackProvider())