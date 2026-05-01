import redis
import json
from typing import Optional, Any
from app.config import Config

class CacheManager:
    def __init__(self):
        self.redis_client = redis.from_url(Config.REDIS_URL)
        self.ttl = 3600  # 1 hour
    
    def get(self, key: str) -> Optional[Any]:
        data = self.redis_client.get(key)
        if data:
            return json.loads(data)
        return None
    
    def set(self, key: str, value: Any, ttl: int = None):
        self.redis_client.setex(
            key,
            ttl or self.ttl,
            json.dumps(value)
        )
    
    def delete(self, key: str):
        self.redis_client.delete(key)
    
    def clear_pattern(self, pattern: str):
        keys = self.redis_client.keys(pattern)
        if keys:
            self.redis_client.delete(*keys)