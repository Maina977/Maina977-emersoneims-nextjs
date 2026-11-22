// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { FieldEvidencePanel } from '@/external/borehole-ai-engine/src/FieldEvidencePanel';
import type { FieldValidationData } from '@/external/borehole-ai-engine/src/types';

// The "Add field evidence" section: refuses incomplete entries with messages,
// sets only the existing evidence keys when valid, and shows what is still
// needed for depth, yield and cost. TEST values only.
afterEach(cleanup);

const fill = (label: RegExp, value: string, nth = 0) => fireEvent.change(screen.getAllByLabelText(label)[nth], { target: { value } });

describe('FieldEvidencePanel', () => {
  it('shows the checklist and refuses an empty survey without calling onApply', () => {
    const onApply = vi.fn();
    render(<FieldEvidencePanel fieldData={{}} onApply={onApply} onRemove={vi.fn()} />);
    expect(screen.getByText('What evidence is still needed for:')).toBeTruthy();
    expect(screen.getByText(/Drilling depth/)).toBeTruthy();
    fireEvent.click(screen.getByText('Add survey'));
    expect(onApply).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/Survey contractor is required\.[\s\S]*Report or reference number is required\./);
  });

  it('a complete survey sets ertSurvey only, with no pre-filled values', () => {
    const onApply = vi.fn();
    render(<FieldEvidencePanel fieldData={{}} onApply={onApply} onRemove={vi.fn()} />);
    fill(/^Survey contractor/, 'TEST Geo');
    fill(/^Survey date/, '2026-10-01');
    fill(/^Method \*/, 'Schlumberger VES');
    fill(/^Report \/ reference no\./, 'TEST-1', 0);
    fill(/^Interpreted aquifer top/, '40');
    fill(/^Interpreted aquifer bottom/, '55');
    fireEvent.click(screen.getByText('Add survey'));
    expect(onApply).toHaveBeenCalledTimes(1);
    const patch = onApply.mock.calls[0][0] as Partial<FieldValidationData>;
    expect(Object.keys(patch)).toEqual(['ertSurvey']);
    expect(patch.ertSurvey).toMatchObject({ aquiferDepthM: 40, aquiferThicknessM: 15, contractor: 'TEST Geo' });
    expect(patch.ertSurvey).not.toHaveProperty('resistivityOhmM');
  });

  it('a pumping test with the dynamic level above the static level is refused', () => {
    const onApply = vi.fn();
    render(<FieldEvidencePanel fieldData={{}} onApply={onApply} onRemove={vi.fn()} />);
    fill(/^Test contractor/, 'TEST Drill');
    fill(/^Test date/, '2026-11-01');
    fill(/^Method \/ standard/, 'constant-rate', 0);
    fill(/^Report \/ reference no\./, 'TEST-2', 1);
    fill(/^Static water level/, '20');
    fill(/^Duration \(hours\)/, '24');
    fill(/^Pumping rate/, '2');
    fill(/^Dynamic water level at end/, '15');
    fill(/^Water level at end of recovery/, '21');
    fill(/^Recovery duration/, '6');
    fireEvent.click(screen.getByText('Add pumping test'));
    expect(onApply).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/Dynamic water level must be deeper than the static water level/);
  });

  it('with survey and test entered, the checklist ticks depth, yield and cost and cites them', () => {
    const fd = {
      ertSurvey: { aquiferDepthM: 40, aquiferThicknessM: 15, surveyDate: '2026-10-01', contractor: 'TEST Geo', method: 'VES', provenance: { source: 'TEST Geo', date: '2026-10-01', method: 'Schlumberger', reference: 'TEST-1' } },
      pumpTest: { sustainableYieldM3Hr: 2, drawdownM: 8, recoveryPercent: 90, testDurationHrs: 24, testDate: '2026-11-01', provenance: { source: 'TEST Drill', date: '2026-11-01', method: 'constant-rate', reference: 'TEST-2' } },
    } as Partial<FieldValidationData>;
    render(<FieldEvidencePanel fieldData={fd} onApply={vi.fn()} onRemove={vi.fn()} />);
    const text = document.body.textContent ?? '';
    expect(text).toMatch(/report TEST-1\): interpreted aquifer 40-55 m/);
    expect(text).toMatch(/report TEST-2\): tested rate 2 m³\/h for 24 h/);
    expect(text).toMatch(/priced at sourced rates only/);
  });
});
