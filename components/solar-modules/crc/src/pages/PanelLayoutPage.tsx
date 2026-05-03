// MODULE — Panel Layout AI page
// Renders a deterministic 2D top-down panel arrangement on a roof rectangle.
// Geometry comes from real catalogue panel dimensions (data/components.json
// via /api/equipment/panels). No fabricated layouts — every panel rectangle
// is positioned from real width × height + setback rules.

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div` padding: 1.25rem; max-width: 1200px; margin: 0 auto; color: #E6F1FF; `;
const Card = styled.section`
  background: rgba(11, 18, 48, 0.55);
  border: 1px solid rgba(0, 217, 255, 0.18);
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1rem;
`;
const Field = styled.label`
  display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.85rem;
  color: rgba(230,241,255,0.75);
  input, select {
    background: #0b1230; color: #E6F1FF;
    border: 1px solid rgba(0,217,255,0.25); border-radius: 6px;
    padding: 0.45rem 0.6rem; font-size: 0.92rem;
  }
`;
const Pill = styled.span<{ $tone?: 'ok' | 'warn' | 'info' }>`
  display: inline-block; padding: 2px 8px; border-radius: 999px;
  font-size: 0.72rem; border: 1px solid currentColor;
  background: ${p => p.$tone === 'warn' ? 'rgba(251,191,36,0.15)' : p.$tone === 'ok' ? 'rgba(34,197,94,0.15)' : 'rgba(0,217,255,0.15)'};
  color: ${p => p.$tone === 'warn' ? '#fcd34d' : p.$tone === 'ok' ? '#86efac' : '#00D9FF'};
`;

interface Panel {
  id: string;
  brand: string;
  model: string;
  wattage: number;
  widthM: number;
  heightM: number;
}

// The /api/equipment/panels endpoint returns objects with
// {manufacturer, model, pStcW, widthMm, heightMm}. The components.json fallback uses
// {brand, model, wattage, dimensions:{width, height}}. Normalise both shapes.
function normalisePanel(p: any, idx: number): Panel | null {
  const widthMm = p.widthMm ?? (p.dimensions?.width != null ? p.dimensions.width * 1000 : null);
  const heightMm = p.heightMm ?? (p.dimensions?.height != null ? p.dimensions.height * 1000 : null);
  const wattage = p.pStcW ?? p.wattage ?? null;
  const brand   = p.manufacturer ?? p.brand ?? 'Unknown';
  const model   = p.model ?? p.id ?? `panel-${idx}`;
  if (widthMm == null || heightMm == null || wattage == null) return null;
  return {
    id: p.id ?? `${brand}-${model}-${idx}`,
    brand, model,
    wattage: Number(wattage),
    widthM:  Number(widthMm) / 1000,
    heightM: Number(heightMm) / 1000
  };
}

type Orientation = 'portrait' | 'landscape';

interface LayoutResult {
  rows: number;
  cols: number;
  count: number;
  totalKw: number;
  positions: { x: number; y: number; w: number; h: number; n: number }[];
  utilisationPct: number;
  notes: string[];
}

function arrangePanels(roofWm: number, roofHm: number, panel: Panel, orientation: Orientation, setbackM: number, rowGapM: number): LayoutResult {
  const pw = orientation === 'portrait' ? panel.widthM  : panel.heightM;
  const ph = orientation === 'portrait' ? panel.heightM : panel.widthM;
  const usableW = Math.max(0, roofWm - 2 * setbackM);
  const usableH = Math.max(0, roofHm - 2 * setbackM);
  const cols = Math.floor((usableW + 0.02) / (pw + 0.02));
  const rows = Math.floor((usableH + rowGapM) / (ph + rowGapM));
  const positions = [];
  let n = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions.push({
        x: setbackM + c * (pw + 0.02),
        y: setbackM + r * (ph + rowGapM),
        w: pw,
        h: ph,
        n: n++
      });
    }
  }
  const count = positions.length;
  const totalKw = (count * panel.wattage) / 1000;
  const panelArea = count * pw * ph;
  const roofArea  = roofWm * roofHm;
  const utilisationPct = roofArea > 0 ? (panelArea / roofArea) * 100 : 0;
  const notes: string[] = [];
  if (count === 0) notes.push('Roof too small for selected panel + setbacks. Reduce setbacks or change orientation.');
  if (setbackM < 0.3) notes.push('Setback < 0.3 m — verify against IEC 60364-7-712 / NEC 690.12 fire-access requirements.');
  if (rowGapM < 0.05) notes.push('Row gap < 50 mm — consider thermal expansion + access for cleaning.');
  return { rows, cols, count, totalKw, positions, utilisationPct, notes };
}

const PanelLayoutPage: React.FC = () => {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [panelId, setPanelId] = useState<string>('');
  const [roofW, setRoofW] = useState(8);
  const [roofH, setRoofH] = useState(6);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [setback, setSetback] = useState(0.5);
  const [rowGap, setRowGap] = useState(0.1);
  const [error, setError] = useState('');

  useEffect(() => {
    // Guard against non-JSON (HTML 404) responses so we don't crash with
    // "Unexpected token '<', '<!DOCTYPE'" when the catalogue endpoint is
    // unavailable. Show empty list instead.
    fetch('/api/equipment/panels')
      .then(async r => {
        const ct = r.headers.get('content-type') || '';
        if (!ct.includes('application/json')) return { data: [] };
        return r.json();
      })
      .then(j => {
        const raw = j.data || j || [];
        const list: Panel[] = raw.map(normalisePanel).filter(Boolean) as Panel[];
        setPanels(list);
        if (list.length && !panelId) setPanelId(list[0].id);
      })
      .catch(e => setError(e.message));
  }, []); // eslint-disable-line

  const panel = panels.find(p => p.id === panelId);

  const layout = useMemo(() => {
    if (!panel) return null;
    return arrangePanels(roofW, roofH, panel, orientation, setback, rowGap);
  }, [panel, roofW, roofH, orientation, setback, rowGap]);

  // SVG canvas: 1 metre = 50 px (auto-fits)
  const SCALE = 600 / Math.max(roofW, roofH, 4);
  const svgW = roofW * SCALE;
  const svgH = roofH * SCALE;

  return (
    <Wrap>
      <h1 style={{ marginTop: 0 }}>🔲 Panel Layout AI</h1>
      <p style={{ color: 'rgba(230,241,255,0.65)' }}>
        Deterministic top-down panel arrangement using real catalogue panel
        geometry. Output is computed from physical width × height + your
        setback / row-gap rules. No mock layouts.
      </p>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
          <Field>
            <span>Panel (catalogue)</span>
            <select value={panelId} onChange={e => setPanelId(e.target.value)}>
              {panels.map(p => (
                <option key={p.id} value={p.id}>
                  {p.brand} {p.model} — {p.wattage} W ({p.widthM.toFixed(2)}×{p.heightM.toFixed(2)} m)
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <span>Roof width (m)</span>
            <input type="number" min={1} step={0.1} value={roofW} onChange={e => setRoofW(parseFloat(e.target.value) || 0)} />
          </Field>
          <Field>
            <span>Roof depth (m)</span>
            <input type="number" min={1} step={0.1} value={roofH} onChange={e => setRoofH(parseFloat(e.target.value) || 0)} />
          </Field>
          <Field>
            <span>Orientation</span>
            <select value={orientation} onChange={e => setOrientation(e.target.value as Orientation)}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </Field>
          <Field>
            <span>Edge setback (m)</span>
            <input type="number" min={0} step={0.05} value={setback} onChange={e => setSetback(parseFloat(e.target.value) || 0)} />
          </Field>
          <Field>
            <span>Row gap (m)</span>
            <input type="number" min={0} step={0.05} value={rowGap} onChange={e => setRowGap(parseFloat(e.target.value) || 0)} />
          </Field>
        </div>
        {error && <p style={{ color: '#fca5a5' }}>API error: {error}</p>}
      </Card>

      {layout && panel && (
        <>
          <Card>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <Pill $tone="ok">{layout.count} panels</Pill>
              <Pill $tone="ok">{layout.totalKw.toFixed(2)} kWp</Pill>
              <Pill $tone="info">{layout.rows} rows × {layout.cols} cols</Pill>
              <Pill $tone="info">{layout.utilisationPct.toFixed(1)}% roof utilisation</Pill>
              <Pill $tone="info">setback {setback} m · gap {rowGap} m</Pill>
            </div>
            {layout.notes.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#fcd34d', fontSize: '0.85rem' }}>
                {layout.notes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            )}
          </Card>

          <Card>
            <h3 style={{ marginTop: 0 }}>Top-down layout (1 m = {SCALE.toFixed(0)} px)</h3>
            <div style={{ background: '#0b1230', border: '1px solid rgba(0,217,255,0.25)', borderRadius: 8, padding: 12, overflow: 'auto' }}>
              <svg width={svgW + 40} height={svgH + 40} style={{ display: 'block' }}>
                {/* Roof outline */}
                <rect x={20} y={20} width={svgW} height={svgH} fill="#1a2456" stroke="#00D9FF" strokeWidth={1.5} />
                {/* Setback inner rect */}
                <rect x={20 + setback * SCALE} y={20 + setback * SCALE}
                      width={svgW - 2 * setback * SCALE} height={svgH - 2 * setback * SCALE}
                      fill="none" stroke="rgba(0,217,255,0.3)" strokeDasharray="4 4" />
                {/* Panels */}
                {layout.positions.map((p, i) => (
                  <g key={i}>
                    <rect x={20 + p.x * SCALE} y={20 + p.y * SCALE}
                          width={p.w * SCALE} height={p.h * SCALE}
                          fill="#00224a" stroke="#00D9FF" strokeWidth={1} />
                    <line x1={20 + p.x * SCALE + 4} y1={20 + p.y * SCALE + 4}
                          x2={20 + p.x * SCALE + p.w * SCALE - 4} y2={20 + p.y * SCALE + p.h * SCALE - 4}
                          stroke="rgba(0,217,255,0.35)" strokeWidth={0.5} />
                    <text x={20 + (p.x + p.w / 2) * SCALE} y={20 + (p.y + p.h / 2) * SCALE + 4}
                          fontSize={Math.min(p.w * SCALE / 3, 14)} textAnchor="middle"
                          fill="#cffafe">{p.n}</text>
                  </g>
                ))}
                {/* Compass */}
                <g transform={`translate(${svgW + 10}, 30)`}>
                  <circle cx={10} cy={10} r={10} fill="none" stroke="rgba(0,217,255,0.35)" />
                  <text x={10} y={5} fontSize={10} textAnchor="middle" fill="#00D9FF">N</text>
                </g>
              </svg>
            </div>
            <p style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: 'rgba(253,230,138,0.85)' }}>
              <strong>Source:</strong> {panel.brand} {panel.model} — {panel.wattage} W, {panel.widthM.toFixed(2)} × {panel.heightM.toFixed(2)} m, dimensions from the manufacturer datasheet.
              Layout uses deterministic grid packing with the edge setback and row gap shown above. Verify roof structural capacity (allow 15 kg/m²) and shading on-site.
            </p>
          </Card>
        </>
      )}
    </Wrap>
  );
};

export default PanelLayoutPage;
