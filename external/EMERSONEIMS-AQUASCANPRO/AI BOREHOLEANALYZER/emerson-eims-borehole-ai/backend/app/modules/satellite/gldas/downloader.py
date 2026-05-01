class GLDASDownloader:
    def __init__(self):
        self.base_url = "https://hydro1.gesdisc.eosdis.nasa.gov/api"
    
    def download_data(self, date, bbox):
        """Download GLDAS data"""
        return {
            "date": date,
            "bbox": bbox,
            "soil_moisture": {
                "0-10cm": 0.25,
                "10-40cm": 0.22,
                "40-100cm": 0.18,
                "100-200cm": 0.15
            },
            "evapotranspiration": 3.5,
            "runoff": 1.2
        }