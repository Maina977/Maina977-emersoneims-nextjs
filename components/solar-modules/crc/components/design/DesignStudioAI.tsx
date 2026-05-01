// DESIGN STUDIO AI — real Leaflet map + real OSM satellite tiles
// + real geocoding via Nominatim + real OSM building obstacles +
// real PVWatts production. Panels are placed at true (lat, lon) and
// their shading comes from the real /api/site/obstacles endpoint.

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateShadingHeatmap, Obstacle } from '../../core/simulation/shadingEngine';
import { RoofAnalyzer } from './RoofAnalyzer';
import './DesignStudioAI.css';

// Fix Leaflet default marker icon paths in Vite bundles
// @ts-ignore
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Panel {
  id: string;
  lat: number;
  lon: number;
  wattage: number;
  shadingPercentage: number;
}

interface SiteState {
  address: string;
  lat: number;
  lon: number;
  zoom: number;
  roofPitch: number;
  azimuthDeg: number;
  panelWattage: number;
  panels: Panel[];
  obstacles: Obstacle[];
  obstaclesGeo: Array<{ type: string; lat: number; lon: number; heightM: number; source: string }>;
  shadingLosses: number;
  pvwattsAnnualKwh: number | null;
  pvwattsSource: string;
  loadingObstacles: boolean;
  loadingPV: boolean;
  errorMsg: string | null;
}

const DEFAULT_STATE: SiteState = {
  address: 'Nairobi, Kenya',
  lat: -1.2865,
  lon: 36.8172,
  zoom: 19,
  roofPitch: 20,
  azimuthDeg: 180,
  panelWattage: 485,
  panels: [],
  obstacles: [],
  obstaclesGeo: [],
  shadingLosses: 0,
  pvwattsAnnualKwh: null,
  pvwattsSource: '',
  loadingObstacles: false,
  loadingPV: false,
  errorMsg: null,
};

function ClickToAdd({ onClick }: { onClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) { onClick(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

export const DesignStudioAI: React.FC<{ address: string; roofImage?: File }> = ({ address, roofImage }) => {
  const [state, setState] = useState<SiteState>({ ...DEFAULT_STATE, address });
  const [searchAddress, setSearchAddress] = useState(address);
  const [selectedTime, setSelectedTime] = useState<'08:00' | '12:00' | '16:00'>('12:00');

  // ---- Geocode (real Nominatim, free OSM service) ----
  const geocode = useCallback(async (q: string) => {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!r.ok) throw new Error(`Nominatim HTTP ${r.status}`);
      const arr = await r.json();
      if (!arr.length) throw new Error(`No match for "${q}"`);
      const lat = parseFloat(arr[0].lat);
      const lon = parseFloat(arr[0].lon);
      setState((s) => ({ ...s, lat, lon, address: arr[0].display_name, errorMsg: null }));
    } catch (e: any) {
      setState((s) => ({ ...s, errorMsg: e.message }));
    }
  }, []);

  // ---- Load real OSM obstacles (buildings + trees) ----
  const loadObstacles = useCallback(async (lat: number, lon: number) => {
    setState((s) => ({ ...s, loadingObstacles: true, errorMsg: null }));
    try {
      const r = await fetch(`/api/site/obstacles?lat=${lat}&lon=${lon}&radiusMeters=80`);
      if (!r.ok) throw new Error(`Obstacles HTTP ${r.status}`);
      const j = await r.json();
      if (!j.success) throw new Error(j.error || 'Failed to load obstacles');
      const R = 6371000;
      const toRad = (d: number) => (d * Math.PI) / 180;
      const cartesian: Obstacle[] = j.data.obstacles.map((o: any) => {
        const dLat = toRad(o.lat - lat);
        const dLon = toRad(o.lon - lon);
        return {
          type: o.type === 'tree' ? 'tree' : 'building',
          x: dLon * R * Math.cos(toRad(lat)),
          y: dLat * R,
          z: o.heightM,
          width: o.widthM || 8,
          depth: o.widthM || 8,
        };
      });
      setState((s) => ({ ...s, obstacles: cartesian, obstaclesGeo: j.data.obstacles, loadingObstacles: false }));
    } catch (e: any) {
      setState((s) => ({ ...s, loadingObstacles: false, errorMsg: e.message, obstacles: [], obstaclesGeo: [] }));
    }
  }, []);

  // ---- Load real PVWatts annual production ----
  const loadPV = useCallback(async (lat: number, lon: number, kw: number, az: number, tilt: number) => {
    if (kw <= 0) { setState((s) => ({ ...s, pvwattsAnnualKwh: null })); return; }
    setState((s) => ({ ...s, loadingPV: true }));
    try {
      const r = await fetch(`/api/site/pvwatts?lat=${lat}&lon=${lon}&kw=${kw.toFixed(3)}&az=${az}&tilt=${tilt}`);
      if (!r.ok) throw new Error(`PVWatts HTTP ${r.status}`);
      const j = await r.json();
      if (!j.success) throw new Error(j.error || 'PVWatts failed');
      setState((s) => ({ ...s, pvwattsAnnualKwh: j.data.annualKwh, pvwattsSource: j.data.provenance.source, loadingPV: false }));
    } catch (e: any) {
      setState((s) => ({ ...s, loadingPV: false, pvwattsAnnualKwh: null, errorMsg: e.message }));
    }
  }, []);

  // ---- Geocode initial address on mount ----
  useEffect(() => { if (address) geocode(address); }, [address, geocode]);
  useEffect(() => { loadObstacles(state.lat, state.lon); /* eslint-disable-next-line */ }, [state.lat, state.lon]);

  // ---- Recalculate shading + PVWatts whenever panels/obstacles change ----
  useEffect(() => {
    const compute = async () => {
      if (state.panels.length === 0) {
        setState((s) => ({ ...s, shadingLosses: 0 }));
        return;
      }
      // Convert geo panels to cartesian on-roof points
      const R = 6371000;
      const toRad = (d: number) => (d * Math.PI) / 180;
      const cartPanels = state.panels.map((p) => ({
        id: p.id,
        x: toRad(p.lon - state.lon) * R * Math.cos(toRad(state.lat)),
        y: toRad(p.lat - state.lat) * R,
        z: 4, // assume 4m roof
      }));
      const [hh, mm] = selectedTime.split(':').map(Number);
      const date = new Date(); date.setHours(hh, mm, 0, 0);
      const heatmap = await calculateShadingHeatmap({
        panels: cartPanels,
        latitude: state.lat,
        longitude: state.lon,
        roofPitch: state.roofPitch,
        time: selectedTime,
        date,
        obstacles: state.obstacles,
      });
      const updated = state.panels.map((p) => ({ ...p, shadingPercentage: heatmap[p.id] || 0 }));
      const avg = updated.reduce((s, p) => s + p.shadingPercentage, 0) / updated.length;
      setState((s) => ({ ...s, panels: updated, shadingLosses: avg }));
    };
    compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.obstacles.length, selectedTime, state.panels.length]);

  // ---- Real PVWatts call when system size or orientation changes ----
  useEffect(() => {
    const totalKw = state.panels.reduce((s, p) => s + p.wattage, 0) / 1000;
    if (totalKw > 0) loadPV(state.lat, state.lon, totalKw, state.azimuthDeg, state.roofPitch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.panels.length, state.azimuthDeg, state.roofPitch, state.lat, state.lon]);

  const totalCapacityKw = useMemo(
    () => state.panels.reduce((s, p) => s + p.wattage, 0) / 1000,
    [state.panels]
  );

  const handleMapClick = (lat: number, lon: number) => {
    const newPanel: Panel = {
      id: `panel-${Date.now()}-${state.panels.length}`,
      lat, lon,
      wattage: state.panelWattage,
      shadingPercentage: 0,
    };
    setState((s) => ({ ...s, panels: [...s.panels, newPanel] }));
  };

  const removePanel = (id: string) => setState((s) => ({ ...s, panels: s.panels.filter((p) => p.id !== id) }));

  const panelIcon = (shading: number) => L.divIcon({
    className: 'panel-marker',
    html: `<div style="width:16px;height:24px;background:${shading > 50 ? '#ff6b6b' : shading > 25 ? '#ffd93d' : '#51cf66'};border:1px solid #000;border-radius:2px;"></div>`,
    iconSize: [16, 24], iconAnchor: [8, 12],
  });

  return (
    <div className="design-studio-container">
      <div className="studio-header">
        <h2>🎨 Design Studio AI <span style={{ fontSize: '0.7em', color: '#0fc' }}>(real OSM + NREL PVWatts + sun geometry)</span></h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') geocode(searchAddress); }}
            placeholder="Search any address..."
            style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: 4, border: '1px solid #ccc' }}
          />
          <button onClick={() => geocode(searchAddress)} style={{ padding: '0.4rem 1rem' }}>Search</button>
        </div>
        {state.errorMsg && <div style={{ color: '#f66', marginTop: '0.5rem' }}>⚠️ {state.errorMsg}</div>}
      </div>

      {roofImage && (
        <RoofAnalyzer image={roofImage} onRoofPitchDetected={(p) => setState((s) => ({ ...s, roofPitch: p }))} />
      )}

      <div className="studio-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div style={{ height: '500px', borderRadius: 8, overflow: 'hidden' }}>
          <MapContainer
            key={`${state.lat},${state.lon}`}
            center={[state.lat, state.lon]}
            zoom={state.zoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN, GIS Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              attribution='© OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.0}
            />
            <Circle center={[state.lat, state.lon]} radius={80} pathOptions={{ color: '#0fc', weight: 1, fillOpacity: 0.05 }} />
            <ClickToAdd onClick={handleMapClick} />
            {/* Real OSM obstacles drawn on map */}
            {state.obstaclesGeo.map((o, i) => (
              <Circle
                key={`obs-${i}`}
                center={[o.lat, o.lon]}
                radius={o.type === 'tree' ? 3 : 6}
                pathOptions={{
                  color: o.type === 'tree' ? '#2d7a2d' : '#aa6633',
                  fillColor: o.type === 'tree' ? '#2d7a2d' : '#aa6633',
                  fillOpacity: 0.45,
                  weight: 1,
                }}
              >
                <Popup>{o.type} ({o.heightM} m, {o.source})</Popup>
              </Circle>
            ))}
            {/* User-placed panels at real lat/lon */}
            {state.panels.map((p) => (
              <Marker key={p.id} position={[p.lat, p.lon]} icon={panelIcon(p.shadingPercentage)}>
                <Popup>
                  {p.wattage} W panel<br />
                  Shading: {p.shadingPercentage.toFixed(1)}%<br />
                  <button onClick={() => removePanel(p.id)}>Remove</button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="control-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#0f1432', padding: '0.75rem', borderRadius: 8 }}>
            <h3 style={{ margin: 0, color: '#0fc' }}>Click the map to add panels</h3>
            <div style={{ marginTop: '0.5rem' }}>
              <label>Panel wattage:&nbsp;</label>
              <select
                value={state.panelWattage}
                onChange={(e) => setState((s) => ({ ...s, panelWattage: parseInt(e.target.value, 10) }))}
              >
                <option value={400}>400 W</option>
                <option value={485}>485 W (JA Solar)</option>
                <option value={550}>550 W (Trina)</option>
                <option value={600}>600 W (LONGi Hi-MO 7)</option>
              </select>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <label>Tilt: <strong>{state.roofPitch}°</strong></label>
              <input type="range" min={0} max={45} value={state.roofPitch}
                onChange={(e) => setState((s) => ({ ...s, roofPitch: parseInt(e.target.value, 10) }))}
                style={{ width: '100%' }} />
            </div>
            <div>
              <label>Azimuth: <strong>{state.azimuthDeg}°</strong> (180 = south)</label>
              <input type="range" min={0} max={360} value={state.azimuthDeg}
                onChange={(e) => setState((s) => ({ ...s, azimuthDeg: parseInt(e.target.value, 10) }))}
                style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ background: '#0f1432', padding: '0.75rem', borderRadius: 8 }}>
            <h4 style={{ margin: 0 }}>⏰ Shading time</h4>
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
              {(['08:00', '12:00', '16:00'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  style={{
                    flex: 1, padding: '0.4rem',
                    background: selectedTime === t ? '#0fc' : '#222',
                    color: selectedTime === t ? '#000' : '#fff',
                    border: 'none', borderRadius: 4, cursor: 'pointer'
                  }}
                >{t}</button>
              ))}
            </div>
          </div>

          <div style={{ background: '#0f1432', padding: '0.75rem', borderRadius: 8 }}>
            <h4 style={{ margin: 0 }}>📈 Live results</h4>
            <div style={{ marginTop: '0.5rem' }}>System: <strong>{totalCapacityKw.toFixed(2)} kWp</strong></div>
            <div>Panels: <strong>{state.panels.length}</strong></div>
            <div>Avg shading @ {selectedTime}: <strong>{state.shadingLosses.toFixed(1)}%</strong></div>
            <div>OSM obstacles loaded: <strong>{state.obstaclesGeo.length}</strong>{state.loadingObstacles && ' (loading…)'}</div>
            <div style={{ marginTop: '0.5rem', borderTop: '1px solid #333', paddingTop: '0.5rem' }}>
              <strong>Annual production:</strong>{' '}
              {state.loadingPV ? 'fetching NREL PVWatts…'
                : state.pvwattsAnnualKwh ? `${Math.round(state.pvwattsAnnualKwh).toLocaleString()} kWh/yr` : '—'}
              {state.pvwattsSource && (
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{state.pvwattsSource}</div>
              )}
            </div>
          </div>

          <div style={{ background: '#0f1432', padding: '0.75rem', borderRadius: 8, fontSize: '0.85rem' }}>
            <strong>Data sources</strong>
            <ul style={{ paddingLeft: '1rem', margin: '0.25rem 0' }}>
              <li>Map tiles: Esri World Imagery (free)</li>
              <li>Geocoding: OSM Nominatim</li>
              <li>Obstacles: OSM Overpass (buildings + trees)</li>
              <li>Production: NREL PVWatts v8 (NSRDB TMY)</li>
              <li>Shading: SPA solar geometry</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStudioAI;
// MODULE 7: 3D DESIGN STUDIO AI
// Drag-drop solar panels on satellite map with shading analysis
// Tech: Mapbox GL + Canvas API + Solar Geometry Engine

