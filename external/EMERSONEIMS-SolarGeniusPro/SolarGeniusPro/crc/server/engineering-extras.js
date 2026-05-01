// ============================================================================
// engineering-extras.js — pure-JS engineering calculators
// ============================================================================
// Every function below is deterministic and source-cited. No external network
// calls; safe to unit-test. All return shapes include a `provenance` block
// per the Data Policy (no fabricated numbers without explicit labelling).
// ============================================================================

const r2 = (x) => Math.round(x * 100) / 100;
const r3 = (x) => Math.round(x * 1000) / 1000;

// ---------------------------------------------------------------------------
// 1. IEC 62305 Lightning Protection — risk class + SPD selection (short form)
// ---------------------------------------------------------------------------
// References:
//   IEC 62305-2 §A — risk components for structures
//   IEC 62305-3 §5 — LPS class vs rolling-sphere radius:
//     Class I  — 20 m   (high-risk: hospitals, ATEX, telecom)
//     Class II — 30 m   (commercial, industrial)
//     Class III — 45 m  (residential, light commercial)
//     Class IV — 60 m   (low-occupancy / low value)
//   IEC 61643-31 — SPD class for PV side; DC SPD Type 1+2 typical for KE
//   Kenya Standard KS 1515 (2019) and EPRA technical guideline align
//   with IEC 62305 for installations >20 m² array or >1 kW.
// ---------------------------------------------------------------------------
function lightningRiskClass({
  occupancyType = 'residential',  // residential | commercial | industrial | hospital | telecom
  flashDensityPerKm2Year = 8,      // KE plateau ≈ 6–10; coastal ≈ 4; lake region ≈ 12
  buildingHeightM = 6,
  buildingFootprintM2 = 100,
  arrayLocation = 'roof',          // roof | ground
  metallicServicesEntering = true, // grid, water — increase risk
}) {
  // Collection area Ad ≈ L·W + 6H·(L+W) + 9π·H²  (IEC 62305-2 Eq. A.2 simplified
  // for roughly square footprint). Treat footprint as square.
  const side = Math.sqrt(buildingFootprintM2);
  const Ad = buildingFootprintM2 + 6 * buildingHeightM * (2 * side) + 9 * Math.PI * buildingHeightM * buildingHeightM;
  // Expected dangerous events per year Nd = Ng · Ad · Cd · 1e-6
  const Cd = arrayLocation === 'roof' ? 1.0 : 0.5; // location factor
  const Nd = flashDensityPerKm2Year * Ad * Cd * 1e-6;

  // Tolerable risk Rt per IEC 62305-2 Tab 7 for loss of human life:
  //   hospital/telecom: 1e-5,  others: 1e-5 (loss L1)
  // We use a simplified comparison: if Nd > tolerable threshold by occupancy → upgrade class.
  const occRiskFactor = {
    hospital: 5.0, telecom: 4.0, industrial: 2.0, commercial: 1.5, residential: 1.0
  }[occupancyType] || 1.0;
  const adjustedNd = Nd * occRiskFactor * (metallicServicesEntering ? 1.3 : 1.0);

  let lpsClass, rollingSphereRadiusM;
  if (adjustedNd >= 1e-2)      { lpsClass = 'I';   rollingSphereRadiusM = 20; }
  else if (adjustedNd >= 5e-3) { lpsClass = 'II';  rollingSphereRadiusM = 30; }
  else if (adjustedNd >= 1e-3) { lpsClass = 'III'; rollingSphereRadiusM = 45; }
  else                          { lpsClass = 'IV';  rollingSphereRadiusM = 60; }

  // SPD selection per IEC 61643-31 for PV systems
  const spdRecommendation = {
    dcSide: lpsClass === 'I' || lpsClass === 'II'
      ? 'Type 1+2 combined SPD on DC string side (Iimp ≥ 12.5 kA per pole, 10/350 µs)'
      : 'Type 2 SPD on DC string side (In = 20 kA, 8/20 µs)',
    acSide: lpsClass === 'I'
      ? 'Type 1 SPD at AC main + Type 2 at sub-DB'
      : 'Type 2 SPD at AC main',
    earthing: 'TT or TN-S earthing; ≤ 10 Ω (KS 1515 §6); ≤ 1 Ω if hospital/telecom',
  };

  return {
    inputs: { occupancyType, flashDensityPerKm2Year, buildingHeightM, buildingFootprintM2, arrayLocation, metallicServicesEntering },
    collectionAreaM2: r2(Ad),
    expectedFlashesPerYear: Number(adjustedNd.toExponential(2)),
    lpsClass,
    rollingSphereRadiusM,
    spdRecommendation,
    verdict: lpsClass === 'IV'
      ? 'Optional LPS; SPDs still recommended on PV DC + AC sides'
      : `Mandatory Class ${lpsClass} LPS per IEC 62305-3 + SPDs per IEC 61643-31`,
    provenance: {
      method: 'IEC 62305-2 Eq. A.2 collection area + simplified L1 risk threshold',
      reference: 'IEC 62305-2/3 (2010), IEC 61643-31 (2018), KS 1515 (2019)',
      limits: 'Short-form risk; full RA per IEC 62305-2 needed for hospitals & ATEX. KE flash density approximate (NASA LIS).',
    }
  };
}

// ---------------------------------------------------------------------------
// 2. Battery sizing wizard — autonomy × critical loads × DoD × derating
// ---------------------------------------------------------------------------
// References:
//   IEC 61427-1 (PV battery cycling), IEEE 1561 (lead-acid sizing),
//   ESS manufacturer datasheets (LiFePO4 Pylontech, BYD, Deye)
function batterySizing({
  dailyCriticalLoadKwh,            // kWh — only loads to be backed up
  autonomyDays = 1,                // 1 day for grid-tied + backup; 2–3 for off-grid
  depthOfDischarge = 0.85,         // LiFePO4 typical; lead-acid 0.5
  roundTripEfficiency = 0.92,      // LiFePO4 inverter+battery; lead-acid ≈ 0.80
  ageingDeratingPct = 10,          // capacity at year 5 vs new
  temperatureDeratingPct = 5,      // 25 °C ref; KE roof 30–40 °C ≈ 5 %
  systemDcVoltage = 48,            // Vdc bus
  chemistry = 'lifepo4',           // lifepo4 | lead-acid
}) {
  const usableDeratingFactor = (1 - ageingDeratingPct / 100) * (1 - temperatureDeratingPct / 100);
  const energyRequiredKwh = (dailyCriticalLoadKwh * autonomyDays) / (roundTripEfficiency * depthOfDischarge * usableDeratingFactor);
  const capacityAh = (energyRequiredKwh * 1000) / systemDcVoltage;

  // Recommend stack size (round up to common modular sizes, e.g. 5 kWh modules)
  const moduleSizeKwh = chemistry === 'lifepo4' ? 5.0 : 2.4; // typical Pylontech US5000 vs Trojan 12V 200Ah
  const moduleCount = Math.ceil(energyRequiredKwh / moduleSizeKwh);
  const installedCapacityKwh = r2(moduleCount * moduleSizeKwh);

  // Continuous discharge — assume peak power = 1.5 × (avg critical load / 24 h)
  const avgPowerKw = dailyCriticalLoadKwh / 24;
  const peakPowerKw = r2(avgPowerKw * 3); // 3× headroom for surge
  const cRate = r3(peakPowerKw / installedCapacityKwh);

  return {
    inputs: { dailyCriticalLoadKwh, autonomyDays, depthOfDischarge, roundTripEfficiency, ageingDeratingPct, temperatureDeratingPct, systemDcVoltage, chemistry },
    energyRequiredKwh: r2(energyRequiredKwh),
    nominalCapacityAh: r2(capacityAh),
    moduleSizeKwh,
    moduleCount,
    installedCapacityKwh,
    estimatedPeakPowerKw: peakPowerKw,
    estimatedCRate: cRate,
    cRateVerdict: cRate <= 0.5 ? 'Comfortable C-rate' : cRate <= 1.0 ? 'Within spec' : 'Battery too small for surge — add modules',
    chemistryNotes: chemistry === 'lifepo4'
      ? 'LiFePO4: 6000+ cycles @ 80 % DoD, 10-yr typical warranty'
      : 'Flooded lead-acid: 1500 cycles @ 50 % DoD, 5-yr typical; vent gas; weekly equalisation',
    provenance: {
      method: 'IEEE 1561 sizing equation: E_req = (E_load × Days) / (η_rt × DoD × derate)',
      reference: 'IEC 61427-1 (PV cycling), IEEE 1561-2019, manufacturer datasheets',
      limits: 'Average daily load only; for variable critical loads use hourly profile + Monte Carlo.',
    }
  };
}

// ---------------------------------------------------------------------------
// 3. Net-metering / wheeling — KE EPRA solar export tariff
// ---------------------------------------------------------------------------
// EPRA Net-Metering Regulations 2024 (gazetted): exporters credited at the
// avoided cost (energy charge component only ≈ 60–70 % of retail), NOT at
// retail tariff. Wheeling tariff (EPRA wheeling rules 2023) applies to
// inter-utility transfers.
function netMeteringKenya({
  annualPvKwh,
  annualLoadKwh,
  selfConsumptionFraction = 0.70,  // typical residential without battery
  retailTariffKesPerKwh = 25.5,    // EPRA DC band 2025
  exportCreditFraction = 0.65,     // avoided-cost / retail ratio per EPRA 2024
}) {
  const selfConsumedKwh = Math.min(annualPvKwh * selfConsumptionFraction, annualLoadKwh);
  const exportedKwh = Math.max(0, annualPvKwh - selfConsumedKwh);
  const importedKwh = Math.max(0, annualLoadKwh - selfConsumedKwh);

  const exportCreditKes = exportedKwh * (retailTariffKesPerKwh * exportCreditFraction);
  const billSavingFromSelfUseKes = selfConsumedKwh * retailTariffKesPerKwh;
  const remainingImportCostKes = importedKwh * retailTariffKesPerKwh;
  const netAnnualBenefitKes = billSavingFromSelfUseKes + exportCreditKes - 0; // import is unavoidable cost
  const netAnnualBillKes = remainingImportCostKes - exportCreditKes;

  // Compare to "retail-rate net metering" myth (used by competitors)
  const naiveBenefitAtRetailKes = annualPvKwh * retailTariffKesPerKwh;
  const overstatementKes = naiveBenefitAtRetailKes - netAnnualBenefitKes;

  return {
    inputs: { annualPvKwh, annualLoadKwh, selfConsumptionFraction, retailTariffKesPerKwh, exportCreditFraction },
    selfConsumedKwh: r2(selfConsumedKwh),
    exportedKwh: r2(exportedKwh),
    importedKwh: r2(importedKwh),
    billSavingFromSelfUseKes: r2(billSavingFromSelfUseKes),
    exportCreditKes: r2(exportCreditKes),
    netAnnualBenefitKes: r2(netAnnualBenefitKes),
    netAnnualBillAfterSolarKes: r2(netAnnualBillKes),
    naiveBenefitIfRetailNetMeteringKes: r2(naiveBenefitAtRetailKes),
    overstatementIfNaiveKes: r2(overstatementKes),
    advice: exportCreditFraction < 0.85
      ? 'Maximise self-consumption (battery, time-of-use loads) — exports are only credited at ~65 % of retail per EPRA 2024.'
      : 'Net metering at near-retail; export-heavy designs are viable.',
    provenance: {
      method: 'Net-metering credit = exported × (retail × export-credit-fraction); avoided-cost basis',
      reference: 'EPRA Net-Metering Regulations 2024; EPRA Wheeling Rules 2023; KPLC retail tariff schedule 2025',
      limits: 'Assumes a single tariff band; large C&I customers face TOU bands. Verify final EPRA tariff per category.',
    }
  };
}

// ---------------------------------------------------------------------------
// 4. Generator displacement — diesel genset hours saved by solar/battery
// ---------------------------------------------------------------------------
function generatorDisplacement({
  gensetRatedKva,
  gensetLoadFactor = 0.5,         // average load / rated
  gensetSpecificFuelLPerKwh = 0.32,// l/kWh @ 50 % load (typical diesel)
  gensetMaintenancePerHourKes = 200,// oil, filters, labour
  dieselPriceKesPerL = 195,       // KE pump price 2026
  gensetRunHoursPerDay = 6,        // current usage
  solarBatteryDisplacementFraction = 0.85, // 85 % of genset hours absorbed
  gensetOverhaulHours = 6000,     // major service interval
  gensetOverhaulCostKes = 350000,
}) {
  const gensetKwOutput = gensetRatedKva * 0.8 * gensetLoadFactor; // PF 0.8
  const dailyKwhPreviouslyFromGenset = gensetKwOutput * gensetRunHoursPerDay;
  const annualKwhDisplaced = dailyKwhPreviouslyFromGenset * 365 * solarBatteryDisplacementFraction;
  const annualHoursDisplaced = gensetRunHoursPerDay * 365 * solarBatteryDisplacementFraction;

  const annualLitresSaved = annualKwhDisplaced * gensetSpecificFuelLPerKwh;
  const annualFuelKesSaved = annualLitresSaved * dieselPriceKesPerL;
  const annualMaintenanceKesSaved = annualHoursDisplaced * gensetMaintenancePerHourKes;
  const annualOverhaulKesSaved = (annualHoursDisplaced / gensetOverhaulHours) * gensetOverhaulCostKes;
  const annualCO2KgAvoided = annualLitresSaved * 2.68; // diesel 2.68 kg CO2/l

  const totalAnnualKesSaved = annualFuelKesSaved + annualMaintenanceKesSaved + annualOverhaulKesSaved;

  return {
    inputs: { gensetRatedKva, gensetLoadFactor, gensetRunHoursPerDay, dieselPriceKesPerL, solarBatteryDisplacementFraction },
    annualHoursDisplaced: r2(annualHoursDisplaced),
    annualKwhDisplaced: r2(annualKwhDisplaced),
    annualLitresDieselSaved: r2(annualLitresSaved),
    annualFuelKesSaved: r2(annualFuelKesSaved),
    annualMaintenanceKesSaved: r2(annualMaintenanceKesSaved),
    annualOverhaulAccrualKesSaved: r2(annualOverhaulKesSaved),
    totalAnnualKesSaved: r2(totalAnnualKesSaved),
    annualCO2KgAvoided: r2(annualCO2KgAvoided),
    gensetLifeExtensionPctPerYear: r2((annualHoursDisplaced / gensetOverhaulHours) * 100),
    provenance: {
      method: 'Specific fuel consumption × kWh displaced + maintenance × hours + pro-rata overhaul accrual',
      reference: 'ISO 8528-1 genset performance; DEFRA 2024 diesel CO₂ factor; Caterpillar/Cummins service intervals',
      limits: 'Specific fuel @ 50 % load assumed; below 30 % load it rises sharply (use 0.40 l/kWh).',
    }
  };
}

// ---------------------------------------------------------------------------
// 5. Tariff sensitivity — IRR vs ±X% annual tariff escalation
// ---------------------------------------------------------------------------
function tariffSensitivity({
  capexKes,
  year1SavingKes,
  projectYears = 25,
  baselineEscalationPct = 6,    // KE EPRA historical average
  escalationDeltas = [-3, -1, 0, 1, 3], // %/yr to test around baseline
  discountRatePct = 12,         // KE WACC for residential
  opexPctOfCapexPerYear = 1.0,
}) {
  function npvAndIrr(escalationPct) {
    const cashFlows = [-capexKes];
    for (let y = 1; y <= projectYears; y++) {
      const saving = year1SavingKes * Math.pow(1 + escalationPct / 100, y - 1);
      const opex = capexKes * (opexPctOfCapexPerYear / 100);
      cashFlows.push(saving - opex);
    }
    // NPV
    const npv = cashFlows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + discountRatePct / 100, i), 0);
    // IRR via bisection
    function npvAt(rate) {
      return cashFlows.reduce((a, cf, i) => a + cf / Math.pow(1 + rate, i), 0);
    }
    let lo = -0.5, hi = 1.0;
    if (npvAt(lo) * npvAt(hi) > 0) return { npv: r2(npv), irrPct: null };
    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      const v = npvAt(mid);
      if (Math.abs(v) < 1) { lo = hi = mid; break; }
      if (v > 0) lo = mid; else hi = mid;
    }
    return { npv: r2(npv), irrPct: r2(((lo + hi) / 2) * 100) };
  }

  const scenarios = escalationDeltas.map(delta => {
    const escalation = baselineEscalationPct + delta;
    const { npv, irrPct } = npvAndIrr(escalation);
    return { tariffEscalationPct: escalation, deltaFromBaseline: delta, npvKes: npv, irrPct };
  });

  return {
    inputs: { capexKes, year1SavingKes, projectYears, baselineEscalationPct, discountRatePct, opexPctOfCapexPerYear },
    baselineEscalationPct,
    scenarios,
    provenance: {
      method: '25-yr DCF with escalating energy savings; IRR by bisection',
      reference: 'NREL SAM methodology; KE EPRA historical tariff escalation 2014–2024 ≈ 6 %/yr CAGR',
      limits: 'Constant OPEX %; battery replacement at year 10 not modelled (subtract battery capex if applicable).',
    }
  };
}

// ---------------------------------------------------------------------------
// 6. O&M scheduler — annual maintenance calendar
// ---------------------------------------------------------------------------
function oAndMSchedule({
  systemKw,
  hasBattery = true,
  hasInverter = true,
  climate = 'tropical',
  installCommissionDateISO,        // e.g. "2026-04-22"
}) {
  const dust = { arid: 1, semiarid: 2, tropical: 3, temperate: 4 }[climate] || 3;
  const panelWashIntervalMonths = dust;
  const startDate = installCommissionDateISO ? new Date(installCommissionDateISO) : new Date();

  function addMonths(d, m) { const x = new Date(d); x.setMonth(x.getMonth() + m); return x.toISOString().slice(0, 10); }

  const tasks = [];
  // Year-1 schedule (12 months)
  for (let m = panelWashIntervalMonths; m <= 12; m += panelWashIntervalMonths) {
    tasks.push({ month: m, dueDate: addMonths(startDate, m), task: 'Panel wash + visual inspection', durationHours: 1 + Math.ceil(systemKw / 5), priority: 'normal' });
  }
  tasks.push({ month: 6, dueDate: addMonths(startDate, 6), task: 'DC string Voc / Isc spot-check', durationHours: 1, priority: 'normal' });
  tasks.push({ month: 12, dueDate: addMonths(startDate, 12), task: 'Annual: torque check, IR thermography, earth resistance test (≤10 Ω)', durationHours: 4, priority: 'high' });
  if (hasInverter) tasks.push({ month: 12, dueDate: addMonths(startDate, 12), task: 'Inverter firmware check + fan/heatsink clean', durationHours: 1, priority: 'high' });
  if (hasBattery) {
    tasks.push({ month: 6, dueDate: addMonths(startDate, 6), task: 'Battery SOH test + BMS log download', durationHours: 1, priority: 'high' });
    tasks.push({ month: 12, dueDate: addMonths(startDate, 12), task: 'Battery capacity test (full discharge cycle)', durationHours: 6, priority: 'high' });
  }
  tasks.push({ month: 12, dueDate: addMonths(startDate, 12), task: 'Generate annual performance report (PR vs forecast)', durationHours: 2, priority: 'normal' });

  // sort by month
  tasks.sort((a, b) => a.month - b.month);

  const annualHours = tasks.reduce((s, t) => s + t.durationHours, 0);
  const estLabourCostKes = annualHours * 1500; // KES/hour qualified PV technician

  return {
    inputs: { systemKw, hasBattery, hasInverter, climate, installCommissionDateISO },
    panelWashIntervalMonths,
    tasksYear1: tasks,
    annualLabourHours: annualHours,
    estAnnualLabourCostKes: estLabourCostKes,
    provenance: {
      method: 'IEC 62446-1 inspection schedule + climate-tuned wash interval',
      reference: 'IEC 62446-1:2016 (PV system documentation, commissioning, inspection); SolarPower Europe O&M Best-Practices Guide v5',
      limits: 'Generic schedule; high-soiling sites (industrial, dusty) need monthly washes.',
    }
  };
}

// ---------------------------------------------------------------------------
// 7. Priced BOQ — line-itemised quotation generator
// ---------------------------------------------------------------------------
// Item unit prices are realistic KE retail mid-2025 ranges, USD-pegged then
// converted at FX 130 KES/USD. Replace with live supplier feed in production.
function pricedBoq({
  systemKw,
  panelWattage = 580,
  panelUnitKes = 14000,           // 580 W mono N-type, FOB Mombasa + duty
  inverterKw,                     // size to match
  inverterUnitKes,
  batteryKwh = 0,
  batteryUnitKesPerKwh = 38000,   // LiFePO4 modular, typical KE 2025
  mountingType = 'roof_pitched',  // roof_pitched | roof_flat | ground_fixed
  mountingKesPerKw = 9000,
  bosKesPerKw = 6000,             // cables, MC4, fuses, isolators, SPDs, earthing
  installationKesPerKw = 8000,    // labour
  transportKes = 15000,           // single-trip, Nairobi metro
  permitsAndComplianceKes = 35000,// EPRA + utility interconnection
  contingencyPct = 5,
  marginPct = 18,
  vatPct = 16,
}) {
  const panelCount = Math.ceil((systemKw * 1000) / panelWattage);
  const dcKw = (panelCount * panelWattage) / 1000;
  const inverterKwActual = inverterKw || Math.max(1, Math.round(systemKw / 1.2)); // DC/AC ≈ 1.2
  const inverterUnitKesActual = inverterUnitKes || (inverterKwActual * 22000);     // ≈ KES 22k/kW hybrid

  const lineItems = [
    { item: `Solar panels (${panelWattage} W mono N-type)`, qty: panelCount, unit: 'pcs', unitPriceKes: panelUnitKes, subtotalKes: panelCount * panelUnitKes },
    { item: `Hybrid inverter (${inverterKwActual} kW)`, qty: 1, unit: 'pcs', unitPriceKes: inverterUnitKesActual, subtotalKes: inverterUnitKesActual },
    ...(batteryKwh > 0 ? [{ item: `LiFePO4 battery bank (${batteryKwh} kWh usable)`, qty: 1, unit: 'set', unitPriceKes: batteryKwh * batteryUnitKesPerKwh, subtotalKes: batteryKwh * batteryUnitKesPerKwh }] : []),
    { item: `Mounting structure (${mountingType.replace('_', ' ')})`, qty: 1, unit: 'set', unitPriceKes: dcKw * mountingKesPerKw, subtotalKes: dcKw * mountingKesPerKw },
    { item: 'Balance of system (cabling, MC4, DC/AC isolators, SPDs, earthing)', qty: 1, unit: 'set', unitPriceKes: dcKw * bosKesPerKw, subtotalKes: dcKw * bosKesPerKw },
    { item: 'Installation labour (qualified PV technicians)', qty: 1, unit: 'set', unitPriceKes: dcKw * installationKesPerKw, subtotalKes: dcKw * installationKesPerKw },
    { item: 'Transport & logistics', qty: 1, unit: 'set', unitPriceKes: transportKes, subtotalKes: transportKes },
    { item: 'EPRA permits, utility interconnection, COC', qty: 1, unit: 'set', unitPriceKes: permitsAndComplianceKes, subtotalKes: permitsAndComplianceKes },
  ];

  const subtotalCostKes = lineItems.reduce((s, l) => s + l.subtotalKes, 0);
  const contingencyKes = subtotalCostKes * (contingencyPct / 100);
  const costBaseKes = subtotalCostKes + contingencyKes;
  const marginKes = costBaseKes * (marginPct / 100);
  const sellingPriceExVatKes = costBaseKes + marginKes;
  const vatKes = sellingPriceExVatKes * (vatPct / 100);
  const totalIncVatKes = sellingPriceExVatKes + vatKes;

  return {
    inputs: { systemKw, panelWattage, batteryKwh, mountingType, contingencyPct, marginPct, vatPct },
    summary: {
      dcKw: r2(dcKw),
      panelCount,
      inverterKw: inverterKwActual,
      batteryKwh,
    },
    lineItems: lineItems.map(l => ({ ...l, unitPriceKes: r2(l.unitPriceKes), subtotalKes: r2(l.subtotalKes) })),
    totals: {
      subtotalCostKes: r2(subtotalCostKes),
      contingencyKes: r2(contingencyKes),
      marginKes: r2(marginKes),
      sellingPriceExVatKes: r2(sellingPriceExVatKes),
      vatKes: r2(vatKes),
      totalIncVatKes: r2(totalIncVatKes),
      kesPerWatt: r2(totalIncVatKes / (dcKw * 1000)),
    },
    provenance: {
      method: 'Bottom-up cost build + contingency + margin + 16 % VAT (KE 2025 standard rate)',
      reference: 'KE Solar Suppliers Association 2025 retail price survey; EPRA permitting fees schedule',
      limits: 'Indicative pricing; lock-in supplier quotes within 30 days due to FX volatility.',
    }
  };
}

// ---------------------------------------------------------------------------
// 8. 3-phase imbalance check
// ---------------------------------------------------------------------------
// Per IEEE 1159 / IEC 61000-3-13: phase voltage unbalance factor (PVUF)
//   PVUF = max|Vphase - Vavg| / Vavg × 100
// EPRA / utility limit: 2 % at PCC for utility-connected solar inverters.
function threePhaseImbalance({
  loadL1Kw, loadL2Kw, loadL3Kw,
  pvL1Kw = 0, pvL2Kw = 0, pvL3Kw = 0,
}) {
  const netL1 = loadL1Kw - pvL1Kw;
  const netL2 = loadL2Kw - pvL2Kw;
  const netL3 = loadL3Kw - pvL3Kw;
  const avg = (netL1 + netL2 + netL3) / 3;
  const max = Math.max(netL1, netL2, netL3);
  const min = Math.min(netL1, netL2, netL3);
  // Approximate voltage unbalance from current unbalance (assumes weak-source approx):
  //   ΔV/V ≈ 0.6 × ΔI/I  (typical LV transformer)
  const currentUnbalancePct = avg !== 0 ? Math.abs((max - min) / avg) * 100 : 0;
  const estimatedVoltageUnbalancePct = currentUnbalancePct * 0.6;

  let verdict, action;
  if (estimatedVoltageUnbalancePct <= 2) { verdict = 'OK — within EPRA / IEC 61000-3-13 limits'; action = 'No action needed.'; }
  else if (estimatedVoltageUnbalancePct <= 4) { verdict = 'Borderline'; action = 'Rebalance loads across phases or split inverter feeds.'; }
  else { verdict = 'Fail — EPRA approval at risk'; action = 'Rebalance loads OR install 3-phase inverter / 3 single-phase inverters per phase.'; }

  return {
    inputs: { loadL1Kw, loadL2Kw, loadL3Kw, pvL1Kw, pvL2Kw, pvL3Kw },
    netPerPhaseKw: { L1: r2(netL1), L2: r2(netL2), L3: r2(netL3) },
    avgKw: r2(avg),
    currentUnbalancePct: r2(currentUnbalancePct),
    estimatedVoltageUnbalancePct: r2(estimatedVoltageUnbalancePct),
    verdict,
    action,
    provenance: {
      method: 'NEMA-style %-imbalance ((max-min)/avg) with weak-source ΔV/V ≈ 0.6 × ΔI/I',
      reference: 'IEC 61000-3-13:2008; IEEE 1159-2019; EPRA Grid Code 2024',
      limits: 'Approximation only; for compliance commissioning use 10-min rms PVUF measurement at PCC.',
    }
  };
}

// ---------------------------------------------------------------------------
// 9. Geo-risk overlay (KE specific)
// ---------------------------------------------------------------------------
// Wind zones per KS EAS 162 (Kenya wind code, harmonised with EN 1991-1-4)
// Seismic per KE National Building Code 2024 (PGA): Rift Valley = high
// Flood per WRMA flood-prone basins (Tana, Nzoia, Athi)
function geoRisk({ lat, lon }) {
  // Rough rule-based zoning for KE (no external data calls — this is offline)
  // If user wants precise classification, add a backend hit to KSI/WRMA shapefiles.
  const inRiftValley = lon >= 35.5 && lon <= 36.5 && lat >= -2 && lat <= 2;
  const onCoast = lon >= 39 && lat >= -5 && lat <= -1;
  const inLakeBasin = lon >= 33.5 && lon <= 35 && lat >= -2 && lat <= 1;

  let windZoneKpa, windCategory;
  if (onCoast) { windZoneKpa = 1.05; windCategory = 'Zone IV (coastal cyclonic risk, Vb=42 m/s)'; }
  else if (inRiftValley) { windZoneKpa = 0.85; windCategory = 'Zone III (Rift Valley, Vb=38 m/s)'; }
  else { windZoneKpa = 0.65; windCategory = 'Zone II (interior plateau, Vb=33 m/s)'; }

  let seismicPga, seismicCategory;
  if (inRiftValley) { seismicPga = 0.20; seismicCategory = 'High (Rift Valley, PGA 0.15–0.25 g)'; }
  else if (onCoast) { seismicPga = 0.08; seismicCategory = 'Moderate (Coast, PGA 0.05–0.10 g)'; }
  else { seismicPga = 0.05; seismicCategory = 'Low (Interior plateau, PGA <0.10 g)'; }

  let floodRisk;
  if (inLakeBasin) floodRisk = 'High — Lake Victoria basin (Nzoia, Yala flood plains)';
  else if (onCoast) floodRisk = 'Moderate — coastal storm surge during long rains';
  else floodRisk = 'Low to moderate — confirm with WRMA basin map';

  const mountingRecommendation = onCoast || inRiftValley
    ? 'Use stainless steel hardware (corrosion + dynamic loads), structural pull-out test mandatory'
    : 'Galvanised steel hardware acceptable; verify rafter capacity per KS EAS 162';

  return {
    inputs: { lat, lon },
    windZone: { category: windCategory, designPressureKpa: windZoneKpa },
    seismic:  { category: seismicCategory, pgaG: seismicPga },
    flood:    { risk: floodRisk },
    mountingRecommendation,
    provenance: {
      method: 'Rule-based zonation from latitude/longitude bounding boxes (KE national codes)',
      reference: 'KS EAS 162 (Kenya wind code), KE National Building Code 2024, WRMA basin atlas',
      limits: 'Coarse zonation; commission a site-specific wind & soil report for >50 kW C&I or critical loads.',
    }
  };
}

// ---------------------------------------------------------------------------
// 10. Client portal token / share-link generator (deterministic)
// ---------------------------------------------------------------------------
function clientPortalLink({ projectId, clientName, baseUrl = 'https://portal.solargeniuspro.com' }) {
  // Simple deterministic token: base64 of "projectId:dateYYYYMMDD"
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const raw = `${projectId}:${today}`;
  const token = Buffer.from(raw).toString('base64url');
  const url = `${baseUrl}/p/${token}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`Hi ${clientName}, view your live solar dashboard: ${url}`)}`;
  return {
    inputs: { projectId, clientName },
    portalUrl: url,
    token,
    expiresOn: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    whatsappShareUrl: whatsappShare,
    qrSvgDataUrl: null, // QR generation happens client-side to keep bundle small
    provenance: {
      method: 'Deterministic base64url token; rotate every 90 days',
      reference: 'OWASP ASVS v4 §3 (session management); rotate via /api/portal/revoke when superseded',
      limits: 'Demo token only — production must use a server-stored signed JWT with revocation list.',
    }
  };
}

module.exports = {
  lightningRiskClass,
  batterySizing,
  netMeteringKenya,
  generatorDisplacement,
  tariffSensitivity,
  oAndMSchedule,
  pricedBoq,
  threePhaseImbalance,
  geoRisk,
  clientPortalLink,
};
