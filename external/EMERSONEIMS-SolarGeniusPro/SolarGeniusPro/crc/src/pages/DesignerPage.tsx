import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSolarStore } from '../services/store';
import { autoDesign, equipment } from '../services/api';

/**
 * DesignerPage — real auto-designer. Pulls site + monthly consumption from the
 * project store, calls /api/solar/auto-design which returns a full BOM
 * (panel/inverter/battery selection from the equipment library), then writes
 * it back to the design slice of the store so Wiring/Report/Viewer see it.
 */

const Wrap = styled.div`
  background: #0A0E27;
  min-height: 100vh;
  padding: 2rem;
  color: #E6F1FF;
  @media (max-width: 768px) { padding: 1rem; }
`;
const Title = styled.h2`
  margin: 0 0 1rem;
  color: #00D9FF;
  font-size: clamp(1.5rem,5vw,2rem);
`;
const Card = styled.div`
  background: rgba(42,48,80,0.8);
  border: 1px solid rgba(0,217,255,0.25);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;
const Field = styled.label`
  display: flex; flex-direction: column; gap: 4px;
  font-size: 0.78rem;
  color: rgba(230,241,255,0.7);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  & input, & select {
    background: rgba(5,8,24,0.6);
    border: 1px solid rgba(0,217,255,0.3);
    border-radius: 6px;
    color: #E6F1FF;
    padding: 0.55rem 0.7rem;
    font-size: 0.95rem;
  }
`;
const Btn = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  background: ${p => p.$variant === 'ghost' ? 'transparent' : 'linear-gradient(135deg,#00D9FF,#0099CC)'};
  color: ${p => p.$variant === 'ghost' ? '#E6F1FF' : '#0A0E27'};
  border: ${p => p.$variant === 'ghost' ? '1px solid rgba(0,217,255,0.3)' : 'none'};
  padding: 0.75rem 1.4rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const Banner = styled.div<{ $tone: 'ok' | 'err' | 'info' }>`
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  background: ${p =>
    p.$tone === 'ok' ? 'rgba(0,255,136,0.1)' :
    p.$tone === 'err' ? 'rgba(255,77,109,0.1)' :
    'rgba(0,217,255,0.1)'};
  border: 1px solid ${p =>
    p.$tone === 'ok' ? 'rgba(0,255,136,0.4)' :
    p.$tone === 'err' ? 'rgba(255,77,109,0.4)' :
    'rgba(0,217,255,0.3)'};
  color: ${p =>
    p.$tone === 'ok' ? '#00FF88' :
    p.$tone === 'err' ? '#FF4D6D' :
    '#00D9FF'};
`;
const BomTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  & th, & td { text-align: left; padding: 0.55rem 0.6rem; border-bottom: 1px solid rgba(0,217,255,0.12); }
  & th { color: #00D9FF; font-weight: 600; font-size: 0.75rem; letter-spacing: 0.05em; text-transform: uppercase; }
`;

const DesignerPage: React.FC = () => {
  const site = useSolarStore(s => s.site);
  const metrics = useSolarStore(s => s.metrics);
  const design = useSolarStore(s => s.design);
  const updateDesign = useSolarStore(s => s.updateDesign);
  const updateSite = useSolarStore(s => s.updateSite);
  const updateMetrics = useSolarStore(s => s.updateMetrics);
  const updateFinancial = useSolarStore(s => s.updateFinancial);
  const saveProject = useSolarStore(s => s.saveProject);
  const loadProject = useSolarStore(s => s.loadProject);
  const nav = useNavigate();

  const [consumption, setConsumption] = useState<number>(0);
  const [autonomyDays, setAutonomyDays] = useState(1);
  const [budget, setBudget] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [bom, setBom] = useState<any[]>([]);
  const [msg, setMsg] = useState<{tone:'ok'|'err'|'info'; text:string} | null>(null);
  const [libCount, setLibCount] = useState<{p:number;i:number;b:number} | null>(null);

  useEffect(() => { loadProject(); }, [loadProject]);
  useEffect(() => {
    if (site.monthlyConsumptionKwh && consumption === 0) setConsumption(site.monthlyConsumptionKwh);
  }, [site.monthlyConsumptionKwh, consumption]);

  useEffect(() => {
    Promise.all([equipment.panels(), equipment.inverters(), equipment.batteries()])
      .then(([p,i,b]: any) => {
        const pn = (p?.data || p)?.length || 0;
        const inv = (i?.data || i)?.length || 0;
        const bt = (b?.data || b)?.length || 0;
        setLibCount({ p: pn, i: inv, b: bt });
      })
      .catch(() => setLibCount(null));
  }, []);

  async function runAutoDesign() {
    if (site.lat == null || site.lon == null) {
      setMsg({tone:'err', text: 'No site assessed. Open Mission Control first to set lat/lon and roof.'});
      return;
    }
    if (!consumption || consumption <= 0) {
      setMsg({tone:'err', text: 'Enter monthly consumption (kWh).'});
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const r: any = await autoDesign({
        lat: site.lat,
        lon: site.lon,
        monthlyKwh: consumption,
        autonomyDays,
        roofAreaM2: site.roofAreaM2 ?? null,
        budgetKes: budget > 0 ? budget : null,
        tariffKesPerKwh: site.tariffKesPerKwh
      });
      const d = r?.data || r;
      const bomLines = d?.bom || d?.bill || [];
      setBom(Array.isArray(bomLines) ? bomLines : []);

      // Persist into the project store
      if (d?.systemKw) {
        updateDesign({
          systemKw: d.systemKw || 0,
          panelCount: d.panelCount || 0,
          panelW: d.panelW || design.panelW,
          panelMake: d.panel?.manufacturer || design.panelMake,
          panelModel: d.panel?.model || design.panelModel,
          inverterKw: d.inverterKw || 0,
          inverterMake: d.inverter?.manufacturer || design.inverterMake,
          inverterModel: d.inverter?.model || design.inverterModel,
          batteryKwh: d.batteryKwh || 0,
          batteryMake: d.battery?.manufacturer || design.batteryMake,
          batteryModel: d.battery?.model || design.batteryModel,
          tiltDeg: design.tiltDeg,
          azimuthDeg: site.roofAzimuthDeg ?? design.azimuthDeg
        });
        updateMetrics({
          systemSizeKw: d.systemKw,
          panelCount: d.panelCount || 0,
          totalCost: d.capexKes || 0,
          monthlySaving: d.monthlySavingKes || 0,
          paybackPeriods: d.paybackYears || 0,
          annualProduction: d.annualKwh || 0,
          carbonOffsetKg: (d.annualKwh || 0) * 0.45,
          peakSunHours: site.irradianceKwhPerM2Day ?? metrics.peakSunHours
        });
        updateFinancial({
          capexKes: d.capexKes || 0,
          year1SavingsKes: (d.monthlySavingKes || 0) * 12,
          paybackYears: d.paybackYears || 0,
          irrPct: d.irrPct || 0,
          npvKes: d.npvKes || 0
        });
        if (consumption !== site.monthlyConsumptionKwh) {
          updateSite({ monthlyConsumptionKwh: consumption });
        }
        saveProject();
        setMsg({tone:'ok', text: `✓ Auto-design complete. ${d.systemKw} kW system saved to project.`});
      } else {
        setMsg({tone:'info', text: 'Auto-designer returned a partial result. Check the BOM below.'});
      }
    } catch (e: any) {
      setMsg({tone:'err', text: e?.message || 'Auto-design failed.'});
    } finally {
      setLoading(false);
    }
  }

  return (
    <Wrap>
      <Title>📐 System Designer (Auto)</Title>
      <p style={{color:'rgba(255,255,255,0.65)', marginTop:0}}>
        Picks the best panel/inverter/battery combo from the real equipment library
        for your site &amp; load. Results flow into Wiring, Viewer 3D and Reports.
      </p>

      <Card>
        <h3 style={{color:'#00D9FF', marginTop:0}}>Inputs</h3>
        <Grid>
          <Field>
            Site
            <input value={site.displayName || (site.lat != null ? `${site.lat?.toFixed(3)}, ${site.lon?.toFixed(3)}` : 'Not set — open Mission Control')} disabled />
          </Field>
          <Field>
            Roof area (m²)
            <input value={site.roofAreaM2 ?? 'unknown'} disabled />
          </Field>
          <Field>
            Monthly consumption (kWh)
            <input type="number" min={0} value={consumption || ''} onChange={e => setConsumption(parseFloat(e.target.value) || 0)} />
          </Field>
          <Field>
            Autonomy days
            <input type="number" min={0} max={5} step={0.5} value={autonomyDays} onChange={e => setAutonomyDays(parseFloat(e.target.value) || 1)} />
          </Field>
          <Field>
            Budget cap KES (optional)
            <input type="number" min={0} value={budget || ''} onChange={e => setBudget(parseFloat(e.target.value) || 0)} />
          </Field>
        </Grid>
        <div style={{display:'flex', gap:'0.75rem', marginTop:'1.25rem', flexWrap:'wrap'}}>
          <Btn onClick={runAutoDesign} disabled={loading}>
            {loading ? 'Designing…' : '🤖 Run auto-design'}
          </Btn>
          <Btn $variant="ghost" onClick={() => nav('/wiring')} disabled={metrics.systemSizeKw === 0}>
            → Wiring diagram
          </Btn>
          <Btn $variant="ghost" onClick={() => nav('/viewer-3d')} disabled={metrics.panelCount === 0}>
            → 3D viewer
          </Btn>
          <Btn $variant="ghost" onClick={() => nav('/report')} disabled={metrics.systemSizeKw === 0}>
            → Generate proposal
          </Btn>
        </div>
        {msg && <Banner $tone={msg.tone}>{msg.text}</Banner>}
        {libCount && (
          <div style={{marginTop:'0.75rem', fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', fontFamily:'JetBrains Mono, monospace'}}>
            Equipment library: {libCount.p} panels · {libCount.i} inverters · {libCount.b} batteries
          </div>
        )}
      </Card>

      {bom.length > 0 && (
        <Card>
          <h3 style={{color:'#00D9FF', marginTop:0}}>Bill of Materials</h3>
          <BomTable>
            <thead>
              <tr>
                <th>Item</th><th>Qty</th><th>Unit (KSh)</th><th>Total (KSh)</th>
              </tr>
            </thead>
            <tbody>
              {bom.map((row, i) => {
                const item = Array.isArray(row) ? row[0] : (row.item || row.name);
                const qty = Array.isArray(row) ? row[1] : (row.qty || row.quantity);
                const unit = Array.isArray(row) ? row[2] : (row.unitPrice || row.price);
                const total = Array.isArray(row) ? row[3] : (row.total || (qty * unit));
                return (
                  <tr key={i}>
                    <td>{item || '—'}</td>
                    <td>{qty ?? '—'}</td>
                    <td>{Number.isFinite(unit) ? Math.round(unit).toLocaleString() : '—'}</td>
                    <td>{Number.isFinite(total) ? Math.round(total).toLocaleString() : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </BomTable>
        </Card>
      )}

      {metrics.systemSizeKw > 0 && (
        <Card>
          <h3 style={{color:'#00D9FF', marginTop:0}}>Current design (in project)</h3>
          <Grid>
            <Field>System size <input value={`${metrics.systemSizeKw.toFixed(2)} kW`} disabled /></Field>
            <Field>Panels <input value={`${metrics.panelCount} × ${design.panelW}W`} disabled /></Field>
            <Field>Inverter <input value={design.inverterKw ? `${design.inverterKw.toFixed(1)} kW` : '—'} disabled /></Field>
            <Field>Battery <input value={design.batteryKwh ? `${design.batteryKwh.toFixed(1)} kWh` : '—'} disabled /></Field>
            <Field>CAPEX <input value={`KSh ${Math.round(metrics.totalCost).toLocaleString()}`} disabled /></Field>
            <Field>Payback <input value={`${metrics.paybackPeriods.toFixed(1)} yrs`} disabled /></Field>
          </Grid>
        </Card>
      )}
    </Wrap>
  );
};

export default DesignerPage;
