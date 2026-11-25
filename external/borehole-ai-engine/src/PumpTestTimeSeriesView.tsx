/**
 * Pump Test tab: the time-series pumping-test analysis (2026-11-25). Every value
 * shown comes from analysis.rows, the same rows the exports print, so the screen
 * and the reports cannot disagree.
 */
import type { TimeSeriesAnalysis } from './pumpTestTimeSeries';

const cell = { padding: '4px 6px', borderBottom: '1px solid var(--border)', verticalAlign: 'top' as const, fontSize: 12 };

/** Semi-log plot: observed drawdown, Theis fit and the Cooper-Jacob line (SVG, no library). */
function SemilogPlot({ a }: { a: TimeSeriesAnalysis }) {
  const pts = a.theis?.residuals ?? [];
  if (pts.length < 2) return null;
  const W = 520, H = 220, L = 46, R = 10, T = 10, B = 34;
  const lx = pts.map((p) => Math.log10(p.t_min));
  const x0 = Math.floor(Math.min(...lx)), x1 = Math.ceil(Math.max(...lx));
  const yMax = Math.max(...pts.map((p) => Math.max(p.observed_m, p.fitted_m))) * 1.1 || 1;
  const X = (t: number) => L + ((Math.log10(t) - x0) / Math.max(1e-9, x1 - x0)) * (W - L - R);
  const Y = (s: number) => T + (s / yMax) * (H - T - B); // drawdown increases downwards
  const cj = a.cooperJacob;
  const cjLine = cj ? [cj.segment.from_min, pts[pts.length - 1].t_min].map((t) => [X(t), Y(cj.slopePerLogCycle_m * Math.log10(t / cj.t0_min))]) : null;
  const decades = Array.from({ length: x1 - x0 + 1 }, (_, i) => x0 + i);
  return (
    <svg role="img" aria-label="Semi-log plot of drawdown against time" viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, background: 'var(--bg-secondary)', borderRadius: 6 }}>
      {decades.map((d) => <g key={d}><line x1={X(10 ** d)} x2={X(10 ** d)} y1={T} y2={H - B} stroke="currentColor" strokeOpacity={0.15} /><text x={X(10 ** d)} y={H - B + 14} fontSize={10} textAnchor="middle" fill="currentColor">{10 ** d}</text></g>)}
      <text x={(W + L) / 2} y={H - 4} fontSize={10} textAnchor="middle" fill="currentColor">time since pumping started (min, log scale)</text>
      <text x={12} y={H / 2} fontSize={10} textAnchor="middle" fill="currentColor" transform={`rotate(-90 12 ${H / 2})`}>drawdown (m)</text>
      {[0, 0.5, 1].map((f) => <text key={f} x={L - 4} y={Y(yMax * f) + 3} fontSize={10} textAnchor="end" fill="currentColor">{(yMax * f).toFixed(2)}</text>)}
      <polyline fill="none" stroke="#06b6d4" strokeWidth={2} points={pts.map((p) => `${X(p.t_min)},${Y(p.fitted_m)}`).join(' ')} />
      {cjLine && <line x1={cjLine[0][0]} y1={cjLine[0][1]} x2={cjLine[1][0]} y2={cjLine[1][1]} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 3" />}
      {pts.map((p) => <circle key={p.t_min} cx={X(p.t_min)} cy={Y(p.observed_m)} r={2.5} fill="currentColor" />)}
      <g fontSize={10} fill="currentColor"><circle cx={L + 10} cy={T + 8} r={2.5} /><text x={L + 18} y={T + 11}>measured</text>
        <line x1={L + 80} x2={L + 96} y1={T + 8} y2={T + 8} stroke="#06b6d4" strokeWidth={2} /><text x={L + 100} y={T + 11}>Theis fit</text>
        {cjLine && <><line x1={L + 160} x2={L + 176} y1={T + 8} y2={T + 8} stroke="#f59e0b" strokeDasharray="5 3" /><text x={L + 180} y={T + 11}>Cooper-Jacob line</text></>}
      </g>
    </svg>
  );
}

export function PumpTestTimeSeriesView({ a }: { a: TimeSeriesAnalysis }) {
  return (
    <div data-testid="pumptest-timeseries">
      {a.insufficientEvidence && (
        <div role="alert" style={{ border: '2px solid #dc2626', background: 'rgba(220,38,38,0.08)', borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <strong style={{ color: '#dc2626' }}>{a.insufficientEvidence}</strong>
          {a.required && <ul style={{ fontSize: 12, margin: '6px 0 0', paddingLeft: 18 }}>{a.required.map((r) => <li key={r}>{r}</li>)}</ul>}
        </div>
      )}
      <SemilogPlot a={a} />
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
        <thead><tr><th style={{ ...cell, textAlign: 'left' }}>Item</th><th style={{ ...cell, textAlign: 'left' }}>Value</th><th style={{ ...cell, textAlign: 'left' }}>Basis</th></tr></thead>
        <tbody>{a.rows.map((r, i) => <tr key={i}><td style={cell}>{r[0]}</td><td style={{ ...cell, fontWeight: 700 }}>{r[1]}</td><td style={cell}>{r[2]}</td></tr>)}</tbody>
      </table>
      {a.limitations.length > 0 && (
        <div style={{ marginTop: 10, padding: 8, borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)', fontSize: 12 }}>
          <strong>Limitations:</strong>
          <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>{a.limitations.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}
      <details style={{ marginTop: 8, fontSize: 12 }}>
        <summary>Assumptions and references</summary>
        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>{a.assumptions.map((x) => <li key={x}>{x}</li>)}</ul>
        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>{a.references.map((x) => <li key={x}>{x}</li>)}</ul>
      </details>
      {a.theis && (
        <details style={{ marginTop: 8, fontSize: 12 }}>
          <summary>Theis fit residuals ({a.theis.residuals.length} readings)</summary>
          <table style={{ borderCollapse: 'collapse' }}>
            <thead><tr><th style={cell}>t (min)</th><th style={cell}>measured s (m)</th><th style={cell}>fitted s (m)</th><th style={cell}>residual (m)</th></tr></thead>
            <tbody>{a.theis.residuals.map((p) => <tr key={p.t_min}><td style={cell}>{p.t_min}</td><td style={cell}>{p.observed_m}</td><td style={cell}>{p.fitted_m.toFixed(4)}</td><td style={cell}>{p.residual_m.toFixed(4)}</td></tr>)}</tbody>
          </table>
        </details>
      )}
    </div>
  );
}

export default PumpTestTimeSeriesView;
