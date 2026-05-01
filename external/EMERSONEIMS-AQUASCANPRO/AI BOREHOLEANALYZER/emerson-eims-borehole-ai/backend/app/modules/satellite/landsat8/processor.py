class Landsat8Processor:
    def __init__(self):
        self.band_wavelengths = {
            "B2": 492, "B3": 560, "B4": 665, "B5": 865, "B6": 1610, "B7": 2200, "B10": 10800
        }
    
    def process_scene(self, scene_data):
        """Process Landsat-8 scene"""
        indices = {
            "ndvi": self.calculate_ndvi(scene_data.get("B5"), scene_data.get("B4")),
            "evi": self.calculate_evi(scene_data.get("B5"), scene_data.get("B4"), scene_data.get("B2")),
            "lst": self.calculate_lst(scene_data.get("B10"))
        }
        return indices
    
    def calculate_lst(self, thermal_band):
        return thermal_band * 0.003 + 273.15 - 273.15