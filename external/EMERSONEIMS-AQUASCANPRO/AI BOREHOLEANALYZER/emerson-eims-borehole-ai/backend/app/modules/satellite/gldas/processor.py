class GLDASProcessor:
    def process_data(self, gldas_data):
        """Process GLDAS data"""
        return {
            "soil_moisture_profile": gldas_data.get("soil_moisture", {}),
            "evapotranspiration": gldas_data.get("evapotranspiration", 0),
            "runoff": gldas_data.get("runoff", 0),
            "infiltration_capacity": self.calculate_infiltration(gldas_data)
        }
    
    def calculate_infiltration(self, data):
        surface_moisture = data.get("soil_moisture", {}).get("0-10cm", 0.25)
        return max(0, 0.8 * (1 - surface_moisture))