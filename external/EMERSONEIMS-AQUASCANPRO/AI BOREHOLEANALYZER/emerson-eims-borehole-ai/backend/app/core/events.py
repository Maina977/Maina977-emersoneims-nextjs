from typing import Dict, Any
import asyncio
from datetime import datetime

class EventHandler:
    def __init__(self):
        self.handlers = {}
    
    def register(self, event_type: str, handler):
        if event_type not in self.handlers:
            self.handlers[event_type] = []
        self.handlers[event_type].append(handler)
    
    async def emit(self, event_type: str, data: Dict[str, Any]):
        if event_type in self.handlers:
            tasks = [handler(data) for handler in self.handlers[event_type]]
            await asyncio.gather(*tasks)

event_handler = EventHandler()