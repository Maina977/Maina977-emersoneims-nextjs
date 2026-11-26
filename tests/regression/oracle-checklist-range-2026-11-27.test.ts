/**
 * Review MINOR (2026-11-27, after 1d81ca21): a structured checklist reading is validated against its
 * Guided Diagnosis question's own physically possible range, as the Guided Diagnosis input is
 * (converted to the question's unit; refused, never clipped). A refused value does not satisfy the
 * item and the message says why. TEST values only.
 */
import { describe, it, expect } from 'vitest';
import { apply, emptyState, type ServiceAction, type ServiceState } from '@/lib/generator-oracle/service/store';
import { checklistItem, checklistRangeProblem, missingTestRunReadings, type JobCard } from '@/lib/generator-oracle/service/maintenance';

const ASSET = { id: 'A1', make: 'X', model: 'Y', engine: 'E', controller: 'C', serial: 'S', ratedKva: 100 };
const go = (s: ServiceState, a: ServiceAction) => { const r = apply(s, a); if (r.error) throw new Error(r.error); return r.state; };
const base = () => go(go(emptyState(), { type: 'saveAsset', asset: ASSET } as unknown as ServiceAction), { type: 'openCard', card: { id: 'JC1', assetId: 'A1', opened: '2026-11-27', reportedFault: 'x', technician: 'Tech' } } as ServiceAction);
type R = { name: string; value: number; unit: string; checklistId?: string };
const FULL: R[] = [{ name: 'Oil pressure', value: 300, unit: 'kPa', checklistId: 'oilPressure' }, { name: 'Coolant temperature', value: 82, unit: '°C', checklistId: 'coolantTemp' }, { name: 'Output voltage', value: 400, unit: 'V', checklistId: 'voltage' }, { name: 'Frequency', value: 50, unit: 'Hz', checklistId: 'frequency' }];
const edit = (readings: R[]) => apply(base(), { type: 'updateCard', cardId: 'JC1', update: { readings } } as ServiceAction);

describe('checklist readings: the question range applies', () => {
  it('500 Hz for frequency (range 0–70 Hz) is refused at entry, with the message', () => {
    const r = edit([FULL[0], FULL[1], FULL[2], { ...FULL[3], value: 500 }]);
    expect(r.error).toBe('Reading refused: Frequency: 500 Hz is outside the possible range 0–70 Hz; check the reading and the units');
  });

  it('pressure and temperature are converted first: 16 bar (1600 kPa > 1500) and 320 °F (160 °C > 150) are refused; 3 bar and 180 °F are accepted', () => {
    expect(edit([{ ...FULL[0], value: 16, unit: 'bar' }]).error).toMatch(/^Reading refused: Oil pressure measured: 16 bar is outside the possible range 0–1500 kPa/);
    expect(edit([{ ...FULL[1], value: 320, unit: '°F' }]).error).toMatch(/^Reading refused: Coolant temperature: 320 °F is outside the possible range -40–150 °C/);
    expect(edit([{ ...FULL[0], value: 3, unit: 'bar' }, { ...FULL[1], value: 180, unit: '°F' }, FULL[2], FULL[3]]).error).toBeNull();
  });

  it('a free-text note is not range-checked (it never satisfies an item)', () => {
    expect(edit([...FULL, { name: 'Frequency meter self-test', value: 500, unit: 'Hz' }]).error).toBeNull();
  });

  it('a card carrying an impossible value from outside the store (e.g. an edited file): the item is not satisfied, and the reason is given', () => {
    const card = { ...(base().jobCards[0] as JobCard), readings: [FULL[0], FULL[1], FULL[2], { ...FULL[3], value: 500 }] } as JobCard;
    expect(missingTestRunReadings(card)).toEqual(['Frequency (Hz): value refused — Frequency: 500 Hz is outside the possible range 0–70 Hz; check the reading and the units']);
    expect(missingTestRunReadings({ ...card, readings: FULL } as JobCard)).toEqual([]);
  });

  it('the range is the Guided Diagnosis question range (no new limit): boundaries are possible values', () => {
    const f = checklistItem('frequency')!;
    expect([f.min, f.max, f.unit]).toEqual([0, 70, 'Hz']);
    expect(checklistRangeProblem(f, 70, 'Hz')).toBeNull();
    expect(checklistRangeProblem(f, 0, 'Hz')).toBeNull();
    expect(checklistRangeProblem(f, 70.01, 'Hz')).toMatch(/outside the possible range/);
  });
});
