/**
 * AC cable for /solar-design-studio (review 328c44aa, M4; management 2026-11-27).
 *
 * Breaker In at 1.25 × the inverter's AC current, then the smallest copper PVC cable, method
 * B1 (in conduit on a wall), whose DERATED rating carries it: Iz = Iz,tab × Ca × Cg ≥ In, and
 * the design current ≤ In (IEC 60364-4-43). It used the 30 °C table with no correction.
 *
 * Iz,tab: IEC 60364-5-52 method B1, Table B.52.2 (two loaded conductors, single phase) and
 * Table B.52.4 (three loaded conductors, three phase) = BS 7671 Table 4D1A cols 4 and 5 (the
 * values the studio already used). Ca (Table B.52.14) and Cg (Table B.52.17) are lib's tables
 * via lib/solar/cableCorrections. Ambient not entered: assumed 40 °C; grouping: one circuit.
 */
import { resolveConditions, cableBasisText, type CableConditions } from '@/lib/solar/cableCorrections';
import { sizeConductor, conductorBasis, BREAKERS_A } from '@/components/solar-modules/crc/core/calculator/SolarCalculatorEngine';

export interface BatteryCableChoice {
  /** Design current I_B: inverter kW at 48 V and 90 % efficiency. */
  designA: number;
  breakerA?: number;
  csaMm2?: number;
  izTabA?: number;
  izA?: number;
  basis: string;
}

/**
 * 48 V battery cable for /solar-design-studio (review of 1bf9dad6, M4): sized exactly as the
 * engine's battery cable on /solar-genius-pro. Breaker In = the next standard rating at or above
 * 1.25 × I_B; then the smallest copper PVC cable (method C table) with Iz,tab × Ca × Cg ≥ In
 * within a 1 % drop over 3 m, at the studio's ambient (assumed 40 °C when not entered) and
 * grouping (one circuit when not given). It used a fixed 30 °C table with no breaker.
 */
export function sizeBatteryCable(inverterKw: number, conditions: CableConditions = {}): BatteryCableChoice {
  const designA = (inverterKw * 1000) / (48 * 0.9);
  const breakerA = BREAKERS_A.find((b) => b >= designA * 1.25);
  const c = breakerA !== undefined ? sizeConductor(breakerA, 3, 48, 1, conditions) : null;
  return { designA, breakerA, csaMm2: c?.mm2, izTabA: c?.izTabA, izA: c?.izA, basis: conductorBasis(c, breakerA ?? designA * 1.25, conditions) };
}

export const STD_MCB = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160];
export const CABLE_B1_TWO_LOADED: [number, number][] = [[4, 32], [6, 41], [10, 57], [16, 76], [25, 101], [35, 125], [50, 151], [70, 192], [95, 232]];
export const CABLE_B1_THREE_LOADED: [number, number][] = [[4, 28], [6, 36], [10, 50], [16, 68], [25, 89], [35, 110], [50, 134], [70, 171], [95, 207]];

export interface AcCableChoice {
  acAmps: number;
  breakerA?: number;
  csaMm2?: number;
  izTabA?: number;
  izA?: number;
  basis: string;
}

export function sizeAcCable(inverterKw: number, conditions: CableConditions = {}): AcCableChoice {
  const threePhase = inverterKw > 10;
  const acAmps = threePhase ? (inverterKw * 1000) / (Math.sqrt(3) * 400) : (inverterKw * 1000) / 230;
  const breakerA = STD_MCB.find((s) => s >= acAmps * 1.25);
  const cond = resolveConditions(conditions);
  const table = threePhase ? CABLE_B1_THREE_LOADED : CABLE_B1_TWO_LOADED;
  const method = `B1 (in conduit), ${threePhase ? 'three' : 'two'} loaded conductors`;
  const row = breakerA !== undefined && cond.ca !== undefined && cond.cg !== undefined
    ? table.find(([, iz]) => iz * cond.ca! * cond.cg! >= breakerA)
    : undefined;
  const izA = row ? row[1] * cond.ca! * cond.cg! : undefined;
  const basis = cableBasisText({ method, cond, izTabA: row?.[1], izA, inA: breakerA ?? Math.round(acAmps * 1.25 * 10) / 10, mm2: row?.[0] });
  return { acAmps, breakerA, csaMm2: row?.[0], izTabA: row?.[1], izA, basis };
}
