/**
 * Stage 1 of trimming the near-duplicate location pages: only pages in the
 * sitemap or with search clicks/impressions stay indexable; the rest are
 * noindex, follow (still served, still linkable, same page for everyone).
 */
import { describe, it, expect } from 'vitest';
import keep from '@/lib/seo/locationKeepIndexed.json';
import { withLocationIndexPolicy, isLocationPageKeptIndexed } from '@/lib/seo/locationIndexPolicy';

describe('location index policy', () => {
  it('keeps a page that earned traffic indexable and untouched', () => {
    const kept = (keep as string[])[0];
    const meta = { title: 'x', robots: { index: true, follow: true } };
    expect(isLocationPageKeptIndexed(kept)).toBe(true);
    expect(withLocationIndexPolicy(kept, meta)).toBe(meta);
  });

  it('marks a page with no traffic noindex but still follow', () => {
    const meta = withLocationIndexPolicy('/kenya/nowhere/no-such-page', { title: 'x' });
    expect(meta.robots).toEqual({ index: false, follow: true });
    expect(meta.title).toBe('x');
  });

  it('keeps a reasonable share and only location paths', () => {
    const list = keep as string[];
    expect(list.length).toBeGreaterThan(500);
    expect(list.every((p) => /^\/(kenya|locations)\/[^/]+\/.+/.test(p))).toBe(true);
  });
});
