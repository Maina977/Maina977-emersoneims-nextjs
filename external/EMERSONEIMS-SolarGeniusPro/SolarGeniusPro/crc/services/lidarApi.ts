// USGS / OpenTopography LiDAR API
//
// DATA POLICY NOTICE
// ------------------
// The previous implementation returned synthetic roof meshes, fixed building
// footprints, and Math.random() obstruction lists. That violates project data
// policy (no fabricated values). Those methods now throw NotImplementedError.
//
// What IS real and safe here:
//   - getElevation() queries OpenTopography SRTMGL3 and returns the value
//     reported by the service; on failure it throws DataUnavailableError
//     instead of returning a hard-coded 1795 m.

import { DataUnavailableError, NotImplementedError, Provenance, Sourced, provenance, sourced } from './provenance';

export interface LidarPoint {
  x: number;
  y: number;
  z: number;
  classification: number;
}

export interface RoofMesh {
  vertices: [number, number, number][];
  faces: [number, number, number][];
  area: number;
  pitch: number;
  orientation: number;
  ridgeHeight: number;
  eaveHeight: number;
}

export interface BuildingFootprint {
  center: { lat: number; lon: number };
  vertices: [number, number][];
  area: number;
  height: number;
  confidence: number;
}

export interface Obstruction {
  type: 'chimney' | 'vent' | 'tree' | 'adjacent_building' | 'other';
  height: number;
  distance: number;
  shadingAngle: number;
}

class LidarApiService {
  private openTopographyUrl = 'https://portal.opentopography.org/API/globaldem';

  /**
   * Queries OpenTopography SRTMGL3 for the elevation at (lat, lon).
   * Throws DataUnavailableError on any failure \u2014 never returns a default.
   */
  async getElevation(lat: number, lon: number): Promise<Sourced<number>> {
    const url = `${this.openTopographyUrl}?demtype=SRTMGL3&west=${lon - 0.01}&south=${lat - 0.01}&east=${lon + 0.01}&north=${lat + 0.01}&outputFormat=JSON`;
    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      throw new DataUnavailableError('OpenTopography SRTMGL3', 'network error', err);
    }
    if (!response.ok) {
      throw new DataUnavailableError(
        'OpenTopography SRTMGL3',
        `HTTP ${response.status} for (${lat},${lon})`
      );
    }
    const data: any = await response.json();
    const elev = data?.elevation;
    if (typeof elev !== 'number' || !Number.isFinite(elev)) {
      throw new DataUnavailableError(
        'OpenTopography SRTMGL3',
        `no elevation in response for (${lat},${lon})`
      );
    }
    const prov: Provenance = provenance('OpenTopography SRTMGL3 (NASA SRTM 3-arcsec)', 'measured', {
      citation: 'https://portal.opentopography.org/apidocs/',
      notes: 'Single point sampled from a small bounding box; vertical accuracy ~16 m (90% CI).',
    });
    return sourced(elev, prov);
  }

  async getRoofMesh(_lat: number, _lon: number, _width: number = 20, _height: number = 20): Promise<RoofMesh> {
    throw new NotImplementedError('LidarApi.getRoofMesh', [
      'Aerial LiDAR point cloud coverage (USGS 3DEP, OS LIDAR, or local survey)',
      'A roof-segmentation model (e.g. Open3D + RANSAC plane fitting)',
    ]);
  }

  async getBuildingFootprint(_lat: number, _lon: number): Promise<BuildingFootprint> {
    throw new NotImplementedError('LidarApi.getBuildingFootprint', [
      'OpenStreetMap Overpass query for building polygons, OR',
      'Microsoft Building Footprints dataset, OR',
      'Manual polygon trace from satellite imagery',
    ]);
  }

  async detectObstructions(_lat: number, _lon: number, _radius: number = 30): Promise<Obstruction[]> {
    throw new NotImplementedError('LidarApi.detectObstructions', [
      'LiDAR point cloud + non-ground classification, OR',
      'OSM Overpass query for trees/buildings within radius (deterministic, no Math.random)',
    ]);
  }
}

export const lidarApi = new LidarApiService();
