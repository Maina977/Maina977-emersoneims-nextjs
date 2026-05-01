class BoreholeAIException(Exception):
    """Base exception for Borehole AI"""
    pass

class AnalysisFailedException(BoreholeAIException):
    """Raised when analysis fails"""
    pass

class InvalidImageException(BoreholeAIException):
    """Raised when image is invalid"""
    pass

class PaymentFailedException(BoreholeAIException):
    """Raised when payment fails"""
    pass

class RateLimitExceededException(BoreholeAIException):
    """Raised when rate limit is exceeded"""
    pass