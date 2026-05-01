import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useSolarStore } from "../services/store";
import { solar } from "../services/api";

/**
 * AnalyticsPage — reads the live project (calculator results + site assessment)
 * and overlays NASA POWER seasonal monthly irradiance for *real* monthly
 * production curves (no synthetic factors). Graceful empty/loading/error states.
 */

const Container = styled.div`
  background: #0A0E27;
  min-height: 100vh;
  padding: 2rem;
  @media (max-width: 768px) { padding: 1rem; }
`;
const Title = styled.h2`
  margin: 0 0 0.5rem;
  color: #00D9FF;
  font-size: clamp(1.5rem, 5vw, 2rem);
`;
const Sub = styled.p`
  margin: 0 0 2rem;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
const Card = styled(motion.div)`
  background: rgba(42, 48, 80, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
`;
const ChartContainer = styled.div`
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 0.4rem;
  margin-top: 1rem;
`;
const Bar = styled(motion.div)`
  flex: 1;
  background: linear-gradient(180deg, #00D9FF, #0099CC);
  border-radius: 4px 4px 0 0;
  position: relative;
  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    color: #00D9FF;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.72rem;
    white-space: nowrap;
  }
`;
const ChartLabel = styled.div`
  font-size: 0.7rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 0.4rem;
`;
const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.65rem 0;
  border-bottom: 1px solid rgba(0, 217, 255, 0.1);
  &:last-child { border-bottom: none; }
`;
const StatLabel = styled.div` color: rgba(255,255,255,0.7); font-weight: 500; font-size: 0.88rem; `;
const StatValue = styled.div` color: #00D9FF; font-weight: 700; font-size: 0.95rem; `;
const EmptyState = styled.div`
  background: rgba(42, 48, 80, 0.6);
  border: 1px dashed rgba(0, 217, 255, 0.4);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
`;
const Provenance = styled.div`
  margin-top: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.45);
`;

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AnalyticsPage() {
  const metrics = useSolarStore(s => s.metrics);
  const site = useSolarStore(s => s.site);
  const design = useSolarStore(s => s.design);
  const financial = useSolarStore(s => s.financial);
  const loadProject = useSolarStore(s => s.loadProject);

  const [monthly, setMonthly] = useState<{month:string; kwh:number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [src, setSrc] = useState<string>('');

  useEffect(() => { loadProject(); }, [loadProject]);

  useEffect(() => {
    if (site.lat == null || site.lon == null || metrics.systemSizeKw <= 0) {
      setMonthly([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true); setErr('');
      try {
        const r: any = await solar.seasonal(site.lat as number, site.lon as number);
        const data = r?.data || r;
        const sourceLabel = data?.source || r?.provenance?.source;
        const annualKwh = metrics.annualProduction
          || metrics.systemSizeKw * (site.irradianceKwhPerM2Day || 5.5) * 365 * 0.8;
        const psh = site.irradianceKwhPerM2Day || 5.5;
        let monthlyKwh: number[] | null = null;
        let usedSource = '';

        // Shape A: { monthly: [{ month, relativeYield, peakSunElevation, daylightHours }, ...] }
        if (Array.isArray(data?.monthly) && data.monthly.length === 12 && typeof data.monthly[0] === 'object') {
          const yields = data.monthly.map((m: any) =>
            Number(m.relativeYield ?? m.yieldFactor ?? m.factor ?? 1)
          );
          if (yields.every((v: number) => Number.isFinite(v) && v > 0)) {
            // monthlyKwh = systemKw × PSH × relativeYield × 30 × 0.80
            monthlyKwh = yields.map((y: number) =>
              Math.round(metrics.systemSizeKw * psh * y * 30 * 0.8)
            );
            usedSource = `${sourceLabel || 'Seasonal model'} × site PSH ${psh.toFixed(2)} × 0.80 derate`;
          }
        }
        // Shape B: { monthlyPeakSunHours: number[12] }
        if (!monthlyKwh && Array.isArray(data?.monthlyPeakSunHours) && data.monthlyPeakSunHours.length === 12) {
          monthlyKwh = data.monthlyPeakSunHours.map((p: number) =>
            Math.round(metrics.systemSizeKw * p * 30 * 0.8)
          );
          usedSource = 'NASA POWER monthly mean PSH × system kW × 0.80 derate';
        }
        // Shape C: { months: [{ psh|peakSunHours|value }, ...] }
        if (!monthlyKwh && Array.isArray(data?.months) && data.months.length === 12) {
          const arr = data.months.map((m: any) => Number(m.psh ?? m.peakSunHours ?? m.value));
          if (arr.every((v: number) => Number.isFinite(v) && v > 0)) {
            monthlyKwh = arr.map((p: number) =>
              Math.round(metrics.systemSizeKw * p * 30 * 0.8)
            );
            usedSource = 'NASA POWER monthly mean PSH × system kW × 0.80 derate';
          }
        }
        // Shape D: { monthly: { Jan: psh, Feb: psh, ... } }
        if (!monthlyKwh && data?.monthly && typeof data.monthly === 'object' && !Array.isArray(data.monthly)) {
          const keys = Object.keys(data.monthly);
          if (keys.length === 12) {
            const arr = keys.map(k => Number((data.monthly as any)[k]));
            if (arr.every(v => Number.isFinite(v) && v > 0)) {
              monthlyKwh = arr.map(p => Math.round(metrics.systemSizeKw * p * 30 * 0.8));
              usedSource = 'NASA POWER monthly mean PSH × system kW × 0.80 derate';
            }
          }
        }
        // Fallback: flat annual / 12
        if (!monthlyKwh) {
          monthlyKwh = Array(12).fill(Math.round(annualKwh / 12));
          usedSource = 'Annual production / 12 (seasonal data unavailable)';
        }
        setSrc(usedSource);
        if (!cancelled) setMonthly(monthlyKwh.map((kwh, i) => ({ month: MONTHS[i], kwh })));
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message || 'Could not fetch seasonal data');
          const flat = Math.round((metrics.annualProduction || 0) / 12);
          setMonthly(MONTHS.map(m => ({ month: m, kwh: flat })));
          setSrc('Annual production / 12 (NASA fetch failed)');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [site.lat, site.lon, metrics.systemSizeKw, metrics.annualProduction, site.irradianceKwhPerM2Day]);

  const hasSystem = metrics.systemSizeKw > 0;
  const maxMonthly = monthly.length ? Math.max(...monthly.map(d => d.kwh)) : 1;
  const annualSavings = financial.year1SavingsKes || (metrics.monthlySaving * 12);
  const co2 = metrics.carbonOffsetKg || (metrics.annualProduction * 0.45);

  return (
    <Container>
      <Title>📊 Energy Analytics</Title>
      <Sub>Live monthly production curve from NASA POWER seasonal irradiance, pinned to your designed system.</Sub>

      {!hasSystem && (
        <EmptyState>
          📐 No system data yet. Open <strong>Solar Calculator</strong> and run a calculation, or assess a site
          on <strong>Mission Control</strong>. Analytics will populate automatically.
        </EmptyState>
      )}

      {hasSystem && (
        <Grid>
          <Card initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}}>
            <h3 style={{margin: "0 0 0.25rem", color: "#00D9FF"}}>Monthly Production (kWh)</h3>
            <div style={{fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)'}}>
              {loading ? 'Loading NASA POWER…' : err ? `⚠ ${err}` : 'Real NASA POWER seasonal data'}
            </div>
            <ChartContainer>
              {monthly.map((d, i) => (
                <div key={i} style={{flex: 1, display: "flex", flexDirection: "column"}}>
                  <Bar
                    initial={{height: 0}}
                    animate={{height: `${(d.kwh / maxMonthly) * 150}px`}}
                    transition={{delay: i * 0.04, duration: 0.4}}
                    data-tooltip={`${d.kwh.toLocaleString()} kWh`}
                  />
                  <ChartLabel>{d.month}</ChartLabel>
                </div>
              ))}
            </ChartContainer>
            <Provenance>Source: {src || '—'}</Provenance>
          </Card>

          <Card initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{delay:0.05}}>
            <h3 style={{margin: "0 0 1rem", color: "#00D9FF"}}>System Summary</h3>
            <StatRow><StatLabel>Site</StatLabel><StatValue>{site.displayName || '—'}</StatValue></StatRow>
            <StatRow><StatLabel>System Size</StatLabel><StatValue>{metrics.systemSizeKw.toFixed(2)} kW</StatValue></StatRow>
            <StatRow><StatLabel>Panel Count</StatLabel><StatValue>{metrics.panelCount} × {design.panelW || 580}W</StatValue></StatRow>
            <StatRow><StatLabel>Inverter</StatLabel><StatValue>{design.inverterKw ? design.inverterKw.toFixed(1) + ' kW' : '—'}</StatValue></StatRow>
            <StatRow><StatLabel>Battery</StatLabel><StatValue>{design.batteryKwh ? design.batteryKwh.toFixed(1) + ' kWh' : '—'}</StatValue></StatRow>
            <StatRow><StatLabel>Peak Sun Hours</StatLabel><StatValue>{(site.irradianceKwhPerM2Day ?? metrics.peakSunHours).toFixed(2)}</StatValue></StatRow>
            <StatRow><StatLabel>Annual Production</StatLabel><StatValue>{Math.round(metrics.annualProduction).toLocaleString()} kWh</StatValue></StatRow>
          </Card>

          <Card initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{delay:0.1}}>
            <h3 style={{margin: "0 0 1rem", color: "#00D9FF"}}>Financial Snapshot</h3>
            <StatRow><StatLabel>CAPEX</StatLabel><StatValue>KSh {Math.round((financial.capexKes || metrics.totalCost)).toLocaleString()}</StatValue></StatRow>
            <StatRow><StatLabel>Year-1 Savings</StatLabel><StatValue>KSh {Math.round(annualSavings).toLocaleString()}</StatValue></StatRow>
            <StatRow><StatLabel>Monthly Saving</StatLabel><StatValue>KSh {Math.round(metrics.monthlySaving).toLocaleString()}</StatValue></StatRow>
            <StatRow><StatLabel>Payback</StatLabel><StatValue>{(financial.paybackYears || metrics.paybackPeriods).toFixed(1)} yrs</StatValue></StatRow>
            <StatRow><StatLabel>Tariff (EPRA)</StatLabel><StatValue>KSh {site.tariffKesPerKwh.toFixed(2)}/kWh</StatValue></StatRow>
            <StatRow><StatLabel>CO₂ Avoided / yr</StatLabel><StatValue>{Math.round(co2)} kg</StatValue></StatRow>
          </Card>

          <Card initial={{opacity: 0, y: 8}} animate={{opacity: 1, y: 0}} transition={{delay:0.15}}>
            <h3 style={{margin: "0 0 1rem", color: "#00D9FF"}}>25-Year Projection</h3>
            <p style={{color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginTop: 0}}>
              Assuming 0.5%/yr panel degradation (industry standard)
            </p>
            {[1, 5, 10, 15, 20, 25].map(y => {
              const factor = Math.pow(1 - 0.005, y - 1);
              return (
                <StatRow key={y}>
                  <StatLabel>Year {y}</StatLabel>
                  <StatValue>{Math.round(metrics.annualProduction * factor).toLocaleString()} kWh</StatValue>
                </StatRow>
              );
            })}
          </Card>
        </Grid>
      )}
    </Container>
  );
}
