/**
 * ONE display accessor for the site depth and yield (re-review of f89698e8, BLOCKING 2, 2026-11-25).
 *
 * The page and the exports read the site's drilling depth and yield ONLY through these functions.
 * Without the field evidence evidenceGate() requires (a geophysical survey for depth; a pumping
 * test for yield), they return the gate text instead of a number. That includes everything derived
 * from them: the casing and screen intervals, the drilling duration, the pump head and power, the
 * solar array and the depth ranges. Before, several consumers read result.recommendedDepth
 * directly (Drilling plan "casing 0–52 m, screen 52–72 m"; Data sources "Range 54–79 m"; Solar pump
 * "44 m head", "36 m (half the planned depth)"; Subsurface "0–72 m").
 */
import { evidenceGate, DEPTH_NEEDS, YIELD_NEEDS } from './evidenceGate';

export type Shown = { shown: true; value: number; range: [number, number] | null } | { shown: false; text: string };

export function displayDepth(result: any): Shown {
  const g = evidenceGate(result);
  const v = Number(result?.recommendedDepth);
  if (!g.depth || !(v > 0)) return { shown: false, text: DEPTH_NEEDS };
  const r = result?.uncertainty?.depthRange;
  return { shown: true, value: Math.round(v), range: Array.isArray(r) && r.length === 2 ? [Number(r[0]), Number(r[1])] : null };
}

export function displayYield(result: any): Shown {
  const g = evidenceGate(result);
  const v = Number(result?.estimatedYield);
  if (!g.yield || !(v >= 0)) return { shown: false, text: YIELD_NEEDS };
  const r = result?.uncertainty?.yieldRange;
  return { shown: true, value: v, range: Array.isArray(r) && r.length === 2 ? [Number(r[0]), Number(r[1])] : null };
}

/** "72 m" or the gate text. */
export function depthText(result: any, fmt: (m: number) => string = (m) => `${m} m`): string {
  const d = displayDepth(result);
  return d.shown ? fmt(d.value) : d.text;
}
/** "2.0 m³/h" or the gate text. */
export function yieldText(result: any, fmt: (q: number) => string = (q) => `${q.toFixed(1)} m³/h`): string {
  const y = displayYield(result);
  return y.shown ? fmt(y.value) : y.text;
}

/** Depth-derived design (casing, screen, duration) is shown only with a surveyed depth. */
export const PLAN_NEEDS = 'Set after the geophysical survey (target depth) and the drilling log (screen interval)';
/** Pump and solar sizing need both the tested yield and the measured water level. */
export const PUMP_NEEDS = 'Sized after the pumping test: the pump, its head and the solar array follow from the tested yield and the measured water level';
export function pumpSizingAllowed(result: any): boolean {
  return displayDepth(result).shown && displayYield(result).shown;
}
