import { useState, useEffect, useCallback } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  timestamp: number;
}

interface LocationError {
  code: number;
  message: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'SolarGenius Pro needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK'
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = useCallback(async (): Promise<Location | null> => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setError({ code: 1, message: 'Location permission denied' });
      return null;
    }

    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            timestamp: position.timestamp
          };
          setLocation(newLocation);
          setError(null);
          resolve(newLocation);
        },
        (err) => {
          setError({ code: err.code, message: err.message });
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  }, []);

  const startTracking = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot track location without permission');
      return false;
    }

    if (watchId !== null) {
      Geolocation.stopObserving(watchId);
    }

    const id = Geolocation.watchPosition(
      (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          timestamp: position.timestamp
        };
        setLocation(newLocation);
        setError(null);
      },
      (err) => {
        setError({ code: err.code, message: err.message });
      },
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
    );

    setWatchId(id);
    setIsTracking(true);
    return true;
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      Geolocation.stopObserving(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  }, [watchId]);

  const calculateDistance = useCallback((
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }, []);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        Geolocation.stopObserving(watchId);
      }
    };
  }, [watchId]);

  return {
    location,
    error,
    isTracking,
    getCurrentLocation,
    startTracking,
    stopTracking,
    calculateDistance,
    hasLocation: location !== null
  };
};