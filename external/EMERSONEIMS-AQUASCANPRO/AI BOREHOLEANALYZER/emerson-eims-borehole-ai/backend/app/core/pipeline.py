from typing import Dict, Any, List
import numpy as np

class AnalysisPipeline:
    def __init__(self):
        self.weights = {
            "vegetation": 0.25,
            "terrain": 0.20,
            "soil": 0.20,
            "water": 0.20,
            "contamination": 0.15
        }
    
    def process(self, features: Dict[str, Any]) -> Dict[str, Any]:
        score = 0
        for key, weight in self.weights.items():
            score += features.get(key, 0) * weight
        
        return {
            "probability": min(score, 0.95),
            "depth": self._calculate_depth(score),
            "yield": self._calculate_yield(score)
        }
    
    def _calculate_depth(self, score: float) -> float:
        return 30 + (1 - score) * 50
    
    def _calculate_yield(self, score: float) -> float:
        return 5 + score * 15