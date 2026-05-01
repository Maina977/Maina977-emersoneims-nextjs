class GRACEProcessor:
    def process_data(self, grace_data):
        """Process GRACE data"""
        groundwater = self.calculate_groundwater(grace_data)
        trend = self.calculate_trend(grace_data["time_series"], groundwater)
        seasonal = self.calculate_seasonal(groundwater)
        
        return {
            "groundwater_anomaly": groundwater,
            "trend": trend,
            "seasonal": seasonal
        }
    
    def calculate_groundwater(self, data):
        return [data["twsa"][i] - data["smc"][i] - data["swc"][i] for i in range(len(data["twsa"]))]
    
    def calculate_trend(self, time_series, values):
        slope = (values[-1] - values[0]) / (time_series[-1] - time_series[0])
        return slope
    
    def calculate_seasonal(self, values):
        return np.mean(values[-12:]) - np.mean(values[:12])