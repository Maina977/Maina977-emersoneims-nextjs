import re
from typing import Optional

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    pattern = r'^\+?[0-9]{10,15}$'
    return re.match(pattern, phone) is not None

def validate_coordinates(latitude: float, longitude: float) -> bool:
    return -90 <= latitude <= 90 and -180 <= longitude <= 180

def validate_image_size(size: int, max_size_mb: int = 10) -> bool:
    return size <= max_size_mb * 1024 * 1024