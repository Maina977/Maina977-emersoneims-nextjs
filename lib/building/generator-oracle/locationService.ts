/**
 * GENERATOR ORACLE - LOCATION SERVICE
 * GPS location tracking and reverse geocoding
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface LocationResult {
  coordinates: Coordinates;
  address?: string;
  city?: string;
  country?: string;
  timestamp: string;
}

export interface GeocodeResult {
  address: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  formatted: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCATION AVAILABILITY
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if geolocation is available
 */
export function isGeolocationAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

/**
 * Check if geolocation permission is granted
 */
export async function checkGeolocationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
  if (typeof navigator === 'undefined' || !('permissions' in navigator)) {
    return 'prompt';
  }

  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch {
    return 'prompt';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CURRENT LOCATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get current location
 */
export function getCurrentLocation(options?: PositionOptions): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationAvailable()) {
      reject(new Error('Geolocation is not available'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
        });
      },
      (error) => {
        let message: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
          default:
            message = 'Failed to get location.';
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...options,
      }
    );
  });
}

/**
 * Watch location changes
 */
export function watchLocation(
  onUpdate: (coords: Coordinates) => void,
  onError?: (error: Error) => void,
  options?: PositionOptions
): number | null {
  if (!isGeolocationAvailable()) {
    onError?.(new Error('Geolocation is not available'));
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        heading: position.coords.heading,
        speed: position.coords.speed,
      });
    },
    (error) => {
      onError?.(new Error(error.message));
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
      ...options,
    }
  );
}

/**
 * Stop watching location
 */
export function clearLocationWatch(watchId: number): void {
  if (isGeolocationAvailable()) {
    navigator.geolocation.clearWatch(watchId);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// REVERSE GEOCODING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Reverse geocode coordinates to address
 * Uses OpenStreetMap Nominatim (free, no API key required)
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodeResult | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'GeneratorOracle/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (!data || data.error) {
      return null;
    }

    const address = data.address || {};

    return {
      address: [
        address.house_number,
        address.road,
        address.suburb,
      ].filter(Boolean).join(', ') || data.display_name,
      city: address.city || address.town || address.village || address.municipality,
      region: address.state || address.county,
      country: address.country,
      postalCode: address.postcode,
      formatted: data.display_name,
    };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
}

/**
 * Get full location with address
 */
export async function getLocationWithAddress(): Promise<LocationResult> {
  const coordinates = await getCurrentLocation();
  const geocode = await reverseGeocode(coordinates.latitude, coordinates.longitude);

  return {
    coordinates,
    address: geocode?.formatted || undefined,
    city: geocode?.city,
    country: geocode?.country,
    timestamp: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DISTANCE CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate distance between two points (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAP UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate Google Maps URL for coordinates
 */
export function getGoogleMapsUrl(latitude: number, longitude: number, label?: string): string {
  const coords = `${latitude},${longitude}`;
  if (label) {
    return `https://www.google.com/maps/search/?api=1&query=${coords}&query_place_id=${encodeURIComponent(label)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${coords}`;
}

/**
 * Generate directions URL
 */
export function getDirectionsUrl(
  destLat: number,
  destLon: number,
  originLat?: number,
  originLon?: number
): string {
  const dest = `${destLat},${destLon}`;
  if (originLat && originLon) {
    const origin = `${originLat},${originLon}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

/**
 * Generate static map image URL (using OpenStreetMap)
 */
export function getStaticMapUrl(
  latitude: number,
  longitude: number,
  zoom: number = 15,
  width: number = 400,
  height: number = 300
): string {
  // Using OpenStreetMap static map service
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&maptype=mapnik&markers=${latitude},${longitude},red`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE
// ═══════════════════════════════════════════════════════════════════════════════

const SAVED_LOCATIONS_KEY = 'oracle_saved_locations';

export interface SavedLocation {
  id: string;
  name: string;
  coordinates: Coordinates;
  address?: string;
  createdAt: string;
}

/**
 * Save location to local storage
 */
export function saveLocation(location: Omit<SavedLocation, 'id' | 'createdAt'>): SavedLocation {
  const saved: SavedLocation = {
    ...location,
    id: `loc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const existing = getSavedLocations();
  existing.push(saved);

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(existing));
  }

  return saved;
}

/**
 * Get saved locations
 */
export function getSavedLocations(): SavedLocation[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const data = localStorage.getItem(SAVED_LOCATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Delete saved location
 */
export function deleteSavedLocation(id: string): boolean {
  if (typeof localStorage === 'undefined') return false;

  const existing = getSavedLocations();
  const filtered = existing.filter(loc => loc.id !== id);

  if (filtered.length === existing.length) return false;

  localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(filtered));
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COORDINATE FORMATTING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Format coordinates for display
 */
export function formatCoordinates(
  latitude: number,
  longitude: number,
  format: 'decimal' | 'dms' = 'decimal'
): string {
  if (format === 'decimal') {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  // Degrees, Minutes, Seconds format
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';

  const latDMS = decimalToDMS(Math.abs(latitude));
  const lonDMS = decimalToDMS(Math.abs(longitude));

  return `${latDMS}${latDir}, ${lonDMS}${lonDir}`;
}

function decimalToDMS(decimal: number): string {
  const degrees = Math.floor(decimal);
  const minutesDecimal = (decimal - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = ((minutesDecimal - minutes) * 60).toFixed(1);

  return `${degrees}°${minutes}'${seconds}"`;
}
