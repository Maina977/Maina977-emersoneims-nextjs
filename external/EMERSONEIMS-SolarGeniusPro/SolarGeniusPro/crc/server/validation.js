// Zod request-validation schemas for the server's POST/GET endpoints.
// Per the project DATA POLICY, the server must validate every input at
// the system boundary so it cannot quietly coerce bad types into solar /
// financial calculations.

'use strict';

const { z } = require('zod');

const lat = z.number().gte(-90).lte(90);
const lon = z.number().gte(-180).lte(180);

const solarCalculateSchema = z.object({
  consumption: z.number().positive(),
  location: z.string().trim().min(1).optional(),
  roofType: z.string().trim().min(1).optional(),
  budget: z.number().positive().optional(),
});

const sunPositionQuerySchema = z.object({
  lat: z.coerce.number().pipe(lat),
  lon: z.coerce.number().pipe(lon),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hour: z.coerce.number().min(0).max(23.999),
});

const poaSchema = z.object({
  ghi: z.number().min(0).max(1500),
  dni: z.number().min(0).max(1500),
  dhi: z.number().min(0).max(1500),
  sunElev: z.number().min(-90).max(90),
  sunAz: z.number().min(0).max(360),
  panelTilt: z.number().min(0).max(90),
  panelAz: z.number().min(0).max(360),
  albedo: z.number().min(0).max(1).default(0.2),
});

const stringConfigSchema = z.object({
  panelVocStc: z.number().positive(),
  panelVmppStc: z.number().positive(),
  panelIscStc: z.number().positive(),
  betaVocPctC: z.number(),       // negative number, %/°C
  betaVmppPctC: z.number(),
  ambientMinC: z.number(),
  ambientMaxC: z.number(),
  inverterMaxDcV: z.number().positive(),
  inverterMpptMinV: z.number().positive(),
  inverterMpptMaxV: z.number().positive(),
  inverterMaxInputA: z.number().positive(),
  inverterMpptCount: z.number().int().positive(),
});

const wiringSchema = z.object({
  systemType: z.enum(['dc', 'ac_single_phase', 'ac_three_phase']),
  currentA: z.number().positive(),
  voltageV: z.number().positive(),
  oneWayLengthM: z.number().positive(),
  conductorMaterial: z.enum(['copper', 'aluminium']).default('copper'),
  ambientTempC: z.number().default(30),
  maxVoltDropPct: z.number().positive().default(3),
});

const ocpdSchema = z.object({
  panelIscStc: z.number().positive(),
  stringsInParallel: z.number().int().positive(),
  inverterAcKw: z.number().positive().optional(),
  acVoltageV: z.number().positive().optional(),
});

const poaAnisotropicSchema = z.object({
  ghi: z.number().min(0).max(1500),
  dni: z.number().min(0).max(1500),
  dhi: z.number().min(0).max(1500),
  sunElev: z.number().min(-90).max(90),
  sunAz: z.number().min(0).max(360),
  panelTilt: z.number().min(0).max(90),
  panelAz: z.number().min(0).max(360),
  albedo: z.number().min(0).max(1).default(0.2),
  dayOfYear: z.number().int().min(1).max(366).optional(),
});

const bifacialSchema = z.object({
  poaFront: z.number().min(0).max(1500),
  ghi: z.number().min(0).max(1500),
  tilt: z.number().min(0).max(90),
  albedo: z.number().min(0).max(1).default(0.2),
  bifacialityFactor: z.number().min(0).max(1).default(0.7),
  structureFactor: z.number().min(0).max(1).default(0.95),
});

const autoDesignSchema = z.object({
  annualConsumptionKwh: z.number().positive(),
  ambientMinC: z.number(),
  ambientMaxC: z.number(),
  panelQuery: z.string().optional(),
  inverterQuery: z.string().optional(),
  batteryQuery: z.string().optional(),
  tiltDeg: z.number().min(0).max(90),
  azimuthDeg: z.number().min(0).max(360),
  targetSpecificYieldKwhPerKwp: z.number().positive(),
  wiring: z.object({
    dcOneWayLengthM: z.number().positive().optional(),
    acOneWayLengthM: z.number().positive().optional(),
    conductorMaterial: z.enum(['copper', 'aluminium']).optional(),
  }).optional(),
});

// --- Advanced engine schemas ---
const optimizeSchema = z.object({
  annualKwh: z.number().positive(),
  peakKw: z.number().positive(),
  budgetKsh: z.number().positive(),
  daysAutonomy: z.number().positive().optional(),
  tariffKshPerKwh: z.number().positive().optional(),
});
const recommendSchema = z.object({
  annualKwh: z.number().positive(),
  roofAreaM2: z.number().positive(),
  budgetKsh: z.number().positive().optional(),
  hasGrid: z.boolean(),
  climate: z.enum(['arid', 'semiarid', 'tropical', 'temperate']).optional(),
});
const riskSchema = z.object({
  countryCode: z.string().length(2),
  gridReliability: z.number().min(0).max(1),
  currencyRiskPct: z.number().min(0).max(100).optional(),
  contractor: z.string().optional(),
  componentSourcing: z.enum(['authorised', 'mixed', 'grey-market']).optional(),
});
const confidenceSchema = z.object({
  dataSources: z.array(z.object({ name: z.string(), ageDays: z.number().nonnegative().optional() })).optional(),
  modelMape: z.number().min(0).max(1).nullable().optional(),
  shadingDataPresent: z.boolean().optional(),
  equipmentSpecsFromDatasheet: z.boolean().optional(),
});
const simEnergySchema = z.object({
  systemKwp: z.number().positive(),
  baseAnnualKwhPerKwp: z.number().positive(),
  degradationPctPerYear: z.number().min(0).max(5).optional(),
  years: z.number().int().positive().max(50).optional(),
});
const simFinancialSchema = z.object({
  capexKsh: z.number().positive(),
  annualSavingsKsh: z.number().positive(),
  oAndMKshPerYear: z.number().nonnegative().optional(),
  discountRatePct: z.number().min(0).max(50).optional(),
  tariffEscalationPct: z.number().min(-10).max(20).optional(),
  degradationPctPerYear: z.number().min(0).max(5).optional(),
  years: z.number().int().positive().max(50).optional(),
});
const simLoadSchema = z.object({
  appliances: z.array(z.object({
    name: z.string(),
    watts: z.number().positive(),
    hoursPerDay: z.number().min(0).max(24),
    dutyCycle: z.number().min(0).max(1).optional(),
    startHour: z.number().int().min(0).max(23).optional(),
  })).min(1),
});
const whatIfSchema = z.object({
  base: z.record(z.any()),
  changes: z.record(z.any()),
});
const auditEntrySchema = z.object({
  actor: z.string().min(1),
  action: z.string().min(1),
  target: z.string().optional(),
  payload: z.record(z.any()).optional(),
  tenantId: z.string().optional(),
});
const biasSchema = z.object({
  predictions: z.array(z.object({ group: z.string(), value: z.number() })).min(1),
});
const driftSchema = z.object({
  baseline: z.array(z.number()).min(10),
  current:  z.array(z.number()).min(10),
  bins:     z.number().int().min(2).max(50).optional(),
});
const explainSchema = z.object({
  baseValue: z.number(),
  prediction: z.number().optional(),
  contributions: z.array(z.object({ feature: z.string(), value: z.number() })).min(1),
});
const cleanDataSchema = z.object({
  records: z.array(z.record(z.any())).min(1),
});
const normalizeSchema = z.object({
  values: z.array(z.number()).min(1),
  targetRange: z.tuple([z.number(), z.number()]).optional(),
});
const validateSolarSchema = z.record(z.any());
const feedbackSchema = z.object({
  modelId: z.string().min(1),
  predicted: z.number(),
  actual: z.number(),
  tenantId: z.string().optional(),
  note: z.string().optional(),
});
const performanceSchema = z.object({
  modelId: z.string().min(1),
  predictions: z.array(z.number()).min(1),
  actuals:     z.array(z.number()).min(1),
});
const lifecycleSchema = z.object({
  systemKw: z.number().positive(),
  capexKsh: z.number().positive(),
  baseAnnualKwh: z.number().positive(),
  tariffKshPerKwh: z.number().positive(),
  degradationPctPerYear: z.number().min(0).max(5).optional(),
  tariffEscalationPctPerYear: z.number().min(-10).max(20).optional(),
  discountRatePct: z.number().min(0).max(50).optional(),
  inverterReplaceYear: z.number().int().positive().optional(),
  inverterReplaceCostKsh: z.number().nonnegative().optional(),
  batteryReplaceYear: z.number().int().positive().optional(),
  batteryReplaceCostKsh: z.number().nonnegative().optional(),
  years: z.number().int().positive().max(50).optional(),
});
const supplierSchema = z.object({
  priceVsMedianPct: z.number(),
  leadTimeDays: z.number().nonnegative(),
  warrantySupportScore: z.number().min(0).max(1).optional(),
  disputeRatePct: z.number().min(0).max(100).optional(),
});

const roofAutofillSchema = z.object({
  lat: lat,
  lon: lon,
  searchRadiusM: z.number().min(5).max(200).optional(),
  assumedPitchDegrees: z.number().min(0).max(60).optional(),
  externalGeoJson: z.any().optional(),
});

/**
 * Express middleware factory. Validates `source` (body|query) against schema.
 * On failure responds 400 with a structured `issues` array.
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'validation_failed',
        issues: result.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
          code: i.code,
        })),
      });
    }
    req[source] = result.data;
    next();
  };
}

module.exports = {
  validate,
  schemas: {
    solarCalculate: solarCalculateSchema,
    sunPositionQuery: sunPositionQuerySchema,
    poa: poaSchema,
    stringConfig: stringConfigSchema,
    wiring: wiringSchema,
    ocpd: ocpdSchema,
    poaAnisotropic: poaAnisotropicSchema,
    bifacial: bifacialSchema,
    autoDesign: autoDesignSchema,
    optimize: optimizeSchema,
    recommend: recommendSchema,
    risk: riskSchema,
    confidence: confidenceSchema,
    simEnergy: simEnergySchema,
    simFinancial: simFinancialSchema,
    simLoad: simLoadSchema,
    whatIf: whatIfSchema,
    auditEntry: auditEntrySchema,
    bias: biasSchema,
    drift: driftSchema,
    explain: explainSchema,
    cleanData: cleanDataSchema,
    normalize: normalizeSchema,
    validateSolar: validateSolarSchema,
    feedback: feedbackSchema,
    performance: performanceSchema,
    lifecycle: lifecycleSchema,
    supplier: supplierSchema,
    roofAutofill: roofAutofillSchema,
  },
};
