class ImageCompositor:
    def create_composite(self, images, method="median"):
        """Create image composite"""
        if method == "median":
            return self._median_composite(images)
        elif method == "mean":
            return self._mean_composite(images)
        elif method == "mosaic":
            return self._mosaic_composite(images)
    
    def _median_composite(self, images):
        return {"composite_type": "median", "bands": ["B2", "B3", "B4", "B8"]}
    
    def _mean_composite(self, images):
        return {"composite_type": "mean", "bands": ["B2", "B3", "B4", "B8"]}
    
    def _mosaic_composite(self, images):
        return {"composite_type": "mosaic", "bands": ["B2", "B3", "B4", "B8"]}