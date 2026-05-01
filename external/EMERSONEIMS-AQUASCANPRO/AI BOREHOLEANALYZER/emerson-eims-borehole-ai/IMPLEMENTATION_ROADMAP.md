# PRACTICAL IMPLEMENTATION ROADMAP

**Document Purpose:** Step-by-step instructions to build missing components

**Timeline:** 24 weeks total with 2-3 developer team

---

## QUICK START: WEEK 1 SETUP

### Step 1: Database Foundation (8 hours)

**File:** `backend/app/database/models.py`

```python
# Install required packages first:
# pip install sqlalchemy geoalchemy2 postgis psycopg2-binary

from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from geoalchemy2 import Geometry
from datetime import datetime

Base = declarative_base()

class BoreholeSite(Base):
    """Core borehole site record"""
    __tablename__ = "borehole_sites"
    
    id = Column(Integer, primary_key=True)
    site_name = Column(String(255))
    location = Column(Geometry('POINT', srid=4326))  # WGS84 lat/lon
    
    # Predictions
    probability = Column(Float)  # 0-1
    recommended_depth_m = Column(Float)
    estimated_yield_m3h = Column(Float)
    estimated_cost_usd = Column(Float)
    
    # Geology
    aquifer_type = Column(String(50))  # 'confined', 'unconfined', 'karst'
    lithology = Column(JSON)
    
    # Analysis results
    twi = Column(Float)
    lineament_density = Column(Float)
    distance_to_stream_m = Column(Float)
    
    # Time tracking
    created_at = Column(DateTime, default=datetime.utcnow)
    analysis_date = Column(DateTime)

class WaterQualityPrediction(Base):
    """Water quality parameters"""
    __tablename__ = "water_quality"
    
    borehole_id = Column(Integer, ForeignKey('borehole_sites.id'))
    
    tds_mg_l = Column(Float)
    fluoride_mg_l = Column(Float)
    arsenic_mg_l = Column(Float)
    nitrate_mg_l = Column(Float)
    iron_mg_l = Column(Float)
    ph = Column(Float)
    potability_status = Column(String(50))

class RiskAssessment(Base):
    """Risk analysis results"""
    __tablename__ = "risk_assessments"
    
    borehole_id = Column(Integer, ForeignKey('borehole_sites.id'))
    
    geological_risk = Column(Float)  # 0-1
    contamination_risk = Column(Float)
    financial_risk = Column(Float)
    technical_risk = Column(Float)
    overall_risk = Column(Float)
    
    top_risks = Column(JSON)  # List of risk factors
    mitigation_strategies = Column(JSON)

class HistoricalBorehole(Base):
    """10,000+ historical records for comparison"""
    __tablename__ = "historical_boreholes"
    
    id = Column(Integer, primary_key=True)
    location = Column(Geometry('POINT', srid=4326))
    depth_m = Column(Float)
    yield_m3h = Column(Float)
    success = Column(Boolean)
    lithology = Column(JSON)
    water_quality = Column(JSON)
    drilling_cost_usd = Column(Float)
    
    # Region/context
    country = Column(String(50))
    year = Column(Integer)
```

**PostgreSQL Setup:**
```bash
# Create database with PostGIS extension
createdb borehole_ai
psql -d borehole_ai -c "CREATE EXTENSION postgis;"

# Create tables
alembic upgrade head
```

---

### Step 2: Earth Engine Authentication (3 hours)

**File:** `backend/app/services/earth_engine_client.py`

```python
import ee
import json
from typing import Dict, Tuple

class EarthEngineClient:
    """Initialize Google Earth Engine access"""
    
    def __init__(self, service_account_path: str):
        """
        Setup:
        1. Go to https://console.cloud.google.com
        2. Create new project
        3. Enable Earth Engine API
        4. Create service account
        5. Download JSON key file
        6. Point to this file
        """
        credentials = ee.ServiceAccountCredentials.from_service_account_file(service_account_path)
        ee.Initialize(credentials)
    
    def query_sentinel2(
        self,
        bbox: Tuple[float, float, float, float],  # (minLon, minLat, maxLon, maxLat)
        start_date: str,  # "2024-01-01"
        end_date: str,
        cloud_cover: float = 20.0
    ) -> ee.Image:
        """Get Sentinel-2 least-cloudy composite"""
        
        # Define region
        region = ee.Geometry.Rectangle([bbox[0], bbox[1], bbox[2], bbox[3]])
        
        # Query Sentinel-2
        s2 = ee.ImageCollection("COPERNICUS/S2_SR")\
            .filterBounds(region)\
            .filterDate(start_date, end_date)\
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloud_cover))\
            .sort('CLOUDY_PIXEL_PERCENTAGE')\
            .first()
        
        return s2
    
    def query_sentinel1(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str
    ) -> ee.Image:
        """Get Sentinel-1 SAR backscatter"""
        
        region = ee.Geometry.Rectangle([bbox[0], bbox[1], bbox[2], bbox[3]])
        
        s1 = ee.ImageCollection("COPERNICUS/S1_GRD")\
            .filterBounds(region)\
            .filterDate(start_date, end_date)\
            .filter(ee.Filter.eq('instrumentMode', 'IW'))\
            .mean()
        
        return s1
    
    def query_landsat89(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str
    ) -> ee.Image:
        """Get Landsat 8/9 thermal + optical"""
        
        region = ee.Geometry.Rectangle([bbox[0], bbox[1], bbox[2], bbox[3]])
        
        l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")\
            .filterBounds(region)\
            .filterDate(start_date, end_date)\
            .median()
        
        l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")\
            .filterBounds(region)\
            .filterDate(start_date, end_date)\
            .median()
        
        return l8.blend(l9)
    
    def query_srtm_dem(
        self,
        bbox: Tuple[float, float, float, float]
    ) -> ee.Image:
        """Get SRTM 30m elevation"""
        
        region = ee.Geometry.Rectangle([bbox[0], bbox[1], bbox[2], bbox[3]])
        
        dem = ee.Image("USGS/SRTMGL1_003")\
            .clip(region)
        
        return dem
    
    def download_geotiff(
        self,
        image: ee.Image,
        region: ee.Geometry,
        filename: str,
        scale: int = 30
    ) -> str:
        """Download image as GeoTIFF"""
        
        url = image.getDownloadURL({
            'scale': scale,
            'crs': 'EPSG:4326',
            'region': region.getInfo(),
            'format': 'GEO_TIFF'
        })
        
        return url
```

**Configuration:** `backend/.env`
```
EARTH_ENGINE_SERVICE_ACCOUNT=/path/to/service-account-key.json
GEO_BBOX_PADDING_KM=50
SENTINEL2_CLOUD_THRESHOLD=20
```

---

### Step 3: DEM Processing Pipeline (5 hours)

**File:** `backend/app/services/dem_processor.py`

```python
import numpy as np
import xarray as xr
from scipy import signal
from skimage import morphology
import rasterio

class DEMProcessor:
    """Process digital elevation models"""
    
    def __init__(self, dem_file: str):
        """Load DEM from GeoTIFF"""
        with rasterio.open(dem_file) as src:
            self.dem = src.read(1)  # numpy array
            self.transform = src.transform
            self.crs = src.crs
        
        self.dem = self.dem.astype(float)
    
    def compute_slope(self) -> np.ndarray:
        """Compute slope in degrees"""
        # Sobel filters for gradient
        x, y = np.gradient(self.dem)
        
        # Slope in radians
        slope_rad = np.arctan(np.sqrt(x**2 + y**2) / 1.0)
        
        # Convert to degrees
        slope_deg = np.degrees(slope_rad)
        
        return slope_deg
    
    def compute_aspect(self) -> np.ndarray:
        """Compute aspect (direction of steepest descent)"""
        x, y = np.gradient(self.dem)
        aspect = np.arctan2(-x, y)
        aspect_deg = np.degrees(aspect)
        
        # Adjust to 0-360 range
        aspect_deg[aspect_deg < 0] += 360
        
        return aspect_deg
    
    def compute_d8_flow_direction(self) -> np.ndarray:
        """D8 flow direction routing"""
        # Direction codes: 1-8, where 1=E, 2=SE, etc.
        
        # Pad DEM to avoid boundary issues
        dem_pad = np.pad(self.dem, 1, mode='edge')
        
        slope_map = np.ones_like(self.dem) * np.inf
        flow_dir = np.zeros_like(self.dem, dtype=int)
        
        for i in range(1, dem_pad.shape[0]-1):
            for j in range(1, dem_pad.shape[1]-1):
                center = dem_pad[i, j]
                
                # 8 neighbors with their slopes
                slopes = [
                    (dem_pad[i, j+1] - center) / 1.0,      # E
                    (dem_pad[i+1, j+1] - center) / 1.414,  # SE
                    (dem_pad[i+1, j] - center) / 1.0,      # S
                    (dem_pad[i+1, j-1] - center) / 1.414,  # SW
                    (dem_pad[i, j-1] - center) / 1.0,      # W
                    (dem_pad[i-1, j-1] - center) / 1.414,  # NW
                    (dem_pad[i-1, j] - center) / 1.0,      # N
                    (dem_pad[i-1, j+1] - center) / 1.414,  # NE
                ]
                
                # Steepest descent
                steepest_idx = np.argmax([s for s in slopes])
                flow_dir[i-1, j-1] = steepest_idx + 1
                slope_map[i-1, j-1] = slopes[steepest_idx]
        
        return flow_dir
    
    def compute_flow_accumulation(self) -> np.ndarray:
        """Calculate flow accumulation from D8 flow direction"""
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
        flow_accum = np.ones_like(self.dem)
        
        # Process from high to low elevation
        sorted_indices = np.argsort(self.dem.flat)[::-1]
        
        for idx in sorted_indices:
            i, j = np.unravel_index(idx, self.dem.shape)
            
            # Accumulate to downslope neighbor
            direction = flow_dir[i, j]
            if direction > 0:
                di, dj = offsets[direction]
                ni, nj = i + di, j + dj
                
                if 0 <= ni < self.dem.shape[0] and 0 <= nj < self.dem.shape[1]:
                    flow_accum[ni, nj] += flow_accum[i, j]
        
        return flow_accum
    
    def compute_topographic_wetness_index(self) -> np.ndarray:
        """
        TWI = ln(α / tan β)
        α = contributing area
        β = slope
        """
        slope = self.compute_slope()
        flow_accum = self.compute_flow_accumulation()
        
        # Cell size in meters (assuming 30m SRTM)
        cell_size = 30.0
        
        # Avoid division by zero
        slope_rad = np.radians(slope)
        slope_rad[slope_rad < 0.001] = 0.001
        
        # TWI calculation
        twi = np.log(flow_accum * cell_size / np.tan(slope_rad))
        
        # Clip to reasonable range
        twi[twi < 0] = 0
        twi[twi > 30] = 30
        
        return twi
    
    def detect_sinkhole_depressions(self, min_depth: float = 10.0):
        """Find closed topographic depressions (sinkholes)"""
        # Find local minima using morphological operations
        local_min = self.dem == morphology.grey_erosion(self.dem, size=5)
        
        # Filter by size and depth
        labeled, num_features = morphology.label(local_min)
        
        sinkholes = []
        for i in range(1, num_features + 1):
            mask = labeled == i
            sinkhole_dem = self.dem[mask]
            
            depth = sinkhole_dem.max() - sinkhole_dem.min()
            if depth > min_depth:
                sinkholes.append({
                    'center': np.where(mask),
                    'depth_m': float(depth),
                    'area_pixels': np.sum(mask)
                })
        
        return sinkholes
```

---

## Phase 1 SUMMARY: Database + API Foundation

**Deliverables (Week 1):**
- ✅ PostgreSQL + PostGIS setup with schema
- ✅ Earth Engine client with 5 query methods
- ✅ DEM processor with 6 analysis functions
- ✅ File upload endpoint working

**Files Created:**
- `backend/app/database/models.py`
- `backend/app/services/earth_engine_client.py`
- `backend/app/services/dem_processor.py`
- `backend/app/api/satellite_routes.py`
- `backend/app/config.py` (with DB credentials)

**Next: Week 2-3**
- Spectral index calculation module
- Geological classification service
- Satellite data caching strategy

---

## SPECTRAL INDEX CALCULATION (Week 2-3)

**File:** `backend/app/services/spectral_indices.py`

```python
import numpy as np
import xarray as xr

class SpectralIndiceCalculator:
    """Compute 28 spectral indices from satellite bands"""
    
    def __init__(self, sentinel2_image: dict):
        """
        Input: Dictionary with bands
        {
            'B2': numpy array (blue 490nm),
            'B3': numpy array (green 560nm),
            'B4': numpy array (red 665nm),
            'B5': numpy array (red-edge 705nm),
            'B8': numpy array (NIR 842nm),
            'B11': numpy array (SWIR-1 1610nm),
            'B12': numpy array (SWIR-2 2190nm),
        }
        """
        self.bands = sentinel2_image
    
    def ndvi(self) -> np.ndarray:
        """Normalized Difference Vegetation Index"""
        nir = self.bands['B8'].astype(float)
        red = self.bands['B4'].astype(float)
        ndvi = (nir - red) / (nir + red + 1e-6)
        return ndvi
    
    def ndwi(self) -> np.ndarray:
        """Normalized Difference Water Index"""
        green = self.bands['B3'].astype(float)
        swir = self.bands['B11'].astype(float)
        ndwi = (green - swir) / (green + swir + 1e-6)
        return ndwi
    
    def mndwi(self) -> np.ndarray:
        """Modified Normalized Difference Water Index"""
        green = self.bands['B3'].astype(float)
        swir2 = self.bands['B12'].astype(float)
        mndwi = (green - swir2) / (green + swir2 + 1e-6)
        return mndwi
    
    def evi(self) -> np.ndarray:
        """Enhanced Vegetation Index"""
        nir = self.bands['B8'].astype(float)
        red = self.bands['B4'].astype(float)
        blue = self.bands['B2'].astype(float)
        
        evi = 2.5 * (nir - red) / (nir + 6*red - 7.5*blue + 1)
        return evi
    
    def savi(self) -> np.ndarray:
        """Soil-Adjusted Vegetation Index"""
        nir = self.bands['B8'].astype(float)
        red = self.bands['B4'].astype(float)
        
        savi = (1.5) * (nir - red) / (nir + red + 0.5)
        return savi
    
    def ndii(self) -> np.ndarray:
        """Normalized Difference Infrared Index (Drought)"""
        nir = self.bands['B8'].astype(float)
        swir1 = self.bands['B11'].astype(float)
        
        ndii = (nir - swir1) / (nir + swir1 + 1e-6)
        return ndii
    
    def compute_all_indices(self) -> dict:
        """Compute all 28 indices"""
        return {
            'ndvi': self.ndvi(),
            'evi': self.evi(),
            'ndwi': self.ndwi(),
            'mndwi': self.mndwi(),
            'savi': self.savi(),
            'ndii': self.ndii(),
            # ... + 22 more indices
        }
```

---

## ML MODEL PREPARATION (Week 4-12)

**Critical: Training Data Collection**

Before building ML models, gather:
1. **10,000+ historical boreholes** (CSV with depth, yield, success, coordinates, geology)
2. **Water quality samples** (50,000+ lab analyses)
3. **Satellite imagery labeled** (Sentinel-2 patches with geologic formation labels)
4. **DEM lineaments** (Manually traced faults for U-Net training)

**File:** `backend/scripts/prepare_training_data.py`

```python
import pandas as pd
from sklearn.preprocessing import StandardScaler

def prepare_ensemble_training_data():
    """Prepare data for 5 ML models"""
    
    # Load historical boreholes
    boreholes = pd.read_csv('data/boreholes_10k.csv')
    
    # Features: 50+ variables
    features = [
        'lithology_code',
        'aquifer_type_code',
        'twi',
        'slope_degrees',
        'distance_to_stream_m',
        'lineament_density',
        'ndvi_mean',
        'ndwi_mean',
        'elevation_m',
        'rainfall_mm_year',
        'bedrock_depth_m',
        'porosity_fraction',
        'conductivity_m_day',
        # ... 37 more features
    ]
    
    X = boreholes[features]
    y = boreholes['success']  # Binary: 1 = found water, 0 = failed
    
    # Split: 70% train, 15% validation, 15% test
    X_train, X_val, X_test = ...
    y_train, y_val, y_test = ...
    
    # Normalize
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_val = scaler.transform(X_val)
    X_test = scaler.transform(X_test)
    
    return X_train, X_val, X_test, y_train, y_val, y_test, scaler
```

---

## IMPLEMENTATION CHECKLIST

### Week 1: Foundation
- [ ] PostgreSQL + PostGIS installed & configured
- [ ] Earth Engine API authentication working
- [ ] DEM processor downloading SRTM successfully
- [ ] Database tables created & tested
- [ ] Satellite query endpoint returns valid data

### Week 2-3: Data Processing
- [ ] Spectral indices calculating correctly (validate against literature)
- [ ] Flow accumulation algorithm implemented
- [ ] Topographic Wetness Index working
- [ ] Historical borehole data imported (10,000+ records)

### Week 4-8: ML Pipeline
- [ ] Training data prepared and normalized
- [ ] Random Forest model trained (baseline)
- [ ] XGBoost model tuned
- [ ] CNN model trained on satellite imagery
- [ ] LSTM on time series data
- [ ] Meta-learner stacking working

### Week 9-12: Predictions
- [ ] Success probability predictions validated
- [ ] Depth prediction model with confidence intervals
- [ ] Yield estimation
- [ ] Water quality predictions for 5 parameters

### Week 13-16: Risk & Cost
- [ ] Contamination risk detector functional
- [ ] Geological risk assessment
- [ ] Financial risk Monte Carlo working
- [ ] Cost estimation calculator operational

### Week 17-20: Reports
- [ ] PDF report generation working
- [ ] DOCX template generation
- [ ] GeoJSON export functional
- [ ] Shapefile export implemented

### Week 21-24: Polish
- [ ] API performance optimized
- [ ] Frontend UI updated with all components
- [ ] Documentation complete
- [ ] System tested end-to-end

---

## ESTIMATED BUDGET (if outsourcing components)

| Component | Hours | Cost (@ $100/hr USD) |
|-----------|-------|-----|
| Satellite integration | 120 | $12,000 |
| ML model development | 750 | $75,000 |
| Backend API | 200 | $20,000 |
| Frontend development | 180 | $18,000 |
| Database/GIS | 100 | $10,000 |
| Report generation | 200 | $20,000 |
| Testing & QA | 120 | $12,000 |
| Documentation | 100 | $10,000 |
| **TOTAL** | **1,770** | **$177,000** |

**If developing in-house: 15-20 person-weeks**

---

## SUCCESS METRICS

### By End of Phase 1 (Week 4):
- ✅ Satellite data downloading and processing correctly
- ✅ DEM analysis producing valid topographic indices
- ✅ Database storing 10,000+ historical records
- ✅ Basic API endpoints functional

### By End of Phase 2 (Week 12):
- ✅ All 28 spectral indices calculating
- ✅ 5 ML models trained and validated
- ✅ Ensemble predictions working
- ✅ Uncertainty quantification (confidence intervals)

### By End of Phase 3 (Week 18):
- ✅ Depth predictions within ±25m (50% confidence)
- ✅ Yield estimates with reasonable R² 
- ✅ Water quality parameters predicted
- ✅ Financial models (ROI/NPV) calculated

### By End of Phase 4 (Week 24):
- ✅ Professional 30-50 page reports generated
- ✅ System tested on 100+ new sites
- ✅ User-facing UI complete
- ✅ Market-ready product

---

**Ready to proceed? Start with Step 1: Database setup.**

Next files to create:
1. `backend/app/database/migrations/` - Alembic migration history
2. `backend/app/services/` - All service modules
3. `backend/app/api/` - Route handlers
4. `backend/tests/` - Unit tests for each component

Would you like me to generate the complete code for any specific component?

