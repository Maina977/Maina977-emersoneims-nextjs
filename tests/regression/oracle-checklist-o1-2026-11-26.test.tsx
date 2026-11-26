// @vitest-environment jsdom
/**
 * Review O-1 (2026-11-26, review of 477bd525 + ac20f893): on the job card screen each required
 * test-run reading has its own structured checklist entry; a free-text reading is a note and
 * never satisfies a required item. TEST values only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { render, screen, fireEvent, within, act, cleanup } from '@testing-library/react';
import ServiceManagementPanel from '@/components/generator-oracle/panels/ServiceManagementPanel';
import { reduce, emptyState, serialise, STORE_KEY, type ServiceAction, type ServiceState } from '@/lib/generator-oracle/service/store';

const run = (s: ServiceState, ...acts: ServiceAction[]) => acts.reduce(reduce, s);
const seed = () => serialise(run(emptyState(),
  { type: 'saveAsset', asset: { make: 'TEST', model: 'T-100', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } },
  { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-26', reportedFault: 'TEST fault', technician: 'TECH-A' } },
  { type: 'transition', cardId: 'JC-1', to: 'IN PROGRESS', by: 'TECH-A', at: '2026-11-26T08:00' },
));
const saved = () => JSON.parse(window.localStorage.getItem(STORE_KEY)!).jobCards[0];

beforeEach(() => window.localStorage.clear());
afterEach(() => { cleanup(); window.localStorage.clear(); });

async function openCard() {
  window.localStorage.setItem(STORE_KEY, seed());
  render(createElement(ServiceManagementPanel));
  await act(async () => {});
  fireEvent.click(screen.getByRole('button', { name: 'Job cards' }));
  fireEvent.click(screen.getByRole('button', { name: /JC-1/ }));
}
const item = (name: RegExp) => screen.getByRole('group', { name });

describe('job card screen: the test-run checklist is structured', () => {
  it('shows one entry per required reading; values entered there are stored against their item', async () => {
    await openCard();
    for (const n of [/Checklist: Oil pressure/, /Checklist: Coolant temperature/, /Checklist: Output voltage/, /Checklist: Frequency/]) expect(item(n)).toBeInTheDocument();
    fireEvent.change(within(item(/Checklist: Output voltage/)).getByLabelText('Value'), { target: { value: '400' } });
    fireEvent.change(within(item(/Checklist: Frequency/)).getByLabelText('Value'), { target: { value: '50' } });
    // a free-text note with a voltage unit
    fireEvent.click(screen.getByRole('button', { name: '+ Add reading' }));
    const note = screen.getByRole('group', { name: 'Reading 3' });
    fireEvent.change(within(note).getByLabelText('Reading'), { target: { value: 'Battery voltage' } });
    fireEvent.change(within(note).getByLabelText('Value'), { target: { value: '24' } });
    fireEvent.change(within(note).getByLabelText('Unit'), { target: { value: 'V' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    const r = saved().readings;
    expect(r.find((x: { checklistId?: string }) => x.checklistId === 'voltage')).toMatchObject({ value: 400, unit: 'V' });
    expect(r.find((x: { checklistId?: string }) => x.checklistId === 'frequency')).toMatchObject({ value: 50, unit: 'Hz' });
    expect(r.find((x: { name: string }) => x.name === 'Battery voltage').checklistId).toBeUndefined();
    // blank checklist items are not stored as readings
    expect(r.some((x: { checklistId?: string }) => x.checklistId === 'oilPressure')).toBe(false);
  });
});
