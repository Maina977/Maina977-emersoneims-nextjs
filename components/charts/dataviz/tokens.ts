/**
 * ============================================================================
 * DATA VISUALIZATION LOCK
 * ============================================================================
 *
 * Single, locked rule set used by every chart, gauge, KPI card and status bar
 * across landing, simulator, quote audit, diagnostics, product database,
 * documentation and homepage feature blocks.
 *
 * RULES (LOCKED):
 *   1. Status logic comes from `lib/design-tokens` `status.*` ONLY.
 *      No module-private green/amber/red hexes.
 *   2. No 3D charts, no decorative infographics, no rainbow palettes.
 *      Series colors come from the categorical palette below — capped at 6.
 *   3. Charts prioritise clarity:
 *        - flat fills, no gradients, no shadows
 *        - 2D only
 *        - axis ticks / gridlines minimal, low-contrast
 *        - legend only when more than one series
 *        - tooltips / value labels MUST include units when supplied
 *   4. Every engineering value rendered in a chart, gauge or KPI card MUST
 *      include its unit (kW, V, A, Hz, %, °C, kWh, Ω, ppm, m³/h, …).
 *      The shared `formatValue()` / `formatTick()` helpers enforce this.
 *   5. Status thresholds are explicit and consistent:
 *        success → within target band
 *        info    → within informational band
 *        warning → approaching limit
 *        danger  → outside limit / fault
 *      Use `resolveStatus()` to map a value to a status key.
 * ============================================================================
 */

import { color, status, fontFamily } from '@/lib/design-tokens';

/* ─────────────────────────────────────────────────────────────────────────
 * STATUS LOGIC — single source for any value-to-status mapping
 * ───────────────────────────────────────────────────────────────────────── */

export type StatusKey = keyof typeof status; // 'success' | 'info' | 'warning' | 'danger' | 'neutral'

export interface StatusThresholds {
  /** Value below `danger` is danger. */
  danger?: number;
  /** Value below `warning` (and ≥ danger) is warning. */
  warning?: number;
  /** Value at or above `success` is success; otherwise info. */
  success?: number;
  /** Set to true when *higher* values are worse (e.g. temperature). */
  invert?: boolean;
}

/**
 * Map a numeric reading to a status key using the same rules everywhere.
 * Defaults assume "higher is better" (e.g. health %, efficiency %).
 * For "higher is worse" metrics (temp, vibration, THD) set `invert: true`.
 */
export function resolveStatus(value: number, t: StatusThresholds = {}): StatusKey {
  if (!Number.isFinite(value)) return 'neutral';
  const { danger, warning, success, invert = false } = t;

  if (invert) {
    if (danger != null && value >= danger) return 'danger';
    if (warning != null && value >= warning) return 'warning';
    if (success != null && value <= success) return 'success';
    return 'info';
  }

  if (danger != null && value <= danger) return 'danger';
  if (warning != null && value <= warning) return 'warning';
  if (success != null && value >= success) return 'success';
  return 'info';
}

/** Resolve full status palette ({ fg, bg, border, solid }) for a key. */
export function statusPalette(key: StatusKey) {
  return status[key];
}

/* ─────────────────────────────────────────────────────────────────────────
 * UNITS — every engineering value MUST be rendered with a unit
 * ───────────────────────────────────────────────────────────────────────── */

/** Canonical unit strings used across the app. Add new units here only. */
export const UNITS = {
  none: '',
  percent: '%',
  watt: 'W',
  kilowatt: 'kW',
  megawatt: 'MW',
  voltAc: 'V',
  voltDc: 'V DC',
  ampere: 'A',
  hertz: 'Hz',
  rpm: 'rpm',
  celsius: '°C',
  fahrenheit: '°F',
  hour: 'h',
  kilowattHour: 'kWh',
  litre: 'L',
  litrePerHour: 'L/h',
  cubicMetrePerHour: 'm³/h',
  metre: 'm',
  millimetre: 'mm',
  bar: 'bar',
  kilopascal: 'kPa',
  ohm: 'Ω',
  ppm: 'ppm',
  ph: 'pH',
  decibel: 'dB',
  count: '',
  currencyKes: 'KES',
  currencyUsd: 'USD',
} as const;

export type UnitKey = keyof typeof UNITS;

export interface FormatOptions {
  /** Unit symbol (e.g. 'kW'). Required for engineering values. */
  unit?: string;
  /** Decimal places, default 0 if value ≥ 100, 1 otherwise. */
  decimals?: number;
  /** Use thousands grouping. Default true. */
  group?: boolean;
  /** Render as currency-style without unit suffix (e.g. KES 12,345). */
  currency?: 'KES' | 'USD';
}

/** Format a numeric value with a unit. Used by every KPI / chart label. */
export function formatValue(value: number | null | undefined, opts: FormatOptions = {}): string {
  if (value == null || !Number.isFinite(value)) return '—';
  const { unit, decimals, group = true, currency } = opts;
  const abs = Math.abs(value);
  // Auto decimals: integer values render with 0 dp regardless of magnitude
  // (a count of `6` must render as `6`, not `6.00`). For non-integer values,
  // pick precision by magnitude. Explicit `decimals` always wins.
  const dp =
    decimals ??
    (Number.isInteger(value) ? 0 : abs >= 100 ? 0 : abs >= 10 ? 1 : 2);
  const num = group
    ? value.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })
    : value.toFixed(dp);
  if (currency) return `${currency} ${num}`;
  if (!unit) return num;
  // Tight join for °, %, ° units; spaced join for the rest.
  const tight = unit === '%' || unit === '°C' || unit === '°F' || unit === '°';
  return tight ? `${num}${unit}` : `${num} ${unit}`;
}

/** Tick formatter factory — pass to chart axes so axis labels carry units. */
export function formatTick(unit?: string, decimals?: number) {
  return (value: number | string) => {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return String(value);
    return formatValue(n, { unit, decimals });
  };
}

/* ─────────────────────────────────────────────────────────────────────────
 * COLOR PALETTE — categorical, capped, calm
 * ───────────────────────────────────────────────────────────────────────── */

/** Categorical series palette (≤ 6). Do not extend without review. */
export const SERIES_PALETTE = [
  color.brand.blue,      // primary
  color.brand.goldDeep,  // accent
  color.brand.cyan,      // secondary
  color.gray[600],       // neutral
  color.gray[400],       // muted
  color.brand.goldLight, // soft
] as const;

/** Sequential palette for ordered magnitudes (single hue ramp). */
export const SEQUENTIAL_PALETTE = [
  '#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a',
] as const;

/** Status-driven series colors (use when each series IS a status). */
export const STATUS_SERIES = {
  success: status.success.solid,
  info:    status.info.solid,
  warning: status.warning.solid,
  danger:  status.danger.solid,
  neutral: status.neutral.solid,
} as const;

/** Pick the i-th categorical color, wrapping at the cap. */
export function seriesColor(index: number): string {
  return SERIES_PALETTE[index % SERIES_PALETTE.length];
}

/* ─────────────────────────────────────────────────────────────────────────
 * CHART DEFAULTS — applied to every chart instance
 * ───────────────────────────────────────────────────────────────────────── */

export const CHART_THEME = {
  fontFamily: fontFamily.sans,
  textColor: color.text.secondary,
  mutedColor: color.text.muted,
  gridColor: color.border.subtle,
  axisColor: color.border.strong,
  tooltipBg: color.surface.inverse,
  tooltipFg: color.text.inverse,
  tooltipBorder: color.gray[600],
  /** Locked: 2D only. Decorative effects disabled. */
  shadows: false,
  gradients: false,
  threeD: false,
} as const;
