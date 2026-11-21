import { describe, it, expect } from 'vitest';
import { secondPersonChecked } from '@/lib/solar/design/proposal';
import type { LibraryEntry } from '@/lib/solar/design/datasheet';

// Audit M1 (2026-11-21): a client-sent "verified" status is re-checked against
// its provenance. TEST names only.
const prov = { manufacturer: 'TEST', datasheetUrl: 'https://example.com/t.pdf', datasheetRevision: 'A', datasheetDate: '2026-01-01', enteredBy: 'Tester One', enteredOn: '2026-11-20' };
const e = (extra: Record<string, string>, status: 'verified' | 'unverified' = 'verified') =>
  ({ kind: 'module', id: 'm', data: {}, provenance: { ...prov, ...extra }, status, warnings: [] }) as unknown as LibraryEntry<unknown>;

describe('datasheet second-person check', () => {
  it('a different person with a valid date → checked', () => {
    expect(secondPersonChecked(e({ verifiedBy: 'Tester Two', verifiedOn: '2026-11-21' }))).toBe(true);
  });
  it('"verified" with no verifier, the same person (any case), or no valid date → not checked', () => {
    expect(secondPersonChecked(e({}))).toBe(false);
    expect(secondPersonChecked(e({ verifiedBy: ' tester one ', verifiedOn: '2026-11-21' }))).toBe(false);
    expect(secondPersonChecked(e({ verifiedBy: 'Tester Two', verifiedOn: 'yesterday' }))).toBe(false);
  });
  it('status unverified stays unverified even with a verifier', () => {
    expect(secondPersonChecked(e({ verifiedBy: 'Tester Two', verifiedOn: '2026-11-21' }, 'unverified'))).toBe(false);
  });
});
