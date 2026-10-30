/**
 * Monthly irradiation on a tilted, oriented panel from the monthly average
 * daily horizontal irradiation (NASA POWER ALLSKY_SFC_SW_DWN).
 *
 * Method (standard; Duffie & Beckman, Solar Engineering of Thermal
 * Processes, 4th ed.):
 *   1. Each month is represented by its mean day (Klein 1977, Table 1.6.1).
 *   2. The daily total H is spread over the hours in proportion to the
 *      extraterrestrial irradiance on a horizontal surface.
 *   3. Diffuse share: Erbs et al. (1982) monthly correlation on the clearness
 *      index K̄T = H / H0 (ωs ≤ 81.4°), spread hourly the same way.
 *   4. Plane of array: beam × cos θ / cos θz, isotropic sky diffuse
 *      (Liu & Jordan) × (1 + cos β)/2, ground reflection with albedo 0.2.
 * Azimuth is measured clockwise from north (0 = N, 90 = E, 180 = S, 270 = W).
 * The isotropic model slightly understates tilted gains in clear climates; it
 * is a planning estimate, not a measured or simulated hourly yield.
 */
const DEG = Math.PI / 180;
const GSC = 1367; // W/m², solar constant
const MEAN_DAY = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];

export interface PoaResult {
  /** kWh/m²/day on the panel plane, per month. */
  monthly: number[];
  /** Year mean, kWh/m²/day. */
  annual: number;
  /** Plane-of-array ÷ horizontal (annual). */
  gainVsHorizontal: number;
}

export function poaMonthly(latDeg: number, tiltDeg: number, azimuthDeg: number, ghiMonthly: number[], albedo = 0.2): PoaResult {
  if (!(Math.abs(latDeg) <= 66)) throw new Error('Latitude must be within ±66°');
  if (!(tiltDeg >= 0 && tiltDeg <= 90)) throw new Error('Tilt must be between 0 and 90°');
  if (!(azimuthDeg >= 0 && azimuthDeg <= 360)) throw new Error('Azimuth must be between 0 and 360° (0 = north, 180 = south)');
  if (ghiMonthly.length !== 12 || ghiMonthly.some((v) => !(v > 0 && v < 12))) throw new Error('Need 12 monthly irradiation values in kWh/m²/day');
  const phi = latDeg * DEG, beta = tiltDeg * DEG;
  // Surface azimuth γ in the Duffie-Beckman convention (0 = south, east negative).
  const gamma = (((azimuthDeg - 180) + 540) % 360 - 180) * DEG;
  const monthly = ghiMonthly.map((H, m) => {
    const n = MEAN_DAY[m];
    const delta = 23.45 * Math.sin((360 * (284 + n) / 365) * DEG) * DEG;
    const ecc = 1 + 0.033 * Math.cos((360 * n / 365) * DEG);
    const ws = Math.acos(Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(delta))));
    // Daily extraterrestrial on a horizontal surface, kWh/m²/day.
    const H0 = (24 / Math.PI) * GSC * ecc * (Math.cos(phi) * Math.cos(delta) * Math.sin(ws) + ws * Math.sin(phi) * Math.sin(delta)) / 1000;
    const KT = Math.min(0.8, Math.max(0.3, H / H0));
    const fd = ws <= 81.4 * DEG
      ? 1.391 - 3.560 * KT + 4.189 * KT * KT - 2.137 * KT ** 3
      : 1.311 - 3.022 * KT + 3.427 * KT * KT - 1.821 * KT ** 3;
    const Hd = H * Math.min(1, Math.max(0, fd));
    // Hour-by-hour (10-minute steps) over the day.
    let sumG0 = 0, sumBeamTilt = 0;
    const steps: { cz: number; ct: number }[] = [];
    for (let w = -ws + (2.5 * DEG); w < ws; w += 2.5 * DEG) {
      const cz = Math.cos(phi) * Math.cos(delta) * Math.cos(w) + Math.sin(phi) * Math.sin(delta);
      if (cz <= 0.01) continue;
      const ct = Math.sin(delta) * Math.sin(phi) * Math.cos(beta)
        - Math.sin(delta) * Math.cos(phi) * Math.sin(beta) * Math.cos(gamma)
        + Math.cos(delta) * Math.cos(phi) * Math.cos(beta) * Math.cos(w)
        + Math.cos(delta) * Math.sin(phi) * Math.sin(beta) * Math.cos(gamma) * Math.cos(w)
        + Math.cos(delta) * Math.sin(beta) * Math.sin(gamma) * Math.sin(w);
      steps.push({ cz, ct });
      sumG0 += cz;
    }
    const Hb = H - Hd;
    for (const s of steps) {
      // Beam on the horizontal for this step, then onto the panel (no beam
      // from behind the panel; Rb capped for very low sun).
      const bHoriz = Hb * (s.cz / sumG0);
      const rb = Math.max(0, s.ct) / Math.max(s.cz, 0.087);
      sumBeamTilt += bHoriz * rb;
    }
    return sumBeamTilt + Hd * (1 + Math.cos(beta)) / 2 + H * albedo * (1 - Math.cos(beta)) / 2;
  });
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const annual = monthly.reduce((s, v, i) => s + v * days[i], 0) / 365;
  const annualH = ghiMonthly.reduce((s, v, i) => s + v * days[i], 0) / 365;
  const r2 = (x: number) => Math.round(x * 100) / 100;
  return { monthly: monthly.map(r2), annual: r2(annual), gainVsHorizontal: Math.round((annual / annualH) * 1000) / 1000 };
}
