'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip, ProOnly } from '@/components/hub/HubShell';
import { KPICard, StatusBar, LockedChart, formatValue, statusPalette, type StatusKey } from '@/components/charts/dataviz';

/**
 * Abuse / Misuse Predictor — what happens to the asset when normal-use
 * boundaries are crossed: over-discharge, no-AVR, undervoltage running,
 * dust accumulation, deep-cycling lead-acid, ignoring firmware.
 */

interface Scenario {
  id: string;
  title: string;
  caption: string;
  asset: string;
  // sample state-of-health curve over 24 months under abuse
  curveAbuse: number[];
  curveNormal: number[];
  expectedLifeYearsNormal: number;
  expectedLifeYearsAbuse: number;
  failureMode: string;
  earlyWarnings: string[];
  costMultiplier: number;     // how many times more expensive over 10 years
}

const SCENARIOS: Scenario[] = [
  {
    id: 'overdischarge',
    title: 'Over-discharging lithium below 10 % SOC',
    asset: 'Lithium battery',
    caption: 'Skipping the BMS low-cut and running the bank flat to extend evening hours.',
    curveAbuse:  Array.from({ length: 25 }, (_, m) => Math.max(50, 100 - m * 2.0)),
    curveNormal: Array.from({ length: 25 }, (_, m) => Math.max(80, 100 - m * 0.6)),
    expectedLifeYearsNormal: 8,
    expectedLifeYearsAbuse: 3,
    failureMode: 'Permanent capacity loss, BMS lock-out, eventual cell swelling.',
    earlyWarnings: ['Voltage sags more than 5 % under load', 'Run-time dropping month over month', 'BMS reports increasing internal resistance'],
    costMultiplier: 2.4,
  },
  {
    id: 'noavr',
    title: 'Running inverter without AVR / mains stabiliser',
    asset: 'Inverter / electronics',
    caption: 'Ignoring 180–260 V Kenya mains swings; letting electronics absorb the variation.',
    curveAbuse:  Array.from({ length: 25 }, (_, m) => Math.max(45, 100 - m * 2.4)),
    curveNormal: Array.from({ length: 25 }, (_, m) => Math.max(85, 100 - m * 0.5)),
    expectedLifeYearsNormal: 10,
    expectedLifeYearsAbuse: 4,
    failureMode: 'Electrolytic capacitor degradation, MOSFET avalanche, board failure.',
    earlyWarnings: ['Audible coil whine on certain loads', 'Cooling fan running constantly', 'Random restarts during voltage dips'],
    costMultiplier: 1.8,
  },
  {
    id: 'undervolt',
    title: 'Running motors at <200 V single phase',
    asset: 'Motors / pumps',
    caption: 'Refusing to wait out the brown-out; the pump runs anyway.',
    curveAbuse:  Array.from({ length: 25 }, (_, m) => Math.max(40, 100 - m * 2.6)),
    curveNormal: Array.from({ length: 25 }, (_, m) => Math.max(85, 100 - m * 0.5)),
    expectedLifeYearsNormal: 12,
    expectedLifeYearsAbuse: 4,
    failureMode: 'Winding overheat → insulation breakdown → short to ground.',
    earlyWarnings: ['Motor smells hot after 5 minutes', 'Starting current trips the breaker', 'Bearings sound rough'],
    costMultiplier: 1.6,
  },
  {
    id: 'dust',
    title: 'PV array left unwashed in dusty / coastal site',
    asset: 'PV modules',
    caption: 'Ignoring the quarterly wash; soiling builds up.',
    curveAbuse:  Array.from({ length: 25 }, (_, m) => Math.max(60, 100 - m * 1.6)),
    curveNormal: Array.from({ length: 25 }, (_, m) => Math.max(92, 100 - m * 0.3)),
    expectedLifeYearsNormal: 25,
    expectedLifeYearsAbuse: 12,
    failureMode: 'Hot-spotting, bypass-diode failure, encapsulant browning.',
    earlyWarnings: ['Daily yield 15 % below first-year baseline', 'Visible patchy soiling', 'IR scan shows >10 K hot cells'],
    costMultiplier: 1.5,
  },
];

export default function AbuseClient() {
  const [id, setId] = React.useState<string>(SCENARIOS[0].id);
  const s = SCENARIOS.find((x) => x.id === id)!;
  const lifeRatio = s.expectedLifeYearsAbuse / s.expectedLifeYearsNormal;
  const lifeStatus: StatusKey = lifeRatio < 0.4 ? 'danger' : lifeRatio < 0.7 ? 'warning' : 'success';

  return (
    <div className="space-y-6">
      <Card>
        <SectionHeading
          eyebrow="Pick a scenario"
          title="What happens if you ignore the rule?"
          caption="Sample degradation curves and failure modes — calibrate against the site log before client commitment."
        />
        <div className="grid gap-2 md:grid-cols-2">
          {SCENARIOS.map((x) => {
            const on = x.id === id;
            return (
              <button
                key={x.id}
                type="button"
                onClick={() => setId(x.id)}
                className="rounded-md border px-3 py-2 text-left text-xs"
                style={{
                  borderColor: on ? 'var(--color-brand-blue)' : 'var(--color-border-subtle)',
                  background: on ? 'var(--color-brand-blue)' : 'var(--color-surface-base)',
                  color: on ? '#fff' : 'var(--color-text-primary)',
                }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">{x.asset}</div>
                <div className="mt-0.5 text-sm font-semibold tracking-tight">{x.title}</div>
                <div className="mt-1 text-[11px] opacity-90">{x.caption}</div>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <KPICard label="Expected life · normal use" value={s.expectedLifeYearsNormal} unit="yr" status="success" decimals={0} />
        <KPICard label="Expected life · abuse"      value={s.expectedLifeYearsAbuse} unit="yr" status={lifeStatus} decimals={0} />
        <KPICard label="10-year cost multiplier"    value={s.costMultiplier}         unit="×"  status={s.costMultiplier > 2 ? 'danger' : s.costMultiplier > 1.5 ? 'warning' : 'info'} decimals={1} />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Curve" title="State-of-health over 24 months" caption="Same hardware, two operating habits." />
          <SampleBadge />
        </div>
        <LockedChart
          type="line"
          title="State-of-health"
          unit="%"
          decimals={0}
          labels={Array.from({ length: 25 }, (_, m) => `M${m}`)}
          series={[
            { label: 'Normal use', data: s.curveNormal },
            { label: 'Abuse',      data: s.curveAbuse },
          ]}
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeading eyebrow="Failure mode" title="What actually breaks" />
          <p className="text-sm text-ink-secondary">{s.failureMode}</p>
        </Card>
        <Card>
          <SectionHeading eyebrow="Early warnings" title="Catch it before the failure" />
          <ul className="space-y-1 text-sm text-ink-secondary">
            {s.earlyWarnings.map((w) => (
              <li key={w} className="flex items-start gap-2">
                <span aria-hidden className="mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{ background: statusPalette('warning').solid }} />
                {w}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <ProOnly note="Pro · operating-window numbers — switch to Pro mode to view.">
        <Card>
          <SectionHeading eyebrow="Pro · windows" title="Safe operating windows" />
          <ul className="grid gap-2 md:grid-cols-2 text-xs text-ink-secondary">
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>LFP discharge floor: 10 % SOC</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>NMC discharge floor: 15 % SOC</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>AGM discharge floor: 50 % SOC</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Inverter input window: 180–260 V (KE practical)</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>Motor undervolt limit: 207 V (90 % of 230 V)</li>
            <li className="rounded border px-2 py-1" style={{ borderColor: 'var(--color-border-subtle)' }}>PV soiling re-wash threshold: 6 % yield drop</li>
          </ul>
        </Card>
      </ProOnly>

      <Card>
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          Plan to avoid abuse via{' '}
          <Link href="/hub/maintenance" className="text-ink-link">Maintenance Planner</Link>; check that early warnings get caught in{' '}
          <Link href="/hub/diagnostics" className="text-ink-link">Diagnostics</Link>; and put the operating windows into operator training in{' '}
          <Link href="/hub/learn" className="text-ink-link">Learning Mode</Link>.
        </p>
      </Card>

      <HubConnectStrip active="/hub/abuse" />
    </div>
  );
}
