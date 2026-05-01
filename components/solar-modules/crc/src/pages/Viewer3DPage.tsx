import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { True3DViewer } from '../../components/design/True3DViewer';
import { useSolarStore } from '../services/store';

/**
 * Viewer3DPage — bound to live project state. Renders panel array sized from the
 * Calculator (or Auto-Designer) over the OSM building polygon for the assessed site.
 * Falls back gracefully if the user hasn't designed a system yet.
 */

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

const Viewer3DPage: React.FC = () => {
  const site = useSolarStore(s => s.site);
  const metrics = useSolarStore(s => s.metrics);
  const design = useSolarStore(s => s.design);
  const loadProject = useSolarStore(s => s.loadProject);
  const router = useRouter();

  useEffect(() => { loadProject(); }, [loadProject]);

  const ready = metrics.panelCount > 0 && site.lat != null && site.lon != null;

  // Build panel array layout from real panel count + roof azimuth
  const panels = useMemo(() => {
    const n = metrics.panelCount;
    if (!n) return [];
    const cols = Math.ceil(Math.sqrt(n * 1.7));
    return Array.from({ length: n }, (_, i) => ({
      id: `p${i + 1}`,
      x: (i % cols) - Math.floor(cols / 2),
      y: 0,
      z: Math.floor(i / cols),
      wattage: design.panelW || 580,
      count: 1,
      orientation: 'south',
    }));
  }, [metrics.panelCount, design.panelW]);

  if (!ready) {
    return (
      <Wrap>
        <Banner>
          <h2 style={{ color: '#00D9FF', marginTop: 0 }}>True 3D Viewer</h2>
          <p>The 3D viewer renders the panel array on the actual OSM building footprint at your site.</p>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            {site.lat == null ? 'Step 1: Assess a site on Mission Control. ' : ''}
            {metrics.panelCount === 0 ? 'Step 2: Run Solar Calculator to size the array.' : ''}
          </p>
          <Btn onClick={() => router.push(site.lat == null ? '/solar-genius-pro/solar-dashboard' : '/calculator')}>
            {site.lat == null ? 'Go to Mission Control' : 'Open Calculator'}
          </Btn>
        </Banner>
      </Wrap>
    );
  }

  const address = site.displayName || `Lat ${site.lat?.toFixed(4)}, Lon ${site.lon?.toFixed(4)}`;
  const tilt = design.tiltDeg || 10;

  return (
    <Wrap style={{ height: 'calc(100vh - 80px)' }}>
      <Status>
        Site: {address} · {metrics.panelCount} × {design.panelW || 580}W panels · tilt {tilt}°
        {site.roofAzimuthDeg != null && ` · azimuth ${Math.round(site.roofAzimuthDeg)}°`}
      </Status>
      <div style={{ height: 'calc(100% - 50px)' }}>
        <True3DViewer panels={panels} roofPitch={tilt} address={address} />
      </div>
    </Wrap>
  );
};

export default Viewer3DPage;
