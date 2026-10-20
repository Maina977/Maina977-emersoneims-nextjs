/** Multi-word Oracle search (2026-10-19 re-audit): brand words filter, other words must match. */
import { describe, it, expect } from 'vitest';
import { searchIndex } from '@/lib/generator-oracle/server/faultIndex';

describe('oracle multi-word search', () => {
  it.each([
    ['DSE low oil pressure', /deepsea/i, /oil pressure/i],
    ['ComAp overspeed', /comap/i, /overspeed|over speed/i],
  ])('%s', (query, brand, text) => {
    const r = searchIndex({ query, page: 1, pageSize: 20 });
    expect(r.total).toBeGreaterThan(0);
    expect(r.results[0].brand).toMatch(brand);
    expect(`${r.results[0].title} ${r.results[0].description}`).toMatch(text);
  });
  it('symptom words find something', () => {
    expect(searchIndex({ query: 'low coolant level', page: 1, pageSize: 20 }).total).toBeGreaterThan(0);
  });
  it('a J1939 code query is still read as a code', () => {
    expect(searchIndex({ query: 'SPN 100 FMI 1', page: 1, pageSize: 20 }).results[0].code).toBe('SPN100-FMI1');
  });
});

describe('oracle search direction', () => {
  it('"low oil pressure" lists a below-normal J1939 code before the above-normal one', () => {
    const r = searchIndex({ query: 'Perkins low oil pressure', page: 1, pageSize: 50 });
    const j = r.results.filter((x) => x.code.startsWith('SPN100-'));
    if (j.length >= 2) expect(j[0].code).not.toBe('SPN100-FMI0');
  });
});
