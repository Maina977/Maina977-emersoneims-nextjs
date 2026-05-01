import numpy as np

class Sentinel2Processor:
    def __init__(self):
        self.band_wavelengths = {
            "B2": 492, "B3": 560, "B4": 665, "B8": 833, "B11": 1610
        }
    
    def process_scene(self, scene_data):
        """
        Process Sentinel-2 scene.
        Requires real Sentinel Hub or Copernicus Data Space credentials.
        Without API access, raises an error instead of generating fake imagery.
        """
        bands = scene_data.get("bands_data", {})
        if not bands or not any(isinstance(v, np.ndarray) for v in bands.values()):
            raise RuntimeError(
                "Sentinel-2 processing requires real satellite imagery. "
                "Configure Copernicus Data Space Ecosystem credentials at "
                "https://dataspace.copernicus.eu/ or provide bands_data arrays."
            )

        indices = {}
        nir = bands.get("B8")
        red = bands.get("B4")
        green = bands.get("B3")
        red_edge = bands.get("B5")

        if nir is not None and red is not None:
            indices["ndvi"] = self.calculate_ndvi(nir, red)
        if green is not None and nir is not None:
            indices["ndwi"] = self.calculate_ndwi(green, nir)
        if red_edge is not None and nir is not None:
            indices["ndre"] = self.calculate_ndre(red_edge, nir)

        if not indices:
            raise RuntimeError("No valid band combinations found for index calculation.")

        return indices
    
    def calculate_ndvi(self, nir, red):
        return (nir - red) / (nir + red + 0.001)
    
    def calculate_ndwi(self, green, nir):
        return (green - nir) / (green + nir + 0.001)
    
    def calculate_ndre(self, red_edge, nir):
        return (nir - red_edge) / (nir + red_edge + 0.001)