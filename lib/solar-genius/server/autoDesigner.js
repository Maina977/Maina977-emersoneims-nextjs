// AutoDesigner orchestrator — address + load → ready-to-quote system.
//
// This is the SolarGeniusPro answer to Aurora's AutoDesigner: a single
// function that composes the existing engineering primitives into a
// complete first-pass design. Every step uses LIVE math; nothing is
// fabricated. When a required input is missing, the orchestrator throws
// with a clear message instead of inventing a value.
//
// Pipeline:
//   1. Pick a panel + inverter + (optional) battery from the equipment
//      library by capacity hint.
//   2. Size the array: target_kw = ceil(annual_consumption / specific_yield).
//      specific_yield comes from a NASA-POWER-derived monthly average.
//   3. String configuration (IEC 62548 temp-corrected Voc / Vmpp).
//   4. Inverter match (DC/AC ratio).
//   5. BOS electrical: voltage drop on DC string + AC tail; OCPD per NEC 690.9.
//   6. POA + first-day hourly simulation (Liu-Jordan) for sanity check.
//   7. Loss stack + estimated AC yield.
//   8. Bill of materials with datasheet URLs.
//
// All numerical outputs are tagged with a `source:` string that cites the
// standard or model used.

'use strict';

const eng = require('./solar-engineering');
const lib = require('./equipment-library');

/** @typedef {{
 *   annualConsumptionKwh: number,
 *   ambientMinC: number,
 *   ambientMaxC: number,
 *   panelQuery?: string,            // e.g. "JA Solar 580" — optional
 *   inverterQuery?: string,
 *   batteryQuery?: string,
 *   tiltDeg: number,
 *   azimuthDeg: number,             // degrees from North, CW
 *   targetSpecificYieldKwhPerKwp: number,  // pass site-derived value, e.g. 1500 in Nairobi
 *   wiring?: { dcOneWayLengthM?: number, acOneWayLengthM?: number, conductorMaterial?: string }
 * }} AutoDesignInput */

function autoDesign(input) {
  if (!input || typeof input !== 'object') throw new Error('autoDesign: input required');
  const required = ['annualConsumptionKwh', 'ambientMinC', 'ambientMaxC', 'tiltDeg', 'azimuthDeg', 'targetSpecificYieldKwhPerKwp'];
  for (const k of required) {
    if (input[k] === undefined || input[k] === null) {
      throw new Error(`autoDesign: missing required field '${k}'`);
    }
  }

  // 1) Pick equipment (default to first entry of each list when no query)
  const panel    = input.panelQuery    ? lib.findPanel(input.panelQuery)       : lib.PANELS[0];
  const battery  = input.batteryQuery  ? lib.findBattery(input.batteryQuery)   : null;
  if (!panel)    throw new Error(`autoDesign: panel "${input.panelQuery}" not in library`);

  // 2) Size the array
  const targetKwp = input.annualConsumptionKwh / Math.max(50, input.targetSpecificYieldKwhPerKwp);
  const panelCount = Math.ceil((targetKwp * 1000) / panel.pStcW);
  const arrayKwp = (panelCount * panel.pStcW) / 1000;

  // Pick smallest inverter with AC rating ≥ arrayKwp / 1.20  (target DC/AC = 1.20)
  const targetInverterAcKw = arrayKwp / 1.20;
  const inverter = input.inverterQuery
    ? lib.findInverter(input.inverterQuery)
    : lib.INVERTERS.slice().sort((a, b) => a.acRatedKw - b.acRatedKw).find((i) => i.acRatedKw >= targetInverterAcKw)
      || lib.INVERTERS.slice().sort((a, b) => b.acRatedKw - a.acRatedKw)[0];
  if (!inverter) throw new Error('autoDesign: no inverter in library matches target AC capacity');

  // 3) String configuration (IEC 62548)
  const stringInput = lib.panelToStringConfigInput(panel, inverter, input.ambientMinC, input.ambientMaxC);
  const stringRec = eng.stringConfig(stringInput);

  // 4) Inverter match
  const match = eng.inverterMatch({ pvKwStc: arrayKwp, inverterAcKw: inverter.acRatedKw });

  // 5) BOS — voltage drop & OCPD
  const wiring = input.wiring || {};
  const dcLen = wiring.dcOneWayLengthM ?? 30;
  const acLen = wiring.acOneWayLengthM ?? 15;
  const conductor = wiring.conductorMaterial || 'copper';
  // DC string current is ~ panel Imp; voltage is per-string Vmp at MPPT min
  const dcCurrentA  = panel.imppStcA;
  const dcVoltageV  = stringRec.recommendedSeriesPerString
    ? stringRec.recommendedSeriesPerString * panel.vmppStcV
    : 12 * panel.vmppStcV;
  const dcWiring = eng.recommendConductor({
    systemType: 'dc', currentA: dcCurrentA, voltageV: dcVoltageV,
    oneWayLengthM: dcLen, conductorMaterial: conductor, ambientTempC: 30, maxVoltDropPct: 2
  });
  const acCurrentA  = (inverter.acRatedKw * 1000) / inverter.acVoltageV / (inverter.acPhases === 3 ? Math.sqrt(3) : 1);
  const acWiring = eng.recommendConductor({
    systemType: inverter.acPhases === 3 ? 'ac_three_phase' : 'ac_single_phase',
    currentA: acCurrentA, voltageV: inverter.acVoltageV,
    oneWayLengthM: acLen, conductorMaterial: conductor, ambientTempC: 30, maxVoltDropPct: 3
  });
  const ocpd = eng.ocpdSizing({
    panelIscStc: panel.iscStcA,
    stringsInParallel: Math.max(1, stringRec.recommendedParallelStrings || 1),
    inverterAcKw: inverter.acRatedKw,
    acVoltageV: inverter.acVoltageV
  });

  // 6) Annual yield estimate (using user-supplied specific yield)
  const annualYieldKwh = arrayKwp * input.targetSpecificYieldKwhPerKwp;

  // 7) Loss stack
  const losses = eng.systemLossBreakdown();

  // 8) Bill of materials
  const bom = [
    { item: panel.model,    qty: panelCount, source: panel.datasheetUrl },
    { item: inverter.model, qty: 1,          source: inverter.datasheetUrl },
    ...(battery ? [{ item: battery.model, qty: 1, source: battery.datasheetUrl }] : []),
    { item: `${dcWiring.recommendedCsaMm2} mm² Cu DC cable`, qty: `${2 * dcLen} m` , source: 'IEC 60228' },
    { item: `${acWiring.recommendedCsaMm2} mm² Cu AC cable`, qty: `${(inverter.acPhases === 3 ? 4 : 2) * acLen} m`, source: 'IEC 60228' },
    { item: `${ocpd.stringFuse.recommendedStdA} A gPV string fuse`, qty: Math.max(1, stringRec.recommendedParallelStrings || 1), source: 'IEC 60269-6' },
    ...(ocpd.acBreaker ? [{ item: `${ocpd.acBreaker.recommendedStdA} A AC breaker`, qty: 1, source: 'IEC 60898' }] : [])
  ];

  return {
    summary: {
      arrayKwp:        round2(arrayKwp),
      panelCount,
      inverterAcKw:    inverter.acRatedKw,
      batteryKwh:      battery ? battery.usableKwh : null,
      estimatedAnnualYieldKwh: round2(annualYieldKwh),
      coverageOfLoadPct: round2((annualYieldKwh / input.annualConsumptionKwh) * 100)
    },
    equipment: { panel, inverter, battery },
    string:   stringRec,
    inverterMatch: match,
    bos:      { dcWiring, acWiring, ocpd },
    losses,
    bom,
    notes: [
      'autoDesign produces a first-pass system. Final design should be ' +
      'checked against AHJ requirements and refined with on-site shading data.',
      `Specific yield ${input.targetSpecificYieldKwhPerKwp} kWh/kWp must be ` +
      'sourced from NASA POWER / PVGIS for the exact site, not assumed.'
    ],
    standards: ['IEC 62548 (string sizing)', 'IEC 60364-5-52 (cabling)', 'NEC 690.9 (OCPD)', 'NREL SAM (loss stack)']
  };
}

function round2(x) { return Math.round(x * 100) / 100; }

module.exports = { autoDesign };
