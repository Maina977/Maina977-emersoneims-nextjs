import React, { useState } from 'react';
import styled from 'styled-components';
import { useSolarStore } from '../services/store';
import { reports, downloadBlob } from '../services/api';
import { proposalFinance } from '../services/proposalFinance';
import { BATTERY_KES_PER_KWH, PANEL_KES_PER_W, PANEL_WATT, tieredKes, inverterBands, type SystemType } from '@/lib/solar/sizing';

// Real proposal generator.
// Fills in client + brand + site + design + financial from the shared
// Project store, lets the user override anything inline, then POSTs the
// payload to /api/reports/proposal which returns a PDF blob (server-side
// jsPDF). The blob is downloaded directly. No fake "txt" export.

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
  margin: 0 0 1.5rem;
  color: rgba(230, 241, 255, 0.55);
  font-size: 0.85rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 1.5rem;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: rgba(42, 48, 80, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
`;

const Section = styled.h3`
  color: #00D9FF;
  margin: 1rem 0 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid rgba(0, 217, 255, 0.2);
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  &:first-child { margin-top: 0; }
`;

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.6rem;
`;

const Label = styled.label`
  color: rgba(0, 217, 255, 0.85);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
  font-weight: 700;
`;

const Input = styled.input`
  padding: 0.55rem 0.7rem;
  background: rgba(10, 14, 39, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.25);
  border-radius: 6px;
  color: white;
  font-size: 0.9rem;
  &:focus { outline: none; border-color: #00D9FF; }
`;

const TextArea = styled.textarea`
  padding: 0.55rem 0.7rem;
  background: rgba(10, 14, 39, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.25);
  border-radius: 6px;
  color: white;
  font-family: inherit;
  font-size: 0.9rem;
  min-height: 70px;
  &:focus { outline: none; border-color: #00D9FF; }
`;

const Button = styled.button<{ $primary?: boolean; disabled?: boolean }>`
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  margin-top: 0.5rem;
  width: 100%;
  background: ${(p) =>
    p.disabled
      ? 'rgba(0, 217, 255, 0.2)'
      : p.$primary
      ? 'linear-gradient(135deg, #00D9FF, #0099CC)'
      : 'rgba(255, 255, 255, 0.08)'};
  color: white;
  &:hover:not(:disabled) { transform: translateY(-1px); }
`;

const Banner = styled.div<{ $kind: 'info' | 'error' | 'ok' | 'warn' }>`
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  font-size: 0.88rem;
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

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(0, 217, 255, 0.1);
  font-size: 0.88rem;
  &:last-child { border-bottom: none; }
`;

const SummaryK = styled.span`
  color: rgba(255, 255, 255, 0.55);
`;
const SummaryV = styled.span`
  color: #00FF88;
  font-weight: 700;
`;

export default function ReportPage() {
  const {
    metrics, client, site, brand, design, financial,
    updateClient, updateBrand, updateDesign, updateFinancial, saveProject
  } = useSolarStore();

  const [proposalNo, setProposalNo] = useState(() => 'SGP-' + Date.now().toString().slice(-6));
  const [preparedBy, setPreparedBy] = useState('Eng. Lead');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const hasProject = metrics.systemSizeKw > 0 && client.name.trim().length > 0;

  const capexKes = financial.capexKes || metrics.totalCost;
  // Equipment at typical Kenyan prices (estimates), then the rest of the
  // capital cost as one balance line, so the BOM adds up to the capex used
  // in the financial section. Fixed lump sums for mounting/BOS/installation
  // (the same for 3 kWp and 30 kWp) and a battery line costed at 10 kWh when
  // there was no battery were removed (2026-10-25 audit).
  // Battery and inverter at the calculator's rates (lib/solar/sizing.ts), so
  // the BOM and the capex come from one price list.
  const offGrid = design.systemType === 'off-grid';
  const batteryLineKes = design.batteryKwh > 0 ? Math.round(design.batteryKwh * BATTERY_KES_PER_KWH) : 0;
  // The calculator's price list (lib/solar/sizing.ts), not a separate KES
  // 12,500 per panel (2026-10-30 audit).
  function inverterKes(kw: number): number {
    if (!(kw > 0)) return 0;
    return Math.round(tieredKes(kw, inverterBands((design.systemType as SystemType) || 'hybrid')));
  }
  const panelUnitKes = Math.round((design.panelW || PANEL_WATT) * PANEL_KES_PER_W);
  function buildBom() {
    const panels = design.panelCount || metrics.panelCount;
    const panelTotalKes = panels * panelUnitKes;
    const inverterCost = inverterKes(design.inverterKw);
    const rows: Array<[string, number, number, number, null]> = [
      [`${design.panelMake || 'Panel'} ${design.panelModel || ''} ${design.panelW}W`.replace(/\s+/g, ' '),
        panels, panelUnitKes, panelTotalKes, null],
    ];
    if (inverterCost > 0) {
      rows.push([`${design.inverterMake || 'Inverter'} ${design.inverterModel || ''} ${design.inverterKw}kW`.replace(/\s+/g, ' '),
        1, inverterCost, inverterCost, null]);
    }
    if (batteryLineKes > 0) {
      rows.push([`${design.batteryMake || 'Battery'} ${design.batteryModel || ''} ${design.batteryKwh}kWh`.replace(/\s+/g, ' '),
        1, batteryLineKes, batteryLineKes, null]);
    }
    const equipment = rows.reduce((s, r) => s + r[3], 0);
    const balance = Math.round(capexKes - equipment);
    if (balance > 0) {
      rows.push(['Mounting, cabling, protection, installation & commissioning (balance of the estimate)',
        1, balance, balance, null]);
    }
    return rows;
  }
  const finance = proposalFinance({
    capexKes,
    year1SavingsKes: financial.year1SavingsKes,
    batteryReplacement: batteryLineKes > 0 ? { year: 12, costKes: batteryLineKes } : null,
  });

  function buildProposalPayload() {
    const annualProduction = metrics.annualProduction;
    const monthlyKwh = site.monthlyConsumptionKwh;
    // Share of the annual consumption the array produces; unknown without a
    // consumption figure (it was a fixed 92 %).
    const annualOffsetPct = monthlyKwh && monthlyKwh > 0 && annualProduction > 0
      ? Math.min(100, Math.round(annualProduction / (monthlyKwh * 12) * 100)) : null;
    const a = finance.assumptions;
    return {
      brand,
      customer: {
        name: client.name,
        site: client.address || site.displayName || '—',
        email: client.email,
        phone: client.phone,
        referenceNo: client.referenceNo || proposalNo,
        currency: 'KES'
      },
      project: { proposalNo, preparedBy, notes },
      site: {
        lat: site.lat,
        lon: site.lon,
        elevationM: site.elevationM,
        climateZone: 'East Africa',
        irradianceKwhPerM2Day: site.irradianceKwhPerM2Day || metrics.peakSunHours,
        irradianceSource: site.irradianceSource || (site.irradianceKwhPerM2Day ? 'nasa-power' : 'kenya-typical'),
        monthlyConsumptionKwh: monthlyKwh ?? null,
        peakDemandKw: null,
        // Off-grid savings are against diesel, so no grid tariff is shown.
        tariffKesPerKwh: offGrid ? null : site.tariffKesPerKwh,
        tariffSchedule: offGrid ? 'Not applicable: off-grid, savings are against diesel generation' : 'Kenya Power retail (as entered)',
        gridReliabilityNotes: site.gridReliabilityNotes
      },
      design: {
        systemKw: design.systemKw || metrics.systemSizeKw,
        panelCount: design.panelCount || metrics.panelCount,
        panelW: design.panelW,
        panelMake: design.panelMake,
        panelModel: design.panelModel,
        inverterKw: design.inverterKw,
        inverterMake: design.inverterMake,
        inverterModel: design.inverterModel,
        batteryKwh: design.batteryKwh,
        batteryMake: design.batteryMake,
        batteryModel: design.batteryModel,
        tiltDeg: design.tiltDeg,
        azimuthDeg: design.azimuthDeg,
        systemType: design.systemType,
        stringConfig: 'auto-sized by Calculator',
        specificYieldKwhPerKwp:
          metrics.systemSizeKw > 0
            ? Math.round(metrics.annualProduction / metrics.systemSizeKw)
            : 0,
        annualOffsetPct,
        bom: buildBom()
      },
      financial: {
        capexKes,
        year1SavingsKes: financial.year1SavingsKes,
        paybackYears: finance.paybackYears,
        irrPct: finance.irrPct,
        npvKes: finance.npvKes,
        // Sent so the server's recomputed cash flow matches this page.
        batteryReplacement: batteryLineKes > 0 ? { year: 12, costKes: batteryLineKes } : null,
        discountRatePct: a.discountRatePct,
        tariffEscalationPct: a.tariffEscalationPct,
        panelDegradationPct: a.panelDegradationPct,
        // Loan examples with invented bank rates were removed (2026-10-27
        // audit): financing terms come from the lender, not this proposal.
        cashFlowTable: finance.cashFlowTable
      },
      warranties: [
        ['Modules', 'Typically 12–15', 'Typically 25–30', 'Confirm on the selected datasheet'],
        ['Inverter', 'Typically 5–10', '—', 'Confirm on the selected datasheet'],
        ['Battery', 'Typically 10', '—', 'Confirm cycles and end-of-warranty capacity on the datasheet'],
        ['Workmanship', '2', '—', 'From commissioning']
      ],
      scope: {
        included: [
          'Design and single-line diagram',
          'Supply of the listed equipment',
          'Roof and structure check at the site survey',
          'Installation, testing and commissioning',
          'Workmanship warranty: 2 years from commissioning'
        ],
        excluded: offGrid
          ? ['Civil and building works', 'Generator supply or servicing (unless quoted separately)']
          : ['Civil and building works', 'Kenya Power connection or metering fees'],
        deliverables: [
          'Single-line diagram',
          'As-built drawings',
          'Operation and maintenance notes',
          'Test and commissioning record'
        ]
      },
      env: {
        // 25 years with the cash flow's 0.5%/yr panel degradation.
        lifetimeMwh: Math.round(annualProduction * (a.panelDegradationPct > 0 ? (1 - Math.pow(1 - a.panelDegradationPct / 100, 25)) / (a.panelDegradationPct / 100) : 25) / 1000),
        // The calculator's CO2: diesel displaced (2.68 kg/L) or grid energy
        // replaced (0.213 kg/kWh, Kenya's mostly renewable grid). A flat 0.82
        // kg/kWh overstated it several times over (2026-10-18 tool audit).
        // 25 years with 0.5%/yr panel degradation, as lifetimeMwh (2026-10-30 audit).
        co2AvoidedTonnes: metrics.carbonOffsetKg > 0 ? Math.round((metrics.carbonOffsetKg * ((1 - Math.pow(0.995, 25)) / 0.005)) / 1000) : null,
        treesEquivalent: null,
        carsEquivalent: null
      },
      provenance: [
        offGrid
          ? { label: 'Diesel KSh ' + (site.dieselKesPerLitre ?? '-') + '/L', source: 'Used by the calculator for the diesel displaced (entered by the client, or the stated default)',
              url: 'internal', retrievedIso: new Date().toISOString().slice(0, 10) }
          : { label: 'Tariff KSh ' + site.tariffKesPerKwh + '/kWh', source: 'Used by the calculator (entered by the client as total bill ÷ kWh, or the stated default)',
              url: 'internal', retrievedIso: new Date().toISOString().slice(0, 10) },
        { label: 'Equipment pricing', source: 'Typical Kenyan installed prices (estimate, not a quotation)',
          url: 'internal', retrievedIso: new Date().toISOString().slice(0, 10) },
        { label: 'Cash flow assumptions',
          source: `${offGrid ? 'Diesel price' : 'Tariff'} held flat (+${a.tariffEscalationPct}%/yr), panel output -${a.panelDegradationPct}%/yr, O&M ${a.omPctOfCapex}% of capex/yr`
            + (batteryLineKes > 0 ? ', one battery replacement in year 12 at today\'s price' : '')
            + `, NPV at ${a.discountRatePct}%.`,
          url: 'internal', retrievedIso: new Date().toISOString().slice(0, 10) }
      ]
    };
  }

  async function handleGenerate() {
    setError(null);
    setOkMsg(null);

    if (!client.name.trim()) {
      setError('Enter at least the client name before generating the proposal.');
      return;
    }
    if (metrics.systemSizeKw <= 0) {
      setError('Run the Calculator first so the system is sized.');
      return;
    }

    setLoading(true);
    try {
      const payload = buildProposalPayload();

      const blob: any = await reports.proposalBlob(payload);
      if (!(blob instanceof Blob)) throw new Error('Server did not return a PDF');
      const filename =
        (client.name.replace(/[^A-Za-z0-9]+/g, '_') || 'Proposal') +
        '_' + proposalNo + '.pdf';
      downloadBlob(blob, filename);
      saveProject();
      setOkMsg('✓ ' + filename + ' downloaded.');
    } catch (err: any) {
      setError(err?.message || 'Proposal generation failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateFormat(fmt: 'pdf' | 'docx' | 'xlsx') {
    if (fmt === 'pdf') return handleGenerate();
    setError(null); setOkMsg(null); setLoading(true);
    try {
      // Build the same payload as PDF — re-use handleGenerate's logic by
      // calling the underlying builder.  We replicate the minimal payload
      // that buildProposalDocx / buildProposalXlsx need.
      const payload = buildProposalPayload();
      const call = fmt === 'docx' ? reports.proposalDocxBlob : reports.proposalXlsxBlob;
      const blob: any = await call(payload);
      if (!(blob instanceof Blob)) throw new Error(`Server did not return a ${fmt.toUpperCase()}`);
      const filename =
        (client.name.replace(/[^A-Za-z0-9]+/g, '_') || 'Proposal') +
        '_' + proposalNo + '.' + fmt;
      downloadBlob(blob, filename);
      saveProject();
      setOkMsg('✓ ' + filename + ' downloaded.');
    } catch (err: any) {
      setError(err?.message || `${fmt.toUpperCase()} generation failed.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Title>📋 Proposal Generator</Title>
      <Sub>
        Generate a branded, indicative design proposal in PDF, Word or Excel:
        cover, executive summary, site assessment, system design, bill of
        materials, 25-year cash flow, warranties, scope, assumptions and the
        data sources used. It is an estimate, not a quotation; a site survey
        confirms the design and price.
      </Sub>

      <Grid>
        <Card>
          <Section>Client</Section>
          <Row2>
            <Field>
              <Label>Client / company name</Label>
              <Input aria-label="Client name" value={client.name} onChange={(e) => updateClient({ name: e.target.value })} />
            </Field>
            <Field>
              <Label>Reference no.</Label>
              <Input aria-label="Client reference" value={client.referenceNo} onChange={(e) => updateClient({ referenceNo: e.target.value })} />
            </Field>
          </Row2>
          <Row2>
            <Field>
              <Label>Email</Label>
              <Input type="email" aria-label="Client email" value={client.email} onChange={(e) => updateClient({ email: e.target.value })} />
            </Field>
            <Field>
              <Label>Phone</Label>
              <Input aria-label="Client phone" value={client.phone} onChange={(e) => updateClient({ phone: e.target.value })} />
            </Field>
          </Row2>
          <Field>
            <Label>Site / installation address</Label>
            <Input aria-label="Site address" value={client.address} onChange={(e) => updateClient({ address: e.target.value })} />
          </Field>

          <Section>Brand (yours)</Section>
          <Row2>
            <Field>
              <Label>Company name</Label>
              <Input aria-label="Company name" value={brand.companyName} onChange={(e) => updateBrand({ companyName: e.target.value })} />
            </Field>
            <Field>
              <Label>Tagline</Label>
              <Input aria-label="Tagline" value={brand.tagline} onChange={(e) => updateBrand({ tagline: e.target.value })} />
            </Field>
          </Row2>
          <Row2>
            <Field>
              <Label>Contact email</Label>
              <Input aria-label="Contact email" value={brand.contactEmail} onChange={(e) => updateBrand({ contactEmail: e.target.value })} />
            </Field>
            <Field>
              <Label>Contact phone</Label>
              <Input aria-label="Contact phone" value={brand.contactPhone} onChange={(e) => updateBrand({ contactPhone: e.target.value })} />
            </Field>
          </Row2>

          <Section>Equipment selection (optional override)</Section>
          <Row2>
            <Field>
              <Label>Panel make</Label>
              <Input aria-label="Panel make" value={design.panelMake} onChange={(e) => updateDesign({ panelMake: e.target.value })} placeholder="JA Solar" />
            </Field>
            <Field>
              <Label>Panel model</Label>
              <Input aria-label="Panel model" value={design.panelModel} onChange={(e) => updateDesign({ panelModel: e.target.value })} placeholder="JAM72D40-580" />
            </Field>
          </Row2>
          <Row2>
            <Field>
              <Label>Inverter make</Label>
              <Input aria-label="Inverter make" value={design.inverterMake} onChange={(e) => updateDesign({ inverterMake: e.target.value })} placeholder="Sungrow" />
            </Field>
            <Field>
              <Label>Inverter model</Label>
              <Input aria-label="Inverter model" value={design.inverterModel} onChange={(e) => updateDesign({ inverterModel: e.target.value })} placeholder="SG5K-D" />
            </Field>
          </Row2>
          <Row2>
            <Field>
              <Label>Battery make</Label>
              <Input aria-label="Battery make" value={design.batteryMake} onChange={(e) => updateDesign({ batteryMake: e.target.value })} placeholder="BYD" />
            </Field>
            <Field>
              <Label>Battery model</Label>
              <Input aria-label="Battery model" value={design.batteryModel} onChange={(e) => updateDesign({ batteryModel: e.target.value })} placeholder="HVS 10.2" />
            </Field>
          </Row2>

          <Section>Project</Section>
          <Row2>
            <Field>
              <Label>Proposal no.</Label>
              <Input aria-label="Proposal number" value={proposalNo} onChange={(e) => setProposalNo(e.target.value)} />
            </Field>
            <Field>
              <Label>Prepared by</Label>
              <Input aria-label="Prepared by" value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} />
            </Field>
          </Row2>
          <Field>
            <Label>Notes (optional)</Label>
            <TextArea aria-label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>

          <div style={{
            marginTop: 14,
            padding: '14px 14px 12px',
            borderRadius: 12,
            background: 'linear-gradient(180deg, rgba(11,132,87,0.10), rgba(11,132,87,0.02))',
            border: '1px solid rgba(11,132,87,0.35)'
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, color: '#0B8457', textTransform: 'uppercase', marginBottom: 8 }}>
              Export proposal
            </div>
            <Button $primary onClick={handleGenerate} disabled={loading || !hasProject} style={{ width: '100%' }}>
              {loading ? <><Spinner /> Generating…</> : '📥 Download branded PDF'}
            </Button>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button onClick={() => handleGenerateFormat('docx')} disabled={loading || !hasProject} style={{ flex: 1 }}>
                📝 Word
              </Button>
              <Button onClick={() => handleGenerateFormat('xlsx')} disabled={loading || !hasProject} style={{ flex: 1 }}>
                📊 Excel
              </Button>
            </div>
            <div style={{ fontSize: 11.5, color: 'rgba(230,241,255,0.6)', marginTop: 10, lineHeight: 1.5 }}>
              Each format contains the same proposal: system design, bill of
              materials, financials with a 25-year cash flow, warranties, scope,
              assumptions and data sources.
            </div>
          </div>

          {!hasProject && (
            <Banner $kind="warn">
              ⚠ Need a sized system + client name. Run <b>Calculator</b> first, then come back.
            </Banner>
          )}
          {error && <Banner $kind="error">⚠ {error}</Banner>}
          {okMsg && <Banner $kind="ok">{okMsg}</Banner>}
        </Card>

        <Card>
          <Section>Live Project Summary</Section>
          <SummaryRow><SummaryK>Client</SummaryK><SummaryV>{client.name || '—'}</SummaryV></SummaryRow>
          <SummaryRow><SummaryK>Site</SummaryK><SummaryV>{client.address || site.displayName || '—'}</SummaryV></SummaryRow>
          <SummaryRow><SummaryK>Coordinates</SummaryK>
            <SummaryV>{site.lat != null && site.lon != null ? `${site.lat.toFixed(4)}, ${site.lon.toFixed(4)}` : '—'}</SummaryV>
          </SummaryRow>
          <SummaryRow><SummaryK>Irradiance (NASA)</SummaryK>
            <SummaryV>{site.irradianceKwhPerM2Day != null ? site.irradianceKwhPerM2Day + ' kWh/m²/day' : '—'}</SummaryV>
          </SummaryRow>

          <Section>System</Section>
          <SummaryRow><SummaryK>System size</SummaryK><SummaryV>{metrics.systemSizeKw} kW</SummaryV></SummaryRow>
          <SummaryRow><SummaryK>Panels</SummaryK><SummaryV>{metrics.panelCount}</SummaryV></SummaryRow>
          <SummaryRow><SummaryK>Inverter</SummaryK><SummaryV>{design.inverterKw} kW</SummaryV></SummaryRow>
          <SummaryRow><SummaryK>Battery</SummaryK><SummaryV>{design.batteryKwh} kWh</SummaryV></SummaryRow>
          <SummaryRow><SummaryK>Annual yield</SummaryK><SummaryV>{metrics.annualProduction} kWh</SummaryV></SummaryRow>

          <Section>Financial</Section>
          <SummaryRow><SummaryK>CAPEX</SummaryK><SummaryV>KSh {Math.round((financial.capexKes || metrics.totalCost) / 1000)}k</SummaryV></SummaryRow>
          <SummaryRow><SummaryK>Year-1 saving</SummaryK><SummaryV>KSh {Math.round(financial.year1SavingsKes / 1000)}k</SummaryV></SummaryRow>
          <SummaryRow><SummaryK>Payback (proposal cash flow)</SummaryK><SummaryV>{finance.paybackYears != null ? `${finance.paybackYears} yrs` : 'Not within 25 years'}</SummaryV></SummaryRow>

          <Banner $kind="info">
            All values pulled live from the project store (Calculator output → here).
            You can override anything in the form on the left before exporting.
          </Banner>
        </Card>
      </Grid>
    </Container>
  );
}
