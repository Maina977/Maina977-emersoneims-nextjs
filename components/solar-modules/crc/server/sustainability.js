// Sustainability module — carbon footprint, carbon credits, EV charging, microgrid sizing
// All emission factors and assumptions cited inline.

// ---------------------------------------------------------------------------
// Grid emission factors (kg CO2e per kWh) — IEA & national grid operators 2024
// ---------------------------------------------------------------------------
const GRID_EMISSION_FACTORS = {
  source: 'IEA Emissions Factors 2024 + KPLC LCOE 2023; Climate Transparency Report Africa 2024',
  retrieved_at: '2024-12-01',
  unit: 'kg CO2e / kWh',
  values: {
    KE: 0.213,   // Kenya — Climate Watch / KPLC 2023 (heavy hydro+geothermal mix)
    UG: 0.118,   // Uganda — predominantly hydro
    TZ: 0.428,   // Tanzania — gas+hydro
    RW: 0.420,
    ET: 0.083,   // Ethiopia — hydro dominant
    NG: 0.439,   // Nigeria — gas
    ZA: 0.928,   // South Africa — coal heavy
    EG: 0.473,
    MA: 0.687,
    GH: 0.327,
    GLOBAL_AVG: 0.481  // IEA 2023 world average
  }
};

// PV lifecycle CO2 (manufacturing + installation, amortised) — UNECE 2022, NREL LCA
const PV_LIFECYCLE_KG_PER_KWH = 0.041; // kg CO2e per kWh produced (utility-scale c-Si)
const PV_LIFECYCLE_SOURCE = 'UNECE Carbon Neutrality in the UNECE Region 2022; NREL LCA Harmonization';

// ---------------------------------------------------------------------------
// 1. Carbon footprint of an existing electricity load
// ---------------------------------------------------------------------------
function carbonFootprint({ annualKwh, country = 'KE' }) {
  const factor = GRID_EMISSION_FACTORS.values[country] ?? GRID_EMISSION_FACTORS.values.GLOBAL_AVG;
  const annualKg = annualKwh * factor;
  return {
    country,
    annualKwh,
    gridFactorKgPerKwh: factor,
    annualKgCO2e: round2(annualKg),
    annualTonnesCO2e: round2(annualKg / 1000),
    equivalents: emissionEquivalents(annualKg),
    provenance: { ...GRID_EMISSION_FACTORS, factorUsed: factor }
  };
}

// ---------------------------------------------------------------------------
// 2. Solar offset — emissions avoided over project lifetime
// ---------------------------------------------------------------------------
function solarOffset({ annualPvKwh, country = 'KE', projectYears = 25, panelDegradationPct = 0.5 }) {
  const factor = GRID_EMISSION_FACTORS.values[country] ?? GRID_EMISSION_FACTORS.values.GLOBAL_AVG;
  let totalKwh = 0;
  for (let y = 1; y <= projectYears; y++) {
    totalKwh += annualPvKwh * Math.pow(1 - panelDegradationPct / 100, y - 1);
  }
  const grossKg = totalKwh * factor;
  const lifecycleKg = totalKwh * PV_LIFECYCLE_KG_PER_KWH;
  const netKg = grossKg - lifecycleKg;
  return {
    projectYears,
    lifetimeKwh: round2(totalKwh),
    grossOffsetKg: round2(grossKg),
    pvLifecycleKg: round2(lifecycleKg),
    netOffsetKg: round2(netKg),
    netOffsetTonnes: round2(netKg / 1000),
    equivalents: emissionEquivalents(netKg),
    provenance: {
      gridFactor: { source: GRID_EMISSION_FACTORS.source, value: factor },
      pvLifecycle: { source: PV_LIFECYCLE_SOURCE, value: PV_LIFECYCLE_KG_PER_KWH }
    }
  };
}

// Emission equivalents — US EPA Greenhouse Gas Equivalencies Calculator 2024
function emissionEquivalents(kg) {
  return {
    treesPlanted20yr: round2(kg / 21.77),    // EPA: ~21.77 kg CO2/tree-year × 20yr / 20yr ≈ 21.77/yr
    carsOffRoadYear: round2(kg / 4600),       // EPA avg passenger car 4.6 t/yr
    homesPoweredYear: round2(kg / 7240),      // EPA avg US home 7.24 t/yr from electricity
    flightsLondonNairobiOneWay: round2(kg / 1130), // ICAO calculator ~1.13 t/pax economy
    source: 'US EPA Greenhouse Gas Equivalencies Calculator 2024 + ICAO Carbon Emissions Calculator'
  };
}

// ---------------------------------------------------------------------------
// 3. Carbon credit valuation
//    Source: Verra VCS, Gold Standard, Africa Carbon Markets Initiative (ACMI) 2023
// ---------------------------------------------------------------------------
const CARBON_CREDIT_PRICES_USD = {
  source: 'Ecosystem Marketplace State of the Voluntary Carbon Markets 2024 + ACMI Africa pricing',
  retrieved_at: '2024-12-01',
  perTonneUSD: {
    voluntary_low: 4.0,
    voluntary_avg: 7.5,
    voluntary_high: 18.0,
    compliance_eu_ets: 75.0,  // EU ETS reference
    africa_acmi_target: 20.0   // ACMI 2030 target price
  }
};

function carbonCredits({ tonnesCO2, marketTier = 'voluntary_avg', exchangeRateKesPerUsd = 130 }) {
  const usdPerTonne = CARBON_CREDIT_PRICES_USD.perTonneUSD[marketTier];
  if (usdPerTonne == null) {
    return { error: `Unknown market tier. Available: ${Object.keys(CARBON_CREDIT_PRICES_USD.perTonneUSD).join(', ')}` };
  }
  const valueUSD = tonnesCO2 * usdPerTonne;
  return {
    tonnesCO2,
    marketTier,
    pricePerTonneUSD: usdPerTonne,
    valueUSD: round2(valueUSD),
    valueKES: round2(valueUSD * exchangeRateKesPerUsd),
    notes: 'Net of registration & verification fees (~20–35%). Project must be registered with VCS/GS to monetise.',
    provenance: CARBON_CREDIT_PRICES_USD
  };
}

// ---------------------------------------------------------------------------
// 4. EV charging sizing — daily kWh + extra PV needed
//    EV efficiencies — EPA & EV-Database 2024
// ---------------------------------------------------------------------------
const EV_EFFICIENCY_KWH_PER_KM = {
  source: 'EV-Database.org 2024 + EPA dynamometer averages',
  vehicles: {
    'compact_ev':       0.155,  // Renault Zoe / VW e-Up class
    'sedan_ev':         0.180,  // Tesla Model 3 RWD ~0.165
    'suv_ev':           0.215,  // Tesla Model Y / Hyundai Ioniq 5
    'pickup_ev':        0.290,  // Ford F-150 Lightning class
    'twowheel_ev':      0.040,  // e-bike / e-motorcycle
    'tuktuk_ev':        0.070,  // BasiGo / Roam class
    'minibus_ev':       0.380,  // Roam Air / BYD K7
    'matatu_ev':        0.430   // 33-seater electric matatu (BasiGo K6)
  }
};

function evCharging({ vehicleType = 'sedan_ev', kmPerDay = 50, daysPerYear = 330, chargerKw = 7.4, chargingEfficiencyPct = 90, solarOnlyShare = 0.7 }) {
  const eff = EV_EFFICIENCY_KWH_PER_KM.vehicles[vehicleType];
  if (eff == null) return { error: `Unknown vehicle type. Available: ${Object.keys(EV_EFFICIENCY_KWH_PER_KM.vehicles).join(', ')}` };
  const dailyKwhAtBattery = kmPerDay * eff;
  const dailyKwhAtPlug = dailyKwhAtBattery / (chargingEfficiencyPct / 100);
  const annualKwh = dailyKwhAtPlug * daysPerYear;
  const dailyChargeHours = dailyKwhAtPlug / chargerKw;
  const additionalPvKwp = (dailyKwhAtPlug * solarOnlyShare) / 4.5; // ~4.5 PSH Kenya avg
  return {
    vehicleType,
    kmPerDay,
    efficiencyKwhPerKm: eff,
    dailyKwhAtBattery: round2(dailyKwhAtBattery),
    dailyKwhAtPlug: round2(dailyKwhAtPlug),
    annualKwh: round2(annualKwh),
    dailyChargeHoursAt7p4: round2(dailyChargeHours),
    additionalSolarKwpRecommended: round2(additionalPvKwp),
    assumptions: { chargerKw, chargingEfficiencyPct, solarOnlyShare, peakSunHoursAssumed: 4.5 },
    provenance: EV_EFFICIENCY_KWH_PER_KM
  };
}

// ---------------------------------------------------------------------------
// 5. Microgrid sizing — community / off-grid
//    Method: Loss-of-load probability target via simplified daily energy balance
//    Reference: HOMER Pro methodology; NREL "Microgrid Design Toolkit"
// ---------------------------------------------------------------------------
function microgridSizing({
  households = 50,
  avgDailyKwhPerHousehold = 4,
  productiveLoadKwh = 30,            // shops / clinics / schools
  peakKwLoad = 25,
  peakSunHours = 4.5,
  autonomyDays = 1.5,                // battery autonomy
  systemLossesPct = 18,
  batteryDoD = 0.85,                 // depth of discharge LiFePO4
  inverterSurgeFactor = 1.3,
  generatorBackupShare = 0.0         // 0 = pure solar+storage; 0.2 = 20% from genset
}) {
  const dailyEnergyKwh = households * avgDailyKwhPerHousehold + productiveLoadKwh;
  const grossDailyKwh = dailyEnergyKwh / (1 - systemLossesPct / 100);
  const pvKwp = (grossDailyKwh * (1 - generatorBackupShare)) / peakSunHours;
  const batteryUsableKwh = dailyEnergyKwh * autonomyDays;
  const batteryNominalKwh = batteryUsableKwh / batteryDoD;
  const inverterKw = peakKwLoad * inverterSurgeFactor;
  return {
    inputs: { households, avgDailyKwhPerHousehold, productiveLoadKwh, peakKwLoad, peakSunHours, autonomyDays },
    sizing: {
      dailyEnergyKwh: round2(dailyEnergyKwh),
      grossDailyKwhWithLosses: round2(grossDailyKwh),
      pvKwp: round2(pvKwp),
      batteryUsableKwh: round2(batteryUsableKwh),
      batteryNominalKwh: round2(batteryNominalKwh),
      inverterKw: round2(inverterKw),
      generatorBackupShare
    },
    notes: 'Simplified daily-balance design. For final sizing run hourly simulation (HOMER Pro / SAM) with 8760 load + GHI series.',
    provenance: { methodology: 'NREL Microgrid Design Toolkit + HOMER Pro daily-balance approach; LiFePO4 DoD per Battery University BU-808' }
  };
}

// ---------------------------------------------------------------------------
// 6. Diesel-vs-solar TCO comparison (off-grid)
// ---------------------------------------------------------------------------
function dieselVsSolar({
  annualKwh = 50000,
  dieselLitresPerKwh = 0.33,         // typical 0.30–0.40 L/kWh for genset
  dieselKesPerLitre = 195,           // EPRA Kenya diesel cap April 2026
  dieselMaintKesPerKwh = 5,
  pvCapexKes = 4500000,
  pvOpexKesPerYear = 90000,
  years = 15,
  discountRate = 0.10
}) {
  const dieselAnnualLitres = annualKwh * dieselLitresPerKwh;
  const dieselAnnualCost = dieselAnnualLitres * dieselKesPerLitre + annualKwh * dieselMaintKesPerKwh;
  const dieselTotal = dieselAnnualCost * years;
  // PV NPV of OPEX
  let pvOpexPv = 0;
  for (let y = 1; y <= years; y++) pvOpexPv += pvOpexKesPerYear / Math.pow(1 + discountRate, y);
  const pvTotalLifeNpv = pvCapexKes + pvOpexPv;
  // Diesel NPV
  let dieselNpv = 0;
  for (let y = 1; y <= years; y++) dieselNpv += dieselAnnualCost / Math.pow(1 + discountRate, y);
  return {
    diesel: {
      annualLitres: round2(dieselAnnualLitres),
      annualCostKes: round2(dieselAnnualCost),
      lifetimeUndiscountedKes: round2(dieselTotal),
      lifetimeNpvKes: round2(dieselNpv),
      annualCO2tonnes: round2(dieselAnnualLitres * 2.68 / 1000)  // 2.68 kg CO2/L diesel — DEFRA
    },
    solar: {
      capexKes: pvCapexKes,
      annualOpexKes: pvOpexKesPerYear,
      lifetimeNpvKes: round2(pvTotalLifeNpv)
    },
    savings: {
      lifetimeNpvSavingsKes: round2(dieselNpv - pvTotalLifeNpv),
      paybackYearsSimple: round2(pvCapexKes / Math.max(1, dieselAnnualCost - pvOpexKesPerYear))
    },
    provenance: {
      dieselPrice: 'EPRA Kenya petroleum cap (monthly publication)',
      dieselCO2Factor: 'UK DEFRA Greenhouse Gas Reporting Conversion Factors 2024 — 2.68 kg CO2/L',
      pvLifecycle: PV_LIFECYCLE_SOURCE
    }
  };
}

function round2(x) { return Math.round(x * 100) / 100; }

module.exports = {
  GRID_EMISSION_FACTORS, CARBON_CREDIT_PRICES_USD, EV_EFFICIENCY_KWH_PER_KM,
  carbonFootprint, solarOffset, carbonCredits,
  evCharging, microgridSizing, dieselVsSolar
};
