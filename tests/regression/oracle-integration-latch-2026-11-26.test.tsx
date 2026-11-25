// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import GuidedDiagnosisPanel, { GD_STORE } from '@/components/generator-oracle/panels/GuidedDiagnosisPanel';
import { GUIDED_SESSION_KEY } from '@/lib/generator-oracle/diagnostics/session';

// Integration 2026-11-26: engine 1.3.0 (shared safety screen, OEM limit rules) inside the
// production STOP latch. TEST values only.
afterEach(() => { cleanup(); localStorage.clear(); });

const hold = () => screen.queryByTestId('gd-stop-hold');

describe('Guided Diagnosis integration: 1.3.0 safety screen under the production STOP latch', () => {
  it('a safety-screen STOP is latched once (not once per family) and survives "Clear safety screen" and a reload', () => {
    render(<GuidedDiagnosisPanel />);
    fireEvent.change(screen.getByLabelText(/Safety screen: knocking, or bearing noise/), { target: { value: 'yes' } });
    expect(hold()).not.toBeNull();
    const stored = () => JSON.parse(localStorage.getItem(GD_STORE) || '{}');
    expect(stored().latched.filter((l: { key: string }) => l.key.startsWith('__screen|'))).toHaveLength(1);
    expect(screen.getAllByTestId('gd-clearance')).toHaveLength(1);
    // The job-card hand-off copy is written too.
    expect(JSON.parse(localStorage.getItem(GUIDED_SESSION_KEY)!).answers.__screen['screen.knock']).toBe('yes');
    fireEvent.click(screen.getByRole('button', { name: 'Clear safety screen' }));
    expect(hold()).not.toBeNull();
    expect(screen.getByTestId('gd-latched-stop').textContent).toMatch(/from the Safety screen tab.*STOP THE SET: knocking/);
    cleanup();
    render(<GuidedDiagnosisPanel />);
    expect(hold()).not.toBeNull();
    expect(screen.queryByText('Next check')).toBeNull();
  });

  it('an OEM-limit STOP stays latched after the limit is changed so it is no longer reached', () => {
    render(<GuidedDiagnosisPanel />);
    fireEvent.click(screen.getByRole('tab', { name: /oil pressure/i }));
    fireEvent.change(screen.getAllByLabelText(/OEM minimum oil pressure/i)[0], { target: { value: '150' } });
    fireEvent.change(screen.getAllByLabelText(/^Oil pressure/i)[0], { target: { value: '150' } });
    expect(hold()).not.toBeNull();
    fireEvent.change(screen.getAllByLabelText(/OEM minimum oil pressure/i)[0], { target: { value: '100' } });
    expect(hold()).not.toBeNull();
    expect(screen.getByTestId('gd-latched-stop').textContent).toMatch(/still active until a clearance is recorded/);
    expect(screen.getAllByTestId('gd-not-restart')[0].textContent).toMatch(/NOT authorisation to restart the generator/);
  });

  it('equipment typed on the panel is kept in the safety record and restored after a reload', () => {
    render(<GuidedDiagnosisPanel />);
    fireEvent.change(screen.getByLabelText('Manufacturer (as on the plate)'), { target: { value: 'TEST-MAKE' } });
    cleanup();
    render(<GuidedDiagnosisPanel />);
    expect((screen.getByLabelText('Manufacturer (as on the plate)') as HTMLInputElement).value).toBe('TEST-MAKE');
  });
});
