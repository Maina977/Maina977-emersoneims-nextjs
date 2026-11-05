/**
 * jsPDF's Helvetica has only WinAnsi glyphs; symbols outside it printed as
 * garbage in the AquaScan PDF (warning signs, arrows, subscripts).
 */
import { describe, it, expect } from 'vitest';
import { pdfSafeText } from '@/external/borehole-ai-engine/src/reportGenerator';

describe('AquaScan PDF text', () => {
  it('replaces symbols Helvetica cannot draw', () => {
    expect(pdfSafeText('⚠ FLUORIDE 1.20 → 0.90 mg/L')).toBe('! FLUORIDE 1.20 -> 0.90 mg/L');
    expect(pdfSafeText('Yield ≈ 0, TDS ≤ 1000, CO₂')).toBe('Yield ~ 0, TDS <= 1000, CO2');
  });
  it('keeps WinAnsi characters (degree, superscripts, dashes, bullets)', () => {
    const s = 'm³/h – 25°C • µS/cm — “ok”';
    expect(pdfSafeText(s)).toBe(s);
  });
  it('drops emoji rather than printing garbage', () => {
    expect(pdfSafeText('💧 Water')).toBe(' Water');
  });
});
