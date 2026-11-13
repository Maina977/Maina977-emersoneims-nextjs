import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EngineeringCalculatorsPanel from '@/components/generator-oracle/panels/EngineeringCalculatorsPanel';

const type = (label: RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('Generator Oracle calculators panel', () => {
  it('calculates kVA/kW from the entered values and shows the working', () => {
    render(<EngineeringCalculatorsPanel />);
    type(/^Voltage, line-to-line/, '400');
    type(/^Current/, '100');
    type(/^Power factor/, '0.8');
    expect(screen.getByText('69.28')).toBeTruthy();
    expect(screen.getByText('55.43')).toBeTruthy();
    expect(screen.getByText(/S = √3 × V\(line-line\) × I/)).toBeTruthy();
    expect(screen.getByText(/not a design approval/)).toBeTruthy();
  });

  it('refuses an impossible power factor instead of calculating', () => {
    render(<EngineeringCalculatorsPanel />);
    type(/^Voltage, line-to-line/, '400');
    type(/^Current/, '100');
    type(/^Power factor/, '1.4');
    expect(screen.getByRole('alert').textContent).toMatch(/Not calculated[^]*Power factor must be at most 1/);
  });

  it('fuel needs datasheet points: nothing is assumed', () => {
    render(<EngineeringCalculatorsPanel />);
    fireEvent.click(screen.getByRole('tab', { name: 'Fuel & runtime' }));
    type(/^Load to evaluate/, '75');
    expect(screen.getByRole('alert').textContent).toMatch(/datasheet/);
  });
});
