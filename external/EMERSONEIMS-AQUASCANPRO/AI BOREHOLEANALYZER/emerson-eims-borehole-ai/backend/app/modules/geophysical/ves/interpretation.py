class VESInterpretation:
    def interpret(self, resistivities, thicknesses):
        """Geological interpretation of VES results"""
        interpretations = []
        for i, (rho, thick) in enumerate(zip(resistivities, thicknesses)):
            interpretation = self._interpret_layer(rho, thick, i)
            interpretations.append(interpretation)
        
        return {
            "layers": interpretations,
            "water_probability": self._estimate_water_probability(resistivities),
            "aquifer_depth": self._find_aquifer_depth(resistivities, thicknesses)
        }
    
    def _interpret_layer(self, resistivity, thickness, index):
        if resistivity < 20:
            material = "clay/saturated_sand"
            water_potential = "high"
        elif resistivity < 100:
            material = "sand/gravel"
            water_potential = "moderate"
        elif resistivity < 500:
            material = "weathered_rock"
            water_potential = "low"
        else:
            material = "fresh_basement"
            water_potential = "none"
        
        return {
            "index": index,
            "resistivity": resistivity,
            "thickness": thickness,
            "material": material,
            "water_potential": water_potential
        }
    
    def _estimate_water_probability(self, resistivities):
        low_resistivity_count = sum(1 for r in resistivities if r < 50)
        return low_resistivity_count / len(resistivities)
    
    def _find_aquifer_depth(self, resistivities, thicknesses):
        cumulative = 0
        for i, (rho, thick) in enumerate(zip(resistivities, thicknesses)):
            if rho < 50:
                return cumulative
            cumulative += thick
        return None