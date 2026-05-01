class Landsat8Downloader:
    def __init__(self, api_key=None):
        self.api_key = api_key
        self.base_url = "https://landsat.usgs.gov/api"
    
    def download_scene(self, path, row, date):
        """Download Landsat-8 scene"""
        return {
            "scene_id": f"LC08_{path}_{row}_{date}",
            "bands": ["B2", "B3", "B4", "B5", "B6", "B7", "B10"],
            "resolution": 30,
            "acquisition_date": date
        }