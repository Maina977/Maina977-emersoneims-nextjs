import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GuidedDiagnosisPanel from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import ServiceManagementPanel from '@/components/generator-oracle/panels/ServiceManagementPanel';
import { GUIDED_SESSION_KEY } from '@/lib/generator-oracle/diagnostics/session';
import { diagnosisRecord } from '@/lib/generator-oracle/diagnostics/jobCardRecord';
import { OVERSPEED } from '@/lib/generator-oracle/diagnostics/families';
import { reduce, emptyState, serialise, STORE_KEY, type ServiceAction } from '@/lib/generator-oracle/service/store';

// TEST values only.
describe('Guided Diagnosis UI: new families and the job-card hand-off', () => {
  beforeEach(() => { window.localStorage.clear(); vi.spyOn(window, 'confirm').mockReturnValue(true); });
  afterEach(() => { vi.restoreAllMocks(); window.localStorage.clear(); });

  it('the overspeed tab shows the mandatory safety first and a STOP once answered, before the cause list; answers are saved', async () => {
    const { container } = render(<GuidedDiagnosisPanel />);
    await act(async () => {});
    fireEvent.click(screen.getByRole('tab', { name: OVERSPEED.title }));
    expect(container.textContent).toContain(OVERSPEED.mandatorySafety![0]);
    fireEvent.change(screen.getAllByLabelText('What shut the set down?')[0], { target: { value: 'controller' } });
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toMatch(/^STOP · STOP: overspeed shutdown/);
    const causes = screen.getByText('Likely causes, most supported first');
    expect(alert.compareDocumentPosition(causes) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const saved = JSON.parse(window.localStorage.getItem(GUIDED_SESSION_KEY)!);
    expect(saved.answers.overspeed.tripSource).toBe('controller');
  });

  it('a published figure shows only for the exact engine model selected; otherwise NOT VERIFIED', async () => {
    const { container } = render(<GuidedDiagnosisPanel />);
    await act(async () => {});
    fireEvent.click(screen.getByRole('tab', { name: 'Overheating / high coolant temperature' }));
    const notes = () => container.textContent ?? '';
    expect(notes()).toMatch(/per OEM manual — NOT VERIFIED: no published figure held for the selected equipment/);
    expect(notes()).not.toMatch(/110 °C/);
    fireEvent.change(screen.getByLabelText(/Engine model/), { target: { value: '1104D (Mech) Industrial Engine NK' } });
    expect(notes()).toMatch(/1104D \(Mech\) Industrial Engine NK — Jacket water coolant temperature, maximum allowable: 110 °C/);
    // Not entered as an answer: the OEM alarm field stays empty.
    const limitInput = () => screen.getAllByLabelText(/OEM high coolant temperature limit/)[0] as HTMLInputElement;
    expect(limitInput().value).toBe('');
    // Review R4: not offered until the typed plate matches the manual's model designation exactly.
    expect(screen.queryAllByRole('button', { name: /Use published value/ })).toHaveLength(0);
    fireEvent.change(screen.getByLabelText('Manufacturer (as on the plate)'), { target: { value: 'Perkins' } });
    fireEvent.change(screen.getByLabelText('Model (as on the plate)'), { target: { value: '1104D-E44TA' } });
    expect(screen.queryAllByRole('button', { name: /Use published value/ })).toHaveLength(0);
    fireEvent.change(screen.getByLabelText('Model (as on the plate)'), { target: { value: '1104D (Mech) Industrial Engine NK' } });
    // "Use published value" is offered for the exact model only, and enters value, classification and source.
    fireEvent.click(screen.getAllByRole('button', { name: /Use published value for the selected model: 110 °C \(shutdown\)/ })[0]);
    expect(limitInput().value).toBe('110');
    expect((screen.getAllByLabelText('Classification: OEM high coolant temperature limit')[0] as HTMLSelectElement).value).toBe('shutdown');
    expect((screen.getAllByLabelText('Source: OEM high coolant temperature limit')[0] as HTMLInputElement).value).toMatch(/SEBU8325-01.*PDF p\. 22.*1104D \(Mech\) Industrial Engine NK/);
    // 110 °C reading = the published shutdown maximum → STOP (equality counts as reaching)
    fireEvent.change(screen.getAllByLabelText(/^Coolant temperature/)[0], { target: { value: '110' } });
    expect(screen.getByRole('alert').textContent).toMatch(/^STOP · Take the load off and STOP the engine: coolant has reached the OEM limit/);
    fireEvent.change(screen.getByLabelText(/Engine model/), { target: { value: '' } });
    expect(notes()).not.toMatch(/Jacket water/);
    expect(screen.queryAllByRole('button', { name: /Use published value/ })).toHaveLength(0);
  });

  it('the shared safety screen: a "yes" on one tab is a STOP on every tab (safety review F3)', async () => {
    render(<GuidedDiagnosisPanel />);
    await act(async () => {});
    fireEvent.click(screen.getByRole('tab', { name: 'Overheating / high coolant temperature' }));
    fireEvent.change(screen.getByLabelText(/Safety screen: knocking, or bearing noise/), { target: { value: 'yes' } });
    expect(screen.getByRole('alert').textContent).toMatch(/^STOP · STOP THE SET: knocking/);
    fireEvent.click(screen.getByRole('tab', { name: 'Battery not charging, or overcharging (engine alternator or mains charger)' }));
    expect(screen.getByRole('alert').textContent).toMatch(/^STOP · STOP THE SET: knocking/);
    const saved = JSON.parse(window.localStorage.getItem(GUIDED_SESSION_KEY)!);
    expect(saved.answers.__screen['screen.knock']).toBe('yes');
  });

  it('a saved diagnosis is recorded on an open job card with exactly the guided text', async () => {
    const acts: ServiceAction[] = [
      { type: 'saveAsset', asset: { make: 'TEST', model: 'T-1', engine: 'TEST-ENG', controller: 'TEST-CTRL', serial: 'S-1', ratedKva: 100 } },
      { type: 'openCard', card: { assetId: 'A-1', opened: '2026-11-25', reportedFault: 'TEST overspeed', technician: 'TECH-A' } },
    ];
    window.localStorage.setItem(STORE_KEY, serialise(acts.reduce(reduce, emptyState())));
    const raw = { tripSource: 'controller', whenTripped: 'load-rejection', peakRpm: '1720', oemTripRpm: '1700', ratedRpm: '1500' };
    window.localStorage.setItem(GUIDED_SESSION_KEY, JSON.stringify({ version: 1, answers: { overspeed: raw } }));
    render(<ServiceManagementPanel />);
    await act(async () => {});
    fireEvent.click(screen.getByRole('button', { name: 'Job cards' }));
    fireEvent.click(screen.getByRole('button', { name: /JC-1/ }));
    fireEvent.change(screen.getByLabelText('Fault family'), { target: { value: 'overspeed' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add this diagnosis to the card' }));
    const expected = diagnosisRecord(OVERSPEED, raw).findings;
    expect((screen.getByLabelText('Findings') as HTMLTextAreaElement).value).toBe(expected);
    const stored = JSON.parse(window.localStorage.getItem(STORE_KEY)!);
    expect(stored.jobCards[0].findings).toBe(expected);
    expect(stored.jobCards[0].readings.map((r: { value: number }) => r.value)).toEqual([1720]);
  });
});
