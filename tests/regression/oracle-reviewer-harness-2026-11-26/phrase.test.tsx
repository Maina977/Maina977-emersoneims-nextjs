// @vitest-environment jsdom
/**
 * Copied from the reviewer's scratch/integration/mine6u/phrase.test.tsx (2026-11-26, F10-R3 demonstration).
 * Changed: the console-only demonstration now asserts the fix — the hold line does not contain the
 * phrase, recordsStopInForce is false, and the card does not complete with test-run readings.
 *
 * Real-project D6 (2026-11-26): completion fixtures now carry the engine test-run readings
 * (oil pressure, coolant temperature, output voltage, frequency; oil temperature for low-oil cards).
 */
import { it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Panel from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { guardedSessionRecord, guardedCardUpdate, readStore, safetyStateOf } from '@/lib/generator-oracle/diagnostics/stopLatch';
import { loadGuidedSession, loadGuidedEquipment } from '@/lib/generator-oracle/diagnostics/session';
import { apply, emptyState, type ServiceState, type ServiceAction } from '@/lib/generator-oracle/service/store';
import { recordsStopInForce, READINGS_NOT_TAKEN_STOP, type JobCard } from '@/lib/generator-oracle/service/maintenance';

afterEach(() => { cleanup(); localStorage.clear(); });
const LOP = FAMILIES.find((f) => f.id === 'low-oil-pressure')!;
const go = (s: ServiceState, a: ServiceAction) => { const r = apply(s, a); if (r.error) throw new Error(r.error); return r.state; };

it('F10-R3 fixed (was REMAINING?): the refused-value HOLD line no longer contains the phrase "Readings not taken: STOP in force" — a card carrying it does not count as "STOP in force" and does not complete with test-run readings', () => {
  const { container: c } = render(<Panel />);
  fireEvent.click([...c.querySelectorAll('[role="tab"]')].find((b) => b.textContent === LOP.title)!);
  const q = (id: string) => LOP.questions.find((x) => x.id === id)!;
  const sel = c.querySelectorAll(`select[aria-label="Unit: ${q('oemMinOilPressure').text}"]`); fireEvent.change(sel[sel.length - 1], { target: { value: 'kPa' } });
  const i1 = c.querySelectorAll('[id="gd-all-oemMinOilPressure"]'); fireEvent.change(i1[i1.length - 1], { target: { value: '150' } }); fireEvent.blur(i1[i1.length - 1]);
  const i2 = c.querySelectorAll('[id="gd-all-oilPressure"]'); fireEvent.change(i2[i2.length - 1], { target: { value: '10' } }); fireEvent.blur(i2[i2.length - 1]);
  fireEvent.change(i2[i2.length - 1], { target: { value: '' } }); fireEvent.blur(i2[i2.length - 1]); // value deleted: the hold stays
  cleanup();
  let s = go(go(emptyState(), { type: 'saveAsset', asset: { id: 'A1', make: 'X', model: 'Y', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 } } as unknown as ServiceAction), { type: 'openCard', card: { id: 'JC1', assetId: 'A1', opened: '2026-11-26', reportedFault: 'x', technician: 'Tech' } } as ServiceAction);
  const card0 = s.jobCards[0];
  const g = guardedSessionRecord(LOP, loadGuidedSession(localStorage, FAMILIES), loadGuidedEquipment(localStorage), safetyStateOf(readStore()));
  s = go(s, { type: 'recordGuidedSafety', cardId: 'JC1', at: '2026-11-26T09:00:00.000Z', safety: g.safety } as ServiceAction);
  s = go(s, { type: 'updateCard', cardId: 'JC1', update: guardedCardUpdate(card0, g) } as ServiceAction);
  const card = s.jobCards[0] as JobCard;
  const holdLine = card.findings.split('\n').find((l) => /refused/.test(l));
  console.log('PHRASE hold line:', holdLine);
  console.log('PHRASE recordsStopInForce(card) with no phrase written by anyone:', recordsStopInForce(card), '| findings include phrase:', card.findings.includes(READINGS_NOT_TAKEN_STOP));
  const r1 = apply(s, { type: 'transition', cardId: 'JC1', to: 'IN PROGRESS', by: 'Tech', at: '2026-11-26T12:00:00.000Z' } as ServiceAction);
  const r2 = apply(r1.state, { type: 'transition', cardId: 'JC1', to: 'COMPLETED', by: 'Tech', at: '2026-11-26T12:00:00.000Z', update: { tasks: ['x'], engineHoursAtJob: 1, readings: [{ name: 'Oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'TEST coolant temperature', value: 80, unit: '°C', checklistId: 'coolantTemp' }, { name: 'TEST output voltage', value: 400, unit: 'V', checklistId: 'voltage' }, { name: 'TEST frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }] } } as ServiceAction);
  console.log('PHRASE completion with test-run readings →', r2.error);
  expect(holdLine).toBeDefined();
  expect(card.findings).not.toContain(READINGS_NOT_TAKEN_STOP);
  expect(recordsStopInForce(card)).toBe(false);
  expect(r2.error).toMatch(/still latched/);
});
