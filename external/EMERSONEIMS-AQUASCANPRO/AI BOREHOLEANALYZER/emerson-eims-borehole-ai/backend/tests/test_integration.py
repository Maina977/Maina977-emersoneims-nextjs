"""
Integration & End-to-End Tests
Tests the complete pipeline from data acquisition through analysis and reporting
"""

import pytest
import numpy as np
import json
from datetime import datetime
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient

# Import components to test
from app.main import app
from app.database.models import BoreholeSite, AnalysisJob
from app.services.earth_engine_client import EarthEngineClient
from app.services.dem_processor import DEMProcessor
from app.services.spectral_indices import SpectralIndicesCalculator
from app.services.geology import GeologicalClassifier
from app.database.config import DatabaseSession

# ============ FIXTURES ============

@pytest.fixture
def client():
    """FastAPI test client"""
    return TestClient(app)


@pytest.fixture
def sample_dem():
    """Create sample DEM array for testing"""
    # 100x100 hillslope DEM
    dem = np.zeros((100, 100), dtype=float)
    x, y = np.meshgrid(np.arange(100), np.arange(100))

    # Create a sloping surface with basin
    dem = 100 - 0.3 * x - 0.2 * y + 0.001 * ((x - 50)**2 + (y - 50)**2)
    dem[dem < 80] = 80  # Basin floor
    dem[dem > 100] = 100  # Summit capping

    return dem


@pytest.fixture
def sample_satellite_bands():
    """Create sample satellite band data"""
    size = (100, 100)
    return {
        'B2_BLUE': np.random.normal(0.1, 0.02, size),      # Blue
        'B3_GREEN': np.random.normal(0.15, 0.03, size),    # Green
        'B4_RED': np.random.normal(0.08, 0.02, size),      # Red
        'B5_RED_EDGE': np.random.normal(0.12, 0.03, size), # Red edge
        'B8_NIR': np.random.normal(0.4, 0.1, size),        # NIR (high veg)
        'B11_SWIR1': np.random.normal(0.2, 0.05, size),    # SWIR-1
        'B12_SWIR2': np.random.normal(0.15, 0.04, size),   # SWIR-2
    }


# ============ API ENDPOINT TESTS ============

class TestHealthEndpoints:
    """Test health and status endpoints"""

    def test_health_check(self, client):
        """Test /health endpoint"""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_system_status(self, client):
        """Test /status endpoint"""
        response = client.get("/api/v1/status")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ["operational", "degraded", "unhealthy"]

    def test_version_endpoint(self, client):
        """Test /version endpoint"""
        response = client.get("/api/v1/version")
        assert response.status_code == 200
        assert response.json()["version"] == "1.0.0"


class TestSatelliteAPI:
    """Test satellite data query endpoints"""

    @patch('app.api.routes.satellite.EarthEngineClient')
    def test_satellite_query(self, mock_ee, client):
        """Test POST /satellite/query"""
        # Mock Earth Engine response
        mock_client = Mock()
        mock_client.query_sentinel2.return_value = {
            'B2': np.random.rand(10, 10),
            'B3': np.random.rand(10, 10),
            'B4': np.random.rand(10, 10),
        }
        mock_ee.return_value = mock_client

        response = client.post(
            "/api/v1/satellite/query",
            json={
                "location": {"lat": -1.286389, "lon": 36.817223},
                "start_date": "2023-01-01",
                "end_date": "2024-01-01",
                "sensors": "sentinel2",
                "cloud_cover": 20
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["location"]["lat"] == -1.286389

    def test_satellite_invalid_location(self, client):
        """Test satellite query with invalid coordinates"""
        response = client.post(
            "/api/v1/satellite/query",
            json={
                "location": {"lat": 91, "lon": 200},  # Invalid
                "start_date": "2023-01-01",
                "end_date": "2024-01-01",
            }
        )
        assert response.status_code == 422  # Validation error


class TestAnalysisAPI:
    """Test analysis endpoints"""

    def test_analyze_site(self, client):
        """Test POST /analysis/site"""
        response = client.post(
            "/api/v1/analysis/site",
            json={
                "site_name": "Test Site 1",
                "latitude": -1.286389,
                "longitude": 36.817223,
                "country": "Kenya",
                "region": "Nairobi"
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ["PROCESSING", "QUEUED"]
        assert "job_id" in data

    def test_get_analysis_status(self, client):
        """Test GET /analysis/status/{job_id}"""
        response = client.get("/api/v1/analysis/status/1")

        # Should return 404 or status info
        assert response.status_code in [200, 404]


# ============ SERVICE LAYER TESTS ============

class TestDEMProcessor:
    """Test DEM processing functions"""

    def test_slope_computation(self, sample_dem):
        """Test slope calculation"""
        processor = DEMProcessor(dem_array=sample_dem)
        slope = processor.compute_slope(units='degrees')

        assert slope.shape == sample_dem.shape
        assert np.all(slope >= 0)
        assert np.all(slope <= 90)

    def test_aspect_computation(self, sample_dem):
        """Test aspect calculation"""
        processor = DEMProcessor(dem_array=sample_dem)
        aspect = processor.compute_aspect(units='degrees')

        assert aspect.shape == sample_dem.shape
        assert np.all(aspect >= 0)
        assert np.all(aspect <= 360)

    def test_d8_flow_direction(self, sample_dem):
        """Test D8 flow direction"""
        processor = DEMProcessor(dem_array=sample_dem)
        flow_dir = processor.compute_d8_flow_direction()

        assert flow_dir.shape == sample_dem.shape
        assert np.all(flow_dir >= 0)
        assert np.all(flow_dir <= 8)

    def test_twi_computation(self, sample_dem):
        """Test Topographic Wetness Index"""
        processor = DEMProcessor(dem_array=sample_dem)
        twi = processor.compute_topographic_wetness_index()

        assert twi.shape == sample_dem.shape
        assert np.all(twi >= 0)
        assert np.all(twi <= 30)

    def test_valley_detection(self, sample_dem):
        """Test valley floor detection"""
        processor = DEMProcessor(dem_array=sample_dem)
        result = processor.detect_valley_bottoms(twi_threshold=8.0)

        assert 'valley_mask' in result
        assert 'valley_area_pct' in result
        assert result['valley_area_pct'] >= 0


class TestSpectralIndices:
    """Test spectral index calculations"""

    def test_ndvi_computation(self, sample_satellite_bands):
        """Test NDVI calculation"""
        calc = SpectralIndicesCalculator(bands=sample_satellite_bands)
        ndvi = calc.ndvi()

        assert ndvi.shape == (100, 100)
        assert np.all(ndvi >= -1)
        assert np.all(ndvi <= 1)

    def test_evi_computation(self, sample_satellite_bands):
        """Test EVI calculation"""
        calc = SpectralIndicesCalculator(bands=sample_satellite_bands)
        evi = calc.evi()

        assert evi.shape == (100, 100)
        assert np.nanmean(evi) > -1  # Some valid values

    def test_ndwi_computation(self, sample_satellite_bands):
        """Test NDWI (water index) calculation"""
        calc = SpectralIndicesCalculator(bands=sample_satellite_bands)
        ndwi = calc.ndwi()

        assert ndwi.shape == (100, 100)
        assert np.all(ndwi >= -1)
        assert np.all(ndwi <= 1)

    def test_all_indices_computation(self, sample_satellite_bands):
        """Test bulk computation of all 28 indices"""
        calc = SpectralIndicesCalculator(bands=sample_satellite_bands)
        all_indices = calc.compute_all_indices()

        # Should compute at least 20+ indices
        assert len(all_indices) >= 20

        # Check specific indices exist
        assert 'NDVI' in all_indices
        assert 'NDWI' in all_indices
        assert 'BSI' in all_indices


class TestGeologicalClassifier:
    """Test geological analysis"""

    def test_aquifer_classification(self, sample_dem, sample_satellite_bands):
        """Test aquifer type classification"""
        slope = np.gradient(sample_dem)[0]
        twi = np.random.normal(7, 2, sample_dem.shape)  # Mid-range TWI
        indices = {'NDVI': 0.6, 'NDWI': 0.2}

        classifier = GeologicalClassifier(
            dem=sample_dem,
            slope=slope,
            twi=twi,
            spectral_indices=indices
        )

        productivity = np.random.normal(5, 1, sample_dem.shape)
        result = classifier.classify_aquifer_type(productivity)

        assert 'aquifer_class' in result
        assert 'productivity_priority' in result

    def test_lineament_detection(self, sample_dem, sample_satellite_bands):
        """Test lineament detection"""
        slope = np.gradient(sample_dem)[0]
        twi = np.random.normal(7, 2, sample_dem.shape)
        indices = {'NDVI': 0.6, 'NDWI': 0.2}

        classifier = GeologicalClassifier(
            dem=sample_dem,
            slope=slope,
            twi=twi,
            spectral_indices=indices
        )

        lineaments = classifier.detect_lineaments()

        assert isinstance(lineaments, list)
        assert len(lineaments) >= 0  # May be 0 if no lineaments detected

    def test_favorability_mapping(self, sample_dem, sample_satellite_bands):
        """Test aquifer favorability scoring"""
        slope = np.gradient(sample_dem)[0]
        twi = np.random.normal(7, 2, sample_dem.shape)
        indices = {'NDVI': np.random.rand(100, 100), 'NDWI': np.random.rand(100, 100)}

        classifier = GeologicalClassifier(
            dem=sample_dem,
            slope=slope,
            twi=twi,
            spectral_indices=indices
        )

        favorability = classifier.compute_aquifer_favorability_map()

        assert favorability.shape == sample_dem.shape
        assert np.all(favorability >= 0)
        assert np.all(favorability <= 100)


# ============ END-TO-END TESTS ============

class TestEndToEndPipeline:
    """Test complete analysis pipeline"""

    def test_full_topographic_analysis(self, sample_dem):
        """Test complete DEM analysis pipeline"""
        processor = DEMProcessor(dem_array=sample_dem)

        # Compute all indices
        indices = processor.compute_all_indices()

        # Verify outputs
        assert 'slope' in indices
        assert 'aspect' in indices
        assert 'twi' in indices
        assert 'flow_accumulation' in indices
        assert 'hillshade' in indices

        # Verify data quality
        assert not np.all(np.isnan(indices['slope']))
        assert indices['twi'].max() <= 30

    def test_full_spectral_analysis(self, sample_satellite_bands):
        """Test complete spectral analysis pipeline"""
        calc = SpectralIndicesCalculator(bands=sample_satellite_bands)

        all_indices = calc.compute_all_indices()

        # Verify computed indices
        assert len(all_indices) >= 20

        # Check no NaN explosion
        for name, arr in all_indices.items():
            valid_pixels = np.sum(~np.isnan(arr))
            assert valid_pixels > 0, f"{name} has all NaN values"

    def test_geological_analysis_pipeline(self, sample_dem):
        """Test geological analysis from DEM and spectral data"""
        # Generate DEM analysis
        dem_proc = DEMProcessor(dem_array=sample_dem)
        slope = dem_proc.compute_slope()
        twi = dem_proc.compute_topographic_wetness_index()

        # Generate spectral indices
        bands = {
            'B8_NIR': np.random.rand(100, 100) * 0.5,
            'B4_RED': np.random.rand(100, 100) * 0.1,
            'B3_GREEN': np.random.rand(100, 100) * 0.15,
            'B11_SWIR1': np.random.rand(100, 100) * 0.2,
            'B12_SWIR2': np.random.rand(100, 100) * 0.15,
            'B2_BLUE': np.random.rand(100, 100) * 0.1,
        }
        calc = SpectralIndicesCalculator(bands=bands)
        indices = calc.compute_all_indices()

        # Geological classification
        classifier = GeologicalClassifier(
            dem=sample_dem,
            slope=slope,
            twi=twi,
            spectral_indices=indices
        )

        favorability = classifier.compute_aquifer_favorability_map()

        # Verify results
        assert favorability.shape == sample_dem.shape
        assert np.all(favorability >= 0)
        assert np.all(favorability <= 100)


# ============ PYTEST CONFIGURATION ============

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
