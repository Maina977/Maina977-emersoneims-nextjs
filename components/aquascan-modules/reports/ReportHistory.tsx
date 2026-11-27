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

function placeOf(r: ReportRecord): string {
  const named = [r.city, r.region, r.country].filter((x) => x && x !== 'Unknown' && x !== 'N/A');
  return named.length ? named.join(', ') : r.coordinates || 'Location not recorded';
}

export const ReportHistory: React.FC = () => {
  const [reports, setReports] = useState<ReportRecord[] | null>(null);

  useEffect(() => {
    // Only what this browser recorded when the visitor downloaded a report.
    const list = typeof window === 'undefined' ? [] : getHistory();
    setReports([...list].sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp))));
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
