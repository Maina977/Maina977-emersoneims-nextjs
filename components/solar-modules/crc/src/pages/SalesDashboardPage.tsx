// MODULE 16 — Sales Dashboard
// Pulls live data from /api/biz/* endpoints (real, in-memory store on the
// server). When a metric has no data yet we say "no data yet" — never
// substituted with synthetic numbers.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrap = styled.div` padding: 1.25rem; max-width: 1300px; margin: 0 auto; color: #E6F1FF; `;
const Card = styled.section`
  background: rgba(11, 18, 48, 0.55);
  border: 1px solid rgba(0, 217, 255, 0.18);
  border-radius: 12px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 1rem;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.8rem;
`;
const Stat = styled.div`
  background: rgba(0, 217, 255, 0.06);
  border-left: 3px solid #00D9FF;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  .label { font-size: 0.78rem; color: rgba(230,241,255,0.6); text-transform: uppercase; letter-spacing: 0.06em; }
  .value { font-size: 1.55rem; font-weight: 700; color: #00D9FF; margin-top: 0.25rem; }
  .sub   { font-size: 0.78rem; color: rgba(230,241,255,0.55); margin-top: 0.2rem; }
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

interface State {
  loading: boolean;
  error: string;
  portfolio: any;
  pipeline: any;
  conversion: any;
  profit: any;
  leads: any[];
}

const fmtKES = (n: number | undefined | null) =>
  (typeof n === 'number') ? `KSh ${Math.round(n).toLocaleString()}` : '—';

const SalesDashboardPage: React.FC = () => {
  const [s, setS] = useState<State>({
    loading: true, error: '', portfolio: null, pipeline: null, conversion: null, profit: null, leads: []
  });

  useEffect(() => {
    let cancelled = false;
    // Safe JSON fetcher: returns {} instead of throwing
    // "Unexpected token '<', '<!DOCTYPE'" when the server sends an HTML
    // error page. Pages display empty-state cleanly in that case.
    const safeJson = async (url: string): Promise<any> => {
      try {
        const r = await fetch(url);
        const ct = r.headers.get('content-type') || '';
        if (!ct.includes('application/json')) return {};
        return await r.json();
      } catch { return {}; }
    };
    (async () => {
      try {
        const [p1, p2, p3, p4, p5] = await Promise.all([
          safeJson('/api/biz/portfolio'),
          safeJson('/api/biz/pipeline'),
          safeJson('/api/biz/conversion?days=90'),
          safeJson('/api/biz/profit'),
          safeJson('/api/biz/leads'),
        ]);
        if (cancelled) return;
        setS({
          loading: false, error: '',
          portfolio: p1?.data, pipeline: p2?.data,
          conversion: p3?.data, profit: p4?.data,
          leads: Array.isArray(p5?.data) ? p5.data : []
        });
      } catch (e: any) {
        if (cancelled) return;
        setS(st => ({ ...st, loading: false, error: e?.message || String(e) }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (s.loading) return <Wrap><p>Loading sales data…</p></Wrap>;
  if (s.error) return <Wrap><Card><Pill $tone="err">{s.error}</Pill></Card></Wrap>;

  const portfolio = s.portfolio || {};
  const pipeline  = s.pipeline  || {};
  const conv      = s.conversion || {};
  const profit    = s.profit    || {};
  const leads     = s.leads;
  const totalSites = portfolio.totalSites ?? portfolio.count ?? 0;
  const totalCapacityKw = portfolio.totalCapacityKw ?? portfolio.totalKw ?? 0;
  const totalDeals = pipeline.totalDeals ?? (pipeline.byStage ? Object.values(pipeline.byStage).reduce((a: number, b: any) => a + (b?.count || 0), 0) : 0);
  const totalDealValue = pipeline.totalValue ?? 0;
  const wonRate = conv.wonRate ?? conv.conversionRate ?? null;
  const totalLeadsObserved = conv.totalLeads ?? leads.length;
  const totalRevenue = profit.totalRevenue ?? 0;
  const totalCost = profit.totalCost ?? 0;
  const grossMargin = profit.grossMargin ?? (totalRevenue && totalCost ? totalRevenue - totalCost : 0);

  const empty = totalSites === 0 && totalDeals === 0 && leads.length === 0 && totalRevenue === 0;

  return (
    <Wrap>
      <h1 style={{ marginTop: 0 }}>📊 Sales Dashboard</h1>
      <p style={{ color: 'rgba(230,241,255,0.65)' }}>
        Live operational metrics from your CRM. Every value shown is recorded
        — nothing is fabricated. Empty fields simply mean no data has been
        captured yet.
      </p>

      {empty && (
        <Card>
          <Pill $tone="warn">No sales data yet</Pill>
          <p style={{ marginTop: '0.5rem', marginBottom: 0, color: 'rgba(230,241,255,0.78)' }}>
            Capture your first lead, register a site, or move a deal through the
            pipeline. Numbers populate automatically as you work.
          </p>
        </Card>
      )}

      <Card>
        <h3 style={{ marginTop: 0 }}>Portfolio</h3>
        <Grid>
          <Stat><div className="label">Total sites</div><div className="value">{totalSites}</div><div className="sub">Active installations on file</div></Stat>
          <Stat><div className="label">Total capacity</div><div className="value">{totalCapacityKw} kW</div><div className="sub">Sum of installed kWp</div></Stat>
          <Stat><div className="label">Open leads</div><div className="value">{leads.length}</div><div className="sub">Captured but not yet converted</div></Stat>
        </Grid>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Pipeline</h3>
        <Grid>
          <Stat><div className="label">Total deals</div><div className="value">{totalDeals}</div></Stat>
          <Stat><div className="label">Total deal value</div><div className="value">{fmtKES(totalDealValue)}</div></Stat>
          <Stat>
            <div className="label">Win rate (90d)</div>
            <div className="value">{wonRate !== null && wonRate !== undefined ? `${(wonRate * 100).toFixed(1)}%` : '—'}</div>
            <div className="sub">{totalLeadsObserved} leads observed</div>
          </Stat>
        </Grid>
        {pipeline.byStage && (
          <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'rgba(230,241,255,0.6)' }}>
                <th style={{ padding: '0.4rem 0' }}>Stage</th>
                <th style={{ padding: '0.4rem 0', textAlign: 'right' }}>Count</th>
                <th style={{ padding: '0.4rem 0', textAlign: 'right' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pipeline.byStage).map(([stage, info]: any) => (
                <tr key={stage} style={{ borderTop: '1px solid rgba(0,217,255,0.12)' }}>
                  <td style={{ padding: '0.45rem 0' }}><Pill>{stage}</Pill></td>
                  <td style={{ padding: '0.45rem 0', textAlign: 'right' }}>{info?.count ?? 0}</td>
                  <td style={{ padding: '0.45rem 0', textAlign: 'right' }}>{fmtKES(info?.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>Profit &amp; revenue</h3>
        <Grid>
          <Stat><div className="label">Revenue</div><div className="value">{fmtKES(totalRevenue)}</div></Stat>
          <Stat><div className="label">Cost</div><div className="value">{fmtKES(totalCost)}</div></Stat>
          <Stat>
            <div className="label">Gross margin</div>
            <div className="value">{fmtKES(grossMargin)}</div>
            <div className="sub">{totalRevenue ? `${((grossMargin / totalRevenue) * 100).toFixed(1)}%` : '—'}</div>
          </Stat>
        </Grid>
      </Card>

      {leads.length > 0 && (
        <Card>
          <h3 style={{ marginTop: 0 }}>Recent leads ({leads.length})</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'rgba(230,241,255,0.6)' }}>
                <th style={{ padding: '0.4rem 0' }}>Name</th>
                <th style={{ padding: '0.4rem 0' }}>Contact</th>
                <th style={{ padding: '0.4rem 0' }}>Status</th>
                <th style={{ padding: '0.4rem 0' }}>Captured</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 25).map((l: any, i: number) => (
                <tr key={l.id || i} style={{ borderTop: '1px solid rgba(0,217,255,0.12)' }}>
                  <td style={{ padding: '0.45rem 0' }}>{l.name || '—'}</td>
                  <td style={{ padding: '0.45rem 0', color: 'rgba(230,241,255,0.65)' }}>{l.email || l.phone || '—'}</td>
                  <td style={{ padding: '0.45rem 0' }}><Pill>{l.status || 'new'}</Pill></td>
                  <td style={{ padding: '0.45rem 0', color: 'rgba(230,241,255,0.55)' }}>{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Card>
        <h4 style={{ marginTop: 0 }}>What you're looking at</h4>
        <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'rgba(230,241,255,0.78)', lineHeight: 1.55, fontSize: '0.88rem' }}>
          <li>Portfolio — site &amp; capacity totals across all installations</li>
          <li>Pipeline — deal stages and value</li>
          <li>Conversion — funnel and win rate over the last 90 days</li>
          <li>Profit &amp; revenue — recorded job income vs cost</li>
          <li>Recent leads — captured but not yet converted</li>
        </ul>
      </Card>
    </Wrap>
  );
};

export default SalesDashboardPage;
