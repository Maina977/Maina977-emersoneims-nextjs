import openai
from app.config import Config
import base64

class GPT4VisionClient:
    def __init__(self):
        openai.api_key = Config.OPENAI_API_KEY
        self.client = openai.OpenAI()
    
    def analyze_terrain(self, image_base64, prompt=None):
        if not prompt:
            prompt = """Analyze this terrain image for borehole drilling potential. 
            Identify:
            1. Vegetation density and type
            2. Terrain features (valleys, slopes, drainage patterns)
            3. Signs of water (rivers, wetlands, moisture)
            4. Potential contamination sources
            5. Overall suitability score (0-100)"""
        
        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=500
        )
        
        return response.choices[0].message.content
    
    def detect_contamination(self, image_base64):
        prompt = """Analyze this image for contamination sources:
        - Sewage or wastewater indicators
        - Industrial facilities or factories
        - Agricultural runoff signs
        - Landfill or waste dumping
        - Chemical storage or spills
        
        Return as JSON with detected sources and risk levels."""
        
        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
                    ]
                }
            ],
            max_tokens=300
        )
        
        return response.choices[0].message.content