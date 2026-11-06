/**
 * Engineering review of /services/borehole-drilling (2026-11-06).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const page = readFileSync(join(__dirname, '..', '..', 'app/services/borehole-drilling/page.tsx'), 'utf8');

describe('borehole page review', () => {
  it('removes wrong or unsupported figures and invented codes', () => {
    for (const bad of [
      /&lt;3mg\/L is acceptable/, /&gt;15mg\/L requires filtration/, /72-hour test costs KES 150-300K/,
      /rotary drilling exclusively/, /300m\/day/, /3-7 days/, /increases yield 50-100%/,
      /1-5×10⁻² m²\/s/, /within 10-15 years/, /\(D01-D10\)|\(H01-H10\)/, /30\+ (error )?codes/i,
      /No dry holes/, /predicts yield before drilling/,
    ]) expect(bad.test(page), String(bad)).toBe(false);
  });

  it('states the corrected facts', () => {
    expect(page).toMatch(/iron at about 0\.3 mg\/L/);
    expect(page).toMatch(/down-the-hole \(DTH\) air hammers/);
    expect(page).toMatch(/24-hour test pumping at about KES 228,000/);
    expect(page).toMatch(/Common Drilling and Borehole Problems/);
  });
});
