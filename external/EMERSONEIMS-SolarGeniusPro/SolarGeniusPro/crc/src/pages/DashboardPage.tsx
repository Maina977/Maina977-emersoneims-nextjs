import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSolarStore } from '../services/store';
import { core, site as siteApi } from '../services/api';

// True app dashboard.
// 1. Loads any saved Project from localStorage on mount.
// 2. Address bar -> /api/geocode -> /api/nasa/solar -> /api/weather -> /api/solar/roof-autofill
//    Everything stored back into the Project so other pages see it.
// 3. Live KPI cards driven by the shared store.

const Container = styled.div`
  background: #0A0E27;
  padding: 2rem;
  @media (max-width: 768px) { padding: 1rem; }
`;

const Title = styled.h2`
  margin: 0 0 0.5rem;
  color: #00D9FF;
  font-size: clamp(1.5rem, 5vw, 2rem);
`;

const Sub = styled.p`
  margin: 0 0 1.5rem;
  color: rgba(230, 241, 255, 0.55);
  font-size: 0.85rem;
`;

const AddressCard = styled.div`
  background: rgba(42, 48, 80, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 2rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 220px;
  padding: 0.7rem 0.85rem;
  background: rgba(10, 14, 39, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  &:focus { outline: none; border-color: #00D9FF; }
`;

const Button = styled.button<{ disabled?: boolean }>`
  padding: 0.7rem 1.1rem;
  background: ${(p) =>
    p.disabled
      ? 'rgba(0, 217, 255, 0.25)'
      : 'linear-gradient(135deg, #00D9FF, #0099CC)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
`;

const Spinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: -2px;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const Suggest = styled.div`
  margin-top: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SuggestItem = styled.button`
  text-align: left;
  background: rgba(10, 14, 39, 0.7);
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 6px;
  color: white;
  padding: 0.5rem 0.7rem;
  font-size: 0.82rem;
  cursor: pointer;
  &:hover { border-color: #00D9FF; }
`;

const Banner = styled.div<{ $kind: 'info' | 'error' | 'ok' | 'warn' }>`
  margin-top: 0.8rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid
    ${(p) =>
      p.$kind === 'error'
        ? 'rgba(255, 77, 109, 0.5)'
        : p.$kind === 'ok'
        ? 'rgba(0, 255, 136, 0.5)'
        : p.$kind === 'warn'
        ? 'rgba(255, 184, 0, 0.5)'
        : 'rgba(0, 217, 255, 0.5)'};
  background: ${(p) =>
    p.$kind === 'error'
      ? 'rgba(255, 77, 109, 0.12)'
      : p.$kind === 'ok'
      ? 'rgba(0, 255, 136, 0.10)'
      : p.$kind === 'warn'
      ? 'rgba(255, 184, 0, 0.10)'
      : 'rgba(0, 217, 255, 0.10)'};
  color: ${(p) =>
    p.$kind === 'error'
      ? '#FF4D6D'
      : p.$kind === 'ok'
      ? '#00FF88'
      : p.$kind === 'warn'
      ? '#FFB800'
      : '#00D9FF'};
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Kpi = styled(motion.div)`
  background: rgba(42, 48, 80, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
`;

const KpiVal = styled.div`
  font-size: clamp(1.4rem, 4vw, 2.2rem);
  font-weight: 900;
  color: #00D9FF;
`;

const KpiLab = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
`;

const SmallProvenance = styled.div`
  margin-top: 0.5rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.45);
  font-family: 'JetBrains Mono', monospace;
`;

interface Hit {
  lat: number;
  lon: number;
  displayName: string;
}

export default function DashboardPage() {
  const { metrics, site, updateSite, loadProject, saveProject } = useSolarStore();

  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [loadingSite, setLoadingSite] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Restore the last project on first mount.
  useEffect(() => { loadProject(); }, [loadProject]);

  async function geocode() {
    if (!query.trim()) return;
    setErr(null);
    setHits(null);
    setLoadingGeo(true);
    try {
      const r: any = await siteApi.geocode(query.trim());
      if (!r?.success) throw new Error(r?.error || 'Geocoding failed');
      const arr: Hit[] = r.data || [];
      if (arr.length === 0) {
        setErr('No matches. Try a more specific address (city + country).');
      } else {
        setHits(arr);
      }
    } catch (e: any) {
      setErr(e?.message || 'Geocoding failed.');
    } finally {
      setLoadingGeo(false);
    }
  }

  async function chooseHit(h: Hit) {
    setHits(null);
    setErr(null);
    setInfo(null);
    setLoadingSite(true);
    updateSite({ lat: h.lat, lon: h.lon, displayName: h.displayName });

    try {
      // Run NASA POWER, weather and roof autofill in parallel.
      const [nasaR, weatherR, roofR] = await Promise.all([
        core.nasa(h.lat, h.lon).catch((e) => ({ error: e?.message })),
        core.weather(h.lat, h.lon).catch((e) => ({ error: e?.message })),
        siteApi.roofAutofill({ lat: h.lat, lon: h.lon, searchRadiusM: 60 }).catch((e) => ({ error: e?.message }))
      ]);

      // NASA POWER returns big nested JSON; pull a regional avg if possible.
      let irrad: number | null = null;
      const nasaData = (nasaR as any)?.data?.properties?.parameter?.ALLSKY_SFC_SW_DWN;
      if (nasaData) {
        const vals: number[] = Object.values(nasaData).filter((v: any) => typeof v === 'number' && v > 0) as number[];
        if (vals.length) irrad = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
      }
      // Some servers return the simplified shape with peakSunHours.
      if (irrad == null && (nasaR as any)?.data?.peakSunHours) {
        irrad = (nasaR as any).data.peakSunHours;
      }

      let temp: number | null = null;
      const w: any = (weatherR as any)?.data;
      if (w && typeof w.temp === 'number') temp = w.temp;

      let roofArea: number | null = null;
      let roofPerim: number | null = null;
      let roofAz: number | null = null;
      let roofProvenance = '';
      const rd: any = (roofR as any)?.data;
      if (rd) {
        roofArea = rd.areaM2 ?? rd.roofAreaM2 ?? null;
        roofPerim = rd.perimeterM ?? null;
        roofAz = rd.suggestedArrayAzimuthDeg ?? rd.azimuthDeg ?? null;
        const prov = rd.provenance;
        roofProvenance = typeof prov === 'string'
          ? prov
          : (prov?.source || prov?.label || prov?.dataset || 'OSM Overpass building footprint');
      }

      updateSite({
        irradianceKwhPerM2Day: irrad,
        temperatureC: temp,
        roofAreaM2: roofArea,
        roofPerimeterM: roofPerim,
        roofAzimuthDeg: roofAz,
        roofPitchDeg: null,
        roofProvenance
      });
      saveProject();
      setInfo(
        '✓ Site assessed: ' +
          (irrad != null ? `${irrad} kWh/m²/day, ` : '') +
          (temp != null ? `${temp}°C, ` : '') +
          (roofArea != null ? `${roofArea} m² roof.` : 'roof footprint unavailable.')
      );
    } catch (e: any) {
      setErr(e?.message || 'Site assessment failed.');
    } finally {
      setLoadingSite(false);
    }
  }

  const hasSystem = metrics.systemSizeKw > 0;
  const hasSite = site.lat != null && site.lon != null;

  return (
    <Container>
      <Title>Site & System Dashboard</Title>
      <Sub>
        Type any address (e.g. <i>Industrial Area, Nairobi</i>) and we'll fetch real
        irradiance from NASA POWER, current weather from Open-Meteo and your roof
        footprint from OpenStreetMap. No fabricated data.
      </Sub>

      <AddressCard>
        <Row>
          <Input
            placeholder="Address — e.g. Westlands, Nairobi, Kenya"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') geocode(); }}
          />
          <Button onClick={geocode} disabled={loadingGeo || !query.trim()}>
            {loadingGeo ? <><Spinner /> Searching…</> : 'Find site'}
          </Button>
        </Row>

        {hits && (
          <Suggest>
            {hits.map((h, i) => (
              <SuggestItem key={i} onClick={() => chooseHit(h)}>
                📍 {h.displayName} <span style={{ opacity: 0.5 }}>· {h.lat.toFixed(4)}, {h.lon.toFixed(4)}</span>
              </SuggestItem>
            ))}
          </Suggest>
        )}

        {loadingSite && (
          <Banner $kind="info"><Spinner /> Assessing site (NASA POWER + Open-Meteo + OSM)…</Banner>
        )}
        {info && <Banner $kind="ok">{info}</Banner>}
        {err && <Banner $kind="error">⚠ {err}</Banner>}

        {hasSite && !loadingSite && (
          <SmallProvenance>
            Selected: {site.displayName} · {site.lat?.toFixed(4)}, {site.lon?.toFixed(4)}
            {site.roofProvenance && ` · roof: ${site.roofProvenance}`}
          </SmallProvenance>
        )}
      </AddressCard>

      <KpiGrid>
        <Kpi initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <KpiVal>{metrics.systemSizeKw || '—'}</KpiVal>
          <KpiLab>System size (kW)</KpiLab>
        </Kpi>
        <Kpi initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <KpiVal>{metrics.panelCount || '—'}</KpiVal>
          <KpiLab>Panels</KpiLab>
        </Kpi>
        <Kpi initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <KpiVal>{metrics.annualProduction || '—'}</KpiVal>
          <KpiLab>Annual yield (kWh)</KpiLab>
        </Kpi>
        <Kpi initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <KpiVal>{metrics.paybackPeriods || '—'}</KpiVal>
          <KpiLab>Payback (yrs)</KpiLab>
        </Kpi>
        <Kpi initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <KpiVal>{site.irradianceKwhPerM2Day ?? '—'}</KpiVal>
          <KpiLab>Irradiance (kWh/m²/day)</KpiLab>
        </Kpi>
        <Kpi initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <KpiVal>{site.roofAreaM2 ?? '—'}</KpiVal>
          <KpiLab>Roof footprint (m²)</KpiLab>
        </Kpi>
        <Kpi initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <KpiVal>{site.temperatureC ?? '—'}</KpiVal>
          <KpiLab>Air temp (°C)</KpiLab>
        </Kpi>
        <Kpi initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <KpiVal>{Math.round(metrics.carbonOffsetKg || 0)}</KpiVal>
          <KpiLab>CO₂ saved/yr (kg)</KpiLab>
        </Kpi>
      </KpiGrid>

      {!hasSystem && (
        <Banner $kind="warn">
          ⚠ Open <b>Sizing & Quoting → Solar Sizer</b> to design the system. The
          dashboard updates the moment the calculator runs.
        </Banner>
      )}
      {hasSystem && !hasSite && (
        <Banner $kind="info">
          System designed. Add an address above to also pull real irradiance and roof
          area, then export a fully populated proposal in <b>Report</b>.
        </Banner>
      )}
      {hasSystem && hasSite && (
        <Banner $kind="ok">
          ✓ Project is fully populated. You can now generate the 11-page proposal in{' '}
          <b>Report</b> or sanity-check pricing in <b>Quote Check</b>.
        </Banner>
      )}
    </Container>
  );
}
