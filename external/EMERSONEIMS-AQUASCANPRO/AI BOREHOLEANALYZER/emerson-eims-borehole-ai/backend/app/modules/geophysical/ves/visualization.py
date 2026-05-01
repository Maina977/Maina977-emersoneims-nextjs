import matplotlib.pyplot as plt
import numpy as np

class VESVisualization:
    def plot_curve(self, ab_distances, apparent_resistivities):
        """Plot VES curve"""
        fig, ax = plt.subplots()
        ax.loglog(ab_distances, apparent_resistivities, 'b-o')
        ax.set_xlabel('AB/2 Distance (m)')
        ax.set_ylabel('Apparent Resistivity (ohm-m)')
        ax.grid(True)
        return fig
    
    def plot_model(self, resistivities, thicknesses):
        """Plot layer model"""
        fig, ax = plt.subplots()
        cumulative = 0
        for i, (rho, thick) in enumerate(zip(resistivities, thicknesses)):
            ax.barh(-cumulative - thick/2, rho, height=thick, align='center')
            cumulative += thick
        
        ax.set_xlabel('Resistivity (ohm-m)')
        ax.set_ylabel('Depth (m)')
        ax.invert_yaxis()
        return fig