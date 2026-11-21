import { describe, it, expect } from 'vitest';
import { evidenceGate, gated, DEPTH_NEEDS } from '@/external/borehole-ai-engine/src/evidenceGate';
import { screeningContent, generateScreeningPdf } from '@/external/borehole-ai-engine/src/screeningReport';
import type { AnalysisResult } from '@/external/borehole-ai-engine/src/types';

// Release 5 (2026-11-20): "Avoid predicting drilling depth or sustainable yield
// without sufficient evidence"; no fabricated prices.
const desktop = { siteEvidence: { depth: false, yield: false, methods: [] } } as Pick<AnalysisResult, 'siteEvidence'>;
const surveyed = { siteEvidence: { depth: true, yield: false, methods: ['ERT/VES survey (TEST, 2026-11-01)'] } } as Pick<AnalysisResult, 'siteEvidence'>;
const full = { siteEvidence: { depth: true, yield: true, methods: ['ERT/VES survey', 'pumping test (2026-11-10)'] } } as Pick<AnalysisResult, 'siteEvidence'>;

describe('AquaScan evidence gate', () => {
  it('desktop only: no depth, no yield, no cost', () => {
    expect(evidenceGate(desktop)).toMatchObject({ depth: false, yield: false, cost: false });
    expect(evidenceGate(desktop).note).toMatch(/does not give a drilling depth, a yield or a project cost/);
    expect(evidenceGate(undefined)).toMatchObject({ depth: false, yield: false, cost: false });
  });
  it('a survey gives depth only; cost needs depth and yield', () => {
    expect(evidenceGate(surveyed)).toMatchObject({ depth: true, yield: false, cost: false });
    expect(evidenceGate(full)).toMatchObject({ depth: true, yield: true, cost: true });
  });
  it('gated() shows the value only with evidence', () => {
    expect(gated(false, '61m', DEPTH_NEEDS)).toBe('Needs a field survey');
    expect(gated(true, '61m', DEPTH_NEEDS)).toBe('61m');
  });
});

describe('desktop screening report', () => {
  const r = { ...desktop, site: { latitude: 1.0157, longitude: 35.0062 }, dataSources: ['NASA POWER', 'SRTM'] } as unknown as AnalysisResult;
  it('states what is and is not established, with no depth, yield or price', () => {
    const c = screeningContent(r, new Date('2026-11-20T00:00:00Z'));
    const all = JSON.stringify(c);
    expect(c.location).toBe('1.01570, 35.00620');
    expect(c.notEstablished.join(' ')).toMatch(/Drilling depth: needs a geophysical survey/);
    expect(c.notEstablished.join(' ')).toMatch(/Yield: needs a test-pumped borehole/);
    expect(all).not.toMatch(/\d+\s?m³|\$\s?\d|KES\s?\d|\b\d{2,3}\s?m\b depth/);
  });
  it('produces a PDF', () => {
    const pdf = generateScreeningPdf(r, false);
    expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe('%PDF-');
  });
});
