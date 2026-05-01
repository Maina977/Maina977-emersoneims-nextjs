class GEEQueries:
    @staticmethod
    def get_sentinel2_query(latitude, longitude, start_date, end_date):
        return {
            "collection": "COPERNICUS/S2",
            "filter": {
                "bounds": [latitude - 0.1, longitude - 0.1, latitude + 0.1, longitude + 0.1],
                "date_range": [start_date, end_date],
                "cloud_cover": "<20"
            }
        }
    
    @staticmethod
    def get_landsat8_query(latitude, longitude, start_date, end_date):
        return {
            "collection": "LANDSAT/LC08/C01/T1_SR",
            "filter": {
                "bounds": [latitude - 0.1, longitude - 0.1, latitude + 0.1, longitude + 0.1],
                "date_range": [start_date, end_date],
                "cloud_cover": "<30"
            }
        }