class LayerModel:
    def __init__(self, resistivities, thicknesses):
        self.resistivities = resistivities
        self.thicknesses = thicknesses
        self.n_layers = len(resistivities)
    
    def get_layer_at_depth(self, depth):
        cumulative = 0
        for i, thickness in enumerate(self.thicknesses):
            if depth <= cumulative + thickness:
                return i, self.resistivities[i]
            cumulative += thickness
        return self.n_layers - 1, self.resistivities[-1]
    
    def to_dict(self):
        return {
            "resistivities": self.resistivities,
            "thicknesses": self.thicknesses,
            "n_layers": self.n_layers
        }