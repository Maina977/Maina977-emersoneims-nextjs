/**
 * UPS arithmetic shared by the Hub's UPS Live Lab and the Solar & UPS page
 * (audit 2026-11-26), so both show the same runtime for the same battery and
 * load.
 *
 * Runtime (minutes) = battery Wh × usable depth of discharge × inverter
 * efficiency ÷ load W × 60. This is the usual first-order UPS runtime
 * estimate (energy available at the load ÷ load power); it ignores the
 * Peukert / rate effect, so real runtime at high load is shorter. The DoD
 * and efficiency are assumptions the caller states to the customer.
 */
export const UPS_RUNTIME_DOD = 0.9;

export function upsRuntimeMinutes(batteryWh: number, loadW: number, efficiency: number, dod = UPS_RUNTIME_DOD): number {
  if (!(loadW > 0)) return Infinity;
  if (!(batteryWh > 0) || !(efficiency > 0) || !(dod > 0)) return 0;
  return ((batteryWh * dod * efficiency) / loadW) * 60;
}

/**
 * Starting (surge) power of a set of loads: everything running, plus the
 * extra inrush of the single load group with the largest surge as it starts
 * (all units of that group starting together). Audit 2026-11-26: the Lab
 * took max(running total, largest group's surge), which leaves out the
 * loads already running when the motor starts.
 */
export function surgeWatts(loads: { watts: number; qty: number; startMult: number }[]): number {
  const running = loads.reduce((a, l) => a + l.watts * l.qty, 0);
  const extra = loads.reduce((m, l) => Math.max(m, l.watts * l.qty * Math.max(0, l.startMult - 1)), 0);
  return running + extra;
}
