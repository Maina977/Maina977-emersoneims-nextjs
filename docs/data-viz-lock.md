# Data Visualization Lock

> One status palette. One categorical palette. One typography. Units always.
> No 3D. No decorative infographics. No rainbow charts.

Every chart, gauge, KPI card, status bar, sparkline and progress indicator
across landing, simulator, quote audit, diagnostics, product database,
documentation and homepage feature blocks must use the locked primitives in
[components/charts/dataviz/](../components/charts/dataviz/).

## Public API

```ts
import {
  KPICard,
  Gauge,
  StatusBar,
  LockedChart,
  // helpers
  resolveStatus,
  statusPalette,
  formatValue,
  seriesColor,
  UNITS,
} from '@/components/charts/dataviz';
```

These primitives derive every color from `lib/design-tokens.ts`
(`color.*` and `status.*`) so they stay in lock-step with the visual
design tokens.

## Lock rules

1. **Status logic is shared.** Use `resolveStatus(value, thresholds)` for
   any value-to-status mapping (diagnostics urgency, quote-audit risk,
   simulator alarm, product-DB stock, doc callout, KPI tile). Do not
   write per-module if/else chains that produce different
   green/amber/red shades.
2. **Status colors come from `status.*` only.** No module-private
   `#22c55e`, `#16a34a`, `#facc15` etc.
3. **No 3D charts.** No `Chart.js` 3D plugins, no Three.js / WebGL
   "decorative" graphs, no perspective bar/pie effects.
4. **No decorative infographics.** No isometric illustrations as
   stand-ins for data, no circular packing for vibe, no rainbow heatmaps.
5. **No rainbow palettes.** Categorical series use `SERIES_PALETTE`
   (≤ 6 colors). For ordered magnitudes use `SEQUENTIAL_PALETTE`
   (single-hue ramp). For status-bound series use `STATUS_SERIES`.
6. **Series cap = 6.** `LockedChart` throws in dev if you exceed 6 series
   (and trims in prod). Aggregate or split.
7. **Flat fills only.** No gradients, no glow, no drop shadows on series
   marks. Subtle card shadow from the design tokens is fine.
8. **Units are mandatory** for every engineering value:
   - `KPICard`, `Gauge`, `StatusBar` all require a `unit` prop.
   - `LockedChart` requires a `unit` prop; tooltip + Y-axis ticks are
     auto-formatted with it.
   - Allowed unit symbols live in `UNITS` (kW, V, A, Hz, %, °C, kWh,
     L/h, m³/h, ppm, pH, dB, …). Add new units there only.
   - Counts may pass `unit=""`, but the label should make context obvious
     (e.g. "Open faults").
9. **Tabular numerals.** Numeric KPIs and tooltip values use
   `tabular-nums` so they don't jitter as values change.
10. **Accessibility.** Every primitive sets `role` / `aria-label` with
    the unit-included formatted value. Do not strip them.

## Status thresholds

```ts
import { resolveStatus } from '@/components/charts/dataviz';

// Higher is better (health %, efficiency, SOC, signal):
resolveStatus(load, { danger: 20, warning: 40, success: 70 });

// Higher is worse (temperature, vibration, THD, fuel consumption):
resolveStatus(temp, { warning: 75, danger: 90, invert: true });
```

The same call shape is used in **every** module — diagnostics, simulator
alarms, quote-audit risk, product-DB stock badges. There is no
"diagnostics urgency" function and a separate "quote-audit severity"
function.

## Examples

### KPI card with unit + threshold-driven color
```tsx
<KPICard
  label="Generator load"
  value={68}
  unit="%"
  thresholds={{ warning: 80, danger: 95, invert: true }}
  caption="Rated 250 kVA · last 60 s"
  delta={+1.4}
  deltaInverse
/>
```

### Status bar (battery SOC)
```tsx
<StatusBar
  label="Battery SOC"
  value={42}
  max={100}
  unit="%"
  thresholds={{ danger: 20, warning: 40, success: 80 }}
/>
```

### Gauge (output frequency)
```tsx
<Gauge
  label="Output frequency"
  value={49.94}
  min={48}
  max={52}
  unit="Hz"
  decimals={2}
  thresholds={{ warning: 49, danger: 48.5, success: 49.8 }}
/>
```

### Locked chart (load profile, kW over time)
```tsx
<LockedChart
  type="line"
  title="Load profile"
  caption="Last 24 h"
  unit="kW"
  decimals={0}
  labels={hours}
  series={[
    { label: 'Mains',     data: mainsKw },
    { label: 'Generator', data: genKw },
    { label: 'Solar',     data: pvKw },
  ]}
/>
```

### Status-keyed series (fault counts by severity)
```tsx
<LockedChart
  type="bar"
  title="Open findings"
  unit=""
  labels={['Critical', 'High', 'Medium', 'Low']}
  series={[
    { label: 'Findings', data: [counts.danger, counts.warning, counts.info, counts.success],
      statusKey: 'warning' },
  ]}
/>
```

## What you may NOT do

- ❌ Import `react-chartjs-2` or `chart.js` directly in feature modules.
  Always go through `LockedChart`.
- ❌ Build a custom SVG gauge with hard-coded `green / yellow / red`.
  Use `Gauge` — it consumes `status.*`.
- ❌ Render a numeric KPI without a unit ("Load: 68"). Always
  ("Load: 68 %").
- ❌ Add a 7th series "to show more breakdowns". Aggregate or split into
  two charts.
- ❌ Add a per-module palette ("solar greens", "borehole blues"). The
  categorical palette is shared.

## Adding a new chart type

If `LockedChart` does not cover a need (e.g. a stacked area for
production), extend `LockedChart` itself with a new `type` and add the
locked options there. Do not bypass it. Update this document with the
addition.
