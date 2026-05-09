'use client';

import React, { useState } from 'react';

interface CoordinatePickerProps {
  onCoordinatesSelected: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export const CoordinatePicker: React.FC<CoordinatePickerProps> = ({ 
  onCoordinatesSelected, 
  initialLat = -1.286389, 
  initialLng = 36.817223 
}) => {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCoordinatesSelected(lat, lng);
    setIsEditing(false);
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        onCoordinatesSelected(position.coords.latitude, position.coords.longitude);
      });
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0 }}>📍 Site Coordinates</h4>
        <div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{ marginRight: '8px', padding: '4px 12px', cursor: 'pointer' }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={getCurrentLocation} style={{ padding: '4px 12px', cursor: 'pointer' }}>
            Use My Location
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Latitude:</label>
            <input
              type="number"
              step="0.000001"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Longitude:</label>
            <input
              type="number"
              step="0.000001"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Apply Coordinates
          </button>
        </form>
      ) : (
        <div>
          <div>Latitude: {lat.toFixed(6)}°</div>
          <div>Longitude: {lng.toFixed(6)}°</div>
        </div>
      )}
    </div>
  );
};