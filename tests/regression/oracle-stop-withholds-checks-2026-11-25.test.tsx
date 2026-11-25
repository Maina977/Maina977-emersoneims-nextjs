// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import GuidedDiagnosisPanel from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import { FAMILIES } from '@/lib/generator-oracle/diagnostics/families';
import { diagnose } from '@/lib/generator-oracle/diagnostics/engine';

// Safety hotfix (independent review F1, 2026-11-25): while any STOP applies, the panel
// suggests no further check or action. Before the fix, "STOP THE SET" (knock) was
// followed by "Cylinder cut-out test", which needs the knocking engine running.
afterEach(cleanup);

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
    expect(screen.getByRole('alert').textContent).toMatch(/STOP the engine: oil pressure is below the OEM minimum/);
    expect(hold()).not.toBeNull();
    expect(document.body.textContent).not.toMatch(/Confirm with a mechanical gauge before any engine work/);
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
