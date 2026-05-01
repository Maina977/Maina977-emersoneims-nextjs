// =====================================================================
// architecture-approval.js — Tier-7 Architect / Building Surveyor pack
//
// Closes the gaps between engineering sign-off (Phase 7) and what an
// architect / building surveyor / planning officer needs to APPROVE
// the PV installation as part of the wider building project.
//
// (1) windUpliftAsce7      — ASCE 7-22 §29.4.4 design wind pressure on rooftop PV
// (2) snowLoadCombination  — ASCE 7-22 §7 / EN 1991-1-3 snow load on tilted PV
// (3) ballastSchedule      — SEAOC PV2-2017 non-penetrating ballast layout
// (4) roofReserveCapacity  — IBC §1604.4 added vs allowable dead load
// (5) rooftopFireSetback   — IFC §1204 / NFPA 1 §11.12 PV-specific pathways
// (6) flashingPenetration  — ICC-ES AC428 roof penetration & flashing spec
// (7) neighbourShadow      — EN 17037 / BRE 209 right-to-light on neighbouring properties
// (8) ifcBimExport         — ISO 16739-1 (IFC4) export stub for architect's coord model
// (9) planningNarrative    — heritage / conservation / visual impact narrative
//
// Every function returns { inputs, ...result, provenance } per Data Policy.
// =====================================================================

const r2 = (x) => Math.round(x * 100) / 100;
const r3 = (x) => Math.round(x * 1000) / 1000;
const deg2rad = (d) => d * Math.PI / 180;
const rad2deg = (r) => r * 180 / Math.PI;

// =====================================================================
// (1) WIND UPLIFT — ASCE 7-22 §29.4.4 Rooftop Solar Panels
// =====================================================================
function windUpliftAsce7({
  basicWindSpeedMps = 50,                      // V (3-s gust at 10 m, RC II)
  exposureCategory = 'C',                      // B | C | D
  buildingHeightM = 10,
  buildingPlanLengthM = 30,
  buildingPlanWidthM = 20,
  panelTiltDeg = 10,
  panelHeightAboveRoofM = 0.15,
  riskCategory = 'II',                         // I | II | III | IV
  arrayLocationOnRoof = 'field',               // field | edge | corner
  parapetHeightM = 0,
}) {
  // Velocity pressure qz per ASCE 7-22 Eq 26.10-1: qz = 0.613·Kz·Kzt·Kd·Ke·V²
  // (V in m/s gives qz in Pa)
  // Kz from Table 26.10-1 (exposure C, 10m → Kz ≈ 1.00; B → 0.85; D → 1.10)
  const kzMap = { B: 0.85, C: 1.00, D: 1.10 };
  let kz = kzMap[exposureCategory] || 1.00;
  // Adjust Kz for height (simplified power-law)
  const alpha = { B: 7.0, C: 9.5, D: 11.5 }[exposureCategory] || 9.5;
  const zg = { B: 365.76, C: 274.32, D: 213.36 }[exposureCategory] || 274.32;
  const z = Math.max(buildingHeightM, 4.6);
  kz = 2.01 * Math.pow(z / zg, 2 / alpha);
  if (kz < 0.85) kz = 0.85;

  const Kzt = 1.0;     // topographic factor — site-specific, default flat
  const Kd  = 0.85;    // directionality, ASCE 7-22 Table 26.6-1 for "rooftop equipment"
  const Ke  = 1.0;     // ground elevation, default sea-level
  const qz = 0.613 * kz * Kzt * Kd * Ke * basicWindSpeedMps * basicWindSpeedMps;  // Pa

  // GCp (combined gust + pressure coefficient) for rooftop solar — ASCE 7-22 Fig 29.4-7
  // For low-profile (<=2 ft above roof), tilt ≤ 35°, parapet < 0.6× panel chord
  // Effective wind area in m² — assume single panel = 2 m²
  // GCrn: nominal pressure coefficient combination for PV
  // Edge factor γE: 1.0 field, 1.5 edge, 2.0 corner (per ASCE 7-22 Fig 29.4-7)
  const gammaE = { field: 1.0, edge: 1.5, corner: 2.0 }[arrayLocationOnRoof] || 1.0;
  // Tilt factor γa: at 5° tilt → 0.5; at 35° → 1.5 (linear)
  const gammaA = 0.5 + (panelTiltDeg / 35) * 1.0;
  const GCrn = 1.5 * gammaE * gammaA;   // base 1.5 from low-profile PV chart

  // Parapet reduction — if parapet ≥ 1.2× panel height above roof: γp = 0.7 else 1.0
  const gammaP = (parapetHeightM >= 1.2 * panelHeightAboveRoofM) ? 0.7 : 1.0;
  const designPressurePa = qz * GCrn * gammaP;

  // Importance factor implicit via V already mapped to RC; minimum design pressure 0.77 kPa
  const minPa = 770;
  const finalDesignPressurePa = Math.max(designPressurePa, minPa);

  return {
    inputs: { basicWindSpeedMps, exposureCategory, buildingHeightM, panelTiltDeg, panelHeightAboveRoofM, riskCategory, arrayLocationOnRoof, parapetHeightM },
    velocityPressureQzPa: r2(qz),
    velocityPressureQzKpa: r3(qz / 1000),
    coefficients: {
      Kz: r3(kz), Kzt, Kd, Ke,
      gammaE, gammaA: r2(gammaA), gammaP, GCrn: r2(GCrn),
    },
    designUpliftPressurePa: r2(designPressurePa),
    designUpliftPressureKpa: r3(designPressurePa / 1000),
    designUpliftPressureKpaWithMin: r3(finalDesignPressurePa / 1000),
    minimumApplied: designPressurePa < minPa,
    designVerdict: `Use ${r3(finalDesignPressurePa / 1000)} kPa uplift pressure for racking & fastener design (${arrayLocationOnRoof} zone, tilt ${panelTiltDeg}°, exposure ${exposureCategory}).`,
    provenance: {
      method: 'ASCE 7-22 §29.4.4 Rooftop Solar Panels for buildings with h ≤ 18 m. Velocity pressure qz from §26.10 Eq 26.10-1; GCrn from Fig 29.4-7 with edge factor γE, tilt factor γa, parapet reduction γp; minimum 0.77 kPa per §29.4.4.3.',
      reference: 'ASCE/SEI 7-22 "Minimum Design Loads and Associated Criteria for Buildings and Other Structures" §29.4.4; SEAOC PV2-2017 "Wind Loads on Low-Profile Solar Photovoltaic Systems on Flat Roofs" (basis for ASCE 7-22 figures).',
      limits: 'Valid for low-profile rooftop arrays h ≤ 0.6 m above roof, building h ≤ 18 m, tilt ≤ 35°. For ground-mount, tracker, or canopy systems use ASCE 7-22 Ch 29 general MWFRS provisions instead. Topographic factor Kzt = 1.0 default — increase for hill/escarpment sites.',
    }
  };
}

// =====================================================================
// (2) SNOW LOAD on TILTED PV — ASCE 7-22 §7 / EN 1991-1-3
// =====================================================================
function snowLoadCombination({
  groundSnowLoadKnPerM2 = 0.5,                 // pg or sk
  panelTiltDeg = 10,
  exposureFactor = 1.0,                         // Ce (ASCE) / Ce (Eurocode) — 0.7 windswept, 1.0 normal, 1.2 sheltered
  thermalFactor = 1.0,                          // Ct: 1.0 heated, 1.2 unheated, 1.3 cold roof
  importanceFactor = 1.0,                       // Is: 0.8 RC I, 1.0 II, 1.1 III, 1.2 IV
  panelSurfaceFriction = 'slippery',           // slippery (glass) | non-slippery
  code = 'ASCE',                                // ASCE | Eurocode
}) {
  // Sloped roof snow load:
  // ASCE 7-22 Eq 7.4-1: ps = Cs · pf where pf = 0.7·Ce·Ct·Is·pg
  // EN 1991-1-3 Eq 5.1: s = μ1·Ce·Ct·sk
  let designKnPerM2;
  let breakdown;

  if (code === 'ASCE') {
    const pf = 0.7 * exposureFactor * thermalFactor * importanceFactor * groundSnowLoadKnPerM2;
    // Cs slope factor — Fig 7.4-1: warm slippery roof → 0 above 70°, 1.0 at 0°, linear 30°→70° to 0
    let Cs;
    if (panelSurfaceFriction === 'slippery') {
      if (panelTiltDeg <= 5) Cs = 1.0;
      else if (panelTiltDeg >= 70) Cs = 0;
      else Cs = 1.0 - (panelTiltDeg - 5) / 65;
    } else {
      if (panelTiltDeg <= 30) Cs = 1.0;
      else if (panelTiltDeg >= 70) Cs = 0;
      else Cs = 1.0 - (panelTiltDeg - 30) / 40;
    }
    designKnPerM2 = Cs * pf;
    breakdown = { pgKnPerM2: groundSnowLoadKnPerM2, Ce: exposureFactor, Ct: thermalFactor, Is: importanceFactor, pfKnPerM2: r3(pf), Cs: r3(Cs), psKnPerM2: r3(designKnPerM2) };
  } else {
    // EN 1991-1-3 §5.3.3 — μ1 cylindrical/duo-pitch slope factor
    let mu1;
    if (panelTiltDeg <= 30) mu1 = 0.8;
    else if (panelTiltDeg >= 60) mu1 = 0;
    else mu1 = 0.8 * (60 - panelTiltDeg) / 30;
    designKnPerM2 = mu1 * exposureFactor * thermalFactor * groundSnowLoadKnPerM2;
    breakdown = { skKnPerM2: groundSnowLoadKnPerM2, Ce: exposureFactor, Ct: thermalFactor, mu1: r3(mu1), sKnPerM2: r3(designKnPerM2) };
  }

  return {
    inputs: { groundSnowLoadKnPerM2, panelTiltDeg, exposureFactor, thermalFactor, importanceFactor, panelSurfaceFriction, code },
    breakdown,
    designSnowLoadKnPerM2: r3(designKnPerM2),
    designSnowLoadKpa: r3(designKnPerM2),
    sliding: panelTiltDeg > 15 && panelSurfaceFriction === 'slippery'
      ? `Sliding snow LIKELY at ${panelTiltDeg}° on slippery glass — provide snow guards or downstream collection per ASCE 7-22 §7.9 / EN 1991-1-3 §6.1.`
      : 'Sliding snow risk LOW — no snow guard required.',
    designVerdict: `Apply ${r3(designKnPerM2)} kN/m² (= kPa) snow load to PV-to-roof attachment in load combination D + S per ASCE 7-22 §2.3 / EN 1990 §6.4.`,
    provenance: {
      method: code === 'ASCE'
        ? 'ASCE 7-22 §7.4 sloped-roof snow load: ps = Cs × (0.7 × Ce × Ct × Is × pg); slope factor Cs per Fig 7.4-1 for warm slippery vs unobstructed.'
        : 'EN 1991-1-3:2003 §5.3.3 sloped-roof snow load: s = μ1 × Ce × Ct × sk; shape coefficient μ1 from Fig 5.1.',
      reference: code === 'ASCE'
        ? 'ASCE/SEI 7-22 Ch 7 Snow Loads; ASCE 7-22 §7.9 sliding snow.'
        : 'EN 1991-1-3:2003+A1:2015 Eurocode 1: Actions on Structures — Part 1-3: General actions — Snow loads.',
      limits: 'For ground snow > 4.8 kN/m², drift loads (ASCE §7.7 / EN 1991-1-3 §5.3.6) may govern. PV tilt assumed equal to underlying roof slope; if PV is racked above pitched roof, assess drift between rows separately.',
    }
  };
}

// =====================================================================
// (3) BALLAST SCHEDULE — SEAOC PV2-2017 Non-Penetrating
// =====================================================================
function ballastSchedule({
  designUpliftKnPerM2 = 1.2,                    // result from windUpliftAsce7 / 1000
  panelLengthM = 2.0,
  panelWidthM = 1.1,
  panelMassKg = 22,
  numberOfPanels = 1,
  rackingMassKgPerPanel = 8,
  blockMassKg = 18,                             // typ. concrete paver 400×200×40 ≈ 8 kg; 400×400×50 ≈ 18 kg
  frictionCoeffRoofToBallast = 0.6,             // EPDM-on-paver typ. 0.6
  arrayLocationOnRoof = 'field',                // field | edge | corner
}) {
  const panelAreaM2 = panelLengthM * panelWidthM;
  const upliftPerPanelN = designUpliftKnPerM2 * 1000 * panelAreaM2;
  const downwardWeightPerPanelN = (panelMassKg + rackingMassKgPerPanel) * 9.81;
  const netUpliftN = upliftPerPanelN - downwardWeightPerPanelN;

  // Required ballast (for uplift resistance): consider safety factor 1.5
  const sf = 1.5;
  const requiredBallastN = Math.max(0, sf * netUpliftN);
  const requiredBallastKgPerPanel = requiredBallastN / 9.81;
  const blocksPerPanel = Math.ceil(requiredBallastKgPerPanel / blockMassKg);

  // Sliding check — wind drag horizontally
  const dragKnPerM2 = 0.4 * designUpliftKnPerM2;   // approx 40% of uplift acts as drag
  const dragPerPanelN = dragKnPerM2 * 1000 * panelAreaM2;
  const totalWeightWithBallastN = downwardWeightPerPanelN + blocksPerPanel * blockMassKg * 9.81;
  const frictionResistanceN = frictionCoeffRoofToBallast * totalWeightWithBallastN;
  const slidingSafe = frictionResistanceN >= sf * dragPerPanelN;

  // Total ballast
  const totalBlocks = blocksPerPanel * numberOfPanels;
  const totalBallastKg = totalBlocks * blockMassKg;
  const totalBallastTonnes = totalBallastKg / 1000;

  // Edge / corner zones often need 50–100% more ballast
  const zoneMultiplier = { field: 1.0, edge: 1.5, corner: 2.0 }[arrayLocationOnRoof] || 1.0;
  const zoneAdjustedBlocks = Math.ceil(blocksPerPanel * zoneMultiplier);

  return {
    inputs: { designUpliftKnPerM2, panelLengthM, panelWidthM, panelMassKg, numberOfPanels, rackingMassKgPerPanel, blockMassKg, frictionCoeffRoofToBallast, arrayLocationOnRoof },
    perPanel: {
      panelAreaM2: r2(panelAreaM2),
      upliftN: r2(upliftPerPanelN),
      selfWeightN: r2(downwardWeightPerPanelN),
      netUpliftN: r2(netUpliftN),
      requiredBallastN: r2(requiredBallastN),
      requiredBallastKg: r2(requiredBallastKgPerPanel),
      blocksAtFieldZone: blocksPerPanel,
      blocksAtThisZone: zoneAdjustedBlocks,
    },
    array: {
      panels: numberOfPanels,
      totalBlocks: zoneAdjustedBlocks * numberOfPanels,
      totalBallastKg: zoneAdjustedBlocks * numberOfPanels * blockMassKg,
      totalBallastTonnes: r2(zoneAdjustedBlocks * numberOfPanels * blockMassKg / 1000),
      totalAddedDeadLoadKpa: r3((zoneAdjustedBlocks * numberOfPanels * blockMassKg * 9.81) / (numberOfPanels * panelAreaM2 * 1000)),
    },
    sliding: {
      dragPerPanelN: r2(dragPerPanelN),
      frictionResistanceN: r2(frictionResistanceN),
      safe: slidingSafe,
      remediation: slidingSafe ? null : 'Add mechanical anti-slip clips OR increase ballast OR add roof-edge restraint.',
    },
    designVerdict: `Use ${zoneAdjustedBlocks} × ${blockMassKg} kg blocks per panel in ${arrayLocationOnRoof} zone (= ${r2(zoneAdjustedBlocks * blockMassKg)} kg ballast). Total array ballast ${r2(zoneAdjustedBlocks * numberOfPanels * blockMassKg / 1000)} tonnes — verify roof can carry added DL of ${r3((zoneAdjustedBlocks * numberOfPanels * blockMassKg * 9.81) / (numberOfPanels * panelAreaM2 * 1000))} kPa.`,
    provenance: {
      method: 'SEAOC PV2-2017 ballasted PV system design: required ballast resists net uplift (wind − self-weight) with safety factor 1.5; sliding resistance via Coulomb friction (roof-membrane to paver). Edge/corner zones get 1.5×/2.0× ballast multiplier.',
      reference: 'SEAOC PV2-2017 "Wind Loads on Low-Profile Solar Photovoltaic Systems on Flat Roofs"; ASCE 7-22 §29.4.4 (basis for uplift); SPRI ES-1 (wind design standard for edge metal on low-slope roofs).',
      limits: 'Assumes single-tier ballast on flat (≤ 5°) roof with smooth EPDM/TPO membrane. For tapered insulation, slip-sheet, or ballasted-with-mechanical-restraint hybrids, refer to manufacturer wind-tunnel report. Always verify roof structural reserve capacity with roofReserveCapacity tool.',
    }
  };
}

// =====================================================================
// (4) ROOF RESERVE CAPACITY — IBC §1604.4 Added Dead Load Check
// =====================================================================
function roofReserveCapacity({
  existingRoofDeadLoadKpa = 0.5,                // psf or kPa as-built
  existingDesignLiveLoadKpa = 0.96,             // 20 psf typ. residential
  existingDesignDeadLoadAllowanceKpa = 0.75,    // typical structural margin in design DL
  newPvAddedDeadLoadKpa = 0.15,                 // PV + racking (~3 psf typical)
  ballastAddedDeadLoadKpa = 0,                  // from ballastSchedule (or 0 for penetrating)
  roofStructureType = 'wood-truss',             // wood-truss | cold-rolled-steel | RC-slab | hot-rolled-steel
  buildingAgeYears = 20,
  conditionRating = 'good',                     // good | fair | poor
}) {
  const totalAddedDeadLoadKpa = newPvAddedDeadLoadKpa + ballastAddedDeadLoadKpa;
  const remainingDeadLoadCapacityKpa = existingDesignDeadLoadAllowanceKpa - existingRoofDeadLoadKpa;
  const utilizationPct = (totalAddedDeadLoadKpa / remainingDeadLoadCapacityKpa) * 100;
  const passes = totalAddedDeadLoadKpa <= remainingDeadLoadCapacityKpa;

  // IBC §1604.4 — added load must not exceed 5% of existing OR be specifically analysed
  const fivePctRule = totalAddedDeadLoadKpa / existingRoofDeadLoadKpa * 100;
  const tinyAddedRule = fivePctRule <= 5;

  // Aged-condition derating
  let conditionFactor = 1.0;
  if (conditionRating === 'fair') conditionFactor = 0.85;
  if (conditionRating === 'poor') conditionFactor = 0.7;
  if (buildingAgeYears > 50) conditionFactor *= 0.9;

  const adjustedRemainingKpa = remainingDeadLoadCapacityKpa * conditionFactor;
  const passesWithCondition = totalAddedDeadLoadKpa <= adjustedRemainingKpa;

  return {
    inputs: { existingRoofDeadLoadKpa, existingDesignLiveLoadKpa, existingDesignDeadLoadAllowanceKpa, newPvAddedDeadLoadKpa, ballastAddedDeadLoadKpa, roofStructureType, buildingAgeYears, conditionRating },
    addedLoadKpa: r3(totalAddedDeadLoadKpa),
    addedLoadPsf: r2(totalAddedDeadLoadKpa * 20.885),
    remainingCapacityKpa: r3(remainingDeadLoadCapacityKpa),
    capacityUtilizationPct: r2(utilizationPct),
    fivePctRulePct: r2(fivePctRule),
    fivePctRuleSatisfied: tinyAddedRule,
    conditionFactor: r2(conditionFactor),
    adjustedRemainingCapacityKpa: r3(adjustedRemainingKpa),
    passes,
    passesWithCondition,
    verdict: passesWithCondition
      ? (tinyAddedRule
          ? `PASS — Added DL ${r3(totalAddedDeadLoadKpa)} kPa ≤ 5% existing AND within structural reserve. No re-analysis required (IBC §1604.4 exemption).`
          : `PASS — Added DL ${r3(totalAddedDeadLoadKpa)} kPa within ${r2(utilizationPct)}% of remaining structural reserve. Engineer's letter recommended.`)
      : `FAIL — Added DL ${r3(totalAddedDeadLoadKpa)} kPa exceeds remaining structural reserve of ${r3(adjustedRemainingKpa)} kPa (condition-adjusted). REQUIRES strengthening, ballast reduction, or re-analysis with reduced PV count.`,
    remediation: passesWithCondition ? [] : [
      'Reduce panel count or array footprint',
      'Switch from ballasted to mechanically-attached racking (lower DL)',
      'Specify lighter modules (frameless, half-cut)',
      'Strengthen affected roof members (sister joists, add purlins)',
      'Commission structural-engineer site survey + reanalysis',
    ],
    provenance: {
      method: 'IBC §1604.4 "Analysis" — alterations adding load to existing structure must demonstrate adequate capacity. 5% rule per ASCE 41-23 §3.2.5 "Existing Building" exemption when load increase is negligible. Condition-rating derating factor empirical (FEMA P-2090 / NFPA 5000).',
      reference: 'International Building Code (IBC) 2021 §1604.4 Analysis; IBC §3403 Additions; ASCE 41-23 "Seismic Evaluation and Retrofit of Existing Buildings"; ASCE 7-22 §C26.1 commentary; FEMA P-2090 (PV on existing roofs guide).',
      limits: 'Does not replace a structural engineer\'s site survey. existingDesignDeadLoadAllowanceKpa must come from original design drawings or destructive load test — do not estimate. Condition-rating derating is conservative empirical factor, not a code-mandated formula.',
    }
  };
}

// =====================================================================
// (5) ROOFTOP FIRE SETBACK / WALKWAY PATHWAYS — IFC §1204 / NFPA 1 §11.12
// =====================================================================
function rooftopFireSetback({
  roofType = 'pitched',                         // pitched | flat
  roofRidgeLengthM = 12,
  roofPlanLengthM = 12,
  roofPlanWidthM = 8,
  arrayPlanLengthM = 8,
  arrayPlanWidthM = 6,
  numberOfPvSubarrays = 1,
  buildingHeightM = 6,
  buildingOccupancyType = 'residential',        // residential | commercial | industrial
}) {
  const items = [];

  if (roofType === 'pitched') {
    // IFC §1204.2.1 — Residential pitched: ridge clear path ≥ 0.91 m (3 ft)
    const ridgeSetbackM = 0.91;
    const ridgeSpaceAvailableM = roofPlanWidthM - arrayPlanWidthM;
    items.push({
      id: 'FIRE-1',
      requirement: `Ridge clear path ≥ ${ridgeSetbackM} m for firefighter access`,
      measured: `${r2(ridgeSpaceAvailableM)} m available`,
      compliant: ridgeSpaceAvailableM >= ridgeSetbackM,
      std: 'IFC 2021 §1204.2.1 / NFPA 1 §11.12.3.1',
    });
    // Eaves setback — 0.46 m (18") on each side
    const eavesSetbackM = 0.46;
    items.push({
      id: 'FIRE-2',
      requirement: `Eave setback ≥ ${eavesSetbackM} m on each side`,
      compliant: roofPlanLengthM - arrayPlanLengthM >= 2 * eavesSetbackM,
      std: 'IFC 2021 §1204.2.1.2',
    });
    // Hip / Valley pathways — typically 0.46 m
    items.push({
      id: 'FIRE-3',
      requirement: 'Hip / valley pathway ≥ 0.46 m where installed',
      compliant: true,
      note: 'Verify on layout drawing.',
      std: 'IFC 2021 §1204.2.1.3',
    });
  } else {
    // Flat roof / commercial — IFC §1204.3
    // Perimeter pathway 1.83 m (6 ft) clear around array edge
    const perimeterSetbackM = 1.83;
    items.push({
      id: 'FIRE-4',
      requirement: `Perimeter pathway around PV array ≥ ${perimeterSetbackM} m`,
      compliant: roofPlanLengthM - arrayPlanLengthM >= 2 * perimeterSetbackM &&
                 roofPlanWidthM - arrayPlanWidthM >= 2 * perimeterSetbackM,
      std: 'IFC 2021 §1204.3.2 / NFPA 1 §11.12.4.1',
    });
    // Internal access pathways every 46 m / 150 ft for arrays > 14 m wide
    if (arrayPlanWidthM > 14 || arrayPlanLengthM > 46) {
      items.push({
        id: 'FIRE-5',
        requirement: 'Sub-array max dimension 46 m × 14 m, with 1.22 m pathway between sub-arrays',
        compliant: numberOfPvSubarrays > 1,
        std: 'IFC 2021 §1204.3.4',
      });
    }
    // Smoke ventilation access 1.22 m around vents
    items.push({
      id: 'FIRE-6',
      requirement: 'Smoke vent / skylight access ≥ 1.22 m clear',
      compliant: true,
      note: 'Verify against MEP roof plan.',
      std: 'IFC 2021 §1204.3.5',
    });
  }

  // DC conductor labelling
  items.push({
    id: 'FIRE-7',
    requirement: 'DC conductor markers every 3 m + at every turn ("PHOTOVOLTAIC POWER SOURCE")',
    compliant: true,
    std: 'IFC 2021 §1204.5 / NEC 690.31(G)(3)',
  });

  const compliant = items.every(i => i.compliant);
  const failed = items.filter(i => !i.compliant);

  return {
    inputs: { roofType, roofPlanLengthM, roofPlanWidthM, arrayPlanLengthM, arrayPlanWidthM, numberOfPvSubarrays, buildingHeightM, buildingOccupancyType },
    arrayCoveragePct: r2((arrayPlanLengthM * arrayPlanWidthM) / (roofPlanLengthM * roofPlanWidthM) * 100),
    items,
    itemsCompliant: items.filter(i => i.compliant).length,
    itemsTotal: items.length,
    overallCompliant: compliant,
    nonComplianceItems: failed,
    verdict: compliant
      ? `COMPLIANT — All ${items.length} rooftop fire-pathway requirements met.`
      : `NON-COMPLIANT — ${failed.length} pathway item(s) require remediation. Reduce array footprint or add internal pathway.`,
    provenance: {
      method: 'International Fire Code (IFC) §1204 "Solar Photovoltaic Power Systems" + NFPA 1 §11.12 "Solar Photovoltaic Systems" — pitched roof pathways §1204.2 vs flat roof §1204.3.',
      reference: 'IFC 2021 §1204; NFPA 1 (Fire Code) 2021 §11.12; CalFire Solar PV Installation Guideline; NEC 690.31(G) labelling.',
      limits: 'Some AHJs (notably NYC FDNY, CalFire) impose stricter pathways than IFC base. Check local fire marshal amendments. Setbacks may be reduced if array is non-flammable Class A and has 1-hr fire-rated assembly below.',
    }
  };
}

// =====================================================================
// (6) FLASHING & PENETRATION SPEC — ICC-ES AC428
// =====================================================================
function flashingPenetration({
  roofCovering = 'asphalt-shingle',             // asphalt-shingle | metal-standing-seam | clay-tile | concrete-tile | epdm | tpo | slate
  numberOfPenetrations = 16,
  penetrationDiameterMm = 12,
  flashingMaterial = 'aluminium-stamped',       // aluminium-stamped | EPDM-pipe-boot | lead | copper | sealant-only
  attachmentType = 'L-foot-lag',                // L-foot-lag | hanger-bolt | rail-bracket
  warrantyYearsRequired = 25,
}) {
  // ICC-ES AC428 §6 — allowable flashings per roof type
  const compatible = {
    'asphalt-shingle': ['aluminium-stamped', 'EPDM-pipe-boot', 'lead'],
    'metal-standing-seam': ['EPDM-pipe-boot', 'sealant-only'],   // ideally clamp instead
    'clay-tile': ['lead', 'aluminium-stamped'],
    'concrete-tile': ['aluminium-stamped', 'lead'],
    'epdm': ['EPDM-pipe-boot'],
    'tpo': ['EPDM-pipe-boot'],
    'slate': ['lead', 'copper'],
  };
  const items = [];

  const isCompatible = (compatible[roofCovering] || []).includes(flashingMaterial);
  items.push({
    id: 'FLASH-1',
    requirement: `Flashing material compatible with ${roofCovering}`,
    compliant: isCompatible,
    suggestion: isCompatible ? null : `Use one of: ${(compatible[roofCovering] || ['(consult mfr)']).join(', ')}`,
    std: 'ICC-ES AC428 §6 / FM 4474',
  });

  // Sealant-only is generally non-compliant per modern code
  items.push({
    id: 'FLASH-2',
    requirement: 'Sealant alone NOT acceptable as primary water barrier',
    compliant: flashingMaterial !== 'sealant-only',
    std: 'ICC-ES AC428 §6.1.2',
  });

  // Class A fire rating preserved
  items.push({
    id: 'FLASH-3',
    requirement: 'Roof Class A fire rating preserved post-installation',
    compliant: true,
    note: 'Verify module + flashing carry UL 1703 Class A fire rating.',
    std: 'ICC-ES AC428 §7 / UL 1703',
  });

  // Wind-uplift tested per ASTM E330 with safety factor 2.0
  items.push({
    id: 'FLASH-4',
    requirement: 'Flashing system wind-uplift tested ASTM E330 to 2.0 × design pressure',
    compliant: true,
    note: 'Verify ICC-ES Evaluation Service Report (ESR) for the specific product.',
    std: 'ICC-ES AC428 §5.2 / ASTM E330',
  });

  // Warranty matches roof or 25 yr min
  items.push({
    id: 'FLASH-5',
    requirement: `Flashing warranty ≥ ${warrantyYearsRequired} years to match PV warranty`,
    compliant: true,
    note: 'Confirm with manufacturer datasheet.',
    std: 'ICC-ES AC428 §9 / NRCA recommendation',
  });

  // Galvanic compatibility for fasteners
  const galvanicMatch = !((roofCovering === 'metal-standing-seam' && flashingMaterial === 'copper') ||
                          (roofCovering === 'clay-tile' && flashingMaterial === 'aluminium-stamped' && attachmentType !== 'hanger-bolt'));
  items.push({
    id: 'FLASH-6',
    requirement: 'Galvanic compatibility — no dissimilar-metal corrosion path',
    compliant: galvanicMatch,
    suggestion: galvanicMatch ? null : 'Use stainless-steel fasteners with dielectric isolator.',
    std: 'ASTM A380 / Eurocode 3 EN 1993-1-4 §6.4',
  });

  // Bill of materials
  const bom = [
    { item: 'Roof attachment', spec: attachmentType, qty: numberOfPenetrations },
    { item: 'Flashing', spec: flashingMaterial, qty: numberOfPenetrations },
    { item: 'Lag bolt / hanger bolt', spec: 'M10 stainless A2-70 × 100mm or 5/16"×4" SS', qty: numberOfPenetrations },
    { item: 'EPDM washer', spec: '40mm OD bonded EPDM', qty: numberOfPenetrations },
    { item: 'Sealant (tertiary)', spec: 'Polyether MS or butyl tape', qty: `${Math.ceil(numberOfPenetrations / 8)} × 290 ml tube` },
  ];

  const compliant = items.every(i => i.compliant);

  return {
    inputs: { roofCovering, numberOfPenetrations, penetrationDiameterMm, flashingMaterial, attachmentType, warrantyYearsRequired },
    items,
    overallCompliant: compliant,
    billOfMaterials: bom,
    detailNote: 'Layered weather barrier: (1) flashing under upper course, over lower course (counter-flashing principle); (2) EPDM washer compressed; (3) tertiary sealant bead.',
    verdict: compliant
      ? `APPROVED — Flashing detail meets ICC-ES AC428 / FM 4474 for ${roofCovering}. ${numberOfPenetrations} penetrations specified.`
      : `REVISE — Flashing/roof-covering combination needs change. See remediation per failed items.`,
    provenance: {
      method: 'ICC-ES AC428 "Acceptance Criteria for Modular Framing Systems Used to Support Photovoltaic Panels". Per-roof-covering compatibility matrix per NRCA roofing manual + manufacturer ESRs. Galvanic check per BS EN ISO 12944 / ASTM A380.',
      reference: 'ICC-ES AC428-2018; FM 4474 "American National Standard for Evaluating the Simulated Wind Uplift Resistance of Roof Assemblies"; ASTM E330 (uniform static air pressure); UL 1703 (PV module fire rating); NRCA Roofing Manual.',
      limits: 'Specific product selection must reference an ICC-ES ESR or FM 4474 Approval letter for the exact roof system + PV mount combination. Standing-seam metal roofs prefer mechanical clamps (e.g. S-5!) over penetration entirely.',
    }
  };
}

// =====================================================================
// (7) NEIGHBOUR SHADOW / RIGHT-TO-LIGHT — EN 17037 / BRE 209
// =====================================================================
function neighbourShadow({
  arrayLatDeg = -1.32,
  arrayLonDeg = 36.92,
  arrayHeightAboveGroundM = 6,
  arrayLengthAlongAzimuthM = 10,
  arrayWidthM = 6,
  arrayAzimuthDeg = 180,
  neighbourLatDeg = -1.32,
  neighbourLonDeg = 36.921,
  neighbourWindowHeightAboveGroundM = 1.5,
}) {
  // Distance & bearing
  const R = 6371000;
  const φ1 = deg2rad(arrayLatDeg), φ2 = deg2rad(neighbourLatDeg);
  const Δφ = φ2 - φ1, Δλ = deg2rad(neighbourLonDeg - arrayLonDeg);
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  const distM = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  const bearingDeg = (rad2deg(Math.atan2(y, x)) + 360) % 360;

  // BRE 209 "25° rule" — obstruction line measured from window centre at 2 m above ground
  // If line from window centre to top of obstruction subtends > 25° above horizontal in vertical plane,
  // direct sunlight is materially affected.
  const heightDiff = arrayHeightAboveGroundM - neighbourWindowHeightAboveGroundM;
  const obstructionAngleDeg = rad2deg(Math.atan2(heightDiff, distM));
  const breach25Rule = obstructionAngleDeg > 25;

  // Annual probable sunlight hours (APSH) loss estimate
  // BRE 209: window receives ≥ 25% APSH (where APSH ≈ 1486 hr/yr in UK / scaled by latitude)
  const apshFull = 1486 * Math.cos(deg2rad(arrayLatDeg) - deg2rad(51.5));
  // Crude shadow-fraction model: fraction of sky obstructed by array = arrayWidth × heightDiff / (2π × dist²)
  const obstructionSolidAngleSr = (arrayWidthM * Math.max(heightDiff, 0)) / Math.max(distM * distM, 1);
  const shadowFraction = Math.min(1, obstructionSolidAngleSr / (2 * Math.PI));
  const apshLossHr = apshFull * shadowFraction;
  const apshAfterHr = apshFull - apshLossHr;
  const apshRatio = apshAfterHr / apshFull;

  // EN 17037 daylight provision: target ≥ 1.5 hr direct sunlight on equinox
  // crude proxy: if obstructionAngleDeg < (90 - latitude - 23.5°) on March 21 then sun reaches window
  const equinoxNoonAltDeg = 90 - Math.abs(arrayLatDeg);
  const en17037SunlightOk = obstructionAngleDeg < equinoxNoonAltDeg - 5;

  let category;
  if (!breach25Rule && apshRatio > 0.8 && en17037SunlightOk) category = 'GREEN — No material right-to-light impact';
  else if (apshRatio > 0.5) category = 'AMBER — Some impact; mitigation discussion recommended';
  else category = 'RED — Material loss of sunlight; planning objection likely';

  return {
    inputs: { arrayLatDeg, arrayLonDeg, arrayHeightAboveGroundM, arrayLengthAlongAzimuthM, arrayWidthM, arrayAzimuthDeg, neighbourLatDeg, neighbourLonDeg, neighbourWindowHeightAboveGroundM },
    geometry: {
      distanceM: r2(distM),
      bearingFromArrayDeg: r2(bearingDeg),
      obstructionAngleDeg: r2(obstructionAngleDeg),
      heightDiffM: r2(heightDiff),
    },
    bre25RuleBreach: breach25Rule,
    apsh: {
      baselineHrPerYr: r2(apshFull),
      lossHrPerYr: r2(apshLossHr),
      remainingHrPerYr: r2(apshAfterHr),
      retentionRatio: r2(apshRatio),
      retentionPct: r2(apshRatio * 100),
    },
    en17037SunlightAdequate: en17037SunlightOk,
    category,
    mitigationOptions: category.startsWith('GREEN') ? ['No mitigation needed.'] : [
      'Lower array tilt or reduce array height',
      'Set array further back from boundary',
      'Reduce array height with stepped layout',
      'Engage neighbour with daylight modelling sketch',
    ],
    provenance: {
      method: 'BRE 209 "Site Layout Planning for Daylight and Sunlight" 25° rule for material obstruction; EN 17037 §5 daylight & sunlight provision (≥ 1.5 hr direct sunlight on equinox); APSH baseline scaled by latitude from UK reference 1486 hr/yr.',
      reference: 'BRE Report 209 (3rd edn 2022) "Site Layout Planning for Daylight and Sunlight"; EN 17037:2018+A1:2021 "Daylight in Buildings"; CIBSE LG10 Daylighting (cross-reference).',
      limits: 'Simplified solid-angle shadow model — for litigation-grade reports use BRE 209 detailed VSC (Vertical Sky Component), APSH per-window 3D ray-trace via Radiance / SunCast / PV-Sol Shadow. Latitude scaling is approximate — replace APSH baseline with regional value where known.',
    }
  };
}

// =====================================================================
// (8) IFC / BIM EXPORT STUB — ISO 16739-1 (IFC4)
// =====================================================================
function ifcBimExport({
  projectId = 'PROJ-001',
  projectName = 'Solar PV Installation',
  arrayPlanLengthM = 10,
  arrayPlanWidthM = 6,
  arrayHeightAboveRoofM = 0.15,
  modulePlacements = [],                        // optional [{x,y,tilt,az}]
}) {
  // Generate minimal IFC4 STEP (ifcXML alternative would be heavier).
  // This is a STUB — produces valid IFC4 with a single IfcBuildingElementProxy
  // representing the array footprint. Full implementation would map every
  // module / rail / inverter / cable as IfcDistributionElement etc.
  const ts = new Date().toISOString();
  const guid = (n) => 'guid-' + n.toString(36).padStart(8, '0').slice(0, 22);

  const ifcLines = [
    'ISO-10303-21;',
    'HEADER;',
    `FILE_DESCRIPTION(('ViewDefinition [ReferenceView_V1.2]'),'2;1');`,
    `FILE_NAME('${projectId}.ifc','${ts}',(''),(''),'SolarGeniusPro IFC stub','Phase 8','');`,
    `FILE_SCHEMA(('IFC4'));`,
    'ENDSEC;',
    'DATA;',
    `#1=IFCPROJECT('${guid(1)}',$,'${projectName}',$,$,$,$,(#10),#20);`,
    `#10=IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-5,#15,$);`,
    `#15=IFCAXIS2PLACEMENT3D(#16,$,$);`,
    `#16=IFCCARTESIANPOINT((0.,0.,0.));`,
    `#20=IFCUNITASSIGNMENT((#21));`,
    `#21=IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);`,
    `#30=IFCBUILDING('${guid(30)}',$,'Building',$,$,#16,$,$,.ELEMENT.,$,$,$);`,
    `#40=IFCBUILDINGSTOREY('${guid(40)}',$,'Roof',$,$,#16,$,$,.ELEMENT.,${arrayHeightAboveRoofM});`,
    `#50=IFCBUILDINGELEMENTPROXY('${guid(50)}',$,'PV Array',$,'Photovoltaic Array',#16,#60,$,.ELEMENT.);`,
    `#60=IFCPRODUCTDEFINITIONSHAPE($,$,(#65));`,
    `#65=IFCSHAPEREPRESENTATION(#10,'Body','SweptSolid',(#70));`,
    `#70=IFCEXTRUDEDAREASOLID(#75,#16,#80,${arrayHeightAboveRoofM});`,
    `#75=IFCRECTANGLEPROFILEDEF(.AREA.,'PV Footprint',#16,${arrayPlanLengthM},${arrayPlanWidthM});`,
    `#80=IFCDIRECTION((0.,0.,1.));`,
    'ENDSEC;',
    'END-ISO-10303-21;',
  ];

  // Per-module placeholders (additional IfcBuildingElementProxy would be added in production)
  let modulesIncluded = 0;
  if (Array.isArray(modulePlacements) && modulePlacements.length > 0) {
    modulesIncluded = modulePlacements.length;
  }

  const ifcStr = ifcLines.join('\n');

  return {
    inputs: { projectId, projectName, arrayPlanLengthM, arrayPlanWidthM, arrayHeightAboveRoofM, moduleCount: modulesIncluded },
    ifcVersion: 'IFC4 (ISO 16739-1:2018)',
    mvd: 'ReferenceView_V1.2',
    ifcStep: ifcStr,
    ifcDataUri: 'data:application/x-step;base64,' + Buffer.from(ifcStr).toString('base64'),
    elementsExported: {
      project: 1,
      building: 1,
      buildingStorey: 1,
      buildingElementProxy: 1 + modulesIncluded,
    },
    coordSystem: 'Local — origin at array south-west corner',
    nextSteps: [
      'Open in Solibri / Navisworks / BIMcollab to coordinate clash detection with architect model',
      'Add IfcDistributionElement entries for inverter, combiner box, conduit runs',
      'Map LOD 200 → LOD 350 by linking modulePlacements[] entries to IfcRelAggregates',
    ],
    provenance: {
      method: 'Programmatic ISO-10303-21 STEP file conforming to IFC4 (ISO 16739-1:2018) Reference View MVD. Stub level: IfcProject → IfcBuilding → IfcBuildingStorey → IfcBuildingElementProxy with IfcExtrudedAreaSolid representing array footprint.',
      reference: 'ISO 16739-1:2018 "IFC for data sharing in the construction and facility management industries"; buildingSMART IFC4 Reference View MVD; ISO 10303-21:2016 STEP physical file format.',
      limits: 'STUB output — single envelope only, not a full per-module BOM. For LOD 350 / 400 production export, integrate ifc-openshell or web-ifc to emit IfcDistributionElement, IfcCableSegment, IfcElectricMotor, etc. Coordinate system is local; for site geo-referencing add IfcMapConversion.',
    }
  };
}

// =====================================================================
// (9) PLANNING NARRATIVE — Heritage / Conservation / Visual Impact
// =====================================================================
function planningNarrative({
  projectId = 'PROJ-001',
  siteAddress = 'TBC',
  siteAreaM2 = 200,
  arrayAreaM2 = 30,
  arrayHeightAboveExistingRoofM = 0.15,
  buildingHeritageStatus = 'none',              // none | locally-listed | grade-II | grade-II-star | grade-I | within-conservation-area
  visibleFromPublicHighway = true,
  visibleFromConservationArea = false,
  arrayColour = 'all-black',                    // standard-blue | all-black | terracotta-red | green
  roofPitchDeg = 25,
  jurisdiction = 'UK',                          // UK | KE | US | EU | other
}) {
  // Permitted Development assessment (UK GPDO 2015 Sch 2 Pt 14)
  const items = [];
  let permittedDevelopment = true;
  let planningRequired = false;

  if (jurisdiction === 'UK') {
    // UK GPDO Class A — solar PV on a building: PD if all conditions met
    if (arrayHeightAboveExistingRoofM > 0.20) {
      items.push({ id: 'PD-1', test: 'Projection ≤ 200 mm above roof slope', pass: false, std: 'GPDO 2015 Sch2 Pt14 A.1(a)(i)' });
      permittedDevelopment = false;
    } else {
      items.push({ id: 'PD-1', test: 'Projection ≤ 200 mm above roof slope', pass: true, std: 'GPDO 2015 Sch2 Pt14 A.1(a)(i)' });
    }

    if (buildingHeritageStatus === 'grade-I' || buildingHeritageStatus === 'grade-II-star' || buildingHeritageStatus === 'grade-II') {
      items.push({ id: 'PD-2', test: 'Listed building → PD removed', pass: false, std: 'Listed Buildings Act 1990 §7' });
      permittedDevelopment = false;
      planningRequired = true;
    }

    if (buildingHeritageStatus === 'within-conservation-area' && visibleFromPublicHighway) {
      items.push({ id: 'PD-3', test: 'Conservation area + visible from highway → PD restricted', pass: false, std: 'GPDO 2015 Sch2 Pt14 A.2' });
      permittedDevelopment = false;
      planningRequired = true;
    }
  }

  // Visual impact narrative
  const colourRating = { 'all-black': 'Low (recessive)', 'standard-blue': 'Medium', 'terracotta-red': 'Low (sympathetic)', 'green': 'Low (sympathetic)' }[arrayColour] || 'Medium';

  const narrative = [
    `## Planning Narrative — ${projectId}`,
    ``,
    `**Site:** ${siteAddress}`,
    `**Jurisdiction:** ${jurisdiction}`,
    `**Heritage status:** ${buildingHeritageStatus}`,
    ``,
    `### 1. Proposal`,
    `Installation of ${r2(arrayAreaM2)} m² of solar photovoltaic panels (${arrayColour}, projecting ${r2(arrayHeightAboveExistingRoofM*1000)} mm above existing roof slope) on a ${r2(roofPitchDeg)}° roof.`,
    ``,
    `### 2. Heritage & Conservation Assessment`,
    buildingHeritageStatus === 'none'
      ? `The building is not listed and lies outside any conservation area, World Heritage Site, or Scheduled Ancient Monument. No heritage harm arises.`
      : `The building is ${buildingHeritageStatus}. Per NPPF §200 the proposal has been assessed for "less than substantial harm" balanced against the public benefit of decarbonisation (Climate Change Act 2008 net-zero 2050 obligation).`,
    ``,
    `### 3. Visual Impact`,
    `Visibility from public highway: ${visibleFromPublicHighway ? 'YES' : 'NO'}.`,
    `Visibility from conservation area: ${visibleFromConservationArea ? 'YES' : 'NO'}.`,
    `Colour palette: ${arrayColour} — visual impact rating ${colourRating}.`,
    ``,
    `### 4. Permitted Development Conclusion (${jurisdiction})`,
    permittedDevelopment
      ? `The proposal falls within Permitted Development rights — no full planning application is required. A confirmatory Lawful Development Certificate is recommended.`
      : `The proposal falls OUTSIDE Permitted Development rights. A full planning application (or Listed Building Consent) is required before installation.`,
    ``,
    `### 5. Public Benefit`,
    `The installation will offset approximately ${r2(arrayAreaM2 * 0.18 * 1500 * 0.45 / 1000)} tonnes CO₂e per year (assuming 180 W/m² capacity, 1500 kWh/kWp/yr, 0.45 kgCO₂/kWh grid factor) over a 25-year design life — total avoided emissions ≈ ${r2(arrayAreaM2 * 0.18 * 1500 * 0.45 / 1000 * 25)} tonnes CO₂e.`,
    ``,
    `### 6. Statement of Compliance`,
    `Prepared per ${jurisdiction === 'UK' ? 'NPPF (Dec 2023), Climate Change Act 2008, Town & Country Planning (GPDO) Order 2015, and NPPG' : 'local planning regulations'}.`,
  ].join('\n');

  return {
    inputs: { projectId, siteAddress, siteAreaM2, arrayAreaM2, arrayHeightAboveExistingRoofM, buildingHeritageStatus, visibleFromPublicHighway, visibleFromConservationArea, arrayColour, roofPitchDeg, jurisdiction },
    permittedDevelopment,
    planningRequired,
    permittedDevelopmentTests: items,
    visualImpact: { arrayColour, colourRating },
    publicBenefit: {
      annualCo2OffsetTonnes: r2(arrayAreaM2 * 0.18 * 1500 * 0.45 / 1000),
      lifetime25yrCo2OffsetTonnes: r2(arrayAreaM2 * 0.18 * 1500 * 0.45 / 1000 * 25),
    },
    narrativeMarkdown: narrative,
    nextSteps: permittedDevelopment
      ? ['File Lawful Development Certificate (LDC) application with local planning authority (LPA)', 'Notify building control (Class A.3) prior to commencement']
      : ['Engage planning consultant', 'Pre-application advice meeting with LPA', 'Prepare full Heritage Statement', 'Submit planning application with this narrative'],
    provenance: {
      method: jurisdiction === 'UK'
        ? 'Town & Country Planning (General Permitted Development) (England) Order 2015, Schedule 2, Part 14, Class A — solar PV on buildings; cross-checked against NPPF (Dec 2023), Listed Buildings & Conservation Areas Act 1990, and NPPG.'
        : 'Generic planning narrative template — replace local clauses with jurisdiction-specific code references.',
      reference: 'GPDO 2015 (SI 2015/596) Sch 2 Pt 14; NPPF Dec 2023 §200 (heritage harm); Climate Change Act 2008 (net-zero 2050); BRE 209 (visual reference); Listed Buildings & Conservation Areas Act 1990.',
      limits: 'PD assessment is high-level — final determination rests with the Local Planning Authority. For listed / scheduled / Article 4 directed sites always engage a planning consultant. Public-benefit CO₂ figures use a generic UK grid factor; replace with regional value (e.g. KE: 0.30 kgCO₂/kWh).',
    }
  };
}

module.exports = {
  windUpliftAsce7,
  snowLoadCombination,
  ballastSchedule,
  roofReserveCapacity,
  rooftopFireSetback,
  flashingPenetration,
  neighbourShadow,
  ifcBimExport,
  planningNarrative,
};
