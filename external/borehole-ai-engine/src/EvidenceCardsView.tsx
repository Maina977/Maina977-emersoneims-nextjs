/**
 * AquaScan Pro results view: regional groundwater context (BGS) and mapped
 * water points nearby (OpenStreetMap). Display only; parsing and wording live
 * in evidenceCards.ts. Nothing here feeds the engine, the summary cards, the
 * final recommendation or the report.
 */
import React, { useEffect, useState } from 'react';
import {
  loadGroundwaterCard, loadNearbyCard, NEARBY_RADIUS_KM, DASH,
  type GroundwaterCard, type NearbyCard,
} from './evidenceCards';

const box: React.CSSProperties = { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border, rgba(255,255,255,0.12))', borderRadius: 12, padding: '14px 18px', marginBottom: 16 };
const title: React.CSSProperties = { fontSize: 14, fontWeight: 700, marginBottom: 4 };
const note: React.CSSProperties = { fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 };
const small: React.CSSProperties = { fontSize: 10, color: 'var(--text-tertiary, var(--text-secondary))', lineHeight: 1.4, marginTop: 8 };
const cell: React.CSSProperties = { padding: '4px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left', verticalAlign: 'top' };

const fetchImpl = (u: string, init?: { signal?: AbortSignal }) => fetch(u, init);

function useLoad<T>(load: (signal: AbortSignal) => Promise<T>, deps: unknown[]): T | null {
  const [v, setV] = useState<T | null>(null);
  useEffect(() => {
    const ac = new AbortController();
    setV(null);
    load(ac.signal).then((x) => { if (!ac.signal.aborted) setV(x); }, () => { /* aborted on unmount */ });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return v;
}

function GroundwaterContextCard({ card }: { card: GroundwaterCard | null }) {
  return (
    <div style={box} data-testid="evidence-bgs">
      <div style={title}>Regional groundwater context (BGS, continental scale)</div>
      <div style={note}>Regional context for the wider area, not a prediction for this site.</div>
      {!card ? <div style={{ ...note, marginTop: 8 }}>Loading{'…'}</div> : (
        <>
          <div style={{ ...note, marginTop: 8, fontWeight: 600 }}>{card.message}</div>
          {card.status === 'OK' && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 6 }}>
              <tbody>
                {card.rows.map((r) => (
                  <tr key={r.label}>
                    <td style={{ ...cell, color: 'var(--text-secondary)' }}>{r.label}</td>
                    <td style={cell}>{r.value}</td>
                    <td style={{ ...cell, color: 'var(--text-secondary)' }}>{r.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {card.scale && <div style={{ ...note, marginTop: 8 }}><strong>Scale:</strong> {card.scale}</div>}
          {card.use && <div style={note}><strong>Use:</strong> {card.use}</div>}
          {card.acknowledgement && <div style={small}>{card.acknowledgement}</div>}
        </>
      )}
    </div>
  );
}

function NearbyWaterPointsCard({ card }: { card: NearbyCard | null }) {
  return (
    <div style={box} data-testid="evidence-osm">
      <div style={title}>Mapped water points nearby (OpenStreetMap)</div>
      <div style={note}>Points volunteers have mapped within {NEARBY_RADIUS_KM} km. Values appear only where a mapper tagged them; they are not a drilling depth or expected yield for this site.</div>
      {!card ? <div style={{ ...note, marginTop: 8 }}>Loading{'…'}</div> : (
        <>
          <div style={{ ...note, marginTop: 8, fontWeight: 600 }}>{card.message}</div>
          {card.status === 'OK' && card.rows.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginTop: 6 }}>
                <thead>
                  <tr>{['Kind', 'Name', 'Distance', 'Depth (tagged)', 'Yield (tagged)', 'Water level (tagged)', 'Year'].map((h) => <th key={h} style={{ ...cell, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {card.rows.map((r, i) => (
                    <tr key={i}>
                      <td style={cell}>{r.kind}</td><td style={cell}>{r.name}</td><td style={cell}>{r.distance}</td>
                      <td style={cell}>{r.depth}</td><td style={cell}>{r.yield}</td><td style={cell}>{r.waterLevel}</td><td style={cell}>{r.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {card.count !== null && card.count > card.rows.length && <div style={small}>Showing the {card.rows.length} nearest of {card.count}.</div>}
              {(card.pointsWithDepth !== null || card.pointsWithYield !== null) && (
                <div style={small}>Points with a tagged depth: {card.pointsWithDepth ?? DASH}; with a tagged yield: {card.pointsWithYield ?? DASH}.</div>
              )}
            </div>
          )}
          {card.limitations.length > 0 && (
            <ul style={{ ...note, margin: '8px 0 0', paddingLeft: 18 }}>
              {card.limitations.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          )}
          {card.dataSources.length > 0 && <div style={small}>Source: {card.dataSources.join('; ')}</div>}
        </>
      )}
    </div>
  );
}

/** Both cards for one site. Renders nothing without valid coordinates. */
export default function EvidenceCards({ lat, lon }: { lat: number; lon: number }) {
  const valid = Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
  const gw = useLoad((s) => (valid ? loadGroundwaterCard(lat, lon, fetchImpl, s) : Promise.reject(new Error('no coordinates'))), [lat, lon, valid]);
  const nb = useLoad((s) => (valid ? loadNearbyCard(lat, lon, fetchImpl, s) : Promise.reject(new Error('no coordinates'))), [lat, lon, valid]);
  if (!valid) return null;
  return (
    <div className="evidence-cards">
      <GroundwaterContextCard card={gw} />
      <NearbyWaterPointsCard card={nb} />
    </div>
  );
}
