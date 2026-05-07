'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip, ProOnly, useHubAudience } from '@/components/hub/HubShell';
import { KPICard, StatusBar, formatValue, statusPalette, type StatusKey } from '@/components/charts/dataviz';

/**
 * Installation Visualizer — single-line diagram + cabling/breaker chain
 * + panel layout + earthing + SPD coordination, switchable across three
 * common architectures (residential, SME, small data-centre).
 */

type Arch = 'residential' | 'sme' | 'datacentre';

interface Stage {
  id: string;
  label: string;
  rating: string;
  note: string;
  critical: boolean;
}

interface Architecture {
  id: Arch;
  label: string;
  caption: string;
  totalKw: number;
  stages: Stage[];
  earthingOhms: number;
  spd: 'Type 1+2' | 'Type 2' | 'Type 2+3';
  cable: string;
  ventilationCfm: number;
}

const ARCHS: Architecture[] = [
  {
    id: 'residential',
    label: 'Residential 5 kVA hybrid',
    caption: 'Single-phase 230 V, hybrid inverter, lithium battery, 3 kWp PV.',
    totalKw: 4.0,
    stages: [
      { id: 'utility',  label: 'Utility supply',          rating: '230 V · 32 A',  note: 'KPLC service drop',                       critical: true  },
      { id: 'meter',    label: 'kWh meter + main isolator',rating: '63 A',          note: 'Sealed by utility',                       critical: true  },
      { id: 'spd1',     label: 'SPD Type 2',              rating: '20 kA · 1.5 kV', note: 'Mounted in main DB',                      critical: true  },
      { id: 'changeover', label: 'Manual changeover',     rating: '63 A',          note: 'Bypass for inverter service',             critical: false },
      { id: 'inverter', label: 'Hybrid inverter',         rating: '5 kVA · 48 V',  note: 'Voltronic / Deye class',                  critical: true  },
      { id: 'battery',  label: 'Lithium battery',         rating: '5.12 kWh · BMS', note: 'Pylontech / equivalent',                  critical: true  },
      { id: 'pv',       label: 'PV array',                rating: '3.0 kWp',       note: '6 × 500 W modules, 1 string',             critical: false },
      { id: 'subdb',    label: 'Backed-up sub-DB',        rating: '40 A',          note: 'Lighting + sockets + fridge',             critical: true  },
    ],
    earthingOhms: 5,
    spd: 'Type 2',
    cable: '10 mm² Cu battery, 4 mm² Cu PV string, 6 mm² Cu sub-DB feed',
    ventilationCfm: 80,
  },
  {
    id: 'sme',
    label: 'SME 25 kVA hybrid + genset',
    caption: 'Three-phase 400 V, hybrid inverter bank, lithium, 15 kWp PV, standby genset.',
    totalKw: 20,
    stages: [
      { id: 'utility',   label: 'Utility supply',          rating: '400 V · 100 A', note: 'Three-phase TN-S',                        critical: true  },
      { id: 'spd1',      label: 'SPD Type 1+2',            rating: '50 kA · 2.5 kV', note: 'Service entrance',                       critical: true  },
      { id: 'ats',       label: 'ATS (genset transfer)',   rating: '125 A',         note: '4-pole, programmed transition',           critical: true  },
      { id: 'genset',    label: 'Standby genset',          rating: '40 kVA',        note: 'Block heater + AVR + AMF',                critical: true  },
      { id: 'inverter',  label: 'Inverter bank',           rating: '3 × 8 kVA',     note: 'Parallel, common neutral',                critical: true  },
      { id: 'battery',   label: 'Lithium rack',            rating: '20 kWh · BMS',  note: '48 V LFP, 80 % DoD',                      critical: true  },
      { id: 'pv',        label: 'PV array',                rating: '15 kWp',        note: '2 strings × 14 panels',                   critical: false },
      { id: 'critdb',    label: 'Critical DB',             rating: '63 A',          note: 'Servers, cold-room, security',            critical: true  },
      { id: 'noncritdb', label: 'Non-critical DB',         rating: '63 A',          note: 'AC, kettle, lifts',                       critical: false },
    ],
    earthingOhms: 2,
    spd: 'Type 1+2',
    cable: '50 mm² Al utility, 25 mm² Cu battery, 16 mm² Cu PV trunks',
    ventilationCfm: 350,
  },
  {
    id: 'datacentre',
    label: 'Small data-centre 100 kVA 2N',
    caption: 'Three-phase 400 V, 2N UPS, lithium, dual genset, no PV.',
    totalKw: 60,
    stages: [
      { id: 'utility',  label: 'Utility A + B feeds',      rating: '2 × 250 A',     note: 'Diverse routes',                          critical: true  },
      { id: 'spd1',     label: 'SPD Type 1+2 (per feed)',  rating: '100 kA',         note: 'Service entrance',                       critical: true  },
      { id: 'ats',      label: 'ATS A / ATS B',            rating: '2 × 400 A',     note: 'Closed-transition',                       critical: true  },
      { id: 'genset',   label: '2 × standby genset',       rating: '2 × 150 kVA',   note: 'Synchronisable, 24 h tank',               critical: true  },
      { id: 'ups',      label: '2N UPS train',             rating: '2 × 100 kVA',   note: 'Online double-conversion',                critical: true  },
      { id: 'battery',  label: 'Lithium UPS battery',      rating: '15 min @ 60 %', note: 'Per side',                                critical: true  },
      { id: 'pdu',      label: 'PDUs A + B',               rating: '2 × 32 A',      note: 'Per-rack metering',                       critical: true  },
      { id: 'cooling',  label: 'Precision cooling',        rating: '2 × 30 kW',     note: 'On UPS A only',                           critical: true  },
    ],
    earthingOhms: 1,
    spd: 'Type 1+2',
    cable: '185 mm² Cu utility, 95 mm² Cu UPS bus, 35 mm² Cu PDU',
    ventilationCfm: 1200,
  },
];

export default function InstallationClient() {
  const { audience } = useHubAudience();
  const [archId, setArchId] = React.useState<Arch>('residential');
  const arch = ARCHS.find((a) => a.id === archId)!;

  const earthStatus: StatusKey = arch.earthingOhms <= 2 ? 'success' : arch.earthingOhms <= 5 ? 'warning' : 'danger';
  const ventStatus: StatusKey  = arch.ventilationCfm >= 100 ? 'success' : 'warning';

  return (
    <div className="space-y-6">
      {/* Architecture switcher */}
      <Card>
        <SectionHeading
          eyebrow="Step 1"
          title="Pick the architecture"
          caption="Three reference architectures common in Kenya. Each drives the diagram, breaker chain and earthing block below."
        />
        <div className="flex flex-wrap gap-2">
          {ARCHS.map((a) => {
            const on = a.id === archId;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setArchId(a.id)}
                className="rounded-md border px-3 py-2 text-left text-xs"
                style={{
                  borderColor: on ? 'var(--color-brand-blue)' : 'var(--color-border-subtle)',
                  background: on ? 'var(--color-brand-blue)' : 'var(--color-surface-base)',
                  color: on ? '#fff' : 'var(--color-text-primary)',
                  minWidth: 220,
                }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">{a.id}</div>
                <div className="mt-0.5 text-sm font-semibold tracking-tight">{a.label}</div>
                <div className="mt-1 text-[11px] opacity-90">{a.caption}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* SLD strip */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Single-line diagram" title={arch.label} caption={arch.caption} />
          <SampleBadge />
        </div>

        <div className="overflow-x-auto">
          <ol className="flex min-w-max items-stretch gap-2">
            {arch.stages.map((s, i) => (
              <React.Fragment key={s.id}>
                <li
                  className="flex w-44 flex-col rounded-lg border bg-surface-base p-3 shadow-sm"
                  style={{
                    borderColor: s.critical ? 'var(--color-brand-blue)' : 'var(--color-border-subtle)',
                  }}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                    Stage {i + 1}{s.critical ? ' · critical' : ''}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold tracking-tight">{s.label}</div>
                  <div className="mt-1 font-mono text-xs text-ink-secondary">{s.rating}</div>
                  <div className="mt-auto pt-1 text-[11px] text-ink-muted">{s.note}</div>
                </li>
                {i < arch.stages.length - 1 && (
                  <div aria-hidden className="flex items-center text-ink-muted">→</div>
                )}
              </React.Fragment>
            ))}
          </ol>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Earthing */}
        <Card>
          <SectionHeading eyebrow="Earthing" title="Electrode resistance" />
          <KPICard
            label="Measured (sample)"
            value={arch.earthingOhms}
            unit="Ω"
            status={earthStatus}
            decimals={1}
          />
          <p className="mt-3 text-xs text-ink-secondary">
            Targets: domestic ≤ 5 Ω, commercial ≤ 2 Ω, data-centre ≤ 1 Ω. Test with a fall-of-potential meter at commissioning and annually thereafter.
          </p>
        </Card>

        {/* SPD */}
        <Card>
          <SectionHeading eyebrow="Surge protection" title="SPD class" />
          <div className="rounded-lg border bg-surface-base p-3 text-center"
               style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Required</div>
            <div className="mt-1 text-2xl font-bold">{arch.spd}</div>
          </div>
          <p className="mt-3 text-xs text-ink-secondary">
            Type 1 for direct-strike risk (overhead lines, exposed sites). Type 2 inside the main DB. Type 3 at sensitive equipment if cable run &gt; 10 m from the Type 2.
          </p>
        </Card>

        {/* Ventilation */}
        <Card>
          <SectionHeading eyebrow="Battery room" title="Ventilation" />
          <KPICard
            label="Air-flow target"
            value={arch.ventilationCfm}
            unit="CFM"
            status={ventStatus}
            decimals={0}
          />
          <p className="mt-3 text-xs text-ink-secondary">
            Lithium needs gentle ventilation (heat-removal). Lead-acid needs hydrogen-vent louvres at the top of the room — never below the battery.
          </p>
        </Card>
      </div>

      <Card>
        <SectionHeading eyebrow="Cable schedule" title="Minimum copper sizing" caption="Verify ampacity in BS 7671 Table 4D1A or the manufacturer derate tables." />
        <p className="font-mono text-sm text-ink-secondary">{arch.cable}</p>
      </Card>

      <ProOnly note="Engineering breakdown (load split, headroom, breaker coordination) — switch to Pro mode to view.">
        <Card>
          <SectionHeading eyebrow="Pro · breakdown" title="Load split & headroom" />
          <div className="space-y-3">
            <StatusBar
              label="Total connected vs. site capacity"
              value={arch.totalKw}
              max={arch.totalKw * 1.4}
              unit="kW"
              thresholds={{ danger: arch.totalKw * 0.5, warning: arch.totalKw * 0.8, success: arch.totalKw * 1.1 }}
            />
            <StatusBar
              label="Critical-load coverage"
              value={arch.stages.filter(s => s.critical).length}
              max={arch.stages.length}
              unit="stages"
              thresholds={{ danger: 1, warning: 3, success: 5 }}
            />
          </div>
        </Card>
      </ProOnly>

      <Card>
        <SectionHeading eyebrow="Use this with" title="Connected workflow" />
        <p className="text-sm text-ink-secondary">
          {audience === 'client' ? 'Show this diagram to your installer before signing the quote.' : 'Pair the SLD with'}{' '}
          <Link href="/hub/quote-audit" className="text-ink-link">Quotation Audit</Link>,{' '}
          <Link href="/hub/verifier" className="text-ink-link">Combination Verifier</Link>{' '}and{' '}
          <Link href="/hub/safety" className="text-ink-link">Safety &amp; Fire</Link> to confirm the proposal includes every stage shown above.
        </p>
      </Card>

      <HubConnectStrip active="/hub/installation" />
    </div>
  );
}
