import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSolarStore } from '../services/store';
import { core } from '../services/api';

const Container = styled.div`
  background: #0A0E27;
  padding: 2rem;
  @media (max-width: 768px) { padding: 1rem; }
`;
const Title = styled.h1`
  color: #00D9FF;
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 5vw, 2.2rem);
`;
const Sub = styled.p`
  color: rgba(230, 241, 255, 0.55);
  margin: 0 0 1.5rem;
  font-size: 0.85rem;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 1.5rem;
  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;
const Card = styled.div`
  background: rgba(42, 48, 80, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
`;
const Label = styled.label`
  display: block;
  margin: 0.6rem 0 4px;
  color: rgba(0, 217, 255, 0.85);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.7rem;
  background: rgba(10, 14, 39, 0.85);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  &:focus { outline: none; border-color: #00D9FF; }
`;
const Select = styled.select`
  width: 100%;
  padding: 0.7rem;
  background: rgba(10, 14, 39, 0.85);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  &:focus { outline: none; border-color: #00D9FF; }
`;
const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  margin-top: 1rem;
  padding: 0.85rem;
  background: ${(p) =>
    p.disabled
      ? 'rgba(0, 217, 255, 0.25)'
      : 'linear-gradient(135deg, #00D9FF, #0099CC)'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
`;
const Spinner = styled.span`
  display: inline-block;
  width: 14px; height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: -2px;
  animation: spin 0.8s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
const Banner = styled.div<{ $kind: 'info' | 'error' | 'ok' }>`
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.88rem;
  border: 1px solid ${(p) => p.$kind === 'error' ? 'rgba(255,77,109,0.5)' : p.$kind === 'ok' ? 'rgba(0,255,136,0.5)' : 'rgba(0,217,255,0.5)'};
  background: ${(p) => p.$kind === 'error' ? 'rgba(255,77,109,0.12)' : p.$kind === 'ok' ? 'rgba(0,255,136,0.10)' : 'rgba(0,217,255,0.10)'};
  color: ${(p) => p.$kind === 'error' ? '#FF4D6D' : p.$kind === 'ok' ? '#00FF88' : '#00D9FF'};
`;
const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.8rem;
  margin-top: 1rem;
`;
const ResultCard = styled(motion.div)`
  padding: 1rem;
  text-align: center;
  background: rgba(10, 14, 39, 0.7);
  border: 1px solid rgba(0, 217, 255, 0.25);
  border-radius: 8px;
`;
const ResultValue = styled.div`
  font-size: 1.6rem;
  font-weight: 900;
  color: #00FF88;
`;
const ResultLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
`;

interface CalcResult {
  systemKw: number | string;
  panels: number;
  batteryKwh: number | string;
  inverterKw: number | string;
  totalCost: number;
  monthlySaving: number;
  paybackYears: number | string;
  annualProduction: number;
  peakSunHours?: number;
  carbonOffsetKgPerYear?: number;
}

export default function CalculatorPage() {
  const { updateMetrics, updateDesign, updateFinancial, updateSite, saveProject, site } = useSolarStore();

  const [consumption, setConsumption] = useState('800');
  const [location, setLocation] = useState('nairobi');
  const [roofType, setRoofType] = useState<'flat' | 'pitched' | 'ground'>('pitched');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalcResult | null>(null);

  async function calculate() {
    setError(null);
    setResult(null);
    const cons = Number(consumption);
    if (!cons || cons <= 0) {
      setError('Enter a positive monthly consumption (kWh).');
      return;
    }
    setLoading(true);
    try {
      const payload: any = { consumption: cons, location, roofType };
      if (budget && Number(budget) > 0) payload.budget = Number(budget);
      const r: any = await core.calculate(payload);
      const data: CalcResult | undefined = r?.data || r;
      if (!data) throw new Error('Empty response from /api/solar/calculate');

      setResult(data);

      const sysKw = Number(data.systemKw) || 0;
      const annual = Number(data.annualProduction) || 0;
      updateMetrics({
        systemSizeKw: sysKw,
        panelCount: Number(data.panels) || 0,
        totalCost: Number(data.totalCost) || 0,
        monthlySaving: Number(data.monthlySaving) || 0,
        paybackPeriods: Number(data.paybackYears) || 0,
        annualProduction: annual,
        carbonOffsetKg: Number(data.carbonOffsetKgPerYear) || Math.round(annual * 0.82),
        peakSunHours: Number(data.peakSunHours) || site.irradianceKwhPerM2Day || 5.5
      });
      updateDesign({
        systemKw: sysKw,
        panelCount: Number(data.panels) || 0,
        inverterKw: Number(data.inverterKw) || 0,
        batteryKwh: Number(data.batteryKwh) || 0
      });
      updateFinancial({
        capexKes: Number(data.totalCost) || 0,
        year1SavingsKes: Math.round((Number(data.monthlySaving) || 0) * 12),
        paybackYears: Number(data.paybackYears) || 0
      });
      updateSite({
        monthlyConsumptionKwh: cons,
        irradianceKwhPerM2Day: site.irradianceKwhPerM2Day ?? Number(data.peakSunHours) ?? null
      });
      saveProject();
    } catch (e: any) {
      setError(e?.message || 'Calculation failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Title>⚡ Solar System Calculator</Title>
      <Sub>
        Sized in real time using NASA POWER irradiance data and the current
        EPRA tariff. Results auto-flow into the Designer, Quote Checker and
        Proposal generator — no need to retype anything.
      </Sub>

      <Grid>
        <Card>
          <Label>Monthly consumption (kWh)</Label>
          <Input type="number" value={consumption} onChange={(e) => setConsumption(e.target.value)} />

          <Label>Location</Label>
          <Select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="nairobi">Nairobi (PSH ~5.4)</option>
            <option value="mombasa">Mombasa (PSH ~5.8)</option>
            <option value="kisumu">Kisumu (PSH ~5.6)</option>
            <option value="nakuru">Nakuru (PSH ~5.5)</option>
            <option value="eldoret">Eldoret (PSH ~5.3)</option>
          </Select>

          <Label>Roof type</Label>
          <Select value={roofType} onChange={(e) => setRoofType(e.target.value as any)}>
            <option value="pitched">Pitched</option>
            <option value="flat">Flat</option>
            <option value="ground">Ground mount</option>
          </Select>

          <Label>Budget cap KES (optional)</Label>
          <Input type="number" placeholder="e.g. 1500000" value={budget} onChange={(e) => setBudget(e.target.value)} />

          <Button onClick={calculate} disabled={loading}>
            {loading ? <><Spinner /> Calculating…</> : '🔮 Calculate'}
          </Button>

          {error && <Banner $kind="error">⚠ {error}</Banner>}
          {result && <Banner $kind="ok">✓ Sized. Results saved into the project.</Banner>}
        </Card>

        <Card>
          <h3 style={{ color: '#00D9FF', marginTop: 0 }}>Results</h3>
          {!result && !loading && (
            <Banner $kind="info">Fill the form on the left and click Calculate.</Banner>
          )}
          {result && (
            <ResultsGrid>
              <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <ResultValue>{result.systemKw}</ResultValue>
                <ResultLabel>System (kW)</ResultLabel>
              </ResultCard>
              <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <ResultValue>{result.panels}</ResultValue>
                <ResultLabel>Panels</ResultLabel>
              </ResultCard>
              <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
                <ResultValue>{result.inverterKw}</ResultValue>
                <ResultLabel>Inverter (kW)</ResultLabel>
              </ResultCard>
              <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <ResultValue>{result.batteryKwh}</ResultValue>
                <ResultLabel>Battery (kWh)</ResultLabel>
              </ResultCard>
              <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
                <ResultValue>{Math.round(Number(result.totalCost) / 1000)}k</ResultValue>
                <ResultLabel>CAPEX (KSh)</ResultLabel>
              </ResultCard>
              <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <ResultValue>{Math.round(Number(result.monthlySaving)).toLocaleString()}</ResultValue>
                <ResultLabel>KSh/month saved</ResultLabel>
              </ResultCard>
              <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30 }}>
                <ResultValue>{result.paybackYears}</ResultValue>
                <ResultLabel>Payback (yrs)</ResultLabel>
              </ResultCard>
              <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <ResultValue>{(Number(result.annualProduction) / 1000).toFixed(1)}</ResultValue>
                <ResultLabel>MWh / year</ResultLabel>
              </ResultCard>
            </ResultsGrid>
          )}
        </Card>
      </Grid>
    </Container>
  );
}
