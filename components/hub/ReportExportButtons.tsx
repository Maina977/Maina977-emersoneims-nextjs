'use client';

/**
 * ReportExportButtons
 * -------------------
 * Two-button strip that downloads the current Hub tool's audit data as
 * a comprehensive PDF and as a multi-sheet Excel workbook. Both
 * exporters dynamically import their heavy dependencies (jsPDF +
 * jspdf-autotable; ExcelJS) so they stay out of the initial Hub bundle
 * and only load on the first click.
 */

import * as React from 'react';
import {
  exportQuotePdf,
  exportQuoteExcel,
  type ExportPayload,
} from '@/lib/hub/quoteExporters';

interface Props {
  /** Resolved at click-time so the buttons always export the latest state. */
  buildPayload: () => ExportPayload;
  /** Optional className passed through to the wrapper. */
  className?: string;
}

type Status = 'idle' | 'pdf' | 'excel' | 'error';

export default function ReportExportButtons({ buildPayload, className = '' }: Props) {
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<string | null>(null);

  const run = async (kind: 'pdf' | 'excel') => {
    setStatus(kind);
    setError(null);
    try {
      const payload = buildPayload();
      if (kind === 'pdf') await exportQuotePdf(payload);
      else await exportQuoteExcel(payload);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-xl border bg-surface-base p-4 ${className}`}
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-ink-primary">
          Download a comprehensive report
        </div>
        <p className="mt-0.5 text-xs text-ink-muted">
          Includes every line — generators, ATS, switchgear, batteries, racking,
          cabling, accessories — with benchmarks, findings, scope coverage and
          tier alternatives. Indicative pricing; final quote on letterhead.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => run('pdf')}
          disabled={status === 'pdf' || status === 'excel'}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:cursor-wait disabled:opacity-60"
          style={{ background: 'var(--color-brand-blue, #0071e3)' }}
        >
          {status === 'pdf' ? 'Building PDF…' : 'Download PDF'}
        </button>
        <button
          type="button"
          onClick={() => run('excel')}
          disabled={status === 'pdf' || status === 'excel'}
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60"
          style={{
            borderColor: 'var(--color-border-subtle)',
            color: 'var(--color-brand-blue, #0071e3)',
            background: 'transparent',
          }}
        >
          {status === 'excel' ? 'Building Excel…' : 'Download Excel'}
        </button>
      </div>

      {error && (
        <div className="basis-full text-xs font-medium" style={{ color: '#b71c1c' }}>
          {error}
        </div>
      )}
    </div>
  );
}
