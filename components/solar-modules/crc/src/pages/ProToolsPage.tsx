import React, { useState } from 'react';
import styled from 'styled-components';
import { finance, solar, sustain, biz, reports, downloadBlob, research } from '../services/api';

// ============================================
// Pro Tools — surfaces every new backend endpoint
// 5 tabs: Finance · Solar · Sustainability · Reports · Business · R&D
// ============================================

const Container = styled.div`
  padding: 2rem;
  color: #e6f1ff;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  background: linear-gradient(135deg, #00d9ff, #ff006e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
`;

const Sub = styled.p`
  opacity: 0.7;
  margin-top: 0;
  margin-bottom: 1.5rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 217, 255, 0.2);
  padding-bottom: 0.75rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.55rem 1.1rem;
  background: ${(p) => (p.$active ? 'linear-gradient(135deg, #00d9ff, #ff006e)' : 'rgba(255,255,255,0.05)')};
  color: ${(p) => (p.$active ? '#0a0e27' : '#e6f1ff')};
  border: 1px solid rgba(0, 217, 255, 0.25);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  &:hover { background: ${(p) => (p.$active ? '' : 'rgba(0,217,255,0.12)')}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.25rem;
`;

const Card = styled.div`
  background: rgba(15, 20, 50, 0.7);
  border: 1px solid rgba(0, 217, 255, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
`;

const CardH = styled.h3`
  margin: 0 0 0.5rem;
  color: #00d9ff;
  font-size: 1.05rem;
`;

const CardSub = styled.div`
  font-size: 0.78rem;
  opacity: 0.6;
  margin-bottom: 0.85rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 100px;
  padding: 0.45rem 0.6rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 217, 255, 0.25);
  color: #e6f1ff;
  border-radius: 6px;
  font-size: 0.9rem;
`;

const Select = styled.select`
  flex: 1;
  min-width: 100px;
  padding: 0.45rem 0.6rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 217, 255, 0.25);
  color: #e6f1ff;
  border-radius: 6px;
`;

const Btn = styled.button`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #00d9ff, #ff006e);
  color: #0a0e27;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  &:disabled { opacity: 0.5; cursor: wait; }
`;

const Out = styled.pre`
  margin-top: 0.75rem;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.78rem;
  max-height: 240px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  color: #b6f3ff;
`;

type State = Record<string, any>;

function useTool() {
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const run = async (fn: () => Promise<any>) => {
    setBusy(true); setErr(null);
    try { setOut(await fn()); } catch (e: any) { setErr(e?.message || String(e)); }
    finally { setBusy(false); }
  };
  return { busy, out, err, run, setOut };
}

const Result: React.FC<{ out: any; err: string | null }> = ({ out, err }) => {
  if (err) return <Out style={{ color: '#ff6b9d' }}>Error: {err}</Out>;
  if (!out) return null;
  if (out instanceof Blob) {
    return <Out>Binary file received ({(out as Blob).size} bytes) — download triggered.</Out>;
  }
  return <Out>{JSON.stringify(out, null, 2)}</Out>;
};

// ---------- Tools ----------
const NpvTool = () => {
  const t = useTool();
  const [rate, setRate] = useState(0.10);
  const [cf, setCf] = useState('-1247500,240000,240000,240000,240000,240000,240000,240000,240000,240000,240000');
  return (
    <Card>
      <CardH>NPV — Discounted Cash Flow</CardH>
      <CardSub>Brealey & Myers methodology, real arithmetic</CardSub>
      <Row>
        <Input aria-label="Discount rate (decimal, e.g. 0.10 for 10%)" type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value)} placeholder="discount rate" />
      </Row>
      <Row>
        <Input aria-label="Cash flows, comma-separated" value={cf} onChange={(e) => setCf(e.target.value)} placeholder="comma-separated cash flows" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => finance.npv(rate, cf.split(',').map(Number)))}>Calculate NPV</Btn>
      <Result {...t} />
    </Card>
  );
};

const IrrTool = () => {
  const t = useTool();
  const [cf, setCf] = useState('-1247500,240000,240000,240000,240000,240000,240000,240000,240000,240000,240000');
  return (
    <Card>
      <CardH>IRR — Newton–Raphson</CardH>
      <CardSub>With bisection fallback</CardSub>
      <Row><Input aria-label="Cash flows, comma-separated" value={cf} onChange={(e) => setCf(e.target.value)} /></Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => finance.irr(cf.split(',').map(Number)))}>Calculate IRR</Btn>
      <Result {...t} />
    </Card>
  );
};

const LoanTool = () => {
  const t = useTool();
  const [p, setP] = useState({ principal: 1000000, annualRate: 0.14, years: 5 });
  return (
    <Card>
      <CardH>Loan Amortization</CardH>
      <CardSub>PMT formula, ISO 31-11</CardSub>
      <Row>
        <Input aria-label="Loan principal" type="number" value={p.principal} onChange={(e) => setP({ ...p, principal: +e.target.value })} placeholder="Principal" />
        <Input aria-label="Annual interest rate (decimal)" type="number" step="0.01" value={p.annualRate} onChange={(e) => setP({ ...p, annualRate: +e.target.value })} placeholder="Rate" />
        <Input aria-label="Loan term in years" type="number" value={p.years} onChange={(e) => setP({ ...p, years: +e.target.value })} placeholder="Years" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => finance.loan(p.principal, p.annualRate, p.years))}>Amortize</Btn>
      <Result {...t} />
    </Card>
  );
};

const TariffTool = () => {
  const t = useTool();
  const [cat, setCat] = useState('DC2');
  const [kwh, setKwh] = useState(250);
  return (
    <Card>
      <CardH>KPLC Tariff Bill</CardH>
      <CardSub>Real EPRA Q1 2026 schedule</CardSub>
      <Row>
        <Select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="DC1">DC1 (≤30 kWh, lifeline)</option>
          <option value="DC2">DC2 (residential)</option>
          <option value="SC">SC (small commercial)</option>
        </Select>
        <Input type="number" value={kwh} onChange={(e) => setKwh(+e.target.value)} placeholder="kWh" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => finance.tariff(cat, kwh))}>Compute Bill</Btn>
      <Result {...t} />
    </Card>
  );
};

const FxTool = () => {
  const t = useTool();
  const [a, setA] = useState(1000);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('KES');
  return (
    <Card>
      <CardH>Currency Conversion</CardH>
      <CardSub>exchangerate.host (free, no key)</CardSub>
      <Row>
        <Input type="number" value={a} onChange={(e) => setA(+e.target.value)} />
        <Input value={from} onChange={(e) => setFrom(e.target.value.toUpperCase())} />
        <Input value={to} onChange={(e) => setTo(e.target.value.toUpperCase())} />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => finance.currency(a, from, to))}>Convert</Btn>
      <Result {...t} />
    </Card>
  );
};

// ----- Solar -----
const SunPosTool = () => {
  const t = useTool();
  const [lat, setLat] = useState(-1.2865);
  const [lon, setLon] = useState(36.8172);
  return (
    <Card>
      <CardH>Sun Position</CardH>
      <CardSub>Michalsky 1988, ±0.01°</CardSub>
      <Row>
        <Input type="number" value={lat} onChange={(e) => setLat(+e.target.value)} />
        <Input type="number" value={lon} onChange={(e) => setLon(+e.target.value)} />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => solar.sunPosition(lat, lon))}>Get Position Now</Btn>
      <Result {...t} />
    </Card>
  );
};

const HourlyTool = () => {
  const t = useTool();
  const [p, setP] = useState({ lat: -1.2865, lon: 36.8172, dateISO: '2026-04-21', tilt: 15, azimuth: 0, systemKwStc: 6.8 });
  return (
    <Card>
      <CardH>Hourly Production Simulation</CardH>
      <CardSub>Sun → POA → Tcell → DC → AC, NREL SAM losses</CardSub>
      <Row>
        <Input type="number" value={p.lat} onChange={(e) => setP({ ...p, lat: +e.target.value })} placeholder="lat" />
        <Input type="number" value={p.lon} onChange={(e) => setP({ ...p, lon: +e.target.value })} placeholder="lon" />
      </Row>
      <Row>
        <Input value={p.dateISO} onChange={(e) => setP({ ...p, dateISO: e.target.value })} placeholder="YYYY-MM-DD" />
        <Input type="number" value={p.tilt} onChange={(e) => setP({ ...p, tilt: +e.target.value })} placeholder="tilt°" />
        <Input type="number" value={p.azimuth} onChange={(e) => setP({ ...p, azimuth: +e.target.value })} placeholder="azimuth°" />
        <Input type="number" value={p.systemKwStc} onChange={(e) => setP({ ...p, systemKwStc: +e.target.value })} placeholder="kWp" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => solar.hourly(p))}>Simulate Day</Btn>
      <Result {...t} />
    </Card>
  );
};

const StringConfigTool = () => {
  const t = useTool();
  const [p, setP] = useState({
    panelVocStc: 49.5, panelVmppStc: 41.5, panelImppStc: 11.7, panelIscStc: 12.4,
    inverterMaxDcV: 600, inverterMpptMinV: 150, inverterMpptMaxV: 500, inverterMaxInputA: 25, inverterMpptCount: 2
  });
  const upd = (k: string) => (e: any) => setP({ ...p, [k]: +e.target.value });
  return (
    <Card>
      <CardH>String Configuration</CardH>
      <CardSub>IEC 62548 with temperature coefficients</CardSub>
      <Row>
        <Input type="number" value={p.panelVocStc} onChange={upd('panelVocStc')} placeholder="Panel Voc" />
        <Input type="number" value={p.panelVmppStc} onChange={upd('panelVmppStc')} placeholder="Panel Vmpp" />
        <Input type="number" value={p.panelIscStc} onChange={upd('panelIscStc')} placeholder="Panel Isc" />
      </Row>
      <Row>
        <Input type="number" value={p.inverterMaxDcV} onChange={upd('inverterMaxDcV')} placeholder="Inv max DC V" />
        <Input type="number" value={p.inverterMpptMinV} onChange={upd('inverterMpptMinV')} placeholder="MPPT min" />
        <Input type="number" value={p.inverterMaxInputA} onChange={upd('inverterMaxInputA')} placeholder="Max input A" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => solar.stringConfig(p))}>Compute</Btn>
      <Result {...t} />
    </Card>
  );
};

const InverterMatchTool = () => {
  const t = useTool();
  const [pv, setPv] = useState(6.8);
  const [inv, setInv] = useState(5.0);
  return (
    <Card>
      <CardH>Inverter Match Check</CardH>
      <CardSub>DC/AC ratio with verdict</CardSub>
      <Row>
        <Input type="number" value={pv} onChange={(e) => setPv(+e.target.value)} placeholder="PV kWp" />
        <Input type="number" value={inv} onChange={(e) => setInv(+e.target.value)} placeholder="Inverter kW" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => solar.inverterMatch({ pvKwStc: pv, inverterAcKw: inv }))}>Check</Btn>
      <Result {...t} />
    </Card>
  );
};

// ----- Sustainability -----
const CarbonFootprintTool = () => {
  const t = useTool();
  const [k, setK] = useState(12000);
  const [c, setC] = useState('KE');
  return (
    <Card>
      <CardH>Carbon Footprint</CardH>
      <CardSub>IEA 2024 grid factors (11 countries)</CardSub>
      <Row>
        <Input type="number" value={k} onChange={(e) => setK(+e.target.value)} placeholder="Annual kWh" />
        <Select value={c} onChange={(e) => setC(e.target.value)}>
          {['KE','UG','TZ','RW','ET','NG','ZA','EG','MA','GH','GLOBAL_AVG'].map((x) => <option key={x}>{x}</option>)}
        </Select>
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => sustain.carbonFootprint(k, c))}>Compute</Btn>
      <Result {...t} />
    </Card>
  );
};

const SolarOffsetTool = () => {
  const t = useTool();
  const [k, setK] = useState(12600);
  const [c, setC] = useState('KE');
  const [y, setY] = useState(25);
  return (
    <Card>
      <CardH>Solar Offset (Lifetime)</CardH>
      <CardSub>Net of UNECE PV LCA</CardSub>
      <Row>
        <Input type="number" value={k} onChange={(e) => setK(+e.target.value)} placeholder="Annual PV kWh" />
        <Select value={c} onChange={(e) => setC(e.target.value)}>
          {['KE','UG','TZ','ZA','GLOBAL_AVG'].map((x) => <option key={x}>{x}</option>)}
        </Select>
        <Input type="number" value={y} onChange={(e) => setY(+e.target.value)} placeholder="Years" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => sustain.solarOffset(k, c, y))}>Compute</Btn>
      <Result {...t} />
    </Card>
  );
};

const EvTool = () => {
  const t = useTool();
  const [v, setV] = useState('sedan_ev');
  const [km, setKm] = useState(50);
  return (
    <Card>
      <CardH>EV Charging Sizing</CardH>
      <CardSub>EV-Database 2024 efficiencies</CardSub>
      <Row>
        <Select value={v} onChange={(e) => setV(e.target.value)}>
          {['compact_ev','sedan_ev','suv_ev','pickup_ev','twowheel_ev','tuktuk_ev','minibus_ev','matatu_ev'].map((x) => <option key={x}>{x}</option>)}
        </Select>
        <Input type="number" value={km} onChange={(e) => setKm(+e.target.value)} placeholder="km/day" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => sustain.evCharging({ vehicleType: v, kmPerDay: km }))}>Size</Btn>
      <Result {...t} />
    </Card>
  );
};

const MicrogridTool = () => {
  const t = useTool();
  const [p, setP] = useState({ households: 50, avgDailyKwhPerHousehold: 4, productiveLoadKwh: 30, peakKwLoad: 25 });
  const upd = (k: string) => (e: any) => setP({ ...p, [k]: +e.target.value });
  return (
    <Card>
      <CardH>Microgrid Sizing</CardH>
      <CardSub>HOMER Pro / NREL daily-balance</CardSub>
      <Row>
        <Input type="number" value={p.households} onChange={upd('households')} placeholder="Households" />
        <Input type="number" value={p.avgDailyKwhPerHousehold} onChange={upd('avgDailyKwhPerHousehold')} placeholder="kWh/day each" />
      </Row>
      <Row>
        <Input type="number" value={p.productiveLoadKwh} onChange={upd('productiveLoadKwh')} placeholder="Productive kWh" />
        <Input type="number" value={p.peakKwLoad} onChange={upd('peakKwLoad')} placeholder="Peak kW" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => sustain.microgrid(p))}>Size Microgrid</Btn>
      <Result {...t} />
    </Card>
  );
};

const DieselVsSolarTool = () => {
  const t = useTool();
  const [p, setP] = useState({ annualKwh: 50000, pvCapexKes: 4500000 });
  const upd = (k: string) => (e: any) => setP({ ...p, [k]: +e.target.value });
  return (
    <Card>
      <CardH>Diesel vs Solar TCO</CardH>
      <CardSub>EPRA fuel + DEFRA CO2 + NPV</CardSub>
      <Row>
        <Input type="number" value={p.annualKwh} onChange={upd('annualKwh')} placeholder="Annual kWh" />
        <Input type="number" value={p.pvCapexKes} onChange={upd('pvCapexKes')} placeholder="PV CAPEX KES" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => sustain.dieselVsSolar(p))}>Compare</Btn>
      <Result {...t} />
    </Card>
  );
};

// ----- Reports -----
const ProposalPdfTool = () => {
  const t = useTool();
  const [name, setName] = useState('Demo Customer Ltd');
  const generate = async () => {
    const blob = await reports.proposalBlob({
      brand: { companyName: 'SolarGenius Pro', primaryHex: '#0b8457', tagline: 'Engineering-grade solar' },
      customer: { name, site: 'Nairobi' },
      design: { systemKw: 6.8, batteryKwh: 10, panelCount: 14, panelW: 485, inverterKw: 5, tiltDeg: 15, azimuthDeg: 0, specificYieldKwhPerKwp: 1850, annualOffsetPct: 95,
        bom: [['JA Solar 485Wp', 14, 12500, 175000], ['Deye 5kW Hybrid', 1, 180000, 180000], ['BSLBATT 10kWh', 1, 380000, 380000]] },
      financial: { capexKes: 1247500, year1SavingsKes: 240000, paybackYears: 5.2, irrPct: 14.1, npvKes: 227196,
        cashFlowTable: [[1, 240000, 240000], [2, 240000, 480000], [3, 240000, 720000]] }
    });
    downloadBlob(blob as any, `proposal-${Date.now()}.pdf`);
    return { ok: true, message: 'PDF downloaded' };
  };
  return (
    <Card>
      <CardH>Branded Proposal PDF</CardH>
      <CardSub>jsPDF + autotable, real PDF download</CardSub>
      <Row><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" /></Row>
      <Btn disabled={t.busy} onClick={() => t.run(generate)}>Generate &amp; Download PDF</Btn>
      <Result {...t} />
    </Card>
  );
};

const XlsxTool = () => {
  const t = useTool();
  const generate = async () => {
    const blob = await reports.xlsxBlob({
      sheets: [
        { name: 'CashFlow', aoa: [['Year', 'Net (KES)'], ...[1,2,3,4,5].map(y => [y, 240000])] },
        { name: 'BOM', rows: [
          { item: 'Panel 485W', qty: 14, unit: 12500, total: 175000 },
          { item: 'Inverter 5kW', qty: 1, unit: 180000, total: 180000 }
        ]}
      ]
    });
    downloadBlob(blob as any, `report-${Date.now()}.xlsx`);
    return { ok: true, message: 'Excel downloaded' };
  };
  return (
    <Card>
      <CardH>Excel Export</CardH>
      <CardSub>xlsx (multi-sheet)</CardSub>
      <Btn disabled={t.busy} onClick={() => t.run(generate)}>Download Excel</Btn>
      <Result {...t} />
    </Card>
  );
};

const SchematicTool = () => {
  const t = useTool();
  const [p, setP] = useState({ panels: 14, panelW: 485, strings: 2, inverterKw: 5, batteryKwh: 10, hasGrid: true });
  const upd = (k: string) => (e: any) => setP({ ...p, [k]: typeof (p as any)[k] === 'boolean' ? e.target.checked : +e.target.value });
  return (
    <Card>
      <CardH>Single-Line Schematic</CardH>
      <CardSub>IEC 60617 ASCII + nodes/edges JSON</CardSub>
      <Row>
        <Input type="number" value={p.panels} onChange={upd('panels')} placeholder="Panels" />
        <Input type="number" value={p.panelW} onChange={upd('panelW')} placeholder="W each" />
        <Input type="number" value={p.inverterKw} onChange={upd('inverterKw')} placeholder="Inv kW" />
        <Input type="number" value={p.batteryKwh} onChange={upd('batteryKwh')} placeholder="Bat kWh" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => reports.schematic(p))}>Generate</Btn>
      <Result {...t} />
    </Card>
  );
};

// ----- Business / CRM -----
const LeadCaptureTool = () => {
  const t = useTool();
  const [p, setP] = useState({ name: '', email: '', phone: '', monthlyBillKes: 0, source: 'website' });
  const upd = (k: string) => (e: any) => setP({ ...p, [k]: e.target.value });
  return (
    <Card>
      <CardH>Capture Lead</CardH>
      <CardSub>Persisted to data/business.json</CardSub>
      <Row>
        <Input placeholder="Name" value={p.name} onChange={upd('name')} />
        <Input placeholder="Email" value={p.email} onChange={upd('email')} />
      </Row>
      <Row>
        <Input placeholder="Phone" value={p.phone} onChange={upd('phone')} />
        <Input type="number" placeholder="Monthly bill KES" value={p.monthlyBillKes} onChange={(e) => setP({ ...p, monthlyBillKes: +e.target.value })} />
      </Row>
      <Btn disabled={t.busy || !p.name || (!p.email && !p.phone)} onClick={() => t.run(() => biz.captureLead(p))}>Capture</Btn>
      <Result {...t} />
    </Card>
  );
};

const PipelineTool = () => {
  const t = useTool();
  return (
    <Card>
      <CardH>Sales Pipeline</CardH>
      <CardSub>7-stage CRM with weighted forecast</CardSub>
      <Btn disabled={t.busy} onClick={() => t.run(() => biz.pipeline())}>Refresh Pipeline</Btn>
      <Result {...t} />
    </Card>
  );
};

const ConversionTool = () => {
  const t = useTool();
  const [d, setD] = useState(90);
  return (
    <Card>
      <CardH>Conversion Funnel</CardH>
      <CardSub>From event log (real)</CardSub>
      <Row><Input type="number" value={d} onChange={(e) => setD(+e.target.value)} placeholder="Days" /></Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => biz.conversion(d))}>Compute Funnel</Btn>
      <Result {...t} />
    </Card>
  );
};

const PortfolioTool = () => {
  const t = useTool();
  return (
    <Card>
      <CardH>Multi-Site Portfolio</CardH>
      <CardSub>Aggregated kWp, batteries, CAPEX</CardSub>
      <Btn disabled={t.busy} onClick={() => t.run(() => biz.portfolio())}>Show Portfolio</Btn>
      <Result {...t} />
    </Card>
  );
};

const ProfitTool = () => {
  const t = useTool();
  return (
    <Card>
      <CardH>Profit Summary</CardH>
      <CardSub>From recorded jobs</CardSub>
      <Btn disabled={t.busy} onClick={() => t.run(() => biz.profit())}>Show Profit</Btn>
      <Result {...t} />
    </Card>
  );
};

// ----- Research -----
const ResearchTool = () => {
  const t = useTool();
  return (
    <Card>
      <CardH>R&amp;D Catalogue</CardH>
      <CardSub>13 of 19 features now implemented with free tools; 6 honest stubs remain</CardSub>
      <Btn disabled={t.busy} onClick={() => t.run(() => research.list())}>List All</Btn>
      <Result {...t} />
    </Card>
  );
};

const ShadingTool = () => {
  const t = useTool();
  const [p, setP] = useState({ lat: -1.2865, lon: 36.8172, dateISO: '2026-04-21', radiusMeters: 100 });
  return (
    <Card>
      <CardH>OSM Shading Analyzer</CardH>
      <CardSub>Free: OpenStreetMap buildings + sun geometry</CardSub>
      <Row>
        <Input type="number" value={p.lat} onChange={(e) => setP({ ...p, lat: +e.target.value })} placeholder="lat" />
        <Input type="number" value={p.lon} onChange={(e) => setP({ ...p, lon: +e.target.value })} placeholder="lon" />
      </Row>
      <Row>
        <Input value={p.dateISO} onChange={(e) => setP({ ...p, dateISO: e.target.value })} placeholder="YYYY-MM-DD" />
        <Input type="number" value={p.radiusMeters} onChange={(e) => setP({ ...p, radiusMeters: +e.target.value })} placeholder="radius m" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => research.satelliteShading(p))}>Analyze (slow first call)</Btn>
      <Result {...t} />
    </Card>
  );
};

const NlpTool = () => {
  const t = useTool();
  const [q, setQ] = useState('how do I size my system and check savings');
  return (
    <Card>
      <CardH>NL Solar Advisor</CardH>
      <CardSub>Free: keyword-intent rule engine (no LLM)</CardSub>
      <Row><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything..." /></Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => research.nlpAdvisor(q))}>Ask</Btn>
      <Result {...t} />
    </Card>
  );
};

const FaultDetectTool = () => {
  const t = useTool();
  const [csv, setCsv] = useState(Array.from({length:30},(_,i)=>(100+Math.sin(i/3)*5+(i===20?40:0)).toFixed(2)).join(','));
  const run = () => {
    const series = csv.split(',').map((v, i) => ({ ts: i, value: parseFloat(v) }));
    return research.faultPrediction({ series });
  };
  return (
    <Card>
      <CardH>Fault Anomaly Detection</CardH>
      <CardSub>Free: EWMA + z-score (Hunter 1986)</CardSub>
      <Row><Input value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="comma-separated values" /></Row>
      <Btn disabled={t.busy} onClick={() => t.run(run)}>Detect</Btn>
      <Result {...t} />
    </Card>
  );
};

const ForecastTool = () => {
  const t = useTool();
  const [csv, setCsv] = useState('110,115,120,135,150,160,170,165,140,125,115,108,112,118,125,140,155,165,175,170,145,128,118,110');
  const [season, setSeason] = useState(12);
  const [horizon, setHorizon] = useState(6);
  const run = () => research.loadForecast({ series: csv.split(',').map(Number), season, horizon });
  return (
    <Card>
      <CardH>Load Forecast (Holt-Winters)</CardH>
      <CardSub>Free: triple exponential smoothing</CardSub>
      <Row><Input value={csv} onChange={(e) => setCsv(e.target.value)} placeholder="historical kWh series" /></Row>
      <Row>
        <Input type="number" value={season} onChange={(e) => setSeason(+e.target.value)} placeholder="season" />
        <Input type="number" value={horizon} onChange={(e) => setHorizon(+e.target.value)} placeholder="horizon" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(run)}>Forecast</Btn>
      <Result {...t} />
    </Card>
  );
};

const TouTool = () => {
  const t = useTool();
  const [batt, setBatt] = useState(10);
  const run = () => research.touDispatch({
    batteryKwh: batt,
    hourlyLoadKwh: Array.from({length:24},(_,h)=> h>=18&&h<22?2.5:0.8),
    hourlyPvKwh: Array.from({length:24},(_,h)=> h>=6&&h<18?Math.sin((h-6)/12*Math.PI)*4:0)
  });
  return (
    <Card>
      <CardH>TOU Battery Dispatch</CardH>
      <CardSub>Free: deterministic peak/off-peak heuristic (NREL REopt)</CardSub>
      <Row><Input type="number" value={batt} onChange={(e) => setBatt(+e.target.value)} placeholder="Battery kWh" /></Row>
      <Btn disabled={t.busy} onClick={() => t.run(run)}>Compute Schedule</Btn>
      <Result {...t} />
    </Card>
  );
};

const PermitTool = () => {
  const t = useTool();
  const [p, setP] = useState({ country: 'KE', projectKw: 6.8, customerName: 'Demo Co', siteAddress: 'Nairobi' });
  return (
    <Card>
      <CardH>Permit Pack</CardH>
      <CardSub>Free: KE/UG/TZ/RW regulator checklists</CardSub>
      <Row>
        <Select value={p.country} onChange={(e) => setP({ ...p, country: e.target.value })}>
          {['KE','UG','TZ','RW'].map(x=><option key={x}>{x}</option>)}
        </Select>
        <Input type="number" value={p.projectKw} onChange={(e) => setP({ ...p, projectKw: +e.target.value })} placeholder="kWp" />
      </Row>
      <Row>
        <Input value={p.customerName} onChange={(e) => setP({ ...p, customerName: e.target.value })} placeholder="Customer" />
        <Input value={p.siteAddress} onChange={(e) => setP({ ...p, siteAddress: e.target.value })} placeholder="Site" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => research.permitPack(p))}>Generate Pack</Btn>
      <Result {...t} />
    </Card>
  );
};

const PanelCountTool = () => {
  const t = useTool();
  const [area, setArea] = useState(60);
  return (
    <Card>
      <CardH>Panel Counter (Roof Area)</CardH>
      <CardSub>Free: IEC 62548 packing-factor geometry</CardSub>
      <Row><Input type="number" value={area} onChange={(e) => setArea(+e.target.value)} placeholder="Roof area m²" /></Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => research.panelCounter({ roofAreaM2: area }))}>Count</Btn>
      <Result {...t} />
    </Card>
  );
};

const SoilingTool = () => {
  const t = useTool();
  const [p, setP] = useState({ lat: -1.2865, lon: 36.8172, climate: 'semiarid', days: 30 });
  return (
    <Card>
      <CardH>Real Soiling (Open-Meteo + Kimber)</CardH>
      <CardSub>Free: weather archive → cleaning event detection</CardSub>
      <Row>
        <Input type="number" value={p.lat} onChange={(e) => setP({ ...p, lat: +e.target.value })} placeholder="lat" />
        <Input type="number" value={p.lon} onChange={(e) => setP({ ...p, lon: +e.target.value })} placeholder="lon" />
      </Row>
      <Row>
        <Select value={p.climate} onChange={(e) => setP({ ...p, climate: e.target.value })}>
          {['arid','semiarid','tropical','temperate'].map(x=><option key={x}>{x}</option>)}
        </Select>
        <Input type="number" value={p.days} onChange={(e) => setP({ ...p, days: +e.target.value })} placeholder="days" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => research.satelliteSoiling(p))}>Analyze</Btn>
      <Result {...t} />
    </Card>
  );
};

const YieldValTool = () => {
  const t = useTool();
  const [p, setP] = useState({ lat: -1.2865, lon: 36.8172, systemKwStc: 6.8, performanceRatio: 0.78 });
  return (
    <Card>
      <CardH>Yield Validation vs NASA POWER</CardH>
      <CardSub>Free: NASA POWER monthly GHI climatology</CardSub>
      <Row>
        <Input type="number" value={p.lat} onChange={(e) => setP({ ...p, lat: +e.target.value })} placeholder="lat" />
        <Input type="number" value={p.lon} onChange={(e) => setP({ ...p, lon: +e.target.value })} placeholder="lon" />
        <Input type="number" value={p.systemKwStc} onChange={(e) => setP({ ...p, systemKwStc: +e.target.value })} placeholder="kWp" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(() => research.yieldValidation(p))}>Compare</Btn>
      <Result {...t} />
    </Card>
  );
};

const EvRouteTool = () => {
  const t = useTool();
  const [p, setP] = useState({ from: { lat: -1.2865, lon: 36.8172 }, to: { lat: -0.0917, lon: 34.768 }, vehicleType: 'sedan_ev', batteryKwh: 60 });
  const run = () => research.evRoute(p);
  return (
    <Card>
      <CardH>EV Route Energy (OSRM)</CardH>
      <CardSub>Free: OSRM demo router + EV-Database 2024</CardSub>
      <Row>
        <Input type="number" value={p.from.lat} onChange={(e) => setP({ ...p, from: { ...p.from, lat: +e.target.value } })} placeholder="from lat" />
        <Input type="number" value={p.from.lon} onChange={(e) => setP({ ...p, from: { ...p.from, lon: +e.target.value } })} placeholder="from lon" />
      </Row>
      <Row>
        <Input type="number" value={p.to.lat} onChange={(e) => setP({ ...p, to: { ...p.to, lat: +e.target.value } })} placeholder="to lat" />
        <Input type="number" value={p.to.lon} onChange={(e) => setP({ ...p, to: { ...p.to, lon: +e.target.value } })} placeholder="to lon" />
      </Row>
      <Btn disabled={t.busy} onClick={() => t.run(run)}>Route</Btn>
      <Result {...t} />
    </Card>
  );
};

const MqttTool = () => {
  const t = useTool();
  const [p, setP] = useState({ brokerUrl: 'mqtt://broker.hivemq.com:1883', topic: 'solar/test/#', username: '', password: '' });
  return (
    <Card>
      <CardH>IoT Live MQTT Subscribe</CardH>
      <CardSub>Free: any MQTT broker (HiveMQ, Mosquitto demo)</CardSub>
      <Row>
        <Input value={p.brokerUrl} onChange={(e) => setP({ ...p, brokerUrl: e.target.value })} placeholder="broker URL" />
      </Row>
      <Row>
        <Input value={p.topic} onChange={(e) => setP({ ...p, topic: e.target.value })} placeholder="topic" />
      </Row>
      <Row>
        <Btn disabled={t.busy} onClick={() => t.run(() => research.mqttConnect(p))}>Connect</Btn>
        <Btn disabled={t.busy} onClick={() => t.run(() => research.mqttStatus())}>Check Status</Btn>
      </Row>
      <Result {...t} />
    </Card>
  );
};

const OcrTool = () => {
  const t = useTool();
  const [b64, setB64] = useState('');
  const onFile = (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setB64(String(r.result || ''));
    r.readAsDataURL(f);
  };
  return (
    <Card>
      <CardH>Invoice OCR → BOM</CardH>
      <CardSub>Free: tesseract.js + regex parser</CardSub>
      <Row><input type="file" accept="image/*" onChange={onFile} style={{ color: '#e6f1ff' }} /></Row>
      <Btn disabled={t.busy || !b64} onClick={() => t.run(() => research.ocrBom(b64))}>Extract BOM (slow)</Btn>
      <Result {...t} />
    </Card>
  );
};

// ============================================
// Page
// ============================================
const ProToolsPage: React.FC = () => {
  const tabs = ['Finance', 'Solar', 'Sustainability', 'Reports', 'Business', 'R&D'] as const;
  type T = typeof tabs[number];
  const [tab, setTab] = useState<T>('Finance');

  return (
    <Container>
      <Title>Pro Tools</Title>
      <Sub>Direct access to every engineering, financial, sustainability and business endpoint — all backed by real algorithms or cited datasets (no fabricated values).</Sub>
      <Tabs>
        {tabs.map((x) => <Tab key={x} $active={tab === x} onClick={() => setTab(x)}>{x}</Tab>)}
      </Tabs>
      <Grid>
        {tab === 'Finance' && (<>
          <NpvTool /><IrrTool /><LoanTool /><TariffTool /><FxTool />
        </>)}
        {tab === 'Solar' && (<>
          <SunPosTool /><HourlyTool /><StringConfigTool /><InverterMatchTool />
        </>)}
        {tab === 'Sustainability' && (<>
          <CarbonFootprintTool /><SolarOffsetTool /><EvTool /><MicrogridTool /><DieselVsSolarTool />
        </>)}
        {tab === 'Reports' && (<>
          <ProposalPdfTool /><XlsxTool /><SchematicTool />
        </>)}
        {tab === 'Business' && (<>
          <LeadCaptureTool /><PipelineTool /><ConversionTool /><PortfolioTool /><ProfitTool />
        </>)}
        {tab === 'R&D' && (<>
          <ResearchTool />
          <NlpTool />
          <ShadingTool />
          <FaultDetectTool />
          <ForecastTool />
          <TouTool />
          <SoilingTool />
          <YieldValTool />
          <EvRouteTool />
          <PermitTool />
          <PanelCountTool />
          <MqttTool />
          <OcrTool />
        </>)}
      </Grid>
    </Container>
  );
};

export default ProToolsPage;
