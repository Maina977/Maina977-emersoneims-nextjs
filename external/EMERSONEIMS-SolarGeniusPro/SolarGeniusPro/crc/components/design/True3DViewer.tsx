// MODULE 8: TRUE 3D VIEWER — real OSM building polygon + real sun position
// Uses Nominatim for geocoding the address, /api/site/buildings to fetch the
// actual nearest building footprint (and neighbours), and the project's
// Solar Position Algorithm to direct the sun light correctly.
// No fabricated geometry, no auto-rotating fake sun.

import React, { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { calculateSolarPosition } from '../../core/simulation/shadingEngine';

interface Viewer3DProps {
  panels: Array<{
    id: string;
    x: number;
    y: number;
    z: number;
    wattage: number;
    count: number;
    orientation: string;
  }>;
  roofPitch: number;
  address: string;
}

interface BuildingGeo {
  id: number;
  heightM: number;
  heightSource: string;
  ring: Array<{ x: number; y: number }>;
  centerXY: { x: number; y: number };
  tags: { name?: string | null; building?: string };
}

interface SiteData {
  lat: number;
  lon: number;
  resolvedAddress: string;
  buildings: BuildingGeo[];
  primary: BuildingGeo | null;
  loading: boolean;
  error: string | null;
  provenance: string;
}

function buildingMesh(b: BuildingGeo, color: string, isPrimary: boolean): JSX.Element {
  const shape = new THREE.Shape();
  b.ring.forEach((p, i) => {
    if (i === 0) shape.moveTo(p.x, p.y);
    else shape.lineTo(p.x, p.y);
  });
  const geom = new THREE.ExtrudeGeometry(shape, { depth: b.heightM, bevelEnabled: false });
  // ExtrudeGeometry extrudes along +Z; rotate so extrusion becomes vertical (+Y)
  geom.rotateX(-Math.PI / 2);
  return (
    <mesh key={b.id} geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={0.85}
        metalness={0.05}
        opacity={isPrimary ? 1 : 0.85}
        transparent={!isPrimary}
      />
    </mesh>
  );
}

// Convert sun (altitude, azimuth) to a Three.js directional-light position.
// azimuth: 0 = north, 90 = east, 180 = south, 270 = west (degrees)
// scene coords: Y up, +X east, -Z north.
function sunToVector(altitudeDeg: number, azimuthDeg: number, distance = 60): [number, number, number] {
  const altRad = (altitudeDeg * Math.PI) / 180;
  const azRad = (azimuthDeg * Math.PI) / 180;
  const horiz = Math.cos(altRad);
  const x = distance * horiz * Math.sin(azRad);
  const z = -distance * horiz * Math.cos(azRad);
  const y = distance * Math.sin(altRad);
  return [x, Math.max(y, 0.5), z];
}

const Lighting: React.FC<{ sunPos: [number, number, number]; intensity: number }> = ({ sunPos, intensity }) => (
  <>
    <directionalLight position={sunPos} intensity={intensity} castShadow shadow-mapSize={[2048, 2048]}>
      <orthographicCamera attach="shadow-camera" args={[-50, 50, 50, -50, 0.1, 200]} />
    </directionalLight>
    <ambientLight intensity={0.35} />
    <hemisphereLight args={['#cfe9ff', '#3a4a2a', 0.45]} />
  </>
);

const Ground: React.FC = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
    <planeGeometry args={[200, 200]} />
    <meshStandardMaterial color="#3a4a2a" roughness={1} />
  </mesh>
);

const PanelArray: React.FC<{ building: BuildingGeo; panelCount: number; tiltDeg: number }> = ({ building, panelCount, tiltDeg }) => {
  if (!panelCount) return null;
  const xs = building.ring.map((p) => p.x);
  const ys = building.ring.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = Math.max(maxX - minX, 1);
  const panelW = 2, panelD = 1, gap = 0.4;
  const cols = Math.max(1, Math.floor((w - gap) / (panelW + gap)));
  const rows = Math.max(1, Math.ceil(panelCount / cols));
  const panels: JSX.Element[] = [];
  let placed = 0;
  for (let r = 0; r < rows && placed < panelCount; r++) {
    for (let c = 0; c < cols && placed < panelCount; c++) {
      const x = minX + gap + c * (panelW + gap) + panelW / 2;
      const z = -(minY + gap + r * (panelD + gap) + panelD / 2);
      panels.push(
        <mesh key={`p-${placed}`} position={[x, building.heightM + 0.05, z]} rotation={[-(tiltDeg * Math.PI) / 180, 0, 0]} castShadow>
          <boxGeometry args={[panelW, 0.04, panelD]} />
          <meshStandardMaterial color="#13315c" metalness={0.7} roughness={0.2} emissive="#06182f" emissiveIntensity={0.2} />
        </mesh>
      );
      placed++;
    }
  }
  return <>{panels}</>;
};

export const True3DViewer: React.FC<Viewer3DProps> = ({ panels, roofPitch, address }) => {
  const [site, setSite] = useState<SiteData>({
    lat: 0, lon: 0, resolvedAddress: address, buildings: [], primary: null,
    loading: true, error: null, provenance: ''
  });
  const [hour, setHour] = useState(12);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSite((s) => ({ ...s, loading: true, error: null }));
      try {
        const geo = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (!geo.ok) throw new Error(`Nominatim HTTP ${geo.status}`);
        const arr = await geo.json();
        if (!arr.length) throw new Error(`No geocode result for "${address}"`);
        const lat = parseFloat(arr[0].lat);
        const lon = parseFloat(arr[0].lon);
        const resolvedAddress = arr[0].display_name;
        const r = await fetch(`/api/site/buildings?lat=${lat}&lon=${lon}&radiusMeters=80`);
        if (!r.ok) throw new Error(`Buildings HTTP ${r.status}`);
        const j = await r.json();
        if (!j.success) throw new Error(j.error || 'Failed to load buildings');
        const buildings: BuildingGeo[] = j.data.buildings || [];
        const primary = buildings.length
          ? buildings.reduce((best, b) =>
              Math.hypot(b.centerXY.x, b.centerXY.y) < Math.hypot(best.centerXY.x, best.centerXY.y) ? b : best
            )
          : null;
        if (cancelled) return;
        setSite({
          lat, lon, resolvedAddress, buildings, primary,
          loading: false, error: null,
          provenance: `${j.data.provenance.source} — ${j.data.count} buildings within 80 m`
        });
      } catch (e: any) {
        if (!cancelled) setSite((s) => ({ ...s, loading: false, error: e.message }));
      }
    })();
    return () => { cancelled = true; };
  }, [address]);

  const sun = useMemo(() => {
    if (!site.lat) return { altitudeDeg: 45, azimuthDeg: 180 };
    const sp = calculateSolarPosition(site.lat, site.lon, today, hour, 0);
    return {
      altitudeDeg: (sp.altitude * 180) / Math.PI,
      azimuthDeg: (sp.azimuth * 180) / Math.PI
    };
  }, [site.lat, site.lon, hour, today]);

  const sunPos = sunToVector(sun.altitudeDeg, sun.azimuthDeg);
  const sunIntensity = Math.max(0, Math.sin((sun.altitudeDeg * Math.PI) / 180)) * 1.4 + 0.1;
  const isNight = sun.altitudeDeg < 0;

  return (
    <div className="viewer-3d-container">
      <div className="viewer-header">
        <h2>🏡 True 3D Viewer <span style={{ fontSize: '0.7em', color: '#0fc' }}>(real OSM footprint + real sun)</span></h2>
        <p>{site.resolvedAddress}</p>
        {site.error && <div style={{ color: '#f66' }}>⚠️ {site.error}</div>}
        {site.loading && <div style={{ color: '#0fc' }}>Loading real OSM building data…</div>}
      </div>

      <div className="viewer-controls">
        <div className="control-group">
          <label>Sun position (today, real SPA):</label>
          <input
            type="range" min={5} max={19} step={0.5} value={hour}
            onChange={(e) => setHour(parseFloat(e.target.value))}
            className="time-slider"
          />
          <span>{String(Math.floor(hour)).padStart(2, '0')}:{String(Math.round((hour % 1) * 60)).padStart(2, '0')}</span>
          &nbsp;|&nbsp;altitude {sun.altitudeDeg.toFixed(1)}°, azimuth {sun.azimuthDeg.toFixed(1)}°
          {isNight && <span style={{ color: '#f93', marginLeft: 8 }}>(below horizon)</span>}
        </div>
      </div>

      <div className="canvas-container">
        <Canvas
          gl={{ antialias: true }}
          shadows
          style={{ width: '100%', height: '600px', background: isNight ? '#0a0e1a' : '#aacde6' }}
        >
          <PerspectiveCamera makeDefault position={[40, 30, 40]} fov={45} />
          <OrbitControls enablePan enableZoom enableRotate />
          <Lighting sunPos={sunPos} intensity={sunIntensity} />
          <Ground />
          {site.buildings.filter((b) => b !== site.primary).map((b) => buildingMesh(b, '#7a8290', false))}
          {site.primary && buildingMesh(site.primary, '#c2a585', true)}
          {site.primary && <PanelArray building={site.primary} panelCount={panels.length || 0} tiltDeg={roofPitch} />}
          {/* North marker */}
          <mesh position={[0, 0.05, -25]}>
            <coneGeometry args={[0.6, 2, 8]} />
            <meshBasicMaterial color="#1e88e5" />
          </mesh>
        </Canvas>
      </div>

      <div className="viewer-stats">
        <div className="stat-card">
          <h4>📊 Layout</h4>
          <p>Panels: {panels.length}</p>
          <p>Capacity: {(panels.reduce((s, p) => s + (p.wattage || 0) * (p.count || 1), 0) / 1000).toFixed(2)} kWp</p>
        </div>
        <div className="stat-card">
          <h4>🏠 Primary building</h4>
          {site.primary ? (
            <>
              <p>Height: {site.primary.heightM} m ({site.primary.heightSource})</p>
              <p>Roof pitch input: {roofPitch}°</p>
              <p>OSM id: {site.primary.id}</p>
            </>
          ) : <p>Not detected at this address</p>}
        </div>
        <div className="stat-card">
          <h4>☀️ Sun (real SPA)</h4>
          <p>Altitude: {sun.altitudeDeg.toFixed(1)}°</p>
          <p>Azimuth: {sun.azimuthDeg.toFixed(1)}° (0=N, 180=S)</p>
        </div>
      </div>

      <div className="viewer-tips" style={{ background: '#0f1432', padding: '0.75rem', borderRadius: 8, marginTop: '1rem' }}>
        <h4>📚 Data provenance</h4>
        <ul>
          <li>Geocoding: OSM Nominatim</li>
          <li>Building footprints + heights: {site.provenance || 'OSM Overpass'}</li>
          <li>Sun position: NOAA Solar Position Algorithm (in-house implementation)</li>
        </ul>
        <p style={{ fontSize: '0.85em', opacity: 0.7 }}>
          Building heights without explicit OSM tags use a 6 m default (clearly labelled).
          For survey-grade accuracy use drone photogrammetry or LiDAR.
        </p>
      </div>
    </div>
  );
};

export default True3DViewer;
// TRUE 3D VIEWER — real sun position via SPA + auto-geocoded site
// + extruded OSM building footprint when available. No more fake light
// rotation; the directional light now tracks the real solar azimuth /
// altitude for the chosen address, date and time.

