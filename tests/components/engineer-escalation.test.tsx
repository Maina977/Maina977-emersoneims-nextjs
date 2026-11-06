/**
 * Generator Oracle -> engineer escalation (external audit, Nov 2026, §5).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import EngineerEscalation, { bookingHrefForFault } from '@/components/generator-oracle/EngineerEscalation';

describe('EngineerEscalation', () => {
  it('books an engineer with the fault carried in the link', () => {
    expect(bookingHrefForFault('SPN 110 FMI 0', 'High coolant temperature'))
      .toBe('/booking?type=generator-service&fault=SPN%20110%20FMI%200%20-%20High%20coolant%20temperature');
    expect(bookingHrefForFault('x'.repeat(300)).length).toBeLessThan(260);
  });

  it('shows both routes and the safety line', () => {
    render(<EngineerEscalation code="SPN 100 FMI 1" title="Low oil pressure" />);
    expect(screen.getByText('Need an engineer for this fault?')).toBeTruthy();
    expect(screen.getByText(/live electrical parts/)).toBeTruthy();
    const book = screen.getByRole('link', { name: 'Book an engineer' });
    expect(book.getAttribute('href')).toMatch(/^\/booking\?type=generator-service&fault=SPN%20100/);
    const wa = screen.getByRole('link', { name: /WhatsApp/ });
    expect(decodeURIComponent(wa.getAttribute('href') || '')).toMatch(/SPN 100 FMI 1 - Low oil pressure/);
  });

  it('is wired into the results and the booking form reads the fault', () => {
    const root = join(__dirname, '..', '..');
    const panel = readFileSync(join(root, 'components/generator-oracle/panels/FaultDiagnosticsPanel.tsx'), 'utf8');
    expect(panel).toMatch(/<EngineerEscalation code=\{lastSearched\}/);
    expect(panel).toMatch(/bookingHrefForFault\(/);
    const booking = readFileSync(join(root, 'app/booking/page.tsx'), 'utf8');
    expect(booking).toMatch(/params\.get\('fault'\)/);
    expect(booking).toMatch(/replace\(\/\[<>\]\/g, ''\)\.slice\(0, 160\)/);
  });
});
