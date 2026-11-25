/**
 * "Candidate drilling locations" (AquaScan site-photo workflow, 2026-11-25): a property,
 * locations A, B, C… with up to four photos each, measured photo checks, the customer's
 * observable-constraint checklist, an outcome per location, the comparison and the
 * PDF / Word / Excel report. No groundwater figure of any kind is produced here.
 */
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { CONTAMINATION_KINDS, CHECKLIST_QUESTIONS, GROUNDWATER_DISCLAIMER, type Checklist, type ContaminationKind } from './siteConstraints';
import { addLocation, addPhoto, assess, comparison, load, newProperty, PRIVACY_NOTE, recordRevision, removePhoto, save, updateLocation, type KV, type Property } from './siteProperty';
import { processPhotoFile, canvasDecoder, type Decoder } from './sitePhotoBrowser';
import { buildSitePhotoReport, sitePhotoPdf, sitePhotoDocx, sitePhotoXlsx, saveBytes, surveyEnquiryHref, visualReviewRow } from './sitePhotoReport';
import { SITE_PHOTO_THRESHOLDS } from './sitePhotoChecks';
import { VISION_STATUS } from './siteVision';

const inp: CSSProperties = { width: '100%', padding: 4, borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', boxSizing: 'border-box' };
const box: CSSProperties = { border: '1px solid var(--border)', borderRadius: 8, padding: 10, marginBottom: 10, minWidth: 0 };
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8 };
const badge = (o: string): CSSProperties => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontSize: 12, color: '#fff', background: o === 'NO BLOCKING CONSTRAINT OBSERVED' ? '#15803d' : o === 'OBSERVABLE CONSTRAINTS FOUND' ? '#b45309' : '#b91c1c' });
const statusColor = { ok: '#15803d', warn: '#b45309', fail: '#b91c1c', info: 'inherit' } as const;
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const browserStore = (): KV | null => { try { return typeof window !== 'undefined' ? window.localStorage : null; } catch { return null; } };
const coord = (s: string): number | null => { const t = s.trim().replace(',', '.'); if (!t) return null; const v = Number(t); return Number.isFinite(v) ? v : NaN; };

export function SitePhotoWorkflow({ decode = canvasDecoder, storage, now = () => new Date() }: { decode?: Decoder; storage?: KV | null; now?: () => Date }) {
  const store = storage === undefined ? browserStore() : storage;
  const [prop, setProp] = useState<Property>(() => load(store) ?? addLocation(newProperty(), now()));
  const [msgs, setMsgs] = useState<Record<string, string[]>>({});
  const [saveNote, setSaveNote] = useState<string>('');
  const [gpsText, setGpsText] = useState<Record<string, { lat: string; lon: string }>>({});
  const [assessed, setAssessed] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { const r = save(prop, store); setSaveNote(r.note ?? (r.saved ? 'Saved in this browser.' : '')); }, [prop]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCheck = (locId: string, patch: Partial<Checklist>) => setProp((p) => updateLocation(p, locId, { checklist: { ...p.locations.find((l) => l.id === locId)!.checklist, ...patch } }, now()));

  const onFiles = async (locId: string, files: File[]) => {
    setBusy(true);
    const out: string[] = [];
    let p = prop;
    for (const f of files) {
      const r = await processPhotoFile(f, decode);
      if (!r.ok) { out.push(r.reason); continue; }
      const a = addPhoto(p, locId, { facts: r.facts, dataUrl: r.dataUrl }, now());
      if (!a.ok) { out.push(`${f.name} not added: ${a.reason}`); continue; }
      p = a.property;
    }
    setProp(p); setMsgs((m) => ({ ...m, [locId]: out })); setAssessed((s) => ({ ...s, [locId]: false })); setBusy(false);
  };

  const setGps = (locId: string, lat: string, lon: string) => {
    setGpsText((g) => ({ ...g, [locId]: { lat, lon } }));
    const a = coord(lat), b = coord(lon);
    const ok = a != null && b != null && Number.isFinite(a) && Number.isFinite(b) && Math.abs(a) <= 90 && Math.abs(b) <= 180;
    setProp((p) => updateLocation(p, locId, { gps: ok ? { latitude: a as number, longitude: b as number } : null }, now()));
  };

  const report = useMemo(() => buildSitePhotoReport(prop, now()), [prop]); // eslint-disable-line react-hooks/exhaustive-deps
  const cmp = comparison(prop);
  const stamp = () => now().toISOString().slice(0, 10);

  return (
    <div data-testid="site-photo-workflow" style={{ maxWidth: '100%', overflowWrap: 'anywhere' }}>
      <h3 style={{ marginTop: 0 }}>Candidate drilling locations: site photos</h3>
      <div role="note" style={{ border: '2px solid #b91c1c', borderRadius: 8, padding: 10, marginBottom: 10, fontWeight: 700 }}>{GROUNDWATER_DISCLAIMER}</div>
      <p style={{ fontSize: 12 }}>{PRIVACY_NOTE}</p>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{VISION_STATUS}</p>

      <fieldset style={box}>
        <legend style={{ fontWeight: 700 }}>Property</legend>
        <div style={grid}>
          <label style={{ fontSize: 12 }}>Property name<input style={inp} value={prop.name} onChange={(e) => setProp({ ...prop, name: e.target.value, updatedAt: now().toISOString() })} /></label>
          <label style={{ fontSize: 12 }}>County<input style={inp} value={prop.county} onChange={(e) => setProp({ ...prop, county: e.target.value, updatedAt: now().toISOString() })} /></label>
        </div>
      </fieldset>

      {prop.locations.map((loc, li) => {
        const { set, assessment: a } = assess(prop, loc);
        const g = gpsText[loc.id] ?? { lat: loc.gps ? String(loc.gps.latitude) : '', lon: loc.gps ? String(loc.gps.longitude) : '' };
        const c = loc.checklist;
        const photoSel = (k: keyof typeof CHECKLIST_QUESTIONS) => (
          <select aria-label={`${loc.label} ${CHECKLIST_QUESTIONS[k].q} photo`} style={{ ...inp, width: 'auto' }} value={c[k].photo ?? ''} onChange={(e) => setCheck(loc.id, { [k]: { ...c[k], photo: e.target.value ? Number(e.target.value) : null } } as Partial<Checklist>)}>
            <option value="">no photo</option>
            {loc.photos.map((_, i) => <option key={i} value={i + 1}>photo {i + 1}</option>)}
          </select>
        );
        return (
          <fieldset key={loc.id} style={{ ...box, borderWidth: 2 }} data-testid={`location-${li}`}>
            <legend style={{ fontWeight: 800 }}>{loc.label}</legend>
            <div style={grid}>
              <label style={{ fontSize: 12 }}>{`${loc.label} description`}<input style={inp} placeholder="e.g. behind the cattle shed, near the gate" value={loc.description} onChange={(e) => setProp(updateLocation(prop, loc.id, { description: e.target.value }, now()))} /></label>
              <label style={{ fontSize: 12 }}>{`${loc.label} latitude (optional)`}<input style={inp} value={g.lat} onChange={(e) => setGps(loc.id, e.target.value, g.lon)} /></label>
              <label style={{ fontSize: 12 }}>{`${loc.label} longitude (optional)`}<input style={inp} value={g.lon} onChange={(e) => setGps(loc.id, g.lat, e.target.value)} /></label>
            </div>

            <div style={{ marginTop: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 700 }}>{`${loc.label} photos (${loc.photos.length} of ${SITE_PHOTO_THRESHOLDS.maxPhotosPerLocation})`}
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} style={{ display: 'block', fontSize: 11 }} onChange={(e) => { const fs = Array.from(e.target.files ?? []); e.target.value = ''; if (fs.length) void onFiles(loc.id, fs); }} />
              </label>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Up to {SITE_PHOTO_THRESHOLDS.maxPhotosPerLocation} photos of THIS spot: the spot itself and the view in each direction, in daylight, with the phone's location on. Send the original files (not via WhatsApp, which removes the location).</div>
              {(msgs[loc.id] ?? []).length > 0 && <div role="alert" style={{ color: '#b91c1c', fontSize: 12 }}>{(msgs[loc.id] ?? []).map((m) => <div key={m}>{m}</div>)}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8, marginTop: 6 }}>
                {loc.photos.map((ph, i) => (
                  <div key={ph.id} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 6, minWidth: 0 }} data-testid={`${loc.label}-photo-${i + 1}`}>
                    {ph.dataUrl ? <img src={ph.dataUrl} alt={`${loc.label}, photo ${i + 1}`} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 4 }} /> : <div style={{ height: 90, fontSize: 11 }}>image not stored</div>}
                    <div style={{ fontSize: 11, fontWeight: 700 }}>Photo {i + 1}: {set.perPhoto[i]?.usable ? 'usable' : 'NOT usable'}</div>
                    <ul style={{ fontSize: 10, margin: 0, paddingLeft: 14 }}>
                      {[...ph.checks, ...(set.perPhoto[i]?.extra ?? [])].map((ck) => <li key={ck.id} style={{ color: statusColor[ck.status] }}>{ck.label}: {ck.measured} (threshold {ck.threshold}){ck.note ? ` — ${ck.note}` : ''}</li>)}
                    </ul>
                    <button type="button" className="btn btn-secondary" style={{ fontSize: 10, padding: '1px 6px' }} onClick={() => setProp(removePhoto(prop, loc.id, ph.id, now()))}>Remove photo {i + 1}</button>
                  </div>
                ))}
              </div>
            </div>

            <fieldset style={{ ...box, marginTop: 8 }}>
              <legend style={{ fontSize: 12, fontWeight: 700 }}>{loc.label}: what you can see (look at your photos and the site)</legend>
              {(Object.keys(CHECKLIST_QUESTIONS) as (keyof typeof CHECKLIST_QUESTIONS)[]).map((k) => (
                <div key={k} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                  <label style={{ fontSize: 12, flex: '1 1 220px' }}>{`${loc.label} ${CHECKLIST_QUESTIONS[k].q}`}
                    <select style={inp} value={c[k].value} onChange={(e) => setCheck(loc.id, { [k]: { ...c[k], value: e.target.value } } as Partial<Checklist>)}>
                      <option value="">choose…</option>
                      {Object.entries(CHECKLIST_QUESTIONS[k].options).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                    </select>
                  </label>
                  {photoSel(k)}
                  {k === 'existingWells' && c.existingWells.value === 'nearby' && <label style={{ fontSize: 12 }}>{`${loc.label} distance to the well (m, your estimate)`}<input style={{ ...inp, width: 90 }} type="number" min="0" value={c.existingWells.distanceM ?? ''} onChange={(e) => setCheck(loc.id, { existingWells: { ...c.existingWells, distanceM: e.target.value === '' ? null : Number(e.target.value) } })} /></label>}
                </div>
              ))}
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>Contamination sources nearby</div>
              <label style={{ fontSize: 12 }}><input type="checkbox" checked={c.contaminationNoneSeen} onChange={(e) => setCheck(loc.id, { contaminationNoneSeen: e.target.checked, contamination: e.target.checked ? [] : c.contamination })} />{` ${loc.label}: none seen`}</label>
              <div style={grid}>
                {CONTAMINATION_KINDS.map((k) => {
                  const entry = c.contamination.find((x) => x.kind === k.key);
                  return (
                    <div key={k.key} style={{ fontSize: 12 }}>
                      <label><input type="checkbox" checked={!!entry} onChange={(e) => setCheck(loc.id, { contaminationNoneSeen: false, contamination: e.target.checked ? [...c.contamination, { kind: k.key as ContaminationKind, distanceM: null }] : c.contamination.filter((x) => x.kind !== k.key) })} />{` ${loc.label}: ${k.label}`}</label>
                      {entry && <label style={{ display: 'block' }}>{`${loc.label} ${k.label} distance (m, your estimate)`}<input style={inp} type="number" min="0" value={entry.distanceM ?? ''} onChange={(e) => setCheck(loc.id, { contamination: c.contamination.map((x) => (x.kind === k.key ? { ...x, distanceM: e.target.value === '' ? null : Number(e.target.value) } : x)) })} /></label>}
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <button type="button" className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => { setProp(recordRevision(prop, loc.id, now())); setAssessed((s) => ({ ...s, [loc.id]: true })); }}>{`Assess ${loc.label}`}</button>
            {assessed[loc.id] && (
              <div data-testid={`${loc.label}-assessment`} style={{ marginTop: 8 }}>
                <div><span style={badge(a.outcome)}>{a.outcome}</span></div>
                <ul style={{ fontSize: 12 }}>{a.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                {a.findings.map((f) => <div key={f.id} style={{ fontSize: 12, marginBottom: 4 }}><strong>{f.severity === 'constraint' ? 'Constraint' : 'Check on site'}: {f.title}.</strong> {f.explanation}</div>)}
                {a.requestAlternative && (
                  <div role="status" style={{ fontSize: 12, fontWeight: 700, margin: '6px 0' }}>{a.requestAlternative}{' '}
                    {a.outcome === 'OBSERVABLE CONSTRAINTS FOUND' && <button type="button" className="btn btn-secondary" style={{ fontSize: 11 }} onClick={() => setProp(addLocation(prop, now()))}>Add another location</button>}
                  </div>
                )}
                <div style={{ fontSize: 11 }}><strong>Automated visual review: {visualReviewRow([])[1]}.</strong> {visualReviewRow([])[2]}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.referral}</div>
              </div>
            )}
            {loc.history.length > 0 && (
              <details style={{ fontSize: 11, marginTop: 6 }}>
                <summary>{`${loc.label} history (${loc.history.length} assessment${loc.history.length > 1 ? 's' : ''})`}</summary>
                <ul>{loc.history.map((r) => <li key={r.at}>{r.at.replace('T', ' ').slice(0, 19)}: {r.outcome} (photos: {r.photos.join(', ') || 'none'})</li>)}</ul>
              </details>
            )}
          </fieldset>
        );
      })}

      <button type="button" className="btn btn-secondary" style={{ fontSize: 12, marginBottom: 10 }} onClick={() => setProp(addLocation(prop, now()))}>Add another location</button>

      <div style={box} data-testid="site-photo-comparison">
        <h4 style={{ margin: '0 0 6px' }}>Comparison of locations</h4>
        {cmp.summary && <p style={{ fontSize: 13, fontWeight: 700 }}>{cmp.summary}</p>}
        <p style={{ fontSize: 12, fontWeight: 700 }}>{cmp.note}</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 12, width: '100%' }}>
            <thead><tr>{report.comparison.head.map((h) => <th key={h} style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', padding: 4 }}>{h}</th>)}</tr></thead>
            <tbody>{report.comparison.rows.map((r) => <tr key={r[1]}>{r.map((x, i) => <td key={i} style={{ padding: 4, borderBottom: '1px solid var(--border)' }}>{x}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <button type="button" className="btn btn-primary" onClick={() => saveBytes(sitePhotoPdf(buildSitePhotoReport(prop, now())), 'application/pdf', `AquaScanPro_SitePhotos_${stamp()}.pdf`)}>Site photos report (PDF)</button>
        <button type="button" className="btn btn-primary" onClick={async () => saveBytes(await sitePhotoDocx(buildSitePhotoReport(prop, now())), DOCX, `AquaScanPro_SitePhotos_${stamp()}.docx`)}>Site photos report (Word)</button>
        <button type="button" className="btn btn-primary" onClick={async () => saveBytes(await sitePhotoXlsx(buildSitePhotoReport(prop, now())), XLSX, `AquaScanPro_SitePhotos_${stamp()}.xlsx`)}>Site photos report (Excel)</button>
        <a className="btn btn-secondary" href={surveyEnquiryHref(prop)}>Request an EmersonEIMS hydrogeological survey</a>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>The survey request opens the contact page with your property and locations filled in; nothing is sent until you submit it there. {saveNote}</p>
    </div>
  );
}

export default SitePhotoWorkflow;
