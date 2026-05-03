// MODULES 12 & 15 — Repair Guides AI + Maintenance AI page
//
// Browser-safe page. We do NOT import services/RepairAndMaintenanceService.ts
// directly because that file pulls in node-cron + nodemailer, which are
// Node-only and would break the Vite browser bundle. Instead we surface the
// fault-codes DB (real, sourced) plus a maintenance schedule template that
// can be activated server-side once SMTP credentials are configured.

import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';

const Wrap = styled.div` padding: 1.25rem; max-width: 1200px; margin: 0 auto; color: #E6F1FF; `;
const Card = styled.section`
  background: rgba(11, 18, 48, 0.55);
  border: 1px solid rgba(0, 217, 255, 0.18);
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1rem;
`;
const Tabs = styled.div` display: flex; gap: 0.5rem; margin-bottom: 1rem; `;
const Tab = styled.button<{ $active: boolean }>`
  padding: 0.55rem 1rem; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(0,217,255,0.35);
  background: ${p => p.$active ? '#00D9FF' : 'transparent'};
  color: ${p => p.$active ? '#050818' : '#00D9FF'};
  font-weight: 600;
`;
const Pill = styled.span<{ $tone?: 'ok' | 'warn' | 'err' }>`
  display: inline-block; padding: 2px 8px; border-radius: 999px;
  font-size: 0.7rem; font-weight: 600;
  background: ${p => p.$tone === 'ok' ? 'rgba(34,197,94,0.15)' :
                     p.$tone === 'warn' ? 'rgba(251,191,36,0.18)' :
                     p.$tone === 'err' ? 'rgba(239,68,68,0.18)' : 'rgba(0,217,255,0.15)'};
  color: ${p => p.$tone === 'ok' ? '#86efac' :
                p.$tone === 'warn' ? '#fde68a' :
                p.$tone === 'err' ? '#fca5a5' : '#00D9FF'};
  border: 1px solid currentColor;
`;
const Input = styled.input`
  width: 100%; padding: 0.55rem 0.8rem; border-radius: 8px;
  border: 1px solid rgba(0,217,255,0.25);
  background: rgba(0,0,0,0.25); color: #E6F1FF; font-size: 0.95rem;
`;

interface Fault {
  code: string; brand: string; title: string; description?: string;
  severity?: string; cause?: string[]; solution?: string[]; tags?: string[];
}

const sevTone = (s?: string): 'ok' | 'warn' | 'err' | undefined =>
  s === 'critical' || s === 'high' ? 'err' : s === 'medium' ? 'warn' : undefined;

// Default maintenance schedule template — durations from manufacturer best-
// practice manuals (Sungrow O&M, Deye installation guide). Cron expressions
// are real and ready to be activated server-side.
const SCHEDULE_TEMPLATE = [
  { task: '📊 Check system production metrics',          frequency: 'daily',     cron: '0 8 * * *',     duration: 5 },
  { task: '🧹 Clean PV panels (if dry season)',          frequency: 'weekly',    cron: '0 9 * * SUN',   duration: 30 },
  { task: '🔍 Inspect wiring and DC/AC connections',     frequency: 'monthly',   cron: '0 10 1 * *',    duration: 60 },
  { task: '⚙️ Inverter performance review',              frequency: 'quarterly', cron: '0 10 1 */3 *',  duration: 45 },
  { task: '🏥 Annual system health check by technician', frequency: 'yearly',    cron: '0 10 1 1 *',    duration: 120 }
];

const RepairMaintenancePage: React.FC = () => {
  const [tab, setTab] = useState<'repair' | 'maintenance'>('repair');
  const [faults, setFaults] = useState<Fault[]>([]);
  const [provenance, setProvenance] = useState<any>(null);
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState<string>('');
  const [loadErr, setLoadErr] = useState('');
  // Wizard state — step index per fault key (code+brand). null = wizard closed.
  const [wizards, setWizards] = useState<Record<string, number | null>>({});
  const wizardKey = (f: Fault) => `${f.brand}::${f.code}`;
  const setStep = (f: Fault, n: number | null) => setWizards(w => ({ ...w, [wizardKey(f)]: n }));

  useEffect(() => {
    // Guard against non-JSON (HTML 404) responses so we don't crash with
    // "Unexpected token '<', '<!DOCTYPE'" when the fault catalogue endpoint
    // is unavailable. Show empty catalogue instead.
    fetch('/api/faults')
      .then(async r => {
        const ct = r.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          return { success: true, data: [], provenance: null };
        }
        return r.json();
      })
      .then(j => {
        if (!j.success) throw new Error(j.error || 'load failed');
        setFaults(j.data || []);
        setProvenance(j.provenance || null);
      })
      .catch(e => setLoadErr(e.message || String(e)));
  }, []);

  const brands = useMemo(() => Array.from(new Set(faults.map(f => f.brand))).sort(), [faults]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return faults.filter(f =>
      (!brand || f.brand === brand) &&
      (!ql ||
        f.code.toLowerCase().includes(ql) ||
        f.title.toLowerCase().includes(ql) ||
        (f.tags || []).some(t => t.toLowerCase().includes(ql)))
    );
  }, [faults, q, brand]);

  return (
    <Wrap>
      <h1 style={{ marginTop: 0 }}>🔧 Repair Guides &amp; Maintenance</h1>
      <Tabs>
        <Tab $active={tab === 'repair'} onClick={() => setTab('repair')}>Repair Guides</Tab>
        <Tab $active={tab === 'maintenance'} onClick={() => setTab('maintenance')}>Maintenance Schedule</Tab>
      </Tabs>

      {tab === 'repair' && (
        <>
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '0.6rem' }}>
              <Input placeholder="Search by code, title or tag…" value={q} onChange={e => setQ(e.target.value)} />
              <select value={brand} onChange={e => setBrand(e.target.value)}
                style={{ padding: '0.55rem 0.8rem', borderRadius: 8, background: 'rgba(0,0,0,0.25)', color: '#E6F1FF', border: '1px solid rgba(0,217,255,0.25)' }}>
                <option value="">All brands</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <p style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: 'rgba(230,241,255,0.55)' }}>
              {loadErr
                ? <Pill $tone="err">{loadErr}</Pill>
                : <>Showing <strong>{filtered.length}</strong> of <strong>{faults.length}</strong> codes
                    {provenance?.last_updated && <> · last updated {provenance.last_updated}</>}</>}
            </p>
          </Card>

          {filtered.slice(0, 50).map(f => (
            <Card key={f.code + f.brand}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <strong style={{ fontSize: '1.05rem' }}>{f.code}</strong>{' '}
                  <Pill>{f.brand}</Pill>{' '}
                  {f.severity && <Pill $tone={sevTone(f.severity)}>{f.severity}</Pill>}
                </div>
                <span style={{ color: 'rgba(230,241,255,0.55)', fontSize: '0.85rem' }}>{(f.tags || []).slice(0, 3).join(' · ')}</span>
              </div>
              <h4 style={{ margin: '0.4rem 0 0.5rem' }}>{f.title}</h4>
              {f.description && <p style={{ margin: 0, color: 'rgba(230,241,255,0.78)' }}>{f.description}</p>}
              {(f.cause && f.cause.length > 0) && (
                <details style={{ marginTop: '0.6rem' }}>
                  <summary style={{ cursor: 'pointer', color: '#00D9FF' }}>Likely causes ({f.cause.length})</summary>
                  <ul style={{ marginTop: '0.4rem' }}>{f.cause.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </details>
              )}
              {(f.solution && f.solution.length > 0) && (() => {
                const step = wizards[wizardKey(f)];
                const total = f.solution!.length;
                const inWizard = step != null;
                return (
                  <>
                    <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {!inWizard ? (
                        <button onClick={() => setStep(f, 0)} style={{
                          padding: '0.45rem 0.9rem', borderRadius: 8, border: 0,
                          background: '#00D9FF', color: '#050818', fontWeight: 700, cursor: 'pointer'
                        }}>▶ Open guided fix ({total} steps)</button>
                      ) : (
                        <button onClick={() => setStep(f, null)} style={{
                          padding: '0.45rem 0.9rem', borderRadius: 8,
                          border: '1px solid rgba(0,217,255,0.35)',
                          background: 'transparent', color: '#00D9FF', cursor: 'pointer'
                        }}>✕ Close wizard</button>
                      )}
                      <details style={{ alignSelf: 'center' }}>
                        <summary style={{ cursor: 'pointer', color: 'rgba(230,241,255,0.6)', fontSize: '0.85rem' }}>View all {total} steps</summary>
                        <ol style={{ marginTop: '0.4rem' }}>{f.solution!.map((s, i) => <li key={i}>{s}</li>)}</ol>
                      </details>
                    </div>
                    {inWizard && (
                      <div style={{
                        marginTop: '0.7rem', padding: '0.9rem 1rem',
                        background: 'rgba(0,217,255,0.06)',
                        border: '1px solid rgba(0,217,255,0.3)', borderRadius: 10
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <strong style={{ color: '#00D9FF' }}>Step {step! + 1} of {total}</strong>
                          <div style={{ height: 4, flex: 1, margin: '0 0.8rem', background: 'rgba(0,217,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${((step! + 1) / total) * 100}%`, background: '#00D9FF', transition: 'width 0.18s' }} />
                          </div>
                          <span style={{ color: 'rgba(230,241,255,0.6)', fontSize: '0.82rem' }}>{Math.round(((step! + 1) / total) * 100)}%</span>
                        </div>
                        <p style={{ margin: '0.4rem 0 1rem', fontSize: '1rem', lineHeight: 1.5 }}>{f.solution![step!]}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                          <button disabled={step === 0} onClick={() => setStep(f, step! - 1)} style={{
                            padding: '0.45rem 0.9rem', borderRadius: 8,
                            border: '1px solid rgba(0,217,255,0.35)',
                            background: 'transparent', color: step === 0 ? 'rgba(230,241,255,0.3)' : '#00D9FF',
                            cursor: step === 0 ? 'not-allowed' : 'pointer'
                          }}>◀ Previous</button>
                          {step! < total - 1 ? (
                            <button onClick={() => setStep(f, step! + 1)} style={{
                              padding: '0.45rem 0.9rem', borderRadius: 8, border: 0,
                              background: '#00D9FF', color: '#050818', fontWeight: 700, cursor: 'pointer'
                            }}>Next ▶</button>
                          ) : (
                            <button onClick={() => setStep(f, null)} style={{
                              padding: '0.45rem 0.9rem', borderRadius: 8, border: 0,
                              background: '#22c55e', color: '#052e16', fontWeight: 700, cursor: 'pointer'
                            }}>✓ Mark complete</button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </Card>
          ))}
          {filtered.length > 50 && (
            <p style={{ color: 'rgba(230,241,255,0.55)', textAlign: 'center' }}>
              Showing first 50 results. Refine your search to see more.
            </p>
          )}
          {provenance && (
            <Card>
              <h4 style={{ marginTop: 0 }}>Data provenance</h4>
              <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cffafe', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(provenance, null, 2)}
              </pre>
            </Card>
          )}
        </>
      )}

      {tab === 'maintenance' && (
        <>
          <Card>
            <p style={{ marginTop: 0, color: 'rgba(230,241,255,0.78)' }}>
              Recommended maintenance cadence for grid-tied and hybrid PV systems.
              Automatic email / SMS reminders are ready to be enabled — add your
              SMTP and SMS-gateway credentials in Settings to activate dispatch.
            </p>
            <Pill $tone="warn">Automated reminders: inactive (configure delivery in Settings)</Pill>
          </Card>

          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'rgba(230,241,255,0.6)' }}>
                  <th style={{ padding: '0.5rem 0' }}>Task</th>
                  <th style={{ padding: '0.5rem 0' }}>Frequency</th>
                  <th style={{ padding: '0.5rem 0' }}>Cron</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_TEMPLATE.map((s, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(0,217,255,0.12)' }}>
                    <td style={{ padding: '0.55rem 0' }}>{s.task}</td>
                    <td style={{ padding: '0.55rem 0' }}><Pill>{s.frequency}</Pill></td>
                    <td style={{ padding: '0.55rem 0' }}><code style={{ fontSize: '0.82rem', color: '#cffafe' }}>{s.cron}</code></td>
                    <td style={{ padding: '0.55rem 0', textAlign: 'right' }}>{s.duration} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </Wrap>
  );
};

export default RepairMaintenancePage;
