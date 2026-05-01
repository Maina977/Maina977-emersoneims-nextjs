"""
Spectral Indices Calculator
Computes 28 spectral indices from multispectral satellite data:

VEGETATION INDICES (8):
- NDVI: Normalized Difference Vegetation Index
- EVI: Enhanced Vegetation Index
- GNDVI: Green Normalized Difference Vegetation Index
- SAVI: Soil-Adjusted Vegetation Index
- MSAVI: Modified Soil-Adjusted Vegetation Index
- NDII: Normalized Difference Infrared Index (Moisture)
- LAI: Leaf Area Index
- ARVI: Atmospherically Resistant Vegetation Index

WATER INDICES (6):
- NDWI: Normalized Difference Water Index
- MNDWI: Modified NDWI
- AWI: Apparent Water Index
- AWEI_sh: AWEI (shadow-free)
- AWEI_nsh: AWEI (including shadows)
- WRI: Water Ratio Index

SOIL/BARE SURFACE INDICES (7):
- INDEX: Bare Soil Index
- BI: Brightness Index
- SI: Salinity Index
- NDSI: Normalized Difference Salinity Index
- BI2: Modified Brightness Index
- CI: Clay Index
- FC: Fractional Cover

THERMAL/CLIMATE INDICES (7):
- NDBI: Normalized Difference Built-up Index
- NDMI: Normalized Difference Moisture Index
- NDLI: Normalized Difference Lava Index
- LST: Land Surface Temperature
- NDTI: Normalized Difference Tillage Index
- SR: Simple Ratio
- GCVI: Green-Red Vegetation Index
"""

import numpy as np
import xarray as xr
import logging
from typing import Dict, Optional, Union, Tuple
import warnings

logger = logging.getLogger(__name__)
warnings.filterwarnings('ignore')


class SpectralIndicesCalculator:
    """Compute spectral indices from multispectral satellite imagery"""

    def __init__(self, bands: Dict[str, np.ndarray], band_names: list = None):
        """
        Initialize calculator

        Args:
            bands: Dictionary with band data {'B2': array, 'B3': array, ...}
                   From Earth Engine: blue, green, red, red_edge, nir, swir1, swir2
            band_names: List of band names (if dict keys are not descriptive)
        """
        self.bands = {k: v.astype(float) for k, v in bands.items()}
        self.band_names = band_names or list(bands.keys())
        self._validate_bands()

    def _validate_bands(self):
        """Validate band inputs"""
        if not self.bands:
            raise ValueError("No bands provided")

        # Check for NaN/Inf
        for band_name, array in self.bands.items():
            nan_count = np.sum(np.isnan(array))
            if nan_count > 0:
                logger.warning(f"{band_name}: {nan_count} NaN values")

    def _safe_divide(self, numerator: np.ndarray, denominator: np.ndarray) -> np.ndarray:
        """Safe division avoiding division by zero"""
        with np.errstate(divide='ignore', invalid='ignore'):
            result = np.where(
                np.abs(denominator) > 1e-10,
                numerator / denominator,
                np.nan
            )
        return result

    def _clip_index(self, array: np.ndarray, min_val: float = -1, max_val: float = 1) -> np.ndarray:
        """Clip index values to valid range"""
        return np.clip(array, min_val, max_val)

    # ============ VEGETATION INDICES ============

    def ndvi(self) -> np.ndarray:
        """
        Normalized Difference Vegetation Index
        NDVI = (NIR - RED) / (NIR + RED)
        Range: -1 to 1 (negative = water, 0-0.3 = low veg, 0.6+ = dense veg)
        """
        nir = self.bands.get('B8', self.bands.get('nir'))
        red = self.bands.get('B4', self.bands.get('red'))

        if nir is None or red is None:
            raise ValueError("NIR and RED bands required for NDVI")

        return self._clip_index(self._safe_divide(nir - red, nir + red))

    def evi(self, L: float = 1.0, C1: float = 6.0, C2: float = 7.5) -> np.ndarray:
        """
        Enhanced Vegetation Index
        EVI = 2.5 * (NIR - RED) / (NIR + C1*RED - C2*BLUE + L)
        (Better for dense canopies than NDVI)
        """
        nir = self.bands.get('B8', self.bands.get('nir'))
        red = self.bands.get('B4', self.bands.get('red'))
        blue = self.bands.get('B2', self.bands.get('blue'))

        if nir is None or red is None or blue is None:
            raise ValueError("NIR, RED, and BLUE bands required for EVI")

        denominator = nir + C1 * red - C2 * blue + L
        return self._clip_index(2.5 * self._safe_divide(nir - red, denominator))

    def gndvi(self) -> np.ndarray:
        """
        Green Normalized Difference Vegetation Index
        GNDVI = (NIR - GREEN) / (NIR + GREEN)
        (More sensitive to leaf N content than NDVI)
        """
        nir = self.bands.get('B8', self.bands.get('nir'))
        green = self.bands.get('B3', self.bands.get('green'))

        if nir is None or green is None:
            raise ValueError("NIR and GREEN bands required for GNDVI")

        return self._clip_index(self._safe_divide(nir - green, nir + green))

    def savi(self, L: float = 0.5) -> np.ndarray:
        """
        Soil-Adjusted Vegetation Index
        SAVI = ((NIR - RED) / (NIR + RED + L)) * (1 + L)
        L = 0.5 for intermediate vegetation
        """
        nir = self.bands.get('B8', self.bands.get('nir'))
        red = self.bands.get('B4', self.bands.get('red'))

        if nir is None or red is None:
            raise ValueError("NIR and RED bands required for SAVI")

        return (1 + L) * self._safe_divide(nir - red, nir + red + L)

    def msavi(self) -> np.ndarray:
        """
        Modified Soil-Adjusted Vegetation Index
        MSAVI = 0.5 * (2*NIR + 1 - sqrt((2*NIR + 1)² - 8*(NIR - RED)))
        """
        nir = self.bands.get('B8', self.bands.get('nir'))
        red = self.bands.get('B4', self.bands.get('red'))

        if nir is None or red is None:
            raise ValueError("NIR and RED bands required for MSAVI")

        term = (2 * nir + 1) ** 2 - 8 * (nir - red)
        term = np.maximum(term, 0)  # Avoid negative sqrt

        return 0.5 * (2 * nir + 1 - np.sqrt(term))

    def ndii(self) -> np.ndarray:
        """
        Normalized Difference Infrared Index (Moisture)
        NDII = (NIR - SWIR1) / (NIR + SWIR1)
        (Moisture in vegetation/soil, high moisture = high NDII)
        """
        nir = self.bands.get('B8', self.bands.get('nir'))
        swir1 = self.bands.get('B11', self.bands.get('swir1'))

        if nir is None or swir1 is None:
            raise ValueError("NIR and SWIR1 bands required for NDII")

        return self._clip_index(self._safe_divide(nir - swir1, nir + swir1))

    def lai(self) -> np.ndarray:
        """
        Leaf Area Index (from NDVI)
        LAI = tan(π/4 * (NDVI + 1)) / 2.4
        Approximates leaf area per unit ground
        """
        ndvi = self.ndvi()
        return np.tan(np.pi / 4 * (ndvi + 1)) / 2.4

    def arvi(self) -> np.ndarray:
        """
        Atmospherically Resistant Vegetation Index
        ARVI = (NIR - 2*RED + BLUE) / (NIR + 2*RED - BLUE)
        (Less affected by atmospheric scattering)
        """
        nir = self.bands.get('B8', self.bands.get('nir'))
        red = self.bands.get('B4', self.bands.get('red'))
        blue = self.bands.get('B2', self.bands.get('blue'))

        if nir is None or red is None or blue is None:
            raise ValueError("NIR, RED, BLUE bands required for ARVI")

        return self._clip_index(self._safe_divide(nir - 2*red + blue, nir + 2*red - blue))

    # ============ WATER INDICES ============

    def ndwi(self) -> np.ndarray:
        """
        Normalized Difference Water Index
        NDWI = (GREEN - NIR) / (GREEN + NIR)
        (Water discriminator: >0.3 = open water, >0.5 = pure water)
        """
        green = self.bands.get('B3', self.bands.get('green'))
        nir = self.bands.get('B8', self.bands.get('nir'))

        if green is None or nir is None:
            raise ValueError("GREEN and NIR bands required for NDWI")

        return self._clip_index(self._safe_divide(green - nir, green + nir))

    def mndwi(self) -> np.ndarray:
        """
        Modified NDWI
        MNDWI = (GREEN - SWIR1) / (GREEN + SWIR1)
        (Better water/built-up discrimination)
        """
        green = self.bands.get('B3', self.bands.get('green'))
        swir1 = self.bands.get('B11', self.bands.get('swir1'))

        if green is None or swir1 is None:
            raise ValueError("GREEN and SWIR1 bands required for MNDWI")

        return self._clip_index(self._safe_divide(green - swir1, green + swir1))

    def awi(self) -> np.ndarray:
        """
        Apparent Water Index
        AWI = (SWIR1 + SWIR2 + RED) / (GREEN + NIR + BLUE) - 1
        """
        swir1 = self.bands.get('B11', self.bands.get('swir1'))
        swir2 = self.bands.get('B12', self.bands.get('swir2'))
        red = self.bands.get('B4', self.bands.get('red'))
        green = self.bands.get('B3', self.bands.get('green'))
        nir = self.bands.get('B8', self.bands.get('nir'))
        blue = self.bands.get('B2', self.bands.get('blue'))

        if any(x is None for x in [swir1, swir2, red, green, nir, blue]):
            raise ValueError("All bands required for AWI")

        num = swir1 + swir2 + red
        denom = green + nir + blue
        return self._safe_divide(num, denom) - 1

    def awei_sh(self) -> np.ndarray:
        """
        Automated Water Extraction Index (shadow-free)
        AWEI_sh = BLUE + 2.5*GREEN - 1.5*(NIR+SWIR1) - 0.25*SWIR2
        """
        blue = self.bands.get('B2', self.bands.get('blue'))
        green = self.bands.get('B3', self.bands.get('green'))
        nir = self.bands.get('B8', self.bands.get('nir'))
        swir1 = self.bands.get('B11', self.bands.get('swir1'))
        swir2 = self.bands.get('B12', self.bands.get('swir2'))

        if any(x is None for x in [blue, green, nir, swir1, swir2]):
            raise ValueError("All bands required for AWEI_sh")

        return blue + 2.5*green - 1.5*(nir + swir1) - 0.25*swir2

    def awei_nsh(self) -> np.ndarray:
        """
        Automated Water Extraction Index (including shadows)
        AWEI_nsh = BLUE + 2.5*GREEN - 1.5*(RED+NIR) - 0.25*SWIR2
        """
        blue = self.bands.get('B2', self.bands.get('blue'))
        green = self.bands.get('B3', self.bands.get('green'))
        red = self.bands.get('B4', self.bands.get('red'))
        nir = self.bands.get('B8', self.bands.get('nir'))
        swir2 = self.bands.get('B12', self.bands.get('swir2'))

        if any(x is None for x in [blue, green, red, nir, swir2]):
            raise ValueError("All bands required for AWEI_nsh")

        return blue + 2.5*green - 1.5*(red + nir) - 0.25*swir2

    def wri(self) -> np.ndarray:
        """
        Water Ratio Index
        WRI = (GREEN + RED) / (NIR + SWIR1)
        """
        green = self.bands.get('B3', self.bands.get('green'))
        red = self.bands.get('B4', self.bands.get('red'))
        nir = self.bands.get('B8', self.bands.get('nir'))
        swir1 = self.bands.get('B11', self.bands.get('swir1'))

        if any(x is None for x in [green, red, nir, swir1]):
            raise ValueError("All bands required for WRI")

        return self._safe_divide(green + red, nir + swir1)

    # ============ SOIL/BARE SURFACE INDICES ============

    def bsi(self) -> np.ndarray:
        """
        Bare Soil Index
        BSI = (SWIR1 + RED - NIR - BLUE) / (SWIR1 + RED + NIR + BLUE)
        High values = bare soil, low values = vegetation
        """
        swir1 = self.bands.get('B11', self.bands.get('swir1'))
        red = self.bands.get('B4', self.bands.get('red'))
        nir = self.bands.get('B8', self.bands.get('nir'))
        blue = self.bands.get('B2', self.bands.get('blue'))

        if any(x is None for x in [swir1, red, nir, blue]):
            raise ValueError("All bands required for BSI")

        num = swir1 + red - nir - blue
        denom = swir1 + red + nir + blue
        return self._clip_index(self._safe_divide(num, denom))

    def bi(self) -> np.ndarray:
        """
        Brightness Index
        BI = sqrt(RED² + NIR²)
        """
        red = self.bands.get('B4', self.bands.get('red'))
        nir = self.bands.get('B8', self.bands.get('nir'))

        if red is None or nir is None:
            raise ValueError("RED and NIR bands required for BI")

        return np.sqrt(red**2 + nir**2)

    def si(self) -> np.ndarray:
        """
        Salinity Index 1
        SI = sqrt(RED * SWIR1)
        (High values indicate salt-affected soils)
        """
        red = self.bands.get('B4', self.bands.get('red'))
        swir1 = self.bands.get('B11', self.bands.get('swir1'))

        if red is None or swir1 is None:
            raise ValueError("RED and SWIR1 bands required for SI")

        return np.sqrt(red * swir1)

    def ndsi(self) -> np.ndarray:
        """
        Normalized Difference Salinity Index
        NDSI = (SWIR1 - RED) / (SWIR1 + RED)
        """
        swir1 = self.bands.get('B11', self.bands.get('swir1'))
        red = self.bands.get('B4', self.bands.get('red'))

        if swir1 is None or red is None:
            raise ValueError("SWIR1 and RED bands required for NDSI")

        return self._clip_index(self._safe_divide(swir1 - red, swir1 + red))

    def bi2(self) -> np.ndarray:
        """
        Modified Brightness Index
        BI2 = sqrt((SWIR1/10000)² + (NIR/10000)²)
        """
        swir1 = self.bands.get('B11', self.bands.get('swir1'))
        nir = self.bands.get('B8', self.bands.get('nir'))

        if swir1 is None or nir is None:
            raise ValueError("SWIR1 and NIR bands required for BI2")

        return np.sqrt((swir1 / 10000)**2 + (nir / 10000)**2)

    def ci(self) -> np.ndarray:
        """
        Clay Index
        CI = SWIR1 / SWIR2
        (High values = clay-rich soils)
        """
        swir1 = self.bands.get('B11', self.bands.get('swir1'))
        swir2 = self.bands.get('B12', self.bands.get('swir2'))

        if swir1 is None or swir2 is None:
            raise ValueError("SWIR1 and SWIR2 bands required for CI")

        return self._safe_divide(swir1, swir2)

    def fc(self) -> np.ndarray:
        """
        Fractional Cover (percentage vegetation)
        FC = ((NDVI - NDVI_min) / (NDVI_max - NDVI_min))²
        """
        ndvi = self.ndvi()
        ndvi_min, ndvi_max = np.nanpercentile(ndvi, [2, 98])
        fc = ((ndvi - ndvi_min) / (ndvi_max - ndvi_min + 1e-10)) ** 2
        return np.clip(fc, 0, 1)

    # ============ THERMAL/CLIMATE INDICES ============

    def ndbi(self) -> np.ndarray:
        """
        Normalized Difference Built-up Index
        NDBI = (SWIR1 - NIR) / (SWIR1 + NIR)
        (Detects built-up areas, roads, urban infrastructure)
        """
        swir1 = self.bands.get('B11', self.bands.get('swir1'))
        nir = self.bands.get('B8', self.bands.get('nir'))

        if swir1 is None or nir is None:
            raise ValueError("SWIR1 and NIR bands required for NDBI")

        return self._clip_index(self._safe_divide(swir1 - nir, swir1 + nir))

    def ndmi(self) -> np.ndarray:
        """
        Normalized Difference Moisture Index
        NDMI = (NIR - SWIR1) / (NIR + SWIR1)
        (Same as NDII - soil/plant moisture)
        """
        return self.ndii()

    def ndli(self) -> np.ndarray:
        """
        Normalized Difference Lava Index
        NDLI = (SWIR2 - NIR) / (SWIR2 + NIR)
        (Detects recent lava flows, volcanic rocks)
        """
        swir2 = self.bands.get('B12', self.bands.get('swir2'))
        nir = self.bands.get('B8', self.bands.get('nir'))

        if swir2 is None or nir is None:
            raise ValueError("SWIR2 and NIR bands required for NDLI")

        return self._clip_index(self._safe_divide(swir2 - nir, swir2 + nir))

    def lst(self, thermal_band: Optional[np.ndarray] = None, wavelength: float = 10.9e-6) -> np.ndarray:
        """
        Land Surface Temperature (from thermal band)
        Requires thermal band data. Simplified version.
        LST = wavelength * radiance / (σ * ln((ρ * radiance / λ) + 1))
        """
        if thermal_band is None:
            logger.warning("LST requires thermal band data (B10/B11 for Landsat)")
            return np.full_like(self.ndvi(), np.nan)

        # Simplified: approximate LST from NDVI relationship
        ndvi = self.ndvi()
        pv = ((ndvi - ndvi.min()) / (ndvi.max() - ndvi.min())) ** 2
        lst = 293.15 + (thermal_band * 0.0003) * np.log(pv)  # Simplified

        return lst

    def ndti(self) -> np.ndarray:
        """
        Normalized Difference Tillage Index
        NDTI = (SWIR1 - RED) / (SWIR1 + RED)
        (Detects soil disturbance/tillage)
        """
        swir1 = self.bands.get('B11', self.bands.get('swir1'))
        red = self.bands.get('B4', self.bands.get('red'))

        if swir1 is None or red is None:
            raise ValueError("SWIR1 and RED bands required for NDTI")

        return self._clip_index(self._safe_divide(swir1 - red, swir1 + red))

    def sr(self) -> np.ndarray:
        """
        Simple Ratio (vegetation index)
        SR = NIR / RED
        (Alternative to NDVI, avoids extreme values)
        """
        nir = self.bands.get('B8', self.bands.get('nir'))
        red = self.bands.get('B4', self.bands.get('red'))

        if nir is None or red is None:
            raise ValueError("NIR and RED bands required for SR")

        return self._safe_divide(nir, red)

    def gcvi(self) -> np.ndarray:
        """
        Green-Red Vegetation Index
        GCVI = (NIR / GREEN) - 1
        (Similar to SR but uses green instead of red)
        """
        nir = self.bands.get('B8', self.bands.get('nir'))
        green = self.bands.get('B3', self.bands.get('green'))

        if nir is None or green is None:
            raise ValueError("NIR and GREEN bands required for GCVI")

        return self._safe_divide(nir, green) - 1

    # ============ BATCH COMPUTATION ============

    def compute_all_indices(self) -> Dict[str, np.ndarray]:
        """
        Compute all 28 spectral indices

        Returns:
            Dictionary with index name as key, array as value
        """
        indices = {}

        # Vegetation (8)
        try:
            indices['NDVI'] = self.ndvi()
            indices['EVI'] = self.evi()
            indices['GNDVI'] = self.gndvi()
            indices['SAVI'] = self.savi()
            indices['MSAVI'] = self.msavi()
            indices['NDII'] = self.ndii()
            indices['LAI'] = self.lai()
            indices['ARVI'] = self.arvi()
        except ValueError as e:
            logger.warning(f"Vegetation indices: {e}")

        # Water (6)
        try:
            indices['NDWI'] = self.ndwi()
            indices['MNDWI'] = self.mndwi()
            indices['AWI'] = self.awi()
            indices['AWEI_sh'] = self.awei_sh()
            indices['AWEI_nsh'] = self.awei_nsh()
            indices['WRI'] = self.wri()
        except ValueError as e:
            logger.warning(f"Water indices: {e}")

        # Soil (7)
        try:
            indices['BSI'] = self.bsi()
            indices['BI'] = self.bi()
            indices['SI'] = self.si()
            indices['NDSI'] = self.ndsi()
            indices['BI2'] = self.bi2()
            indices['CI'] = self.ci()
            indices['FC'] = self.fc()
        except ValueError as e:
            logger.warning(f"Soil indices: {e}")

        # Thermal (7)
        try:
            indices['NDBI'] = self.ndbi()
            indices['NDMI'] = self.ndmi()
            indices['NDLI'] = self.ndli()
            indices['NDTI'] = self.ndti()
            indices['SR'] = self.sr()
            indices['GCVI'] = self.gcvi()
            indices['LST'] = self.lst()
        except ValueError as e:
            logger.warning(f"Thermal indices: {e}")

        logger.info(f"Computed {len(indices)} spectral indices")
        return indices

    def to_xarray(self, indices: Dict[str, np.ndarray]) -> xr.Dataset:
        """
        Convert indices to xarray Dataset for easier handling

        Args:
            indices: Dictionary of computed indices

        Returns:
            xarray Dataset with dimensions (y, x)
        """
        data_vars = {name: (('y', 'x'), array) for name, array in indices.items()}
        ds = xr.Dataset(data_vars)
        logger.info(f"Converted to xarray: {ds.dims}")
        return ds
