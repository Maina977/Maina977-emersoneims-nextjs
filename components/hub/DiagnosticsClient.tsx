'use client';

import * as React from 'react';
import { Card, SectionHeading, SampleBadge, HubConnectStrip } from '@/components/hub/HubShell';
import {
  KPICard,
  Gauge,
  StatusBar,
  LockedChart,
  formatValue,
  statusPalette,
  type StatusKey,
} from '@/components/charts/dataviz';

/**
 * Safety & Diagnostics Cockpit — client island.
 *
 * Live engineering values from generator / UPS / solar plant.
 * Every value rendered with units; urgency uses the shared status logic.
 */

interface FaultEvent {
  ts: string;
  code: string;
  asset: string;
  message: string;
  severity: Extract<StatusKey, 'success' | 'info' | 'warning' | 'danger'>;
}

const SAMPLE_EVENTS: FaultEvent[] = [
  { ts: '14:02', code: 'SPN 100 FMI 1', asset: 'GEN-01', message: 'Engine oil pressure low warning', severity: 'warning' },
  { ts: '13:48', code: 'SPN 110 FMI 0', asset: 'GEN-01', message: 'Coolant temperature high warning', severity: 'warning' },
  { ts: '12:15', code: 'UPS-Bypass',    asset: 'UPS-A',  message: 'On bypass — inverter overload cleared', severity: 'info' },
  { ts: '09:33', code: 'PV-Iso-Low',    asset: 'PV-S2',  message: 'String 2 isolation 0.62 MΩ', severity: 'danger' },
  { ts: '08:10', code: 'ATS-Trans-OK',  asset: 'ATS-01', message: 'Mains restored; transferred to utility', severity: 'success' },
];

interface AssetStatus {
  id: string;
  type: 'Generator' | 'UPS' | 'Solar PV' | 'ATS';
  state: StatusKey;
  detail: string;
  nextDueISO: string;            // next planned maintenance date (ISO yyyy-mm-dd)
  lastServiceISO: string;        // last completed maintenance
  serviceWindow: string;         // e.g. "500 h interval" or "6 months"
}

function daysUntil(iso: string): number {
  const target = new Date(iso + 'T00:00:00Z').getTime();
  const now = Date.now();
  return Math.round((target - now) / 86_400_000);
}

function maintenanceStatus(daysLeft: number): StatusKey {
  if (daysLeft < 0) return 'danger';
  if (daysLeft <= 7) return 'warning';
  if (daysLeft <= 30) return 'info';
  return 'success';
}

const SAMPLE_ASSETS: AssetStatus[] = [
  { id: 'GEN-01', type: 'Generator', state: 'warning', detail: 'Running · oil pressure low warning',          nextDueISO: '2026-05-10', lastServiceISO: '2026-02-08', serviceWindow: '500 h / 90 d' },
  { id: 'GEN-02', type: 'Generator', state: 'success', detail: 'Standby · ready',                              nextDueISO: '2026-07-20', lastServiceISO: '2026-01-20', serviceWindow: '500 h / 180 d' },
  { id: 'UPS-A',  type: 'UPS',       state: 'info',    detail: 'On bypass · 32 % load',                        nextDueISO: '2026-04-30', lastServiceISO: '2025-10-30', serviceWindow: '6 months' },
  { id: 'UPS-B',  type: 'UPS',       state: 'success', detail: 'Online · 41 % load · 14 min autonomy',          nextDueISO: '2026-08-15', lastServiceISO: '2026-02-15', serviceWindow: '6 months' },
  { id: 'PV-S1',  type: 'Solar PV',  state: 'success', detail: 'Generating 84 kW · isolation 12 MΩ',           nextDueISO: '2026-06-01', lastServiceISO: '2026-03-01', serviceWindow: 'Quarterly' },
  { id: 'PV-S2',  type: 'Solar PV',  state: 'danger',  detail: 'String isolation low · 0.62 MΩ',               nextDueISO: '2026-05-05', lastServiceISO: '2026-02-05', serviceWindow: 'Quarterly' },
  { id: 'ATS-01', type: 'ATS',       state: 'success', detail: 'Closed on utility',                            nextDueISO: '2026-09-01', lastServiceISO: '2026-03-01', serviceWindow: 'Annual' },
];

const HOURS = Array.from({ length: 12 }, (_, i) => `${String(8 + i).padStart(2, '0')}:00`);

const SAMPLE_TEMP   = [78, 80, 82, 84, 86, 87, 88, 90, 92, 94, 93, 91];
const SAMPLE_LOAD_KW = [110, 132, 146, 158, 162, 158, 154, 152, 156, 160, 154, 142];

export default function DiagnosticsClient() {
  const open = SAMPLE_EVENTS.filter(e => e.severity === 'warning' || e.severity === 'danger').length;

  return (
    <div className="space-y-6">
      {/* Top KPIs ─────────────────────── */}
      <div className="grid gap-3 md:grid-cols-4">
        <KPICard
          label="Open warnings"
          value={open}
          unit=""
          thresholds={{ warning: 1, danger: 3, invert: true }}
          caption="Across all monitored assets · sample"
        />
        <KPICard
          label="Generator output"
          value={158}
          unit="kW"
          thresholds={{ warning: 200, danger: 220, invert: true }}
        />
        <KPICard
          label="Coolant temperature"
          value={88}
          unit="°C"
          thresholds={{ warning: 95, danger: 105, invert: true }}
        />
        <KPICard
          label="UPS autonomy"
          value={14}
          unit="min"
          thresholds={{ danger: 5, warning: 10, success: 15 }}
        />
      </div>

      {/* Live gauges ─────────────────── */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Live" title="Engineering instruments" />
          <SampleBadge />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Gauge label="Frequency"   value={49.94} min={48} max={52} unit="Hz" decimals={2}
            thresholds={{ warning: 49,  danger: 48.5, success: 49.8 }} />
          <Gauge label="Voltage L-N" value={236}   min={200} max={260} unit="V"  decimals={0}
            thresholds={{ danger: 210, warning: 220, success: 230 }} />
          <Gauge label="Power factor" value={0.91} min={0.6} max={1.0} unit=""  decimals={2}
            thresholds={{ danger: 0.7, warning: 0.8, success: 0.9 }} />
          <Gauge label="Battery SOC" value={42}    min={0} max={100} unit="%" decimals={0}
            thresholds={{ danger: 20, warning: 40, success: 80 }} />
        </div>
      </Card>

      {/* Asset grid + chart ──────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading eyebrow="Trends" title="Generator load and temperature" caption="Last 12 h" />
            <SampleBadge />
          </div>
          <LockedChart
            type="line"
            title="GEN-01 trends"
            unit="" /* mixed units — see series labels */
            labels={HOURS}
            series={[
              { label: 'Load (kW)',        data: SAMPLE_LOAD_KW },
              { label: 'Coolant (°C)',     data: SAMPLE_TEMP, statusKey: 'warning' },
            ]}
            caption="Load in kW, coolant in °C — sample"
          />
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading eyebrow="Assets" title="State of plant" />
            <SampleBadge />
          </div>
          <ul className="space-y-2">
            {SAMPLE_ASSETS.map(a => {
              const p = statusPalette(a.state);
              const dleft = daysUntil(a.nextDueISO);
              const mk = maintenanceStatus(dleft);
              return (
                <li
                  key={a.id}
                  className="flex items-start gap-3 rounded-md border bg-surface-base p-2"
                  style={{ borderColor: 'var(--color-border-subtle)' }}
                >
                  <span aria-hidden className="mt-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.solid }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-xs">{a.id}</span>
                      <span className="text-xs text-ink-muted">{a.type}</span>
                    </div>
                    <p className="text-sm text-ink-secondary">{a.detail}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`status-chip status-chip--${mk}`}>
                        Next service {dleft < 0 ? `${Math.abs(dleft)} d overdue` : `in ${dleft} d`}
                      </span>
                      <span className="text-ink-muted">
                        Due {a.nextDueISO} · last {a.lastServiceISO} · {a.serviceWindow}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Plant levels ───────────────── */}
      <Card>
        <SectionHeading eyebrow="Levels" title="Tanks, batteries, ventilation" />
        <div className="grid gap-4 md:grid-cols-3">
          <StatusBar label="Day tank fuel" value={310} max={500} unit="L" thresholds={{ danger: 75, warning: 150, success: 250 }} />
          <StatusBar label="Bulk tank fuel" value={2_450} max={5_000} unit="L" thresholds={{ danger: 750, warning: 1_500, success: 3_000 }} />
          <StatusBar label="Battery autonomy" value={14} max={30} unit="min" thresholds={{ danger: 5, warning: 10, success: 15 }} />
          <StatusBar label="Engine room temp" value={32} max={45} unit="°C" thresholds={{ warning: 38, danger: 42, invert: true }} />
          <StatusBar label="DC bus voltage" value={538} max={600} unit="V DC" thresholds={{ danger: 480, warning: 510, success: 540 }} />
          <StatusBar label="Vent airflow" value={1_650} max={2_400} unit="m³/h" thresholds={{ danger: 800, warning: 1_200, success: 1_800 }} />
        </div>
      </Card>

      {/* Event log ─────────────────── */}
      <Card>
        <SectionHeading eyebrow="Events" title="Fault and event log" caption="Last 6 h (sample)" />
        <ol className="divide-y" style={{ borderColor: 'var(--color-border-subtle)' }}>
          {SAMPLE_EVENTS.map((e, i) => (
            <li key={i} className="flex items-start gap-3 py-2">
              <span className="w-12 shrink-0 font-mono text-xs text-ink-muted">{e.ts}</span>
              <span className={`status-chip status-chip--${e.severity} shrink-0`}>{e.severity}</span>
              <span className="font-mono text-xs text-ink-muted">{e.code}</span>
              <span className="text-xs text-ink-muted">{e.asset}</span>
              <span className="flex-1 text-sm text-ink-primary">{e.message}</span>
            </li>
          ))}
        </ol>
      </Card>

      <p className="text-xs text-ink-muted">
        Diagnostics shown are illustrative. Live integration with controller telemetry
        replaces the {formatValue(SAMPLE_EVENTS.length, { unit: 'events' })} sample feed.
      </p>

      <HubConnectStrip active="/hub/diagnostics" />
    </div>
  );
}
