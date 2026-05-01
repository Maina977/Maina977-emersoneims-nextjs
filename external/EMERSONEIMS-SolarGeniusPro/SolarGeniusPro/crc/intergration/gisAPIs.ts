// GIS API INTEGRATIONS
// Geographic Information Systems for site analysis

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  country: string;
  region: string;
  postalCode?: string;
  timezone: string;
}

export interface TerrainData {
  elevation: number;
  slope: number;
  aspect: number;
  hillshade: number;
  roughness: number;
  landCover: string;
  soilType: string;
}

export interface BuildingFootprint {
  id: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  area: number;
  height: number;
  roofType: string;
  yearBuilt?: number;
  confidence: number;
}

export interface RoadNetwork {
  distanceToRoad: number;
  roadType: string;
  accessPoints: Array<{ lat: number; lng: number }>;
}

class GISAPIs {
  private googleMapsKey: string;
  private hereMapsKey: string;
  
  constructor() {
    this.googleMapsKey = process.env.GOOGLE_MAPS_API_KEY || '';
    this.hereMapsKey = process.env.HERE_MAPS_API_KEY || '';
  }
  
  async geocodeAddress(address: string): Promise<GeoLocation> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.googleMapsKey}`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        const addressComponents = data.results[0].address_components;
        
        let country = '', region = '', postalCode = '';
        for (const comp of addressComponents) {
          if (comp.types.includes('country')) country = comp.long_name;
          if (comp.types.includes('administrative_area_level_1')) region = comp.long_name;
          if (comp.types.includes('postal_code')) postalCode = comp.long_name;
        }
        
        return {
          lat: location.lat,
          lng: location.lng,
          address: data.results[0].formatted_address,
          country,
          region,
          postalCode,
          timezone: await this.getTimezone(location.lat, location.lng)
        };
      }
      throw new Error('Address not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }
  
  async reverseGeocode(lat: number, lng: number): Promise<GeoLocation> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.googleMapsKey}`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const addressComponents = data.results[0].address_components;
        let country = '', region = '', postalCode = '';
        
        for (const comp of addressComponents) {
          if (comp.types.includes('country')) country = comp.long_name;
          if (comp.types.includes('administrative_area_level_1')) region = comp.long_name;
          if (comp.types.includes('postal_code')) postalCode = comp.long_name;
        }
        
        return {
          lat,
          lng,
          address: data.results[0].formatted_address,
          country,
          region,
          postalCode,
          timezone: await this.getTimezone(lat, lng)
        };
      }
      throw new Error('Location not found');
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }
  
  async getTimezone(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${this.googleMapsKey}`
      );
      const data = await response.json();
      return data.timeZoneId || 'Africa/Nairobi';
    } catch (error) {
      return 'Africa/Nairobi';
    }
  }
  
  async getTerrainData(lat: number, lng: number, radius: number = 100): Promise<TerrainData> {
    // Get elevation from Open-Elevation API
    try {
      const response = await fetch(
        `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
      );
      const data = await response.json();
      
      const elevation = data.results?.[0]?.elevation || 1500;
      
      // Calculate approximate slope from surrounding points
      const slope = await this.calculateSlope(lat, lng);
      
      return {
        elevation,
        slope,
        aspect: await this.calculateAspect(lat, lng),
        hillshade: await this.calculateHillshade(lat, lng),
        roughness: slope / 10,
        landCover: await this.getLandCover(lat, lng),
        soilType: await this.getSoilType(lat, lng)
      };
    } catch (error) {
      return {
        elevation: 1500,
        slope: 5,
        aspect: 180,
        hillshade: 0.7,
        roughness: 0.5,
        landCover: 'Urban',
        soilType: 'Clay loam'
      };
    }
  }
  
  async getBuildingFootprints(lat: number, lng: number, radius: number = 200): Promise<BuildingFootprint[]> {
    // In production, use Google Maps Places API or OpenStreetMap Overpass API
    try {
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(way["building"](around:${radius},${lat},${lng}););out;`;
      const response = await fetch(overpassUrl);
      const data = await response.json();
      
      if (data.elements) {
        return data.elements.map((element: any) => ({
          id: element.id.toString(),
          geometry: { type: 'Polygon', coordinates: [[]] },
          area: element.tags?.area || 50,
          height: parseFloat(element.tags?.height) || 5,
          roofType: element.tags?.roof_shape || 'flat',
          confidence: 0.85
        }));
      }
      return [];
    } catch (error) {
      return this.getSimulatedBuildingFootprints(lat, lng, radius);
    }
  }
  
  async getRoadNetwork(lat: number, lng: number): Promise<RoadNetwork> {
    try {
      const response = await fetch(
        `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${this.googleMapsKey}`
      );
      const data = await response.json();
      
      if (data.snappedPoints && data.snappedPoints[0]) {
        const distance = this.calculateDistance(
          lat, lng,
          data.snappedPoints[0].location.latitude,
          data.snappedPoints[0].location.longitude
        );
        
        return {
          distanceToRoad: distance,
          roadType: 'Primary',
          accessPoints: [{ lat: data.snappedPoints[0].location.latitude, lng: data.snappedPoints[0].location.longitude }]
        };
      }
    } catch (error) {
      // Fallback
    }
    
    return {
      distanceToRoad: 50,
      roadType: 'Secondary',
      accessPoints: [{ lat, lng }]
    };
  }
  
  async getSatelliteImage(lat: number, lng: number, zoom: number = 19): Promise<string> {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=800x800&maptype=satellite&key=${this.googleMapsKey}`;
  }
  
  async getStreetViewImage(lat: number, lng: number, heading: number = 0): Promise<string> {
    return `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${lat},${lng}&heading=${heading}&fov=90&pitch=10&key=${this.googleMapsKey}`;
  }
  
  async getSolarPotential(lat: number, lng: number): Promise<{
    annualIrradiance: number;
    optimalTilt: number;
    optimalAzimuth: number;
    shadingFactor: number;
  }> {
    // Calculate solar potential based on location
    const irradiance = await this.calculateSolarIrradiance(lat, lng);
    const optimalTilt = Math.abs(lat) * 0.9 + 10;
    const optimalAzimuth = lat > 0 ? 180 : 0;
    
    return {
      annualIrradiance: irradiance,
      optimalTilt,
      optimalAzimuth,
      shadingFactor: 0.92
    };
  }
  
  private async calculateSlope(lat: number, lng: number): Promise<number> {
    // Calculate slope using surrounding elevation points
    const center = await this.getElevation(lat, lng);
    const north = await this.getElevation(lat + 0.001, lng);
    const south = await this.getElevation(lat - 0.001, lng);
    const east = await this.getElevation(lat, lng + 0.001);
    const west = await this.getElevation(lat, lng - 0.001);
    
    const dx = east - west;
    const dy = north - south;
    const slopeRad = Math.atan(Math.sqrt(dx * dx + dy * dy) / 111320);
    return slopeRad * 180 / Math.PI;
  }
  
  private async calculateAspect(lat: number, lng: number): Promise<number> {
    const north = await this.getElevation(lat + 0.001, lng);
    const south = await this.getElevation(lat - 0.001, lng);
    const east = await this.getElevation(lat, lng + 0.001);
    const west = await this.getElevation(lat, lng - 0.001);
    
    const dx = east - west;
    const dy = north - south;
    let aspect = Math.atan2(dy, dx) * 180 / Math.PI;
    if (aspect < 0) aspect += 360;
    return aspect;
  }
  
  private async calculateHillshade(lat: number, lng: number): Promise<number> {
    const slope = await this.calculateSlope(lat, lng);
    const aspect = await this.calculateAspect(lat, lng);
    const sunAzimuth = 135; // Approximate
    const sunAltitude = 45; // Approximate
    
    const slopeRad = slope * Math.PI / 180;
    const aspectRad = aspect * Math.PI / 180;
    const sunAzimuthRad = sunAzimuth * Math.PI / 180;
    const sunAltitudeRad = sunAltitude * Math.PI / 180;
    
    const hillshade = Math.cos(slopeRad) * Math.sin(sunAltitudeRad) +
      Math.sin(slopeRad) * Math.cos(sunAltitudeRad) * Math.cos(aspectRad - sunAzimuthRad);
    
    return Math.max(0, Math.min(1, hillshade));
  }
  
  private async getElevation(lat: number, lng: number): Promise<number> {
    try {
      const response = await fetch(
        `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
      );
      const data = await response.json();
      return data.results?.[0]?.elevation || 1500;
    } catch {
      return 1500;
    }
  }
  
  private async getLandCover(lat: number, lng: number): Promise<string> {
    // In production, use ESA WorldCover or Google Dynamic World
    return 'Urban';
  }
  
  private async getSoilType(lat: number, lng: number): Promise<string> {
    return 'Clay loam';
  }
  
  private async calculateSolarIrradiance(lat: number, lng: number): Promise<number> {
    // Simplified calculation
    const absLat = Math.abs(lat);
    if (absLat < 10) return 5.5;
    if (absLat < 20) return 5.2;
    if (absLat < 30) return 4.8;
    if (absLat < 40) return 4.2;
    return 3.5;
  }
  
  private getSimulatedBuildingFootprints(lat: number, lng: number, radius: number): BuildingFootprint[] {
    return [
      {
        id: 'building_1',
        geometry: { type: 'Polygon', coordinates: [[]] },
        area: 120,
        height: 6,
        roofType: 'flat',
        confidence: 0.9
      }
    ];
  }
  
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }
}

export const gisAPIs = new GISAPIs();