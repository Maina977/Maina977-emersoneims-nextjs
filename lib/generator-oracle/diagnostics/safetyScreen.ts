/**
 * Cross-family SAFETY SCREEN (independent safety review F3/F9, 2026-11-25).
 *
 * The same short set of questions is asked FIRST in every fault family, and
 * the answers are shared by all families in a session (stored once, under the
 * "__screen" bucket), so a serious condition seen anywhere decides everywhere:
 * a knocking engine stops the overheating diagnosis too. Each "yes" is a STOP.
 *
 * These are observations made with the set stopped, or already seen before the
 * stop; none needs the engine running to answer.
 */
import type { ChoiceQuestion, Condition, FaultFamily, StopRule } from './types';

export const SCREEN_PREFIX = 'screen.';
export const SCREEN_BUCKET = '__screen';
export const isScreenKey = (k: string) => k.startsWith(SCREEN_PREFIX);

const yn = (id: string, text: string): ChoiceQuestion => ({
  id: `${SCREEN_PREFIX}${id}`, kind: 'choice', text,
  options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }, { value: 'not-checked', label: 'Not checked / not known' }],
});
const yes = (id: string): Condition => ({ q: `${SCREEN_PREFIX}${id}`, op: 'is', value: 'yes' });

export const SCREEN_QUESTIONS: ChoiceQuestion[] = [
  {
    id: `${SCREEN_PREFIX}alarm`, kind: 'choice', text: 'Safety screen: is a controller shutdown or protective alarm active (or logged for this fault)?',
    options: [
      { value: 'no', label: 'No alarm' },
      { value: 'shutdown', label: 'Yes — shutdown / protective alarm (oil pressure, coolant temperature, overspeed or another shutdown)' },
      { value: 'warning', label: 'Yes — warning only' },
      { value: 'not-checked', label: 'Not checked' },
    ],
  },
  yn('knock', 'Safety screen: knocking, or bearing noise from the engine or alternator?'),
  yn('metal', 'Safety screen: metal particles in the oil or the oil filter?'),
  yn('milkyOil', 'Safety screen: milky oil (coolant in the oil)?'),
  yn('coolantCylinders', 'Safety screen: white smoke with coolant loss, or coolant loss with a sweet exhaust smell?'),
  yn('overspeed', 'Safety screen: an overspeed shutdown or a runaway since the fault began?'),
  yn('seized', 'Safety screen: engine seized, or tight when barred by hand (set isolated)?'),
  yn('battery', 'Safety screen: battery hot, swollen or gassing strongly?'),
  yn('burning', 'Safety screen: burning smell, smoke or arcing from the alternator, panel or wiring?'),
  yn('fuelLeak', 'Safety screen: fuel leaking, or spraying onto hot parts?'),
];

const SCREEN_QUESTION_IDS = SCREEN_QUESTIONS.map((q) => q.id);

export const SCREEN_RULES: StopRule[] = [
  { screen: true, when: { q: `${SCREEN_PREFIX}alarm`, op: 'is', value: 'shutdown' }, level: 'STOP', message: 'STOP: a controller shutdown or protective alarm is active. Treat it as real until a qualified technician has verified it, even if a gauge reads normal; do not reset and restart to test it.' },
  { screen: true, when: yes('knock'), level: 'STOP', message: 'STOP THE SET: knocking or bearing noise. Do not restart or crank; use the "Knocking, bearing noise or seizure" checks.' },
  { screen: true, when: yes('metal'), level: 'STOP', message: 'STOP: metal in the oil or the filter points to bearing damage. Do not run until the bearings have been inspected.' },
  { screen: true, when: yes('milkyOil'), level: 'STOP', message: 'STOP: milky oil means coolant in the oil. Do not run until the source is found (head gasket, oil cooler, liners).' },
  { screen: true, when: yes('coolantCylinders'), level: 'STOP', message: 'STOP: coolant may be entering the cylinders (head gasket, cracked head or liner). Do not run or crank: a hydraulic lock can bend a connecting rod.' },
  { screen: true, when: yes('overspeed'), level: 'STOP', message: 'STOP: an overspeed shutdown or runaway has occurred. Do not reset and restart; use the "Overspeed shutdown or runaway" checks.' },
  { screen: true, when: yes('seized'), level: 'STOP', message: 'STOP: the engine is seized or tight when barred by hand. Do not try to free it with the starter.' },
  { screen: true, when: yes('battery'), level: 'STOP', message: 'STOP: a hot, swollen or strongly gassing battery. Stop the engine, switch off and isolate the battery charger, ventilate; no sparks or flames; do not move the battery until it has cooled.' },
  { screen: true, when: yes('burning'), level: 'STOP', message: 'STOP and isolate: burning smell, smoke or arcing from the alternator, panel or wiring. Stop the set, isolate and lock off the electrical supplies; do not re-energise until inspected.' },
  { screen: true, when: yes('fuelLeak'), level: 'STOP', message: 'STOP: leaking or spraying fuel is a fire risk. Stop the engine; do not restart until the leak is repaired.' },
  // Safety review R5: an item marked "Not checked" is acknowledged — safety is not confirmed.
  { screen: true, when: { any: SCREEN_QUESTION_IDS.map((id) => ({ q: id, op: 'is' as const, value: 'not-checked' })) }, level: 'CAUTION', message: 'Safety screen not completed: one or more safety items are marked "Not checked", so safety is NOT confirmed. Check them with the set stopped and isolated before relying on this diagnosis.' },
  { screen: true, when: { q: `${SCREEN_PREFIX}alarm`, op: 'is', value: 'warning' }, level: 'CAUTION', message: 'A controller warning alarm is active or logged: record its exact text and find its cause before relying on the set.' },
];

/** Prepends the screen to a family (once). Called on every family at module load. */
export function withScreen(f: FaultFamily): FaultFamily {
  if (!f.questions.some((q) => isScreenKey(q.id))) {
    f.questions.unshift(...SCREEN_QUESTIONS);
    f.stopRules.unshift(...SCREEN_RULES);
  }
  return f;
}
