export interface BoreholeSite {
  latitude: number;
  longitude: number;
  confidence: number;
  siteType: 'valley' | 'slope' | 'flat' | 'drainage';
  vegetationDensity: number;
  waterIndicator: number;
  terrainSlope: number;
}

export interface SoilAnalysis {
  type: 'sandy' | 'clay' | 'loamy' | 'rocky' | 'laterite';
  porosity: number;
  permeability: number;
  organicMatter: number;
  pH: number;
  moistureContent: number;
  compaction: number;
  suitability: number;
  recommendations: string[];
  dataSource?: string;
  accuracy?: string;
  realSoilGrids?: boolean;
}

export interface ContaminationSource {
  type: 'sewage' | 'factory' | 'agricultural' | 'landfill' | 'industrial';
  distance: number;
  direction: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  chemicals: string[];
  riskLevel: number;
}

export interface WaterQuality {
  turbidity: number;
  tds: number;
  hardness: number;
  fluoride: number;
  iron: number;
  arsenic: number;
  nitrate: number;
  pH: number;
  isPotable: boolean;
  treatmentRequired: string[];
  score: number;
  dataSource?: string;
  accuracy?: string;
}

export interface RiskAnalysis {
  overallRisk: number;
  categories: {
    geological: number;
    contamination: number;
    depth: number;
    financial: number;
    technical: number;
  };
  contaminationRisk: {
    level: number;
    sources: ContaminationSource[];
    mitigation: string[];
  };
  recommendations: string[];
  viability: 'high' | 'medium' | 'low' | 'not_recommended';
  dataSource?: string;
  accuracy?: string;
}

/**
 * A customer-uploaded site photograph carried into the PDF report.
 * The primary photo gets the drill-point marker (crosshair + coordinates)
 * drawn over it so the customer can SEE where the drilling spot is.
 */
export interface SitePhoto {
  /** Downscaled JPEG data URL (max ~1280px, ~0.8 quality) */
  dataUrl: string;
  width: number;
  height: number;
  isPrimary: boolean;
  fileName?: string;
  /** EXIF GPS of the photo itself, when the camera recorded it */
  exifGps?: { latitude: number; longitude: number };
}

export interface AnalysisResult {
  site: BoreholeSite;
  soil: SoilAnalysis;
  waterQuality: WaterQuality;
  risk: RiskAnalysis;
  /** Customer site photographs — embedded in the PDF with the drill point marked */
  sitePhotos?: SitePhoto[];
  probability: number;
  recommendedDepth: number;
  estimatedYield: number;
  gpsSource: 'exif' | 'manual' | 'device' | 'none';
  gpsAccuracy: number;
  locationMethod?: 'exif-gps' | 'filename-geocode' | 'iptc-geocode' | 'visual-estimate' | 'device-gps' | 'manual-entry' | 'none';
  imageFingerprint?: string;
  imageForensicId?: {
    pHash: string;
    cameraSerial?: string;
    cameraMake?: string;
    cameraModel?: string;
    lensModel?: string;
    software?: string;
    exifUniqueId?: string;
    documentId?: string;
    originalDocumentId?: string;
    dateOriginal?: string;
    imageSize?: string;
    orientation?: number;
    compositeId: string; // combined unique identifier
  };
  geoEstimate?: {
    estimates: {
      rank: number;
      region: string;
      country: string;
      countryCode: string;
      subRegion?: string;
      latitude: number;
      longitude: number;
      confidence: number;
      climateZone: string;
      reasoning: string[];
    }[];
    climateZone: string;
    bestEstimate: {
      rank: number;
      region: string;
      country: string;
      countryCode: string;
      subRegion?: string;
      latitude: number;
      longitude: number;
      confidence: number;
      climateZone: string;
      reasoning: string[];
    } | null;
    isOutdoor: boolean;
    method: string;
  };
  locationContext?: {
    city?: string;
    country?: string;
    region?: string;
    filenameHint?: string;
    iptcLocation?: string;
  };
  pixelAnalysis?: {
    greenRatio: number;
    blueRatio: number;
    redRatio: number;
    brightness: number;
    textureVariance: number;
    dominantColorClass: string;
    vegetationIndex: number;
    waterIndex: number;
    soilExposureIndex: number;
    rockExposureIndex: number;
    isOutdoorScene: boolean;
    sceneConfidence: number;
    colorHistogram: { shadows: number; midtones: number; highlights: number };
    edgeDensity: number;
  };
  isReliableTerrainImage?: boolean;
  resolvedLocation?: {
    country?: string;
    countryCode?: string;
    state?: string;
    county?: string;
    /** Constituency / sub-county (OSM admin level 6 — Kenya constituencies) */
    constituency?: string;
    /** Ward / location (OSM admin level 8–10) */
    ward?: string;
    city?: string;
    suburb?: string;
    village?: string;
    road?: string;
    neighbourhood?: string;
    postcode?: string;
    displayName?: string;
    placeType?: string;
    source: 'nominatim' | 'bigdatacloud' | 'none';
    isFromImage: boolean;
  };
  locationConfidence?: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    label: string;
    drillingReliability: 'VERIFIED' | 'HIGH' | 'MODERATE' | 'LOW' | 'UNVERIFIED';
    warnings: string[];
    recommendations: string[];
    dataSources: string[];
  };
  remoteSensing?: {
    soilGrids: any;
    elevation: any;
    climate: any;
    waterIndices: any;
    surfaceWater: any;
    fetchedAt: string;
    satelliteLinks: Record<string, string>;
    availableIndices: any[];
  };
  historicalData?: {
    weather: {
      years: number;
      annualPrecipitation: { year: number; total: number }[];
      annualTemperature: { year: number; avg: number }[];
      droughtYears: number[];
      wetYears: number[];
      trendDirection: 'increasing' | 'decreasing' | 'stable';
      trendPerDecade: number;
      seasonalAnalysis: { season: string; months: string; avgPrecipitation: number }[];
      bestDrillingSeason: string;
      averageAnnualPrecipitation: number;
      averageTemperature: number;
    };
    groundwater: {
      rechargeRate: string;
      depletionRisk: 'low' | 'moderate' | 'high' | 'critical';
      waterTableTrend: 'rising' | 'stable' | 'declining' | 'rapidly_declining';
      sustainabilityScore: number;
      reasoning: string[];
    };
    fetchedAt: string;
  };
  boreholeRecords?: {
    country: string;
    countryCode: string;
    region?: string;
    averageDepth: number;
    depthRange: [number, number];
    averageYield: number;
    yieldRange: [number, number];
    successRate: number;
    totalBoreholesDrilled: string;
    commonAquiferTypes: string[];
    commonGeology: string[];
    averageCost: string;
    typicalWaterTable: string;
    databaseLinks: { name: string; url: string; description: string }[];
    source: string;
    notes: string[];
  };
  gldasGroundwater?: {
    soilMoisture: {
      layer_0_7cm: number;
      layer_7_28cm: number;
      layer_28_100cm: number;
      layer_100_255cm: number;
      totalColumn: number;
      gwettop: number;
      gwetroot: number;
      gwetprof: number;
      classification: string;
      drillingImplication: string;
      dataSource: string;
    };
    waterBudget: {
      precipitation: number;
      evapotranspiration: number;
      surfaceRunoff: number;
      baseflow: number;
      estimatedRecharge: number;
      rechargeFraction: number;
      equation: string;
      dataSource: string;
    };
    graceAnomaly: {
      twsAnomaly: number;
      trend: string;
      changeRate: number;
      basinStatus: string;
      period: string;
      dataSource: string;
    };
    groundwaterPotential: number;
    drillingFavorability: string;
    findings: string[];
    links: Record<string, string>;
    datasetInfo: {
      name: string;
      model: string;
      resolution: string;
      temporalResolution: string;
      variables: string[];
      geeCollection: string;
    };
    accuracy: {
      soilMoisture: string;
      waterBudget: string;
      storageTrend: string;
      overall: string;
    };
    fetchedAt: string;
  };
  clientLocation?: {
    country?: string;
    region?: string;
    city?: string;
    county?: string;
    village?: string;
    geocodedDisplayName?: string;
  };
  realTimeWaterData?: {
    usgsGroundwater: any;
    floodRiver: any;
    currentWeather: any;
    fetchedAt: string;
    apiStatus: {
      usgs: 'success' | 'failed' | 'not-applicable';
      flood: 'success' | 'failed';
      weather: 'success' | 'failed';
    };
  };
  subsurfaceModel?: {
    lithologicalColumn: any;
    crossSectionNS: any;
    crossSectionEW: any;
    volumetricModel: any;
    modelConfidence: number;
    dataSourceSummary: string;
    methodology: string[];
  };
  aquiferSimulation?: {
    pumpTest: any;
    coneOfDepression: any;
    transientFlow: any;
    soluteTransport: any;
    groundwaterBudget: any;
    methodology: string[];
    matchesIndustryTools: string[];
    assessmentType?: string;
    confidenceNote?: string;
  };
  /** Uncertainty ranges for key predictions — required for scientific credibility */
  uncertainty?: {
    depthRange: [number, number];      // [min, max] meters
    depthConfidence: number;           // 0-1
    yieldRange: [number, number];      // [min, max] m³/hr
    yieldConfidence: number;
    probabilityRange: [number, number]; // [min, max] as fraction
    methodology: string;               // How uncertainty was calculated
  };
  /** Per-category confidence metrics for report credibility */
  confidenceMetrics?: {
    geological: number;     // 0-100%
    terrain: number;        // 0-100%
    vegetation: number;     // 0-100%
    dataDensity: number;    // 0-100%
    waterQuality: number;   // 0-100%
    overall: number;        // 0-100% weighted average
    methodology: string;
  };
  /** Assessment type disclaimer */
  assessmentType: 'DESKTOP_ESTIMATE' | 'FIELD_VALIDATED';
  assessmentDisclaimer: string;

  /** Field validation data — when provided, overrides desktop estimates and upgrades assessmentType */
  fieldData?: FieldValidationData;

  /** Rock type classification from soil texture + climate */
  rockClassification?: {
    primaryRockType: string;
    secondaryRockType?: string;
    confidence: number;
    geologicalFormation: string;
    geologicalAge: string;
    aquiferType: string;
    aquiferProductivity: string;
    typicalKsat_m_day: [number, number];
    typicalPorosity: [number, number];
    methodology: string;
  };

  /** Advanced multi-source rock mapping (ensemble of 8 classifiers) */
  advancedRockMapping?: {
    primaryRockType: string;
    confidence: number;
    secondaryRockType?: string;
    secondaryConfidence?: number;
    geologicalFormation?: string;
    geologicalAge?: string;
    classifierResults: {
      name: string;
      rockType: string;
      confidence: number;
      dataSource: string;
    }[];
    fusionMethod: string;
    dataSources: string[];
    mineralSignatures?: string[];
    geophysicalSignatures?: {
      resistivityRange: [number, number];
      magneticSusceptibility: number;
      gravityAnomaly: number;
    };
    aquiferImplications?: {
      aquiferType: string;
      productivity: string;
      typicalYield_m3h: [number, number];
      typicalKsat_m_day: [number, number];
    };
  };

  /** Weathering depth profile */
  weatheringProfile?: {
    totalWeatheringDepth_m: number;
    saproliteDepth_m: number;
    regolithDepth_m: number;
    freshBedrockDepth_m: number;
    weatheringIntensity: string;
    aquiferZone: {
      top_m: number;
      bottom_m: number;
      type: string;
      description: string;
    };
    confidence: number;
    methodology: string;
  };

  /** Smart site selection — top 3 drilling points */
  siteSelection?: {
    topSites: {
      latitude: number;
      longitude: number;
      score: number;
      rank: number;
      probability: number;
      expectedDepth_m: number;
      expectedYield_m3h: number;
      distanceFromTarget_m: number;
      rockType: string;
      aquiferType: string;
      weatheringDepth_m: number;
      reasoning: string[];
      featureScores: Record<string, number>;
    }[];
    searchRadius_m: number;
    candidatesEvaluated: number;
    methodology: string;
    featureWeights: Record<string, number>;
  };

  /** Learning loop corrections applied */
  learningCorrection?: {
    correctionApplied: boolean;
    correctionSource: string;
    outcomeCount: number;
  };

  /** Calibration result (when field data provided) */
  calibrationResult?: {
    calibratedDepth_m: number;
    calibratedYield_m3h: number;
    depthDelta_m?: number;
    depthAccuracyPct?: number;
    yieldDelta_m3h?: number;
    yieldAccuracyPct?: number;
    confidence: number;
    confidenceTier: string;
    reportLevel: number;
    fieldDataSources: string[];
    calibrationNotes: string[];
    assessmentType?: string;
    aquiferParameters?: {
      transmissivity_m2day: number;
      storativity: number;
      hydraulicConductivity_m_day: number;
      specificCapacity_m2hr: number;
      aquiferThickness_m: number;
      aquiferType: string;
      sustainableYield_m3hr: number;
      safeDrawdown_m: number;
    };
    calibratedWaterQuality?: {
      pH: number;
      tds: number;
      iron: number;
      fluoride: number;
      arsenic: number;
      nitrate: number;
      turbidity?: number;
      coliform: number;
      hardness: number;
      isPotable: boolean;
      treatmentRequired: string[];
      source: string;
    };
  };

  /** Advanced hydro engine data (new sources) */
  graceData?: {
    twsAnomaly_cm: number;
    trend_cm_per_year: number;
    seasonalAmplitude_cm: number;
    status: string;
    aquiferStress: string;
    dataSource: string;
    period: string;
  };
  nearbyWells?: {
    nearbyWells: { id: string; distance_km: number; depth_m: number; yield_m3h?: number; waterLevel_m?: number; aquiferType?: string; lithology?: string; outcome?: 'Success' | 'Moderate' | 'Fail' | 'Unknown'; source: string }[];
    averageDepth: number;
    averageYield: number;
    averageWaterLevel: number;
    successRate: number;
    sampleSize: number;
    searchRadius_km: number;
    dataSources: string[];
  };
  demHydrology?: {
    elevation_m: number;
    slope_degrees: number;
    aspect_degrees: number;
    twi: number;
    twiClass: string;
    drainageDensity: number;
    relativePosition: string;
    groundwaterFavorability: number;
    methodology: string;
  };
  lineamentAnalysis?: {
    lineamentDensity: number;
    dominantDirection_deg: number;
    intersectionCount: number;
    fractureZoneProximity_m: number;
    aquiferEnhancement: string;
    yieldMultiplier: number;
    methodology: string;
  };
  vegetationGWProxy?: {
    ndviMean: number;
    ndviMin: number;
    ndviSeasonalRange: number;
    groundwaterDependence: string;
    shallowWaterTableLikelihood: number;
    methodology: string;
  };
  satelliteVegetation?: {
    ndviEstimate: number;
    vegetationVigor: string;
    dataSource: string;
    monthlyProfile: number[];
  };
  nasaPowerMoisture?: {
    gwetprofMean: number;
    gwetprofTrend: number;
    gwetprofMonthly: number[];
    dataSource: string;
  };
  ensembleResult?: {
    probability: number;
    depth_m: number;
    yield_m3h: number;
    confidence: number;
    sourcesUsed: number;
    sourceAgreement: string;
    bayesianUpdate: string;
    individualEstimates: { source: string; probability?: number; depth_m?: number; yield_m3h?: number; weight: number; reliability: number }[];
  };
  /** InSAR ground deformation analysis */
  insarDeformation?: {
    velocityMmYr: number;
    deformationClass: string;
    groundwaterImplication: string;
    subsidenceRisk: string;
    confidence: number;
    sentinel1Coverage: boolean;
    sceneCount: number;
    temporalSpan: string;
    dataSource: string;
    methodology: string;
    regionalContext: string;
  };
  /** Digital Subsurface Twin — physics-informed layered earth model */
  subsurfaceTwin?: {
    layers: { topDepthM: number; bottomDepthM: number; thicknessM: number; lithology: string; lithologyCode: string; porosity: number; hydraulicConductivity_m_day: number; storativity: number; isAquifer: boolean; waterBearing: boolean; confidence: number; dataSourcesUsed: string[] }[];
    totalDepthM: number;
    primaryAquiferIndex: number;
    estimatedYield_m3hr: number;
    estimatedWaterLevel_m: number;
    drillingPrognosis: { depthFrom_m: number; depthTo_m: number; expectedFormation: string; drillingDifficulty: string; expectedPenetrationRate_m_hr: number; notes: string }[];
    modelConfidence: number;
    dataSourceCount: number;
    methodology: string;
    uncertaintyBounds: { depthRange_m: [number, number]; yieldRange_m3hr: [number, number]; waterLevelRange_m: [number, number] };
  };
  /** Smart Survey Planner — AI-optimized geophysical survey recommendations */
  surveyPlan?: {
    recommendedTier: 1 | 2 | 3;
    tierName: string;
    tierDescription: string;
    totalCostUSD: number;
    totalTimeHrs: number;
    expectedConfidence: number;
    costSavingsPercent: number;
    surveys: { method: string; priority: string; reason: string; costEstimateUSD: number; timeEstimateHrs: number; deploymentLocation: string; expectedConfidenceGain: number; costPerConfidencePercent: number }[];
    reasoning: string[];
    recommendedDrillPoints: { lat: number; lon: number; rank: number; confidence: number; reason: string }[];
    riskFactors: string[];
  };

  /** Hybrid AI + Targeted Geophysics — survey elimination engine */
  hybridGeophysics?: {
    // 5-Step Pipeline
    pipeline: { step: number; title: string; subtitle: string; status: string; description: string; keyOutput: string; details: string[]; costUSD: number; timeHrs: number; icon: string }[];
    topDrillPoints: { rank: number; lat: number; lon: number; label: string; aiScore: number; reasons: string[]; estimatedDepthM: number; estimatedYieldM3hr: number; geologyNote: string; ertRecommended: boolean }[];
    ertSpec: { targetPoint: any; arrayType: string; lineLength_m: number; electrodeSpacing_m: number; numLines: number; lineOrientation: string; expectedTarget: string; successCriteria: string; costUSD: number; timeHrs: number };
    fusionResult: { preFusionDRI: number; postFusionDRI: number; driBoostPercent: number; fusionVerdict: string; fusionNarrative: string; aiPredictions: string[]; ertExpected: string[]; combinedConfidence: number };
    finalDecision: string;
    pipelineSummary: string;

    drillReadinessIndex: number;
    drillReadinessLabel: 'DRILL NOW' | 'TARGETED SURVEY' | 'FOCUSED SURVEY' | 'FULL SURVEY REQUIRED';
    driGrade: 'A' | 'B' | 'C' | 'D' | 'F';
    driColor: string;
    knowledgeDimensions: { name: string; score: number; source: string; gap: string | null; fillMethod: string | null; fillCostUSD: number; fillTimeHrs: number; confidenceGainIfFilled: number; weight: number }[];
    knowledgeGaps: { name: string; score: number; gap: string | null; fillMethod: string | null; fillCostUSD: number; confidenceGainIfFilled: number }[];
    knowledgeCoverage: number;
    costSavingsUSD: number;
    costSavingsPercent: number;
    recommendedSurveyCostUSD: number;
    fullSurveyCostUSD: number;
    adaptiveSurveySequence: { stepNumber: number; method: string; purpose: string; costUSD: number; timeHrs: number; location: string; expectedOutcome: string; decisionCriteria: string; canTerminateEarly: boolean }[];
    maxSteps: number;
    expectedSteps: number;
    executiveSummary: string;
    surveyEliminationReasoning: string[];
    aiStrengths: string[];
    aiWeaknesses: string[];
    drillerBrief: string;
    clientBrief: string;
    dataSourcesUsed: string[];
    sourceConvergence: number;
  };

  /** Advanced Geophysics Engine — Multi-Method 3D Subsurface Characterization */
  advancedGeophysics?: import('./advancedGeophysicsEngine').AdvancedGeophysicsResult;
  /** Multi-Geophysics Fusion — ERT + TDEM + Seismic + GPR + NMR → unified model */
  geophysicsFusion?: any;
  /** Borehole Intelligence DB — nearby borehole analytics */
  boreholeIntelligence?: any;
  /** Fracture & Lineament AI — DEM-based fracture mapping */
  fractureAI?: any;
  /** Aquifer Type Classifier — Bayesian aquifer classification */
  aquiferClassification?: any;
  /** Dynamic Recharge Model — monthly water balance */
  rechargeModel?: any;
  /** Probabilistic Drilling Map — spatial probability heatmap */
  drillMap?: any;
  /** Real-Time Calibration — prediction correction from drilling outcomes */
  calibrationCorrection?: any;
  /** Risk-Based Decision Engine — probabilistic risk breakdown */
  riskDecision?: any;
  /** Confidence Weighted by Data Quality */
  confidenceWeighted?: any;
  /** Micro-Siting Optimizer — exact drilling point within plot */
  microSiting?: any;

  /** Pump Test Analyzer — Theis/Cooper-Jacob analysis of pumping test data */
  pumpTestAnalysis?: any;
  /** Lithology Logger — stratigraphic analysis from drill cuttings/core logs */
  lithologyAnalysis?: any;
  /** ERT Intelligence Pipeline — full 10-step engineering-grade ERT analysis */
  ertInterpretation?: any;  // ERTIntelligenceResult from ertIntelligenceEngine.ts
  /** Multi-Source Agreement — cross-validation of all data sources */
  multiSourceAgreement?: any;
  /** Kenya county-level hydrogeological province prior (BGS/MacDonald ground truth) */
  kenyaHydroPrior?: { county: string; province: string; typicalDepthM: [number, number]; typicalYieldM3h: [number, number]; successRate: number; fluorideRisk: string; salinityRisk: string; note: string };
  /** Temporal Drought Analysis — SPI, drought cycles, sustainable yield under climate variability */
  temporalDrought?: any;
  /** Hydrochemical Predictor — water quality prediction from geology + lab validation */
  hydrochemPrediction?: any;

  // ═══ PHASE 8: PUSH TO 95% ACCURACY ═══
  /** Data Quality Scoring — transparency of satellite / field / inferred data breakdown */
  dataQualityScore?: any;
  /** Drilling Success Prediction AI — ML-style site success probability with confidence intervals */
  drillingPrediction?: any;
  /** Regional Learning Model — region-specific calibration corrections */
  regionalModel?: any;

  // ═══ BANKABLE REPORT PACKAGE ═══
  /** Verified Site Identity — GPS, boundaries, datum, site ID */
  siteIdentity?: SiteIdentity;
  /** Risk Register — explicit risk table for bankable reports */
  riskRegister?: RiskRegisterEntry[];
  /** Pump Test Protocol — planned test protocol for field validation */
  pumpTestProtocol?: PumpTestProtocol;
  /** Prediction vs Reality — template table for post-drill validation */
  predictionTable?: PredictionEntry[];
  /** Confidence Composition — detailed breakdown for bankable transparency */
  confidenceComposition?: ConfidenceComposition;
  /** Primary Drilling Recommendation — single decision point */
  drillDecision?: DrillDecision;
  /** Bankable Readiness Checklist — what's present and what's missing */
  bankableChecklist?: BankableCheckItem[];
  /** Engineer Confidence Assessment — provenance, validation, uncertainty, methodology */
  engineerConfidence?: import('./engineerConfidenceEngine').EngineerConfidenceResult;
  /** Well Design — casing, screen, gravel pack, pump, drawdown, core sampling, borehole log template */
  wellDesign?: import('./wellDesignEngine').WellDesignResult;
  drillReadiness?: import('./drillReadiness').DrillReadinessResult;
  /** Satellite Water Analysis — MODIS NDVI/EVI, ERA5 LAI/LST/ET, JRC water, Aqua satellite capabilities */
  satelliteWaterAnalysis?: import('./satelliteWaterEngine').SatelliteWaterAnalysis;
  /** Global Soil Analysis — WRB classification, hydraulic properties, soil recognition */
  globalSoilAnalysis?: import('./globalSoilEngine').GlobalSoilAnalysis;
  /** Physics-Based Groundwater Model — Darcy/Theis/mass-balance, Dempster-Shafer, OAT sensitivity, Monte Carlo ensemble */
  pinnExplainable?: import('./pinnExplainableEngine').PINNExplainableResult;
  /** Path to 97% — actionable checklist to push confidence from desktop level to bankable grade */
  pathTo97?: import('./pathTo97Engine').PathTo97Result;

  /** Satellite Remote Sensing — 10-method non-invasive analysis with multi-sensor fusion */
  satelliteRemoteSensing?: import('./satelliteRemoteSensingEngine').SatelliteRemoteSensingResult;

  /** Surface Geophysics — 30 non-invasive field/airborne/drone methods for subsurface mapping */
  surfaceGeophysics30?: import('./surfaceGeophysicsEngine').SurfaceGeophysicsResult;

  /** FINAL CONSENSUS — THE single authoritative recommendation reconciling all independent model estimates */
  finalConsensus?: import('./sanitizeOutputs').FinalConsensus;

  /** Data honesty: list of API fallbacks used (synthetic/estimated data instead of real API data) */
  fallbacksUsed?: string[];

  timestamp: string;
}

// ═══ BANKABLE REPORT TYPES ═══

export interface SiteIdentity {
  siteId: string;
  coordinates: { lat: number; lon: number; datum: string; decimals: number };
  elevation_masl: number;
  boundaryArea_ha?: number;
  coordinateSystem: string;
  locationConfidenceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  verificationMethod: string;
  mapSheet?: string;
}

export interface RiskRegisterEntry {
  risk: string;
  category: 'geological' | 'technical' | 'financial' | 'environmental' | 'operational';
  likelihood: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigation: string;
  residualRisk: 'Low' | 'Medium' | 'High';
}

export interface PumpTestProtocol {
  testType: string;
  plannedDuration_hr: number;
  plannedRates_m3hr: number[];
  acceptanceCriteria: string;
  monitoringFrequency: string;
  recoveryTest: boolean;
  stepDrawdown: boolean;
  equipmentRequired: string[];
}

export interface PredictionEntry {
  metric: string;
  predicted: string;
  actual: string;
  error: string;
  unit: string;
}

export interface ConfidenceComposition {
  aiPrior: number;
  satelliteData: number;
  geologicalModel: number;
  boreholeCalibration: number;
  dataQuality: number;
  ertAgreement?: number;
  pumpTestValidation?: number;
  finalConfidence: number;
  method: string;
}

export interface DrillDecision {
  primaryPoint: { lat: number; lon: number };
  targetDepth_m: number;
  depthRange_m: [number, number];
  expectedYield_m3hr: number;
  yieldRange_m3hr: [number, number];
  successProbability: number;
  casingDepth_m: number;
  screenInterval_m: [number, number];
  pumpType: string;
  estimatedCost_usd: number;
  alternativePoints?: { lat: number; lon: number; rank: number; score: number }[];
}

export interface BankableCheckItem {
  item: string;
  category: 'location' | 'geophysics' | 'geology' | 'aquifer' | 'water_quality' | 'calibration' | 'financial' | 'integrity';
  status: 'PRESENT' | 'PARTIAL' | 'MISSING' | 'PLANNED';
  detail: string;
  requiredForBankable: boolean;
}

/* ══════════════════════════════════════════════════════════════
   SCIENTIFIC CAPABILITY TYPES (Parts 1-7 Spec)
   ══════════════════════════════════════════════════════════════ */

export interface SciCapability {
  name: string;
  method: string;
  source: string;
  output: string;
  accuracy: string;
}

export interface MLModel {
  name: string;
  arch: string;
  input: string;
  output: string;
  training: string;
}

export interface EnsembleMethod {
  method: string;
  purpose: string;
  models: string;
  weighting: string;
}

export interface TimeSeriesForecast {
  variable: string;
  horizon: string;
  model: string;
  input: string;
  accuracy: string;
}

export interface GeoLocationMethod {
  method: string;
  tech: string;
  accuracy: string;
  source: string;
}

export interface TerrainFeature {
  feature: string;
  method: string;
  input: string;
  output: string;
  basis: string;
}

export interface VegetationIndicator {
  species: string;
  confidence: string;
  region: string;
  basis: string;
}

export interface GeolStructure {
  structure: string;
  detection: string;
  visual: string;
  confidence: string;
}

export interface PredictionWeight {
  factor: string;
  weight: number;
  source: string;
  justification: string;
}

export interface DepthCoefficient {
  variable: string;
  coefficient: string;
  pValue: string;
  significance: string;
}

export interface WQPrediction {
  parameter: string;
  method: string;
  r2: string;
  mae: string;
}

export interface CostComponent {
  component: string;
  range: string;
  unit: string;
  notes: string;
}

export interface ContaminationRiskType {
  source: string;
  detection: string;
  factors: string;
  mitigation: string;
}

export interface GeologicalRiskType {
  factor: string;
  assessment: string;
  mitigation: string;
}

export interface FinancialRiskType {
  risk: string;
  calculation: string;
  threshold: string;
}

export interface OperationalRiskType {
  risk: string;
  factors: string;
  mitigation: string;
}

export interface ReportSection {
  section: string;
  content: string;
  sources: string;
  length: string;
}

export interface MapType {
  type: string;
  data: string;
  scale: string;
  format: string;
}

export interface ChartType {
  chart: string;
  xAxis: string;
  yAxis: string;
  purpose: string;
}

export interface ExportFormat {
  format: string;
  useCase: string;
  content: string;
  schema: string;
}

export interface ValidationTarget {
  prediction: string;
  target: string;
  bestInClass: string;
  goal: string;
}

/** Field data input — when available, overrides desktop estimates and boosts confidence */
export interface FieldValidationData {
  /** ERT/Seismic survey results */
  ertSurvey?: {
    aquiferDepthM: number;
    aquiferThicknessM: number;
    resistivityOhmM: number;
    surveyDate: string;
    contractor: string;
  };
  /** 24-hour pumping test results */
  pumpTest?: {
    transmissivityM2Day: number;
    storativity: number;
    sustainableYieldM3Hr: number;
    drawdownM: number;
    recoveryPercent: number;
    testDurationHrs: number;
    testDate: string;
  };
  /** Lab sieve analysis grain-size distribution (v2 well design) */
  sieveAnalysis?: {
    curve: { sieveMM: number; passingPct: number }[];
    labName?: string;
    sampleDepth_m?: number;
    sampleDate?: string;
  };
  /** Step-drawdown test data for well loss analysis (v2 well design) */
  stepDrawdownTest?: {
    steps: { pumpingRate_m3hr: number; drawdown_m: number; duration_min: number }[];
    staticWaterLevel_m: number;
    wellRadius_m?: number;
    testDate?: string;
  };
  /** Laboratory water analysis */
  labWaterAnalysis?: {
    labName: string;
    sampleDate: string;
    pH: number;
    tds: number;
    iron: number;
    fluoride: number;
    arsenic: number;
    nitrate: number;
    turbidity: number;
    coliform: number;
    hardness: number;
    // v3 — full chemistry for LSI/RSI/AI computation
    calcium?: number;       // mg/L
    alkalinity?: number;    // mg/L as CaCO3
    sulfate?: number;       // mg/L
    chloride?: number;      // mg/L
    manganese?: number;     // mg/L
    dissolvedOxygen?: number; // mg/L
    temperature?: number;   // °C at sampling
    h2s?: boolean;          // H₂S detected
    sodium?: number;        // mg/L
    potassium?: number;     // mg/L
    magnesium?: number;     // mg/L
    bicarbonate?: number;   // mg/L
    electricalConductivity?: number; // µS/cm
  };
  /** Site demographics — for demand/sustainability analysis */
  siteDemographics?: {
    populationServed: number;
    growthRate_pct?: number;       // Default 2.5%
    perCapitaDemand_Lpd?: number;  // Default 50 L/person/day (WHO minimum)
    catchmentArea_km2?: number;
    numberOfHouseholds?: number;
    communityType?: 'rural_village' | 'peri_urban' | 'urban' | 'school' | 'clinic' | 'refugee_camp';
  };
  /** Nearby contamination sources — for setback analysis */
  contaminationSources?: {
    type: 'pit_latrine' | 'septic_tank' | 'sewage_works' | 'livestock' | 'cemetery' | 'landfill' | 'fuel_station' | 'industrial' | 'agriculture' | 'mining' | 'factory';
    estimatedDistance_m: number;
    description?: string;
  }[];
  /** Nearby hydrogeological features — for boundary assessment */
  nearbyFeatures?: {
    type: string;
    distance_m: number;
    description?: string;
  }[];
  /** Site accessibility */
  isRemoteSite?: boolean;
  /** EM / TDEM (Transient Electromagnetic) survey results */
  emTdemSurvey?: {
    method: 'TEM' | 'FDEM' | 'CSAMT' | 'AMT';
    maxDepthM: number;
    conductiveLayerTopM: number;
    conductiveLayerBottomM: number;
    conductivity_mS_m: number;
    interpretedAquifer: boolean;
    surveyDate: string;
    contractor: string;
    soundingCount: number;
    notes?: string;
  };
  /** Uploaded ERT/resistivity data file (.res, .dat, .csv) */
  ertDataFile?: {
    fileName: string;
    format: 'RES2DINV' | 'AGI_STG' | 'ABEM_AMP' | 'CSV_GENERIC';
    electrodeSpacing_m: number;
    arrayType: 'Wenner' | 'Schlumberger' | 'DipoleDipole' | 'Gradient';
    dataPoints: number;
    apparentResistivities: { a: number; n: number; rhoA: number }[];
    profileLength_m: number;
    maxDepth_m: number;
  };
  /** Local borehole records */
  localBoreholes?: {
    count: number;
    averageDepthM: number;
    averageYieldM3Hr: number;
    successRate: number;
    dataSource: string;
  };
  /** Seismic Refraction / MASW survey results */
  seismicSurvey?: {
    method: 'refraction' | 'MASW' | 'reflection' | 'crosshole';
    bedrockDepthM: number;
    weatheredZoneThicknessM: number;
    vpTopLayer_ms: number;       // P-wave velocity top layer
    vpBedrock_ms: number;        // P-wave velocity bedrock
    vsTopLayer_ms?: number;      // S-wave velocity (MASW)
    vsBedrock_ms?: number;
    layerCount: number;
    fractureZoneDepthM?: number;
    fractureZoneThicknessM?: number;
    profileLengthM: number;
    geophoneSpacingM: number;
    surveyDate: string;
    contractor: string;
    notes?: string;
  };
  /** Ground Penetrating Radar (GPR) survey results */
  gprSurvey?: {
    antennaFrequencyMHz: number;   // 25-1600 MHz
    maxPenetrationM: number;
    waterTableDepthM?: number;
    voidDetected: boolean;
    shallowAquiferDetected: boolean;
    clayLayerDepthM?: number;
    dielectricConstant?: number;
    profileLengthM: number;
    surveyDate: string;
    contractor: string;
    notes?: string;
  };
  /** Magnetic / Gravity survey results */
  magneticGravitySurvey?: {
    method: 'magnetic' | 'gravity' | 'both';
    // Magnetic
    totalFieldnT?: number;
    magneticAnomalynT?: number;
    faultLineDetected: boolean;
    faultAzimuthDeg?: number;
    dykeDetected: boolean;
    dykeDepthM?: number;
    // Gravity
    bouguerAnomaly_mGal?: number;
    residualAnomaly_mGal?: number;
    basementDepthM?: number;
    structuralFeature?: 'graben' | 'horst' | 'syncline' | 'anticline' | 'fault' | 'none';
    stationCount: number;
    surveyDate: string;
    contractor: string;
    notes?: string;
  };
  /** Nuclear Magnetic Resonance / Surface NMR (MRS) results */
  nmrSurvey?: {
    method: 'surface_NMR' | 'borehole_NMR';
    waterContentPercent: number;      // Direct water detection (0-100%)
    freeWaterDepthM: number;
    freeWaterThicknessM: number;
    hydraulicConductivity_m_day?: number;  // From T2 decay time
    t2DecayMs?: number;
    porosityPercent?: number;
    boundWaterPercent?: number;
    maxSoundingDepthM: number;
    loopSizeM: number;
    surveyDate: string;
    contractor: string;
    notes?: string;
  };

  // ── DRILLING-READINESS GATE EVIDENCE (2026-07-11) ──
  // These flip the mandatory gates in drillReadiness.ts from OUTSTANDING to
  // SATISFIED. They represent real field/professional evidence, so a report
  // can legitimately move toward "ISSUED FOR DRILLING" only when they exist.
  /** Survey-grade GPS peg physically set on site (not a photo crosshair). */
  fieldPeg?: {
    pegId: string;            // e.g. "BH-01"
    latitude: number;
    longitude: number;
    utmZone?: string;
    peggedBy: string;
    peggedDate: string;
    ertLineRef?: string;      // chainage/line the peg sits on
  };
  /** Signed hydrogeological survey report (Water Resources Regs 2025). */
  hydrogeologistSignoff?: {
    name: string;
    registrationNo: string;   // WRA/EBK registration
    reportRef?: string;
    signedDate: string;
  };
  /** WRA / NEMA authorisation reference on file. */
  wraAuthorisation?: {
    referenceNo: string;
    authorityType: 'WRA' | 'NEMA' | 'both';
    permitType?: string;
    issuedDate?: string;
  };
  /** Post-drilling lithological / water-strike log. */
  drillLog?: {
    contractor: string;
    totalDepthDrilled_m: number;
    waterStrikes_m?: number[];
    date?: string;
  };
  /** WRA Borehole Completion Record submitted (Form 008A). */
  completionRecord?: {
    submittedDate: string;
    referenceNo?: string;
  };
  /** Inverted VES sounding (from vesInversionEngine) when field resistivity data is supplied. */
  vesInversion?: import('./vesInversionEngine').VESInversionResult;
}

export interface ConfidenceLevel {
  level: string;
  criteria: string;
  interpretation: string;
}