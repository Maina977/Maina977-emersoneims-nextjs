/**
 * Generator Oracle benchmark fault problems (2026-11-25). ALL SYNTHETIC: each
 * case is hand-built from general diesel-generator practice to exercise a rule
 * path; none is a real field fault, and passing them is NOT field validation.
 * OEM figures are TEST values a technician would type from the manual.
 * Expected results are hand-derived from the rule definitions
 * (strongly +3, supports +1, contradicts −1; STOPs first, then mandatory safety, then CAUTIONs).
 */
export interface BenchmarkCase {
  id: string;
  category: 'simple' | 'complex' | 'boundary' | 'invalid input' | 'missing evidence' | 'safety-critical';
  family: string;
  problem: string;
  principle: string;
  inputs: Record<string, string>;
  expect: {
    stops: Array<'STOP' | 'CAUTION'>;
    /** Leading ranked causes, in order, with scores. */
    top: Array<[string, number]>;
    excludedIncludes?: string[];
    invalid?: string[];
    nextQuestion?: string | null;
  };
  source: string;
}

export const BENCHMARK_CASES: BenchmarkCase[] = [
  {
    id: 'B01', category: 'simple', family: 'frequency-hunting',
    problem: 'Single set hunts about 1.2 Hz at no load; linkage found sticking.',
    principle: 'Hunting at no load with a sticking linkage points to the linkage before load or fuel causes.',
    inputs: { overspeedTrip: 'no', linkage: 'sticking', parallel: 'single', freqSwing: '1.2', oemMaxSwing: '0.5', whenObserved: 'no-load', governorType: 'electronic', fuelSupply: 'ok', speedSensor: 'ok', gainChanged: 'no', loadType: 'none', voltageHunts: 'no' },
    expect: { stops: ['CAUTION', 'CAUTION', 'CAUTION'], top: [['linkage', 4], ['gain', 0], ['fuel', -1]], excludedIncludes: ['within-band', 'load', 'sensor'] },
    source: 'SYNTHETIC; general governing practice; ISO 3046-4 / ISO 8528-5 cited by title only.',
  },
  {
    id: 'B02', category: 'safety-critical', family: 'overspeed',
    problem: 'Controller overspeed shutdown when the breaker opened; log 1720 rpm, trip entered 1700 rpm, rated 1500 rpm.',
    principle: 'An overspeed trip is a protective STOP; a trip on load rejection with a logged speed above the setting is a real overspeed (governor response).',
    inputs: { tripSource: 'controller', runaway: 'no', oilIntake: 'none', linkage: 'ok', whenTripped: 'load-rejection', peakRpm: '1720', oemTripRpm: '1700', 'oemTripRpm.class': 'shutdown', 'oemTripRpm.source': 'TEST settings sheet p. 1', ratedRpm: '1500', speedSensor: 'ok', settingsChanged: 'no' },
    expect: { stops: ['STOP', 'STOP', 'CAUTION', 'CAUTION'], top: [['governor-response', 4], ['sensor-false', -1]], excludedIncludes: ['linkage', 'oil-fuel'], nextQuestion: 'screen.alarm' },
    source: 'SYNTHETIC; DSE 057-074 Issue 13 p. 97 describes the OVERSPEED shutdown meaning (DSE7200/7300 only).',
  },
  {
    id: 'B03', category: 'simple', family: 'charging',
    problem: '24 V set: battery 24.6 V running against a 27.0–29.0 V band entered; charge-fail alarm.',
    principle: 'Running voltage below the regulated band with a charge-fail alarm: alternator/regulator undercharge.',
    inputs: { batteryCondition: 'normal', belt: 'ok', systemVoltage: '24', source: 'alternator', runVoltage: '24.6', oemChargeMin: '27', 'oemChargeMin.class': 'warning', oemChargeMax: '29', 'oemChargeMax.class': 'shutdown', restVoltage: '24.2', chargeAlarm: 'yes', excitation: 'ok', terminals: 'clean' },
    expect: { stops: ['CAUTION', 'CAUTION', 'CAUTION'], top: [['alt-under', 4], ['battery', 0]], excludedIncludes: ['alt-over', 'belt', 'excitation'] },
    source: 'SYNTHETIC; BCI rest-voltage guide; DSE 057-074 p. 95 CHARGE FAILURE meaning (DSE7200/7300 only).',
  },
  {
    id: 'B04', category: 'simple', family: 'exhaust-smoke',
    problem: 'Black smoke at high load; load 115 % of rating; air filter clean.',
    principle: 'Black smoke with load above rating and a clean filter: overload first, injectors second.',
    inputs: { colour: 'black', when: 'full-load', loadPct: '115', airFilter: 'ok', injectors: 'not-tested', coolantLoss: 'none', oilCondition: 'normal', turboOil: 'none', smell: 'normal' },
    expect: { stops: ['CAUTION', 'CAUTION', 'CAUTION'], top: [['overload', 3], ['injectors', 1]], excludedIncludes: ['air', 'coolant', 'turbo-seal'] },
    source: 'SYNTHETIC; ISO 8528-1 rating definitions cited by title only.',
  },
  {
    id: 'B05', category: 'safety-critical', family: 'exhaust-smoke',
    problem: 'White smoke, coolant level falling, sweet exhaust smell; long light-load running.',
    principle: 'Coolant entering cylinders risks hydraulic lock: STOP, no running check (load bank) may follow.',
    inputs: { colour: 'white', coolantLoss: 'losing', smell: 'sweet', lightLoad: 'yes', oilCondition: 'normal', turboOil: 'none' },
    expect: { stops: ['STOP', 'CAUTION', 'CAUTION', 'CAUTION'], top: [['coolant', 7], ['wet-stacking', 3]] },
    source: 'SYNTHETIC; general diesel practice.',
  },
  {
    id: 'B06', category: 'boundary', family: 'charging',
    problem: 'Running voltage exactly equal to the highest charging voltage entered (29.0 V), classified as a shutdown value.',
    principle: 'Exact-threshold rule: equality counts as reaching the limit; a shutdown value reached gives STOP and supports overcharge.',
    inputs: { systemVoltage: '24', runVoltage: '29', oemChargeMin: '27', oemChargeMax: '29', 'oemChargeMax.class': 'shutdown', batteryCondition: 'normal' },
    expect: { stops: ['STOP', 'CAUTION', 'CAUTION'], top: [['alt-over', 3], ['belt', 0], ['alt-under', 0]] },
    source: 'SYNTHETIC; management exact-threshold rule 2026-11-25.',
  },
  {
    id: 'B06b', category: 'boundary', family: 'charging',
    problem: 'Running voltage just below the same shutdown maximum (28.9 V against 29.0 V).',
    principle: 'Strictly inside the band: no limit message; overcharge and undercharge both excluded.',
    inputs: { systemVoltage: '24', runVoltage: '28.9', oemChargeMin: '27', oemChargeMax: '29', 'oemChargeMax.class': 'shutdown', batteryCondition: 'normal' },
    expect: { stops: ['CAUTION', 'CAUTION'], top: [['belt', 0]], excludedIncludes: ['alt-under', 'alt-over'] },
    source: 'SYNTHETIC; management exact-threshold rule 2026-11-25.',
  },
  {
    id: 'B07', category: 'boundary', family: 'frequency-hunting',
    problem: 'Swing exactly equal to the band entered (0.5 Hz); the band is not classified.',
    principle: 'Non-protective parameter: equality reaches the band; unclassified → CAUTION that says so (not a shutdown); "within band" is excluded.',
    inputs: { freqSwing: '0.5', oemMaxSwing: '0.5', parallel: 'single', overspeedTrip: 'no', linkage: 'ok' },
    expect: { stops: ['CAUTION', 'CAUTION', 'CAUTION'], top: [['gain', 0], ['fuel', 0]], excludedIncludes: ['linkage', 'parallel', 'within-band'], nextQuestion: 'oemMaxSwing' },
    source: 'SYNTHETIC; management exact-threshold rule 2026-11-25.',
  },
  {
    id: 'B07b', category: 'boundary', family: 'frequency-hunting',
    problem: 'Swing just above a band classified as a warning value (0.6 Hz against 0.5 Hz).',
    principle: 'A warning value gives CAUTION only; a shutdown is never derived from it.',
    inputs: { freqSwing: '0.6', oemMaxSwing: '0.5', 'oemMaxSwing.class': 'warning', parallel: 'single', overspeedTrip: 'no', linkage: 'ok' },
    expect: { stops: ['CAUTION', 'CAUTION', 'CAUTION'], top: [['gain', 0], ['fuel', 0]], excludedIncludes: ['within-band'] },
    source: 'SYNTHETIC; management exact-threshold rule 2026-11-25.',
  },
  {
    id: 'B14', category: 'boundary', family: 'low-oil-pressure',
    problem: 'Oil pressure exactly at the OEM minimum entered (200 kPa), classification not stated, oil level correct.',
    principle: 'Protective parameter: an unclassified limit reached is treated as a shutdown limit → STOP ("confirm against the OEM manual"); the classification is still asked next.',
    inputs: { oilPressure: '200', 'oilPressure.unit': 'kPa', oemMinOilPressure: '200', 'oemMinOilPressure.unit': 'kPa', oilLevel: 'ok' },
    expect: { stops: ['STOP'], top: [['sender', 0]], excludedIncludes: ['level'], nextQuestion: 'oemMinOilPressure' },
    source: 'SYNTHETIC; management exact-threshold rule 2026-11-25.',
  },
  {
    id: 'B15', category: 'safety-critical', family: 'overheating',
    problem: 'Coolant exactly at a shutdown maximum entered (103 °C), sensor tolerance ±2 °C.',
    principle: 'Equality with a shutdown value → STOP; the tolerance does not soften a reached limit.',
    inputs: { coolantTemp: '103', 'coolantTemp.unit': '°C', 'coolantTemp.tol': '2', oemAlarmCoolantTemp: '103', 'oemAlarmCoolantTemp.unit': '°C', 'oemAlarmCoolantTemp.class': 'shutdown', 'oemAlarmCoolantTemp.source': 'TEST manual p. 3', coolantLevel: 'ok' },
    expect: { stops: ['STOP'], top: [['gasket', 0]], excludedIncludes: ['low-coolant'] },
    source: 'SYNTHETIC; management exact-threshold rule 2026-11-25.',
  },
  {
    id: 'B08', category: 'invalid input', family: 'charging',
    problem: 'A 27–29 V band typed for a 12 V system, running 30 V.',
    principle: 'Implausible band for the system voltage is refused as a pair; with no valid band no limit is invented (no STOP).',
    inputs: { systemVoltage: '12', oemChargeMin: '27', oemChargeMax: '29', runVoltage: '30' },
    expect: { stops: ['CAUTION', 'CAUTION'], top: [['belt', 0]], invalid: ['oemChargeMin', 'oemChargeMax'] },
    source: 'SYNTHETIC; plausibility split at 18 V between 12 V and 24 V systems (not an OEM limit).',
  },
  {
    id: 'B09', category: 'invalid input', family: 'overspeed',
    problem: 'Negative logged speed and an unknown trip source typed.',
    principle: 'Readings outside the physical range and unknown options are refused, never clipped or guessed.',
    inputs: { peakRpm: '-5', tripSource: 'magic' },
    expect: { stops: ['CAUTION', 'CAUTION'], top: [['governor-response', 0]], invalid: ['tripSource', 'peakRpm'], nextQuestion: 'screen.alarm' },
    source: 'SYNTHETIC; engine validation.',
  },
  {
    id: 'B10', category: 'missing evidence', family: 'overspeed',
    problem: 'Nothing recorded yet.',
    principle: 'No evidence → no cause above 0; mandatory safety shown; the safety question is asked first.',
    inputs: {},
    expect: { stops: ['CAUTION', 'CAUTION'], top: [['governor-response', 0], ['linkage', 0]], nextQuestion: 'screen.alarm' },
    source: 'SYNTHETIC.',
  },
  {
    id: 'B11', category: 'complex', family: 'overspeed',
    problem: 'Engine ran away (would not stop), trip source unknown, oil found in the intake.',
    principle: 'Runaway on engine oil: three STOPs, oil ingestion leads; no test run is offered.',
    inputs: { tripSource: 'unknown', runaway: 'yes', oilIntake: 'oil-in-intake' },
    expect: { stops: ['STOP', 'STOP', 'STOP', 'CAUTION', 'CAUTION'], top: [['oil-fuel', 4]] },
    source: 'SYNTHETIC; general diesel practice.',
  },
  {
    id: 'B12', category: 'complex', family: 'charging',
    problem: '12 V set, battery hot and swollen, rests at 11.9 V though charging voltage 14.0 V is inside a 13.5–14.6 V band entered.',
    principle: 'Thermal-runaway risk → STOP; the battery (not the alternator) leads because the charging voltage is in band.',
    inputs: { batteryCondition: 'hot-swollen', source: 'both', systemVoltage: '12', restVoltage: '11.9', runVoltage: '14', oemChargeMin: '13.5', oemChargeMax: '14.6' },
    expect: { stops: ['STOP', 'CAUTION', 'CAUTION', 'CAUTION'], top: [['battery', 6]], excludedIncludes: ['alt-under', 'alt-over'] },
    source: 'SYNTHETIC; BCI rest-voltage guide; IEEE Std 450 / 1188 cited by title only.',
  },
  {
    id: 'B13', category: 'safety-critical', family: 'frequency-hunting',
    problem: 'Set in parallel hunted until it tripped on overspeed.',
    principle: 'Overspeed trip → STOP and refer to the overspeed workflow; the parallel CAUTION follows; no gain re-tune (running check) offered.',
    inputs: { overspeedTrip: 'yes', parallel: 'parallel', gainChanged: 'yes' },
    expect: { stops: ['STOP', 'CAUTION', 'CAUTION', 'CAUTION'], top: [['gain', 3], ['parallel', 3]] },
    source: 'SYNTHETIC; general governing practice.',
  },
];
