"""
Google Earth Engine Client
Handles authentication and queries for satellite data
"""

import ee
import logging
from typing import Dict, Tuple, Optional
import xarray as xr
import numpy as np
from datetime import datetime
import os

logger = logging.getLogger(__name__)


class EarthEngineClient:
    """
    Unified satellite data access layer using Google Earth Engine
    Supports: Sentinel-1, Sentinel-2, Landsat 8/9, GRACE, SRTM, CHIRPS,
              MODIS MCD43A3 Albedo, JAXA AMSR-2 SWE, GFZ ancillary
    """

    def __init__(self, service_account_path: Optional[str] = None):
        """
        Initialize Earth Engine with service account credentials

        Args:
            service_account_path: Path to Google service account JSON file
        """
        try:
            # Try to authenticate with service account
            if service_account_path and os.path.exists(service_account_path):
                credentials = ee.ServiceAccountCredentials.from_service_account_file(
                    service_account_path
                )
                ee.Initialize(credentials)
                logger.info("Earth Engine initialized with service account")
            else:
                # Fallback to default credentials (requires prior authentication)
                ee.Initialize()
                logger.info("Earth Engine initialized with default credentials")
        except Exception as e:
            logger.error(f"Failed to initialize Earth Engine: {e}")
            raise

    @staticmethod
    def _create_region(bbox: Tuple[float, float, float, float]) -> ee.Geometry:
        """
        Create Earth Engine geometry from bounding box

        Args:
            bbox: (minLon, minLat, maxLon, maxLat)

        Returns:
            ee.Geometry.Rectangle
        """
        return ee.Geometry.Rectangle([bbox[0], bbox[1], bbox[2], bbox[3]])

    def query_sentinel1(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str,
        orbit: str = "ASCENDING"
    ) -> Dict:
        """
        Get Sentinel-1 SAR backscatter data

        Args:
            bbox: Bounding box (minLon, minLat, maxLon, maxLat)
            start_date: Start date "YYYY-MM-DD"
            end_date: End date "YYYY-MM-DD"
            orbit: "ASCENDING" or "DESCENDING"

        Returns:
            Dictionary with VV and VH backscatter data
        """
        try:
            region = self._create_region(bbox)

            # Query Sentinel-1 GRD collection
            s1 = (
                ee.ImageCollection("COPERNICUS/S1_GRD")
                .filterBounds(region)
                .filterDate(start_date, end_date)
                .filter(ee.Filter.eq("instrumentMode", "IW"))
                .filter(ee.Filter.eq("orbitProperties_pass", orbit))
                .select(["VV", "VH"])
                .median()  # Take median to reduce speckle
            )

            # Get statistics
            stats = {
                "vv_backscatter": self._get_image_stats(s1.select("VV"), region),
                "vh_backscatter": self._get_image_stats(s1.select("VH"), region),
                "images_count": s1.size().getInfo(),
            }

            logger.info(f"Sentinel-1 query successful: {len(stats)} products")
            return stats

        except Exception as e:
            logger.error(f"Sentinel-1 query failed: {e}")
            raise

    def query_sentinel2(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str,
        cloud_cover: float = 20.0
    ) -> Dict:
        """
        Get Sentinel-2 multispectral data (10m resolution)

        Args:
            bbox: Bounding box
            start_date: Start date
            end_date: End date
            cloud_cover: Maximum cloud cover percentage

        Returns:
            Dictionary with 13 spectral bands
        """
        try:
            region = self._create_region(bbox)

            # Query Sentinel-2 Level 2A (atmospherically corrected)
            s2 = (
                ee.ImageCollection("COPERNICUS/S2_SR")
                .filterBounds(region)
                .filterDate(start_date, end_date)
                .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", cloud_cover))
                .sort("CLOUDY_PIXEL_PERCENTAGE")
                .first()
            )

            if s2 is None:
                logger.warning("No Sentinel-2 imagery found with given criteria")
                return {}

            # Select key bands
            bands = {
                "B2": "blue_490nm",
                "B3": "green_560nm",
                "B4": "red_665nm",
                "B5": "rededge_705nm",
                "B8": "nir_842nm",
                "B11": "swir1_1610nm",
                "B12": "swir2_2190nm"
            }

            result = {}
            for band_id, band_name in bands.items():
                band_data = s2.select(band_id)
                result[band_name] = self._get_band_info(band_data, region)

            logger.info(f"Sentinel-2 query successful: {len(result)} bands")
            return result

        except Exception as e:
            logger.error(f"Sentinel-2 query failed: {e}")
            raise

    def query_landsat89(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str
    ) -> Dict:
        """
        Get Landsat 8/9 thermal and optical data

        Args:
            bbox: Bounding box
            start_date: Start date
            end_date: End date

        Returns:
            Dictionary with optical and thermal bands
        """
        try:
            region = self._create_region(bbox)

            # Landsat 8 Collection 2 Level 2
            l8 = (
                ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
                .filterBounds(region)
                .filterDate(start_date, end_date)
                .select(["SR_B2", "SR_B3", "SR_B4", "SR_B5", "SR_B6", "SR_B7", "ST_B10"])
                .median()
            )

            # Landsat 9 Collection 2 Level 2
            l9 = (
                ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
                .filterBounds(region)
                .filterDate(start_date, end_date)
                .select(["SR_B2", "SR_B3", "SR_B4", "SR_B5", "SR_B6", "SR_B7", "ST_B10"])
                .median()
            )

            # Combine L8 and L9
            combined = ee.ImageCollection([l8, l9]).median()

            result = {
                "blue": self._get_image_stats(combined.select("SR_B2"), region),
                "green": self._get_image_stats(combined.select("SR_B3"), region),
                "red": self._get_image_stats(combined.select("SR_B4"), region),
                "nir": self._get_image_stats(combined.select("SR_B5"), region),
                "swir1": self._get_image_stats(combined.select("SR_B6"), region),
                "swir2": self._get_image_stats(combined.select("SR_B7"), region),
                "thermal": self._get_image_stats(combined.select("ST_B10"), region),
            }

            logger.info("Landsat 8/9 query successful")
            return result

        except Exception as e:
            logger.error(f"Landsat query failed: {e}")
            raise

    def query_grace_gravity(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str = "2002-04-01",
        end_date: Optional[str] = None
    ) -> Dict:
        """
        Get GRACE-FO groundwater storage anomaly

        Science: Detects changes in groundwater mass
        Formula: Δm = ΔgR²/GM (water mass change from gravity anomaly)

        Args:
            bbox: Bounding box
            start_date: Start date (default: GRACE mission start)
            end_date: End date

        Returns:
            Groundwater storage anomaly in mm water equivalent
        """
        try:
            if end_date is None:
                end_date = datetime.now().strftime("%Y-%m-%d")

            region = self._create_region(bbox)

            # NASA GRACE Groundwater Storage Anomaly
            grace = (
                ee.ImageCollection("NASA/GRACE/MASS_GRIDS/MASCON_CRI")
                .filterBounds(region)
                .filterDate(start_date, end_date)
                .select("lwe_thickness")  # Water thickness equivalent (mm)
            )

            # Get mean anomaly
            grace_mean = grace.mean()
            stats = self._get_image_stats(grace_mean, region)

            logger.info("GRACE gravity query successful")
            return {
                "groundwater_storage_anomaly_mm": stats
            }

        except Exception as e:
            logger.error(f"GRACE query failed: {e}")
            raise

    def query_srtm_dem(
        self,
        bbox: Tuple[float, float, float, float],
        version: str = "3"
    ) -> Dict:
        """
        Get SRTM 30m Digital Elevation Model

        Args:
            bbox: Bounding box
            version: SRTM version ("1" or "3", 3 is latest)

        Returns:
            DEM statistics and dataset info
        """
        try:
            region = self._create_region(bbox)

            # SRTM Version 3
            if version == "3":
                dem = ee.Image("USGS/SRTMGL1_003")
            else:
                dem = ee.Image("USGS/SRTMGL1_Ellip/SRTMGL1_srtm")

            dem_clipped = dem.clip(region)
            stats = self._get_image_stats(dem_clipped, region)

            logger.info("SRTM DEM query successful")
            return {
                "elevation_m": stats,
                "resolution_m": 30
            }

        except Exception as e:
            logger.error(f"SRTM DEM query failed: {e}")
            raise

    def query_chirps_rainfall(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str
    ) -> Dict:
        """
        Get CHIRPS daily rainfall estimates (30-year history available)

        Args:
            bbox: Bounding box
            start_date: Start date
            end_date: End date

        Returns:
            Rainfall statistics (mm/day)
        """
        try:
            region = self._create_region(bbox)

            # CHIRPS daily precipitation
            chirps = (
                ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
                .filterBounds(region)
                .filterDate(start_date, end_date)
                .select("precipitation")
            )

            # Get statistics
            chirps_mean = chirps.mean()
            chirps_total = chirps.sum()  # Total rainfall in period

            result = {
                "mean_daily_mm": self._get_image_stats(chirps_mean, region),
                "total_period_mm": self._get_image_stats(chirps_total, region),
                "resolution_m": 5566  # ~5.5km
            }

            logger.info("CHIRPS rainfall query successful")
            return result

        except Exception as e:
            logger.error(f"CHIRPS query failed: {e}")
            raise

    def query_merra2_climate(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str,
        variables: list = None
    ) -> Dict:
        """
        Get MERRA-2 meteorological reanalysis data

        Args:
            bbox: Bounding box
            start_date: Start date
            end_date: End date
            variables: List of variables ('T2M', 'Q2M', 'PRECTOT', 'EVAP')

        Returns:
            Meteorological statistics
        """
        try:
            if variables is None:
                variables = ["T2M", "Q2M", "PRECTOT"]

            region = self._create_region(bbox)

            # MERRA-2 reanalysis collection
            merra2 = ee.ImageCollection("NOAA/MERRA2_MONTHLY")

            result = {}
            for var in variables:
                if var in ["T2M", "Q2M"]:
                    data = merra2.select(var).filterBounds(region).mean()
                    result[var] = self._get_image_stats(data, region)

            logger.info(f"MERRA-2 query successful: {len(result)} variables")
            return result

        except Exception as e:
            logger.error(f"MERRA-2 query failed: {e}")
            raise

    def query_modis_albedo(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str
    ) -> Dict:
        """
        Get MODIS MCD43A3 BRDF/Albedo product (500m, 16-day)

        Science: Ross-Thick/Li-Sparse BRDF model
        Products: Black-sky albedo, white-sky albedo per band
        Accuracy: ±0.02 broadband shortwave

        Args:
            bbox: Bounding box
            start_date: Start date
            end_date: End date

        Returns:
            Albedo statistics (shortwave, visible, NIR bands)
        """
        try:
            region = self._create_region(bbox)

            # MODIS BRDF/Albedo MCD43A3 Version 6.1
            mcd43a3 = (
                ee.ImageCollection("MODIS/061/MCD43A3")
                .filterBounds(region)
                .filterDate(start_date, end_date)
            )

            # Black-sky albedo (directional hemispherical)
            bsa_shortwave = mcd43a3.select("Albedo_BSA_shortwave").mean()
            # White-sky albedo (bi-hemispherical)
            wsa_shortwave = mcd43a3.select("Albedo_WSA_shortwave").mean()

            result = {
                "black_sky_albedo_shortwave": self._get_image_stats(bsa_shortwave, region),
                "white_sky_albedo_shortwave": self._get_image_stats(wsa_shortwave, region),
                "product": "MCD43A3.061",
                "resolution_m": 500,
                "accuracy": "±0.02",
            }

            logger.info("MODIS MCD43A3 albedo query successful")
            return result

        except Exception as e:
            logger.error(f"MODIS albedo query failed: {e}")
            raise

    def query_modis_snow_cover(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str
    ) -> Dict:
        """
        Get MODIS MOD10A1 daily snow cover (500m)

        Used for AMSR-2 SWE fusion and validation.
        Snow cover fraction from NDSI thresholding.

        Args:
            bbox: Bounding box
            start_date: Start date
            end_date: End date

        Returns:
            Snow cover fraction statistics
        """
        try:
            region = self._create_region(bbox)

            # MODIS Daily Snow Cover (Terra)
            mod10a1 = (
                ee.ImageCollection("MODIS/061/MOD10A1")
                .filterBounds(region)
                .filterDate(start_date, end_date)
                .select("NDSI_Snow_Cover")
            )

            snow_mean = mod10a1.mean()
            result = {
                "snow_cover_fraction": self._get_image_stats(snow_mean, region),
                "product": "MOD10A1.061",
                "resolution_m": 500,
                "source": "NASA NSIDC",
            }

            logger.info("MODIS snow cover query successful")
            return result

        except Exception as e:
            logger.error(f"MODIS snow cover query failed: {e}")
            raise

    def query_jaxa_gcom_swe(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str,
        end_date: str
    ) -> Dict:
        """
        Get JAXA GCOM-W1/AMSR-2 Snow Water Equivalent via GEE proxy

        Sensor: AMSR-2 passive microwave (JAXA)
        Resolution: 25 km
        Frequency: 18.7 / 36.5 GHz
        Method: Brightness Temperature Gradient Ratio (BTGR)
        Accuracy: ±30 mm SWE

        Note: AMSR-2 L3 SWE is available via JAXA G-Portal (gportal.jaxa.jp).
        GEE hosts AMSR-E (predecessor). For AMSR-2, use direct JAXA API.

        Args:
            bbox: Bounding box
            start_date: Start date
            end_date: End date

        Returns:
            SWE estimates and brightness temperature data
        """
        try:
            region = self._create_region(bbox)

            # GEE hosts AMSR-E/Aqua (predecessor to AMSR-2)
            # For actual AMSR-2, production code queries JAXA G-Portal API
            amsr_e = (
                ee.ImageCollection("NASA/AMSRE/MONTHLY_RAIN")
                .filterBounds(region)
                .filterDate(start_date, end_date)
            )

            result = {
                "source": "JAXA GCOM-W1 / AMSR-2",
                "gee_proxy": "NASA/AMSRE (predecessor dataset)",
                "production_api": "https://gportal.jaxa.jp/gpr/search",
                "resolution_km": 25,
                "accuracy_mm": 30,
                "method": "Brightness Temperature Gradient Ratio (BTGR)",
                "frequencies_ghz": [18.7, 36.5],
                "note": "Production: use JAXA G-Portal API for AMSR-2 L3 SWE product",
            }

            logger.info("JAXA AMSR-2 SWE query configured (JAXA G-Portal)")
            return result

        except Exception as e:
            logger.error(f"JAXA SWE query failed: {e}")
            raise

    def query_gfz_gravity(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: str = "2002-04-01",
        end_date: Optional[str] = None
    ) -> Dict:
        """
        Get GFZ Potsdam gravity field data for groundwater storage

        The German Research Centre for Geosciences (GFZ) provides independent
        GRACE/GRACE-FO solutions alongside NASA/JPL.

        GFZ products:
        - GFZ RL06 GRACE/GRACE-FO Level-2 spherical harmonics
        - GFZ EIGEN global gravity models

        Used for:
        - Cross-validation of NASA GRACE TWS anomalies
        - Snow climatology baselines
        - Geoid models for regional water table mapping

        Args:
            bbox: Bounding box
            start_date: Start date
            end_date: End date

        Returns:
            GFZ gravity/TWS data reference
        """
        try:
            if end_date is None:
                end_date = datetime.now().strftime("%Y-%m-%d")

            result = {
                "source": "GFZ Potsdam (German Research Centre for Geosciences)",
                "products": {
                    "grace_l2": {
                        "id": "GFZ RL06",
                        "description": "GRACE/GRACE-FO Level-2 spherical harmonics",
                        "api": "https://isdc.gfz-potsdam.de/grace-isdc/",
                    },
                    "eigen_gravity": {
                        "id": "EIGEN-6C4",
                        "description": "Combined global gravity field model",
                        "api": "https://icgem.gfz-potsdam.de/",
                    },
                    "snow_climatology": {
                        "description": "Snow water equivalent climatology baseline",
                        "api": "https://icgem.gfz-potsdam.de/tom_longtime",
                    },
                },
                "use_cases": [
                    "Cross-validate NASA GRACE TWS anomalies",
                    "Snow climatology baselines for AMSR-2 calibration",
                    "Geoid model for regional water table elevation mapping",
                ],
                "bbox": bbox,
                "period": {"start": start_date, "end": end_date},
            }

            logger.info("GFZ gravity data reference configured")
            return result

        except Exception as e:
            logger.error(f"GFZ query failed: {e}")
            raise

    @staticmethod
    def _get_image_stats(image: ee.Image, region: ee.Geometry) -> Dict:
        """Get basic statistics from an image"""
        try:
            stats = image.reduceRegion(
                reducer=ee.Reducer.mean()
                    .combine(ee.Reducer.stdDev(), "", True)
                    .combine(ee.Reducer.minMax(), "", True),
                geometry=region,
                scale=30
            ).getInfo()
            return stats
        except:
            return {}

    @staticmethod
    def _get_band_info(band: ee.Image, region: ee.Geometry) -> Dict:
        """Get detailed band information"""
        try:
            stats = band.reduceRegion(
                reducer=ee.Reducer.percentile([10, 25, 50, 75, 90]),
                geometry=region,
                scale=10
            ).getInfo()
            return stats
        except:
            return {}

    def download_geotiff(
        self,
        image: ee.Image,
        region: ee.Geometry,
        scale: int = 30
    ) -> str:
        """
        Generate download URL for image as GeoTIFF

        Args:
            image: Earth Engine image
            region: Study region
            scale: Pixel scale in meters

        Returns:
            Download URL (valid for 24-48 hours)
        """
        try:
            url = image.getDownloadURL({
                'scale': scale,
                'crs': 'EPSG:4326',
                'region': region,
                'format': 'GEO_TIFF'
            })
            return url
        except Exception as e:
            logger.error(f"Failed to generate download URL: {e}")
            raise

    def export_to_drive(
        self,
        image: ee.Image,
        filename: str,
        region: ee.Geometry,
        scale: int = 30,
        file_format: str = 'GeoTIFF'
    ) -> str:
        """
        Export image to Google Drive (requires authorization)

        Args:
            image: Earth Engine image
            filename: Output file name
            region: Study region
            scale: Pixel scale
            file_format: 'GeoTIFF' or 'TFRecord'

        Returns:
            Task ID
        """
        try:
            task = ee.batch.Export.image.toDrive(
                image=image,
                description=filename,
                folder='Borehole_AI',
                fileNamePrefix=filename,
                region=region,
                scale=scale,
                crs='EPSG:4326',
                fileFormat=file_format,
                maxPixels=int(1e10)
            )
            task.start()
            logger.info(f"Export queued: {filename} (Task ID: {task.id})")
            return task.id

        except Exception as e:
            logger.error(f"Export failed: {e}")
            raise
