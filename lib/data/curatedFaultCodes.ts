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

export interface CuratedFaultCode {
  code: string;
  brand: string;
  model: string;
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
    parts: [],
    tools: [],
    downtime: '',
    preventive: list(c?.preventiveMeasures).join('; '),
    verified: true,
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
    downtime: '',
    preventive: list(c?.preventiveMeasures).join('; '),
    verified: true,
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

export const CURATED_CONTROLLER_FAULT_CODES = controllerCodes;
export const CURATED_SOLAR_FAULT_CODES = solarCodes;
export const CURATED_FAULT_CODES: CuratedFaultCode[] = [...controllerCodes, ...solarCodes];

export const CURATED_FAULT_CODE_STATS = {
  controllers: controllerCodes.length,
  solar: solarCodes.length,
  total: CURATED_FAULT_CODES.length,
};
