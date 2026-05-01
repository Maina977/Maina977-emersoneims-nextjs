// ═══════════════════════════════════════════════════════════════════
// FIELD CALIBRATION ENGINE
// Accepts field data (ERT, pump test, lab results, drilling logs)
// and recalibrates desktop predictions → boosts confidence to 90-98%
//
// Architecture: Desktop prediction → Field measurement → Delta → Calibration
// This is the AI+Field feedback that makes the system bankable.
// ═══════════════════════════════════════════════════════════════════

import type { FieldValidationData, AnalysisResult } from './types';

export interface CalibrationResult {
  /** Calibrated depth (field-confirmed or field-adjusted) */
  calibratedDepth_m: number;
  depthDelta_m: number;              // field - desktop prediction
  depthAccuracyPct: number;          // how close was desktop prediction

  /** Calibrated yield */
  calibratedYield_m3h: number;
  yieldDelta_m3h: number;
  yieldAccuracyPct: number;

  /** Calibrated water quality */
  calibratedWaterQuality?: {
    pH: number;
    tds: number;
    iron: number;
    fluoride: number;
    arsenic: number;
    nitrate: number;
    turbidity: number;
    coliform: number;
    hardness: number;
    isPotable: boolean;
    treatmentRequired: string[];
    source: 'LABORATORY';
  };

  /** Aquifer parameters (from pump test) */
  aquiferParameters?: {
    transmissivity_m2day: number;
    storativity: number;
    specificCapacity_m2hr: number;
    hydraulicConductivity_m_day: number;
    aquiferThickness_m: number;
    aquiferType: 'confined' | 'unconfined' | 'semi-confined';
    sustainableYield_m3hr: number;
    safeDrawdown_m: number;
  };

  /** Calibrated confidence — field data pushes this above 85% desktop cap */
  confidence: number;
  confidenceTier: 'BANKABLE' | 'ENGINEERING_GRADE' | 'PRE_FEASIBILITY' | 'DESKTOP_SCREENING';

  /** What field data was used */
  fieldDataSources: string[];
  calibrationNotes: string[];

  /** Assessment upgrade */
  assessmentType: 'FIELD_VALIDATED' | 'DESKTOP_ESTIMATE';
  reportLevel: 1 | 2 | 3;            // 1=AI only, 2=AI+ERT, 3=Bankable
}

export interface DrillingOutcome {
  /** Post-drilling actual results — for feedback loop */
  boreholeId: string;
  drillDate: string;
  location: { lat: number; lon: number };

  /** Desktop predictions (for comparison) */
  predictedDepth_m: number;
  predictedYield_m3h: number;
  predictedProbability: number;

  /** Actual results */
  actualDepth_m: number;
  actualYield_m3h: number;
  success: boolean;                   // Did we find water?

  /** Drilling log */
  lithologyLog?: {
    from_m: number;
    to_m: number;
    description: string;
    waterStrike?: boolean;
  }[];

  /** Pump test results */
  pumpTest?: FieldValidationData['pumpTest'];

  /** Lab results */
  labAnalysis?: FieldValidationData['labWaterAnalysis'];

  /** Cost data */
  actualCost?: number;
  currency?: string;

  /** Geophysical methods used (for per-method accuracy tracking) */
  geophysicalMethodsUsed?: string[];
}

/**
 * Calibrate desktop predictions using field data.
 * Each field data type pushes confidence higher:
 *  - ERT survey: +8-12% confidence (confirms aquifer geometry)
 *  - Pump test: +10-15% confidence (confirms yield + aquifer params)
 *  - Lab analysis: +5-8% confidence (confirms water quality)
 *  - Local boreholes: +3-5% confidence (confirms regional patterns)
 */
export function calibrateWithFieldData(
  desktopResult: AnalysisResult,
  fieldData: FieldValidationData,
): CalibrationResult {
  const notes: string[] = [];
  const sources: string[] = [];
  let confidenceBoost = 0;

  // Start with desktop predictions
  let calDepth = desktopResult.recommendedDepth;
  let calYield = desktopResult.estimatedYield;
  let reportLevel: CalibrationResult['reportLevel'] = 1;

  // ═══ ERT SURVEY CALIBRATION ═══
  if (fieldData.ertSurvey) {
    const ert = fieldData.ertSurvey;
    sources.push(`ERT survey (${ert.contractor}, ${ert.surveyDate})`);

    // ERT confirms aquifer depth — replace desktop estimate
    calDepth = ert.aquiferDepthM + ert.aquiferThicknessM * 0.5; // Drill to middle of aquifer
    const depthDelta = Math.abs(desktopResult.recommendedDepth - ert.aquiferDepthM);
    const depthAccuracy = 1 - (depthDelta / Math.max(desktopResult.recommendedDepth, ert.aquiferDepthM));

    notes.push(`ERT aquifer depth: ${ert.aquiferDepthM}m (desktop predicted ${desktopResult.recommendedDepth}m, delta ${depthDelta.toFixed(1)}m, ${(depthAccuracy * 100).toFixed(0)}% accurate)`);
    notes.push(`ERT aquifer thickness: ${ert.aquiferThicknessM}m, resistivity: ${ert.resistivityOhmM} Ω·m`);

    // Resistivity → rock type validation
    if (ert.resistivityOhmM > 1000) notes.push('High resistivity → fresh bedrock / dry zone');
    else if (ert.resistivityOhmM > 100) notes.push('Moderate resistivity → fractured/weathered rock (promising)');
    else if (ert.resistivityOhmM > 10) notes.push('Low resistivity → saturated zone / clay (good if thick)');
    else notes.push('Very low resistivity → clay / saline water (caution)');

    // Yield adjustment from aquifer thickness
    if (ert.aquiferThicknessM > 20) calYield *= 1.3;
    else if (ert.aquiferThicknessM > 10) calYield *= 1.1;
    else if (ert.aquiferThicknessM < 5) calYield *= 0.6;

    confidenceBoost += 10;
    reportLevel = 2;
  }

  // ═══ PUMP TEST CALIBRATION ═══
  if (fieldData.pumpTest) {
    const pt = fieldData.pumpTest;
    sources.push(`Pump test (${pt.testDurationHrs}hr, ${pt.testDate})`);

    // Pump test = ground truth for yield
    calYield = pt.sustainableYieldM3Hr;

    // Compute aquifer parameters
    const T = pt.transmissivityM2Day;
    const S = pt.storativity;
    const specificCapacity = calYield / (pt.drawdownM || 1);
    const K = T / (pt.drawdownM * 2 || 30); // rough aquifer thickness estimate

    notes.push(`Pump test yield: ${pt.sustainableYieldM3Hr} m³/hr (desktop predicted ${desktopResult.estimatedYield} m³/hr)`);
    notes.push(`Transmissivity: ${T} m²/day, Storativity: ${S}`);
    notes.push(`Recovery: ${pt.recoveryPercent}% → ${pt.recoveryPercent > 80 ? 'GOOD aquifer (sustainable)' : 'CAUTION: slow recovery'}`);

    confidenceBoost += 12;
    reportLevel = 3;
  }

  // ═══ LAB WATER QUALITY CALIBRATION ═══
  let calibratedWQ: CalibrationResult['calibratedWaterQuality'];
  if (fieldData.labWaterAnalysis) {
    const lab = fieldData.labWaterAnalysis;
    sources.push(`Lab analysis (${lab.labName}, ${lab.sampleDate})`);

    // Lab results = ground truth for water quality
    const treatmentRequired: string[] = [];
    if (lab.iron > 0.3) treatmentRequired.push('Iron removal (aeration + sand filter)');
    if (lab.fluoride > 1.5) treatmentRequired.push('Defluoridation (activated alumina/bone char)');
    if (lab.arsenic > 0.01) treatmentRequired.push('Arsenic removal (activated alumina/iron-based)');
    if (lab.nitrate > 50) treatmentRequired.push('Nitrate removal (ion exchange/RO)');
    if (lab.coliform > 0) treatmentRequired.push('Disinfection (chlorination/UV)');
    if (lab.tds > 1000) treatmentRequired.push('Desalination (RO)');
    if (lab.turbidity > 5) treatmentRequired.push('Turbidity removal (sand filter)');

    calibratedWQ = {
      ...lab,
      isPotable: treatmentRequired.length === 0,
      treatmentRequired,
      source: 'LABORATORY',
    };

    // Compare desktop prediction vs lab reality
    const wqDesktop = desktopResult.waterQuality;
    const tdsDelta = Math.abs(wqDesktop.tds - lab.tds);
    const pHDelta = Math.abs(wqDesktop.pH - lab.pH);
    notes.push(`Lab TDS: ${lab.tds} mg/L (desktop predicted ${wqDesktop.tds}, delta ${tdsDelta.toFixed(0)})`);
    notes.push(`Lab pH: ${lab.pH} (desktop predicted ${wqDesktop.pH}, delta ${pHDelta.toFixed(1)})`);
    if (lab.fluoride > 1.5) notes.push(`⚠ Fluoride ${lab.fluoride} mg/L EXCEEDS WHO limit 1.5 mg/L`);
    if (lab.arsenic > 0.01) notes.push(`⚠ Arsenic ${lab.arsenic} mg/L EXCEEDS WHO limit 0.01 mg/L`);

    confidenceBoost += 6;
  }

  // ═══ LOCAL BOREHOLE RECORDS ═══
  if (fieldData.localBoreholes && fieldData.localBoreholes.count > 0) {
    const lb = fieldData.localBoreholes;
    sources.push(`${lb.count} local boreholes (${lb.dataSource})`);

    // Calibrate depth/yield with local average
    if (!fieldData.ertSurvey) {
      calDepth = calDepth * 0.4 + lb.averageDepthM * 0.6; // Local data dominates
    }
    if (!fieldData.pumpTest) {
      calYield = calYield * 0.3 + lb.averageYieldM3Hr * 0.7;
    }

    notes.push(`Local average depth: ${lb.averageDepthM}m (${lb.count} boreholes, ${(lb.successRate * 100).toFixed(0)}% success)`);
    confidenceBoost += 4;
  }

  // ═══ EM / TDEM SURVEY CALIBRATION ═══
  if (fieldData.emTdemSurvey) {
    const em = fieldData.emTdemSurvey;
    sources.push(`${em.method} survey (${em.contractor}, ${em.surveyDate}, ${em.soundingCount} soundings)`);

    // EM/TDEM confirms conductive (saturated) layers at depth
    if (em.interpretedAquifer) {
      const emAquiferMid = (em.conductiveLayerTopM + em.conductiveLayerBottomM) / 2;
      const emThickness = em.conductiveLayerBottomM - em.conductiveLayerTopM;

      // If no ERT, EM/TDEM becomes primary depth source
      if (!fieldData.ertSurvey) {
        calDepth = emAquiferMid;
        notes.push(`${em.method} aquifer target: ${em.conductiveLayerTopM}–${em.conductiveLayerBottomM}m (thickness ${emThickness.toFixed(0)}m)`);
      } else {
        // Cross-validate ERT with EM
        const ertDepth = fieldData.ertSurvey.aquiferDepthM;
        const delta = Math.abs(ertDepth - em.conductiveLayerTopM);
        if (delta < 5) {
          notes.push(`${em.method} confirms ERT aquifer depth (Δ${delta.toFixed(1)}m) — HIGH confidence`);
          confidenceBoost += 3; // Extra boost for cross-validation
        } else {
          notes.push(`${em.method} vs ERT depth mismatch: ${em.conductiveLayerTopM}m vs ${ertDepth}m (Δ${delta.toFixed(1)}m) — investigate`);
        }
      }

      // Conductivity interpretation
      if (em.conductivity_mS_m > 100) {
        notes.push(`High conductivity ${em.conductivity_mS_m} mS/m → saturated clay or saline water (CAUTION)`);
        calYield *= 0.7;
      } else if (em.conductivity_mS_m > 30) {
        notes.push(`Moderate conductivity ${em.conductivity_mS_m} mS/m → saturated weathered zone (PROMISING)`);
        calYield *= 1.15;
      } else if (em.conductivity_mS_m > 5) {
        notes.push(`Low conductivity ${em.conductivity_mS_m} mS/m → fractured rock with groundwater`);
      } else {
        notes.push(`Very low conductivity ${em.conductivity_mS_m} mS/m → dry/fresh bedrock`);
        calYield *= 0.5;
      }

      // Yield adjustment for deep EM investigation
      if (em.maxDepthM > 100) {
        notes.push(`Deep ${em.method} investigation to ${em.maxDepthM}m — confirms deep aquifer potential`);
      }
    } else {
      notes.push(`${em.method} survey: no clear conductive aquifer layer identified — CAUTION`);
      calYield *= 0.6;
    }

    confidenceBoost += 8; // EM/TDEM comparable to ERT for confidence
    if (reportLevel < 2) reportLevel = 2;
  }

  // ═══ ERT DATA FILE (processed resistivity pseudo-section) ═══
  if (fieldData.ertDataFile) {
    const ef = fieldData.ertDataFile;
    sources.push(`ERT data file: ${ef.fileName} (${ef.format}, ${ef.arrayType}, ${ef.dataPoints} points)`);

    // Statistical analysis of apparent resistivities
    const rhoValues = ef.apparentResistivities.map(d => d.rhoA);
    const avgRho = rhoValues.reduce((a, b) => a + b, 0) / rhoValues.length;
    const minRho = Math.min(...rhoValues);
    const maxRho = Math.max(...rhoValues);

    notes.push(`ERT profile: ${ef.profileLength_m}m long, max depth ${ef.maxDepth_m}m, ${ef.arrayType} array`);
    notes.push(`Resistivity range: ${minRho.toFixed(0)}–${maxRho.toFixed(0)} Ω·m (mean ${avgRho.toFixed(0)} Ω·m)`);

    // Low-resistivity anomaly detection → potential saturated zone
    const lowRhoPoints = rhoValues.filter(r => r < avgRho * 0.5);
    if (lowRhoPoints.length > rhoValues.length * 0.1) {
      const aquiferRho = lowRhoPoints.reduce((a, b) => a + b, 0) / lowRhoPoints.length;
      notes.push(`Low-resistivity anomaly detected (${aquiferRho.toFixed(0)} Ω·m, ${lowRhoPoints.length} points) → potential aquifer`);

      // If no manual ERT survey entered, use file data for depth estimate
      if (!fieldData.ertSurvey) {
        // Approximate aquifer depth from pseudo-depth of low-rho anomalies
        const lowRhoEntries = ef.apparentResistivities.filter(d => d.rhoA < avgRho * 0.5);
        const avgN = lowRhoEntries.reduce((a, d) => a + d.n, 0) / lowRhoEntries.length;
        const estimatedDepth = avgN * ef.electrodeSpacing_m * 0.5; // pseudo-depth approximation
        if (estimatedDepth > 5 && estimatedDepth < 200) {
          calDepth = estimatedDepth;
          notes.push(`ERT file pseudo-depth estimate: ${estimatedDepth.toFixed(0)}m (requires 2D inversion for accuracy)`);
        }
      }
    } else {
      notes.push('No clear low-resistivity anomaly → uniform or dry subsurface');
    }

    confidenceBoost += 6;
    if (reportLevel < 2) reportLevel = 2;
  }

  // ═══ SEISMIC REFRACTION / MASW ═══
  if (fieldData.seismicSurvey) {
    const ss = fieldData.seismicSurvey;
    sources.push(`Seismic ${ss.method} survey (${ss.profileLengthM}m profile, ${ss.layerCount} layers)`);

    // Bedrock depth → hard constraint on maximum aquifer depth
    if (ss.bedrockDepthM > 0) {
      notes.push(`Bedrock at ${ss.bedrockDepthM}m (Vp=${ss.vpBedrock_ms} m/s) → aquifer must be above this`);
      // If desktop predicted deeper than bedrock, correct down
      if (calDepth > ss.bedrockDepthM) {
        calDepth = ss.bedrockDepthM * 0.85; // Target 85% of bedrock depth
        notes.push(`Depth corrected: desktop predicted below bedrock → adjusted to ${calDepth.toFixed(0)}m`);
      }
    }

    // Weathered zone → primary aquifer in crystalline terrains
    if (ss.weatheredZoneThicknessM > 0) {
      notes.push(`Weathered zone: ${ss.weatheredZoneThicknessM}m thick (Vp=${ss.vpTopLayer_ms} m/s)`);
      // Vp < 1500 m/s = unsaturated; 1500-2500 = saturated weathered; >2500 = fresh rock
      if (ss.vpTopLayer_ms >= 1500 && ss.vpTopLayer_ms <= 2500) {
        notes.push('Seismic velocity indicates saturated weathered zone → good aquifer potential');
        calYield *= 1.15; // +15% yield boost for confirmed saturated zone
      } else if (ss.vpTopLayer_ms < 1500) {
        notes.push('Low Vp → dry or partially saturated weathered zone');
      }
    }

    // Fracture zone detection
    if (ss.fractureZoneDepthM != null && ss.fractureZoneThicknessM != null) {
      notes.push(`Fracture zone: ${ss.fractureZoneDepthM}–${ss.fractureZoneDepthM + ss.fractureZoneThicknessM}m`);
      // Fractures in bedrock are high-yield targets
      calDepth = ss.fractureZoneDepthM + ss.fractureZoneThicknessM / 2;
      calYield *= 1.25; // Fracture zones typically yield 25% more
      notes.push(`Targeting fracture zone center at ${calDepth.toFixed(0)}m — high-yield potential`);
    }

    // MASW gives shear wave velocity → rock quality
    if (ss.vsTopLayer_ms != null) {
      const poissonRatio = ss.vpTopLayer_ms && ss.vsTopLayer_ms > 0
        ? (ss.vpTopLayer_ms ** 2 - 2 * ss.vsTopLayer_ms ** 2) / (2 * (ss.vpTopLayer_ms ** 2 - ss.vsTopLayer_ms ** 2))
        : 0.25;
      notes.push(`Poisson's ratio: ${poissonRatio.toFixed(2)} (${poissonRatio > 0.35 ? 'saturated/clay' : poissonRatio > 0.25 ? 'normal' : 'dry/stiff'})`);
    }

    confidenceBoost += 9; // Seismic is excellent for structure
    if (reportLevel < 2) reportLevel = 2;
  }

  // ═══ GROUND PENETRATING RADAR (GPR) ═══
  if (fieldData.gprSurvey) {
    const gpr = fieldData.gprSurvey;
    sources.push(`GPR survey (${gpr.antennaFrequencyMHz} MHz, ${gpr.profileLengthM}m profile)`);

    notes.push(`GPR penetration: ${gpr.maxPenetrationM}m depth`);

    // Water table detection (GPR can see water table as a strong reflector)
    if (gpr.waterTableDepthM != null) {
      notes.push(`Water table detected at ${gpr.waterTableDepthM}m by GPR`);
      // If shallow water table confirmed, adjust depth estimate
      if (gpr.waterTableDepthM < calDepth * 0.5) {
        notes.push(`Shallow water table at ${gpr.waterTableDepthM}m — consider shallow borehole option`);
      }
    }

    // Shallow aquifer
    if (gpr.shallowAquiferDetected) {
      notes.push('GPR detected shallow aquifer zone (strong dielectric contrast)');
      calYield *= 1.1;
    }

    // Clay layer detection (attenuates radar signal)
    if (gpr.clayLayerDepthM != null) {
      notes.push(`Clay layer at ${gpr.clayLayerDepthM}m — may confine aquifer below`);
    }

    // Void detection
    if (gpr.voidDetected) {
      notes.push('Subsurface void detected — potential karst/solution cavity. Approach with caution');
    }

    // Dielectric constant → moisture estimate
    if (gpr.dielectricConstant != null) {
      const moistureEst = gpr.dielectricConstant > 20 ? 'high' : gpr.dielectricConstant > 8 ? 'moderate' : 'low';
      notes.push(`Dielectric constant: ${gpr.dielectricConstant} (${moistureEst} moisture)`);
    }

    confidenceBoost += 5; // GPR is shallow but confirms near-surface
    if (reportLevel < 2) reportLevel = 2;
  }

  // ═══ MAGNETIC / GRAVITY SURVEYS ═══
  if (fieldData.magneticGravitySurvey) {
    const mg = fieldData.magneticGravitySurvey;
    sources.push(`${mg.method === 'both' ? 'Magnetic + Gravity' : mg.method === 'magnetic' ? 'Magnetic' : 'Gravity'} survey (${mg.stationCount} stations)`);

    // Fault line detection → water follows structure
    if (mg.faultLineDetected) {
      notes.push(`Fault line detected${mg.faultAzimuthDeg != null ? ` (azimuth ${mg.faultAzimuthDeg}°)` : ''} — preferential groundwater pathway`);
      calYield *= 1.3; // Faults are high-yield targets
      notes.push('Yield adjusted +30% for fault-associated aquifer');
    }

    // Dyke detection → barrier or conduit
    if (mg.dykeDetected) {
      notes.push(`Dyke detected${mg.dykeDepthM != null ? ` at ${mg.dykeDepthM}m` : ''} — can be barrier or conduit for groundwater`);
      // Dykes typically reduce yield on one side
      notes.push('Recommendation: Drill on upstream side of dyke for best yield');
    }

    // Structural features from gravity
    if (mg.structuralFeature && mg.structuralFeature !== 'none') {
      notes.push(`Structural feature: ${mg.structuralFeature} — ${
        mg.structuralFeature === 'graben' || mg.structuralFeature === 'syncline'
          ? 'favorable for groundwater accumulation'
          : mg.structuralFeature === 'fault'
            ? 'preferential flow path'
            : 'may limit aquifer extent'
      }`);
      if (mg.structuralFeature === 'graben' || mg.structuralFeature === 'syncline') {
        calYield *= 1.2;
      }
    }

    // Basement depth from gravity
    if (mg.basementDepthM != null && mg.basementDepthM > 0) {
      notes.push(`Gravity-derived basement depth: ${mg.basementDepthM}m`);
      if (calDepth > mg.basementDepthM) {
        calDepth = mg.basementDepthM * 0.8;
        notes.push(`Depth adjusted to ${calDepth.toFixed(0)}m (80% of basement depth)`);
      }
    }

    // Magnetic anomaly characterization
    if (mg.magneticAnomalynT != null) {
      const anomalyStrength = Math.abs(mg.magneticAnomalynT);
      notes.push(`Magnetic anomaly: ${mg.magneticAnomalynT > 0 ? '+' : ''}${mg.magneticAnomalynT} nT (${
        anomalyStrength > 500 ? 'strong' : anomalyStrength > 100 ? 'moderate' : 'weak'
      })`);
    }

    confidenceBoost += 7;
    if (reportLevel < 2) reportLevel = 2;
  }

  // ═══ NUCLEAR MAGNETIC RESONANCE / SURFACE NMR (MRS) ═══
  if (fieldData.nmrSurvey) {
    const nmr = fieldData.nmrSurvey;
    sources.push(`${nmr.method === 'surface_NMR' ? 'Surface NMR (MRS)' : 'Borehole NMR'} (loop ${nmr.loopSizeM}m, max ${nmr.maxSoundingDepthM}m)`);

    // NMR is the ONLY method that directly detects water molecules
    notes.push(`NMR water content: ${nmr.waterContentPercent}% — DIRECT WATER DETECTION`);
    notes.push(`Free water: ${nmr.freeWaterDepthM}–${nmr.freeWaterDepthM + nmr.freeWaterThicknessM}m (${nmr.freeWaterThicknessM}m thick)`);

    // Override depth with NMR-confirmed water depth
    calDepth = nmr.freeWaterDepthM + nmr.freeWaterThicknessM / 2;
    notes.push(`Drilling target: ${calDepth.toFixed(0)}m (NMR-confirmed free water zone center)`);

    // T2 decay time → hydraulic conductivity classification
    if (nmr.t2DecayMs != null) {
      const kClass = nmr.t2DecayMs > 300 ? 'high-K sand/gravel' :
                     nmr.t2DecayMs > 100 ? 'moderate-K alluvium' :
                     nmr.t2DecayMs > 30 ? 'low-K silt/fine sand' : 'very low-K clay/silt';
      notes.push(`NMR T2=${nmr.t2DecayMs}ms → ${kClass}`);
    }

    // Direct hydraulic conductivity from NMR
    if (nmr.hydraulicConductivity_m_day != null) {
      notes.push(`NMR-derived K = ${nmr.hydraulicConductivity_m_day} m/day`);
      // Estimate yield from K and thickness: Q ≈ K × b × i × A (simplified)
      const estimatedYield = nmr.hydraulicConductivity_m_day * nmr.freeWaterThicknessM * 0.01 * 100;
      if (estimatedYield > 0) {
        calYield = estimatedYield / 24; // m³/day to m³/hr
        notes.push(`NMR-estimated yield: ${calYield.toFixed(1)} m³/hr`);
      }
    }

    // Porosity
    if (nmr.porosityPercent != null) {
      notes.push(`NMR porosity: ${nmr.porosityPercent}% (${
        nmr.porosityPercent > 30 ? 'high — unconsolidated' :
        nmr.porosityPercent > 15 ? 'moderate — alluvial/weathered' :
        nmr.porosityPercent > 5 ? 'low — fractured rock' : 'very low — tight rock'
      })`);
    }

    // Bound vs free water
    if (nmr.boundWaterPercent != null) {
      const freeRatio = nmr.waterContentPercent > 0
        ? ((nmr.waterContentPercent - nmr.boundWaterPercent) / nmr.waterContentPercent * 100)
        : 0;
      notes.push(`Free/total water ratio: ${freeRatio.toFixed(0)}% (${
        freeRatio > 70 ? 'excellent producibility' :
        freeRatio > 40 ? 'good producibility' : 'poor — mostly bound water'
      })`);
    }

    confidenceBoost += 15; // NMR is the gold standard — direct water detection
    if (reportLevel < 3) reportLevel = 3; // NMR = bankable level
  }

  // ═══ COMPUTE CALIBRATED CONFIDENCE ═══
  const desktopConf = desktopResult.confidenceMetrics?.overall ?? 65;
  const calibratedConf = Math.min(98, desktopConf + confidenceBoost);

  let tier: CalibrationResult['confidenceTier'];
  if (calibratedConf >= 90) tier = 'BANKABLE';
  else if (calibratedConf >= 80) tier = 'ENGINEERING_GRADE';
  else if (calibratedConf >= 70) tier = 'PRE_FEASIBILITY';
  else tier = 'DESKTOP_SCREENING';

  // ═══ COMPUTE ACCURACY OF DESKTOP PREDICTIONS ═══
  const depthDelta = calDepth - desktopResult.recommendedDepth;
  const depthAccuracy = Math.max(0, 100 - Math.abs(depthDelta / Math.max(calDepth, 1)) * 100);
  const yieldDelta = calYield - desktopResult.estimatedYield;
  const yieldAccuracy = Math.max(0, 100 - Math.abs(yieldDelta / Math.max(calYield, 0.1)) * 100);

  // Pump test data → compute aquifer parameters
  let aquiferParams: CalibrationResult['aquiferParameters'];
  if (fieldData.pumpTest) {
    const pt = fieldData.pumpTest;
    const thickness = fieldData.ertSurvey?.aquiferThicknessM ?? 20;
    aquiferParams = {
      transmissivity_m2day: pt.transmissivityM2Day,
      storativity: pt.storativity,
      specificCapacity_m2hr: pt.sustainableYieldM3Hr / (pt.drawdownM || 1),
      hydraulicConductivity_m_day: pt.transmissivityM2Day / thickness,
      aquiferThickness_m: thickness,
      aquiferType: pt.storativity < 0.001 ? 'confined' : pt.storativity > 0.05 ? 'unconfined' : 'semi-confined',
      sustainableYield_m3hr: pt.sustainableYieldM3Hr,
      safeDrawdown_m: pt.drawdownM * 0.8, // 80% of tested drawdown
    };
  }

  return {
    calibratedDepth_m: Math.round(calDepth),
    depthDelta_m: Math.round(depthDelta * 10) / 10,
    depthAccuracyPct: Math.round(depthAccuracy),
    calibratedYield_m3h: Math.round(calYield * 10) / 10,
    yieldDelta_m3h: Math.round(yieldDelta * 10) / 10,
    yieldAccuracyPct: Math.round(yieldAccuracy),
    calibratedWaterQuality: calibratedWQ,
    aquiferParameters: aquiferParams,
    confidence: calibratedConf,
    confidenceTier: tier,
    fieldDataSources: sources,
    calibrationNotes: notes,
    assessmentType: sources.length > 0 ? 'FIELD_VALIDATED' : 'DESKTOP_ESTIMATE',
    reportLevel,
  };
}

/**
 * Compute prediction accuracy from a completed drilling outcome.
 * Returns metrics for the feedback learning loop.
 */
export function computePredictionAccuracy(outcome: DrillingOutcome): {
  depthError_pct: number;
  yieldError_pct: number;
  probabilityCalibration: number;  // How well calibrated was our probability?
  overallAccuracy: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  feedback: string[];
} {
  const depthErr = outcome.actualDepth_m > 0
    ? Math.abs(outcome.predictedDepth_m - outcome.actualDepth_m) / outcome.actualDepth_m * 100
    : 100;

  const yieldErr = outcome.actualYield_m3h > 0
    ? Math.abs(outcome.predictedYield_m3h - outcome.actualYield_m3h) / outcome.actualYield_m3h * 100
    : 100;

  // Probability calibration: if we said 80% probability and it succeeded, that's good.
  // If we said 80% and it failed, that's a miss.
  const probCal = outcome.success
    ? outcome.predictedProbability * 100  // Higher predicted prob = better if success
    : (1 - outcome.predictedProbability) * 100;  // Higher uncertainty = better if failure

  const overallAccuracy = Math.max(0, 100 - (depthErr * 0.35 + yieldErr * 0.35 + (100 - probCal) * 0.30));

  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (overallAccuracy >= 90) grade = 'A';
  else if (overallAccuracy >= 80) grade = 'B';
  else if (overallAccuracy >= 70) grade = 'C';
  else if (overallAccuracy >= 60) grade = 'D';
  else grade = 'F';

  const feedback: string[] = [];
  if (depthErr > 30) feedback.push(`Depth prediction off by ${depthErr.toFixed(0)}% — regional calibration needed`);
  if (yieldErr > 40) feedback.push(`Yield prediction off by ${yieldErr.toFixed(0)}% — transmissivity model needs adjustment`);
  if (!outcome.success && outcome.predictedProbability > 0.7)
    feedback.push('False positive: High probability but dry hole — check lineament/fracture model');
  if (outcome.success && outcome.predictedProbability < 0.4)
    feedback.push('False negative: Low probability but found water — check vegetation/recharge model');
  if (feedback.length === 0)
    feedback.push(`Prediction accuracy grade ${grade} — model performing well for this region`);

  return {
    depthError_pct: Math.round(depthErr * 10) / 10,
    yieldError_pct: Math.round(yieldErr * 10) / 10,
    probabilityCalibration: Math.round(probCal * 10) / 10,
    overallAccuracy: Math.round(overallAccuracy * 10) / 10,
    grade,
    feedback,
  };
}
