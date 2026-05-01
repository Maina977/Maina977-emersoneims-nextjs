import numpy as np
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter

class Terrain3DReconstruction:
    def __init__(self):
        self.depth_map = None
        self.point_cloud = None
        
    def depth_to_point_cloud(self, depth_map, focal_length=1000, cx=None, cy=None):
        """Convert depth map to 3D point cloud"""
        h, w = depth_map.shape
        
        if cx is None:
            cx = w / 2
        if cy is None:
            cy = h / 2
        
        # Create meshgrid of pixel coordinates
        x, y = np.meshgrid(np.arange(w), np.arange(h))
        
        # Convert to 3D coordinates
        X = (x - cx) * depth_map / focal_length
        Y = (y - cy) * depth_map / focal_length
        Z = depth_map
        
        # Stack into point cloud
        points = np.stack([X, Y, Z], axis=-1)
        
        return points.reshape(-1, 3)
    
    def filter_point_cloud(self, point_cloud, sigma=1.0):
        """Apply Gaussian filter to point cloud"""
        # Convert to grid for filtering
        x = point_cloud[:, 0].reshape(100, -1)
        y = point_cloud[:, 1].reshape(100, -1)
        z = point_cloud[:, 2].reshape(100, -1)
        
        # Apply Gaussian filter
        z_filtered = gaussian_filter(z, sigma=sigma)
        
        # Reconstruct point cloud
        filtered_points = np.stack([x, y, z_filtered], axis=-1).reshape(-1, 3)
        
        return filtered_points
    
    def compute_normals(self, point_cloud, k_neighbors=10):
        """Compute surface normals from point cloud"""
        from scipy.spatial import KDTree
        
        tree = KDTree(point_cloud)
        normals = np.zeros_like(point_cloud)
        
        for i, point in enumerate(point_cloud):
            # Find k nearest neighbors
            distances, indices = tree.query(point, k=k_neighbors)
            neighbors = point_cloud[indices]
            
            # Compute covariance matrix
            centroid = np.mean(neighbors, axis=0)
            centered = neighbors - centroid
            cov = np.cov(centered.T)
            
            # Eigen decomposition
            eigenvalues, eigenvectors = np.linalg.eigh(cov)
            
            # Normal is eigenvector with smallest eigenvalue
            normal = eigenvectors[:, 0]
            normals[i] = normal
        
        return normals
    
    def compute_slope(self, point_cloud):
        """Compute slope from point cloud"""
        normals = self.compute_normals(point_cloud)
        
        # Slope is angle between normal and vertical (0,0,1)
        vertical = np.array([0, 0, 1])
        dot_product = np.abs(np.dot(normals, vertical))
        slope_angles = np.arccos(np.clip(dot_product, -1, 1))
        
        return np.degrees(slope_angles)
    
    def compute_aspect(self, point_cloud):
        """Compute aspect (direction) from point cloud"""
        normals = self.compute_normals(point_cloud)
        
        # Aspect is direction of steepest descent
        aspect = np.arctan2(normals[:, 1], normals[:, 0])
        aspect_degrees = np.degrees(aspect)
        
        return aspect_degrees
    
    def generate_contour_lines(self, point_cloud, levels=10):
        """Generate contour lines from point cloud"""
        from scipy.interpolate import griddata
        
        # Extract X, Y, Z
        X = point_cloud[:, 0]
        Y = point_cloud[:, 1]
        Z = point_cloud[:, 2]
        
        # Create grid
        xi = np.linspace(X.min(), X.max(), 100)
        yi = np.linspace(Y.min(), Y.max(), 100)
        xi, yi = np.meshgrid(xi, yi)
        
        # Interpolate
        zi = griddata((X, Y), Z, (xi, yi), method='cubic')
        
        # Generate contours
        contours = []
        levels = np.linspace(Z.min(), Z.max(), levels)
        
        return {'x': xi, 'y': yi, 'z': zi, 'levels': levels}
    
    def calculate_volume(self, point_cloud, base_level=None):
        """Calculate volume above base level"""
        if base_level is None:
            base_level = np.min(point_cloud[:, 2])
        
        # Simple trapezoidal integration
        X = point_cloud[:, 0]
        Y = point_cloud[:, 1]
        Z = point_cloud[:, 2] - base_level
        
        # Assuming regular grid
        unique_x = np.unique(X)
        unique_y = np.unique(Y)
        dx = unique_x[1] - unique_x[0] if len(unique_x) > 1 else 1
        dy = unique_y[1] - unique_y[0] if len(unique_y) > 1 else 1
        
        Z_grid = Z.reshape(len(unique_y), len(unique_x))
        volume = np.sum(Z_grid) * dx * dy
        
        return volume
    
    def visualize_3d(self, point_cloud, color_by='elevation', output_path=None):
        """Create 3D visualization of terrain"""
        fig = plt.figure(figsize=(12, 8))
        ax = fig.add_subplot(111, projection='3d')
        
        X = point_cloud[:, 0]
        Y = point_cloud[:, 1]
        Z = point_cloud[:, 2]
        
        if color_by == 'elevation':
            colors = Z
            cmap = 'terrain'
        elif color_by == 'slope':
            colors = self.compute_slope(point_cloud)
            cmap = 'viridis'
        elif color_by == 'aspect':
            colors = self.compute_aspect(point_cloud)
            cmap = 'hsv'
        else:
            colors = 'green'
            cmap = None
        
        scatter = ax.scatter(X, Y, Z, c=colors, cmap=cmap, s=1, alpha=0.6)
        
        ax.set_xlabel('X (m)')
        ax.set_ylabel('Y (m)')
        ax.set_zlabel('Z (m)')
        ax.set_title('3D Terrain Reconstruction')
        
        if cmap:
            plt.colorbar(scatter)
        
        if output_path:
            plt.savefig(output_path, dpi=150, bbox_inches='tight')
        
        return fig
    
    def generate_orthophoto(self, point_cloud, output_path=None):
        """Generate orthophoto from point cloud"""
        fig, axes = plt.subplots(2, 2, figsize=(12, 10))
        
        # Top view (orthophoto)
        ax1 = axes[0, 0]
        sc1 = ax1.scatter(point_cloud[:, 0], point_cloud[:, 1], c=point_cloud[:, 2], cmap='terrain', s=1)
        ax1.set_xlabel('X (m)')
        ax1.set_ylabel('Y (m)')
        ax1.set_title('Top View (Orthophoto)')
        ax1.set_aspect('equal')
        plt.colorbar(sc1, ax=ax1, label='Elevation (m)')
        
        # Side view
        ax2 = axes[0, 1]
        ax2.scatter(point_cloud[:, 0], point_cloud[:, 2], c=point_cloud[:, 1], cmap='viridis', s=1)
        ax2.set_xlabel('X (m)')
        ax2.set_ylabel('Z (m)')
        ax2.set_title('Side View')
        
        # Front view
        ax3 = axes[1, 0]
        ax3.scatter(point_cloud[:, 1], point_cloud[:, 2], c=point_cloud[:, 0], cmap='viridis', s=1)
        ax3.set_xlabel('Y (m)')
        ax3.set_ylabel('Z (m)')
        ax3.set_title('Front View')
        
        # Slope histogram
        ax4 = axes[1, 1]
        slopes = self.compute_slope(point_cloud)
        ax4.hist(slopes, bins=50, color='green', alpha=0.7)
        ax4.set_xlabel('Slope (degrees)')
        ax4.set_ylabel('Frequency')
        ax4.set_title('Slope Distribution')
        
        plt.tight_layout()
        
        if output_path:
            plt.savefig(output_path, dpi=150, bbox_inches='tight')
        
        return fig
    
    def reconstruct_from_depth(self, depth_map, focal_length=1000):
        """Complete 3D reconstruction pipeline"""
        self.depth_map = depth_map
        
        # Convert to point cloud
        point_cloud = self.depth_to_point_cloud(depth_map, focal_length)
        
        # Filter noise
        point_cloud = self.filter_point_cloud(point_cloud, sigma=0.5)
        
        # Compute terrain metrics
        slopes = self.compute_slope(point_cloud)
        aspect = self.compute_aspect(point_cloud)
        volume = self.calculate_volume(point_cloud)
        
        return {
            'point_cloud': point_cloud,
            'slope_mean': np.mean(slopes),
            'slope_std': np.std(slopes),
            'aspect_mean': np.mean(aspect),
            'volume': volume,
            'elevation_range': [np.min(point_cloud[:, 2]), np.max(point_cloud[:, 2])]
        }