class MODISDownloader:
    def __init__(self):
        self.base_url = "https://modis.gsfc.nasa.gov/api"
    
    def download_product(self, product, date, bbox):
        """Download MODIS product"""
        return {
            "product": product,
            "date": date,
            "bbox": bbox,
            "resolution": 1000,
            "bands": ["NDVI", "EVI", "LST", "ET"]
        }