/**
 * CURATED FAULT CODES — aggregation of the hand-written datasets.
 *
 * Pulls together the two verified collections that existed in the repository
 * but were never wired into the diagnostic API:
 *
 *   1. Controller fault codes — lib/generator-oracle/data/*-fault-codes.ts
 *      Hand-written per controller family (DSE, ComAp, Woodward, SmartGen,
 *      PowerWizard, Datakom, Lovato, Siemens, Enko, Vodia). Each entry has
 *      code-specific description, likelihood-weighted causes, verification
 *      steps and remedies. These files carry an explicit copyright posture:
 *      code NUMBERS are used as industry-standard identifiers, and every
 *      DESCRIPTION is independently written rather than copied from an OEM
 *      manual, with a non-affiliation and trademark notice.
 *
 *   2. Solar inverter and battery fault codes —
 *      lib/maintenance-hub/solar-fault-codes.ts
 *
 * DELIBERATELY EXCLUDED: generateExtendedCodes() in
 * lib/generator-oracle/controllerFaultCodes.ts. That function is not a dataset.
 * It walks every integer in ~99 declared numeric ranges, multiplies by the
 * model list for each brand, titles the result `Extended ${subcat} Alarm
 * ${code}`, picks the subcategory with `code % subcategories.length` and — most
 * seriously — assigns severity from the last digit of the code number:
 *
 *     const severity = code % 10 < 3 ? 'shutdown' : code % 10 < 6 ? 'critical' : 'warning';
 *
 * That expansion is where the site's former "400,000+ fault codes" headline came
 * from: ~9,844 integers across the declared ranges, multiplied by 81 controller
 * models. It is generated, not curated. A severity derived
 * from a code's final digit is not a diagnosis, and this site is used as a
 * reference by engineers, so it must never reach a lookup result.
 */

import { getComApFaultCodes } from '@/lib/generator-oracle/data/comap-fault-codes';
import { getDatakomFaultCodes } from '@/lib/generator-oracle/data/datakom-fault-codes';
import { getDSEFaultCodes } from '@/lib/generator-oracle/data/dse-fault-codes';
import { getEnkoFaultCodes } from '@/lib/generator-oracle/data/enko-fault-codes';
import { getLovatoFaultCodes } from '@/lib/generator-oracle/data/lovato-fault-codes';
import { getPowerWizardFaultCodes } from '@/lib/generator-oracle/data/powerwizard-fault-codes';
import { getSiemensFaultCodes } from '@/lib/generator-oracle/data/siemens-fault-codes';
import { getSmartGenFaultCodes } from '@/lib/generator-oracle/data/smartgen-fault-codes';
import { getVODIAFaultCodes } from '@/lib/generator-oracle/data/vodia-fault-codes';
import { getWoodwardFaultCodes } from '@/lib/generator-oracle/data/woodward-fault-codes';
import { INVERTER_FAULT_CODES, BATTERY_FAULT_CODES } from '@/lib/maintenance-hub/solar-fault-codes';
import { J1939_FAULT_CODES } from '@/lib/data/j1939FaultCodes';

export interface CuratedFaultCode {
  code: string;
  brand: string;
  model: string;
  /**
   * Every model this one code applies to. The controller data files emit one
   * row per model; those rows are collapsed into a single code carrying this
   * list. See dedupeByBrandAndCode() below.
   */
  models?: string[];
  service: string;
  category: string;
  issue: string;
  severity: string;
  symptoms: string[];
  causes: string[];
  solution: string;
  parts: string[];
  tools: string[];
  downtime: string;
  preventive: string;
  verified: boolean;
  // The controller data files carry a full diagnostic payload per code. An
  // earlier version of this mapper kept only causes and solution, which threw
  // away the ordered diagnostic sequence, the reset procedure and the safety
  // warnings on 54,192 entries — the most valuable fields in the set. They are
  // preserved now.
  summary?: string;
  diagnosticSteps?: { step: number; action: string; expectedResult: string; tools?: string[] }[];
  safetyWarnings?: string[];
  resetSteps?: string[];
  causeDetail?: { likelihood: string; cause: string; verification: string }[];
  enriched?: boolean;
}

const text = (v: unknown): string => (typeof v === 'string' ? v : '');
const list = (v: unknown): string[] => (Array.isArray(v) ? v.filter(x => typeof x === 'string') : []);

/** Controller entries. Severity here is hand-assigned per code, so it is kept. */
function fromController(c: any, family: string): CuratedFaultCode {
  const causes = Array.isArray(c?.possibleCauses)
    ? c.possibleCauses.map((x: any) => (typeof x === 'string' ? x : text(x?.cause))).filter(Boolean)
    : [];
  const solutions = Array.isArray(c?.solutions)
    ? c.solutions.map((s: any) => (typeof s === 'string' ? s : text(s?.solution) || text(s?.action))).filter(Boolean)
    : [];

  // Ordered diagnostic sequence with the reading expected at each step.
  const steps = Array.isArray(c?.diagnosticSteps)
    ? c.diagnosticSteps.map((d: any, i: number) => ({
        step: typeof d?.step === 'number' ? d.step : i + 1,
        action: text(d?.action),
        expectedResult: text(d?.expectedResult) || text(d?.expect),
        tools: list(d?.tools),
      })).filter((d: any) => d.action)
    : [];

  // Likelihood-weighted causes with how to verify each one.
  const causeDetail = Array.isArray(c?.possibleCauses)
    ? c.possibleCauses
        .filter((x: any) => x && typeof x === 'object')
        .map((x: any) => ({
          likelihood: text(x?.likelihood) || 'medium',
          cause: text(x?.cause),
          verification: text(x?.verification),
        }))
        .filter((x: any) => x.cause)
    : [];

  // Reset pathway steps — how the fault is actually cleared on the controller.
  const resetSteps = Array.isArray(c?.resetPathways)
    ? c.resetPathways.flatMap((r: any) => list(r?.steps))
    : [];

  // Tools referenced by the diagnostic steps and the solutions.
  const toolSet = new Set<string>();
  for (const d of steps) for (const t of d.tools || []) toolSet.add(t);
  if (Array.isArray(c?.solutions)) {
    for (const s of c.solutions) for (const t of list(s?.tools)) toolSet.add(t);
  }

  return {
    code: text(c?.code),
    brand: text(c?.brand) || family,
    model: text(c?.model) || 'All Models',
    service: `${family} Controller Diagnostics`,
    category: text(c?.category) || 'Controller',
    issue: text(c?.title) || text(c?.description),
    severity: (text(c?.severity) || 'UNSPECIFIED').toUpperCase(),
    symptoms: list(c?.symptoms),
    causes,
    solution: solutions.join('; '),
    parts: Array.isArray(c?.solutions) ? c.solutions.flatMap((s: any) => list(s?.parts)) : [],
    tools: [...toolSet],
    downtime: Array.isArray(c?.solutions) ? text(c.solutions[0]?.timeEstimate) : '',
    preventive: list(c?.preventiveMeasures).join('; '),
    verified: true,
    summary: text(c?.description),
    diagnosticSteps: steps,
    safetyWarnings: list(c?.safetyWarnings),
    resetSteps,
    causeDetail,
    enriched: steps.length > 0,
  };
}

function fromSolar(c: any, kind: 'Inverter' | 'Battery'): CuratedFaultCode {
  return {
    code: text(c?.code),
    brand: text(c?.brand),
    model: text(c?.model) || 'All Models',
    service: `Solar ${kind} Diagnostics`,
    category: `Solar ${kind}`,
    issue: text(c?.title) || text(c?.description),
    severity: (text(c?.severity) || 'UNSPECIFIED').toUpperCase(),
    symptoms: [],
    causes: list(c?.causes),
    solution: list(c?.solutions).join('; '),
    parts: list(c?.partsRequired),
    tools: [],
    downtime: text(c?.estimatedCost),
    preventive: list(c?.preventiveMeasures).join('; '),
    verified: true,
    summary: text(c?.description),
    resetSteps: list(c?.resetProcedure),
    enriched: list(c?.solutions).length > 0,
  };
}

const controllerSources: Array<[string, () => any[]]> = [
  ['DeepSea Electronics', getDSEFaultCodes],
  ['ComAp', getComApFaultCodes],
  ['Woodward', getWoodwardFaultCodes],
  ['SmartGen', getSmartGenFaultCodes],
  ['PowerWizard', getPowerWizardFaultCodes],
  ['Datakom', getDatakomFaultCodes],
  ['Lovato', getLovatoFaultCodes],
  ['Siemens', getSiemensFaultCodes],
  ['Enko', getEnkoFaultCodes],
  ['Vodia', getVODIAFaultCodes],
];

const controllerCodes: CuratedFaultCode[] = controllerSources.flatMap(([family, fn]) => {
  try {
    return (fn() || []).map((c: any) => fromController(c, family)).filter(c => c.code);
  } catch {
    return [];
  }
});

const solarCodes: CuratedFaultCode[] = [
  ...(INVERTER_FAULT_CODES || []).map((c: any) => fromSolar(c, 'Inverter')),
  ...(BATTERY_FAULT_CODES || []).map((c: any) => fromSolar(c, 'Battery')),
].filter(c => c.code);

/**
 * J1939 SPN/FMI entries. This is the code a technician actually reads off an
 * electronic diesel engine, across every engine brand we service. Severity is
 * taken from the FMI's defined severity class.
 */
const j1939Codes: CuratedFaultCode[] = J1939_FAULT_CODES.map(c => ({
  code: c.code,
  brand: c.brand,
  model: c.model,
  service: 'Engine ECU Diagnostics (J1939)',
  category: c.category,
  issue: c.title,
  severity: c.severity.toUpperCase(),
  symptoms: [],
  causes: c.causes,
  solution: c.remedies.join('; '),
  parts: [],
  tools: ['J1939 diagnostic adapter', 'Service tool or fault-code reader', 'Digital multimeter'],
  downtime: '',
  preventive: '',
  verified: true,
}));

/**
 * Collapse per-model duplicates of the SAME fault code.
 *
 * WHY (measured 2026-07-31, not assumed)
 * --------------------------------------
 * The controller data files emit one row per (code x applicable model). In
 * vodia-fault-codes.ts, createVODIACode() ends with
 *
 *     return applicableModels.map(model => ({ ... code: codeString, model }))
 *
 * and applicableModels defaults to VODIA_MODELS, which holds 17 engine types.
 * So the single J1939 identifier MID128-PID100-FMI3 was stored 17 times.
 * Measured inflation across the VODIA set was exactly 17.0x: 51,527 rows for
 * 3,029 distinct codes. Every other controller family multiplies the same way —
 * DeepSea showed 630 rows for 63 real codes.
 *
 * That inflation is where the site's "manufacturer-curated fault codes" headline
 * came from. This file's own header already refuses generateExtendedCodes() in
 * controllerFaultCodes.ts on exactly these grounds, then included the identical
 * pattern from the VODIA file. The refusal is now applied consistently.
 *
 * NOTHING IS DELETED. A code appears once, and the models it applies to are
 * preserved in `models` — which is more useful than 17 identical rows, because
 * a technician can now see the code covers the whole engine family. Row counts
 * drop; real coverage does not change.
 */
function dedupeByBrandAndCode(list: CuratedFaultCode[]): CuratedFaultCode[] {
  const out = new Map<string, CuratedFaultCode>();
  for (const c of list) {
    const key = `${c.brand}|${c.code}`;
    const hit = out.get(key);
    if (!hit) {
      out.set(key, { ...c, models: c.model ? [c.model] : [] });
    } else if (c.model && !hit.models!.includes(c.model)) {
      hit.models!.push(c.model);
    }
  }
  return [...out.values()];
}

export const CURATED_CONTROLLER_FAULT_CODES = dedupeByBrandAndCode(controllerCodes);
export const CURATED_SOLAR_FAULT_CODES = dedupeByBrandAndCode(solarCodes);
export const CURATED_J1939_FAULT_CODES = dedupeByBrandAndCode(j1939Codes);
export const CURATED_FAULT_CODES: CuratedFaultCode[] = [
  ...CURATED_CONTROLLER_FAULT_CODES,
  ...CURATED_SOLAR_FAULT_CODES,
  ...CURATED_J1939_FAULT_CODES,
];

export const CURATED_FAULT_CODE_STATS = {
  controllers: CURATED_CONTROLLER_FAULT_CODES.length,
  solar: CURATED_SOLAR_FAULT_CODES.length,
  j1939: CURATED_J1939_FAULT_CODES.length,
  total: CURATED_FAULT_CODES.length,
  /** Rows before per-model collapsing — kept so the change stays auditable. */
  rowsBeforeDedupe: controllerCodes.length + solarCodes.length + j1939Codes.length,
};
