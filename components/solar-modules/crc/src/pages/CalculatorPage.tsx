import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSolarStore } from '../services/store';
import { core } from '../services/api';
import { DEFAULT_TARIFF_KES_PER_KWH, DEFAULT_DIESEL_KES_PER_LITRE } from '@/lib/solar/sizing';

const Container = styled.div`
  background: #0A0E27;
  padding: 2rem;
  @media (max-width: 768px) { padding: 1rem; }
`;
const Title = styled.h2`
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

const Hint = styled.p`
  margin: 4px 0 0;
  color: rgba(230, 241, 255, 0.5);
  font-size: 0.72rem;
  line-height: 1.4;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;
const Assumptions = styled.ul`
  margin: 1rem 0 0;
  padding-left: 1.1rem;
  color: rgba(230, 241, 255, 0.65);
  font-size: 0.78rem;
  line-height: 1.5;
`;
const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1rem;
`;
const CtaLink = styled.a<{ $primary?: boolean }>`
  flex: 1 1 200px;
  text-align: center;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  color: ${(p) => (p.$primary ? '#06210f' : '#E6F1FF')};
  background: ${(p) => (p.$primary ? '#25D366' : 'rgba(0, 217, 255, 0.12)')};
  border: 1px solid ${(p) => (p.$primary ? '#25D366' : 'rgba(0, 217, 255, 0.4)')};
`;

type SystemType = 'grid-tied' | 'hybrid' | 'off-grid';

interface CalcResult {
  systemType: SystemType;
  pvKwp: number;
  panels: number;
  panelWatt: number;
  inverterKw: number;
  inverterBasis: 'peak-load' | 'estimated-peak' | 'array';
  batteryKwh: number;
  annualEnergyKwh: number;
  monthlySavingKes: number;
  savingBasis: 'grid-tariff' | 'diesel';
  dieselLitresAvoidedPerYear?: number;
  co2AvoidedKgPerYear?: number;
  cost: { lowKes: number; midKes: number; highKes: number };
  paybackYears: number | null;
  notWorthwhile?: boolean;
  warning?: string;
  assumptions: string[];
  location: string;
  sunHours: { annual: number; worstMonth: number; source: 'nasa-power' | 'kenya-typical'; note: string };
}

// Same list as lib/solar/sizing.ts KENYA_TOWNS (keys must match).
const TOWNS: [string, string][] = [
  ['nairobi', 'Nairobi'], ['mombasa', 'Mombasa'], ['kisumu', 'Kisumu'], ['nakuru', 'Nakuru'], ['eldoret', 'Eldoret'],
  ['thika', 'Thika'], ['machakos', 'Machakos'], ['nyeri', 'Nyeri'], ['meru', 'Meru'], ['embu', 'Embu'], ['kitui', 'Kitui'],
  ['naivasha', 'Naivasha'], ['nanyuki', 'Nanyuki'], ['kericho', 'Kericho'], ['kakamega', 'Kakamega'], ['narok', 'Narok'],
  ['kajiado', 'Kajiado'], ['malindi', 'Malindi'], ['garissa', 'Garissa'], ['lodwar', 'Lodwar'],
];

const kes = (n: number) => 'KES ' + Math.round(n).toLocaleString('en-KE');
const energy = (kwh: number) => (kwh >= 1000 ? `${(kwh / 1000).toFixed(1)} MWh` : `${Math.round(kwh)} kWh`);
const WHATSAPP = '254768860665';

export default function CalculatorPage() {
  const { updateMetrics, updateDesign, updateFinancial, updateSite, saveProject } = useSolarStore();

  const [consumption, setConsumption] = useState('450');
  const [location, setLocation] = useState('nairobi');
  const [systemType, setSystemType] = useState<SystemType>('hybrid');
  const [roofType, setRoofType] = useState<'flat' | 'pitched' | 'ground'>('pitched');
  const [tariff, setTariff] = useState(String(DEFAULT_TARIFF_KES_PER_KWH));
  const [daytimeUse, setDaytimeUse] = useState('50');
  const [nightUse, setNightUse] = useState('50');
  const [autonomy, setAutonomy] = useState('1');
  const [diesel, setDiesel] = useState(String(DEFAULT_DIESEL_KES_PER_LITRE));
  const [peakLoad, setPeakLoad] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalcResult | null>(null);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  async function calculate() {
    setError(null);
    setResult(null);
    const cons = Number(consumption);
    if (!cons || cons <= 0) {
      setError('Enter a positive monthly consumption (kWh). It is on your KPLC bill.');
      return;
    }
    // A tariff typed as 0 is a mistake, not "use the default" (2026-10-30 audit:
    // it silently became KES 25).
    if (String(tariff).trim() !== '' && !(Number(tariff) > 0)) {
      setError('The tariff must be more than 0 KES/kWh (your bill total divided by the kWh on it), or leave it blank for the default.');
      return;
    }
    setLoading(true);
    try {
      // Each share goes only with the system it describes: the hidden 50%
      // daytime share was sent for hybrids too and overrode the night share
      // the customer entered (2026-10-30 audit).
      const payload: Record<string, unknown> = {
        consumption: cons, location, systemType, roofType, tariff: Number(tariff) || undefined,
        ...(systemType === 'grid-tied' ? { daytimeUsePct: Number(daytimeUse) } : {}),
        ...(systemType === 'hybrid' ? { nightUsePct: Number(nightUse) } : {}),
        ...(systemType === 'off-grid' ? { autonomyDays: Number(autonomy) } : {}),
        dieselKesPerLitre: systemType === 'off-grid' ? Number(diesel) || undefined : undefined,
        peakLoadKw: Number(peakLoad) || undefined,
      };
      const data = (await core.calculate(payload)) as CalcResult;
      if (!data || typeof data.pvKwp !== 'number') throw new Error('Empty response from the calculator.');
      setResult(data);
      // On a phone the results render below the form: bring them into view
      // (2026-10-30 audit).
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);

      updateMetrics({
        systemSizeKw: data.pvKwp,
        panelCount: data.panels,
        totalCost: data.cost.midKes,
        monthlySaving: data.monthlySavingKes,
        paybackPeriods: data.paybackYears ?? 0,
        annualProduction: data.annualEnergyKwh, // kWh
        carbonOffsetKg: data.co2AvoidedKgPerYear ?? 0,
        peakSunHours: data.sunHours.annual,
      });
      updateDesign({ systemKw: data.pvKwp, panelCount: data.panels, panelW: data.panelWatt, inverterKw: data.inverterKw, batteryKwh: data.batteryKwh, systemType });
      updateFinancial({ capexKes: data.cost.midKes, year1SavingsKes: data.monthlySavingKes * 12, paybackYears: data.paybackYears ?? 0 });
      // The proposal shows the tariff and diesel price this calculation used
      // (2026-10-29 audit: it said KES 25 "entered by the client" after 30 was entered).
      updateSite({
        monthlyConsumptionKwh: cons, irradianceKwhPerM2Day: data.sunHours.annual, irradianceSource: data.sunHours.source,
        tariffKesPerKwh: Number(tariff) > 0 ? Number(tariff) : DEFAULT_TARIFF_KES_PER_KWH,
        dieselKesPerLitre: Number(diesel) > 0 ? Number(diesel) : DEFAULT_DIESEL_KES_PER_LITRE,
      });
      saveProject();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Calculation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const quoteText = result
    ? `Hi EmersonEIMS, please quote this solar system:\n` +
      `Location: ${result.location}\nUse: ${consumption} kWh/month\nType: ${result.systemType}\n` +
      `Panels: ${result.panels} x ${result.panelWatt} W (${result.pvKwp} kWp)\nInverter: ${result.inverterKw} kW\n` +
      `Battery: ${result.batteryKwh} kWh\nEstimate: ${kes(result.cost.lowKes)} – ${kes(result.cost.highKes)}`
    : '';

  return (
    <Container>
      <Title>⚡ Solar System Calculator</Title>
      <Sub>
        A first estimate from your own consumption, using NASA POWER sun-hours for your area and your
        tariff. It is not a quotation: a site survey turns it into a design you can buy.
      </Sub>

      <Grid>
        <Card>
          <Label htmlFor="sc-cons">Monthly consumption (kWh)</Label>
          <Input id="sc-cons" type="number" inputMode="decimal" min={1} value={consumption} onChange={(e) => setConsumption(e.target.value)} />
          <Hint>On your KPLC bill as &ldquo;units&rdquo;. Use a typical month.</Hint>

          <Label htmlFor="sc-loc">Location</Label>
          <Select id="sc-loc" value={location} onChange={(e) => setLocation(e.target.value)}>
            {TOWNS.map(([k, n]) => <option key={k} value={k}>{n}</option>)}
          </Select>

          <Label htmlFor="sc-type">System type</Label>
          <Select id="sc-type" value={systemType} onChange={(e) => setSystemType(e.target.value as SystemType)}>
            <option value="hybrid">Hybrid — solar + battery + grid</option>
            <option value="grid-tied">Grid-tied — solar + grid, no battery (no power during KPLC cuts)</option>
            <option value="off-grid">Off-grid — no grid (replaces a generator)</option>
          </Select>

          {systemType === 'grid-tied' && (
            <>
              <Label htmlFor="sc-day">Share of your use in daylight (%)</Label>
              <Input id="sc-day" type="number" min={0} max={100} value={daytimeUse} onChange={(e) => setDaytimeUse(e.target.value)} />
              <Hint>Offices and shops are often 70–90%; homes nearer 40–50%.</Hint>
            </>
          )}
          {systemType === 'hybrid' && (
            <>
              <Label htmlFor="sc-night">Share of your use after dark (%)</Label>
              <Input id="sc-night" type="number" min={0} max={100} value={nightUse} onChange={(e) => setNightUse(e.target.value)} />
              <Hint>The battery is sized to store this share. Homes are often around 50%.</Hint>
            </>
          )}
          {systemType === 'off-grid' && (
            <Row>
              <div>
                <Label htmlFor="sc-aut">Days without sun</Label>
                <Input id="sc-aut" type="number" min={0.5} max={5} step={0.5} value={autonomy} onChange={(e) => setAutonomy(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="sc-diesel">Diesel KES/litre</Label>
                <Input id="sc-diesel" type="number" min={50} value={diesel} onChange={(e) => setDiesel(e.target.value)} />
              </div>
            </Row>
          )}

          <Row>
            {systemType !== 'off-grid' && (
              <div>
                <Label htmlFor="sc-tariff">Tariff KES/kWh</Label>
                <Input id="sc-tariff" type="number" min={1} value={tariff} onChange={(e) => setTariff(e.target.value)} />
              </div>
            )}
            <div>
              <Label htmlFor="sc-roof">Mounting</Label>
              <Select id="sc-roof" value={roofType} onChange={(e) => setRoofType(e.target.value as 'flat' | 'pitched' | 'ground')}>
                <option value="pitched">Pitched roof</option>
                <option value="flat">Flat roof</option>
                <option value="ground">Ground mount</option>
              </Select>
            </div>
          </Row>
          {systemType !== 'off-grid' && <Hint>Tariff: your total bill divided by the units on it.</Hint>}

          {systemType !== 'grid-tied' && (
            <>
              <Label htmlFor="sc-peak">Largest load in kW (optional)</Label>
              <Input id="sc-peak" type="number" min={0} step={0.1} placeholder="e.g. 5.5 for a borehole pump" value={peakLoad} onChange={(e) => setPeakLoad(e.target.value)} />
              <Hint>Pumps, welders and air-conditioners need a bigger inverter. Leave blank to estimate.</Hint>
            </>
          )}

          <Button onClick={calculate} disabled={loading}>
            {loading ? <><Spinner /> Getting NASA sun data…</> : 'Calculate'}
          </Button>

          {error && <Banner $kind="error" role="alert">⚠ {error}</Banner>}
        </Card>

        <Card aria-live="polite">
          <h3 style={{ color: '#00D9FF', marginTop: 0 }}>Results</h3>
          {!result && !loading && <Banner $kind="info">Fill in the form and press Calculate.</Banner>}
          {result && (
            <>
              <div ref={resultsRef} style={{ scrollMarginTop: 80 }} />
              {(result.notWorthwhile || result.warning) && (
                <div role="alert" style={{ margin: '0 0 1rem', padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid rgba(255,170,0,0.6)', background: 'rgba(255,170,0,0.1)', color: '#ffd27a', fontSize: '0.9rem' }}>
                  {result.notWorthwhile && <div><strong>Not worthwhile as entered.</strong> {result.assumptions[0]?.replace(/^NOT WORTHWHILE:\s*/, '')}</div>}
                  {result.warning && <div>{result.warning}</div>}
                </div>
              )}
              <ResultsGrid>
                <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <ResultValue>{result.pvKwp} kWp</ResultValue>
                  <ResultLabel>{result.panels} × {result.panelWatt} W panels</ResultLabel>
                </ResultCard>
                <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                  <ResultValue>{result.inverterKw} kW</ResultValue>
                  <ResultLabel>Inverter{result.inverterBasis === 'estimated-peak' ? ' (estimated)' : ''}</ResultLabel>
                </ResultCard>
                <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <ResultValue>{result.batteryKwh > 0 ? `${result.batteryKwh} kWh` : 'None'}</ResultValue>
                  <ResultLabel>Battery</ResultLabel>
                </ResultCard>
                <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <ResultValue>{energy(result.annualEnergyKwh)}</ResultValue>
                  <ResultLabel>Solar energy per year</ResultLabel>
                </ResultCard>
                <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <ResultValue style={{ fontSize: '1.1rem' }}>{kes(result.cost.lowKes)} – {kes(result.cost.highKes)}</ResultValue>
                  <ResultLabel>Typical installed cost</ResultLabel>
                </ResultCard>
                <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <ResultValue>{kes(result.monthlySavingKes)}</ResultValue>
                  <ResultLabel>{result.savingBasis === 'diesel' ? 'Diesel saved / month' : 'Saved on your bill / month'}</ResultLabel>
                </ResultCard>
                <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <ResultValue>{result.paybackYears !== null ? `${result.paybackYears} yrs` : '—'}</ResultValue>
                  <ResultLabel>Simple payback</ResultLabel>
                </ResultCard>
                {result.dieselLitresAvoidedPerYear !== undefined && (
                  <ResultCard initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <ResultValue>{result.dieselLitresAvoidedPerYear.toLocaleString('en-KE')} L</ResultValue>
                    <ResultLabel>Diesel avoided / year</ResultLabel>
                  </ResultCard>
                )}
              </ResultsGrid>

              <Banner $kind={result.sunHours.source === 'nasa-power' ? 'ok' : 'info'}>
                ☀ {result.sunHours.annual} sun-hours a day on average
                {result.systemType === 'off-grid' ? `, ${result.sunHours.worstMonth} in the cloudiest month` : ''}. {result.sunHours.note}.
              </Banner>

              <h4 style={{ color: '#00D9FF', margin: '1rem 0 0', fontSize: '0.85rem' }}>How we worked it out</h4>
              <Assumptions>
                {result.assumptions.map((a) => <li key={a}>{a}</li>)}
              </Assumptions>

              <CtaRow>
                <CtaLink $primary href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(quoteText)}`} target="_blank" rel="noopener noreferrer">
                  Get this quoted on WhatsApp
                </CtaLink>
                <CtaLink href="/booking?type=site-survey">Book a site survey</CtaLink>
              </CtaRow>
            </>
          )}
        </Card>
      </Grid>
    </Container>
  );
}
