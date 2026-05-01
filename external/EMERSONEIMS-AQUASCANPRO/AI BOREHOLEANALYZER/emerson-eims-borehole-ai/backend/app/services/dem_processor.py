"""
DEM (Digital Elevation Model) Processor
Computes topographic indices:
- Slope, aspect, curvature
- Flow direction and accumulation
- Topographic Wetness Index (TWI)
- Watershed delineation
- Valley/sinkhole detection
"""

import numpy as np
import logging
from scipy import signal, ndimage
from skimage import morphology
from typing import Tuple, Dict, List, Optional
import rasterio
from rasterio.features import shapes
import warnings

logger = logging.getLogger(__name__)
warnings.filterwarnings('ignore')


class DEMProcessor:
    """Process Digital Elevation Models for hydrological analysis"""

    def __init__(self, dem_file: Optional[str] = None, dem_array: Optional[np.ndarray] = None):
        """
        Initialize DEM processor

        Args:
            dem_file: Path to DEM GeoTIFF file
            dem_array: Direct numpy array (alternative to file)
        """
        self.dem = None
        self.transform = None
        self.crs = None

        if dem_file:
            self._load_from_file(dem_file)
        elif dem_array is not None:
            self.dem = dem_array.astype(float)
            self.transform = None
        else:
            raise ValueError("Must provide either dem_file or dem_array")

    def _load_from_file(self, dem_file: str):
        """Load DEM from GeoTIFF file"""
        try:
            with rasterio.open(dem_file) as src:
                self.dem = src.read(1).astype(float)
                self.transform = src.transform
                self.crs = src.crs
            logger.info(f"DEM loaded: {self.dem.shape}, CRS: {self.crs}")
        except Exception as e:
            logger.error(f"Failed to load DEM: {e}")
            raise

    def compute_slope(self, units: str = 'degrees') -> np.ndarray:
        """
        Compute slope using Sobel operators

        Args:
            units: 'degrees' (0-90) or 'percent' (0-300) or 'radians'

        Returns:
            Slope array (same shape as DEM)
        """
        try:
            # Compute gradients using Sobel operator
            x_grad, y_grad = np.gradient(self.dem)

            # Maximum gradient
            max_grad = np.sqrt(x_grad**2 + y_grad**2)

            # Slope in radians
            slope_rad = np.arctan(max_grad)

            # Convert to requested units
            if units == 'degrees':
                slope = np.degrees(slope_rad)
            elif units == 'percent':
                slope = np.tan(slope_rad) * 100
            else:  # radians
                slope = slope_rad

            logger.info(f"Slope computed: mean={np.nanmean(slope):.2f}°, max={np.nanmax(slope):.2f}°")
            return slope

        except Exception as e:
            logger.error(f"Slope computation failed: {e}")
            raise

    def compute_aspect(self, units: str = 'degrees') -> np.ndarray:
        """
        Compute aspect (direction of steepest descent)

        Args:
            units: 'degrees' (0-360) or 'radians' (0-2π)

        Returns:
            Aspect array
        """
        try:
            x_grad, y_grad = np.gradient(self.dem)

            # Aspect from gradients
            # atan2(-x, y) gives direction water flows OFF (down-slope direction)
            aspect_rad = np.arctan2(-x_grad, y_grad)

            if units == 'degrees':
                aspect = np.degrees(aspect_rad)
                # Adjust to 0-360 range
                aspect[aspect < 0] += 360
            else:
                aspect = aspect_rad

            logger.info(f"Aspect computed")
            return aspect

        except Exception as e:
            logger.error(f"Aspect computation failed: {e}")
            raise

    def compute_d8_flow_direction(self) -> np.ndarray:
        """
        D8 flow direction routing (8-direction)

        Direction codes:
            7 8 1
            6 * 2
            5 4 3

        Returns:
            Flow direction array (1-8)
        """
        try:
            # Pad to avoid boundary issues
            dem_pad = np.pad(self.dem, 1, mode='edge')
            rows, cols = self.dem.shape
            flow_dir = np.zeros_like(self.dem, dtype=np.int8)

            # Direction offsets and distances
            directions = [
                (0, 1, 1),      # E: direction 1
                (1, 1, np.sqrt(2)),  # SE: direction 2
                (1, 0, 1),      # S: direction 3
                (1, -1, np.sqrt(2)), # SW: direction 4
                (0, -1, 1),     # W: direction 5
                (-1, -1, np.sqrt(2)), # NW: direction 6
                (-1, 0, 1),     # N: direction 7
                (-1, 1, np.sqrt(2))  # NE: direction 8
            ]

            # Compute flow direction for each cell
            for i in range(rows):
                for j in range(cols):
                    center = dem_pad[i+1, j+1]
                    slopes = []

                    for di, dj, dist in directions:
                        ni, nj = i+1+di, j+1+dj
                        neighbor = dem_pad[ni, nj]
                        slope = (center - neighbor) / dist  # Positive = downslope
                        slopes.append(slope)

                    # Steepest descent
                    steepest_idx = np.argmax(slopes)
                    if slopes[steepest_idx] > 0:
                        flow_dir[i, j] = steepest_idx + 1

            logger.info("D8 flow direction computed")
            return flow_dir

        except Exception as e:
            logger.error(f"D8 flow direction failed: {e}")
            raise

    def compute_flow_accumulation(self, dem_array: Optional[np.ndarray] = None) -> np.ndarray:
        """
        Compute flow accumulation from D8 flow direction

        Args:
            dem_array: Optional DEM to use instead of self.dem

        Returns:
            Flow accumulation array (cells contributing to each point)
        """
        try:
            flow_dir = self.compute_d8_flow_direction()

            # Direction to offset mapping
            offsets = {
                1: (0, 1),    # E
                2: (1, 1),    # SE
                3: (1, 0),    # S
                4: (1, -1),   # SW
                5: (0, -1),   # W
                6: (-1, -1),  # NW
                7: (-1, 0),   # N
                8: (-1, 1),   # NE
            }

            # Start with 1 cell per pixel
            flow_accum = np.ones_like(self.dem, dtype=float)

            # Process from high to low elevation
            sorted_indices = np.argsort(self.dem.flat)[::-1]

            for idx in sorted_indices:
                i, j = np.unravel_index(idx, self.dem.shape)

                # Route to downslope neighbor
                direction = flow_dir[i, j]
                if direction > 0 and direction in offsets:
                    di, dj = offsets[direction]
                    ni, nj = i + di, j + dj

                    if 0 <= ni < self.dem.shape[0] and 0 <= nj < self.dem.shape[1]:
                        flow_accum[ni, nj] += flow_accum[i, j]

            logger.info(f"Flow accumulation computed: mean={np.nanmean(flow_accum):.2f}")
            return flow_accum

        except Exception as e:
            logger.error(f"Flow accumulation failed: {e}")
            raise

    def compute_topographic_wetness_index(self) -> np.ndarray:
        """
        Compute Topographic Wetness Index (TWI)

        Formula: TWI = ln(α / tan β)
        where:
            α = contributing area per unit width
            β = slope

        Interpretation:
            TWI < 4: Dry areas, ridge tops
            TWI 4-8: Mid-slope
            TWI 8-12: Valley bottoms (moist)
            TWI > 12: Stream valleys (very wet)

        Returns:
            TWI array (typically 0-30)
        """
        try:
            slope = self.compute_slope(units='radians')
            flow_accum = self.compute_flow_accumulation()

            # Cell size (30m for SRTM)
            cell_size = 30.0

            # Avoid division by zero and log of zero
            slope[slope < 0.001] = 0.001
            flow_accum[flow_accum < 1] = 1

            # TWI calculation
            twi = np.log(flow_accum * cell_size / np.tan(slope))

            # Clip to reasonable range
            twi[twi < 0] = 0
            twi[twi > 30] = 30

            logger.info(f"TWI computed: mean={np.nanmean(twi):.2f}, max={np.nanmax(twi):.2f}")
            return twi

        except Exception as e:
            logger.error(f"TWI computation failed: {e}")
            raise

    def compute_curvature(self, curvature_type: str = 'profile') -> np.ndarray:
        """
        Compute terrain curvature

        Args:
            curvature_type: 'profile' (along slope), 'planform' (perpendicular)

        Returns:
            Curvature array (m⁻¹)
        """
        try:
            # Second derivatives
            gxx, _ = np.gradient(np.gradient(self.dem, axis=0), axis=0)
            _, gyy = np.gradient(np.gradient(self.dem, axis=1), axis=1)
            gxy, _ = np.gradient(np.gradient(self.dem, axis=1), axis=0)

            if curvature_type == 'profile':
                curvature = gxx
            elif curvature_type == 'planform':
                curvature = gyy
            else:
                curvature = gxx + gyy  # Mean curvature

            logger.info(f"Curvature ({curvature_type}) computed")
            return curvature

        except Exception as e:
            logger.error(f"Curvature computation failed: {e}")
            raise

    def detect_valley_bottoms(self, twi_threshold: float = 8.0) -> Dict:
        """
        Identify valley floor areas

        Args:
            twi_threshold: TWI value above which is considered valley

        Returns:
            Dictionary with valley mask and statistics
        """
        try:
            twi = self.compute_topographic_wetness_index()
            slope = self.compute_slope()

            # Valley = high TWI + low slope
            valley_mask = (twi > twi_threshold) & (slope < 30)

            result = {
                'valley_mask': valley_mask,
                'valley_area_pct': np.sum(valley_mask) / valley_mask.size * 100,
                'valley_pixels': np.sum(valley_mask),
                'mean_elevation_valley': np.nanmean(self.dem[valley_mask])
            }

            logger.info(f"Valley detection: {result['valley_area_pct']:.1f}% of area")
            return result

        except Exception as e:
            logger.error(f"Valley detection failed: {e}")
            raise

    def detect_depressions(self, min_depth: float = 10.0) -> List[Dict]:
        """
        Find closed topographic depressions (sinkholes, dolines)

        Args:
            min_depth: Minimum depression depth in meters

        Returns:
            List of depression features with properties
        """
        try:
            # Find local minima
            local_min_filter = ndimage.grey_erosion(self.dem, size=5)
            local_min = self.dem == local_min_filter

            # Label connected components
            labeled_array, num_features = ndimage.label(local_min)

            depressions = []
            for i in range(1, num_features + 1):
                mask = labeled_array == i
                depression_dem = self.dem[mask]

                depth = depression_dem.max() - depression_dem.min()
                if depth > min_depth:
                    # Get centroid
                    coords = np.where(mask)
                    center_i, center_j = np.mean(coords[0]), np.mean(coords[1])

                    depressions.append({
                        'center_i': center_i,
                        'center_j': center_j,
                        'depth_m': float(depth),
                        'area_pixels': int(np.sum(mask)),
                        'min_elevation': float(depression_dem.min()),
                        'max_elevation': float(depression_dem.max())
                    })

            logger.info(f"Depression detection: {len(depressions)} depressions found")
            return depressions

        except Exception as e:
            logger.error(f"Depression detection failed: {e}")
            raise

    def detect_ridges(self) -> np.ndarray:
        """
        Identify ridge lines (local maxima)

        Returns:
            Ridge mask array
        """
        try:
            local_max_filter = ndimage.grey_dilation(self.dem, size=5)
            ridge_mask = self.dem == local_max_filter

            logger.info(f"Ridge detection: {np.sum(ridge_mask)} ridge pixels")
            return ridge_mask

        except Exception as e:
            logger.error(f"Ridge detection failed: {e}")
            raise

    def compute_hillshade(self, azimuth: float = 315, altitude: float = 45) -> np.ndarray:
        """
        Create hillshade for visualization and feature extraction

        Args:
            azimuth: Light source direction (degrees, 0-360)
            altitude: Light source elevation (degrees, 0-90)

        Returns:
            Hillshade array (0-255 grayscale)
        """
        try:
            # Convert angles to radians
            az_rad = np.radians(azimuth)
            alt_rad = np.radians(altitude)

            # Compute aspect and slope
            x_grad, y_grad = np.gradient(self.dem)
            aspect_rad = np.arctan2(-x_grad, y_grad)
            slope_rad = np.arctan(np.sqrt(x_grad**2 + y_grad**2))

            # Hillshade formula
            shaded = np.sin(alt_rad) * np.cos(slope_rad) + \
                     np.cos(alt_rad) * np.sin(slope_rad) * np.cos(az_rad - aspect_rad)

            # Scale to 0-255
            shaded = ((shaded + 1) / 2 * 255).astype(np.uint8)

            logger.info("Hillshade computed")
            return shaded

        except Exception as e:
            logger.error(f"Hillshade computation failed: {e}")
            raise

    def compute_all_indices(self) -> Dict[str, np.ndarray]:
        """
        Compute all topographic indices at once

        Returns:
            Dictionary of all computed indices
        """
        try:
            logger.info("Computing all topographic indices...")

            indices = {
                'slope': self.compute_slope(),
                'aspect': self.compute_aspect(),
                'twi': self.compute_topographic_wetness_index(),
                'flow_accumulation': self.compute_flow_accumulation(),
                'profile_curvature': self.compute_curvature('profile'),
                'planform_curvature': self.compute_curvature('planform'),
                'hillshade': self.compute_hillshade(),
                'ridge_mask': self.detect_ridges()
            }

            logger.info("All indices computed successfully")
            return indices

        except Exception as e:
            logger.error(f"Batch index computation failed: {e}")
            raise

    def export_as_geotiff(self, array: np.ndarray, output_path: str, metadata: Dict = None):
        """
        Export computed array as GeoTIFF

        Args:
            array: Numpy array to export
            output_path: Output file path
            metadata: Additional metadata
        """
        try:
            if self.transform is None:
                logger.warning("No geospatial metadata available (transform)")

            with rasterio.open(
                output_path,
                'w',
                driver='GTiff',
                height=array.shape[0],
                width=array.shape[1],
                count=1,
                dtype=array.dtype,
                transform=self.transform,
                crs=self.crs
            ) as dst:
                dst.write(array, 1)

            logger.info(f"Exported to: {output_path}")

        except Exception as e:
            logger.error(f"GeoTIFF export failed: {e}")
            raise
