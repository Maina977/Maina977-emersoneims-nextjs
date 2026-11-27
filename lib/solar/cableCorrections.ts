/**
 * Cable rating correction factors for the browser cable sizers (review 328c44aa, M4).
 *
 * These are lib/solar-genius/server/engineering-approval.js `cableAmpacityDerated`'s own tables
 * and look-up rules, copied unchanged (that module also loads node's crypto, so a browser
 * component cannot import it). tests/regression/solar-cable-sizers-derated-2026-11-27.test.ts
 * proves every factor here equals what that function applies. No factor is new.
 *
 *  - Ca, ambient AIR temperature, PVC 70 °C insulation: IEC 60364-5-52 Table B.52.14.
 *    The next tabulated temperature AT OR ABOVE the site's; above 60 °C PVC has no rating.
 *  - Cg, grouping in air: IEC 60364-5-52 Table B.52.17. The next tabulated count AT OR
 *    ABOVE the number of circuits; above 20 circuits the table gives no factor.
 */

/** IEC 60364-5-52 Table B.52.14, PVC, air (as lib's `ambientPvc`). */
export const AMBIENT_AIR_PVC: Record<number, number> = { 10: 1.22, 15: 1.17, 20: 1.12, 25: 1.06, 30: 1.0, 35: 0.94, 40: 0.87, 45: 0.79, 50: 0.71, 55: 0.61, 60: 0.5 };
/** IEC 60364-5-52 Table B.52.17, grouping in air (as lib's `groupingAir`). */
export const GROUPING_AIR: Record<number, number> = { 1: 1.0, 2: 0.8, 3: 0.7, 4: 0.65, 5: 0.6, 6: 0.57, 7: 0.54, 8: 0.52, 9: 0.5, 12: 0.45, 16: 0.41, 20: 0.38 };

/** The design ambient used when the site value is not entered (management, 2026-11-27). */
export const ASSUMED_DESIGN_AMBIENT_C = 40;

const atOrAbove = (table: Record<number, number>, x: number): number | undefined => {
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  const k = keys.find((t) => t >= x);
  return k === undefined ? undefined : table[Math.max(keys[0], k)];
};

/** Ca for PVC in air at `ambientC`, or undefined above 60 °C (no usable rating). */
export const ambientFactorPvcAir = (ambientC: number): number | undefined => atOrAbove(AMBIENT_AIR_PVC, ambientC);
/** Cg for `circuits` grouped in air, or undefined above 20 circuits. */
export const groupingFactorAir = (circuits: number): number | undefined => atOrAbove(GROUPING_AIR, Math.max(1, circuits));

export interface CableConditions {
  /** Site design ambient air temperature, °C. Not entered: ASSUMED_DESIGN_AMBIENT_C. */
  ambientC?: number;
  /** Circuits grouped together. Not entered: one circuit. */
  circuits?: number;
}
export interface ResolvedConditions { ambientC: number; ambientAssumed: boolean; circuits: number; circuitsAssumed: boolean; ca?: number; cg?: number }

export function resolveConditions(c: CableConditions = {}): ResolvedConditions {
  const ambientAssumed = !(typeof c.ambientC === 'number' && Number.isFinite(c.ambientC));
  const ambientC = ambientAssumed ? ASSUMED_DESIGN_AMBIENT_C : (c.ambientC as number);
  const circuitsAssumed = !(typeof c.circuits === 'number' && Number.isInteger(c.circuits) && c.circuits >= 1);
  const circuits = circuitsAssumed ? 1 : (c.circuits as number);
  return { ambientC, ambientAssumed, circuits, circuitsAssumed, ca: ambientFactorPvcAir(ambientC), cg: groupingFactorAir(circuits) };
}

/** One line stating the sizing basis, shown next to every cable size. */
export function cableBasisText(o: { method: string; cond: ResolvedConditions; izTabA?: number; izA?: number; inA: number; mm2?: number }): string {
  const { cond } = o;
  const amb = cond.ambientAssumed ? `assumed design ambient ${cond.ambientC} °C — enter the site value` : `site ambient ${cond.ambientC} °C`;
  const grp = cond.circuitsAssumed ? 'one circuit assumed' : `${cond.circuits} circuits grouped`;
  const r2 = (x: number) => Math.round(x * 100) / 100;
  const head = `Copper PVC, installation method ${o.method}; ${amb}; ${grp}`;
  if (cond.ca === undefined) return `${head}: PVC cable has no rating above 60 °C. A qualified electrician sizes this cable.`;
  if (cond.cg === undefined) return `${head}: Table B.52.17 lists up to 20 circuits. A qualified electrician sizes this cable.`;
  const factors = `Ca ${cond.ca.toFixed(2)} (Table B.52.14), Cg ${cond.cg.toFixed(2)} (Table B.52.17)`;
  if (o.mm2 === undefined || o.izTabA === undefined || o.izA === undefined) return `${head}; ${factors}: no single cable in the table carries In ${o.inA} A. A qualified electrician sizes this cable.`;
  return `${head}; ${factors}; Iz = ${o.izTabA} × ${cond.ca.toFixed(2)} × ${cond.cg.toFixed(2)} = ${r2(o.izA)} A ≥ In ${o.inA} A. Not corrected for burial or thermal insulation. A qualified electrician confirms the cable size.`;
}
