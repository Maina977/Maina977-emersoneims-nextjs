"""
Deep Learning Models Registry
Central location for all trained DL models with loading utilities
"""

import os
import logging
from typing import Optional
import numpy as np

logger = logging.getLogger(__name__)


class ModelRegistry:
    """Registry for trained deep learning models"""
    
    MODELS = {
        "geological_resnet50": {
            "path": "ai_models/geological/resnet50_model.h5",
            "type": "tensorflow",
            "input_shape": (224, 224, 3),
            "output_classes": 25,
            "description": "ResNet-50 geological formation classifier",
            "accuracy": 0.87
        },
        "lineament_unet": {
            "path": "ai_models/geological/unet_lineament.h5",
            "type": "tensorflow",
            "input_shape": (512, 512, 1),
            "output_shape": (512, 512, 1),
            "description": "U-Net semantic segmentation for lineament detection",
            "accuracy": 0.84
        },
        "water_quality_nn": {
            "path": "ai_models/water_quality/neural_network.h5",
            "type": "tensorflow",
            "input_size": 15,
            "output_size": 8,
            "description": "Neural network for water quality prediction",
            "accuracy": 0.75
        },
        "vegetation_vit": {
            "path": "ai_models/vegetation/vit_indicator.h5",
            "type": "tensorflow",
            "input_shape": (224, 224, 4),
            "output_classes": 12,
            "description": "Vision Transformer vegetation indicator species classification",
            "accuracy": 0.89
        },
        "climate_lstm": {
            "path": "ai_models/climate/lstm_model.h5",
            "type": "tensorflow",
            "input_shape": (36, 3),
            "output_size": 1,
            "description": "LSTM for aquifer recharge forecasting (36 months)",
            "accuracy": 0.82
        },
        "risk_xgboost": {
            "path": "ai_models/risk/xgboost_risk.pkl",
            "type": "xgboost",
            "input_features": 50,
            "output_classes": 4,
            "description": "XGBoost ensemble for risk assessment",
            "accuracy": 0.88
        }
    }
    
    def __init__(self):
        self.loaded_models = {}
        self.base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    
    def get_model_info(self, model_name: str) -> Optional[dict]:
        """Get metadata for a model"""
        return self.MODELS.get(model_name)
    
    def load_model(self, model_name: str):
        """Load a model with caching"""
        if model_name in self.loaded_models:
            return self.loaded_models[model_name]
        
        if model_name not in self.MODELS:
            logger.warning(f"Model {model_name} not found in registry")
            return None
        
        model_info = self.MODELS[model_name]
        model_path = os.path.join(self.base_path, model_info["path"])
        
        try:
            if model_info["type"] == "tensorflow":
                import tensorflow as tf
                model = tf.keras.models.load_model(model_path)
            elif model_info["type"] == "xgboost":
                import pickle
                with open(model_path, 'rb') as f:
                    model = pickle.load(f)
            
            self.loaded_models[model_name] = model
            logger.info(f"Loaded model: {model_name}")
            return model
        except FileNotFoundError:
            logger.warning(f"Model file not found: {model_path}")
            return None


# Global registry instance
_registry = None


def get_registry() -> ModelRegistry:
    """Get global model registry"""
    global _registry
    if _registry is None:
        _registry = ModelRegistry()
    return _registry
