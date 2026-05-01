// Google Maps API Integration
// Geocoding, places, distance matrix

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  country: string;
  region: string;
  postalCode?: string;
}

export interface PlaceResult {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating?: number;
  types: string[];
}

export interface DistanceMatrixResult {
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  status: string;
}

class GoogleMapsApiService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    const url = `${this.baseUrl}/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const result = data.results[0];
        const location = result.geometry.location;
        let country = '', region = '', postalCode = '';
        
        for (const comp of result.address_components) {
          if (comp.types.includes('country')) country = comp.long_name;
          if (comp.types.includes('administrative_area_level_1')) region = comp.long_name;
          if (comp.types.includes('postal_code')) postalCode = comp.long_name;
        }
        
        return {
          lat: location.lat,
          lng: location.lng,
          formattedAddress: result.formatted_address,
          country,
          region,
          postalCode
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
    const url = `${this.baseUrl}/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const result = data.results[0];
        let country = '', region = '', postalCode = '';
        
        for (const comp of result.address_components) {
          if (comp.types.includes('country')) country = comp.long_name;
          if (comp.types.includes('administrative_area_level_1')) region = comp.long_name;
          if (comp.types.includes('postal_code')) postalCode = comp.long_name;
        }
        
        return {
          lat,
          lng,
          formattedAddress: result.formatted_address,
          country,
          region,
          postalCode
        };
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * DATA POLICY: returns ONLY the timezone reported by Google. Throws if
   * Google fails — never falls back to a hard-coded region (the previous
   * behaviour silently mislabelled every site as Africa/Nairobi).
   */
  async getTimezone(lat: number, lng: number): Promise<string> {
    const url = `${this.baseUrl}/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${this.apiKey}`;
    let response: Response;
    try {
      response = await fetch(url);
    } catch (error) {
      throw new Error(`Google Maps timezone network error for (${lat},${lng}): ${(error as Error).message}`);
    }
    if (!response.ok) {
      throw new Error(`Google Maps timezone HTTP ${response.status} for (${lat},${lng})`);
    }
    const data = await response.json();
    if (!data?.timeZoneId) {
      throw new Error(`Google Maps timezone response missing timeZoneId for (${lat},${lng})`);
    }
    return data.timeZoneId;
  }

  async getSatelliteImage(lat: number, lng: number, zoom: number = 19): Promise<string> {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=800x800&maptype=satellite&key=${this.apiKey}`;
  }

  async getStreetViewImage(lat: number, lng: number, heading: number = 0): Promise<string> {
    return `https://maps.googleapis.com/maps/api/streetview?size=800x400&location=${lat},${lng}&heading=${heading}&fov=90&pitch=10&key=${this.apiKey}`;
  }

  async calculateDistance(origin: string, destination: string): Promise<DistanceMatrixResult | null> {
    const url = `${this.baseUrl}/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.rows && data.rows[0] && data.rows[0].elements[0]) {
        const element = data.rows[0].elements[0];
        return {
          origin,
          destination,
          distance: element.distance.value,
          duration: element.duration.value,
          status: element.status
        };
      }
      return null;
    } catch (error) {
      console.error('Distance matrix error:', error);
      return null;
    }
  }

  async searchNearby(lat: number, lng: number, radius: number, type: string): Promise<PlaceResult[]> {
    const url = `${this.baseUrl}/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.results) {
        return data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
          },
          rating: place.rating,
          types: place.types
        }));
      }
      return [];
    } catch (error) {
      console.error('Nearby search error:', error);
      return [];
    }
  }
}

export const createGoogleMapsApiService = (apiKey: string) => new GoogleMapsApiService(apiKey);