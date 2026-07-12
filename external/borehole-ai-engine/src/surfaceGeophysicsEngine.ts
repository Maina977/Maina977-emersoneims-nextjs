/**
 * Surface Geophysics & Non-Invasive Methods Engine
 * ─────────────────────────────────────────────────
 * 30 non-invasive or minimally invasive surface/remote methods for mapping
 * drilling areas and subsurface analysis (aquifers, fractures, lithology,
 * bedrock depth, groundwater potential) — WITHOUT lowering tools into a borehole.
 *
 * For each method the engine:
 *   • Evaluates site-specific applicability from existing pipeline data
 *   • Scores relevance (0-100) and assigns priority
 *   • Estimates cost, time, and expected outcome
 *   • Identifies which knowledge gaps it would close
 *
 * Categories:
 *   A. Seismic Methods (1-4, 16-17)
 *   B. Electromagnetic / Radar (5-8, 27, 29)
 *   C. Electrical / Potential (9-10)
 *   D. Potential Field (11-12, 26)
 *   E. Magnetotelluric (13-14)
 *   F. Nuclear Magnetic Resonance (15)
 *   G. Airborne / Drone (18-22)
 *   H. Remote Sensing (23-25)
 *   I. Advanced / Integrated (28, 30)
 *   J. Fiber-Optic (17 – DAS)
 */

import type { AnalysisResult } from './types';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface GeophysicalMethod {
  id: number;
  name: string;
  category: string;
  principle: string;
  platform: string;                             // 'Surface' | 'Airborne' | 'Drone' | 'Satellite' | 'Passive'
  depthCapability: string;                      // e.g. '<50m', '0-300m', '>1km'
  resolution: string;                           // e.g. '0.5-2m', '10-50m'
  applicabilityScore: number;                   // 0-100 for THIS site
  priority: 'Essential' | 'Recommended' | 'Optional' | 'Situational' | 'Not Applicable';
  estimatedCostUSD: [number, number];           // [low, high]
  estimatedTimeHrs: [number, number];           // [low, high] field time
  expectedOutcome: string;
  siteSpecificNotes: string[];                  // Why it's relevant or not for THIS site
  knowledgeGapsFilled: string[];                // What questions it answers
  limitations: string[];
  kenyaRelevance: string;                       // Specific relevance in Kenya/Africa
  dataRequirements: string;
  integrationWith: string[];                    // Other methods it pairs well with
}

export interface SurveyPlan {
  essentialMethods: GeophysicalMethod[];
  recommendedMethods: GeophysicalMethod[];
  optionalMethods: GeophysicalMethod[];
  totalEstimatedCostUSD: [number, number];
  totalEstimatedTimeHrs: [number, number];
  phaseSequence: { phase: number; name: string; methods: string[]; costUSD: [number, number]; timeHrs: [number, number]; purpose: string }[];
  coverageSummary: string;
  confidenceGainEstimate: number;               // Expected confidence boost from running essential + recommended
}

export interface SurfaceGeophysicsResult {
  methods: GeophysicalMethod[];
  surveyPlan: SurveyPlan;
  siteContext: {
    geology: string;
    terrainType: string;
    targetDepth_m: number;
    primaryObjective: string;
    accessConstraints: string;
  };
  totalMethodsEvaluated: number;
  applicableMethods: number;
  timestamp: string;
}

// ═══════════════════════════════════════════════════════════════
// SITE CONTEXT EXTRACTION
// ═══════════════════════════════════════════════════════════════

interface SiteContext {
  lat: number; lon: number;
  geology: string; rockType: string; terrain: string;
  targetDepth: number; waterTableDepth: number;
  slope: number; elevation: number;
  clay: number; sand: number;
  hasLineaments: boolean; lineamentDensity: number;
  hasFractures: boolean; fractureProximity: number;
  aquiferType: string;
  isArid: boolean; annualPrecip: number;
  successProb: number;
  confidence: number;
  soilType: string;
  insarAvailable: boolean;
  graceAvailable: boolean;
}

function extractSiteContext(lat: number, lon: number, r: Partial<AnalysisResult>): SiteContext {
  const rs = r.remoteSensing;
  const dem = r.demHydrology;
  const lin = r.lineamentAnalysis;
  const geo = (r as any).geological as any;
  const soil = r.soil as any;
  const gldas = r.gldasGroundwater as any;
  const climate = rs?.climate;

  return {
    lat, lon,
    geology: geo?.primaryRockType || geo?.formationName || 'Unknown',
    rockType: geo?.rockType || geo?.primaryRockType || 'Unknown',
    terrain: dem?.twiClass || (dem?.slope_degrees != null && dem.slope_degrees < 5 ? 'Flat' : dem?.slope_degrees != null && dem.slope_degrees < 15 ? 'Moderate' : 'Steep'),
    targetDepth: r.recommendedDepth || 80,
    waterTableDepth: (r as any).waterTableDepth || r.recommendedDepth ? (r.recommendedDepth || 80) * 0.6 : 40,
    slope: dem?.slope_degrees ?? 5,
    elevation: dem?.elevation_m ?? rs?.elevation?.elevation ?? 500,
    clay: rs?.soilGrids?.clay ?? 30,
    sand: rs?.soilGrids?.sand ?? 40,
    hasLineaments: (lin?.lineamentDensity ?? 0) > 0.5,
    lineamentDensity: lin?.lineamentDensity ?? 0,
    hasFractures: (lin?.fractureZoneProximity_m ?? 9999) < 500,
    fractureProximity: lin?.fractureZoneProximity_m ?? 500,
    aquiferType: (typeof (r as any).aquiferClassification?.primaryType === 'string' ? (r as any).aquiferClassification.primaryType : (r as any).aquiferClassification?.primaryType?.type) || 'Unknown',
    isArid: climate?.aridity === 'Arid' || climate?.aridity === 'Semi-arid',
    annualPrecip: climate?.annualPrecipitation ?? 800,
    successProb: r.probability ?? 0.6,
    confidence: (r as any).confidence ?? 50,
    soilType: soil?.type || rs?.soilGrids?.wrbClass || 'Unknown',
    insarAvailable: !!r.insarDeformation,
    graceAvailable: !!r.graceData,
  };
}

// ═══════════════════════════════════════════════════════════════
// PRIORITY LOGIC
// ═══════════════════════════════════════════════════════════════

function scoreToPriority(score: number): GeophysicalMethod['priority'] {
  if (score >= 80) return 'Essential';
  if (score >= 60) return 'Recommended';
  if (score >= 40) return 'Optional';
  if (score >= 20) return 'Situational';
  return 'Not Applicable';
}

// ═══════════════════════════════════════════════════════════════
// 30 METHOD EVALUATORS
// ═══════════════════════════════════════════════════════════════

function evaluate30Methods(ctx: SiteContext): GeophysicalMethod[] {
  const methods: GeophysicalMethod[] = [];

  // ── 1. SEISMIC REFRACTION ──
  {
    let score = 55;
    const notes: string[] = [];
    if (ctx.targetDepth < 50) { score += 15; notes.push('Shallow target — refraction excels at mapping bedrock depth <50m'); }
    if (ctx.rockType.toLowerCase().includes('basement') || ctx.rockType.toLowerCase().includes('granite')) { score += 10; notes.push('Crystalline basement — clear velocity contrast expected'); }
    if (ctx.slope > 20) { score -= 15; notes.push('Steep terrain makes survey line deployment difficult'); }
    if (ctx.clay > 50) { score -= 5; notes.push('High clay content may attenuate seismic energy'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 1, name: 'Seismic Refraction', category: 'A. Seismic',
      principle: 'Measures seismic wave travel times through subsurface layers to map bedrock depth, weathering zones, and layer velocities. First-arrival travel-time curves reveal layer boundaries.',
      platform: 'Surface', depthCapability: '5-100m', resolution: '1-5m vertical',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [1500, 4000], estimatedTimeHrs: [4, 12],
      expectedOutcome: `Map bedrock depth and weathered zone thickness at target depth ~${ctx.targetDepth}m. Identify velocity contrasts indicating aquifer vs. impermeable layers.`,
      siteSpecificNotes: notes.length ? notes : ['Standard applicability for this site'],
      knowledgeGapsFilled: ['Bedrock depth', 'Weathering zone thickness', 'Layer velocities', 'Overburden characterization'],
      limitations: ['Cannot detect thin layers (<2m)', 'Requires velocity to increase with depth', 'Limited by maximum spread length'],
      kenyaRelevance: 'Widely used in Kenya for basement aquifer mapping in central highlands and Kajiado. Effective for determining regolith thickness over crystalline basement.',
      dataRequirements: '24-48 channel seismograph, geophones (4.5 Hz), sledgehammer or drop weight source',
      integrationWith: ['ERT/VES', 'MASW', 'Magnetic Survey'],
    });
  }

  // ── 2. SEISMIC REFLECTION ──
  {
    let score = 40;
    const notes: string[] = [];
    if (ctx.targetDepth > 100) { score += 20; notes.push('Deep target — reflection provides detailed structural imaging at depth'); }
    if (ctx.aquiferType.toLowerCase().includes('confined') || ctx.aquiferType.toLowerCase().includes('sedimentary')) { score += 15; notes.push('Sedimentary/confined aquifer — strong reflectors expected'); }
    if (ctx.targetDepth < 30) { score -= 15; notes.push('Shallow target — refraction or GPR more cost-effective'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 2, name: 'Seismic Reflection', category: 'A. Seismic',
      principle: 'Uses reflected seismic waves from subsurface impedance contrasts to create detailed cross-sectional images of geological structures, faults, and aquifer geometry.',
      platform: 'Surface', depthCapability: '20m-5km+', resolution: '2-10m vertical',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [5000, 20000], estimatedTimeHrs: [8, 24],
      expectedOutcome: 'Detailed structural image showing fault planes, folded aquifer layers, and basement topography. Ideal for complex geological settings.',
      siteSpecificNotes: notes.length ? notes : ['Moderate applicability — consider if simpler methods insufficient'],
      knowledgeGapsFilled: ['Fault geometry', 'Aquifer structure', 'Layer continuity', 'Basin architecture'],
      limitations: ['Expensive equipment', 'Requires skilled processing', 'Surface noise in urban areas', 'Poor in highly fractured rock'],
      kenyaRelevance: 'Used in Kenya rift valley for geothermal and deep aquifer mapping. Applied in Turkana Basin for sedimentary aquifer delineation.',
      dataRequirements: 'Vibroseis or weight-drop source, 96+ channel acquisition, CMP processing',
      integrationWith: ['Seismic Refraction', 'Gravity Survey', 'Magnetotelluric'],
    });
  }

  // ── 3. MASW (Multichannel Analysis of Surface Waves) ──
  {
    let score = 60;
    const notes: string[] = [];
    if (ctx.targetDepth <= 60) { score += 10; notes.push('Target within MASW depth range — effective for layering characterization'); }
    if (ctx.clay > 40) { score += 10; notes.push('Clay-rich soil — shear-wave velocity contrasts will distinguish clay from sand aquifers'); }
    if (ctx.terrain === 'Flat' || ctx.slope < 10) { score += 5; notes.push('Flat terrain ideal for surface wave propagation'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 3, name: 'Multichannel Analysis of Surface Waves (MASW)', category: 'A. Seismic',
      principle: 'Records Rayleigh wave dispersion to determine shear-wave velocity (Vs) profiles. Vs correlates with soil stiffness, layering, and saturation — distinguishing loose sediments from competent rock.',
      platform: 'Surface', depthCapability: '5-60m', resolution: '1-3m vertical',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [1200, 3500], estimatedTimeHrs: [3, 8],
      expectedOutcome: `Shear-wave velocity profile to ${Math.min(ctx.targetDepth, 60)}m revealing soil stiffness layers, saturated zone identification, and competent bedrock depth.`,
      siteSpecificNotes: notes.length ? notes : ['Standard applicability'],
      knowledgeGapsFilled: ['Soil stiffness profile', 'Saturated zone detection', 'Bedrock stiffness', 'Layer boundaries'],
      limitations: ['Limited to ~30-60m depth', 'Lower resolution than refraction at depth', 'Requires flat ground for array'],
      kenyaRelevance: 'Commonly used in Kenya for geotechnical investigations and shallow aquifer mapping. Effective in alluvial plains and volcanic terrains.',
      dataRequirements: '24+ geophones (4.5 Hz), linear array, active source (sledgehammer)',
      integrationWith: ['Seismic Refraction', 'ERT', 'ReMi'],
    });
  }

  // ── 4. REFRACTION MICROTREMOR (ReMi) ──
  {
    let score = 55;
    const notes: string[] = [];
    notes.push('Passive method — no source needed, works in noisy environments');
    if (ctx.slope < 10) { score += 10; notes.push('Flat terrain — good surface wave propagation'); }
    if (ctx.elevation > 1500) { score += 5; notes.push('Highland area — ambient noise from wind/traffic provides good signal'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 4, name: 'Refraction Microtremor (ReMi)', category: 'A. Seismic',
      principle: 'Passive seismic method using ambient noise (traffic, wind, microseisms) to derive shear-wave velocity models without an active source. Cost-effective complement to MASW.',
      platform: 'Passive / Surface', depthCapability: '5-100m', resolution: '2-5m vertical',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [800, 2500], estimatedTimeHrs: [2, 6],
      expectedOutcome: 'Vs30 profile and deeper velocity structure from ambient noise. Useful for site classification and bedrock depth estimation without active source.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Vs30 site classification', 'Bedrock depth', 'Velocity structure'],
      limitations: ['Lower resolution than active MASW', 'Requires sufficient ambient noise', 'May need long recording times'],
      kenyaRelevance: 'Ideal for remote Kenyan sites where active source deployment is difficult. Used alongside MASW for velocity model validation.',
      dataRequirements: 'Linear geophone array, recording unit, 30-60 min ambient recording',
      integrationWith: ['MASW', 'Seismic Refraction', 'Passive Seismic Tomography'],
    });
  }

  // ── 5. GROUND PENETRATING RADAR (GPR) ──
  {
    let score = 45;
    const notes: string[] = [];
    if (ctx.targetDepth < 30) { score += 25; notes.push('Shallow target — GPR provides cm-scale resolution for water table and fractures'); }
    if (ctx.sand > 50) { score += 15; notes.push('Sandy soil — low conductivity allows good radar penetration'); }
    if (ctx.clay > 50) { score -= 20; notes.push('High clay content severely attenuates GPR signal — penetration <5m likely'); }
    if (ctx.hasFractures) { score += 10; notes.push('Fracture zones can be imaged at shallow depths'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 5, name: 'Ground Penetrating Radar (GPR)', category: 'B. Electromagnetic / Radar',
      principle: 'Transmits EM pulses (10 MHz–2.6 GHz) into the ground and records reflections from dielectric contrasts. Produces high-resolution 2D profiles of shallow subsurface features.',
      platform: 'Surface', depthCapability: '1-50m (soil dependent)', resolution: '0.05-1m',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [1000, 3000], estimatedTimeHrs: [2, 8],
      expectedOutcome: `High-resolution image of shallow subsurface to ${Math.min(ctx.targetDepth, ctx.sand > 40 ? 30 : 10)}m showing water table, fractures, voids, and soil layering.`,
      siteSpecificNotes: notes.length ? notes : ['Moderate applicability — soil conductivity will determine effective depth'],
      knowledgeGapsFilled: ['Water table depth', 'Shallow fracture mapping', 'Soil layering', 'Void detection', 'Buried features'],
      limitations: ['Very limited in clay soils', 'Max depth ~30-50m in ideal conditions', 'Requires ground contact or low clearance'],
      kenyaRelevance: 'Used in Kenya for shallow water table mapping in sandy aquifers (coastal Mombasa, Malindi). Limited in central highlands clay-rich laterites.',
      dataRequirements: 'GPR unit with 50-400 MHz antenna, survey wheels, GPS',
      integrationWith: ['ERT', 'MASW', 'Magnetic Survey'],
    });
  }

  // ── ESSENTIAL: 2-D ELECTRICAL RESISTIVITY TOMOGRAPHY (ERT) + VES ──
  // This is THE recommended field-validation method throughout the report, so it
  // must lead the ranking (re-audit #1). It was previously missing entirely while
  // TDEM ranked Essential — a self-contradiction against every other section.
  {
    let score = 82; // ERT+VES is the default primary method for borehole siting
    const notes: string[] = ['PRIMARY recommended field-validation method for this report — 2-D ERT profile + Schlumberger VES at the proposed point and offsets'];
    if (ctx.targetDepth >= 5 && ctx.targetDepth <= 200) { score += 6; notes.push('Target depth ideal for ERT/VES — resolves the 0-200m weathered/fractured interval'); }
    if (/basement|fractured|crystalline|gneiss|granite|schist/i.test(ctx.aquiferType || '')) { score += 4; notes.push('Weathered/fractured basement — ERT maps the saprolite base + fracture zones that control yield'); }
    score = Math.max(10, Math.min(96, score));
    methods.push({
      id: 31, name: 'Electrical Resistivity Tomography (2-D ERT) + VES', category: 'C. Electrical / Potential',
      principle: 'Injects current through electrode arrays (Wenner/Schlumberger/Dipole-Dipole) and measures potential differences to invert a 2-D resistivity cross-section; VES adds 1-D sounding at key points. Directly maps aquifer geometry, weathered-zone base and fracture zones.',
      platform: 'Surface', depthCapability: '2-200m', resolution: '2-10m (spacing-dependent)',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [1000, 5000], estimatedTimeHrs: [4, 10],
      expectedOutcome: `Inverted resistivity section to ~${Math.min(Math.round(ctx.targetDepth * 1.5), 200)}m: aquifer target depth/geometry, weathered-zone base, fracture zones and the survey-grade drill peg.`,
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Aquifer depth & geometry', 'Weathered-zone base', 'Fracture-zone location', 'Drill-point selection', 'Casing/screen depth basis'],
      limitations: ['Requires accessible ground for electrode spreads', 'Equivalence/suppression ambiguity (mitigate with VES + borehole control)', 'Resolution decreases with depth'],
      kenyaRelevance: 'The standard, WRA-recognised borehole-siting survey across Kenya — routinely paired with the statutory hydrogeological survey report. Typical Kenya market cost KSh 40,000-110,000 for the combined survey + report.',
      dataRequirements: 'Multi-electrode resistivity meter (e.g. ABEM Terrameter / IGIS SSR), cables, electrodes; 200-400m line at 5-10m spacing.',
      integrationWith: ['VES', 'TDEM', 'Seismic Refraction', 'Magnetic Survey'],
    });
  }

  // ── COMPLEMENTARY: TIME-DOMAIN ELECTROMAGNETIC (TDEM) ──
  // Complementary to ERT (Recommended by default); genuinely Essential only where
  // deep conductivity discrimination is needed (arid/saline/brackish) (re-audit #1).
  {
    let score = 62;
    const notes: string[] = ['Complementary to ERT — adds deep conductivity discrimination where required'];
    if (ctx.targetDepth > 120 && ctx.targetDepth < 300) { score += 10; notes.push('Deep target (>120m) — TDEM extends below practical ERT depth'); }
    if (ctx.isArid) { score += 12; notes.push('Arid region — TDEM detects conductive freshwater zones in resistive background'); }
    if (ctx.aquiferType.toLowerCase().includes('saline') || ctx.aquiferType.toLowerCase().includes('brackish')) { score += 14; notes.push('Saline/brackish water detection — TDEM excels at conductive target mapping'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 6, name: 'Time-Domain Electromagnetic (TDEM)', category: 'B. Electromagnetic / Radar',
      principle: 'Transmits current pulses through a ground loop, then measures the decaying secondary EM field induced in subsurface conductors. Maps conductivity structure vs. depth.',
      platform: 'Surface', depthCapability: '10-500m', resolution: '5-20m vertical',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [2000, 6000], estimatedTimeHrs: [4, 12],
      expectedOutcome: `Conductivity-depth profile to ${Math.min(ctx.targetDepth * 2, 500)}m. Identify saline vs. freshwater zones, clay layers, and aquifer geometry.`,
      siteSpecificNotes: notes.length ? notes : ['Good general applicability for groundwater investigation'],
      knowledgeGapsFilled: ['Aquifer depth and thickness', 'Saline/fresh water boundary', 'Clay layer mapping', 'Conductivity structure'],
      limitations: ['Sensitive to cultural noise (power lines, fences)', 'Cannot resolve thin resistive layers', 'Requires open ground for loops'],
      kenyaRelevance: 'Extensively used in Kenya for groundwater exploration, especially in Turkana, Marsabit, and coastal aquifer salinity mapping. Standard tool for NGO drilling programs.',
      dataRequirements: 'TDEM transmitter/receiver, 50-200m loop, current source (battery/generator)',
      integrationWith: ['ERT/VES', 'Magnetic Survey', 'FDEM'],
    });
  }

  // ── 7. FREQUENCY-DOMAIN ELECTROMAGNETIC (FDEM) ──
  {
    let score = 55;
    const notes: string[] = [];
    if (ctx.targetDepth < 50) { score += 10; notes.push('Shallow target — FDEM provides rapid near-surface conductivity mapping'); }
    notes.push('Rapid reconnaissance — walk-over survey covers large areas quickly');
    if (ctx.isArid && ctx.sand > 40) { score += 5; notes.push('Arid sandy terrain — conductivity contrasts highlight moisture zones'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 7, name: 'Frequency-Domain Electromagnetic (FDEM)', category: 'B. Electromagnetic / Radar',
      principle: 'Measures in-phase and quadrature components of a continuous EM signal to map apparent conductivity. Hand-held instruments allow rapid coverage.',
      platform: 'Surface', depthCapability: '2-60m', resolution: '1-5m lateral',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [800, 2500], estimatedTimeHrs: [2, 6],
      expectedOutcome: 'Conductivity map of the survey area highlighting wet zones, clay bodies, and potential aquifer extents. Rapid screening before detailed ERT.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Near-surface conductivity', 'Lateral aquifer extent', 'Clay mapping', 'Contamination plumes'],
      limitations: ['Limited depth (<60m)', 'Sensitive to metallic objects', 'Less depth resolution than TDEM'],
      kenyaRelevance: 'Used in Kenya for rapid reconnaissance surveys and contamination mapping around boreholes. Popular in Nairobi peri-urban groundwater studies.',
      dataRequirements: 'EM-34 or EM-31 instrument, GPS, field notebook',
      integrationWith: ['TDEM', 'ERT', 'Magnetic Survey'],
    });
  }

  // ── 8. VERY LOW FREQUENCY (VLF) ELECTROMAGNETIC ──
  {
    let score = 50;
    const notes: string[] = [];
    if (ctx.hasLineaments || ctx.hasFractures) { score += 20; notes.push('Fracture/lineament zone detected — VLF excels at mapping conductive fractures'); }
    if (ctx.rockType.toLowerCase().includes('granite') || ctx.rockType.toLowerCase().includes('gneiss') || ctx.rockType.toLowerCase().includes('basement')) {
      score += 15; notes.push('Crystalline basement — VLF maps water-filled fractures in resistive host rock');
    }
    if (ctx.terrain === 'Flat') { score -= 5; notes.push('Flat sedimentary terrain — less useful than in fractured hard-rock areas'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 8, name: 'Very Low Frequency (VLF) Electromagnetic', category: 'B. Electromagnetic / Radar',
      principle: 'Uses distant military/naval VLF radio transmitters (15-30 kHz) as an EM source. Subsurface conductors (water-filled fractures, faults) tilt the EM field, detected by a portable receiver.',
      platform: 'Passive / Surface', depthCapability: '5-80m', resolution: '5-20m',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [500, 1500], estimatedTimeHrs: [2, 6],
      expectedOutcome: 'Map of conductive linear features (fractures, faults) that may host groundwater. Quick reconnaissance for borehole siting in hard rock.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Fracture location and orientation', 'Conductive zone mapping', 'Fault trace detection'],
      limitations: ['Needs strong VLF transmitter signal', 'Limited depth in conductive overburden', 'Qualitative without modeling'],
      kenyaRelevance: 'Widely used in Kenya for borehole siting in crystalline basement areas (Machakos, Kitui, Makueni). Low cost makes it accessible for community water projects.',
      dataRequirements: 'VLF receiver (e.g., ABEM WADI), compass, GPS, VLF transmitter signal (NWC Australia or similar)',
      integrationWith: ['Magnetic Survey', 'ERT', 'TDEM'],
    });
  }

  // ── 9. INDUCED POLARIZATION (IP) ──
  {
    let score = 55;
    const notes: string[] = [];
    if (ctx.clay > 40) { score += 15; notes.push('Clay-rich soil — IP chargeability distinguishes clay (high IP) from clean sand aquifer (low IP)'); }
    if (ctx.aquiferType.toLowerCase().includes('alluvial') || ctx.aquiferType.toLowerCase().includes('sand')) {
      score += 10; notes.push('Alluvial/sand aquifer — IP differentiates productive clean sand from clayey formations');
    }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 9, name: 'Induced Polarization (IP)', category: 'C. Electrical / Potential',
      principle: 'Measures the chargeability (voltage decay after current shutoff) of subsurface materials. Clay minerals, metallic minerals, and membrane polarization produce high IP responses.',
      platform: 'Surface', depthCapability: '5-200m', resolution: '2-10m',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [2000, 6000], estimatedTimeHrs: [4, 12],
      expectedOutcome: 'Chargeability and resistivity cross-sections distinguishing clean aquifers from clay-bound water. Critical for avoiding low-yield clay-dominated zones.',
      siteSpecificNotes: notes.length ? notes : ['Useful for aquifer characterization'],
      knowledgeGapsFilled: ['Clay vs. clean aquifer discrimination', 'Mineral content', 'Aquifer quality assessment'],
      limitations: ['Slower than standard resistivity', 'Electrode polarization noise', 'Requires good ground contact'],
      kenyaRelevance: 'Used in Kenya to distinguish productive sand aquifers from clay-rich formations, especially in Athi Plains and coastal sediments.',
      dataRequirements: 'Multi-electrode resistivity/IP system, electrodes, cables, battery/generator',
      integrationWith: ['ERT', 'TDEM', 'Seismic Refraction'],
    });
  }

  // ── 10. SPONTANEOUS POTENTIAL (SP) / SELF-POTENTIAL ──
  {
    let score = 50;
    const notes: string[] = [];
    if (ctx.hasFractures || ctx.hasLineaments) { score += 15; notes.push('Fracture zones — SP anomalies from groundwater flow through fractures'); }
    if (ctx.slope > 5 && ctx.slope < 30) { score += 10; notes.push('Sloped terrain creates hydraulic gradients — stronger SP signals from downslope GW flow'); }
    notes.push('Completely passive — no source equipment needed, very low cost');
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 10, name: 'Spontaneous Potential (SP) / Self-Potential', category: 'C. Electrical / Potential',
      principle: 'Measures naturally occurring electrical potentials at the surface caused by electrokinetic (streaming), electrochemical, or thermoelectric effects. Flowing groundwater generates measurable SP anomalies.',
      platform: 'Passive / Surface', depthCapability: '5-100m', resolution: '5-20m lateral',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [300, 1000], estimatedTimeHrs: [2, 6],
      expectedOutcome: 'Map of SP anomalies indicating groundwater flow paths, springs, seepage zones, and fractures with active water movement.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Groundwater flow paths', 'Active fracture identification', 'Seepage zone detection', 'Spring location'],
      limitations: ['Qualitative interpretation', 'Affected by topography and soil moisture', 'Requires stable electrode contact'],
      kenyaRelevance: 'Used in Kenya for geothermal exploration (Olkaria, Menengai) and spring identification in volcanic terrains. Low cost suits community-level projects.',
      dataRequirements: 'High-impedance voltmeter, non-polarizing Cu/CuSO4 electrodes, long cable, GPS',
      integrationWith: ['ERT', 'VLF', 'Magnetic Survey'],
    });
  }

  // ── 11. MAGNETIC SURVEY ──
  {
    let score = 60;
    const notes: string[] = [];
    if (ctx.rockType.toLowerCase().includes('basalt') || ctx.rockType.toLowerCase().includes('volcanic') || ctx.rockType.toLowerCase().includes('igneous')) {
      score += 15; notes.push('Volcanic/igneous geology — strong magnetic contrasts for fault and structure mapping');
    }
    if (ctx.hasLineaments) { score += 10; notes.push('Lineaments detected — magnetics will confirm and refine fault/dyke locations'); }
    if (ctx.geology.toLowerCase().includes('sedimentary') && !ctx.geology.toLowerCase().includes('basement')) { score -= 10; notes.push('Purely sedimentary — weaker magnetic contrasts expected'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 11, name: 'Magnetic Survey (Ground or Airborne)', category: 'D. Potential Field',
      principle: 'Measures variations in Earth\'s total magnetic field caused by magnetic minerals (magnetite, ilmenite) in subsurface rocks. Anomalies indicate faults, dykes, basement depth, and lithological contacts.',
      platform: 'Surface / Airborne', depthCapability: '0-several km', resolution: '1-50m (ground), 50-200m (airborne)',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [1000, 4000], estimatedTimeHrs: [3, 10],
      expectedOutcome: 'Magnetic anomaly map delineating faults, buried dykes, and basement topography. Lineament analysis for fracture-controlled aquifer targeting.',
      siteSpecificNotes: notes.length ? notes : ['Standard applicability for structural mapping'],
      knowledgeGapsFilled: ['Fault location', 'Basement depth', 'Dyke/sill mapping', 'Structural boundaries', 'Lithological contacts'],
      limitations: ['Cannot directly detect water', 'Cultural noise from metal objects', 'Requires diurnal correction'],
      kenyaRelevance: 'Extensively used in Kenya for mapping volcanic dykes and faults in the Rift Valley, and basement structures in eastern Kenya. National airborne magnetic data (AMMP) available.',
      dataRequirements: 'Proton precession or cesium magnetometer, GPS, base station for diurnal correction',
      integrationWith: ['Gravity Survey', 'ERT', 'VLF', 'Seismic Refraction'],
    });
  }

  // ── 12. GRAVITY SURVEY ──
  {
    let score = 35;
    const notes: string[] = [];
    if (ctx.targetDepth > 100) { score += 15; notes.push('Deep target — gravity detects density contrasts at depth for basin geometry'); }
    if (ctx.geology.toLowerCase().includes('rift') || ctx.geology.toLowerCase().includes('basin') || ctx.geology.toLowerCase().includes('graben')) {
      score += 20; notes.push('Rift/basin setting — gravity maps basin depth and bounding faults');
    }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 12, name: 'Gravity Survey', category: 'D. Potential Field',
      principle: 'Measures minute variations in gravitational acceleration caused by density contrasts in subsurface rocks. Low-density sediments (basins) produce negative anomalies; dense basement produces positive anomalies.',
      platform: 'Surface', depthCapability: '0-several km', resolution: '10-100m lateral',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [3000, 10000], estimatedTimeHrs: [6, 24],
      expectedOutcome: 'Bouguer anomaly map showing basin depth, fault-bounded blocks, and density variations indicating sediment-filled valleys (potential aquifers).',
      siteSpecificNotes: notes.length ? notes : ['Moderate applicability — most useful for regional basin mapping'],
      knowledgeGapsFilled: ['Basin depth', 'Fault-bounded blocks', 'Sediment thickness', 'Basement topography'],
      limitations: ['Expensive gravimeter', 'Requires precise elevation data', 'Ambiguous interpretation without constraints', 'Slow field procedure'],
      kenyaRelevance: 'Used in Kenya Rift Valley for geothermal exploration and basin mapping. BGS and GSK have regional gravity data. Useful for Turkana Basin aquifer mapping.',
      dataRequirements: 'LaCoste-Romberg or Scintrex gravimeter, precise differential GPS, base station',
      integrationWith: ['Magnetic Survey', 'Seismic Reflection', 'Magnetotelluric'],
    });
  }

  // ── 13. MAGNETOTELLURIC (MT) ──
  {
    let score = 30;
    const notes: string[] = [];
    if (ctx.targetDepth > 200) { score += 25; notes.push('Very deep target — MT provides structural imaging to km depths'); }
    if (ctx.geology.toLowerCase().includes('geothermal') || ctx.geology.toLowerCase().includes('rift')) {
      score += 20; notes.push('Rift/geothermal setting — MT is the primary deep imaging method');
    }
    if (ctx.targetDepth < 80) { score -= 10; notes.push('Shallow target — MT is overkill; TDEM or ERT more appropriate'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 13, name: 'Magnetotelluric (MT)', category: 'E. Magnetotelluric',
      principle: 'Measures natural EM field variations (10⁻⁴ to 10⁴ Hz) from ionospheric/magnetospheric sources to determine subsurface resistivity structure from surface to >10 km depth.',
      platform: 'Passive / Surface', depthCapability: '100m-10km+', resolution: '10-100m vertical',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [5000, 25000], estimatedTimeHrs: [12, 48],
      expectedOutcome: 'Deep resistivity model revealing major geological structures, deep aquifer systems, and geothermal reservoirs. Regional structural context.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Deep structural geology', 'Regional aquifer architecture', 'Geothermal reservoir mapping'],
      limitations: ['Very expensive', 'Requires long recording times', 'Sensitive to EM noise', 'Specialized processing'],
      kenyaRelevance: 'Standard method for Kenya Rift Valley geothermal exploration (Olkaria, Menengai, Longonot). KenGen and GDC use MT extensively.',
      dataRequirements: 'MT recording unit, electric field dipoles (100m), magnetic coils, 12-24 hr recording per site',
      integrationWith: ['Gravity Survey', 'Seismic Reflection', 'AMT/CSAMT'],
    });
  }

  // ── 14. AMT / CSAMT ──
  {
    let score = 45;
    const notes: string[] = [];
    if (ctx.targetDepth > 50 && ctx.targetDepth < 500) { score += 15; notes.push('Target depth range ideal for AMT — bridges gap between TDEM and MT'); }
    if (ctx.hasFractures) { score += 10; notes.push('Fracture targeting — AMT provides good resolution for fault imaging'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 14, name: 'Audio-Magnetotelluric (AMT) / CSAMT', category: 'E. Magnetotelluric',
      principle: 'Higher-frequency variant of MT (1 Hz–100 kHz) for shallower targets. CSAMT uses a controlled source for better signal in noisy environments. Maps resistivity from 10m to ~1 km.',
      platform: 'Surface', depthCapability: '10m-1km', resolution: '5-20m vertical',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [3000, 10000], estimatedTimeHrs: [6, 18],
      expectedOutcome: 'Resistivity cross-section to ~500m revealing aquifer geometry, fracture zones, and lithological boundaries at intermediate depths.',
      siteSpecificNotes: notes.length ? notes : ['Moderate applicability for intermediate-depth targets'],
      knowledgeGapsFilled: ['Intermediate-depth structure', 'Fracture zone geometry', 'Aquifer-confining layer mapping'],
      limitations: ['More expensive than TDEM', 'CSAMT requires grounded source dipole', 'Near-field effects near source'],
      kenyaRelevance: 'Used in Kenya geothermal fields alongside MT. Applicable for deep groundwater exploration in volcanic terrains of central highlands.',
      dataRequirements: 'AMT receiver, electric/magnetic sensors, controlled source (for CSAMT)',
      integrationWith: ['MT', 'TDEM', 'ERT'],
    });
  }

  // ── 15. SURFACE NMR / MRS ──
  {
    let score = 65;
    const notes: string[] = [];
    notes.push('ONLY geophysical method that directly detects and quantifies mobile groundwater');
    if (ctx.targetDepth < 100) { score += 10; notes.push('Target within NMR depth range — will provide direct water content measurement'); }
    if (ctx.successProb < 0.6) { score += 10; notes.push('Low success probability — direct water detection can confirm/deny aquifer presence before drilling'); }
    if (ctx.clay > 50) { score -= 5; notes.push('High clay — NMR will still detect water but bound water in clay may complicate interpretation'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 15, name: 'Surface Magnetic Resonance Sounding (MRS / Surface NMR)', category: 'F. Nuclear Magnetic Resonance',
      principle: 'Excites hydrogen nuclei in groundwater using surface loops tuned to the Larmor frequency. The NMR signal amplitude directly measures water content; decay time indicates pore size (free vs. bound water).',
      platform: 'Surface', depthCapability: '5-120m', resolution: '3-10m vertical',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [3000, 8000], estimatedTimeHrs: [4, 12],
      expectedOutcome: `Direct measurement of water content and pore-water mobility vs. depth to ~${Math.min(ctx.targetDepth, 120)}m. The ONLY method that directly detects groundwater.`,
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Direct water content', 'Free vs. bound water', 'Aquifer transmissivity estimate', 'Water table confirmation'],
      limitations: ['Sensitive to EM noise (power lines)', 'Limited depth (~120m)', 'Expensive equipment', 'Slow acquisition'],
      kenyaRelevance: 'Used in Kenya by research groups and international NGOs for direct groundwater detection. Very effective in hard-rock terrains of eastern Kenya.',
      dataRequirements: 'MRS instrument (e.g., Numis, GMR), 50-150m square loop, EM-quiet site',
      integrationWith: ['ERT', 'TDEM', 'Seismic Refraction'],
    });
  }

  // ── 16. PASSIVE SEISMIC TOMOGRAPHY ──
  {
    let score = 40;
    const notes: string[] = [];
    if (ctx.targetDepth > 100) { score += 15; notes.push('Deep target — passive seismic provides 3D velocity structure without active source'); }
    notes.push('Fully passive — uses ambient noise cross-correlation for 3D imaging');
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 16, name: 'Passive Seismic Tomography', category: 'A. Seismic',
      principle: 'Uses ambient seismic noise (traffic, ocean waves, earthquakes) recorded at an array of sensors. Cross-correlation of noise between pairs yields virtual seismic records for 3D velocity imaging.',
      platform: 'Passive / Surface', depthCapability: '10m-several km', resolution: '5-50m',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [3000, 12000], estimatedTimeHrs: [8, 48],
      expectedOutcome: '3D shear-wave velocity model revealing aquifer zones, fault planes, and geological structure without any active source.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['3D subsurface velocity', 'Fault geometry', 'Basin structure'],
      limitations: ['Requires dense station array', 'Long recording times', 'Complex processing', 'Resolution depends on noise characteristics'],
      kenyaRelevance: 'Applied in Kenya Rift for geothermal reservoir mapping. Growing use for groundwater basin characterization.',
      dataRequirements: '10-50+ seismometers, GPS timing, days to weeks of recording',
      integrationWith: ['Seismic Refraction', 'MASW', 'ReMi', 'Gravity'],
    });
  }

  // ── 17. DISTRIBUTED ACOUSTIC SENSING (DAS) ──
  {
    let score = 25;
    const notes: string[] = [];
    if (ctx.targetDepth > 200) { score += 10; notes.push('Deep target — DAS provides continuous monitoring capability'); }
    notes.push('Cutting-edge technology — uses fiber-optic cables as distributed seismic sensors');
    notes.push('Very high resolution along cable length but requires pre-installed fiber');
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 17, name: 'Distributed Acoustic Sensing (DAS)', category: 'J. Fiber-Optic',
      principle: 'Uses a fiber-optic cable as a continuous seismic sensor by measuring strain from backscattered light (Rayleigh scattering). Each meter of fiber acts as an independent seismic channel.',
      platform: 'Surface / Fiber', depthCapability: '0-several km (along cable)', resolution: '1-10m along cable',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [10000, 50000], estimatedTimeHrs: [8, 48],
      expectedOutcome: 'Continuous seismic monitoring along fiber path. Detects fluid flow, fracture activity, and microseismicity for aquifer characterization.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Continuous seismic monitoring', 'Fluid flow detection', 'Microseismicity', 'Time-lapse changes'],
      limitations: ['Requires fiber-optic cable installation', 'Expensive interrogator unit', 'Specialized processing', 'Research-grade in most applications'],
      kenyaRelevance: 'Emerging technology in Kenya — potential for monitoring geothermal wells and large aquifer systems. Primarily research-level currently.',
      dataRequirements: 'DAS interrogator, fiber-optic cable (up to 50 km), data storage for TB-scale recordings',
      integrationWith: ['Passive Seismic Tomography', 'Seismic Reflection', 'Time-Lapse Monitoring'],
    });
  }

  // ── 18. AIRBORNE ELECTROMAGNETIC (AEM) ──
  {
    let score = 45;
    const notes: string[] = [];
    if (ctx.slope > 15) { score += 15; notes.push('Rugged terrain — AEM avoids ground access problems'); }
    notes.push('Covers large areas (100s of km²) in a single flight — ideal for regional mapping');
    if (ctx.isArid) { score += 10; notes.push('Arid region — AEM maps buried paleochannels and aquifer geometry efficiently'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 18, name: 'Airborne Electromagnetic (AEM / SkyTEM)', category: 'G. Airborne / Drone',
      principle: 'Helicopter- or fixed-wing-mounted EM system measures subsurface conductivity from the air. Maps large areas rapidly with consistent data quality regardless of terrain.',
      platform: 'Airborne', depthCapability: '5-300m', resolution: '5-30m vertical, 50-200m lateral',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [15000, 80000], estimatedTimeHrs: [4, 12],
      expectedOutcome: 'Regional 3D conductivity model covering 10-500 km², mapping aquifer extents, paleochannels, saline intrusion, and clay barriers.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Regional aquifer mapping', 'Paleochannel detection', 'Saline intrusion extent', 'Spatial variability'],
      limitations: ['Very expensive', 'Requires flight permits', 'Lower resolution than ground methods', 'Weather dependent'],
      kenyaRelevance: 'Major AEM surveys conducted in Kenya (Lodwar, Turkana) by JICA and other partners for regional aquifer mapping. SkyTEM surveys mapped Lotikipi Basin aquifer.',
      dataRequirements: 'AEM system (SkyTEM, VTEM, or similar), helicopter, GPS/INS, processing software',
      integrationWith: ['Ground TDEM', 'Magnetic Survey', 'Gravity'],
    });
  }

  // ── 19. DRONE-BASED MAGNETOMETRY ──
  {
    let score = 45;
    const notes: string[] = [];
    if (ctx.hasLineaments || ctx.hasFractures) { score += 15; notes.push('Fracture/lineament area — drone magnetics provides high-resolution fault mapping'); }
    if (ctx.slope > 10) { score += 10; notes.push('Moderate-steep terrain — drones access areas difficult for ground surveys'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 19, name: 'Drone-Based Magnetometry', category: 'G. Airborne / Drone',
      principle: 'UAV-mounted magnetometer flies low-altitude (~20-50m AGL) grid patterns to map magnetic anomalies at higher resolution than airborne and faster than ground magnetics.',
      platform: 'Drone', depthCapability: '0-several km (potential field)', resolution: '2-20m lateral',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [2000, 8000], estimatedTimeHrs: [2, 8],
      expectedOutcome: 'High-resolution magnetic anomaly map covering the survey area, delineating faults, dykes, and geological contacts for fracture-targeted drilling.',
      siteSpecificNotes: notes.length ? notes : ['Moderate applicability — useful for detailed structural mapping'],
      knowledgeGapsFilled: ['High-res fault mapping', 'Dyke detection', 'Basement topography', 'Geological contacts'],
      limitations: ['Battery-limited flight time (~30 min)', 'Weather sensitive', 'Regulatory restrictions', 'Requires magnetometer payload'],
      kenyaRelevance: 'Growing use in Kenya for mineral exploration and borehole siting in volcanic terrains. KCAA drone regulations apply.',
      dataRequirements: 'Multirotor/fixed-wing UAV, magnetometer payload, RTK GPS, ground mag base station',
      integrationWith: ['Ground Magnetics', 'ERT', 'LiDAR drone'],
    });
  }

  // ── 20. DRONE-BASED GPR/EM ──
  {
    let score = 35;
    const notes: string[] = [];
    if (ctx.targetDepth < 20 && ctx.sand > 40) { score += 15; notes.push('Very shallow target in sandy soil — drone GPR provides rapid shallow mapping'); }
    if (ctx.slope > 15) { score += 10; notes.push('Steep terrain — airborne platform avoids ground access difficulties'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 20, name: 'Drone-Based GPR or EM', category: 'G. Airborne / Drone',
      principle: 'UAV-mounted GPR or EM sensors for shallow subsurface imaging without ground contact. Rapid coverage of large or inaccessible areas.',
      platform: 'Drone', depthCapability: '1-30m (GPR), 5-50m (EM)', resolution: '0.1-2m (GPR), 2-10m (EM)',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [3000, 10000], estimatedTimeHrs: [2, 8],
      expectedOutcome: 'Shallow subsurface map from aerial platform. Identifies water table, fractures, voids, and soil layering without ground disturbance.',
      siteSpecificNotes: notes.length ? notes : ['Emerging technology — useful for inaccessible terrain'],
      knowledgeGapsFilled: ['Shallow subsurface imaging (inaccessible areas)', 'Water table mapping', 'Lateral variability'],
      limitations: ['Emerging technology — limited commercial availability', 'Shallow penetration', 'Payload weight constraints', 'Signal coupling challenges'],
      kenyaRelevance: 'Research-stage in Kenya. Potential for mapping shallow aquifers in arid northern counties where ground access is difficult.',
      dataRequirements: 'Heavy-lift UAV, GPR or EM payload, RTK GPS, processing software',
      integrationWith: ['Ground GPR', 'Drone Magnetometry', 'LiDAR'],
    });
  }

  // ── 21. AIRBORNE GAMMA-RAY SPECTROMETRY ──
  {
    let score = 35;
    const notes: string[] = [];
    if (ctx.rockType.toLowerCase().includes('granite') || ctx.rockType.toLowerCase().includes('volcanic')) {
      score += 15; notes.push('Igneous/volcanic rocks — high radioelement concentrations provide lithological discrimination');
    }
    notes.push('Maps K, Th, U concentrations for lithology mapping and alteration zone detection');
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 21, name: 'Airborne Gamma-Ray Spectrometry (Radiometrics)', category: 'G. Airborne / Drone',
      principle: 'Measures natural gamma radiation from K-40, Th-232, and U-238 decay series in surface rocks/soils. Radioelement ratios map lithology, weathering, and alteration zones.',
      platform: 'Airborne', depthCapability: 'Surface only (top 30-50 cm)', resolution: '50-200m lateral',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [5000, 30000], estimatedTimeHrs: [4, 12],
      expectedOutcome: 'K-Th-U radioelement maps highlighting lithological boundaries and weathering zones. Indirect groundwater indicator through alteration mapping.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Surface lithology mapping', 'Weathering intensity', 'Alteration zones', 'Soil parent material'],
      limitations: ['Surface-only measurement (<50cm)', 'Expensive airborne platform', 'Moisture reduces signal', 'Cannot detect water directly'],
      kenyaRelevance: 'Kenya has national airborne radiometric coverage from the Africa Airborne Geophysics Project. Data available from Geological Survey of Kenya.',
      dataRequirements: 'NaI(Tl) or BGO spectrometer, airborne platform, GPS, calibration pads',
      integrationWith: ['Airborne Magnetics', 'AEM', 'Multispectral Remote Sensing'],
    });
  }

  // ── 22. LiDAR (Airborne or Drone) ──
  {
    let score = 50;
    const notes: string[] = [];
    if (ctx.hasLineaments) { score += 15; notes.push('Lineaments detected — LiDAR provides sub-meter topographic detail for fracture trace mapping'); }
    if (ctx.slope > 10) { score += 10; notes.push('Moderate-steep terrain — high-res DEM essential for drainage and morphological analysis'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 22, name: 'LiDAR (Airborne or Drone)', category: 'G. Airborne / Drone',
      principle: 'Laser scanning produces point clouds with cm-scale resolution for surface topography. Penetrates vegetation canopy to map bare-earth surface, revealing subtle lineaments, faults, and geomorphological features.',
      platform: 'Airborne / Drone', depthCapability: 'Surface only (topographic)', resolution: '0.05-1m',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [3000, 20000], estimatedTimeHrs: [2, 8],
      expectedOutcome: 'Ultra-high-resolution DEM revealing fracture traces, fault scarps, drainage patterns, and geomorphic features controlling groundwater flow.',
      siteSpecificNotes: notes.length ? notes : ['Good applicability for structural and geomorphological analysis'],
      knowledgeGapsFilled: ['Sub-meter topography', 'Fracture trace mapping', 'Drainage network', 'Geomorphic classification'],
      limitations: ['Surface-only (no subsurface)', 'Expensive for large areas', 'Processing requires specialized software', 'Cannot directly detect water'],
      kenyaRelevance: 'Used in Kenya for flood mapping, geotechnical studies, and geothermal site characterization. Drone LiDAR increasingly affordable.',
      dataRequirements: 'LiDAR sensor (airborne or drone-mounted), IMU/GPS, point cloud processing software',
      integrationWith: ['Multispectral RS', 'Magnetic Survey', 'ERT', 'MASW'],
    });
  }

  // ── 23. MULTISPECTRAL/HYPERSPECTRAL REMOTE SENSING ──
  {
    let score = 70;
    const notes: string[] = [];
    notes.push('Already partially covered by satellite remote sensing engine — this entry covers DRONE-SCALE multispectral');
    if (ctx.isArid) { score += 10; notes.push('Arid region — spectral mapping highlights mineral alterations and moisture anomalies'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 23, name: 'Multispectral/Hyperspectral Remote Sensing', category: 'H. Remote Sensing',
      principle: 'Captures reflected light in many narrow spectral bands (VNIR, SWIR) to map surface minerals, vegetation health, soil moisture, and lithological units from satellite or drone platforms.',
      platform: 'Satellite / Drone', depthCapability: 'Surface (indirect subsurface indicator)', resolution: '0.3-30m',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [500, 5000], estimatedTimeHrs: [2, 8],
      expectedOutcome: 'Mineral alteration map, vegetation stress indicators (phreatophyte identification), soil moisture proxy, and lithological discrimination for aquifer targeting.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Surface mineralogy', 'Vegetation-GW indicators', 'Soil moisture proxy', 'Lithological mapping'],
      limitations: ['Surface-only measurement', 'Cloud cover interference', 'Requires spectral expertise', 'Atmospheric correction needed'],
      kenyaRelevance: 'Sentinel-2 and Landsat freely available for Kenya. Used extensively for GW potential mapping in Kenyan semi-arid lands (Kajiado, Kitui, Samburu).',
      dataRequirements: 'Satellite imagery (free: Sentinel-2, Landsat) or drone multispectral camera, processing software (ENVI, QGIS)',
      integrationWith: ['Thermal IR RS', 'InSAR', 'Magnetic Survey', 'DEM analysis'],
    });
  }

  // ── 24. THERMAL INFRARED REMOTE SENSING ──
  {
    let score = 55;
    const notes: string[] = [];
    if (ctx.hasFractures || ctx.slope > 5) { score += 10; notes.push('Potential GW discharge zones — thermal anomalies indicate cool spring/seepage areas'); }
    if (ctx.isArid) { score += 10; notes.push('Arid environment — thermal contrasts between wet and dry ground are more pronounced'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 24, name: 'Thermal Infrared Remote Sensing', category: 'H. Remote Sensing',
      principle: 'Detects emitted thermal radiation (8-14 μm) to map surface temperature. Cooler areas may indicate groundwater discharge, springs, or shallow aquifers. Warmer zones suggest dry conditions.',
      platform: 'Satellite / Drone', depthCapability: 'Surface (indirect subsurface indicator)', resolution: '5m (drone) to 100m (satellite)',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [500, 3000], estimatedTimeHrs: [1, 4],
      expectedOutcome: 'Thermal anomaly map highlighting potential GW discharge zones, spring locations, and areas of evapotranspiration from shallow water table.',
      siteSpecificNotes: notes.length ? notes : ['Moderate applicability for GW discharge detection'],
      knowledgeGapsFilled: ['GW discharge zone identification', 'Spring detection', 'Thermal anomaly mapping', 'ET estimation'],
      limitations: ['Affected by topography and solar heating', 'Best at dawn/dusk', 'Resolution limited from satellite', 'Cannot directly measure water depth'],
      kenyaRelevance: 'Used in Kenya for geothermal exploration (Menengai, Olkaria) and spring identification in volcanic terrains. Drone thermal cameras increasingly used.',
      dataRequirements: 'Landsat TIRS / ASTER / drone thermal camera, pre-dawn acquisition preferred',
      integrationWith: ['Multispectral RS', 'SP survey', 'NDVI analysis'],
    });
  }

  // ── 25. InSAR ──
  {
    let score = 50;
    const notes: string[] = [];
    if (ctx.insarAvailable) { score += 15; notes.push('InSAR data already available in analysis — extending to time-lapse monitoring recommended'); }
    if (ctx.targetDepth > 50) { score += 10; notes.push('Deeper aquifer — InSAR can detect pumping-induced subsidence patterns'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 25, name: 'InSAR (Interferometric SAR)', category: 'H. Remote Sensing',
      principle: 'Compares SAR images from different times to measure mm-scale ground deformation. Subsidence from groundwater extraction or uplift from recharge reveals aquifer behavior.',
      platform: 'Satellite', depthCapability: 'Surface deformation (indirect aquifer indicator)', resolution: '5-20m',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [1000, 5000], estimatedTimeHrs: [4, 16],
      expectedOutcome: 'Ground deformation map showing subsidence bowls (over-extraction), uplift zones (recharge), and fault-controlled boundaries of aquifer compartments.',
      siteSpecificNotes: notes.length ? notes : ['Standard remote sensing method for aquifer monitoring'],
      knowledgeGapsFilled: ['Aquifer compaction/deformation', 'Extraction impact', 'Recharge zone identification', 'Fault compartmentalization'],
      limitations: ['Cannot detect water directly', 'Requires multiple SAR acquisitions', 'Vegetation degrades coherence', 'Processing complexity'],
      kenyaRelevance: 'Sentinel-1 data freely available for Kenya. Used for monitoring subsidence in Nairobi aquifer and Nakuru groundwater basin.',
      dataRequirements: 'Sentinel-1 SAR imagery (free from ESA), InSAR processing software (ISCE, SNAP, LiCSBAS)',
      integrationWith: ['GRACE', 'ERT time-lapse', 'Multispectral RS'],
    });
  }

  // ── 26. GRAVITY GRADIOMETRY ──
  {
    let score = 20;
    const notes: string[] = [];
    if (ctx.geology.toLowerCase().includes('basin') || ctx.geology.toLowerCase().includes('rift')) {
      score += 15; notes.push('Basin/rift setting — gravity gradiometry resolves structural edges more precisely than standard gravity');
    }
    notes.push('Advanced gravity method — requires specialized airborne platform');
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 26, name: 'Gravity Gradiometry', category: 'D. Potential Field',
      principle: 'Measures the spatial gradient of gravity (tensor) rather than absolute gravity. Provides sharper resolution of density boundaries — faults, basin edges, and intrusive bodies.',
      platform: 'Airborne', depthCapability: '0-several km', resolution: '10-50m lateral',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [20000, 100000], estimatedTimeHrs: [8, 24],
      expectedOutcome: 'High-resolution density gradient maps delineating fault planes, basin edges, and geological contacts with better edge detection than standard gravity.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Precise fault edge location', 'Basin boundary mapping', 'Intrusive body delineation'],
      limitations: ['Very expensive', 'Specialized aircraft required', 'Limited availability', 'Primarily for large-scale projects'],
      kenyaRelevance: 'Limited application in Kenya — primarily used in mineral exploration. Potential for Turkana Basin deep aquifer mapping.',
      dataRequirements: 'Full tensor gradiometer (FTG), specialized aircraft, navigation system',
      integrationWith: ['Standard Gravity', 'Airborne Magnetics', 'Seismic Reflection'],
    });
  }

  // ── 27. EMI PROFILING ──
  {
    let score = 55;
    const notes: string[] = [];
    if (ctx.isArid) { score += 10; notes.push('Arid region — EMI maps salinity boundaries and aquifer extent efficiently'); }
    notes.push('Rapid continuous profiling — covers kilometers of survey line per day');
    if (ctx.targetDepth > 80) { score -= 10; notes.push('Deep target beyond EMI penetration — TDEM more appropriate'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 27, name: 'Electromagnetic Induction (EMI) Profiling', category: 'B. Electromagnetic / Radar',
      principle: 'Continuous walking or vehicle-towed EM measurements for rapid conductivity mapping. Similar principle to FDEM but optimized for continuous profiling along survey lines.',
      platform: 'Surface', depthCapability: '2-40m', resolution: '1-5m lateral',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [800, 3000], estimatedTimeHrs: [2, 8],
      expectedOutcome: 'Continuous conductivity profile along survey lines. Maps aquifer lateral extent, saline/freshwater boundaries, and clay distribution.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Lateral aquifer extent', 'Salinity mapping', 'Clay distribution', 'Contamination plumes'],
      limitations: ['Shallow penetration (<40m)', 'Sensitive to metallic interference', 'Limited depth resolution'],
      kenyaRelevance: 'Used in Kenya for salinity mapping in coastal aquifers (Mombasa, Malindi) and irrigation zone characterization.',
      dataRequirements: 'EM-34 or CMD Explorer, GPS, data logger',
      integrationWith: ['FDEM', 'ERT', 'TDEM'],
    });
  }

  // ── 28. CROSS-HOLE SEISMIC TOMOGRAPHY ──
  {
    let score = 25;
    const notes: string[] = [];
    notes.push('Requires at least 2 access points (shallow boreholes or pits) — minimally invasive but not purely surface');
    if (ctx.hasFractures) { score += 10; notes.push('Fracture zone — tomography can image fracture connectivity between points'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 28, name: 'Cross-Hole Seismic Tomography', category: 'I. Advanced / Integrated',
      principle: 'Seismic waves transmitted between two boreholes or surface access points are recorded to create velocity tomograms. Reveals detailed 2D velocity structure between observation points.',
      platform: 'Surface (minimal borehole access)', depthCapability: '5-200m', resolution: '1-5m',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [5000, 15000], estimatedTimeHrs: [6, 18],
      expectedOutcome: 'High-resolution velocity tomogram between access points, imaging aquifer zones, fractures, and geological heterogeneity.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Inter-borehole velocity structure', 'Fracture connectivity', 'Aquifer heterogeneity'],
      limitations: ['Requires 2+ access points', 'Limited to plane between points', 'Complex acquisition and processing'],
      kenyaRelevance: 'Used at established well fields in Kenya for characterizing aquifer heterogeneity between existing boreholes.',
      dataRequirements: '2 accessible boreholes/pits, seismic source, multi-level hydrophone string, recording unit',
      integrationWith: ['ERT', 'Seismic Refraction', 'Surface NMR'],
    });
  }

  // ── 29. ATOMIC DIELECTRIC RESONANCE (ADR) ──
  {
    let score = 30;
    const notes: string[] = [];
    notes.push('Advanced/proprietary EM technique — some controversy on methodology but commercial applications exist');
    if (ctx.targetDepth > 100) { score += 10; notes.push('Deep target — ADR claims deep dielectric property mapping (100-1000m+)'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 29, name: 'Atomic Dielectric Resonance (ADR)', category: 'I. Advanced / Integrated',
      principle: 'Advanced EM technique measuring dielectric properties of subsurface materials at specific resonant frequencies. Claims to detect water-bearing formations and hydrocarbon-bearing rocks at depth.',
      platform: 'Surface', depthCapability: '10-1000m+ (claimed)', resolution: '5-20m (claimed)',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [5000, 20000], estimatedTimeHrs: [4, 12],
      expectedOutcome: 'Dielectric property profile indicating water-bearing formations, clay barriers, and geological boundaries at depth. Results should be validated against ERT/seismic.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Deep dielectric structure', 'Water-bearing zone detection', 'Lithological discrimination'],
      limitations: ['Proprietary technology — limited peer review', 'Results vary between operators', 'Should always be validated with established methods', 'Controversial in academic community'],
      kenyaRelevance: 'Used by some commercial operators in Kenya for borehole siting. Results should be cross-validated with ERT/VES. WaterTech and similar firms offer ADR surveys.',
      dataRequirements: 'ADR instrument (e.g., Adrok ADR scanner), GPS, calibration data',
      integrationWith: ['ERT', 'TDEM', 'Seismic Refraction'],
    });
  }

  // ── 30. TIME-LAPSE GEOPHYSICAL MONITORING ──
  {
    let score = 40;
    const notes: string[] = [];
    notes.push('Repeated surveys track dynamic aquifer changes — essential for sustainability assessment');
    if (ctx.successProb > 0.7) { score += 10; notes.push('High success site — time-lapse monitoring valuable for post-drilling aquifer management'); }
    if (ctx.isArid) { score += 10; notes.push('Arid region — seasonal monitoring critical for sustainable yield assessment'); }
    score = Math.max(10, Math.min(95, score));
    methods.push({
      id: 30, name: 'Integrated Time-Lapse Geophysical Monitoring', category: 'I. Advanced / Integrated',
      principle: 'Repeated geophysical surveys (ERT, seismic, gravity, EM) over time to track aquifer changes — seasonal recharge, depletion, contamination migration, and response to pumping.',
      platform: 'Surface (repeated)', depthCapability: 'Same as base method', resolution: 'Same as base method',
      applicabilityScore: score, priority: scoreToPriority(score),
      estimatedCostUSD: [2000, 10000], estimatedTimeHrs: [4, 16],
      expectedOutcome: 'Time-lapse difference maps showing how the aquifer changes with seasons, pumping, and recharge events. Essential for long-term sustainability planning.',
      siteSpecificNotes: notes,
      knowledgeGapsFilled: ['Aquifer temporal behavior', 'Recharge dynamics', 'Depletion monitoring', 'Contamination tracking', 'Pumping impact'],
      limitations: ['Requires repeated site visits', 'Baseline survey needed first', 'Processing must account for repeatability errors', 'Long-term commitment'],
      kenyaRelevance: 'Growing importance in Kenya for monitoring over-extracted aquifers (Nairobi, Naivasha). WRMA/WRA mandates may require monitoring data for permits.',
      dataRequirements: 'Base geophysical survey + repeat surveys (quarterly/annual), consistent acquisition parameters',
      integrationWith: ['ERT', 'InSAR', 'GRACE', 'Gravity', 'Water level monitoring'],
    });
  }

  return methods;
}

// ═══════════════════════════════════════════════════════════════
// SURVEY PLAN GENERATION
// ═══════════════════════════════════════════════════════════════

function generateSurveyPlan(methods: GeophysicalMethod[], ctx: SiteContext): SurveyPlan {
  const essential = methods.filter(m => m.priority === 'Essential');
  const recommended = methods.filter(m => m.priority === 'Recommended');
  const optional = methods.filter(m => m.priority === 'Optional' || m.priority === 'Situational');

  const sumCost = (arr: GeophysicalMethod[]): [number, number] => [
    arr.reduce((s, m) => s + m.estimatedCostUSD[0], 0),
    arr.reduce((s, m) => s + m.estimatedCostUSD[1], 0),
  ];
  const sumTime = (arr: GeophysicalMethod[]): [number, number] => [
    arr.reduce((s, m) => s + m.estimatedTimeHrs[0], 0),
    arr.reduce((s, m) => s + m.estimatedTimeHrs[1], 0),
  ];

  // Phase sequence for essential + recommended
  const phases: SurveyPlan['phaseSequence'] = [];
  const phase1Methods = methods.filter(m => ['Multispectral/Hyperspectral Remote Sensing', 'Thermal Infrared Remote Sensing', 'InSAR (Interferometric SAR)', 'LiDAR (Airborne or Drone)'].includes(m.name) && (m.priority === 'Essential' || m.priority === 'Recommended'));
  const phase2Methods = methods.filter(m => ['Magnetic Survey (Ground or Airborne)', 'VLF Electromagnetic', 'FDEM', 'EMI Profiling', 'Spontaneous Potential (SP) / Self-Potential'].some(n => m.name.includes(n.split(' ')[0])) && (m.priority === 'Essential' || m.priority === 'Recommended'));
  const phase3Methods = methods.filter(m => ['ERT', 'TDEM', 'IP', 'VES', 'MASW', 'Seismic Refraction', 'GPR', 'Surface NMR'].some(n => m.name.includes(n)) && (m.priority === 'Essential' || m.priority === 'Recommended'));
  const phase4Methods = methods.filter(m => ['Time-Lapse', 'DAS', 'Cross-Hole'].some(n => m.name.includes(n)) && (m.priority === 'Essential' || m.priority === 'Recommended'));

  if (phase1Methods.length > 0) {
    phases.push({
      phase: 1, name: 'Remote Sensing & Desktop Study',
      methods: phase1Methods.map(m => m.name),
      costUSD: sumCost(phase1Methods), timeHrs: sumTime(phase1Methods),
      purpose: 'Regional analysis, lineament mapping, vegetation/thermal anomaly detection from satellite/drone imagery',
    });
  }
  if (phase2Methods.length > 0) {
    phases.push({
      phase: 2, name: 'Reconnaissance Geophysics',
      methods: phase2Methods.map(m => m.name),
      costUSD: sumCost(phase2Methods), timeHrs: sumTime(phase2Methods),
      purpose: 'Rapid ground coverage — magnetic, VLF, SP for structural framework and fracture identification',
    });
  }
  if (phase3Methods.length > 0) {
    phases.push({
      phase: 3, name: 'Detailed Ground Geophysics',
      methods: phase3Methods.map(m => m.name),
      costUSD: sumCost(phase3Methods), timeHrs: sumTime(phase3Methods),
      purpose: 'High-resolution subsurface imaging — ERT, TDEM, seismic, NMR for aquifer characterization and drill point selection',
    });
  }
  if (phase4Methods.length > 0) {
    phases.push({
      phase: 4, name: 'Advanced / Monitoring',
      methods: phase4Methods.map(m => m.name),
      costUSD: sumCost(phase4Methods), timeHrs: sumTime(phase4Methods),
      purpose: 'Long-term monitoring, time-lapse surveys, cross-hole characterization for aquifer management',
    });
  }
  if (phases.length === 0) {
    phases.push({
      phase: 1, name: 'Recommended Survey Package',
      methods: [...essential, ...recommended].map(m => m.name),
      costUSD: sumCost([...essential, ...recommended]),
      timeHrs: sumTime([...essential, ...recommended]),
      purpose: 'Combined geophysical investigation for borehole siting and aquifer characterization',
    });
  }

  const allPriority = [...essential, ...recommended];
  const totalCost = sumCost(allPriority);
  const totalTime = sumTime(allPriority);

  const baseConfidence = ctx.confidence;
  const confidenceGain = Math.min(35, essential.length * 5 + recommended.length * 2.5);

  return {
    essentialMethods: essential,
    recommendedMethods: recommended,
    optionalMethods: optional,
    totalEstimatedCostUSD: totalCost,
    totalEstimatedTimeHrs: totalTime,
    phaseSequence: phases,
    coverageSummary: `${essential.length} essential + ${recommended.length} recommended methods for comprehensive subsurface characterization. ` +
      `${optional.length} optional methods available for additional coverage or specialized targets. ` +
      `Phased approach in ${phases.length} stages from desktop to field deployment.`,
    confidenceGainEstimate: Math.min(97, baseConfidence + confidenceGain) - baseConfidence,
  };
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════

export function evaluateSurfaceGeophysics(
  lat: number, lon: number,
  existingResult: Partial<AnalysisResult>,
): SurfaceGeophysicsResult {
  console.log(`[SurfaceGeophysics] Evaluating 30 methods for ${lat.toFixed(4)}, ${lon.toFixed(4)}`);

  const ctx = extractSiteContext(lat, lon, existingResult);
  const methods = evaluate30Methods(ctx);
  const surveyPlan = generateSurveyPlan(methods, ctx);

  const applicableMethods = methods.filter(m => m.priority !== 'Not Applicable').length;

  console.log(`[SurfaceGeophysics] ${applicableMethods}/30 methods applicable (${surveyPlan.essentialMethods.length} essential, ${surveyPlan.recommendedMethods.length} recommended)`);

  return {
    methods,
    surveyPlan,
    siteContext: {
      geology: ctx.geology,
      terrainType: ctx.terrain,
      targetDepth_m: ctx.targetDepth,
      primaryObjective: 'Groundwater exploration and borehole siting',
      accessConstraints: ctx.slope > 20 ? 'Steep terrain — drone/airborne methods preferred' : ctx.slope > 10 ? 'Moderate terrain — most ground methods feasible' : 'Flat/gentle terrain — all methods feasible',
    },
    totalMethodsEvaluated: 30,
    applicableMethods,
    timestamp: new Date().toISOString(),
  };
}
