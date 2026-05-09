/**
 * GENERATOR ORACLE - LOCATION CAPTURE
 * GPS location capture and display component
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Loader2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Bookmark,
  Trash2,
  Map,
} from 'lucide-react';
import {
  isGeolocationAvailable,
  getCurrentLocation,
  reverseGeocode,
  formatCoordinates,
  formatDistance,
  calculateDistance,
  getGoogleMapsUrl,
  getDirectionsUrl,
  saveLocation,
  getSavedLocations,
  deleteSavedLocation,
  type Coordinates,
  type GeocodeResult,
  type SavedLocation,
} from '@/lib/generator-oracle/locationService';

interface LocationCaptureProps {
  onLocationCaptured?: (location: {
    coordinates: Coordinates;
    address?: string;
  }) => void;
  showSavedLocations?: boolean;
  compact?: boolean;
}

export default function LocationCapture({
  onLocationCaptured,
  showSavedLocations = true,
  compact = false,
}: LocationCaptureProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<GeocodeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [locationName, setLocationName] = useState('');

  // Load saved locations
  useEffect(() => {
    if (showSavedLocations) {
      setSavedLocations(getSavedLocations());
    }
  }, [showSavedLocations]);

  // Get current location
  const captureLocation = useCallback(async () => {
    if (!isGeolocationAvailable()) {
      setError('Location services are not available on this device');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      setCoordinates(coords);

      // Reverse geocode
      const geocode = await reverseGeocode(coords.latitude, coords.longitude);
      setAddress(geocode);

      // Notify parent
      onLocationCaptured?.({
        coordinates: coords,
        address: geocode?.formatted,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    }

    setIsLoading(false);
  }, [onLocationCaptured]);

  // Copy coordinates
  const copyCoordinates = useCallback(() => {
    if (!coordinates) return;

    const text = formatCoordinates(coordinates.latitude, coordinates.longitude);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [coordinates]);

  // Save current location
  const handleSaveLocation = useCallback(() => {
    if (!coordinates) return;

    const name = locationName.trim() || `Location ${savedLocations.length + 1}`;
    const saved = saveLocation({
      name,
      coordinates,
      address: address?.formatted,
    });

    setSavedLocations(prev => [...prev, saved]);
    setLocationName('');
  }, [coordinates, address, locationName, savedLocations.length]);

  // Delete saved location
  const handleDeleteLocation = useCallback((id: string) => {
    deleteSavedLocation(id);
    setSavedLocations(prev => prev.filter(loc => loc.id !== id));
  }, []);

  // Use saved location
  const useSavedLocation = useCallback((location: SavedLocation) => {
    setCoordinates(location.coordinates);
    setAddress(location.address ? { formatted: location.address } as GeocodeResult : null);
    onLocationCaptured?.({
      coordinates: location.coordinates,
      address: location.address,
    });
    setShowSaved(false);
  }, [onLocationCaptured]);

  // Compact view
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={captureLocation}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {coordinates ? 'Update' : 'Get Location'}
        </button>

        {coordinates && (
          <span className="text-sm text-gray-400">
            {formatCoordinates(coordinates.latitude, coordinates.longitude)}
          </span>
        )}

        {error && (
          <span className="text-sm text-red-400">{error}</span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-white">Location</h3>
        </div>
        {showSavedLocations && savedLocations.length > 0 && (
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-400 hover:text-white"
          >
            <Bookmark className="w-4 h-4" />
            Saved ({savedLocations.length})
          </button>
        )}
      </div>

      {/* Saved locations dropdown */}
      {showSaved && (
        <div className="border-b border-gray-700 bg-gray-800 max-h-48 overflow-y-auto">
          {savedLocations.map(location => (
            <div
              key={location.id}
              className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer"
              onClick={() => useSavedLocation(location)}
            >
              <div>
                <p className="text-white text-sm font-medium">{location.name}</p>
                <p className="text-xs text-gray-400">
                  {formatCoordinates(location.coordinates.latitude, location.coordinates.longitude)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteLocation(location.id);
                }}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4">
        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-700 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* No location */}
        {!coordinates && !isLoading && (
          <div className="text-center py-6">
            <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">No location captured</p>
            <button
              onClick={captureLocation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-white mx-auto hover:bg-blue-500"
            >
              <Navigation className="w-4 h-4" />
              Get Current Location
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-6">
            <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
            <p className="text-gray-400">Getting your location...</p>
          </div>
        )}

        {/* Location captured */}
        {coordinates && !isLoading && (
          <div className="space-y-4">
            {/* Coordinates */}
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase">Coordinates</span>
                <div className="flex gap-1">
                  <button
                    onClick={copyCoordinates}
                    className="p-1 text-gray-400 hover:text-white"
                    title="Copy coordinates"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={captureLocation}
                    className="p-1 text-gray-400 hover:text-white"
                    title="Refresh location"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-white font-mono">
                {formatCoordinates(coordinates.latitude, coordinates.longitude)}
              </p>
              {coordinates.accuracy && (
                <p className="text-xs text-gray-500 mt-1">
                  Accuracy: ±{Math.round(coordinates.accuracy)}m
                </p>
              )}
            </div>

            {/* Address */}
            {address && (
              <div className="bg-gray-800 rounded-lg p-3">
                <span className="text-xs text-gray-400 uppercase">Address</span>
                <p className="text-white mt-1">{address.formatted}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <a
                href={getGoogleMapsUrl(coordinates.latitude, coordinates.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-white text-sm hover:bg-gray-600"
              >
                <Map className="w-4 h-4" />
                View Map
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={getDirectionsUrl(coordinates.latitude, coordinates.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-500"
              >
                <Navigation className="w-4 h-4" />
                Directions
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Save location */}
            {showSavedLocations && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  placeholder="Location name (optional)"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                />
                <button
                  onClick={handleSaveLocation}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 rounded-lg text-white text-sm hover:bg-green-500"
                >
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
