'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip, ProOnly } from '@/components/hub/HubShell';
import { KPICard, StatusBar, LockedChart, formatValue, statusPalette, type StatusKey } from '@/components/charts/dataviz';

/**
 * Maintenance Planner — task schedule + cycle-life predictor for the
 * common solar/UPS asset families. Replaces the "we'll let you know"
 * support model with a transparent calendar.
 */

interface Task {
  id: string;
  asset: string;
  task: string;
  intervalDays: number;
  lastDoneDays: number;     // days since last done (sample)
  consumable?: string;
  pro: boolean;             // requires technician
}

const TASKS: Task[] = [
  // Battery
  { id: 'bat-soc',     asset: 'Lithium battery', task: 'Check SOC + cell-balance via BMS app', intervalDays:  30, lastDoneDays:  18,                          pro: false },
  { id: 'bat-torque',  asset: 'Lithium battery', task: 'Re-torque DC terminals to spec',        intervalDays: 365, lastDoneDays: 410, consumable: 'M8 lugs', pro: true  },
  { id: 'bat-agm-eq',  asset: 'AGM battery',     task: 'Equalisation cycle',                    intervalDays:  90, lastDoneDays:  62,                          pro: true  },
  // Inverter
  { id: 'inv-fan',     asset: 'Inverter',        task: 'Vacuum cooling fans + inlet filters',   intervalDays:  90, lastDoneDays:  35, consumable: 'filter mat', pro: false },
  { id: 'inv-fw',      asset: 'Inverter',        task: 'Apply firmware update if available',    intervalDays: 180, lastDoneDays: 220,                          pro: true  },
  // PV
  { id: 'pv-wash',     asset: 'PV array',        task: 'Module wash with deionised water',      intervalDays:  90, lastDoneDays:  74, consumable: 'DI water',   pro: false },
  { id: 'pv-ir',       asset: 'PV array',        task: 'IR thermography scan',                  intervalDays: 365, lastDoneDays: 290,                          pro: true  },
  { id: 'pv-iv',       asset: 'PV array',        task: 'String I-V curve test',                 intervalDays: 365, lastDoneDays: 410,                          pro: true  },
  // UPS
  { id: 'ups-trans',   asset: 'UPS',             task: 'Transfer test — pull mains, log time',  intervalDays:  90, lastDoneDays:  88,                          pro: false },
  { id: 'ups-runtime', asset: 'UPS',             task: 'Full discharge runtime test',           intervalDays: 365, lastDoneDays: 380,                          pro: true  },
  // Genset
  { id: 'gen-oil',     asset: 'Genset',          task: 'Oil + filter change',                   intervalDays: 250, lastDoneDays: 200, consumable: 'oil + filter', pro: true },
  { id: 'gen-load',    asset: 'Genset',          task: 'Load-bank test at 80 % rated',          intervalDays: 365, lastDoneDays: 305,                          pro: true  },
  // Earthing / SPD
  { id: 'earth',       asset: 'Earthing',        task: 'Fall-of-potential resistance test',     intervalDays: 365, lastDoneDays: 200,                          pro: true  },
  { id: 'spd',         asset: 'SPD',             task: 'Inspect status windows + replace if red', intervalDays: 90, lastDoneDays: 60,                          pro: false },
];

function status(t: Task): StatusKey {
  const overdue = t.lastDoneDays - t.intervalDays;
  if (overdue >= 30) return 'danger';
  if (overdue >= 0)  return 'warning';
  if (overdue >= -t.intervalDays * 0.2) return 'info';
  return 'success';
}

export default function MaintenanceClient() {
  const [filter, setFilter] = React.useState<string>('all');
  const assets = Array.from(new Set(TASKS.map((t) => t.asset)));
  const list = filter === 'all' ? TASKS : TASKS.filter((t) => t.asset === filter);

  const overdue = TASKS.filter((t) => status(t) === 'danger').length;
  const dueSoon = TASKS.filter((t) => status(t) === 'warning').length;
  const ok      = TASKS.filter((t) => status(t) === 'success' || status(t) === 'info').length;

  // 12-month cycle health projection (sample): lithium vs AGM
  const months = Array.from({ length: 13 }, (_, i) => `M${i}`);
  const li  = months.map((_, i) => Math.max(70, 100 - i * 0.6));
  const agm = months.map((_, i) => Math.max(40, 100 - i * 4.5));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard label="Overdue tasks" value={overdue}  unit="tasks" status={overdue ? 'danger' : 'success'} decimals={0} />
        <KPICard label="Due soon"      value={dueSoon}  unit="tasks" status={dueSoon ? 'warning' : 'success'} decimals={0} />
        <KPICard label="Healthy"       value={ok}       unit="tasks" status="success" decimals={0} />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Schedule" title="Task list" caption="Sorted by status. Pro tasks need a technician." />
          <SampleBadge />
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          {(['all', ...assets]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setFilter(a)}
              className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{
                borderColor: filter === a ? 'var(--color-brand-blue)' : 'var(--color-border-subtle)',
                background: filter === a ? 'var(--color-brand-blue)' : 'transparent',
                color: filter === a ? '#fff' : 'var(--color-text-secondary)',
              }}
            >
              {a}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {list
            .slice()
            .sort((a, b) => (b.lastDoneDays - b.intervalDays) - (a.lastDoneDays - a.intervalDays))
            .map((t) => {
              const sk = status(t);
              const p = statusPalette(sk);
              const next = Math.max(0, t.intervalDays - t.lastDoneDays);
              return (
                <li key={t.id} className="rounded-md border p-3"
                    style={{ borderColor: p.border, background: p.bg }}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                        {t.asset}{t.pro ? ' · pro task' : ' · user-safe'}
                      </div>
                      <div className="text-sm font-semibold tracking-tight">{t.task}</div>
                      {t.consumable && (
                        <div className="mt-0.5 text-[11px] text-ink-muted">Consumable: {t.consumable}</div>
                      )}
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-mono tabular-nums" style={{ color: p.fg }}>
                        {sk === 'danger' && `${t.lastDoneDays - t.intervalDays} d overdue`}
                        {sk === 'warning' && `${t.lastDoneDays - t.intervalDays} d overdue`}
                        {(sk === 'info' || sk === 'success') && `next in ${next} d`}
                      </div>
                      <div className="text-[11px] text-ink-muted">interval: {t.intervalDays} d</div>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading
            eyebrow="Predict"
            title="12-month battery health projection"
            caption="Lithium with regular SOC checks vs. AGM with skipped equalisation."
          />
          <SampleBadge />
        </div>
        <LockedChart
          type="line"
          title="Predicted state-of-health"
          unit="%"
          decimals={0}
          labels={months}
          series={[
            { label: 'Lithium · scheduled care',  data: li },
            { label: 'AGM · skipped equalisation', data: agm },
          ]}
        />
      </Card>

      <ProOnly note="Engineering breakdown of acceptance criteria — switch to Pro mode to view.">
        <Card>
          <SectionHeading eyebrow="Pro · acceptance" title="Numbers a technician should bring back" />
          <ul className="grid gap-2 md:grid-cols-2 text-xs">
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Battery cell-balance Δ &lt; 30 mV</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Inverter heatsink Δθ &lt; 25 K above ambient</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>String I-V Pmax within 5 % of nameplate</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>UPS transfer time &lt; 10 ms</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Earth resistance ≤ 5 Ω domestic / ≤ 2 Ω commercial</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Genset oil pressure within manufacturer band at hot idle</li>
          </ul>
        </Card>
      </ProOnly>

      <Card>
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          Pair the planner with{' '}
          <Link href="/hub/diagnostics" className="text-ink-link">Diagnostics</Link>,{' '}
          <Link href="/hub/safety" className="text-ink-link">Safety &amp; Fire</Link> and{' '}
          <Link href="/hub/abuse" className="text-ink-link">Abuse Predictor</Link> to keep the asset out of the warning band.
        </p>
      </Card>

      <HubConnectStrip active="/hub/maintenance" />
    </div>
  );
}
