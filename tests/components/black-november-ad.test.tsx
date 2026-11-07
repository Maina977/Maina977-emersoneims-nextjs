/**
 * Black November 2026 homepage ad (owner, 7 Nov 2026).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import BlackNovemberAd from '@/components/campaign/BlackNovemberAd';
import { CAMPAIGN_SCENES, CAMPAIGN_END, CAMPAIGN_TERMS } from '@/lib/campaign/blackNovember';

const root = join(__dirname, '..', '..');

describe('Black November ad', () => {
  it('shows the owner\'s offer, a real quote link, WhatsApp and the terms link', () => {
    const { container } = render(<BlackNovemberAd />);
    for (const t of ['Free ATS', '6 months free service', '2-year warranty', 'Free countrywide delivery', 'Free installation', 'Maintenance & synchronization']) {
      expect(screen.getByText(t)).toBeTruthy();
    }
    expect(screen.getByText(/For generators below 100 kVA/)).toBeTruthy();
    expect(container.querySelector('a[href="/contact?type=black-november"]')).toBeTruthy();
    expect(container.querySelector('a[href^="https://wa.me/254768860665?text="]')).toBeTruthy();
    expect(container.querySelector('a[href="/black-november"]')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2 }).textContent).toMatch(/Power that\s*means business\./i);
  });

  it('makes no claim the owner did not give', () => {
    const src = readFileSync(join(root, 'components/campaign/BlackNovemberAd.tsx'), 'utf8') + readFileSync(join(root, 'lib/campaign/blackNovember.ts'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(src).not.toMatch(/Offer Extended|\d+\s?% off|guarantee/i);
    // Owner, 7 Nov 2026: no VOLTKA in the ad; "Generators powered by Cummins engines" instead.
    const visible = src.replace(/src: '[^']*'/g, '').replace(/\/\/.*$/gm, '');
    expect(visible).not.toMatch(/VOLTKA/);
    expect(src).toMatch(/Generators powered by Cummins engines/);
    expect(CAMPAIGN_TERMS.join(' ')).toMatch(/written in your quotation/);
  });

  it('uses only the owner\'s own photos, all present', () => {
    for (const s of CAMPAIGN_SCENES) expect(existsSync(join(root, 'public', s.src)), s.src).toBe(true);
    expect(existsSync(join(root, 'public/images/logo-tagline.png'))).toBe(true);
  });

  it('is placed under the hero without touching existing homepage media', () => {
    const page = readFileSync(join(root, 'app/page.tsx'), 'utf8');
    expect(page.indexOf('<BlackNovemberAd />')).toBeGreaterThan(page.indexOf('<StaticHeroFallback />'));
    expect(page.indexOf('<BlackNovemberAd />')).toBeLessThan(page.indexOf('<BuyerDirectory />'));
    expect(CAMPAIGN_END).toBe('2027-05-07');
  });
});
