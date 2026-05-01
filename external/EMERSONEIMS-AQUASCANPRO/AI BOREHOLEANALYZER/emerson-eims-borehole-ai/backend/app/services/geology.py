"""
Geological Classification Engine
Classifies aquifer types, identifies lineaments, and analyzes geological features

AQUIFER CLASSIFICATION:
- PRODUCTIVE: Alluvial/weathered/fractured rock aquifers (yield > 5 m³/h)
- SEMI_PRODUCTIVE: Low-moderate yield (0.5-5 m³/h)
- LOW_PRODUCTIVITY: Tight crystalline (yield < 0.5 m³/h)
- KARST: Carbonate/volcanic with cave systems
- DYSFUNCTIONAL: Salt-affected, contaminated
- UNKNOWN: Insufficient data

LINEAMENT TYPES:
- FAULT: High gravity linearity + topographic offset
- FRACTURE: Moderate linearity + vegetation anomaly
- CONTACT: Geological boundary (lithology change)
- FOLIATION: Aligned foliation in metamorphics
"""

import numpy as np
import logging
from typing import Dict, List, Tuple, Optional
from scipy import ndimage, signal
from sklearn.preprocessing import StandardScaler
import warnings

logger = logging.getLogger(__name__)
warnings.filterwarnings('ignore')


class GeologicalClassifier:
    """Classify geological features and aquifer types"""

    # Aquifer thresholds
    AQUIFER_CLASSES = {
        'PRODUCTIVE': {'yield_min': 5.0, 'depth_max': 100, 'priority': 1},
        'SEMI_PRODUCTIVE': {'yield_min': 0.5, 'yield_max': 5.0, 'priority': 2},
        'LOW_PRODUCTIVITY': {'yield_min': 0.01, 'yield_max': 0.5, 'priority': 3},
        'KARST': {'lineament_density': 0.5, 'depth_max': 80, 'priority': 1},
        'DYSFUNCTIONAL': {'contamination_risk': 0.7, 'priority': 5},
    }

    def __init__(self,
                 dem: np.ndarray,
                 slope: np.ndarray,
                 twi: np.ndarray,
                 spectral_indices: Dict[str, np.ndarray],
                 gravity_anomaly: Optional[np.ndarray] = None,
                 geochemistry: Optional[Dict] = None):
        """
        Initialize geological classifier

        Args:
            dem: Digital Elevation Model array
            slope: Slope array (degrees)
            twi: Topographic Wetness Index
            spectral_indices: Dictionary of computed spectral indices
            gravity_anomaly: Bouguer gravity anomaly (mGal)
            geochemistry: Dictionary with geochemical parameters
        """
        self.dem = dem.astype(float)
        self.slope = slope.astype(float)
        self.twi = twi.astype(float)
        self.spectral_indices = spectral_indices
        self.gravity_anomaly = gravity_anomaly
        self.geochemistry = geochemistry or {}

        self.shape = self.dem.shape
        logger.info(f"Geological classifier initialized: {self.shape}")

    def detect_lineaments(self, prominence_threshold: float = 0.1) -> List[Dict]:
        """
        Detect lineaments (faults, fractures, contacts)

        Uses multiple indicators:
        - Topographic linearity (ridge/valley alignment)
        - Gravity anomaly gradients
        - Spectral index anomalies (vegetation, mineral)

        Args:
            prominence_threshold: Gradient prominence for detection

        Returns:
            List of lineament features with properties
        """
        try:
            lineaments = []

            # 1. Topographic lineaments (slope breaks, ridges)
            topo_lines = self._detect_topo_lineaments()

            # 2. Gravity lineaments (density contrasts)
            gravity_lines = self._detect_gravity_lineaments() if self.gravity_anomaly is not None else []

            # 3. Spectral lineaments (mineral/vegetation changes)
            spectral_lines = self._detect_spectral_lineaments()

            # Combine and filter
            all_lines = topo_lines + gravity_lines + spectral_lines

            # Deduplicate nearby lineaments
            lineaments = self._deduplicate_lineaments(all_lines)

            logger.info(f"Detected {len(lineaments)} lineaments")
            return lineaments

        except Exception as e:
            logger.error(f"Lineament detection failed: {e}")
            return []

    def _detect_topo_lineaments(self) -> List[Dict]:
        """Detect topographic lineaments from DEM"""
        try:
            # Hillshade for feature extraction
            x_grad, y_grad = np.gradient(self.dem)
            max_grad = np.sqrt(x_grad**2 + y_grad**2)

            # Sobel edge detection (potential fault scarps)
            sx = ndimage.sobel(self.dem, axis=0)
            sy = ndimage.sobel(self.dem, axis=1)
            edges = np.hypot(sx, sy)

            # Normalize
            edges = (edges - np.nanmin(edges)) / (np.nanmax(edges) - np.nanmin(edges))

            # Find edge segments
            threshold = np.nanpercentile(edges, 75)
            edge_mask = edges > threshold

            # Label connected components
            labeled, num_features = ndimage.label(edge_mask)

            lineaments = []
            for i in range(1, num_features + 1):
                mask = labeled == i
                coords = np.where(mask)

                if len(coords[0]) < 5:  # Too small
                    continue

                # Fit line to coordinates
                pca_components = self._fit_line(coords)
                length = np.sum(mask)

                lineaments.append({
                    'type': 'TOPOGRAPHIC',
                    'length_pixels': int(length),
                    'orientation': pca_components,
                    'strength': float(np.nanmean(edges[mask])),
                    'coords': (coords[0], coords[1])
                })

            return lineaments

        except Exception as e:
            logger.warning(f"Topo lineament detection failed: {e}")
            return []

    def _detect_gravity_lineaments(self) -> List[Dict]:
        """Detect gravity-derived lineaments (density boundaries)"""
        try:
            if self.gravity_anomaly is None:
                return []

            # Gravity gradient (horizontal derivative)
            gx, gy = np.gradient(self.gravity_anomaly)
            grad_mag = np.sqrt(gx**2 + gy**2)

            # Normalize
            grad_norm = (grad_mag - np.nanmin(grad_mag)) / (np.nanmax(grad_mag) - np.nanmin(grad_mag) + 1e-10)

            # High gradient zones = potential boundaries
            threshold = np.nanpercentile(grad_norm, 80)
            grad_mask = grad_norm > threshold

            labeled, num_features = ndimage.label(grad_mask)

            lineaments = []
            for i in range(1, num_features + 1):
                mask = labeled == i
                coords = np.where(mask)

                if len(coords[0]) < 5:
                    continue

                pca = self._fit_line(coords)
                length = np.sum(mask)

                lineaments.append({
                    'type': 'GRAVITY_BOUNDARY',
                    'length_pixels': int(length),
                    'orientation': pca,
                    'strength': float(np.nanmean(grad_norm[mask])),
                    'coords': (coords[0], coords[1])
                })

            return lineaments

        except Exception as e:
            logger.warning(f"Gravity lineament detection failed: {e}")
            return []

    def _detect_spectral_lineaments(self) -> List[Dict]:
        """Detect lineaments from spectral index changes (mineral, vegetation)"""
        try:
            lineaments = []

            # Use multiple indices for robustness
            indices_to_check = ['NDVI', 'NDWI', 'NDBI', 'NDII']

            for index_name in indices_to_check:
                if index_name not in self.spectral_indices:
                    continue

                array = self.spectral_indices[index_name]

                # Edge detection
                edges = ndimage.sobel(array)
                edges_norm = (edges - np.nanmin(edges)) / (np.nanmax(edges) - np.nanmin(edges) + 1e-10)

                threshold = np.nanpercentile(edges_norm, 75)
                edge_mask = edges_norm > threshold

                labeled, num_features = ndimage.label(edge_mask)

                for i in range(1, min(num_features + 1, 50)):  # Limit to avoid explosion
                    mask = labeled == i
                    coords = np.where(mask)

                    if len(coords[0]) < 3:
                        continue

                    length = np.sum(mask)
                    if length > 20:  # Minimum length

                        pca = self._fit_line(coords)

                        lineaments.append({
                            'type': f'SPECTRAL_{index_name}',
                            'length_pixels': int(length),
                            'orientation': pca,
                            'strength': float(np.nanmean(edges_norm[mask])),
                            'coords': (coords[0], coords[1])
                        })

            return lineaments

        except Exception as e:
            logger.warning(f"Spectral lineament detection failed: {e}")
            return []

    def _fit_line(self, coords: Tuple[np.ndarray, np.ndarray]) -> float:
        """Fit line to coordinates, return angle"""
        try:
            y, x = coords
            if len(y) < 2:
                return 0.0

            # Principal component analysis for line orientation
            points = np.column_stack([x, y])
            centered = points - points.mean(axis=0)

            cov = centered.T @ centered
            eigenvalues, eigenvectors = np.linalg.eig(cov)

            # Dominant direction
            dominant_vec = eigenvectors[:, np.argmax(eigenvalues)]
            angle = np.degrees(np.arctan2(dominant_vec[1], dominant_vec[0]))

            return float(angle)

        except Exception:
            return 0.0

    def _deduplicate_lineaments(self, lineaments: List[Dict], distance_threshold: float = 50) -> List[Dict]:
        """Remove duplicate/overlapping lineaments"""
        if not lineaments:
            return []

        # Sort by strength (descending)
        sorted_lines = sorted(lineaments, key=lambda x: x['strength'], reverse=True)

        unique = []
        for line in sorted_lines:
            is_duplicate = False

            for existing in unique:
                # Check if similar orientation and location
                if abs(line['orientation'] - existing['orientation']) < 15:  # Similar angle
                    is_duplicate = True
                    break

            if not is_duplicate:
                unique.append(line)

        return unique

    def compute_lineament_density(self, window_size: int = 100) -> np.ndarray:
        """
        Compute lineament density using sliding window

        Returns:
            Density array (lineaments per window)
        """
        try:
            lineaments = self.detect_lineaments()

            # Create lineament map
            lineament_map = np.zeros(self.shape)
            for line in lineaments:
                y_coords, x_coords = line['coords']
                lineament_map[y_coords, x_coords] = 1

            # Sliding window density
            from scipy import ndimage
            structure = np.ones((window_size, window_size))
            density = ndimage.convolve(lineament_map, structure, mode='reflect')

            logger.info(f"Lineament density computed: max={np.nanmax(density):.2f}")
            return density

        except Exception as e:
            logger.error(f"Lineament density computation failed: {e}")
            return np.zeros(self.shape)

    def classify_aquifer_type(self,
                             productivity_score: np.ndarray,
                             contamination_risk: Optional[np.ndarray] = None) -> Dict[str, np.ndarray]:
        """
        Classify aquifer types for each pixel

        Args:
            productivity_score: Predicted aquifer yield (m³/h)
            contamination_risk: Risk map (0-1 scale)

        Returns:
            Dictionary with classification arrays
        """
        try:
            aquifer_class = np.full(self.shape, dtype=object, fill_value='UNKNOWN')
            productivity_class = np.zeros(self.shape)
            lineament_density = self.compute_lineament_density()

            for i in range(self.shape[0]):
                for j in range(self.shape[1]):

                    # Check for karst conditions
                    if lineament_density[i, j] > self.AQUIFER_CLASSES['KARST']['lineament_density']:
                        aquifer_class[i, j] = 'KARST'
                        productivity_class[i, j] = 1

                    # Check contamination
                    elif contamination_risk is not None and contamination_risk[i, j] > 0.7:
                        aquifer_class[i, j] = 'DYSFUNCTIONAL'
                        productivity_class[i, j] = 5

                    # Check productivity
                    elif productivity_score[i, j] >= self.AQUIFER_CLASSES['PRODUCTIVE']['yield_min']:
                        aquifer_class[i, j] = 'PRODUCTIVE'
                        productivity_class[i, j] = 1

                    elif productivity_score[i, j] >= self.AQUIFER_CLASSES['SEMI_PRODUCTIVE']['yield_min']:
                        aquifer_class[i, j] = 'SEMI_PRODUCTIVE'
                        productivity_class[i, j] = 2

                    else:
                        aquifer_class[i, j] = 'LOW_PRODUCTIVITY'
                        productivity_class[i, j] = 3

            logger.info("Aquifer classification completed")

            return {
                'aquifer_class': aquifer_class,
                'productivity_priority': productivity_class  # 1=best, 5=worst
            }

        except Exception as e:
            logger.error(f"Aquifer classification failed: {e}")
            return {
                'aquifer_class': np.full(self.shape, 'UNKNOWN', dtype=object),
                'productivity_priority': np.full(self.shape, np.nan)
            }

    def estimate_bedrock_depth(self,
                              gravity_anomaly: np.ndarray,
                              density_contrast: float = 300) -> np.ndarray:
        """
        Estimate bedrock depth using gravity inversion

        Simple Bouguer inversion: depth ≈ anomaly / (2π * G * density_contrast)

        Args:
            gravity_anomaly: Bouguer gravity (mGal)
            density_contrast: Assumed density contrast (kg/m³)

        Returns:
            Depth to bedrock array (meters)
        """
        try:
            G = 6.674e-11  # Gravitational constant
            density_contrast_kg = density_contrast

            # Simple inversion
            anomaly_pa = gravity_anomaly * 1e-5  # mGal to Pa

            depth = anomaly_pa / (2 * np.pi * G * density_contrast_kg)

            # Clip to reasonable values
            depth = np.clip(depth, 1, 300)

            logger.info(f"Bedrock depth estimated: mean={np.nanmean(depth):.1f}m, max={np.nanmax(depth):.1f}m")
            return depth

        except Exception as e:
            logger.error(f"Bedrock depth estimation failed: {e}")
            return np.full(self.shape, np.nan)

    def analyze_geological_units(self) -> List[Dict]:
        """
        Identify distinct geological units based on multispectral clustering

        Returns:
            List of geological units with properties
        """
        try:
            # Stack relevant indices
            indices_to_use = []
            for key in ['NDVI', 'NDWI', 'NDBI', 'NDII', 'BI', 'SI']:
                if key in self.spectral_indices:
                    indices_to_use.append(self.spectral_indices[key])

            if not indices_to_use:
                logger.warning("Insufficient indices for geological unit analysis")
                return []

            # Stack and reshape for clustering
            stacked = np.stack(indices_to_use, axis=-1)
            reshaped = stacked.reshape(-1, len(indices_to_use))

            # Standardize
            scaler = StandardScaler()
            normalized = scaler.fit_transform(reshaped)

            # Simple k-means clustering (k=5 geological units)
            from sklearn.cluster import KMeans
            kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
            labels = kmeans.fit_predict(normalized)

            # Identify unit characteristics
            units = []
            for i in range(5):
                mask = labels.reshape(self.shape) == i

                unit_dem = self.dem[mask]
                unit_slope = self.slope[mask]

                units.append({
                    'unit_id': i,
                    'area_pixels': int(np.sum(mask)),
                    'elevation_range': (float(np.nanmin(unit_dem)), float(np.nanmax(unit_dem))),
                    'mean_slope': float(np.nanmean(unit_slope)),
                    'characteristics': self._describe_unit(mask)
                })

            logger.info(f"Identified {len(units)} geological units")
            return units

        except Exception as e:
            logger.error(f"Geological unit analysis failed: {e}")
            return []

    def _describe_unit(self, mask: np.ndarray) -> str:
        """Describe geological unit characteristics"""
        try:
            twi_mean = np.nanmean(self.twi[mask])
            slope_mean = np.nanmean(self.slope[mask])

            # Use spectral characteristics
            ndvi = self.spectral_indices.get('NDVI', np.zeros(self.shape))
            ndvi_mean = np.nanmean(ndvi[mask])

            if ndvi_mean > 0.5:
                char = "Vegetated (possibly weathered)"
            elif twi_mean > 8:
                char = "Valley floor (high moisture)"
            elif slope_mean > 30:
                char = "Steep terrain (bedrock)"
            else:
                char = "Moderate terrain"

            return char

        except:
            return "Unknown"

    def compute_aquifer_favorability_map(self) -> np.ndarray:
        """
        Generate overall aquifer favorability score (0-100)

        Considers:
        - Topographic position (TWI)
        - Slope (gentle preferred)
        - Lineament density
        - Spectral indices (vegetation, water, moisture)

        Returns:
            Favorability score array (0-100)
        """
        try:
            # Normalize inputs
            twi_norm = (self.twi - np.nanmin(self.twi)) / (np.nanmax(self.twi) - np.nanmin(self.twi) + 1e-10)
            slope_norm = 1 - (self.slope - np.nanmin(self.slope)) / (np.nanmax(self.slope) - np.nanmin(self.slope) + 1e-10)

            lineament_dens = self.compute_lineament_density()
            lineament_norm = (lineament_dens - np.nanmin(lineament_dens)) / (np.nanmax(lineament_dens) - np.nanmin(lineament_dens) + 1e-10)

            # Weighted combination
            ndvi = self.spectral_indices.get('NDVI', np.zeros(self.shape))
            ndvi_norm = np.clip((ndvi + 1) / 2, 0, 1)

            ndwi = self.spectral_indices.get('NDWI', np.zeros(self.shape))
            ndwi_norm = np.clip((ndwi + 1) / 2, 0, 1)

            # Weights: TWI (30%), slope (25%), vegetation (15%), water (15%), lineaments (15%)
            favorability = (
                0.30 * twi_norm +
                0.25 * slope_norm +
                0.15 * ndvi_norm +
                0.15 * ndwi_norm +
                0.15 * lineament_norm
            )

            # Scale to 0-100
            favorability_score = favorability * 100

            logger.info(f"Favorability map: mean={np.nanmean(favorability_score):.1f}, max={np.nanmax(favorability_score):.1f}")

            return favorability_score

        except Exception as e:
            logger.error(f"Favorability map computation failed: {e}")
            return np.zeros(self.shape)
