'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, SectionHeading, SampleBadge, HubConnectStrip } from '@/components/hub/HubShell';
import { KPICard, Gauge, StatusBar, LockedChart } from '@/components/charts/dataviz';
import { UpsTopologyBoard } from '@/components/hub/cockpit/UpsTopologyBoard';

/**
 * Solar + UPS section pages — combined under one route with two tabs.
 * Each tab is a fully formed mini-section using the locked dataviz primitives.
 */

type Tab = 'solar' | 'ups';

const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);

// PV generation (sample, kW)
const PV_GEN = [0,0,0,0,0,0,4,18,42,72,98,118,128,124,110,88,60,28,8,0,0,0,0,0];
// Site demand (sample, kW)
const SITE   = [82,78,75,72,70,71,84,110,132,145,158,162,160,158,154,150,148,156,168,162,142,122,104,92];

export default function SolarUpsClient() {
  const [tab, setTab] = React.useState<Tab>('solar');

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-md border" style={{ borderColor: 'var(--color-border-subtle)' }}>
        {(['solar', 'ups'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t ? 'bg-surface-sunken text-ink-primary' : 'text-ink-secondary hover:bg-surface-sunken/60'
            }`}
          >
            {t === 'solar' ? 'Solar PV' : 'UPS systems'}
          </button>
        ))}
      </div>

      {tab === 'solar' ? <SolarSection /> : <UpsSection />}

      <HubConnectStrip active="/hub/solar-ups" />
    </div>
  );
}

/* ────────── Solar PV ────────── */

function SolarSection() {
  const arrayKwp = 120;
  const dailyKwh = 540;
  const performanceRatio = 0.81;
  const co2KgPerKwh = 0.45; // Kenya grid factor (sample)

  return (
    <>
      <div className="grid gap-3 md:grid-cols-4">
        <KPICard label="Array size"        value={arrayKwp}             unit="kWp" />
        <KPICard label="Today's generation" value={dailyKwh}             unit="kWh" thresholds={{ danger: 200, warning: 350, success: 500 }} />
        <KPICard label="Performance ratio" value={performanceRatio*100} unit="%"   decimals={1} thresholds={{ danger: 65, warning: 75, success: 80 }} />
        <KPICard label="Avoided CO₂"        value={dailyKwh * co2KgPerKwh / 1000} unit="t" decimals={2} caption="Today, grid factor 0.45 kg/kWh" />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading eyebrow="Profile" title="PV vs. site demand" caption="Last 24 h" />
          <SampleBadge />
        </div>
        <LockedChart
          type="line"
          title="Generation and demand"
          unit="kW"
          decimals={0}
          labels={HOURS}
          series={[
            { label: 'PV generation', data: PV_GEN },
            { label: 'Site demand',   data: SITE },
          ]}
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <SectionHeading eyebrow="String 1" title="String health" />
          <Gauge label="Isolation" value={12} min={0} max={20} unit="MΩ" decimals={1}
            thresholds={{ danger: 1, warning: 5, success: 10 }} />
        </Card>
        <Card>
          <SectionHeading eyebrow="String 2" title="String health" />
          <Gauge label="Isolation" value={0.62} min={0} max={20} unit="MΩ" decimals={2}
            thresholds={{ danger: 1, warning: 5, success: 10 }} />
        </Card>
        <Card>
          <SectionHeading eyebrow="Inverter" title="DC bus" />
          <Gauge label="DC voltage" value={538} min={400} max={600} unit="V DC" decimals={0}
            thresholds={{ danger: 460, warning: 500, success: 530 }} />
        </Card>
      </div>

      <Card>
        <SectionHeading eyebrow="Sizing" title="Quick PV sizing reference" caption="Replace with project-specific irradiance and load." />
        <div className="grid gap-4 md:grid-cols-2">
          <StatusBar label="Roof utilisation"       value={680} max={900} unit="m²" thresholds={{ success: 600, warning: 300, danger: 100 }} />
          <StatusBar label="Inverter loading ratio" value={1.18} max={1.4} unit=""  thresholds={{ success: 1.1, warning: 1.25, danger: 1.35 }} />
          <StatusBar label="Battery autonomy"       value={6}  max={12} unit="h"   thresholds={{ danger: 2, warning: 4, success: 8 }} />
          <StatusBar label="Self-consumption"       value={72} max={100} unit="%"  thresholds={{ danger: 30, warning: 50, success: 70 }} />
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Browse models in <Link href="/hub/product-intelligence" className="text-ink-link">Product Intelligence</Link>;
          run a full sizing in <Link href="/hub/simulator" className="text-ink-link">Smart Sizing</Link>.
        </p>
      </Card>
    </>
  );
}

/* ────────── UPS ────────── */

function UpsSection() {
  const ratedKva = 10;
  const loadKva = 4.1;
  const loadPct = (loadKva / ratedKva) * 100;
  const efficiency = 95.2;

  return (
    <>
      <div className="grid gap-3 md:grid-cols-4">
        <KPICard label="UPS rating"        value={ratedKva}                 unit="kVA" />
        <KPICard label="Current load"      value={loadKva}                  unit="kVA" decimals={1} />
        <KPICard label="Load percentage"   value={loadPct}                  unit="%"   decimals={1}
          thresholds={{ warning: 70, danger: 90, invert: true }} />
        <KPICard label="Online efficiency" value={efficiency}               unit="%"   decimals={1}
          thresholds={{ danger: 88, warning: 92, success: 94 }} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <SectionHeading eyebrow="Trend" title="Load profile" caption="Last 24 h" />
            <SampleBadge />
          </div>
          <LockedChart
            type="line"
            title="UPS load"
            unit="kVA"
            decimals={1}
            labels={HOURS}
            series={[{ label: 'Load', data: SITE.map(v => +(v / 32).toFixed(2)) }]}
          />
        </Card>

        <Card>
          <SectionHeading eyebrow="Battery" title="Backup capacity" />
          <div className="space-y-4">
            <Gauge label="State of charge" value={84} min={0} max={100} unit="%" decimals={0}
              thresholds={{ danger: 20, warning: 40, success: 80 }} />
            <StatusBar label="Autonomy at current load" value={14} max={30} unit="min"
              thresholds={{ danger: 5, warning: 10, success: 15 }} />
            <StatusBar label="Battery age" value={2.8} max={5} unit="years"
              thresholds={{ warning: 3, danger: 4.5, invert: true }} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <SectionHeading
            eyebrow="Schematic"
            title="Live UPS one-line"
            caption="Dynamic SVG schematic — mains, rectifier, DC bus, battery, inverter, bypass and load update live with the values above."
          />
          <SampleBadge />
        </div>
        <UpsTopologyBoard
          state={{
            mainsPresent: true,
            upsCount: 1,
            upsCapacityKw: ratedKva * 0.9,
            loadKw: loadKva * 0.9,
            inputKw: (loadKva * 0.9) / (efficiency / 100),
            outputKw: loadKva * 0.9,
            batteryKwh: 1.4,
            runtimeMin: 14,
            overloaded: loadPct > 100,
            highLoad: loadPct > 85,
            topologyLabel: 'Online double-conversion',
          }}
        />
        <p className="mt-2 text-[11px] text-ink-muted">
          For a fully driveable schematic — add UPS units, change loads, drop the mains —
          open the <Link href="/hub/ups-lab" className="text-ink-link">UPS Live Lab</Link>.
        </p>
      </Card>

      <Card>
        <SectionHeading eyebrow="Topology" title="Choose the right UPS" />
        <div className="grid gap-3 md:grid-cols-3">
          <TopologyCard title="Standby (offline)" tag="Small loads"
            spec="Up to 1 kVA · efficiency 98 % · transfer 4–10 ms" />
          <TopologyCard title="Line-interactive" tag="SOHO / branch"
            spec="1–5 kVA · efficiency 97 % · AVR boost/buck" />
          <TopologyCard title="Double-conversion online" tag="Critical loads"
            spec="≥ 6 kVA · efficiency 92–96 % · 0 ms transfer · Class 1" />
        </div>
      </Card>

      <p className="text-xs text-ink-muted">
        UPS values are sample. Specify model and battery string in
        {' '}<Link href="/hub/product-intelligence" className="text-ink-link">Product Intelligence</Link> and
        confirm autonomy in <Link href="/hub/simulator" className="text-ink-link">Smart Sizing</Link>.
      </p>
    </>
  );
}

function TopologyCard({ title, tag, spec }: { title: string; tag: string; spec: string }) {
  return (
    <div
      className="rounded-md border bg-surface-base p-3"
      style={{ borderColor: 'var(--color-border-subtle)' }}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold">{title}</span>
        <span className="status-chip status-chip--neutral">{tag}</span>
      </div>
      <p className="mt-1 text-xs text-ink-muted">{spec}</p>
    </div>
  );
}
