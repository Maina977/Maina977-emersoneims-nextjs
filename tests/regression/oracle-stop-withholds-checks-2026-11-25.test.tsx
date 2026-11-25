// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import GuidedDiagnosisPanel from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { diagnose } from '@/lib/generator-oracle/diagnostics/engine';

// Safety hotfix (independent review F1, 2026-11-25): while any STOP applies, the panel
// suggests no further check or action. Before the fix, "STOP THE SET" (knock) was
// followed by "Cylinder cut-out test", which needs the knocking engine running.
// Each test starts with empty browser storage (the panel latches STOPs in localStorage).
afterEach(() => { cleanup(); localStorage.clear(); });

const choose = (familyTitle: RegExp) => fireEvent.click(screen.getByRole('tab', { name: familyTitle }));
const answer = (questionText: RegExp, value: string) => fireEvent.change(screen.getAllByLabelText(questionText)[0], { target: { value } });
const hold = () => screen.queryByTestId('gd-stop-hold');

describe('Guided Diagnosis: no checks suggested while a STOP applies', () => {
  it('knock: STOP shown, cut-out test and next check withheld', () => {
    render(<GuidedDiagnosisPanel />);
    choose(/Knocking, bearing noise or seizure/);
    answer(/Where is the noise\?/, 'engine');
    answer(/Exhaust/, 'black');
    expect(screen.getByRole('alert').textContent).toMatch(/STOP THE SET/);
    expect(hold()).not.toBeNull();
    expect(document.body.textContent).not.toMatch(/Cylinder cut-out test/);
    expect(screen.queryByText('Next check')).toBeNull();
  });

  it('low oil pressure below the OEM minimum: mechanical-gauge check withheld', () => {
    render(<GuidedDiagnosisPanel />);
    choose(/oil pressure/i);
    answer(/OEM minimum oil pressure/i, '200');
    answer(/^Oil pressure/i, '100');
    answer(/Does a mechanical gauge show normal pressure/i, 'yes');
    expect(screen.getByRole('alert').textContent).toMatch(/STOP the engine: oil pressure is at or below the OEM minimum/);
    expect(hold()).not.toBeNull();
    expect(document.body.textContent).not.toMatch(/Confirm with a mechanical gauge before any engine work/);
  });

  it('equality with an entered limit counts as reaching it (review P1)', () => {
    const fam = (id: string) => FAMILIES.find((f) => f.id === id)!;
    const isStop = (id: string, a: Record<string, number>) => diagnose(fam(id), a).stops.some((s) => s.level === 'STOP');
    expect(isStop('low-oil-pressure', { oilPressure: 150, oemMinOilPressure: 150 })).toBe(true);
    expect(isStop('low-oil-pressure', { oilPressure: 151, oemMinOilPressure: 150 })).toBe(false);
    const overheat = FAMILIES.find((f) => f.questions.some((q) => q.id === 'oemAlarmCoolantTemp'))!.id;
    expect(isStop(overheat, { coolantTemp: 100, oemAlarmCoolantTemp: 100 })).toBe(true);
    expect(isStop(overheat, { coolantTemp: 99, oemAlarmCoolantTemp: 100 })).toBe(false);
    const insul = FAMILIES.find((f) => f.questions.some((q) => q.id === 'oemMinInsulation'))!.id;
    expect(isStop(insul, { insulation: 1, oemMinInsulation: 1 })).toBe(true);
    expect(isStop(insul, { insulation: 1.1, oemMinInsulation: 1 })).toBe(false);
  });

  it('a STOP on one tab holds every other tab and is shown there (review R2)', () => {
    render(<GuidedDiagnosisPanel />);
    choose(/Knocking, bearing noise or seizure/);
    answer(/Where is the noise\?/, 'engine');
    choose(/Overheating \/ high coolant temperature/);
    expect(screen.getByRole('alert').textContent).toMatch(/from the Knocking, bearing noise or seizure tab/);
    expect(hold()).not.toBeNull();
    expect(screen.queryByText('Next check')).toBeNull();
    choose(/Low oil pressure/);
    expect(hold()).not.toBeNull();
    expect(document.body.textContent).not.toMatch(/Confirm with a mechanical gauge before any engine work/);
    // Clearing the knock answers does NOT release the STOP (latched until a recorded clearance).
    choose(/Knocking, bearing noise or seizure/);
    fireEvent.click(screen.getByRole('button', { name: 'Clear answers' }));
    choose(/Overheating \/ high coolant temperature/);
    expect(hold()).not.toBeNull();
    expect(screen.getByTestId('gd-latched-stop').textContent).toMatch(/still active until a clearance is recorded/);
  });

  it('STOP latch: survives a reload and a less severe fault; cleared only by a recorded clearance', () => {
    const { unmount } = render(<GuidedDiagnosisPanel />);
    choose(/Knocking, bearing noise or seizure/);
    answer(/Where is the noise\?/, 'engine');
    expect(hold()).not.toBeNull();
    unmount(); // reload
    render(<GuidedDiagnosisPanel />);
    expect(hold()).not.toBeNull();
    expect(document.body.textContent).toMatch(/STOP THE SET/);
    // a second, less severe fault on another tab does not clear it
    choose(/Cranks but will not start|will not start/i);
    answer(/Fuel at the filter|fuel/i, 'no');
    expect(hold()).not.toBeNull();
    // clearance refused while the answers still show the condition
    fireEvent.click(screen.getAllByRole('button', { name: 'Record STOP clearance' })[0]);
    expect(document.body.textContent).toMatch(/Not cleared: the answers entered still show this condition/);
    // checks done: answers updated (cleared), but initials and confirmation are required
    choose(/Knocking, bearing noise or seizure/);
    fireEvent.click(screen.getByRole('button', { name: 'Clear answers' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Record STOP clearance' })[0]);
    expect(document.body.textContent).toMatch(/Not cleared: enter the initials/);
    fireEvent.change(screen.getAllByLabelText(/Initials of the qualified technician/)[0], { target: { value: 'TEST-JK' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Record STOP clearance' })[0]);
    expect(document.body.textContent).toMatch(/Not cleared: confirm that the required checks were completed/);
    fireEvent.click(screen.getAllByLabelText(/The required checks were completed/)[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Record STOP clearance' })[0]);
    expect(hold()).toBeNull();
    expect(screen.getByTestId('gd-clearance-record').textContent).toMatch(/cleared by TEST-JK/);
    // and the record survives a reload
    cleanup();
    render(<GuidedDiagnosisPanel />);
    expect(screen.getByTestId('gd-clearance-record').textContent).toMatch(/cleared by TEST-JK/);
    expect(hold()).toBeNull();
  });

  it('under a STOP the All-questions list warns against running or live readings (review R1)', () => {
    render(<GuidedDiagnosisPanel />);
    choose(/Knocking, bearing noise or seizure/);
    answer(/Where is the noise\?/, 'engine');
    expect(screen.getByTestId('gd-stop-questions-warning').textContent).toMatch(/do not take any reading that needs the engine running, cranking or live circuits/);
  });

  it('a CAUTION alone does not withhold checks (no change to non-STOP behaviour)', () => {
    render(<GuidedDiagnosisPanel />);
    choose(/Cranks but will not start|will not start/i);
    answer(/Fuel at the filter|fuel/i, 'no');
    expect(hold()).toBeNull();
    expect(screen.getByText('Next check')).toBeTruthy();
  });

  it('every family: whenever the engine reports a STOP, the panel withholds all checks', () => {
    // Drive each family by setting every choice question to each option in turn and
    // confirm with the engine which combinations produce a STOP; the panel must then
    // show the hold notice and none of the ranked causes' actions.
    for (const fam of FAMILIES) {
      for (const q of fam.questions) {
        if (q.kind !== 'choice') continue;
        for (const o of q.options) {
          const r = diagnose(fam, { [q.id]: o.value });
          if (!r.stops.some((s) => s.level === 'STOP')) continue;
          render(<GuidedDiagnosisPanel />);
          choose(new RegExp(fam.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
          answer(new RegExp('^' + q.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), o.value);
          expect(hold(), `${fam.id} ${q.id}=${o.value}`).not.toBeNull();
          for (const c of r.ranked) for (const a of c.actions) expect(document.body.textContent, `${fam.id} ${q.id}=${o.value}: ${a}`).not.toContain(a);
          cleanup();
        }
      }
    }
  });
});
