import { describe, it, expect } from 'vitest';
import { isPublishable, activePromotion, PROMOTIONS, type Promotion } from '@/lib/promotions/promotions';

/*
 * The site published two promotions whose deadlines could never pass, and a
 * "March Sale" that ran in August. These tests hold the gate shut: a promotion
 * is publishable only when every condition is genuinely satisfied.
 */

const valid: Promotion = {
  id: 'test',
  enabled: true,
  headline: '10% off scheduled maintenance contracts',
  startsAt: '2026-08-01T00:00:00Z',
  endsAt: '2026-09-30T23:59:59Z',
  terms: ['Applies to 12-month contracts signed within the offer period.'],
  eligibleProducts: ['Generator maintenance contracts'],
  approvedBy: 'Test approver, 2026-08-01',
};

const inside = new Date('2026-09-01T12:00:00Z');

describe('isPublishable — the happy path', () => {
  it('publishes a complete, approved, in-date promotion', () => {
    expect(isPublishable(valid, inside)).toBe(true);
  });
});

describe('isPublishable — dates must be real and current', () => {
  it('refuses a promotion that has not started', () => {
    expect(isPublishable(valid, new Date('2026-07-01T00:00:00Z'))).toBe(false);
  });

  it('refuses a promotion that has ended — the March Sale case', () => {
    // A "March Sale" was live in August. An expired promotion must vanish on
    // its own, without anyone remembering to take it down.
    expect(isPublishable(valid, new Date('2026-12-01T00:00:00Z'))).toBe(false);
  });

  it('refuses an end date that precedes the start date', () => {
    expect(isPublishable({ ...valid, endsAt: '2026-07-01T00:00:00Z' }, inside)).toBe(false);
  });

  it('refuses unparseable dates rather than treating them as open-ended', () => {
    expect(isPublishable({ ...valid, endsAt: 'soon' }, inside)).toBe(false);
    expect(isPublishable({ ...valid, startsAt: '' }, inside)).toBe(false);
  });
});

describe('isPublishable — completeness', () => {
  it('refuses a disabled promotion even when in date', () => {
    expect(isPublishable({ ...valid, enabled: false }, inside)).toBe(false);
  });

  it('refuses a promotion with no terms', () => {
    expect(isPublishable({ ...valid, terms: [] }, inside)).toBe(false);
  });

  it('refuses a promotion with no eligible products', () => {
    expect(isPublishable({ ...valid, eligibleProducts: [] }, inside)).toBe(false);
  });

  it('refuses a promotion nobody approved', () => {
    expect(isPublishable({ ...valid, approvedBy: '' }, inside)).toBe(false);
  });

  it('refuses an empty headline', () => {
    expect(isPublishable({ ...valid, headline: '   ' }, inside)).toBe(false);
  });
});

describe('activePromotion', () => {
  it('returns null when nothing is approved — the current, correct state', () => {
    expect(PROMOTIONS).toHaveLength(0);
    expect(activePromotion()).toBeNull();
  });

  it('never invents urgency from the visitor clock', () => {
    // The defect being prevented: a deadline derived from "now" restarts for
    // every visitor. Two different "now" values inside the window must not
    // change whether the SAME promotion is publishable.
    const a = isPublishable(valid, new Date('2026-08-05T00:00:00Z'));
    const b = isPublishable(valid, new Date('2026-09-20T00:00:00Z'));
    expect(a).toBe(b);
  });
});
