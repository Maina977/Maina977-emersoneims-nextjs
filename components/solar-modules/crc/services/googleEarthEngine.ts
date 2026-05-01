// Google Earth Engine API Integration
//
// DATA POLICY NOTICE
// ------------------
// Earth Engine analyses (NDVI, vegetation height, tree-cover %, seasonal
// shading from satellite imagery) require either:
//   (a) a Google Earth Engine service account + the geemap/EE Python bridge,
//   (b) a Sentinel Hub / Planet / Maxar API account, or
//   (c) a locally trained CV model on satellite tiles.
// None of those are wired up in this codebase. The previous implementation
// returned Math.random() values that masqueraded as NDVI / shading metrics
// \u2014 a direct violation of project data policy. They have been removed.
//
// Methods now throw NotImplementedError with a `requires` list so the UI
// can show the user exactly what is missing instead of silently lying.
//
// What IS safe and real here:
//   - getSatelliteImagery() returns the Google Static Maps URL (this is a
//     real image fetched on demand by the browser, no fabrication).

import { NotImplementedError, Provenance, Sourced, provenance, sourced } from './provenance';

export interface SatelliteImagery {
  url: string;
  date: string;
  resolution: number;
  cloudCover: number | null; // null = unknown (was Math.random previously)
}

export interface VegetationAnalysis {
  ndvi: number;
  treeCover: number;
  vegetationHeight: number;
  shadingImpact: number;
  seasonalChanges: SeasonalVegetation[];
}

export interface SeasonalVegetation {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  ndvi: number;
  shadingFactor: number;
}

export interface RoofAnalysis {
  roofArea: number;
  roofPitch: number;
  roofOrientation: number;
  obstructions: Obstruction[];
  usableArea: number;
}

export interface Obstruction {
  type: 'chimney' | 'vent' | 'tree' | 'adjacent_building' | 'other';
  height: number;
  distance: number;
  shadingAngle: number;
}

class GoogleEarthEngineService {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Google Maps / Static Maps API key is required.');
    }
    this.apiKey = apiKey;
  }

  /**
   * Returns the URL of a real Google Static Maps satellite tile for the point.
   * No analysis is performed and no metrics are fabricated.
   * cloudCover is null because Static Maps does not publish a cloud-cover value.
   */
  async getSatelliteImagery(
    lat: number,
    lon: number,
    zoom: number = 19
  ): Promise<Sourced<SatelliteImagery[]>> {
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=${zoom}&size=800x800&maptype=satellite&key=${this.apiKey}`;
    const item: SatelliteImagery = {
      url,
      date: new Date().toISOString(),
      resolution: 0.5, // approximate for zoom=19 at the equator
      cloudCover: null,
    };
    const prov: Provenance = provenance('Google Static Maps (satellite)', 'measured', {
      citation: 'https://developers.google.com/maps/documentation/maps-static',
      notes:
        'Image URL only; no on-server analysis performed. cloudCover and date of capture are not provided by the Static Maps API.',
    });
    return sourced([item], prov);
  }

  async analyzeVegetation(_lat: number, _lon: number, _radius: number = 50): Promise<VegetationAnalysis> {
    throw new NotImplementedError('GoogleEarthEngine.analyzeVegetation', [
      'Google Earth Engine service account, OR',
      'Sentinel Hub / Copernicus account for Sentinel-2 NDVI tiles, OR',
      'Local CV model trained on satellite imagery',
    ]);
  }

  async analyzeRoof(_lat: number, _lon: number): Promise<RoofAnalysis> {
    throw new NotImplementedError('GoogleEarthEngine.analyzeRoof', [
      'Google Solar API (Building Insights) where available, OR',
      'OpenStreetMap building footprint + LiDAR DEM, OR',
      'User-uploaded roof outline (manual trace in Design Studio)',
    ]);
  }

  async getHistoricalImagery(
    _lat: number,
    _lon: number,
    _years: number = 5
  ): Promise<SatelliteImagery[]> {
    throw new NotImplementedError('GoogleEarthEngine.getHistoricalImagery', [
      'Earth Engine ImageCollection access (Landsat / Sentinel-2 archive)',
    ]);
  }

  async calculateSeasonalShading(_lat: number, _lon: number): Promise<{
    spring: number;
    summer: number;
    autumn: number;
    winter: number;
  }> {
    throw new NotImplementedError('GoogleEarthEngine.calculateSeasonalShading', [
      'Working analyzeVegetation() (see above), OR',
      'Direct shading simulation from a 3D site model + sun-position engine',
    ]);
  }
}

export const createGoogleEarthEngineService = (apiKey: string) => new GoogleEarthEngineService(apiKey);
