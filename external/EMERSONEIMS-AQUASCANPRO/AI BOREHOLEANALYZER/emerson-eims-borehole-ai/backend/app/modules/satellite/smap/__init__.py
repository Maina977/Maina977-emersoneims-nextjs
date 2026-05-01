"""
SMAP L-Band Radiometry Module
NASA Soil Moisture Active Passive satellite data processing
Provides 0-100cm soil moisture profile with ±0.04 m³/m³ accuracy
"""

from .processor import SMAPProcessor

__all__ = ["SMAPProcessor"]
