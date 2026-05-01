'use client';

/**
 * AQUASCAN PRO - PHOTO UPLOADER WITH LOCATION DETECTION
 *
 * Features:
 * 1. EXIF GPS extraction
 * 2. Water body detection
 * 3. Auto site analysis trigger
 * 4. Manual coordinate fallback
 */

import React, { useState, useRef, useCallback } from 'react';

interface LocationData {
  latitude: number;
  longitude: number;
  source: string;
  address?: string;
}

interface WaterBody {
  name: string;
  type: string;
  distance: number;
}

interface PhotoUploaderProps {
  onLocationDetected: (location: LocationData | null) => void;
  onAnalysisComplete?: (analysis: any) => void;
  isAnalyzing?: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onLocationDetected,
  onAnalysisComplete,
  isAnalyzing
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [locationResult, setLocationResult] = useState<{
    detected: boolean;
    coordinates: { latitude: number; longitude: number } | null;
    source: string;
    address: string | null;
    waterBodies: WaterBody[];
    terrainFeatures: string[];
    confidence: number;
    message?: string;
    instructions?: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeImage = useCallback(async (base64Image: string) => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/borehole/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();

      if (data.success) {
        setLocationResult({
          detected: data.data.locationDetected,
          coordinates: data.data.coordinates,
          source: data.data.locationSource,
          address: data.data.address,
          waterBodies: data.data.nearbyWaterBodies || [],
          terrainFeatures: data.data.terrainFeatures || [],
          confidence: data.data.confidence || 0,
          message: data.data.message,
          instructions: data.data.instructions
        });

        if (data.data.locationDetected && data.data.coordinates) {
          onLocationDetected({
            latitude: data.data.coordinates.latitude,
            longitude: data.data.coordinates.longitude,
            source: data.data.locationSource,
            address: data.data.address
          });

          if (data.data.siteAnalysis && onAnalysisComplete) {
            onAnalysisComplete(data.data.siteAnalysis);
          }
        } else {
          onLocationDetected(null);
        }
      } else {
        setError(data.error || 'Analysis failed');
        onLocationDetected(null);
      }
    } catch (e) {
      setError('Failed to analyze image');
      onLocationDetected(null);
    } finally {
      setProcessing(false);
    }
  }, [onLocationDetected, onAnalysisComplete]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setLocationResult(null);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        analyzeImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setProcessing(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // Call API with manual coordinates
          try {
            const response = await fetch('/api/borehole/analyze-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ manualCoordinates: coords })
            });
            const data = await response.json();

            if (data.success && data.data.locationDetected) {
              setLocationResult({
                detected: true,
                coordinates: coords,
                source: 'device_gps',
                address: data.data.address,
                waterBodies: data.data.nearbyWaterBodies || [],
                terrainFeatures: data.data.terrainFeatures || [],
                confidence: 100
              });

              onLocationDetected({
                latitude: coords.latitude,
                longitude: coords.longitude,
                source: 'device_gps',
                address: data.data.address
              });

              if (data.data.siteAnalysis && onAnalysisComplete) {
                onAnalysisComplete(data.data.siteAnalysis);
              }
            }
          } catch (e) {
            setError('Failed to get location data');
          }
          setProcessing(false);
        },
        (err) => {
          setError('Location access denied');
          setProcessing(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation not supported');
    }
  };

  const reset = () => {
    setPreview(null);
    setLocationResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Upload Area */}
      {!preview && !locationResult?.detected && (
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #3b82f6',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)',
              transition: 'all 0.3s ease'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={processing || isAnalyzing}
            />
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📷</div>
            <p style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0' }}>
              Upload Site Photo
            </p>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              GPS location will be auto-detected from photo
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={handleGetLocation}
              disabled={processing}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              📍 Use My Current Location
            </button>
          </div>
        </div>
      )}

      {/* Processing */}
      {processing && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)',
          borderRadius: '16px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #1e40af',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#60a5fa', fontSize: '16px', margin: 0 }}>
            Analyzing image & detecting location...
          </p>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
            Searching for nearby water bodies
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Preview with Results */}
      {preview && !processing && (
        <div>
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
            <img
              src={preview}
              alt="Site"
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
            />
            {locationResult?.detected && (
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(16, 185, 129, 0.95)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                ✓ GPS Location Detected
              </div>
            )}
          </div>
          <button
            onClick={reset}
            style={{
              marginTop: '12px',
              padding: '10px 20px',
              background: '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Change Image
          </button>
        </div>
      )}

      {/* Location Results */}
      {locationResult && (
        <div style={{ marginTop: '20px' }}>
          {locationResult.detected ? (
            <div style={{
              background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #10b981'
            }}>
              <h3 style={{ color: '#34d399', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✓ Location Detected ({locationResult.source.replace('_', ' ')})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ color: '#6ee7b7', fontSize: '12px', margin: '0 0 4px 0' }}>Latitude</p>
                  <p style={{ color: 'white', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                    {locationResult.coordinates?.latitude.toFixed(6)}°
                  </p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                  <p style={{ color: '#6ee7b7', fontSize: '12px', margin: '0 0 4px 0' }}>Longitude</p>
                  <p style={{ color: 'white', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                    {locationResult.coordinates?.longitude.toFixed(6)}°
                  </p>
                </div>
              </div>

              {locationResult.address && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ color: '#6ee7b7', fontSize: '12px', margin: '0 0 4px 0' }}>📍 Address</p>
                  <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>{locationResult.address}</p>
                </div>
              )}

              {/* Water Bodies */}
              {locationResult.waterBodies.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ color: '#60a5fa', margin: '0 0 12px 0' }}>💧 Nearby Water Bodies</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {locationResult.waterBodies.slice(0, 5).map((wb, i) => (
                      <div key={i} style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: 'white' }}>
                          {wb.type === 'spring' ? '🌊' : wb.type === 'water_well' ? '🔵' : wb.type === 'river' ? '🏞️' : '💧'}
                          {' '}{wb.name} ({wb.type})
                        </span>
                        <span style={{
                          color: wb.distance < 1 ? '#34d399' : wb.distance < 3 ? '#fbbf24' : '#94a3b8',
                          fontWeight: 600
                        }}>
                          {wb.distance.toFixed(1)} km
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terrain Features */}
              {locationResult.terrainFeatures.length > 0 && (
                <div>
                  <h4 style={{ color: '#a78bfa', margin: '0 0 12px 0' }}>🏔️ Terrain Indicators</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {locationResult.terrainFeatures.map((tf, i) => (
                      <span key={i} style={{
                        background: 'rgba(139, 92, 246, 0.3)',
                        color: '#c4b5fd',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '13px'
                      }}>
                        {tf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                marginTop: '16px',
                padding: '10px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#34d399', margin: 0, fontSize: '14px' }}>
                  ✓ Full site analysis running... Results will appear below.
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #ef4444'
            }}>
              <h3 style={{ color: '#fca5a5', margin: '0 0 12px 0' }}>
                ⚠️ No Location Found
              </h3>
              <p style={{ color: '#fecaca', margin: '0 0 16px 0' }}>
                {locationResult.message}
              </p>
              {locationResult.instructions && (
                <ul style={{ color: '#fcd34d', margin: 0, paddingLeft: '20px' }}>
                  {locationResult.instructions.map((inst, i) => (
                    <li key={i} style={{ marginBottom: '8px' }}>{inst}</li>
                  ))}
                </ul>
              )}
              <button
                onClick={handleGetLocation}
                style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                📍 Use My Current Location Instead
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          background: '#7f1d1d',
          borderRadius: '12px',
          color: '#fca5a5'
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
