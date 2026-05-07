/**
 * Data Visualization Lock — public API.
 *
 * Use these primitives for EVERY chart, gauge, KPI card and status bar in
 * the app. Do not import `react-chartjs-2`, `chart.js` or build SVG gauges
 * directly in feature modules.
 *
 * See `docs/data-viz-lock.md` for the policy.
 */

export { KPICard, type KPICardProps } from './KPICard';
export { Gauge, type GaugeProps } from './Gauge';
export { StatusBar, type StatusBarProps } from './StatusBar';
export {
  LockedChart,
  type LockedChartProps,
  type LockedSeries,
  type LockedChartType,
} from './LockedChart';

export {
  // status / formatting / palette helpers
  resolveStatus,
  statusPalette,
  formatValue,
  formatTick,
  seriesColor,
  SERIES_PALETTE,
  SEQUENTIAL_PALETTE,
  STATUS_SERIES,
  CHART_THEME,
  UNITS,
  type StatusKey,
  type StatusThresholds,
  type UnitKey,
  type FormatOptions,
} from './tokens';
