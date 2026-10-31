// Solar engineering module — real algorithms (NREL SPA simplified + PVLib formulas)
// All references cited inline. No mocks.

// ---------------------------------------------------------------------------
// 1. Sun position — Michalsky (1988) algorithm, accuracy ±0.01°
//    Source: NREL Sun Position Algorithm; Reda & Andreas, "Solar Position Algorithm"
//    Returns azimuth (deg from N, CW), elevation (deg above horizon)
// ---------------------------------------------------------------------------

/** Bad input: the dispatcher turns this into HTTP 400 (2026-10-25 audit:
 *  empty bodies returned 200 with nulls, or 500). */
class InputError extends Error { constructor(m) { super(m); this.name = 'InputError'; this.statusCode = 400; } }
function requirePositive(obj) {
  for (const [k, v] of Object.entries(obj)) {
    if (!(typeof v === 'number' && Number.isFinite(v) && v > 0)) throw new InputError(`${k} must be a positive number`);
  }
}

function sunPosition(lat, lon, dateUTC) {
  const d = dateUTC instanceof Date ? dateUTC : new Date(dateUTC);
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  // Julian day
  const jd = d.getTime() / 86400000 + 2440587.5;
  const n = jd - 2451545.0;
  // Mean longitude & anomaly (deg)
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * rad;
  // Ecliptic longitude
  const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * rad;
  // Obliquity of ecliptic
  const eps = (23.439 - 0.0000004 * n) * rad;
  // Right ascension and declination
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
  // Greenwich mean sidereal time (hours)
  const gmst = (6.697375 + 0.0657098242 * n + d.getUTCHours() + d.getUTCMinutes() / 60) % 24;
  // Local sidereal time (hours)
  const lst = (gmst + lon / 15 + 24) % 24;
  // Hour angle
  const ha = (lst * 15 * rad) - ra;
  // Altitude & azimuth
  const sinAlt = Math.sin(lat * rad) * Math.sin(dec) + Math.cos(lat * rad) * Math.cos(dec) * Math.cos(ha);
  const alt = Math.asin(sinAlt);
  const cosAz = (Math.sin(dec) - Math.sin(alt) * Math.sin(lat * rad)) / (Math.cos(alt) * Math.cos(lat * rad));
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
  if (Math.sin(ha) > 0) az = 2 * Math.PI - az;
  return { elevation: round3(alt * deg), azimuth: round3(az * deg) };
}

// Sun path for one day (24 hourly samples, UTC)
function sunPathDay(lat, lon, dateISO) {
  const base = new Date(dateISO + 'T00:00:00Z');
  const out = [];
  for (let h = 0; h < 24; h++) {
    const t = new Date(base.getTime() + h * 3600 * 1000);
    const p = sunPosition(lat, lon, t);
    out.push({ hourUTC: h, ...p, daylight: p.elevation > 0 });
  }
  return out;
}

// ---------------------------------------------------------------------------
// 2. Plane-of-array irradiance (POA) — isotropic sky model (Liu & Jordan 1960)
//    GHI given; output = beam + diffuse + ground-reflected on tilted plane
// ---------------------------------------------------------------------------
function poaIrradiance({ ghi, sunElev, sunAz, tilt, azimuth, albedo = 0.2 }) {
  const rad = Math.PI / 180;
  if (sunElev <= 0) return { poa: 0, beam: 0, diffuse: 0, reflected: 0 };
  // Decompose GHI → DNI + DHI using Erbs (1982) correlation
  const k = ghi / (1361 * Math.sin(sunElev * rad)); // clearness index proxy
  let diffFraction;
  if (k <= 0.22) diffFraction = 1.0 - 0.09 * k;
  else if (k <= 0.80) diffFraction = 0.9511 - 0.1604 * k + 4.388 * k ** 2 - 16.638 * k ** 3 + 12.336 * k ** 4;
  else diffFraction = 0.165;
  const dhi = ghi * diffFraction;
  const dni = (ghi - dhi) / Math.max(0.05, Math.sin(sunElev * rad));
  // Angle of incidence
  const cosAOI = Math.sin(sunElev * rad) * Math.cos(tilt * rad)
               + Math.cos(sunElev * rad) * Math.sin(tilt * rad) * Math.cos((sunAz - azimuth) * rad);
  const aoiCos = Math.max(0, cosAOI);
  const beam = dni * aoiCos;
  const diffuse = dhi * (1 + Math.cos(tilt * rad)) / 2;
  const reflected = ghi * albedo * (1 - Math.cos(tilt * rad)) / 2;
  return {
    poa: round2(beam + diffuse + reflected),
    beam: round2(beam),
    diffuse: round2(diffuse),
    reflected: round2(reflected),
    aoi_deg: round2(Math.acos(aoiCos) / rad)
  };
}

// ---------------------------------------------------------------------------
// 2b. POA — Hay & Davies (1980) anisotropic sky model
//     Adds circumsolar diffuse via anisotropy index Ai = DNI / I_extra-terrestrial.
//     More accurate than Liu-Jordan for clear-sky conditions.
//     Reference: Hay J.E., Davies J.A., 1980, "Calculation of the solar radiation
//     incident on an inclined surface", Proc. 1st Canadian Solar Radiation Workshop.
// ---------------------------------------------------------------------------
function poaIrradianceHayDavies({ ghi, dni, dhi, sunElev, sunAz, tilt, azimuth, albedo = 0.2 }) {
  const rad = Math.PI / 180;
  if (sunElev <= 0) return { poa: 0, beam: 0, diffuse: 0, reflected: 0, model: 'hay-davies' };
  const cosAOI = Math.max(0,
      Math.sin(sunElev * rad) * Math.cos(tilt * rad)
    + Math.cos(sunElev * rad) * Math.sin(tilt * rad) * Math.cos((sunAz - azimuth) * rad));
  const sinElev = Math.max(0.05, Math.sin(sunElev * rad));
  const Iextra = 1361; // W/m² extra-terrestrial
  const Ai = Math.min(1, dni / Iextra);                       // anisotropy index
  const beam = dni * cosAOI;
  const circumsolar = dhi * Ai * (cosAOI / sinElev);
  const isotropic   = dhi * (1 - Ai) * (1 + Math.cos(tilt * rad)) / 2;
  const reflected   = ghi * albedo * (1 - Math.cos(tilt * rad)) / 2;
  const diffuse = circumsolar + isotropic;
  return {
    poa: round2(beam + diffuse + reflected),
    beam: round2(beam),
    diffuse: round2(diffuse),
    reflected: round2(reflected),
    model: 'hay-davies',
    source: 'Hay & Davies 1980; PVLib reference implementation'
  };
}

// ---------------------------------------------------------------------------
// 2c. POA — Perez et al. (1990) anisotropic sky model with horizon brightening
//     The most accurate model; used by NREL SAM and PVLib by default.
//     Reference: Perez R., Ineichen P., Seals R., Michalsky J., Stewart R., 1990,
//     "Modeling daylight availability and irradiance components from direct and
//     global irradiance", Solar Energy 44(5), 271-289.
//
//     Implementation uses the Perez bin coefficients (F11, F12, F13, F21, F22, F23)
//     for the 8 ε-bins from Perez et al. 1990 Table 1. ε is the sky clearness:
//        ε = ((DHI + DNI) / DHI + κ·θ_z³) / (1 + κ·θ_z³)
//     where κ = 1.041 and θ_z is the solar zenith angle in radians.
//     Δ is the brightness: Δ = m · DHI / I_extra
// ---------------------------------------------------------------------------
const PEREZ_COEFFS = [
  // [εMin, εMax, F11,    F12,    F13,    F21,    F22,    F23   ]
  [1.000, 1.065, -0.008,  0.588, -0.062, -0.060,  0.072, -0.022],
  [1.065, 1.230,  0.130,  0.683, -0.151, -0.019,  0.066, -0.029],
  [1.230, 1.500,  0.330,  0.487, -0.221,  0.055, -0.064, -0.026],
  [1.500, 1.950,  0.568,  0.187, -0.295,  0.109, -0.152, -0.014],
  [1.950, 2.800,  0.873, -0.392, -0.362,  0.226, -0.462,  0.001],
  [2.800, 4.500,  1.132, -1.237, -0.412,  0.288, -0.823,  0.056],
  [4.500, 6.200,  1.060, -1.600, -0.359,  0.264, -1.127,  0.131],
  [6.200, Infinity, 0.678, -0.327, -0.250,  0.156, -1.377,  0.251]
];
function poaIrradiancePerez({ ghi, dni, dhi, sunElev, sunAz, tilt, azimuth, albedo = 0.2 }) {
  const rad = Math.PI / 180;
  if (sunElev <= 0) return { poa: 0, beam: 0, diffuse: 0, reflected: 0, model: 'perez' };
  const zen = (90 - sunElev) * rad;
  const sinZen = Math.sin(zen);
  const cosZen = Math.max(0.05, Math.cos(zen));
  // Air mass (Kasten-Young 1989)
  const airMass = 1 / (cosZen + 0.50572 * Math.pow(96.07995 - (90 - sunElev), -1.6364));
  const Iextra = 1361;
  const safeDhi = Math.max(0.01, dhi);
  const eps = ((safeDhi + dni) / safeDhi + 1.041 * zen ** 3) / (1 + 1.041 * zen ** 3);
  const delta = airMass * safeDhi / Iextra;
  // Pick ε bin
  const bin = PEREZ_COEFFS.find((b) => eps >= b[0] && eps < b[1]) || PEREZ_COEFFS[0];
  const F1 = Math.max(0, bin[2] + bin[3] * delta + bin[4] * zen);
  const F2 =          bin[5] + bin[6] * delta + bin[7] * zen;
  const cosAOI = Math.max(0,
      Math.sin(sunElev * rad) * Math.cos(tilt * rad)
    + Math.cos(sunElev * rad) * Math.sin(tilt * rad) * Math.cos((sunAz - azimuth) * rad));
  const a = cosAOI;
  const b = Math.max(0.087, cosZen);   // 0.087 = cos(85°)
  const beam       = dni * cosAOI;
  const isotropic  = dhi * (1 - F1) * (1 + Math.cos(tilt * rad)) / 2;
  const circumsol  = dhi * F1 * a / b;
  const horizon    = dhi * F2 * Math.sin(tilt * rad);
  const reflected  = ghi * albedo * (1 - Math.cos(tilt * rad)) / 2;
  const diffuse = isotropic + circumsol + horizon;
  return {
    poa: round2(beam + diffuse + reflected),
    beam: round2(beam),
    diffuse: round2(diffuse),
    reflected: round2(reflected),
    model: 'perez',
    epsilon: round3(eps),
    delta: round3(delta),
    source: 'Perez et al., Solar Energy 44(5):271-289, 1990'
  };
}

// ---------------------------------------------------------------------------
// 2d. Bifacial gain — two-sided panel rear-irradiance estimator
//     POA_total = POA_front + POA_rear · bifaciality_factor · structure_factor
//     where:
//        bifaciality_factor (φ) is the panel rear/front response ratio (0.65–0.90
//          for modern bifacial cells; from datasheet, e.g. JA Solar JAM72D40 = 0.80,
//          LONGi Hi-MO 6 = 0.80, Trina Vertex N = 0.80).
//        structure_factor accounts for racking/back-surface obstruction (0.85
//          for fixed-tilt over grass, 0.95 for elevated trackers, 0.65 for
//          flush-mount roofs).
//     POA_rear is approximated as albedo · GHI · (1 - cos(tilt))/2 + isotropic
//     diffuse onto the rear from the sky (small for low tilts).
//     This is a first-order estimator. For sub-meter accuracy use bifacial_radiance
//     (Sandia) ray-tracing — flagged as future work.
// ---------------------------------------------------------------------------
function bifacialGain({ poaFront, ghi, tilt, albedo = 0.25, bifacialityFactor = 0.80, structureFactor = 0.85 }) {
  if (poaFront <= 0) return { poaRear: 0, poaTotal: round2(poaFront), gainPct: 0, model: 'bifacial-1st-order' };
  const rad = Math.PI / 180;
  // Rear ground-reflected (dominant term for fixed-tilt > 10°)
  const rearGround = albedo * ghi * (1 - Math.cos(tilt * rad)) / 2;
  // Rear sky-diffuse (small): model as 5% of front diffuse
  const rearSky = 0.05 * poaFront;
  const poaRearRaw = rearGround + rearSky;
  const poaRearEffective = poaRearRaw * bifacialityFactor * structureFactor;
  const poaTotal = poaFront + poaRearEffective;
  return {
    poaRear: round2(poaRearRaw),
    poaRearEffective: round2(poaRearEffective),
    poaTotal: round2(poaTotal),
    gainPct: round2((poaRearEffective / poaFront) * 100),
    bifacialityFactor,
    structureFactor,
    model: 'bifacial-1st-order',
    source: 'Bifacial PV first-order rear-irradiance estimator; for ray-traced accuracy use Sandia bifacial_radiance'
  };
}

// ---------------------------------------------------------------------------
// 7. Inverter matching — DC/AC ratio + voltage window check
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 3. PV module DC output (simplified single-diode at NOCT-corrected temp)
//    P_dc = P_stc * (POA/1000) * [1 + γ(T_cell − 25)]
//    T_cell ≈ T_amb + (NOCT − 20)/800 * POA   (King 2004)
// ---------------------------------------------------------------------------
function pvDcPower({ poa, ambientTemp, pStcW, gammaPmaxPerC = -0.0035, noct = 45 }) {
  if (poa <= 0) return 0;
  const tCell = ambientTemp + (noct - 20) / 800 * poa;
  const tempFactor = 1 + gammaPmaxPerC * (tCell - 25);
  const p = pStcW * (poa / 1000) * tempFactor;
  return Math.max(0, round2(p));
}

// ---------------------------------------------------------------------------
// 4. Hourly performance simulation (one day)
// ---------------------------------------------------------------------------
function hourlySimulation({
  lat, lon, dateISO, tilt, azimuth, systemKwStc,
  ambientTempC = 25, ghiPeak = 850, gammaPmaxPerC = -0.0035, noct = 45, albedo = 0.2,
  systemLossesPct = 14
}) {
  requirePositive({ systemKwStc });
  if (!(Number.isFinite(lat) && Math.abs(lat) <= 90 && Number.isFinite(lon) && Math.abs(lon) <= 180)) throw new InputError('lat and lon must be valid coordinates');
  if (!dateISO || Number.isNaN(Date.parse(dateISO))) throw new InputError('dateISO must be a date, e.g. 2026-06-21');
  if (!(Number.isFinite(tilt) && tilt >= 0 && tilt <= 90)) throw new InputError('tilt must be 0-90 degrees');
  if (!(Number.isFinite(azimuth) && azimuth >= 0 && azimuth <= 360)) throw new InputError('azimuth must be 0-360 degrees');
  const path = sunPathDay(lat, lon, dateISO);
  const efficiencyAfterLoss = 1 - systemLossesPct / 100;
  const out = [];
  let totalKwh = 0;
  for (const p of path) {
    // Synthesise GHI from sin(elev) — a clear-sky proxy. For real GHI series,
    // pass NASA POWER hourly data (caller can override).
    const ghi = p.elevation > 0 ? Math.max(0, ghiPeak * Math.sin(p.elevation * Math.PI / 180)) : 0;
    const poa = poaIrradiance({ ghi, sunElev: p.elevation, sunAz: p.azimuth, tilt, azimuth, albedo });
    const dcW = pvDcPower({ poa: poa.poa, ambientTemp: ambientTempC, pStcW: systemKwStc * 1000, gammaPmaxPerC, noct });
    const acKw = (dcW * efficiencyAfterLoss) / 1000;
    totalKwh += acKw; // 1-hour slots
    out.push({ hourUTC: p.hourUTC, sun: p, ghi: round2(ghi), poa: poa.poa, dcW, acKw: round3(acKw) });
  }
  return { totalKwhDay: round2(totalKwh), hourly: out };
}

// ---------------------------------------------------------------------------
// 5. System loss breakdown (industry-standard derate stack)
//    Source: NREL SAM default loss stack
// ---------------------------------------------------------------------------
function systemLossBreakdown(custom = {}) {
  const defaults = {
    soiling: 2.0,           // %
    shading: 3.0,
    snow: 0,
    mismatch: 2.0,
    wiringDc: 2.0,
    wiringAc: 1.0,
    connections: 0.5,
    lid: 1.5,               // light-induced degradation (first-year)
    nameplate: 1.0,
    inverter: 4.0,          // CEC-weighted efficiency loss
    transformer: 0,
    availability: 3.0
  };
  const losses = { ...defaults, ...custom };
  // Combine multiplicatively
  let combined = 1;
  for (const v of Object.values(losses)) combined *= (1 - v / 100);
  const totalPct = round2((1 - combined) * 100);
  return {
    items: losses,
    combinedDerate: round4(combined),
    totalLossPct: totalPct,
    yieldRatio: round4(combined),
    source: 'NREL System Advisor Model (SAM) default loss stack'
  };
}

// ---------------------------------------------------------------------------
// 6. String configuration calculator
//    Voc(T) = Voc_stc * [1 + βVoc * (T_min − 25)]
//    Constraints: maxString_Voc ≤ inverter_maxDc; min Vmpp(T_max) ≥ inverter_mppt_min
// ---------------------------------------------------------------------------
function stringConfig({
  panelVocStc, panelVmppStc, panelImppStc, panelIscStc,
  betaVocPctPerC = -0.27, // typical for c-Si
  inverterMaxDcV, inverterMpptMinV, inverterMpptMaxV, inverterMaxInputA, inverterMpptCount = 2,
  inverterMaxIscA, // the inverter's maximum short-circuit current per MPPT (datasheet), optional
  siteTempMinC = 5, siteTempMaxC = 70  // module temperature, not ambient
}) {
  requirePositive({ panelVocStc, panelVmppStc, panelIscStc, inverterMaxDcV, inverterMpptMinV, inverterMaxInputA });
  if (inverterMpptMaxV != null) requirePositive({ inverterMpptMaxV });
  if (panelVmppStc >= panelVocStc) throw new InputError('panelVmppStc must be below panelVocStc');
  if (!(Number.isFinite(siteTempMinC) && siteTempMinC >= -50 && siteTempMinC <= 50)) throw new InputError('siteTempMinC must be -50 to 50 °C');
  if (!(Number.isFinite(siteTempMaxC) && siteTempMaxC >= 0 && siteTempMaxC <= 100)) throw new InputError('siteTempMaxC must be 0 to 100 °C (module temperature)');
  if (siteTempMinC >= siteTempMaxC) throw new InputError('siteTempMinC must be below siteTempMaxC');
  if (!(Number.isFinite(betaVocPctPerC) && betaVocPctPerC < 0 && betaVocPctPerC >= -1)) throw new InputError('betaVocPctPerC must be between -1 and 0 %/°C');
  const vocCold = panelVocStc * (1 + (betaVocPctPerC / 100) * (siteTempMinC - 25));
  const vmppHot = panelVmppStc * (1 + (-0.40 / 100) * (siteTempMaxC - 25)); // typical beta_Vmpp
  const vmppCold = panelVmppStc * (1 + (-0.40 / 100) * (siteTempMinC - 25));
  // Upper limit: cold Voc under the inverter's maximum DC voltage AND cold Vmp
  // inside the MPPT window, so the tracker can still find the power point.
  const byMaxDc = Math.floor(inverterMaxDcV / vocCold);
  const byMppt = inverterMpptMaxV ? Math.floor(inverterMpptMaxV / vmppCold) : Infinity;
  const maxPanelsPerString = Math.min(byMaxDc, byMppt);
  const minPanelsPerString = Math.ceil(inverterMpptMinV / vmppHot);
  // Design string current 1.25 x Isc (IEC 62548), not Isc.
  // Current, two separate checks (2026-10-27 audit: 1.25 x Isc against the
  // OPERATING input limit rejected a 550 W panel on a Deye 5K, a normal pairing):
  //  - operating current (Impp) vs the input limit: a small excess only clips
  //    power (the inverter limits its own input current), up to ~10% accepted;
  //  - short-circuit current (Isc) vs the inverter's short-circuit rating, the
  //    safety limit, when the datasheet value is given.
  if (inverterMaxIscA != null) requirePositive({ inverterMaxIscA });
  const impp = panelImppStc > 0 ? panelImppStc : panelIscStc * 0.94;
  const byOperating = Math.floor((inverterMaxInputA * 1.1) / impp);
  const byIsc = inverterMaxIscA ? Math.floor(inverterMaxIscA / panelIscStc) : Infinity;
  const stringsPerMppt = Math.max(0, Math.min(byOperating, byIsc));
  const clipPct = Math.max(0, Math.round(((impp - inverterMaxInputA) / impp) * 1000) / 10);
  const feasible = maxPanelsPerString >= minPanelsPerString && stringsPerMppt >= 1;
  return {
    panelsPerString: {
      min: minPanelsPerString,
      max: maxPanelsPerString,
      // The longest valid string: fewest strings and lowest current.
      recommended: feasible ? maxPanelsPerString : null,
      limitedBy: byMppt < byMaxDc ? 'MPPT maximum voltage (cold Vmp)' : 'inverter maximum DC voltage (cold Voc)',
    },
    stringsPerMppt,
    totalMaxPanels: feasible ? maxPanelsPerString * stringsPerMppt * inverterMpptCount : 0,
    feasible,
    // Say which limit failed, not "one or the other" (2026-10-25 audit).
    ...(feasible ? {} : { verdict: [
      maxPanelsPerString < minPanelsPerString
        ? `No string length fits: at least ${minPanelsPerString} panels are needed to stay above the MPPT minimum when hot, but no more than ${maxPanelsPerString} keep cold voltage within the inverter limits.`
        : null,
      stringsPerMppt < 1
        ? (inverterMaxIscA && panelIscStc > inverterMaxIscA
          ? `The panel's short-circuit current (${round2(panelIscStc)} A) is above the inverter's ${inverterMaxIscA} A short-circuit rating per MPPT.`
          : `One string's operating current (${round2(impp)} A) is more than 10% above the inverter's ${inverterMaxInputA} A input limit.`)
        : null,
    ].filter(Boolean).join(' ') }),
    voltages: { vocCold: round2(vocCold), vmppHot: round2(vmppHot), vmppCold: round2(vmppCold) },
    current: {
      stringOperatingA: round2(impp),
      inverterInputLimitA: inverterMaxInputA,
      clippingPct: clipPct,
      ...(clipPct > 0 ? { clippingNote: `Operating current is ${clipPct}% above the input limit: the inverter clips that share of current near peak sun. Usually acceptable.` } : {}),
      ...(inverterMaxIscA ? { iscCheck: panelIscStc * Math.max(1, stringsPerMppt) <= inverterMaxIscA ? 'within the short-circuit rating' : 'above the short-circuit rating' } : { iscNote: 'Short-circuit rating not given: check Isc against the inverter datasheet (max. short-circuit current per MPPT).' }),
    },
    ...(inverterMpptMaxV ? {} : { note: 'No MPPT maximum given: only the maximum DC voltage was checked. Enter the MPPT range from the inverter datasheet.' }),
    source: 'IEC 62548 string sizing rules; manufacturer datasheet temperature coefficients'
  };
}

// ---------------------------------------------------------------------------
// 7. Inverter matching — DC/AC ratio + voltage window check
// ---------------------------------------------------------------------------
// systemType 'hybrid' or 'off-grid': the battery inverter is sized for the
// largest load, so a DC/AC ratio below 1 is normal (2026-10-27 audit: the
// calculator's own 3.3 kWp on a 3.6 kW hybrid was called "undersized PV").
// 1.0-1.3: the calculator's own range (lib/solar/sizing.ts; 2026-10-30 audit: 1.35 here).
function inverterMatch({ pvKwStc, inverterAcKw, dcAcRatioMin = 1.0, dcAcRatioMax = 1.3, systemType = 'grid-tied' }) {
  requirePositive({ pvKwStc, inverterAcKw, dcAcRatioMin, dcAcRatioMax });
  if (dcAcRatioMin >= dcAcRatioMax) throw new InputError('dcAcRatioMin must be below dcAcRatioMax');
  if (!['grid-tied', 'hybrid', 'off-grid'].includes(systemType)) throw new InputError('systemType must be grid-tied, hybrid or off-grid');
  const ratio = pvKwStc / inverterAcKw;
  const battery = systemType !== 'grid-tied';
  let verdict;
  if (ratio > dcAcRatioMax) verdict = 'oversized PV (clipping likely)';
  else if (ratio < dcAcRatioMin && battery) verdict = 'normal for a battery inverter: it is sized for the largest load, not the array';
  else if (ratio < dcAcRatioMin) verdict = 'undersized PV (inverter underutilised)';
  else verdict = 'good match';
  return { dcAcRatio: round3(ratio), verdict, systemType, recommendedRange: [dcAcRatioMin, dcAcRatioMax],
    source: battery
      ? 'Common practice: a hybrid or off-grid inverter is sized for the peak load; the array is sized for the energy. Check the MPPT PV-input limit on the datasheet.'
      : 'Common grid-tied practice: DC/AC about 1.1–1.3 (some clipping at peak sun is accepted for more energy at other hours)' };
}

// ---------------------------------------------------------------------------
// 8. Soiling derate — climate-dependent
//    Source: Kimber et al. NREL 2006; African dust regions
// ---------------------------------------------------------------------------
const SOILING_BY_CLIMATE = {
  arid:     { monthlyPct: 1.5, annualPct: 8.0, notes: 'High dust; regular cleaning critical' },
  semiarid: { monthlyPct: 1.0, annualPct: 5.0, notes: 'Moderate dust' },
  tropical: { monthlyPct: 0.5, annualPct: 3.0, notes: 'Frequent rain self-cleans panels' },
  temperate:{ monthlyPct: 0.4, annualPct: 2.0, notes: 'Light pollen + dust' }
};

function soilingDerate({ climate = 'tropical', daysSinceClean = 30 }) {
  const c = SOILING_BY_CLIMATE[climate] || SOILING_BY_CLIMATE.tropical;
  const dailyRate = c.monthlyPct / 30 / 100;
  const lossFraction = 1 - Math.exp(-dailyRate * daysSinceClean);
  return {
    climate,
    daysSinceClean,
    instantaneousLossPct: round2(lossFraction * 100),
    annualEstimatedLossPct: c.annualPct,
    notes: c.notes,
    source: 'Kimber et al., NREL 2006 (PVSEC); region-specific calibration'
  };
}

// ---------------------------------------------------------------------------
// 9. Seasonal variation — monthly capacity factors derived from sun path
// ---------------------------------------------------------------------------
function seasonalProfile({ lat, lon, year = new Date().getFullYear() }) {
  const out = [];
  for (let m = 0; m < 12; m++) {
    const d = new Date(Date.UTC(year, m, 15)); // 15th of each month
    const path = sunPathDay(lat, lon, d.toISOString().slice(0, 10));
    const peakElev = Math.max(...path.map((p) => p.elevation));
    const daylightHours = path.filter((p) => p.daylight).length;
    out.push({
      month: m + 1,
      peakSunElevation: round2(peakElev),
      daylightHours,
      relativeYield: round3(Math.sin((peakElev * Math.PI) / 180)) // proxy 0..1
    });
  }
  return { monthly: out, source: 'Computed from Michalsky 1988 sun-position algorithm' };
}

// helpers
function round2(x) { return Math.round(x * 100) / 100; }
function round3(x) { return Math.round(x * 1000) / 1000; }
function round4(x) { return Math.round(x * 10000) / 10000; }

// ---------------------------------------------------------------------------
// 10. Conductor sizing — voltage drop + ampacity (NEC 690.8 / IEC 60364-5-52)
// ---------------------------------------------------------------------------
//
// Resistivity ρ at 20 °C, Ω·mm²/m  (CDA / IEC 60228)
//   copper:    0.01724
//   aluminium: 0.02826
// Temperature coefficient α per °C from 20 °C reference:
//   copper:    0.00393
//   aluminium: 0.00403
//
// Standard IEC 60228 conductor cross-sections (mm²):
const IEC_60228_CSA_MM2 = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630];
const RESISTIVITY_20C = { copper: 0.01724, aluminium: 0.02826 };
const ALPHA_PER_C    = { copper: 0.00393, aluminium: 0.00403 };

/**
 * Round-trip voltage drop on a 2-conductor (DC or AC single-phase) run, or
 * line-to-line on a balanced 3-phase run. Result expressed as a fraction of
 * nominal voltage AND in volts.
 *
 *   ΔV = k * I * (2 * L) * ρ_T / A     [V]
 * where:
 *   k = 1 (DC), 1 (single-phase, hot+neutral), √3/2 (three-phase L-L)
 *   ρ_T = ρ_20 * (1 + α (T - 20))
 *   A   = conductor cross-section, mm²
 *   L   = one-way length, m
 *
 * Source: IEC 60364-5-52:2020 §G; NEC 2023 informational note 690.8(B)(2).
 */
function voltageDrop({ systemType, currentA, voltageV, oneWayLengthM,
                       csaMm2, conductorMaterial = 'copper', ambientTempC = 30 }) {
  const rho20 = RESISTIVITY_20C[conductorMaterial];
  const alpha = ALPHA_PER_C[conductorMaterial];
  if (!rho20) throw new Error(`unknown conductor material ${conductorMaterial}`);
  const rhoT = rho20 * (1 + alpha * (ambientTempC - 20));
  let dropV;
  if (systemType === 'dc' || systemType === 'ac_single_phase') {
    dropV = (2 * currentA * oneWayLengthM * rhoT) / csaMm2;
  } else if (systemType === 'ac_three_phase') {
    dropV = (Math.sqrt(3) * currentA * oneWayLengthM * rhoT) / csaMm2;
  } else {
    throw new Error(`unknown systemType ${systemType}`);
  }
  return {
    dropV: round3(dropV),
    dropPct: round3((dropV / voltageV) * 100),
    rhoT_OhmMmSqPerM: round4(rhoT),
    source: 'IEC 60364-5-52 Annex G; conductor resistivity per IEC 60228'
  };
}

/**
 * Recommend the smallest IEC 60228 cross-section that satisfies the voltage-
 * drop limit. Caller still has to verify ampacity against the published
 * rating tables (which depend on installation method, grouping, insulation
 * type — see IEC 60364-5-52 Annex B/C). For convenience, a conservative
 * 30 °C ambient single-circuit copper ampacity table for PVC-insulated
 * installation method E (free-air) is included.
 */
/** IEC 60364-5-52 Table B.52.10 (PVC, copper, method E, 30 °C), THREE loaded conductors. */
const IEC_AMPACITY_CU_E_30C_3LOADED = {
  1.5: 18.5, 2.5: 25, 4: 34, 6: 43, 10: 60, 16: 80, 25: 101, 35: 126, 50: 153,
  70: 196, 95: 238, 120: 276, 150: 319, 185: 364, 240: 430, 300: 497,
};
const IEC_AMPACITY_CU_E_30C = {
  // single-core PVC, free air, 30 °C ambient (IEC 60364-5-52 Tab B.52.10)
  1.5: 22, 2.5: 30, 4: 40, 6: 51, 10: 70, 16: 94, 25: 119, 35: 148, 50: 180,
  70: 232, 95: 282, 120: 328, 150: 379, 185: 434, 240: 514, 300: 593, 400: 715, 500: 826, 630: 958
};
/** IEC 60364-5-52 Table B.52.4 (PVC, copper, method B1, in conduit, 30 °C). */
const IEC_AMPACITY_CU_B1_30C = {
  1.5: 17.5, 2.5: 24, 4: 32, 6: 41, 10: 57, 16: 76, 25: 101, 35: 125, 50: 151,
  70: 192, 95: 232, 120: 269, 150: 300, 185: 341, 240: 400, 300: 458,
};
const IEC_AMPACITY_CU_B1_30C_3LOADED = {
  1.5: 15.5, 2.5: 21, 4: 28, 6: 36, 10: 50, 16: 68, 25: 89, 35: 110, 50: 134,
  70: 171, 95: 207, 120: 239, 150: 272, 185: 310, 240: 364, 300: 419,
};
/** Table B.52.14, PVC in air. Above 60 °C PVC has no usable rating. */
const PVC_TEMP_FACTOR = [[30, 1], [35, 0.94], [40, 0.87], [45, 0.79], [50, 0.71], [55, 0.61], [60, 0.5]];
/** Aluminium: about 0.78 x copper in the IEC tables; 0.75 taken as a screening
 *  value, and fixed aluminium wiring normally starts at 16 mm². */
const ALUMINIUM_RATING_FACTOR = 0.75;
function recommendConductor(args) {
  // Common alternative names are accepted, not silently ignored (2026-10-30
  // re-audit: maxDropPct 1.5 ran at the 3% default and reported "meets").
  if (args && args.maxVoltDropPct === undefined && args.maxDropPct !== undefined) args = { ...args, maxVoltDropPct: Number(args.maxDropPct) };
  const { systemType, currentA, voltageV, oneWayLengthM,
          conductorMaterial = 'copper', ambientTempC = 30, maxVoltDropPct = 3, pvString = false,
          installMethod = 'conduit', breakerA } = args;
  if (!['conduit', 'free_air'].includes(installMethod)) throw new InputError('installMethod must be conduit or free_air');
  if (breakerA !== undefined && breakerA !== null && breakerA !== '' && !(Number(breakerA) > 0)) throw new InputError('breakerA must be a positive number');
  if (!['dc', 'ac_single_phase', 'ac_three_phase'].includes(systemType)) {
    throw new InputError('systemType must be one of: dc, ac_single_phase, ac_three_phase');
  }
  requirePositive({ currentA, voltageV, oneWayLengthM });
  if (!(maxVoltDropPct > 0 && maxVoltDropPct <= 10)) throw new InputError('maxVoltDropPct must be between 0 and 10');
  if (!RESISTIVITY_20C[conductorMaterial]) throw new InputError('conductorMaterial must be copper or aluminium');
  if (!(Number.isFinite(ambientTempC) && ambientTempC >= -20 && ambientTempC <= 70)) throw new InputError('ambientTempC must be -20 to 70 °C');
  // In conduit is the default: most AC and battery runs are, and free-air ratings
  // left 16 mm² at 68 A carrying 72 A (audit 2026-10-31). PV string cable runs in
  // free air on the rails. Aluminium gets a screening rating, never none: 10 mm²
  // was "recommended" for 200 A.
  // Three-phase circuits carry three loaded conductors (2026-10-27 audit: the
  // two-conductor column overstated capacity ~15%; 110 A got 25 mm² instead of 35).
  const method = pvString ? 'free_air' : installMethod;
  const threeLoaded = systemType === 'ac_three_phase';
  const ampacityTable = method === 'conduit'
    ? (threeLoaded ? IEC_AMPACITY_CU_B1_30C_3LOADED : IEC_AMPACITY_CU_B1_30C)
    : (threeLoaded ? IEC_AMPACITY_CU_E_30C_3LOADED : IEC_AMPACITY_CU_E_30C);
  const materialFactor = conductorMaterial === 'copper' ? 1 : ALUMINIUM_RATING_FACTOR;
  // PV string: design current 1.25 x Isc; rooftop conduit runs hot, so derate
  // ampacity (IEC 60364-5-52 Tab B.52.14 at ~60 C ambient for PVC: 0.50);
  // and never below 4 mm2 PV1-F, the usual minimum for string cabling.
  const designA = pvString ? currentA * 1.25 : currentA;
  const tempForAmpacity = pvString ? Math.max(ambientTempC, 60) : ambientTempC;
  const tempRow = PVC_TEMP_FACTOR.find(([t]) => tempForAmpacity <= t);
  if (!tempRow) {
    return { recommendedCsaMm2: null, verdict: `PVC cable has no usable rating at ${tempForAmpacity} °C ambient: use a higher-temperature insulation, sized by an engineer.`, source: 'IEC 60364-5-52 Tab B.52.14' };
  }
  const derate = tempRow[1];
  const minCsa = pvString ? 4 : conductorMaterial === 'copper' ? 1.5 : 16;
  // The cable must carry the breaker's rating, not just the running current, or
  // the breaker does not protect it (IEC 60364-4-43: In ≤ Iz; audit 2026-10-31).
  const breaker = breakerA !== undefined && breakerA !== null && breakerA !== '' ? Number(breakerA) : 0;
  // Resistance at the conductor's operating temperature (~70 C for PVC at
  // full load), not at ambient.
  const conductorTemp = Math.max(ambientTempC, 70);
  for (const csa of IEC_60228_CSA_MM2) {
    if (csa < minCsa) continue;
    const vd = voltageDrop({ systemType, currentA, voltageV, oneWayLengthM, csaMm2: csa, conductorMaterial, ambientTempC: conductorTemp });
    // A size the table does not list has no rating: stop, rather than call it
    // adequate (2026-10-29 audit: 700 A got 400 mm² "meets ampacity" with no data).
    if (ampacityTable[csa] == null) break;
    const ampacity = ampacityTable[csa] * derate * materialFactor;
    const ampacityOk = ampacity >= designA && ampacity >= breaker;
    if (vd.dropPct <= maxVoltDropPct && ampacityOk) {
      return {
        recommendedCsaMm2: csa,
        voltageDropPct: vd.dropPct,
        maxVoltDropPctUsed: maxVoltDropPct,
        voltageDropV: vd.dropV,
        designCurrentA: round2(designA),
        ampacityA: round2(ampacity),
        ...(breaker ? { protectedByBreakerA: breaker } : {}),
        installMethod: method,
        verdict: conductorMaterial === 'copper'
          ? `meets voltage drop and ampacity limits${breaker ? ` and is protected by the ${breaker} A breaker` : ''}`
          : 'meets the voltage drop limit on a screening aluminium rating (0.75 x copper): confirm against the aluminium ratings in IEC 60364-5-52 before use.',
        assumptions: [
          `Resistance taken at ${conductorTemp} °C conductor temperature.`,
          pvString ? 'PV string: 1.25 x Isc design current, rooftop temperature derating, 4 mm² minimum (PV1-F).' : `Ampacity derated for ${tempForAmpacity} °C ambient.`,
          `Single circuit, PVC, ${method === 'conduit' ? 'in conduit (method B1)' : 'in free air (method E)'}. Grouping and other insulation need their own factors.`,
          ...(breaker ? [] : ['No breaker given: the cable rating must also be at least the rating of the breaker protecting it (IEC 60364-4-43).']),
        ],
        source: 'IEC 60364-5-52 §G, Tab B.52.4 / B.52.10 / B.52.14; IEC 60364-4-43; IEC 62548; NEC 690.8'
      };
    }
  }
  return {
    recommendedCsaMm2: null,
    verdict: 'no tabulated single conductor carries this current within the limits: use parallel conductors, busbar or a higher voltage, sized by an engineer (the ampacity table covers single cables only)',
    source: 'IEC 60364-5-52 Tab B.52.10 range exhausted'
  };
}

// ---------------------------------------------------------------------------
// 11. OCPD sizing — string fuse + array combiner + AC breaker (NEC 690.9 / IEC 60269-6)
// ---------------------------------------------------------------------------
//
// String fuse rating  ≥ 1.56 × Isc_STC   (NEC 690.9(B); IEC 62548 §6.3.3)
// Array fault current ≈ (N_strings_parallel − 1) × 1.25 × Isc_STC
//   → string fuse must clear before this fault back-feeds a faulted string
// AC breaker rating   ≥ 1.25 × inverter_AC_continuous_current
//
// Standard fuse sizes (gPV, IEC 60269-6): 1, 2, 3, 4, 5, 6, 8, 10, 12, 15,
//   16, 20, 25, 30, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400 A
const STD_GPV_FUSES = [1,2,3,4,5,6,8,10,12,15,16,20,25,30,32,40,50,63,80,100,125,160,200,250,315,400];
// Standard MCB / MCCB sizes (IEC 60898 / 60947-2): typical commercial range
const STD_AC_BREAKERS = [6,10,13,16,20,25,32,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000];

// Null when nothing in the table is big enough: never the largest, which handed
// 10,000 kW a 1000 A breaker (audit 2026-10-31).
function pickNextStdSize(table, valueA) {
  for (const s of table) if (s >= valueA) return s;
  return null;
}

function ocpdSizing({ panelIscStc, stringsInParallel, inverterAcKw, acVoltageV, phases }) {
  // String overcurrent device on each parallel string
  const stringFuseMinA = 1.56 * panelIscStc;        // NEC 690.9(B)
  const stringFuseStdA = pickNextStdSize(STD_GPV_FUSES, stringFuseMinA);
  // Maximum reverse-fault current that a single string fuse must interrupt
  const arrayFaultCurrentA = stringsInParallel > 1
    ? (stringsInParallel - 1) * 1.25 * panelIscStc
    : 0;
  // String fuse must be required when stringsInParallel ≥ 3 (rule of thumb;
  // exact threshold depends on module backfeed rating per IEC 61730)
  const stringFuseRequired = stringsInParallel >= 3;

  let acBreakerStdA = null, acBreakerMinNeededA = null;
  // Three-phase when asked, or when the voltage is a line voltage (380-415 V).
  // 2026-10-27 audit: 50 kW at 400 V was divided by 400 with no √3 and got a
  // 160 A breaker; the right answer is 100 A.
  const ph = phases === 3 || phases === '3' ? 3 : phases === 1 || phases === '1' ? 1 : (acVoltageV >= 380 ? 3 : 1);
  let inverterAcA = null;
  if (inverterAcKw && acVoltageV) {
    inverterAcA = ph === 3 ? (inverterAcKw * 1000) / (Math.sqrt(3) * acVoltageV) : (inverterAcKw * 1000) / acVoltageV;
    const acBreakerMinA = 1.25 * inverterAcA;       // NEC 690.9(B), 240.4
    acBreakerMinNeededA = acBreakerMinA;
    acBreakerStdA = pickNextStdSize(STD_AC_BREAKERS, acBreakerMinA);
  }

  return {
    stringFuse: {
      requiredWhenStringsInParallelGte: 3,
      required: stringFuseRequired,
      minRatingA: round2(stringFuseMinA),
      recommendedStdA: stringFuseStdA,
      arrayBackfeedFaultCurrentA: round2(arrayFaultCurrentA),
      verdict: stringFuseStdA == null
        ? `No standard gPV fuse reaches ${round2(stringFuseMinA)} A: check the panel Isc`
        : stringFuseRequired
        ? `Each string requires a ${stringFuseStdA} A gPV fuse (≥ 1.56 × Isc_stc, IEC 60269-6)`
        : 'String fuses optional below 3 parallel strings; verify module backfeed rating per IEC 61730'
    },
    acBreaker: inverterAcA != null && acBreakerStdA == null ? {
      recommendedStdA: null,
      phases: ph,
      continuousCurrentA: round2(inverterAcA),
      verdict: `${round2(acBreakerMinNeededA)} A is beyond the moulded-case range this tool lists (1000 A): use an air circuit breaker or split the output, specified by an engineer`
    } : acBreakerStdA != null ? {
      recommendedStdA: acBreakerStdA,
      phases: ph,
      poles: ph === 3 ? '3P or 4P (with neutral)' : '1P+N / 2P',
      continuousCurrentA: round2(inverterAcA),
      verdict: `AC breaker sized at 1.25 × inverter continuous current (NEC 690.9(B)). Its cable must be rated at least ${acBreakerStdA} A: give breakerA to the cable tool.`
    } : null,
    source: 'NEC 690.9; IEC 62548 §6.3; IEC 60269-6 (gPV fuses); IEC 60898 (MCBs)'
  };
}

module.exports = {
  InputError,
  sunPosition, sunPathDay, poaIrradiance, poaIrradianceHayDavies, poaIrradiancePerez,
  bifacialGain, pvDcPower,
  hourlySimulation, systemLossBreakdown,
  stringConfig, inverterMatch, soilingDerate, seasonalProfile,
  voltageDrop, recommendConductor, ocpdSizing,
  IEC_60228_CSA_MM2, IEC_AMPACITY_CU_E_30C, PEREZ_COEFFS
};
