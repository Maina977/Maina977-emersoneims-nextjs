'use client';
/**
 * AquaScan report history (CA-52, 2026-11-27, management: customer trust).
 *
 * This list used to show three hard-coded analyses (Nairobi, Kisumu, Mombasa,
 * with probabilities and 2024 dates) as if they were the visitor's own reports.
 * Those records are kept in git history only and are no longer displayed.
 *
 * It now shows only the reports this visitor actually downloaded, which the
 * engine records in this browser (reportTracker.ts, localStorage key
 * "aquascan_report_history"). Nothing is stored on EmersonEIMS servers, so the
 * list is labelled "Saved in this browser only". With none: "You have no saved
 * reports yet." No demonstration records are shown. Modelled figures (score,
 * depth, yield) are not repeated here: the downloaded report states them with
 * their evidence.
 */
import React, { useEffect, useState } from 'react';
import { getHistory, type ReportRecord } from '@/external/borehole-ai-engine/src/reportTracker';

export const NO_REPORTS_TEXT = 'You have no saved reports yet.';
export const LOCAL_REPORTS_LABEL = 'Saved in this browser only';
export const LOCAL_REPORTS_NOTE =
  'These are the reports you downloaded on this device, listed by this browser. EmersonEIMS does not keep a copy; the downloaded file is on your device. Clearing your browser data removes this list.';

/** Same cap as reportTracker's MAX_HISTORY. */
export const HISTORY_DISPLAY_LIMIT = 1000;
const FORMATS = new Set(['PDF', 'Word', 'Excel', 'CSV', 'JSON']);
const PLACE_FIELDS = ['city', 'region', 'country', 'coordinates'] as const;
// A recorded place is a geocoded name or "lat, lon". A percentage or analysis wording in it
// (e.g. "Nairobi Site Analysis 78%") is not something recordReport ever writes.
const NOT_A_PLACE = /%|analysis|probability|success/i;

/**
 * CA-52 review: the browser's stored list is untrusted (edited storage, other scripts, old
 * versions). Only entries with the shape recordReport() writes are shown; anything else is
 * skipped, never crashes the list and is never shown as the visitor's report.
 */
export function validSavedReports(list: unknown): ReportRecord[] {
  if (!Array.isArray(list)) return [];
  const out: ReportRecord[] = [];
  for (const e of list) {
    if (!e || typeof e !== 'object' || Array.isArray(e)) continue;
    const r = e as Record<string, unknown>;
    if (typeof r.id !== 'number' || !Number.isFinite(r.id)) continue;
    if (typeof r.timestamp !== 'string' || r.timestamp.length > 40 || Number.isNaN(Date.parse(r.timestamp))) continue;
    if (typeof r.format !== 'string' || !FORMATS.has(r.format)) continue;
    let placesOk = true;
    for (const f of PLACE_FIELDS) {
      const v = r[f];
      if (v === undefined || v === null) continue;
      if (typeof v !== 'string' || v.length > 120 || NOT_A_PLACE.test(v)) { placesOk = false; break; }
    }
    if (!placesOk) continue;
    out.push(r as unknown as ReportRecord);
  }
  return out.slice(-HISTORY_DISPLAY_LIMIT);
}

function placeOf(r: ReportRecord): string {
  const named = [r.city, r.region, r.country].filter((x) => x && x !== 'Unknown' && x !== 'N/A');
  return named.length ? named.join(', ') : r.coordinates || 'Location not recorded';
}

export const ReportHistory: React.FC = () => {
  const [reports, setReports] = useState<ReportRecord[] | null>(null);

  useEffect(() => {
    // Only what this browser recorded when the visitor downloaded a report.
    let list: ReportRecord[] = [];
    try {
      list = typeof window === 'undefined' ? [] : validSavedReports(getHistory());
    } catch {
      list = [];
    }
    setReports(list.sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)));
  }, []);

  if (reports === null) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading your saved reports...</div>;
  }

  return (
    <div style={{ padding: '20px' }} data-testid="report-history">
      <h3 style={{ marginTop: 0 }}>Your saved reports</h3>

      {reports.length === 0 ? (
        <div data-testid="report-history-empty" style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{NO_REPORTS_TEXT}</p>
          <p style={{ margin: 0, fontSize: 14 }}>
            Run an analysis on the <a href="/aquascan-pro-v3">AquaScan page</a> and download its report; it will be listed here, in this browser only.
          </p>
        </div>
      ) : (
        <>
          <p data-testid="report-history-local" style={{ margin: '0 0 12px', fontSize: 13, color: '#475569' }}>
            <strong>{LOCAL_REPORTS_LABEL}.</strong> {LOCAL_REPORTS_NOTE}
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Downloaded</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Site</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Format</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Where it is kept</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={`${r.id}-${r.timestamp}`} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px' }}>{new Date(r.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{placeOf(r)}</td>
                    <td style={{ padding: '12px' }}>{r.format}</td>
                    <td style={{ padding: '12px' }}>{LOCAL_REPORTS_LABEL}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
