// MODULE 4 — Quote Parser AI page
// Drops a BOQ file (PDF, image, Excel) onto the existing /api/site/upload
// backend endpoint, which performs OCR + NLP on the server and returns parsed
// items. We display the analysis honestly — the backend already labels its
// own data with provenance (regional est. where applicable).

import React, { useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div` padding: 1.25rem; max-width: 1100px; margin: 0 auto; color: #E6F1FF; `;
const Card = styled.section`
  background: rgba(11, 18, 48, 0.55);
  border: 1px solid rgba(0, 217, 255, 0.18);
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1rem;
`;
const Drop = styled.label`
  display: block;
  border: 2px dashed rgba(0, 217, 255, 0.35);
  border-radius: 12px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: background 0.15s;
  background: rgba(0, 217, 255, 0.04);
  &:hover { background: rgba(0, 217, 255, 0.08); }
`;
const Btn = styled.button`
  background: #00D9FF; color: #050818; border: 0; border-radius: 8px;
  padding: 0.55rem 1rem; font-weight: 600; cursor: pointer;
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;
const Pill = styled.span`
  display: inline-block; padding: 2px 8px; border-radius: 999px;
  font-size: 0.72rem; background: rgba(0,217,255,0.15); color: #00D9FF;
  border: 1px solid currentColor;
`;

type ParseType = 'boq' | 'image' | 'measurement';

const QuoteParserPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<ParseType>('boq');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const submit = async () => {
    if (!file) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', type);
      const res = await fetch('/api/site/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || `HTTP ${res.status}`);
      setResult(json);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrap>
      <h1 style={{ marginTop: 0 }}>📄 Quote Parser AI</h1>
      <p style={{ color: 'rgba(230,241,255,0.65)' }}>
        Upload a Bill of Quantities (PDF / Excel), site photo or measurement file.
        SolarGeniusPro extracts every line item, matches it against the live
        catalogue and returns prices with full source attribution. Anything
        derived from a model is labelled <em>regional est.</em> in line with our
        data-honesty policy.
      </p>

      <Card>
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
          {(['boq', 'image', 'measurement'] as ParseType[]).map(t => (
            <button key={t} onClick={() => setType(t)} style={{
              padding: '0.45rem 0.9rem', borderRadius: 8, cursor: 'pointer',
              border: '1px solid rgba(0,217,255,0.35)',
              background: type === t ? '#00D9FF' : 'transparent',
              color: type === t ? '#050818' : '#00D9FF',
              fontWeight: 600
            }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <Drop>
          <input
            type="file"
            style={{ display: 'none' }}
            accept={type === 'image' ? 'image/*' : type === 'boq' ? '.pdf,.xlsx,.xls,.csv,.txt' : '*/*'}
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
          {file
            ? <span><strong>{file.name}</strong> · {(file.size / 1024).toFixed(1)} KB</span>
            : <span>Drop or click to select a file</span>}
        </Drop>
        <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <Btn onClick={submit} disabled={!file || busy}>{busy ? 'Parsing…' : 'Parse & generate quote'}</Btn>
          {error && <Pill style={{ background: 'rgba(239,68,68,0.18)', color: '#fca5a5' }}>{error}</Pill>}
        </div>
      </Card>

      {result && (
        <Card>
          <h3 style={{ marginTop: 0 }}>
            Parsed result <Pill>{result.file?.name}</Pill>
            {result.data?.grandTotalKES != null && (
              <Pill style={{ marginLeft: 8, background: 'rgba(34,197,94,0.18)', color: '#86efac' }}>
                Total: KES {result.data.grandTotalKES.toLocaleString()}
              </Pill>
            )}
          </h3>

          {/* Priced line-items table — only shown when engine returned items */}
          {Array.isArray(result.data?.items) && result.data.items.length > 0 && (
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,217,255,0.08)' }}>
                    <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(0,217,255,0.2)' }}>Category</th>
                    <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(0,217,255,0.2)' }}>Matched item</th>
                    <th style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid rgba(0,217,255,0.2)' }}>Qty</th>
                    <th style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid rgba(0,217,255,0.2)' }}>Unit (KES)</th>
                    <th style={{ padding: 8, textAlign: 'right', borderBottom: '1px solid rgba(0,217,255,0.2)' }}>Line total</th>
                    <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid rgba(0,217,255,0.2)' }}>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.items.map((it: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: 8, textTransform: 'capitalize' }}>{it.category}</td>
                      <td style={{ padding: 8 }}>
                        <strong>{it.match.brand}</strong> {it.match.model}
                        {it.match.wattage ? ` · ${it.match.wattage} W` : ''}
                        {it.match.capacityKw ? ` · ${it.match.capacityKw} kW` : ''}
                        {it.match.capacityKwh ? ` · ${it.match.capacityKwh} kWh` : ''}
                        <div style={{ color: 'rgba(230,241,255,0.45)', fontSize: '0.74rem' }}>
                          source: <em>{it.sourceLine.length > 70 ? it.sourceLine.slice(0, 70) + '…' : it.sourceLine}</em>
                        </div>
                        {it.warning && (
                          <div style={{ marginTop: 4, color: '#fcd34d', fontSize: '0.74rem' }}>
                            ⚠ {it.warning}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: 8, textAlign: 'right' }}>{it.quantity}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>{it.unitPriceKES.toLocaleString()}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}><strong>{it.lineTotalKES.toLocaleString()}</strong></td>
                      <td style={{ padding: 8 }}>
                        <Pill style={{
                          background:
                            it.provenance.confidence === 'high' ? 'rgba(34,197,94,0.15)' :
                            it.provenance.confidence === 'low'  ? 'rgba(239,68,68,0.15)' :
                                                                   'rgba(251,191,36,0.15)',
                          color:
                            it.provenance.confidence === 'high' ? '#86efac' :
                            it.provenance.confidence === 'low'  ? '#fca5a5' :
                                                                   '#fcd34d'
                        }}>{it.provenance.confidence}</Pill>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} style={{ padding: 8, textAlign: 'right' }}><strong>Subtotal</strong></td>
                    <td style={{ padding: 8, textAlign: 'right' }}><strong>{result.data.subtotalKES.toLocaleString()} KES</strong></td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Unmatched items */}
          {Array.isArray(result.data?.unmatched) && result.data.unmatched.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: 4 }}>⚠ Unmatched lines ({result.data.unmatched.length})</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'rgba(252,165,165,0.9)' }}>
                {result.data.unmatched.slice(0, 12).map((u: any, i: number) => (
                  <li key={i}><code>{u.sourceLine.slice(0, 90)}</code> — <em>{u.reason}</em></li>
                ))}
              </ul>
            </div>
          )}

          {/* Roof image analysis result */}
          {result.data?.pitchDeg != null && (
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ marginTop: 0 }}>Roof image analysis</h4>
              <p>Estimated pitch: <strong>{result.data.pitchDeg}°</strong> · confidence {(result.data.confidence * 100).toFixed(0)}% · {result.data.edgePixels} edge pixels detected.</p>
              {result.data.reason && <p style={{ color: '#fcd34d' }}>{result.data.reason}</p>}
            </div>
          )}

          {/* Raw OCR preview */}
          {result.ocrPreview && (
            <details style={{ marginBottom: '0.6rem' }}>
              <summary style={{ cursor: 'pointer', color: '#00D9FF' }}>View extracted text (OCR)</summary>
              <pre style={{
                margin: '0.4rem 0 0', padding: '0.6rem 0.8rem',
                background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(0,217,255,0.2)',
                borderRadius: 8, color: '#cffafe', fontSize: '0.78rem',
                maxHeight: 220, overflow: 'auto', whiteSpace: 'pre-wrap'
              }}>{result.ocrPreview}</pre>
            </details>
          )}

          {/* Raw JSON for debug */}
          <details>
            <summary style={{ cursor: 'pointer', color: 'rgba(230,241,255,0.6)', fontSize: '0.85rem' }}>View raw response</summary>
            <pre style={{
              margin: '0.4rem 0 0', padding: '0.6rem 0.8rem',
              background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(0,217,255,0.2)',
              borderRadius: 8, color: '#cffafe', fontSize: '0.78rem',
              maxHeight: 260, overflow: 'auto', whiteSpace: 'pre-wrap'
            }}>{JSON.stringify(result.data, null, 2)}</pre>
          </details>

          {result.provenance && (
            <p style={{ marginTop: '0.8rem', color: 'rgba(253,230,138,0.85)', fontSize: '0.85rem' }}>
              <strong>Provenance:</strong>{' '}
              {result.provenance.method || result.provenance.analyser || JSON.stringify(result.provenance)}
            </p>
          )}
        </Card>
      )}
    </Wrap>
  );
};

export default QuoteParserPage;
