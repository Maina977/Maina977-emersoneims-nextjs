'use client';

import React, { useState } from 'react';
import { ReportHistory } from './ReportHistory';
import { ReportViewer } from './ReportViewer';
import { ReportDownload } from './ReportDownload';
import { ReportShare } from './ReportShare';

export default function ReportsHub() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedReportData, setSelectedReportData] = useState<any>(null);
  const [view, setView] = useState<'history' | 'viewer' | 'download' | 'share'>('history');

  const handleSelectReport = (id: string, data?: any) => {
    setSelectedReportId(id);
    setSelectedReportData(data ?? { id, title: `Report ${id}` });
    setView('viewer');
  };

  const handleBack = () => {
    setSelectedReportId(null);
    setSelectedReportData(null);
    setView('history');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {selectedReportId && (
            <button
              onClick={handleBack}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← Back to History
            </button>
          )}
          <h1 style={{ margin: 0, fontSize: 'clamp(1.25rem,4vw,1.75rem)', fontWeight: 700, color: '#1e293b' }}>
            💧 AquaScan Reports
          </h1>
          {selectedReportId && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {(['viewer', 'download', 'share'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: view === v ? '#3b82f6' : '#e2e8f0',
                    color: view === v ? 'white' : '#334155',
                  }}
                >
                  {v === 'viewer' ? '👁 View' : v === 'download' ? '⬇ Download' : '🔗 Share'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        {view === 'history' && (
          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <ReportHistory />
          </div>
        )}

        {view === 'viewer' && selectedReportId && selectedReportData && (
          <ReportViewer
            reportId={selectedReportId}
            reportData={selectedReportData}
            onDownload={() => setView('download')}
            onShare={() => setView('share')}
          />
        )}

        {view === 'download' && selectedReportId && (
          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <ReportDownload reportId={selectedReportId} onDownloadComplete={() => setView('viewer')} />
          </div>
        )}

        {view === 'share' && selectedReportId && (
          <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <ReportShare reportId={selectedReportId} reportUrl={typeof window !== 'undefined' ? window.location.href : ''} />
          </div>
        )}
      </div>
    </div>
  );
}
