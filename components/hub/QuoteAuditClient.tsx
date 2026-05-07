'use client';

import * as React from 'react';
import { Card, SectionHeading, SampleBadge, HubConnectStrip } from '@/components/hub/HubShell';
import {
  KPICard,
  LockedChart,
  formatValue,
  resolveStatus,
  statusPalette,
  type StatusKey,
} from '@/components/charts/dataviz';

/**
 * Quotation Audit UI — client island.
 *
 * Reviews quotation lines against catalogue references and engineering norms.
 * All severities use the shared status logic — no per-module red/amber/green.
 */

type Severity = Extract<StatusKey, 'success' | 'info' | 'warning' | 'danger'>;

type Scope =
  | 'generator' | 'ats' | 'bms' | 'combiner' | 'racking' | 'wiring' | 'trunking'
  | 'conduit' | 'mounting' | 'accessories' | 'maintenance-bypass' | 'external-battery'
  | 'labour' | 'warranty' | 'tank' | 'switchgear' | 'ups' | 'pv-module' | 'inverter'
  | 'battery' | 'other';

const SCOPE_LABEL: Record<Scope, string> = {
  generator: 'Generator', ats: 'ATS', bms: 'BMS', combiner: 'Combiner box',
  racking: 'Racking', wiring: 'Wiring', trunking: 'Trunking', conduit: 'Conduit',
  mounting: 'Mounting', accessories: 'Accessories',
  'maintenance-bypass': 'Maintenance bypass', 'external-battery': 'External battery',
  labour: 'Labour', warranty: 'Warranty', tank: 'Fuel tank', switchgear: 'Switchgear',
  ups: 'UPS', 'pv-module': 'PV module', inverter: 'Inverter', battery: 'Battery',
  other: 'Other',
};

// Scopes that any complete diesel-genset + PV + UPS quotation should cover.
// Missing scopes are flagged as warnings (or danger if life-safety relevant).
const REQUIRED_SCOPES: Array<{ scope: Scope; severity: Severity; reason: string }> = [
  { scope: 'generator',          severity: 'danger',  reason: 'No genset line item.' },
  { scope: 'ats',                severity: 'danger',  reason: 'No automatic transfer switch — mandatory for unattended switching.' },
  { scope: 'tank',               severity: 'warning', reason: 'No bunded day tank — verify integrated base-tank coverage.' },
  { scope: 'wiring',             severity: 'warning', reason: 'No power-cable line — confirm not under labour or ATS bundle.' },
  { scope: 'switchgear',         severity: 'warning', reason: 'No MCCB/distribution — confirm not bundled with ATS.' },
  { scope: 'labour',             severity: 'warning', reason: 'No installation/commissioning labour line.' },
  { scope: 'warranty',           severity: 'warning', reason: 'No explicit warranty line or term.' },
  { scope: 'maintenance-bypass', severity: 'warning', reason: 'No maintenance bypass for UPS — service requires shutdown.' },
  { scope: 'bms',                severity: 'warning', reason: 'No BMS for battery bank — unsafe lithium operation.' },
  { scope: 'combiner',           severity: 'warning', reason: 'No PV combiner box — string protection unaccounted.' },
  { scope: 'racking',            severity: 'warning', reason: 'No PV racking line.' },
  { scope: 'mounting',           severity: 'warning', reason: 'No mounting hardware line.' },
  { scope: 'trunking',           severity: 'info',    reason: 'No trunking line — confirm cable management coverage.' },
  { scope: 'conduit',            severity: 'info',    reason: 'No conduit line — confirm exposed runs are protected.' },
  { scope: 'accessories',        severity: 'info',    reason: 'No accessories line (lugs, glands, labels).' },
  { scope: 'external-battery',   severity: 'info',    reason: 'If external battery cabinet is required, no line covers it.' },
];

// Vague phrasing patterns — flagged so reviewer can demand specifics.
const VAGUE_PATTERNS: RegExp[] = [
  /\bas\s+per\s+(site|spec)\b/i,
  /\bto\s+suit\b/i,
  /\ballowance\b/i,
  /\bmiscellaneous\b/i,
  /\bsundries?\b/i,
  /\betc\.?\b/i,
  /\blump\s*sum\b/i,
  /\bprovisional\b/i,
];

// Misleading phrasing patterns — claims that need evidence.
const MISLEADING_PATTERNS: Array<{ re: RegExp; reason: string }> = [
  { re: /\boriginal\b/i,            reason: '"Original" claim — require manufacturer documentation.' },
  { re: /\bgenuine\b/i,             reason: '"Genuine" claim — require authorised-dealer proof.' },
  { re: /\bequivalent\b/i,          reason: '"Equivalent" — require named substitute SKU + spec sheet.' },
  { re: /\bbrand\s*new\b/i,         reason: '"Brand new" — require seal photo and serial number.' },
  { re: /\b(lifetime|forever)\b/i,  reason: 'Unbounded warranty term — require written terms.' },
  { re: /\bup\s*to\b/i,             reason: '"Up to" qualifier — require minimum guaranteed value.' },
];

interface Line {
  ref: string;
  description: string;
  qty: number;
  unitPriceKes: number;
  catalogueKes?: number;       // expected price (sample)
  unit?: string;
  scope: Scope;
}

interface Finding {
  ref: string;
  severity: Severity;
  rule: string;
  detail: string;
  deltaPct?: number;
  scope?: Scope;
}

const SAMPLE_LINES: Line[] = [
  { ref: 'GEN-250-CUM',  description: 'Cummins 250 kVA prime, sound-attenuated', qty: 1, unitPriceKes: 5_400_000, catalogueKes: 4_950_000, scope: 'generator' },
  { ref: 'ATS-400A',     description: 'ATS 400 A, 4-pole, IP54',                 qty: 1, unitPriceKes:   480_000, catalogueKes:   460_000, scope: 'ats' },
  { ref: 'CABLE-95-CU',  description: '4×95 mm² Cu XLPE cable',                  qty: 40, unitPriceKes:    18_500, catalogueKes:    17_200, unit: 'm', scope: 'wiring' },
  { ref: 'TANK-1000L',   description: 'Bunded day tank 1,000 L',                  qty: 1, unitPriceKes:   285_000, catalogueKes:   220_000, scope: 'tank' },
  { ref: 'INSTALL-LBR',  description: 'Installation, commissioning, T&C as per site allowance', qty: 1, unitPriceKes: 1_250_000, scope: 'labour' },
  { ref: 'CB-MCCB-400',  description: 'MCCB 400 A, Icu 50 kA',                    qty: 2, unitPriceKes:    96_000, catalogueKes:    92_000, scope: 'switchgear' },
  { ref: 'WARR-12M',     description: 'Original manufacturer warranty up to 12 months', qty: 1, unitPriceKes: 0, scope: 'warranty' },
  { ref: 'MISC-SUNDRY',  description: 'Miscellaneous sundries and accessories etc.', qty: 1, unitPriceKes: 65_000, scope: 'accessories' },
];

function audit(lines: Line[]): { findings: Finding[]; totalKes: number; expectedKes: number } {
  const findings: Finding[] = [];
  let total = 0;
  let expected = 0;

  for (const l of lines) {
    total += l.qty * l.unitPriceKes;
    if (l.catalogueKes != null) expected += l.qty * l.catalogueKes;

    if (l.catalogueKes != null) {
      const delta = ((l.unitPriceKes - l.catalogueKes) / l.catalogueKes) * 100;
      // Severity from the BUYER's perspective: positive delta = over-quoted = bad.
      // Negative delta = under benchmark = buyer-favourable. Never assign
      // `success` to an over-quote, regardless of magnitude.
      const sev: Severity =
        delta >=  25 ? 'danger'  :  // severely over benchmark
        delta >=  12 ? 'warning' :  // significantly over
        delta >=   5 ? 'info'    :  // mildly over — surfaced, but not alarming
        delta <=  -5 ? 'success' :  // under benchmark — buyer wins
        'info';
      if (Math.abs(delta) >= 5) {
        findings.push({
          ref: l.ref,
          severity: sev,
          rule: 'Price vs. catalogue',
          detail: `Unit price ${formatValue(l.unitPriceKes, { currency: 'KES' })} vs. ${formatValue(l.catalogueKes, { currency: 'KES' })}.`,
          deltaPct: delta,
        });
      }
    } else {
      findings.push({
        ref: l.ref,
        severity: 'warning',
        rule: 'No catalogue reference',
        detail: 'Line has no benchmark price. Add to catalogue or request supporting quotation.',
      });
    }
  }

  // Engineering rules (sample — extend with real norm checks)
  const cable = lines.find(l => l.ref === 'CABLE-95-CU');
  if (cable && cable.qty < 25) {
    findings.push({
      ref: cable.ref,
      severity: 'warning',
      rule: 'Cable length sanity',
      detail: 'Less than 25 m of run cable on a 250 kVA install — verify single-line diagram.',
    });
  }
  const labour = lines.find(l => l.ref === 'INSTALL-LBR');
  if (labour && labour.unitPriceKes / total > 0.3) {
    findings.push({
      ref: labour.ref,
      severity: 'danger',
      rule: 'Labour ratio',
      detail: `Installation labour is ${formatValue((labour.unitPriceKes / total) * 100, { unit: '%', decimals: 1 })} of total — typical 10–20 %.`,
    });
  }

  // Scope coverage — missing required scopes.
  const presentScopes = new Set(lines.map(l => l.scope));
  for (const r of REQUIRED_SCOPES) {
    if (!presentScopes.has(r.scope)) {
      findings.push({
        ref: '—',
        severity: r.severity,
        rule: `Missing scope: ${SCOPE_LABEL[r.scope]}`,
        detail: r.reason,
        scope: r.scope,
      });
    }
  }

  // Vague phrasing detection.
  for (const l of lines) {
    for (const re of VAGUE_PATTERNS) {
      if (re.test(l.description)) {
        findings.push({
          ref: l.ref,
          severity: 'warning',
          rule: 'Vague line item',
          detail: `Description contains vague phrasing matching ${re}. Require itemised scope.`,
          scope: l.scope,
        });
        break;
      }
    }
  }

  // Misleading phrasing detection.
  for (const l of lines) {
    for (const m of MISLEADING_PATTERNS) {
      if (m.re.test(l.description)) {
        findings.push({
          ref: l.ref,
          severity: 'warning',
          rule: 'Potentially misleading',
          detail: m.reason,
          scope: l.scope,
        });
      }
    }
  }

  return { findings, totalKes: total, expectedKes: expected };
}

export default function QuoteAuditClient() {
  const [lines] = React.useState<Line[]>(SAMPLE_LINES);
  const result = React.useMemo(() => audit(lines), [lines]);

  const counts = {
    danger:  result.findings.filter(f => f.severity === 'danger').length,
    warning: result.findings.filter(f => f.severity === 'warning').length,
    info:    result.findings.filter(f => f.severity === 'info').length,
    success: result.findings.filter(f => f.severity === 'success').length,
  };

  const overallDelta = ((result.totalKes - result.expectedKes) / Math.max(1, result.expectedKes)) * 100;
  const overallStatus: StatusKey = resolveStatus(overallDelta, { warning: 8, danger: 18, invert: true });

  return (
    <div className="space-y-6">
      {/* Summary KPIs ─────────────────── */}
      <div className="grid gap-3 md:grid-cols-4">
        <KPICard
          label="Quotation total"
          value={result.totalKes}
          unit=""
          decimals={0}
          caption="KES, all lines · sample"
        />
        <KPICard
          label="Catalogue benchmark"
          value={result.expectedKes}
          unit=""
          decimals={0}
          caption="KES, where benchmarked"
        />
        <KPICard
          label="Overall variance"
          value={overallDelta}
          unit="%"
          decimals={1}
          status={overallStatus}
          caption="Quotation vs. benchmark"
        />
        <KPICard
          label="Open findings"
          value={result.findings.length}
          unit=""
          thresholds={{ warning: 3, danger: 6, invert: true }}
        />
      </div>

      {/* Scope coverage ──────────────── */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading
            eyebrow="Scope coverage"
            title="Required scopes vs. quoted lines"
            caption="A complete project should explicitly cover each scope below or document why it is excluded."
          />
          <SampleBadge />
        </div>
        <div className="flex flex-wrap gap-2">
          {REQUIRED_SCOPES.map(r => {
            const present = lines.some(l => l.scope === r.scope);
            const sev: StatusKey = present ? 'success' : r.severity;
            return (
              <span key={r.scope} className={`status-chip status-chip--${sev}`} title={r.reason}>
                {SCOPE_LABEL[r.scope]} · {present ? 'covered' : 'missing'}
              </span>
            );
          })}
        </div>
      </Card>

      {/* Tier alternatives ─────────── */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading
            eyebrow="Alternatives"
            title="Premium · Balanced · Budget-safe"
            caption="Three viable bills of quantities at the same site spec. Budget-safe trims optional spend without breaking life-safety scopes."
          />
          <SampleBadge />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <TierCard
            tier="premium"
            title="Premium"
            priceKes={Math.round(result.totalKes * 1.18)}
            highlights={[
              'Tier-1 brand genset (Cummins / Caterpillar)',
              'Lithium battery + maintenance bypass',
              '24-month parts + labour warranty',
              'Remote monitoring + IoT controller',
            ]}
            tradeoffs="Highest CapEx; lowest lifetime risk."
          />
          <TierCard
            tier="balanced"
            title="Balanced"
            priceKes={result.totalKes}
            highlights={[
              'Quoted brand genset (as audited)',
              'AGM battery + manual bypass',
              '12-month parts warranty',
              'Local controller + scheduled service',
            ]}
            tradeoffs="Best value at audited spec. Default recommendation."
          />
          <TierCard
            tier="budget"
            title="Budget-safe"
            priceKes={Math.round(result.totalKes * 0.82)}
            highlights={[
              'Tier-2 genset, manufacturer-authorised',
              'AGM battery, no bypass (planned outages)',
              '6-month parts warranty',
              'Manual changeover or simple ATS',
            ]}
            tradeoffs="Never strips ATS, BMS, earthing, labour, or warranty."
          />
        </div>
      </Card>

      {/* Findings + chart ─────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading eyebrow="Findings" title="Issues raised by the audit" />
            <SampleBadge />
          </div>
          <ol className="space-y-2">
            {result.findings.map((f, i) => {
              const p = statusPalette(f.severity);
              return (
                <li
                  key={`${f.ref}-${i}`}
                  className="flex items-start gap-3 rounded-md border bg-surface-base p-3"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  <span
                    className={`status-chip status-chip--${f.severity} mt-0.5 shrink-0`}
                  >
                    {f.severity}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-xs text-ink-muted">{f.ref}</span>
                      {f.deltaPct != null ? (
                        <span className="text-xs font-semibold tabular-nums" style={{ color: p.fg }}>
                          {f.deltaPct > 0 ? '+' : ''}{formatValue(f.deltaPct, { unit: '%', decimals: 1 })}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm font-medium text-ink-primary">{f.rule}</div>
                    <p className="text-sm text-ink-muted">{f.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading eyebrow="Severity mix" title="Findings by severity" />
            <SampleBadge />
          </div>
          <LockedChart
            type="bar"
            title="Findings"
            unit=""
            labels={['Critical', 'Warning', 'Info', 'OK']}
            series={[
              { label: 'Findings', data: [counts.danger, counts.warning, counts.info, counts.success], statusKey: 'warning' },
            ]}
            height={220}
          />
        </Card>
      </div>

      {/* Line items table ─────────────── */}
      <Card>
        <SectionHeading eyebrow="Lines" title="Quotation line items" caption="All prices in KES (sample)." />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="px-2 py-2">Ref</th>
                <th className="px-2 py-2">Description</th>
                <th className="px-2 py-2">Scope</th>
                <th className="px-2 py-2 text-right">Qty</th>
                <th className="px-2 py-2 text-right">Unit price (KES)</th>
                <th className="px-2 py-2 text-right">Benchmark (KES)</th>
                <th className="px-2 py-2 text-right">Δ %</th>
                <th className="px-2 py-2 text-right">Line total (KES)</th>
              </tr>
            </thead>
            <tbody>
              {lines.map(l => {
                const total = l.qty * l.unitPriceKes;
                const delta = l.catalogueKes != null
                  ? ((l.unitPriceKes - l.catalogueKes) / l.catalogueKes) * 100
                  : null;
                const statusKey: StatusKey = delta == null
                  ? 'neutral'
                  : resolveStatus(delta, { warning: 12, danger: 25, invert: true });
                const p = statusPalette(statusKey);
                return (
                  <tr key={l.ref} className="border-t" style={{ borderColor: 'var(--color-border-subtle)' }}>
                    <td className="px-2 py-2 font-mono text-xs">{l.ref}</td>
                    <td className="px-2 py-2">{l.description}{l.unit ? <span className="ml-1 text-ink-muted">({l.unit})</span> : null}</td>
                    <td className="px-2 py-2"><span className="status-chip status-chip--neutral">{SCOPE_LABEL[l.scope]}</span></td>
                    <td className="px-2 py-2 text-right tabular-nums">{l.qty}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{formatValue(l.unitPriceKes, { decimals: 0 })}</td>
                    <td className="px-2 py-2 text-right tabular-nums text-ink-muted">{l.catalogueKes != null ? formatValue(l.catalogueKes, { decimals: 0 }) : '—'}</td>
                    <td className="px-2 py-2 text-right tabular-nums" style={{ color: p.fg }}>
                      {delta != null ? `${delta > 0 ? '+' : ''}${formatValue(delta, { unit: '%', decimals: 1 })}` : '—'}
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums font-medium">{formatValue(total, { decimals: 0 })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <HubConnectStrip active="/hub/quote-audit" />
    </div>
  );
}

function TierCard({
  tier, title, priceKes, highlights, tradeoffs,
}: {
  tier: 'premium' | 'balanced' | 'budget';
  title: string;
  priceKes: number;
  highlights: string[];
  tradeoffs: string;
}) {
  const chipClass =
    tier === 'premium' ? 'status-chip--success'
    : tier === 'balanced' ? 'status-chip--info'
    : 'status-chip--warning';
  return (
    <div
      className="flex h-full flex-col rounded-md border bg-surface-base p-4"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={`status-chip ${chipClass}`}>{tier}</span>
        <span className="text-sm font-semibold tabular-nums">
          {formatValue(priceKes, { decimals: 0 })} KES
        </span>
      </div>
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-ink-secondary">
        {highlights.map(h => <li key={h}>{h}</li>)}
      </ul>
      <p className="mt-3 text-xs text-ink-muted">{tradeoffs}</p>
    </div>
  );
}
