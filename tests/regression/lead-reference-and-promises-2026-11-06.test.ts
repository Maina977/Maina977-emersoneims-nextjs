/**
 * 2026-11-06: customers get an enquiry reference (EIMS-000034), and the live
 * forms and banners make only the response promises the owner confirmed
 * (lib/business/responseTime.ts: under 4 h in the Nairobi metro; no hour count
 * after a form is sent).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { leadReference, referenceFromResponse } from '@/lib/leads/reference';

describe('lead reference', () => {
  it('formats stored lead ids and refuses anything else', () => {
    expect(leadReference(34)).toBe('EIMS-000034');
    expect(leadReference('1234567')).toBe('EIMS-1234567');
    expect(leadReference(0)).toBeNull();
    expect(leadReference(-1)).toBeNull();
    expect(leadReference(1.5)).toBeNull();
    expect(leadReference(undefined)).toBeNull();
  });

  it('reads the reference from an /api/contact response', () => {
    expect(referenceFromResponse({ success: true, reference: 'EIMS-000034', leadId: 34 })).toBe('EIMS-000034');
    expect(referenceFromResponse({ success: true, leadId: 35 })).toBe('EIMS-000035');
    expect(referenceFromResponse({ success: true, leadId: 0 })).toBeNull();
    expect(referenceFromResponse({ reference: '<script>' })).toBeNull();
    expect(referenceFromResponse(null)).toBeNull();
  });

  it('the API returns it and every live enquiry form shows it', () => {
    const root = join(__dirname, '..', '..');
    expect(readFileSync(join(root, 'app/api/contact/route.ts'), 'utf8')).toMatch(/reference: leadReference\(leadId\)/);
    for (const f of [
      'app/contact/page.tsx',
      'components/forms/QuickInquiryForm.tsx',
      'app/booking/page.tsx',
      'components/conversion/ExitIntentPopup.tsx',
      'components/generators/GeneratorSizingCalculator.tsx',
    ]) {
      const src = readFileSync(join(root, f), 'utf8');
      expect(src, f).toMatch(/referenceFromResponse\(/);
      expect(src, f).toMatch(/\{leadRef\}/);
    }
  });
});

describe('response promises on live pages', () => {
  const root = join(__dirname, '..', '..');
  const LIVE = [
    'app/contact/page.tsx',
    'components/forms/QuickInquiryForm.tsx',
    'app/booking/page.tsx',
    'components/conversion/ExitIntentPopup.tsx',
    'components/generators/GeneratorSizingCalculator.tsx',
    'components/cta/EmergencyCTA.tsx',
    'components/solar/SolarInstallationBooking.tsx',
    'app/services/page.tsx',
    'app/pricing/page.tsx',
    'components/navigation/TeslaStyleNavigation.tsx',
  ];
  const BANNED = [
    /within 2 (working )?hours/i,
    /2 working hours/i,
    /2-Hour Response/i,
    /within 30 minutes/i,
    /within 24 hours/i,
    /worth <span[^>]*>KES 15,000/i,
    /Offer expires/i,
    /98\.7% Uptime/i,
    /50\+ vetted partners/i,
    /Branch finder/i,
    /Booking Confirmed!/,
  ];
  it('make no unconfirmed hour counts, offers or guarantees', () => {
    for (const f of LIVE) {
      const code = readFileSync(join(root, f), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .split('\n')
        .filter((l) => !l.trim().startsWith('//'))
        .join('\n');
      for (const re of BANNED) expect(re.test(code), `${f}: ${re}`).toBe(false);
    }
  });

  it('the exit popup only reports success when the server accepted the lead', () => {
    const src = readFileSync(join(root, 'components/conversion/ExitIntentPopup.tsx'), 'utf8');
    expect(src).toMatch(/if \(!res\.ok\) throw/);
    const calc = readFileSync(join(root, 'components/generators/GeneratorSizingCalculator.tsx'), 'utf8');
    expect(calc).toMatch(/if \(!res\.ok\) throw/);
  });
});
