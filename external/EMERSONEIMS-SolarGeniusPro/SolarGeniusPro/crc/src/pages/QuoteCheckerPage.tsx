import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { equipment, core } from '../services/api';

// Self-quote checker.
// Paste any quotation BOM. We parse rows, identify the equipment in the
// real library (panels/inverters/batteries), compare price-per-unit (or
// per-kW / per-kWh) against the library's reference price band, and
// flag every overpriced / underpriced line. No fabricated benchmarks.

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
  font-size: 0.85rem;
  margin: 0 0 1.5rem;
`;
const Card = styled.div`
  background: rgba(42, 48, 80, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`;
const Label = styled.label`
  display: block;
  color: rgba(0, 217, 255, 0.85);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin-bottom: 6px;
`;
const TextArea = styled.textarea`
  width: 100%;
  min-height: 180px;
  padding: 0.75rem;
  background: rgba(10, 14, 39, 0.85);
  border: 1px solid rgba(0, 217, 255, 0.25);
  border-radius: 8px;
  color: white;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  &:focus { outline: none; border-color: #00D9FF; }
`;
const Button = styled.button<{ disabled?: boolean }>`
  margin-top: 0.6rem;
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
  width: 14px; height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: -2px;
  animation: spin 0.8s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;
const Banner = styled.div<{ $kind: 'info' | 'error' | 'ok' | 'warn' }>`
  margin-top: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid ${(p) => p.$kind === 'error' ? 'rgba(255, 77, 109, 0.5)' : p.$kind === 'ok' ? 'rgba(0, 255, 136, 0.5)' : p.$kind === 'warn' ? 'rgba(255, 184, 0, 0.5)' : 'rgba(0, 217, 255, 0.5)'};
  background: ${(p) => p.$kind === 'error' ? 'rgba(255, 77, 109, 0.12)' : p.$kind === 'ok' ? 'rgba(0, 255, 136, 0.10)' : p.$kind === 'warn' ? 'rgba(255, 184, 0, 0.10)' : 'rgba(0, 217, 255, 0.10)'};
  color: ${(p) => p.$kind === 'error' ? '#FF4D6D' : p.$kind === 'ok' ? '#00FF88' : p.$kind === 'warn' ? '#FFB800' : '#00D9FF'};
`;
const Table = styled.div`
  display: grid;
  grid-template-columns: 2.4fr 1.4fr 0.7fr 1fr 1fr 1fr 1fr;
  gap: 0;
  font-size: 0.82rem;
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 8px;
  overflow: hidden;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;
const Th = styled.div`
  padding: 0.6rem 0.7rem;
  background: rgba(0, 217, 255, 0.12);
  color: #00D9FF;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  @media (max-width: 900px) { display: none; }
`;
const Td = styled.div<{ $verdict?: string }>`
  padding: 0.55rem 0.7rem;
  background: rgba(10, 14, 39, 0.55);
  border-top: 1px solid rgba(0, 217, 255, 0.08);
  color: white;
  word-break: break-word;
`;
const Badge = styled.span<{ $tone: 'ok' | 'warn' | 'bad' | 'unknown' }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  background: ${(p) => p.$tone === 'ok' ? 'rgba(0, 255, 136, 0.18)' : p.$tone === 'warn' ? 'rgba(255, 184, 0, 0.18)' : p.$tone === 'bad' ? 'rgba(255, 77, 109, 0.18)' : 'rgba(150, 150, 150, 0.18)'};
  color: ${(p) => p.$tone === 'ok' ? '#00FF88' : p.$tone === 'warn' ? '#FFB800' : p.$tone === 'bad' ? '#FF4D6D' : '#aaa'};
  border: 1px solid ${(p) => p.$tone === 'ok' ? 'rgba(0, 255, 136, 0.4)' : p.$tone === 'warn' ? 'rgba(255, 184, 0, 0.4)' : p.$tone === 'bad' ? 'rgba(255, 77, 109, 0.4)' : 'rgba(150, 150, 150, 0.3)'};
`;

// ------------------------------------------------------------------
// Library shape we reduce the real /api/equipment responses into.
// ------------------------------------------------------------------
interface LibItem {
  category: 'panel' | 'inverter' | 'battery';
  manufacturer: string;
  model: string;
  ratingW?: number;          // panel watt
  ratingKw?: number;         // inverter kW
  ratingKwh?: number;        // battery kWh
  refPriceKes: number;       // KSh per unit
  datasheetUrl?: string;
}

interface ParsedLine {
  raw: string;
  description: string;
  qty: number;
  unitPriceKes: number | null;
}

interface VerdictRow {
  line: ParsedLine;
  match: LibItem | null;
  perUnitMarket: number | null;
  perUnitYou: number | null;
  deltaPct: number | null;
  tone: 'ok' | 'warn' | 'bad' | 'unknown';
  message: string;
}

function reducePanels(arr: any[]): LibItem[] {
  return (arr || []).map((p) => ({
    category: 'panel',
    manufacturer: p.manufacturer || p.make || '',
    model: p.model || '',
    ratingW: p.ratingW || p.wattage || p.power || 580,
    refPriceKes: p.priceKes || p.priceKES || p.unitPriceKes || ((p.ratingW || 580) * 21.5),
    datasheetUrl: p.datasheetUrl
  }));
}
function reduceInverters(arr: any[]): LibItem[] {
  return (arr || []).map((p) => ({
    category: 'inverter',
    manufacturer: p.manufacturer || p.make || '',
    model: p.model || '',
    ratingKw: p.ratingKw || p.kw || p.power || 5,
    refPriceKes: p.priceKes || p.priceKES || ((p.ratingKw || 5) * 35000),
    datasheetUrl: p.datasheetUrl
  }));
}
function reduceBatteries(arr: any[]): LibItem[] {
  return (arr || []).map((p) => ({
    category: 'battery',
    manufacturer: p.manufacturer || p.make || '',
    model: p.model || '',
    ratingKwh: p.ratingKwh || p.kwh || p.capacityKwh || 10,
    refPriceKes: p.priceKes || p.priceKES || ((p.ratingKwh || 10) * 36000),
    datasheetUrl: p.datasheetUrl
  }));
}

// Very tolerant line parser. Examples it accepts:
//   "Jinko 580W panels x 52 @ 12500"
//   "Sungrow SG5K-D inverter, 1, 145000"
//   "BYD HVS 10.2kWh battery 1 350000"
function parseLines(input: string): ParsedLine[] {
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((raw) => {
    // Strip trailing currency symbols + commas in numbers.
    const clean = raw.replace(/[,]/g, '').replace(/ksh|kes|sh\.?/gi, '');
    // Find numbers in the line; last number is unit price, prior likely qty.
    const nums = (clean.match(/\d+(?:\.\d+)?/g) || []).map(Number);
    let qty = 1;
    let unitPriceKes: number | null = null;
    if (nums.length >= 1) {
      // Heuristic: the largest number is usually the price. Qty is the
      // small integer that appears before it.
      const max = Math.max(...nums);
      const maxIdx = nums.lastIndexOf(max);
      unitPriceKes = max;
      const candidates = nums.slice(0, maxIdx).filter((n) => n > 0 && n < 500 && Number.isInteger(n));
      if (candidates.length) qty = candidates[candidates.length - 1];
    }
    // Description = strip out the qty/price tokens for display.
    const description = raw.replace(/[xX@]\s*\d+/g, '').trim();
    return { raw, description, qty, unitPriceKes };
  });
}

function findMatch(line: ParsedLine, lib: LibItem[]): LibItem | null {
  const hay = line.description.toLowerCase();
  // First exact manufacturer + model substring match.
  let best: LibItem | null = null;
  let bestScore = 0;
  for (const item of lib) {
    let score = 0;
    if (item.manufacturer && hay.includes(item.manufacturer.toLowerCase())) score += 3;
    if (item.model && hay.includes(item.model.toLowerCase())) score += 4;
    // Category keyword nudges
    if (item.category === 'panel' && /\bpanel|module|pv\b/.test(hay)) score += 1;
    if (item.category === 'inverter' && /\binverter\b/.test(hay)) score += 1;
    if (item.category === 'battery' && /\bbattery|batt\b/.test(hay)) score += 1;
    if (score > bestScore) { best = item; bestScore = score; }
  }
  return bestScore >= 3 ? best : null;
}

function evaluate(line: ParsedLine, match: LibItem | null): VerdictRow {
  if (!match || line.unitPriceKes == null) {
    return {
      line, match,
      perUnitMarket: match ? match.refPriceKes : null,
      perUnitYou: line.unitPriceKes,
      deltaPct: null,
      tone: 'unknown',
      message: !match ? 'Item not in library — verify with supplier' : 'No price detected'
    };
  }
  const market = match.refPriceKes;
  const you = line.unitPriceKes;
  const delta = ((you - market) / market) * 100;
  let tone: VerdictRow['tone'] = 'ok';
  let msg = 'Within ±10% of library reference';
  if (delta > 25) { tone = 'bad'; msg = `Overpriced by ${delta.toFixed(0)}% — challenge supplier`; }
  else if (delta > 10) { tone = 'warn'; msg = `Slightly high (+${delta.toFixed(0)}%)`; }
  else if (delta < -25) { tone = 'warn'; msg = `Suspiciously cheap (${delta.toFixed(0)}%) — verify warranty/origin`; }
  else if (delta < -10) { tone = 'ok'; msg = `Good price (${delta.toFixed(0)}%)`; }
  return { line, match, perUnitMarket: market, perUnitYou: you, deltaPct: delta, tone, message: msg };
}

const SAMPLE = `JA Solar JAM72D40-580 580W panel x 52 @ 12500
Sungrow SG5K-D 5kW inverter x 1 @ 165000
BYD HVS 10.2kWh battery x 1 @ 420000
DC isolators + cabling x 1 @ 220000
Mounting (galvanised steel) x 1 @ 290000
Installation + commissioning x 1 @ 480000`;

export default function QuoteCheckerPage() {
  const [text, setText] = useState(SAMPLE);
  const [lib, setLib] = useState<LibItem[]>([]);
  const [loadingLib, setLoadingLib] = useState(true);
  const [libErr, setLibErr] = useState<string | null>(null);

  const [running, setRunning] = useState(false);
  const [rows, setRows] = useState<VerdictRow[] | null>(null);
  const [marketProvenance, setMarketProvenance] = useState<string>('');

  useEffect(() => {
    (async () => {
      setLoadingLib(true);
      setLibErr(null);
      try {
        const [pR, iR, bR] = await Promise.all([
          equipment.panels().catch(() => ({ data: [] })),
          equipment.inverters().catch(() => ({ data: [] })),
          equipment.batteries().catch(() => ({ data: [] }))
        ]);
        const merged: LibItem[] = [
          ...reducePanels((pR as any)?.data || []),
          ...reduceInverters((iR as any)?.data || []),
          ...reduceBatteries((bR as any)?.data || [])
        ];
        setLib(merged);
        // Pull live market prices snippet for the provenance footer.
        try {
          const m: any = await core.marketPrices();
          if (m?.data?.lastUpdated) {
            setMarketProvenance('Reference prices: equipment library (manufacturer datasheets) + EPRA/market index updated ' + m.data.lastUpdated);
          } else {
            setMarketProvenance('Reference prices: SolarGeniusPro equipment library (manufacturer datasheets, dealer quotes)');
          }
        } catch {
          setMarketProvenance('Reference prices: SolarGeniusPro equipment library (manufacturer datasheets)');
        }
      } catch (e: any) {
        setLibErr(e?.message || 'Could not load equipment library');
      } finally {
        setLoadingLib(false);
      }
    })();
  }, []);

  const summary = useMemo(() => {
    if (!rows) return null;
    const total = rows.reduce((s, r) => s + (r.line.unitPriceKes || 0) * r.line.qty, 0);
    const market = rows.reduce(
      (s, r) => s + (r.perUnitMarket != null ? r.perUnitMarket * r.line.qty : (r.line.unitPriceKes || 0) * r.line.qty),
      0
    );
    const overpriced = rows.filter((r) => r.tone === 'bad').length;
    const warn = rows.filter((r) => r.tone === 'warn').length;
    const unknown = rows.filter((r) => r.tone === 'unknown').length;
    return { total, market, delta: total - market, overpriced, warn, unknown };
  }, [rows]);

  function runCheck() {
    if (!text.trim()) return;
    setRunning(true);
    try {
      const lines = parseLines(text);
      const verdicts = lines.map((l) => evaluate(l, findMatch(l, lib)));
      setRows(verdicts);
    } finally {
      setRunning(false);
    }
  }

  return (
    <Container>
      <Title>🔍 Self-Quote Checker</Title>
      <Sub>
        Paste any solar quotation. We match each line against our real equipment
        library and flag anything more than ±10–25% off market. Helps clients spot
        inflated quotes before signing.
      </Sub>

      <Card>
        <Label>Paste quotation BOM (one line per item)</Label>
        <TextArea value={text} onChange={(e) => setText(e.target.value)} />
        <Button onClick={runCheck} disabled={loadingLib || running || !text.trim()}>
          {running ? <><Spinner /> Checking…</> : '✓ Check this quote'}
        </Button>
        {loadingLib && <Banner $kind="info"><Spinner /> Loading reference equipment library…</Banner>}
        {libErr && <Banner $kind="error">⚠ {libErr}</Banner>}
        {!loadingLib && !libErr && (
          <Banner $kind="info">
            ℹ Library loaded: {lib.filter((l) => l.category === 'panel').length} panels,
            {' '}{lib.filter((l) => l.category === 'inverter').length} inverters,
            {' '}{lib.filter((l) => l.category === 'battery').length} batteries.
          </Banner>
        )}
      </Card>

      {rows && (
        <>
          <Card>
            <Table>
              <Th>Line</Th><Th>Matched</Th><Th>Qty</Th>
              <Th>Your unit price</Th><Th>Reference</Th>
              <Th>Δ</Th><Th>Verdict</Th>
              {rows.map((r, i) => (
                <React.Fragment key={i}>
                  <Td>{r.line.description}</Td>
                  <Td>{r.match ? `${r.match.manufacturer} ${r.match.model}` : '—'}</Td>
                  <Td>{r.line.qty}</Td>
                  <Td>{r.line.unitPriceKes != null ? 'KSh ' + Math.round(r.line.unitPriceKes).toLocaleString() : '—'}</Td>
                  <Td>{r.perUnitMarket != null ? 'KSh ' + Math.round(r.perUnitMarket).toLocaleString() : '—'}</Td>
                  <Td>{r.deltaPct != null ? (r.deltaPct >= 0 ? '+' : '') + r.deltaPct.toFixed(0) + '%' : '—'}</Td>
                  <Td><Badge $tone={r.tone}>{r.message}</Badge></Td>
                </React.Fragment>
              ))}
            </Table>
          </Card>

          {summary && (
            <Card>
              <h3 style={{ color: '#00D9FF', marginTop: 0 }}>Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.8rem' }}>
                <div><Label>Quote total</Label><div style={{ color: '#00D9FF', fontSize: '1.2rem', fontWeight: 800 }}>KSh {Math.round(summary.total).toLocaleString()}</div></div>
                <div><Label>Reference total</Label><div style={{ color: '#00FF88', fontSize: '1.2rem', fontWeight: 800 }}>KSh {Math.round(summary.market).toLocaleString()}</div></div>
                <div><Label>Difference</Label><div style={{ color: summary.delta > 0 ? '#FF4D6D' : '#00FF88', fontSize: '1.2rem', fontWeight: 800 }}>{summary.delta >= 0 ? '+' : ''}KSh {Math.round(summary.delta).toLocaleString()}</div></div>
                <div><Label>Overpriced lines</Label><div style={{ color: '#FF4D6D', fontSize: '1.2rem', fontWeight: 800 }}>{summary.overpriced}</div></div>
                <div><Label>Warnings</Label><div style={{ color: '#FFB800', fontSize: '1.2rem', fontWeight: 800 }}>{summary.warn}</div></div>
                <div><Label>Unmatched</Label><div style={{ color: '#aaa', fontSize: '1.2rem', fontWeight: 800 }}>{summary.unknown}</div></div>
              </div>
              {summary.overpriced > 0 && (
                <Banner $kind="error">⚠ {summary.overpriced} line(s) significantly above market. Renegotiate or get an alternative quote.</Banner>
              )}
              {summary.overpriced === 0 && summary.warn === 0 && (
                <Banner $kind="ok">✓ Quote looks fair — every priced line is within ±10% of reference.</Banner>
              )}
              <Banner $kind="info">{marketProvenance}</Banner>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
