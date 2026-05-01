import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { Advanced3DVisualizationMap } from '../../components/calculator/Advanced3DVisualizationMap';
import { useSolarStore } from '../services/store';

const Wrap = styled.div`
  background: #0A0E27;
  min-height: 100vh;
  padding: 1rem;
`;
const Banner = styled.div`
  background: rgba(42,48,80,0.7);
  border: 1px dashed rgba(0,217,255,0.4);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: rgba(255,255,255,0.8);
  margin: 2rem auto;
  max-width: 720px;
`;
const Status = styled.div`
  background: rgba(0,217,255,0.08);
  border: 1px solid rgba(0,217,255,0.25);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  color: #E6F1FF;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  margin-bottom: 0.75rem;
`;
const Btn = styled.button`
  margin-top: 1rem;
  background: linear-gradient(135deg,#00D9FF,#0099CC);
  color: #fff;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

const Global3DPage: React.FC = () => {
  const site = useSolarStore(s => s.site);
  const metrics = useSolarStore(s => s.metrics);
  const design = useSolarStore(s => s.design);
  const loadProject = useSolarStore(s => s.loadProject);
  const router = useRouter();

  useEffect(() => { loadProject(); }, [loadProject]);

  const ready = site.lat != null && site.lon != null;

  // Estimate roof rectangle from real area; fallback square if perimeter unknown.
  const roof = useMemo(() => {
    if (!ready) return null;
    const area = site.roofAreaM2 ?? 60;
    const half = Math.sqrt(area) / 2;
    return {
      latitude: site.lat as number,
      longitude: site.lon as number,
      area,
      tilt: design.tiltDeg || 10,
      azimuth: site.roofAzimuthDeg ?? 180,
      roofType: 'pitched' as const,
      material: 'metal' as const,
      vertices: [
        new THREE.Vector3(-half, 0, -half),
        new THREE.Vector3( half, 0, -half),
        new THREE.Vector3( half, 0,  half),
        new THREE.Vector3(-half, 0,  half),
      ],
    };
  }, [ready, site.lat, site.lon, site.roofAreaM2, site.roofAzimuthDeg, design.tiltDeg]);

  if (!ready || !roof) {
    return (
      <Wrap>
        <Banner>
          <h2 style={{ color: '#00D9FF', marginTop: 0 }}>Global 3D Map</h2>
          <p>Geo-positioned 3D visualisation needs an assessed site. Open Mission Control and enter the address.</p>
          <Btn onClick={() => router.push('/solar-genius-pro/solar-dashboard')}>Go to Mission Control</Btn>
        </Banner>
      </Wrap>
    );
  }

  const location = {
    latitude: site.lat as number,
    longitude: site.lon as number,
    altitude: site.elevationM ?? 1670,
    zoom: 17,
    name: site.displayName || 'Project site',
  };

  return (
    <Wrap style={{ height: 'calc(100vh - 80px)' }}>
      <Status>
        {location.name} · roof {roof.area.toFixed(0)} m² · tilt {roof.tilt}° · azimuth {roof.azimuth}° · system {metrics.systemSizeKw.toFixed(2)} kW
      </Status>
      <div style={{ height: 'calc(100% - 50px)' }}>
        <Advanced3DVisualizationMap location={location} roof={roof} systemSizeKW={metrics.systemSizeKw || 6.8} />
      </div>
    </Wrap>
  );
};

export default Global3DPage;
