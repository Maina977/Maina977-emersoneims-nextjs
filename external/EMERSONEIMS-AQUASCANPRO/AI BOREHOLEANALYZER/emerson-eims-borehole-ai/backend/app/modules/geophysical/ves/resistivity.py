class ResistivityCurve:
    def __init__(self, ab_distances, apparent_resistivities):
        self.ab_distances = ab_distances
        self.apparent_resistivities = apparent_resistivities
    
    def get_curve_type(self):
        """Classify curve type (A, H, K, Q, etc.)"""
        slopes = []
        for i in range(1, len(self.apparent_resistivities)):
            slope = (self.apparent_resistivities[i] - self.apparent_resistivities[i-1]) / \
                    (self.ab_distances[i] - self.ab_distances[i-1])
            slopes.append(slope)
        
        if all(s > 0 for s in slopes):
            return "A"  # Increasing
        elif all(s < 0 for s in slopes):
            return "Q"  # Decreasing
        elif slopes[0] < 0 and slopes[-1] > 0:
            return "H"  # Trough
        else:
            return "K"  # Peak