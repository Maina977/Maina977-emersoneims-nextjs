"""
Comprehensive Integration Tests
Tests all newly implemented modules and improvements
"""

import pytest
from datetime import datetime, timedelta
import sys
import os

# Add paths for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.modules.satellite.smap.processor import SMAPProcessor
from app.modules.ml.models.resnet50_geological import ResNet50GeologicalClassifier
from app.modules.ml.models.unet_lineament import UNetLineamentDetector
from app.modules.satellite.sebal.processor import SEBALProcessor
from app.modules.satellite.gpm.processor import GPMIMERGProcessor
from app.modules.satellite.sentinel1.processor import Sentinel1InSARProcessor
from app.modules.ml.water_quality_specific import ContaminantSpecificModels
from app.modules.export.formatter import ExportFormatter


class TestPhase1CriticalGaps:
    """PHASE 1: Test critical blocking issues"""
    
    def test_smap_soil_moisture_module(self):
        """Test SMAP soil moisture data retrieval"""
        processor = SMAPProcessor()
        assert processor.initialized
        
        result = processor.get_soil_moisture_profile(
            latitude=-1.3,
            longitude=36.7,  # Kenya
            start_date=datetime.now() - timedelta(days=365),
            end_date=datetime.now()
        )
        
        assert 'surface_moisture_0_5cm' in result
        assert 'rootzone_moisture_0_100cm' in result
        assert result['surface_moisture_0_5cm']['uncertainty'] == 0.04
        assert 0 < result['surface_moisture_0_5cm']['value'] < 0.5
        print(f"✓ SMAP: Surface moisture = {result['surface_moisture_0_5cm']['value']:.2f} m³/m³")
    
    def test_smap_stress_index(self):
        """Test soil water stress calculation"""
        processor = SMAPProcessor()
        
        stress = processor.calculate_stress_index(
            surface_vwc=0.20,
            rootzone_vwc=0.25,
            wilting_point=0.10,
            field_capacity=0.35
        )
        
        assert 0 <= stress <= 1
        print(f"✓ SMAP: Water stress index = {stress:.2f}")
    
    def test_smap_multi_year_trend(self):
        """Test multi-year soil moisture trend analysis"""
        processor = SMAPProcessor()
        
        trend = processor.get_multi_year_trend(
            latitude=-1.3,
            longitude=36.7,
            years=5
        )
        
        assert 'statistics' in trend
        assert 'interpretation' in trend
        assert 'mean' in trend['statistics']
        print(f"✓ SMAP: Mean moisture = {trend['statistics']['mean']:.2f} m³/m³")
    
    def test_resnet50_geological_classifier(self):
        """Test ResNet-50 geological formation classification"""
        classifier = ResNet50GeologicalClassifier()
        assert classifier.initialized
        
        # Simulate satellite image
        import numpy as np
        fake_image = np.random.randint(0, 256, (224, 224, 3), dtype=np.uint8)
        
        result = classifier.classify_satellite_image(fake_image)
        
        assert 'primary_formation' in result
        assert 'confidence' in result
        assert result['accuracy'] == 0.87
        print(f"✓ ResNet-50: {result['primary_formation']} (confidence: {result['confidence']:.1%})")
    
    def test_unet_lineament_detection(self):
        """Test U-Net lineament detection"""
        detector = UNetLineamentDetector()
        assert detector.initialized
        
        # Simulate DEM
        import numpy as np
        dem = np.random.randn(512, 512)
        
        result = detector.detect_lineaments_from_dem(dem)
        
        assert result['detected'] == True or result['detected'] == False
        assert 'lineament_density' in result
        print(f"✓ U-Net: Lineament density = {result.get('lineament_density', 0):.2f} per 100km²")
    
    def test_depth_confidence_intervals(self):
        """Test depth prediction with confidence intervals"""
        from siteLocator import SiteLocator
        
        locator = SiteLocator()
        
        result = locator.estimateDepthWithConfidence(
            probability=0.75,
            siteType='valley'
        )
        
        assert 'estimate' in result
        assert 'confidence_50_percent' in result
        assert 'confidence_80_percent' in result
        assert 'confidence_95_percent' in result
        assert result['confidence_50_percent']['lower'] < result['estimate']
        assert result['estimate'] < result['confidence_95_percent']['upper']
        print(f"✓ Depth: {result['estimate']}m [±{result['confidence_95_percent'][1] - result['estimate']}m @ 95%]")
    
    def test_weighted_success_probability(self):
        """Test weighted probability formula with 6 factors"""
        from siteLocator import SiteLocator
        
        locator = SiteLocator()
        
        result = locator.calculateWeightedSuccessProbability({
            'geology_probability': 0.85,
            'structure_probability': 0.80,
            'topography_probability': 0.75,
            'vegetation_probability': 0.70,
            'remote_sensing_probability': 0.80,
            'historical_boreholes_probability': 0.75
        })
        
        assert 'success_probability' in result
        assert 'factor_contributions' in result
        assert 'confidence_level' in result
        assert 0 < result['success_probability'] < 1
        print(f"✓ Probability: {result['success_probability']:.1%} ({result['confidence_level']})")
    
    def test_export_formats_csv(self):
        """Test CSV export"""
        formatter = ExportFormatter()
        
        sample_result = {
            'site': {'latitude': -1.3, 'longitude': 36.7, 'siteType': 'valley', 'confidence': 0.85},
            'soil': {'type': 'loamy', 'porosity': 0.25},
            'waterQuality': {'isPotable': True, 'tds': 350},
            'risk': {'overallRisk': 0.35},
            'probability': 0.78,
            'recommendedDepth': 42,
            'estimatedYield': 8.5
        }
        
        csv_output = formatter.export_csv(sample_result)
        
        assert 'latitude' in csv_output
        assert '-1.3' in csv_output
        print(f"✓ CSV export: {len(csv_output)} bytes")
    
    def test_export_formats_geojson(self):
        """Test GeoJSON export"""
        formatter = ExportFormatter()
        
        sample_result = {
            'site': {'latitude': -1.3, 'longitude': 36.7, 'siteType': 'valley', 'confidence': 0.85},
            'risk': {'overallRisk': 0.35},
            'probability': 0.78
        }
        
        geojson_output = formatter.export_geojson(sample_result)
        
        assert 'FeatureCollection' in geojson_output
        assert '"type"' in geojson_output
        print(f"✓ GeoJSON export: {len(geojson_output)} bytes")
    
    def test_export_formats_kml(self):
        """Test KML export"""
        formatter = ExportFormatter()
        
        sample_result = {
            'site': {'latitude': -1.3, 'longitude': 36.7},
            'risk': {'overallRisk': 0.35},
            'probability': 0.78,
            'recommendedDepth': 42,
            'estimatedYield': 8.5
        }
        
        kml_output = formatter.export_kml(sample_result)
        
        assert '<?xml' in kml_output
        assert 'Placemark' in kml_output
        print(f"✓ KML export: {len(kml_output)} bytes")
    
    def test_export_formats_json(self):
        """Test JSON export"""
        formatter = ExportFormatter()
        
        sample_result = {
            'site': {'latitude': -1.3, 'longitude': 36.7},
            'probability': 0.78
        }
        
        json_output = formatter.export_json(sample_result)
        
        assert '"latitude"' in json_output or "'latitude'" in json_output
        print(f"✓ JSON export: {len(json_output)} bytes")


class TestPhase2RemoteSensing:
    """PHASE 2: Test remote sensing integration"""
    
    def test_sebal_evapotranspiration_calculation(self):
        """Test SEBAL ET calculation"""
        processor = SEBALProcessor()
        
        result = processor.calculate_evapotranspiration(
            latitude=-1.3,
            longitude=36.7,
            ndvi=0.6,
            lst=25,
            albedo=0.22,
            dem_elevation=1200,
            date=datetime.now()
        )
        
        assert 'et_actual' in result
        assert result['et_actual']['uncertainty'] == 0.5
        assert 0 < result['et_actual']['value'] < 10
        print(f"✓ SEBAL: ET = {result['et_actual']['value']:.2f} mm/day")
    
    def test_sebal_monthly_total(self):
        """Test SEBAL monthly ET total"""
        processor = SEBALProcessor()
        
        monthly = processor.calculate_monthly_et_total(
            latitude=-1.3,
            longitude=36.7,
            daily_et_mm=3.5,
            days_in_month=30
        )
        
        assert 'monthly_et_mm' in monthly
        assert monthly['daily_et_mm'] == 3.5
        print(f"✓ SEBAL: Monthly ET = {monthly['monthly_et_mm']:.1f} mm")
    
    def test_gpm_imerg_precipitation(self):
        """Test GPM IMERG precipitation retrieval"""
        processor = GPMIMERGProcessor()
        
        result = processor.get_precipitation_timeseries(
            latitude=-1.3,
            longitude=36.7,
            start_date=datetime.now() - timedelta(days=365),
            end_date=datetime.now(),
            aggregation='daily'
        )
        
        assert 'precipitation_timeseries' in result
        assert 'statistics' in result
        assert result['statistics']['mean_mm'] > 0
        print(f"✓ GPM IMERG: Mean daily = {result['statistics']['mean_mm']:.1f} mm")
    
    def test_gpm_annual_climatology(self):
        """Test GPM annual precipitation climatology"""
        processor = GPMIMERGProcessor()
        
        result = processor.get_annual_precipitation_climatology(
            latitude=-1.3,
            longitude=36.7,
            years=30
        )
        
        assert 'mean_annual_precipitation_mm' in result
        assert result['period_years'] == 30
        print(f"✓ GPM: 30-year mean = {result['mean_annual_precipitation_mm']:.0f} mm/year")
    
    def test_sentinel1_insar_deformation(self):
        """Test Sentinel-1 InSAR deformation detection"""
        processor = Sentinel1InSARProcessor()
        
        result = processor.detect_ground_deformation(
            latitude=-1.3,
            longitude=36.7,
            start_date=datetime.now() - timedelta(days=365),
            end_date=datetime.now(),
            dem_elevation=1200
        )
        
        assert 'deformation' in result
        assert 'risk_assessment' in result
        print(f"✓ Sentinel-1: Deformation = {result['deformation']['velocity_mm_year']:.1f} mm/year")
    
    def test_sentinel1_landslide_risk(self):
        """Test landslide risk from InSAR"""
        processor = Sentinel1InSARProcessor()
        
        risk = processor.detect_landslide_risk_from_insar(
            latitude=-1.3,
            longitude=36.7,
            terrain_slope_degrees=25,
            recent_deformation=15
        )
        
        assert 'landslide_risk_score' in risk
        assert 0 <= risk['landslide_risk_score'] <= 1
        print(f"✓ Sentinel-1 Landslide: Risk = {risk['risk_level']}")


class TestPhase3MLEnhancements:
    """PHASE 3: Test ML model enhancements"""
    
    def test_contaminant_specific_tds(self):
        """Test TDS-specific prediction"""
        models = ContaminantSpecificModels()
        
        features = {'depth_m': 50, 'geology': 'LIMESTONE', 'aquifer_type': 'unconfined', 'land_use': 'natural'}
        result = models.models['tds'].predict(features)
        
        assert 'predicted_mg_l' in result
        assert result['r_squared'] == 0.78
        print(f"✓ TDS: {result['predicted_mg_l']:.0f} mg/L (R²={result['r_squared']})")
    
    def test_contaminant_specific_fluoride(self):
        """Test Fluoride-specific prediction"""
        models = ContaminantSpecificModels()
        
        features = {'depth_m': 50, 'geology': 'GRANITE', 'latitude': 0}
        result = models.models['fluoride'].predict(features)
        
        assert 'predicted_mg_l' in result
        assert 'excess_risk' in result
        print(f"✓ Fluoride: {result['predicted_mg_l']:.2f} mg/L")
    
    def test_contaminant_specific_arsenic(self):
        """Test Arsenic-specific prediction"""
        models = ContaminantSpecificModels()
        
        features = {'depth_m': 50, 'geology': 'ALLUVIUM', 'aquifer_type': 'confined'}
        result = models.models['arsenic'].predict(features)
        
        assert 'predicted_ug_l' in result
        assert 'health_risk' in result
        print(f"✓ Arsenic: {result['predicted_ug_l']:.1f} µg/L (Health risk: {result['health_risk']})")
    
    def test_all_water_quality_parameters(self):
        """Test all water quality parameters together"""
        models = ContaminantSpecificModels()
        
        features = {
            'depth_m': 45,
            'geology': 'SANDSTONE',
            'aquifer_type': 'unconfined',
            'latitude': -1.3,
            'land_use': 'agricultural'
        }
        
        predictions = models.predict_all_parameters(features)
        
        assert len(predictions) == 8  # All parameters
        for param in ['tds', 'fluoride', 'arsenic', 'nitrate', 'iron', 'hardness', 'ph', 'manganese']:
            assert param in predictions
            assert 'predicted_mg_l' in predictions[param] or 'predicted_ug_l' in predictions[param] or 'predicted_ph' in predictions[param]
        
        print(f"✓ All parameters: {len(predictions)} models executed")


def run_all_tests():
    """Run all test suites"""
    print("\n" + "="*70)
    print("BOREHOLE AI SYSTEM - COMPREHENSIVE TEST SUITE")
    print("="*70)
    
    test_suites = [
        ("PHASE 1: CRITICAL GAPS", TestPhase1CriticalGaps),
        ("PHASE 2: REMOTE SENSING", TestPhase2RemoteSensing),
        ("PHASE 3: ML ENHANCEMENTS", TestPhase3MLEnhancements)
    ]
    
    total_passed = 0
    total_failed = 0
    
    for suite_name, suite_class in test_suites:
        print(f"\n{suite_name}")
        print("-" * 70)
        
        suite = suite_class()
        test_methods = [method for method in dir(suite) if method.startswith('test_')]
        
        for test_name in test_methods:
            try:
                method = getattr(suite, test_name)
                method()
                total_passed += 1
            except Exception as e:
                print(f"✗ {test_name}: {e}")
                total_failed += 1
    
    print("\n" + "="*70)
    print(f"RESULTS: {total_passed} passed, {total_failed} failed")
    print("="*70 + "\n")
    
    return total_failed == 0


if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)
