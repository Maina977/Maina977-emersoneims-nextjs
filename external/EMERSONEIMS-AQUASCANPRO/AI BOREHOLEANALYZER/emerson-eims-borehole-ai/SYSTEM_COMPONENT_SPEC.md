# SYSTEM COMPONENT SPECIFICATION & ARCHITECTURE

**Version:** 1.0  
**Date:** April 15, 2026  
**Status:** DESIGN PHASE

---

## 1. DATA INGESTION & PREPROCESSING MODULE

### 1.1 Component: ImageMetadataExtractor

**Purpose:** Extract EXIF data from user-uploaded images to obtain GPS coordinates, timestamp, and camera metadata.

**Location:** `backend/app/services/image_metadata.py`

**Interface:**
```python
class ImageMetadataExtractor:
    def extract_exif(
        self, 
        image_file: UploadFile
    ) -> Dict[str, Any]:
        """
        Extract EXIF data from image
        Returns: {
            'latitude': float,
            'longitude': float,
            'timestamp': str,
            'altitude': float,
            'camera_model': str,
            'horizontal_accuracy': float
        }
        """

    def validate_coordinates(
        self, 
        lat: float, 
        lon: float
    ) -> bool:
        """Validate GPS coordinates are in valid range"""

    def estimate_confidence(
        self, 
        exif_data: Dict
    ) -> float:
        """0.0-1.0 confidence in geolocation"""
```

**Input Validation:**
- Image format: JPG, PNG, TIFF (with EXIF)
- File size: <100MB
- Image resolution: ≥1080p for quality analysis
- GPS accuracy: ≤100m preferred

**Output Format:**
```json
{
  "metadata": {
    "source": "device_gps",
    "latitude": -1.286389,
    "longitude": 36.817223,
    "horizontal_accuracy_m": 8.5,
    "vertical_accuracy_m": 15.0,
    "timestamp": "2024-01-15T10:30:00Z",
    "confidence": 0.92
  },
  "image_properties": {
    "width": 4000,
    "height": 3000,
    "channels": 3,
    "bit_depth": 8
  }
}
```

---

### 1.2 Component: GeolocationFallback

**Purpose:** If no EXIF GPS exists, use visual place recognition and reverse geocoding.

**Methods:**
1. **NetVLAD** - Visual place recognition against 100M geotagged images
2. **Google Vision API** - Landmark detection to narrow location
3. **Reverse Image Search** - Find similar locations
4. **User Textual Input** - Address/description parsing

**Confidence Gradation:**
```
Source              | Confidence | Accuracy
────────────────────────────────
Device GPS          | > 0.9      | ±10m
Visual landmarks    | 0.7-0.85   | ±500m
Terrain silhouette  | 0.6-0.75   | ±2km
User address        | 0.5-0.7    | ±5km
Vegetation zone     | 0.3-0.5    | ±50km
```

---

## 2. SATELLITE DATA FUSION MODULE

### 2.1 Architecture Overview

```
User Location Request (lat/lon)
         ↓
    ┌────┴────┐
    ↓         ↓
  STAC      Earth Engine
  Browser   API
    ↓         ↓
    └────┬────┘
         ↓
   Query Orchestrator
    (optimize coverage & cost)
         ↓
         ├─→ Sentinel-1 SAR
         ├─→ Sentinel-2 Optical
         ├─→ Landsat Thermal
         ├─→ GRACE Gravity
         ├─→ SRTM DEM
         ├─→ MERRA-2 Reanalysis
         └─→ CHIRPS Rainfall
         ↓
    Pre-processing Pipeline
         ↓
    Spectral Index Calculator
         ↓
    28 Derived Products
         ↓
    Database Storage (GeoTIFF + NetCDF)
```

### 2.2 Component: SatelliteDataClient

**Purpose:** Multi-source satellite data retrieval and standardization.

**Location:** `backend/app/services/satellite_data.py`

```python
class SatelliteDataClient:
    """Unified satellite data access layer"""
    
    def __init__(self, ee_key: str, stac_endpoints: List[str]):
        self.ee = ee.Authenticate()
        self.stac_clients = self._init_stac(stac_endpoints)
    
    async def query_sentinel1(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str,
        orbit: str = "ASCENDING"
    ) -> xr.DataArray:
        """
        Get Sentinel-1 SAR backscatter data
        
        Returns: VV & VH polarization (dB)
        • VV: vertical transmit/vertical receive
        • VH: vertical transmit/horizontal receive
        
        Science: SAR backscatter ∝ soil moisture
        dB = 10 × log10(σ⁰) where σ⁰ is backscatter coefficient
        """
    
    async def query_sentinel2(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str,
        cloud_cover: float = 20.0
    ) -> Dict[str, xr.DataArray]:
        """
        Get Sentinel-2 multispectral data
        
        Bands needed:
        • Band 2: Blue (490nm)
        • Band 3: Green (560nm)
        • Band 4: Red (665nm)
        • Band 5: Vegetation Edge (705nm)
        • Band 6: Vegetation Edge (740nm)
        • Band 7: Vegetation Edge (783nm)
        • Band 8: NIR (842nm)
        • Band 11: SWIR-1 (1610nm)
        • Band 12: SWIR-2 (2190nm)
        
        Returns: 10m/20m resolution mosaics (least cloudy composite)
        """
    
    async def query_landsat89(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str
    ) -> Dict[str, xr.DataArray]:
        """
        Get Landsat 8/9 thermal & optical data
        
        Bands needed:
        • Band 4: Red (645nm)
        • Band 5: NIR (865nm)
        • Band 6: SWIR-1 (1610nm)
        • Band 7: SWIR-2 (2200nm)
        • Band 10: Thermal IR (10.9μm) - 100m
        • Band 11: Thermal IR (12.0μm) - 100m
        
        Returns: 30m optical + 100m thermal
        """
    
    async def query_grace_gravity(
        self,
        lat: float,
        lon: float,
        radius_km: float = 100.0,
        start_date: str = "2002-04-01"
    ) -> Dict[str, np.ndarray]:
        """
        Get GRACE-FO groundwater storage anomaly
        
        Science: Δm = ΔgR²/GM where:
        • Δm = water mass change (mm water equivalent)
        • Δg = gravity anomaly
        • R = Earth radius
        • G = gravitational constant
        • M = Earth mass
        
        Use Case: Regional groundwater storage trend
        Resolution: 330km spatial, 1-month temporal
        """
    
    async def query_srtm_dem(
        self,
        bbox: Tuple[float, float, float, float],
        version: str = "3"
    ) -> xr.DataArray:
        """
        Get SRTM 30m Digital Elevation Model
        
        Returns: Elevation grid (meters above sea level)
        Quality: ±16m absolute vertical error (90% confidence)
        """
    
    async def query_merra2_reanalysis(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str,
        variables: List[str] = [
            "T2M",       # 2m temperature
            "Q2M",       # 2m specific humidity
            "PRECTOT",   # Total precipitation
            "EVAP"       # Evaporation
        ]
    ) -> xr.Dataset:
        """
        Get MERRA-2 meteorological reanalysis
        
        Resolution: 0.5° × 0.625°, hourly/monthly
        Used for: Climate normals, ET calculation
        """
    
    async def query_chirps_rainfall(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str
    ) -> xr.DataArray:
        """
        Get CHIRPS daily rainfall estimates
        
        30-year history (1981-present)
        0.05° resolution (~5.5km)
        Used for: Precipitation anomalies, recharge trends
        """
```

### 2.3 Component: SpectralIndexCalculator

**Purpose:** Compute 28 spectral indices from satellite bands.

**Location:** `backend/app/services/spectral_indices.py`

**Indices Calculated:**
```
VEGETATION INDICES:
├─ NDVI = (NIR - RED) / (NIR + RED)                      [-1, 1]
├─ NDVI_G = (b8 - b3) / (b8 + b3)                        GRN band
├─ EVI = 2.5 × (NIR - RED) / (NIR + 6×RED - 7.5×BLUE)  Enhanced
├─ SAVI = (1 + 0.16) × (NIR - RED) / (NIR + RED + 0.16) Soil-adjusted
├─ MSAVI = (2×NIR+1 - sqrt((2×NIR+1)² - 8×(NIR-RED))) / 2
├─ OSAVI = (1.16) × (NIR - RED) / (NIR + RED + 0.16)    Optimized
└─ GNDVI = (NIR - GREEN) / (NIR + GREEN)                 vs green

WATER INDICES:
├─ NDWI = (GREEN - SWIR) / (GREEN + SWIR)               [-1, 1]
├─ MNDWI = (GREEN - SWIR1) / (GREEN + SWIR1)            Modification
├─ NDII = (NIR - SWIR) / (NIR + SWIR)                   Drought indicator
├─ NDMI = (NIR - SWIR1) / (NIR + SWIR1)                 Moisture
└─ NBR = (NIR - SWIR2) / (NIR + SWIR2)                  Post-fire

THERMAL INDICES:
├─ LST = Surface Land Temperature (°C)                   Computed from bands 10-11
├─ NDTI = (SWIR - THERMAL) / (SWIR + THERMAL)          Temperature index
├─ NDBI = (SWIR1 - NIR) / (SWIR1 + NIR)                Built-up
└─ NDVI_T = Temperature × NDVI interaction              Stress indicator

SOIL INDICES:
├─ SI = (SWIR1 - NIR) / (SWIR1 + NIR)                  Salinity index
├─ BI = sqrt(SWIR² + RED²)                              Brightness index
├─ ISI = (2 × SWIR) / (3 × NIR + RED)                  Iron oxide
├─ RIBI = (RED/BLUE) × ((RED - BLUE) / (RED + BLUE))   Ratio
├─ ARVI = (NIR - (2×RED - BLUE)) / (NIR + (2×RED - BLUE))
└─ IRECI = (NIR - RED) / (RED/B5) × (B7/B5)            Pigment

TOPOGRAPHIC/DEM:
├─ Slope = arctan(dz/dx)                               [0°, 90°]
├─ Aspect = arctan(dy/dx)                              [0°, 360°]
├─ Curvature_Profile = ∂²z/∂x²                         m⁻¹
├─ Curvature_Plan = ∂²z/∂y²
├─ TWI = ln(α / tan β)                                 [-∞, ∞), typically [0, 30]
└─ Hillshade = Relief shading for visualization

DERIVED HYDROLOGICAL:
├─ ET_SEBAL = Latent heat flux → evapotranspiration    mm/day
├─ Soil_Moisture = Dielectric model from SAR           Vol. water content
├─ Recharge_Index = Precipitation × Infiltration_Rate
└─ Drought_Index = SPI (Standardized Precip. Index)
```

**Implementation:**
```python
class SpectralIndexCalculator:
    """Compute spectral indices from satellite bands"""
    
    def __init__(self, sentinel2_bands: Dict[int, xr.DataArray]):
        """Initialize with Sentinel-2 10 bands"""
        self.bands = sentinel2_bands  # B2(blue), B3(green), B4(red), B5-B7(rededge), B8(nir), B11-B12(swir)
    
    def compute_all_indices(self) -> Dict[str, xr.DataArray]:
        """Calculate all 28 indices at once"""
        return {
            'ndvi': self.ndvi(),
            'evi': self.evi(),
            'ndwi': self.ndwi(),
            'mndwi': self.mndwi(),
            'lst': self.lst_from_landsat(),
            'twi': self.topographic_wetness_index(),
            'et': self.sebal_evapotranspiration(),
            # ... other indices
        }
    
    @staticmethod
    def ndvi(nir: xr.DataArray, red: xr.DataArray) -> xr.DataArray:
        """Normalized Difference Vegetation Index"""
        return (nir - red) / (nir + red)
    
    @staticmethod
    def ndwi(green: xr.DataArray, swir: xr.DataArray) -> xr.DataArray:
        """Normalized Difference Water Index"""
        return (green - swir) / (green + swir)
    
    @staticmethod
    def sebal_evapotranspiration(
        ndvi: xr.DataArray,
        lst: xr.DataArray,
        dem: xr.DataArray,
        radiation_incoming: float
    ) -> xr.DataArray:
        """
        SEBAL algorithm for evapotranspiration
        
        1. Calculate NDVI & fractional vegetation cover
        2. Estimate leaf area index (LAI)
        3. Calculate soil heat flux (G)
        4. Estimate sensible heat flux (H)
        5. Calculate latent heat flux (LE)
        6. Convert to ET (mm/day)
        """
```

---

## 3. GEOLOGICAL ANALYSIS MODULE

### 3.1 Component: AquiferTypeClassifier

**Purpose:** Classify aquifer type (confined/unconfined/karst) using multi-source data.

**Location:** `backend/app/services/geology.py`

**Data Inputs:**
- Geology map (lithology)
- DEM (structure)
- Lineament density
- Borehole record correlations

```python
class AquiferTypeClassifier:
    """Classify aquifer type from geological data"""
    
    def classify(
        self,
        lithology: str,
        depth: float,
        lineament_density: float,
        structure_data: Dict,
        historical_boreholes: List[Dict]
    ) -> Dict[str, Any]:
        """
        Returns: {
            'primary_type': 'confined' | 'unconfined' | 'karst',
            'confidence': 0.0-1.0,
            'secondary_types': [...],
            'lithology': [...],
            'thickness_m': float,
            'porosity_fraction': float,
            'permeability_m_per_day': float
        }
        """
```

**Classification Logic:**
```
IF limestone/dolomite AND lineament_density > 0.5 km/km²:
    → KARST aquifer (high fracture permeability)
ELSE IF clay_layer_above AND thickness > 30m:
    → CONFINED aquifer (artesian pressure)
ELSE IF permeable_layer AND near_surface:
    → UNCONFINED aquifer (water table)

Confidence based on:
├─ Lithology match (0.4 weight)
├─ Regional geological context (0.3 weight)
├─ Historical boreholes similarity (0.2 weight)
└─ Structural evidence (0.1 weight)
```

---

### 3.2 Component: LineamentDetector

**Purpose:** Automatically extract faults and fractures from DEM.

**Location:** `backend/app/services/lineament_detection.py`

```python
class LineamentDetector:
    """Detect faults, fractures, and lineaments from DEM"""
    
    def detect_lineaments(
        self,
        dem: xr.DataArray,
        min_length_km: float = 5.0,
        prominence_threshold: float = 10.0
    ) -> Dict[str, Any]:
        """
        Returns: {
            'lineament_polylines': [...],  # GeoJSON features
            'lineament_density': float,     # km/km²
            'primary_orientations': [...],  # degrees
            'fault_scarps': [...],
            'confidence_map': xr.DataArray
        }
        """
    
    @staticmethod
    def _hillshade(dem: xr.DataArray) -> xr.DataArray:
        """Create hillshade visualization for feature extraction"""
    
    @staticmethod
    def _canny_edge_detection(hillshade: xr.DataArray) -> xr.DataArray:
        """Apply Canny edge detection to find linear features"""
    
    @staticmethod
    def _line_fitting(edges: xr.DataArray) -> List[Dict]:
        """Fit lines to detected edges using Hough transform"""
        # Returns: list of {start_xy, end_xy, length, orientation, confidence}
```

**Scientific Method:**
```
Step 1: Create hillshade from DEM
        hillshade = sin(alt) × cos(azi - asp)

Step 2: Apply Canny edge detection
        Find gradients > threshold

Step 3: Apply Hough line transform
        Consolidate edge pixels into line segments

Step 4: Filter by length & prominence
        Minimum 5km, scarps > 10m height

Step 5: Calculate lineament density
        Total line length / area (km/km²)
```

---

### 3.3 Component: BedRockDepthInversion

**Purpose:** Estimate depth to bedrock using gravity inversion.

**Location:** `backend/app/services/bedrock_depth.py`

```python
class BedRockDepthInversion:
    """Invert gravity anomalies to estimate bedrock depth"""
    
    def estimate_bedrock_depth(
        self,
        gravity_anomaly: xr.DataArray,  # Bouguer anomaly (mGal)
        density_contrast: float = 300.0,  # kg/m³ (sediment-bedrock)
        regional_depth: float = None
    ) -> Dict[str, Any]:
        """
        Use gravity inversion to estimate bedrock depth
        
        Approximation (Nettleton's formula):
        z = Δg / (2πGρ)
        
        where:
        • z = depth to bedrock (m)
        • Δg = gravity anomaly (mGal = 0.01 mm/s²)
        • G = 6.674 × 10⁻¹¹ m³/(kg·s²)
        • ρ = density contrast (kg/m³)
        
        More sophisticated: Parker-Oldenburg inversion
        """
    
    def parker_oldenburg_inversion(
        self,
        gravity_grid: xr.DataArray,
        depth_weighting: float = 3.0
    ) -> xr.DataArray:
        """
        Iterative depth inversion using Parker-Oldenburg method
        
        Produces: Bedrock topography grid (±50m accuracy)
        """
```

---

## 4. TOPOGRAPHIC & HYDROLOGICAL ANALYSIS

### 4.1 Component: TopographicAnalyzer

**Purpose:** Compute TWI, slope, flow direction from DEM.

**Location:** `backend/app/services/topography.py`

```python
class TopographicAnalyzer:
    """
    Hydrological analysis from DEM
    
    Implements: D8, D-Infinity, TWI, slope, aspect, curvature
    """
    
    def __init__(self, dem: xr.DataArray):
        self.dem = dem
        self.flow_dir = None
        self.flow_accum = None
        self.twi = None
    
    def compute_topographic_wetness_index(self) -> xr.DataArray:
        """
        TWI = ln(α / tan β)
        
        where:
        • α = upstream contributing area per unit width (m)
        • β = slope (radians)
        
        Interpretation:
        • TWI < 5: Dry areas, ridge tops
        • TWI 5-10: Mid-slope positions
        • TWI > 10: Valley bottoms, waterlogged
        
        Use: Predicts groundwater depth, saturation zones
        """
        
        # Step 1: Calculate slope
        slope = self._calculate_slope()  # radians
        
        # Step 2: Calculate flow accumulation
        flow_accum = self._d8_flow_accumulation()
        
        # Step 3: Calculate cell width (resolution)
        cell_width = self.dem.rio.resolution()[0]
        
        # Step 4: Compute TWI
        twi = np.log(flow_accum * cell_width / np.tan(slope))
        
        return xr.DataArray(twi, coords=self.dem.coords, dims=self.dem.dims)
    
    def _d8_flow_accumulation(self) -> np.ndarray:
        """
        D8 (8-direction) flow routing
        
        Direction coding:
        7 8 1
        6 * 2
        5 4 3
        
        Returns: Flow accumulation grid (cells contributing to each point)
        """
    
    def _dinf_flow_direction(self) -> Tuple[np.ndarray, np.ndarray]:
        """
        D-Infinity flow direction
        
        More realistic: flow can go to multiple cells
        Returns: (flow_direction, flow_proportion)
        """
    
    def detect_valley_bottoms(self) -> xr.DataArray:
        """Identify valley floors using slope + TWI"""
    
    def detect_alluvial_fans(self) -> List[Dict]:
        """Identify fan-shaped accumulation patterns"""
    
    def detect_karst_features(self) -> List[Dict]:
        """Identify closed depressions (sinkholes, dolines)"""
    
    def detect_spring_lines(self, geology_map) -> List[Dict]:
        """Map potential spring locations where geology changes"""
```

---

## 5. MACHINE LEARNING PIPELINE

### 5.1 Architecture: Ensemble Prediction System

```
Input Features (50+ features)
    │
    ├─→ CNN (ResNet-50)      ─→ P_CNN
    ├─→ Random Forest         ─→ P_RF
    ├─→ XGBoost              ─→ P_XGB
    ├─→ Neural Network       ─→ P_NN
    └─→ LSTM (time-series)   ─→ P_LSTM
    │
    ↓
Stacking Meta-Learner
    │
    ↓
Final Prediction + Confidence
    │
    ├─ Probability: 0.0-1.0
    ├─ Depth: 20-120m
    ├─ Yield: 2-25 m³/h
    └─ Confidence Intervals (50%, 80%, 95%)
```

### 5.2 Component: SuccessProbabilityEnsemble

```python
class SuccessProbabilityEnsemble:
    """
    Ensemble success prediction
    
    Formula:
    P(success) = w₁×P(geology) + w₂×P(structure) + w₃×P(topography) + 
                 w₄×P(vegetation) + w₅×P(remote_sensing) + w₆×P(historical)
    
    Weights (calibrated from 10,000 boreholes):
    w₁ = 0.30  (Geology - primary control)
    w₂ = 0.20  (Structure - secondary permeability)
    w₃ = 0.15  (Topography - recharge indicator)
    w₄ = 0.10  (Vegetation - phreatophyte indicator)
    w₅ = 0.15  (Remote sensing - multi-spectral evidence)
    w₆ = 0.10  (Historical - local validation)
    """
    
    def __init__(self, models: Dict[str, Any]):
        self.models = models  # CNN, RF, XGB, NN, LSTM
        self.meta_learner = None
        self.weights = {
            'geology': 0.30,
            'structure': 0.20,
            'topography': 0.15,
            'vegetation': 0.10,
            'remote_sensing': 0.15,
            'historical': 0.10
        }
    
    def predict(
        self,
        features: Dict[str, float]
    ) -> Dict[str, Any]:
        """
        Make ensemble prediction
        
        Returns: {
            'probability': 0.0-1.0,
            'confidence': 0.0-1.0,
            'depth_mean_m': float,
            'depth_std_m': float,
            'yield_mean_m3h': float,
            'yield_std_m3h': float,
            'intervals': {
                '50%': (lower, upper),
                '80%': (lower, upper),
                '95%': (lower, upper)
            },
            'model_votes': {...},  # Each model's prediction
            'feature_importance': {...}
        }
        """
        
        # Get predictions from each model
        p_geology = self._predict_geology(features)
        p_structure = self._predict_structure(features)
        p_topography = self._predict_topography(features)
        p_vegetation = self._predict_vegetation(features)
        p_remote_sensing = self._predict_remote_sensing(features)
        p_historical = self._predict_historical(features)
        
        # Weighted ensemble
        p_success = (
            self.weights['geology'] * p_geology +
            self.weights['structure'] * p_structure +
            self.weights['topography'] * p_topography +
            self.weights['vegetation'] * p_vegetation +
            self.weights['remote_sensing'] * p_remote_sensing +
            self.weights['historical'] * p_historical
        )
        
        # Get SHAP explanations
        shap_values = self._compute_shap(features)
        
        return {
            'probability': min(max(p_success, 0.0), 1.0),  # Clamp 0-1
            'confidence': self._confidence_from_ensemble(),
            'feature_importance': shap_values,
            'model_agreement': self._model_agreement()
        }
    
    def _predict_geology(self, features: Dict) -> float:
        """Predict based on lithology, aquifer type, etc."""
    
    def _predict_structure(self, features: Dict) -> float:
        """Predict based on lineament density, faults"""
    
    def _predict_topography(self, features: Dict) -> float:
        """Predict based on TWI, slope, distance to streams"""
    
    def _predict_vegetation(self, features: Dict) -> float:
        """Predict based on NDVI, phreatophytes"""
    
    def _predict_remote_sensing(self, features: Dict) -> float:
        """Predict based on NDWI, LST, SAR backscatter"""
    
    def _predict_historical(self, features: Dict) -> float:
        """Predict based on similar historical sites in database"""
    
    def _compute_shap(self, features: Dict):
        """SHAP explainability - feature importance"""
```

---

## 6. RISK ASSESSMENT MODULE

### 6.1 Component: ComprehensiveRiskAssessment

```python
class ComprehensiveRiskAssessment:
    """
    Integrated risk assessment across 5 dimensions
    """
    
    def assess(
        self,
        site_data: Dict,
        predictions: Dict
    ) -> Dict[str, Any]:
        """
        Returns: {
            'overall_risk_score': 0.0-1.0,
            'risk_levels': {
                'geological': 0.0-1.0,
                'contamination': 0.0-1.0,
                'depth': 0.0-1.0,
                'financial': 0.0-1.0,
                'technical': 0.0-1.0
            },
            'risk_matrix': {...},  # 5×5 likelihood vs consequence
            'top_risks': [...],     # Ranked risk factors
            'mitigation_strategies': [...]
        }
        """

class ContaminationRiskDetector:
    """
    Detect contamination sources:
    ├─ Sewage: Distance to settlements + population density
    ├─ Agriculture: Land use classification + fertilizer patterns
    ├─ Industrial: Distance to factories + emission types
    ├─ Landfill: Verified waste sites + groundwater gradient
    └─ Mining: Known mining areas + tailings dams
    """

class FinancialRiskAnalyzer:
    """
    Monte Carlo simulation for cost/ROI uncertainty:
    
    Variables sampled:
    ├─ Drilling rate (±20% variation)
    ├─ Actual drilling depth (±30% variation)
    ├─ Unforeseen conditions (5-15% probability)
    ├─ Yield realization (from distribution)
    └─ Water quality treatment needs
    
    Outputs:
    ├─ Cost P10/P50/P90 percentiles
    ├─ Yield probability distribution
    ├─ ROI distribution
    └─ Risk of loss
    """
```

---

## 7. COST ESTIMATION MODULE

### 7.1 Component: CostBreakdownCalculator

```python
class CostBreakdownCalculator:
    """
    Itemized cost estimation with regional pricing
    
    Formula:
    Total Cost = Drilling + Casing + Screen + Pump + 
                 Mobilization + Permits + Testing + Contingency
    """
    
    def estimate_total_cost(
        self,
        depth_m: float,
        geology_codes: List[str],
        remoteness_factor: float,
        location_country: str
    ) -> Dict[str, Any]:
        """
        Returns itemized budget:
        {
            'drilling': {...},
            'casing': {...},
            'screen': {...},
            'pump': {...},
            'mobilization': {...},
            'permits': {...},
            'testing': {...},
            'contingency': {...},
            'total_usd': float,
            'cost_per_meter': float,
            'currency': 'USD'
        }
        """
        
        # Drilling costs (geology dependent)
        drilling_cost = self._drilling_cost_by_geology(depth_m, geology_codes)
        
        # Casing cost
        casing_cost = self._casing_cost(depth_m)
        
        # Screen cost
        screen_cost = self._screen_cost(depth_m)
        
        # Pump cost
        pump_cost = self._pump_cost(estimated_yield_m3h)
        
        # Mobilization
        mobilization = self._mobilization_cost(remoteness_factor)
        
        # Permits
        permits = self._permit_cost(location_country)
        
        # Testing
        testing = self._testing_cost(params_to_analyze=['TDS', 'fluoride', 'arsenic', 'bacteria'])
        
        # Contingency (15% standard)
        contingency = 0.15 * (drilling_cost + casing_cost + screen_cost + pump_cost)
        
        subtotal = drilling_cost + casing_cost + screen_cost + pump_cost + mobilization + permits + testing
        
        return {
            'drilling_usd': drilling_cost,
            'casing_usd': casing_cost,
            'screen_usd': screen_cost,
            'pump_usd': pump_cost,
            'mobilization_usd': mobilization,
            'permits_usd': permits,
            'testing_usd': testing,
            'contingency_usd': contingency,
            'subtotal_subtotal': subtotal,
            'total_usd': subtotal + contingency
        }
    
    def _drilling_cost_by_geology(self, depth_m: float, geology: List[str]) -> float:
        """
        Drilling rates by geology (Kenya context):
        
        Sandy formations: $45-60/m
        Clay formations: $55-75/m
        Rocky/volcanic: $80-150/m
        Mixed: Interpolate based on profile
        """
        # Returns: total drilling cost in USD
    
    def compute_roi_analysis(
        self,
        total_cost_usd: float,
        annual_water_value_usd: float,
        estimated_yield_m3h: float,
        operational_life_years: int = 10
    ) -> Dict[str, Any]:
        """
        Financial analysis:
        {
            'roi_percent': 0-500%,
            'payback_period_years': float,
            'npv_usd': float,  # 10-year NPV at 10% discount rate
            'irr_percent': float,
            'breakeven_years': float,
            'water_cost_per_m3': float
        }
        """
```

---

## 8. WATER QUALITY PREDICTION

### 8.1 Component: WaterQualityPredictor

```python
class WaterQualityPredictor:
    """
    Predict water quality parameters from:
    ├─ Geology (TDS increases with minerals)
    ├─ Depth (Some parameters increase with depth)
    ├─ Regional anomalies (Fluoride, arsenic endemic areas)
    ├─ Land use (Nitrate from agriculture)
    └─ Redox conditions (Iron, manganese)
    """
    
    def predict_all_parameters(
        self,
        location: Tuple[float, float],
        depth_m: float,
        geology: Dict,
        land_use: str,
        climate: str
    ) -> Dict[str, Any]:
        """
        Returns: {
            'tds': {...},
            'fluoride': {...},
            'arsenic': {...},
            'nitrate': {...},
            'iron': {...},
            'overall_potability': 'POTABLE' | 'TREAT_REQUIRED' | 'NOT_POTABLE',
            'treatment_options': [...],
            'health_summary': str
        }
        """
    
    def predict_tds(self, geology: Dict, depth_m: float) -> Dict:
        """
        TDS (Total Dissolved Solids) prediction
        
        Model: Random Forest (geology + depth + regional means)
        R² = 0.72
        MAE = ±85 mg/L
        
        WHO guideline: 1000 mg/L (guideline value)
        Typical range: 100-1000 mg/L
        """
    
    def predict_fluoride(self, geology: Dict, location: Tuple[float, float]) -> Dict:
        """
        Fluoride prediction
        
        Scientific basis: Endemic to volcanic/aplite regions
        R² = 0.68, MAE = ±0.3 mg/L
        WHO guideline: 1.5 mg/L
        
        High fluoride zones in East Africa:
        ├─ Rift Valley (1.5-10 mg/L)
        ├─ Lake regions (0.5-3 mg/L)
        └─ Coastal aquifers (typically low)
        """
    
    def predict_arsenic(self, depth_m: float, redox_cond: str) -> Dict:
        """
        Arsenic prediction
        
        Mobilization: Under reducing (anaerobic) conditions:
        Fe³⁺-oxyhydroxides release As when Fe³⁺ → Fe²⁺
        
        R² = 0.65, MAE = ±0.002 mg/L
        WHO guideline: 0.01 mg/L (strict)
        """
    
    def predict_nitrate(self, land_use: str, depth_m: float) -> Dict:
        """
        Nitrate prediction (agricultural contamination)
        
        Sources:
        ├─ Synthetic fertilizers: 50-100 kg N/ha/yr
        ├─ Manure: 10-50 kg N/ha/yr
        └─ Sewage: 10-50 mg/L typical
        
        R² = 0.60, MAE = ±8 mg/L
        WHO guideline: 50 mg/L (NO₃⁻)
        """
```

---

## 9. REPORT GENERATION MODULE

### 9.1 Component: ProfessionalReportGenerator

```python
class ProfessionalReportGenerator:
    """
    Generate professional reports in multiple formats
    """
    
    def generate_pdf(
        self,
        analysis_result: Dict,
        template: str = 'standard'
    ) -> bytes:
        """
        Generate 30-50 page PDF report with:
        
        Sections:
        ├─ Executive Summary (1 pg)
        ├─ Site Characterization (2-3 pg)
        ├─ Hydrogeological Analysis (3-4 pg)
        ├─ Water Quality Assessment (2 pg)
        ├─ Contamination Risk (2 pg)
        ├─ Drilling Recommendations (2 pg)
        ├─ Cost Estimation (1 pg)
        ├─ Risk Assessment (2 pg)
        ├─ Monitoring Plan (1 pg)
        └─ Appendices (3-5 pg)
        
        Visualizations:
        ├─ Location map (satellite background)
        ├─ Geological cross-section
        ├─ Borehole log (lithology)
        ├─ Probability heatmap
        ├─ Risk matrix
        ├─ Water quality radar chart
        ├─ Cost breakdown (pie chart)
        └─ ROI timeline
        """
    
    def generate_docx(
        self,
        analysis_result: Dict,
        template: str = 'standard'
    ) -> bytes:
        """Generate editable DOCX report (same as PDF but editable)"""
    
    def export_csv(
        self,
        analysis_result: Dict
    ) -> bytes:
        """Export all numeric data as CSV for spreadsheet analysis"""
    
    def export_geojson(
        self,
        analysis_result: Dict,
        include_layers: List[str] = [
            'site_location',
            'risk_zones',
            'probability_heatmap',
            'contamination_sources'
        ]
    ) -> Dict[str, Any]:
        """Export as GeoJSON for GIS import"""
    
    def export_shapefile(
        self,
        analysis_result: Dict
    ) -> bytes:
        """Export as Shapefile zipped archive for ArcGIS/QGIS"""
```

---

## 10. API ENDPOINT SPECIFICATION

### 10.1 Satellite Data Endpoints

**POST `/api/v1/satellite/query`**
```json
Request: {
  "location": {"latitude": -1.286389, "longitude": 36.817223},
  "radius_km": 50,
  "start_date": "2023-01-01",
  "end_date": "2024-01-01",
  "sensors": ["sentinel1", "sentinel2", "landsat", "grace"]
}

Response: {
  "sentinel1": {...},
  "sentinel2": {...},
  "landsat": {...},
  "grace": {...},
  "status": "completed"
}
```

### 10.2 Analysis Endpoint

**POST `/api/v1/analysis/complete`**
```json
Request: {
  "location": {"latitude": -1.286389, "longitude": 36.817223},
  "image_file": <binary>,
  "include_modules": [
    "geology",
    "hydrology",
    "risk",
    "cost",
    "water_quality"
  ]
}

Response: {
  "site": {...},
  "probability": 0.78,
  "recommended_depth_m": 45,
  "estimated_yield_m3h": 12.5,
  "estimated_cost_usd": 8500,
  "water_quality": {...},
  "risk": {...},
  "report_url": "/reports/site_12345.pdf"
}
```

---

This specification provides the complete technical blueprint. Shall I proceed with **actual implementation** of the backend services?

