/**
 * Priority 3 (2026-11-22): remaining layout shifts on desktop and mobile.
 * Measured with scripts/verify/cls-sources.cjs against a local production build.
 * These tests pin the fixes so a later edit cannot quietly bring a shift back.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { CONSENT_BAR_VAR, floatAboveConsentBar } from '@/lib/compliance/consentBarSpace';
import {
  MORE_WIDTH,
  PREDICTED_ITEM_CLASS,
  PREDICTED_MIN_VIEWPORT,
  PREDICTED_MORE_CLASS,
  REFERENCE_WIDTHS,
  fitNavItems,
  navRowWidth,
  predictedVisibleCount,
} from '@/components/navigation/priorityPlus';

const read = (p: string) => readFileSync(path.resolve(__dirname, '../..', p), 'utf8');

describe('floating controls clear the cookie notice without a layout change', () => {
  it('keeps a constant bottom and lifts by the banner height with translate', () => {
    expect(floatAboveConsentBar('1.5rem')).toEqual({
      bottom: '1.5rem',
      translate: `0 calc(-1 * var(${CONSENT_BAR_VAR}, 0px))`,
    });
  });

  it.each([
    'components/AccessibilityWidget.tsx',
    'components/chat/WhatsAppButton.tsx',
    'components/pwa/PWAInstallPrompt.tsx',
  ])('%s no longer moves `bottom` with the banner height', (file) => {
    const src = read(file);
    expect(src).toContain('floatAboveConsentBar(');
    expect(src).not.toMatch(/bottom:\s*['"`]calc\([^)]*--consent-bar-h/);
  });

  it('the banner reserves its space before its first frame is painted', () => {
    const src = read('components/compliance/CookieConsent.tsx');
    expect(src).toMatch(/const useBeforePaintEffect = typeof window !== 'undefined' \? useLayoutEffect : useEffect;/);
    expect(src).toMatch(/useBeforePaintEffect\(\(\) => \{\s*const root = document\.documentElement;/);
  });
});

describe('nav Priority+ prediction', () => {
  it('fitNavItems returns null while a width is unknown', () => {
    expect(fitNavItems([80, 0, 90], 2000, 120, 8)).toBeNull();
  });

  it('keeps everything when it fits and reserves MORE only while items remain', () => {
    expect(fitNavItems([100, 100], 100 + 8 + 100 + 50, 50, 8)).toBe(2);
    // One px short for the second item: it goes, and MORE's reserve applies to the first.
    expect(fitNavItems([100, 100], 100 + 8 + 100 + 50 - 1, 50, 8)).toBe(1);
    expect(fitNavItems([100, 100], 100 + 50 + MORE_WIDTH + 8 - 1, 50, 8)).toBe(0);
  });

  it('the server-rendered breakpoints show exactly what the measurement will keep (1024-1600 px)', () => {
    for (let vw = 1024; vw <= 1600; vw++) {
      const ref = vw >= 1280 ? REFERENCE_WIDTHS.xl : REFERENCE_WIDTHS.lg;
      const fit = fitNavItems(ref.items, navRowWidth(vw), ref.tail, ref.gap);
      expect({ vw, count: predictedVisibleCount(vw) }).toEqual({ vw, count: fit });
    }
  });

  it('the literal Tailwind classes agree with the numeric breakpoints', () => {
    PREDICTED_MIN_VIEWPORT.forEach((min, i) => {
      expect(PREDICTED_ITEM_CLASS[i]).toBe(min === 0 ? '' : `hidden min-[${min}px]:block`);
    });
    expect(PREDICTED_MORE_CLASS).toBe(`min-[${PREDICTED_MIN_VIEWPORT[PREDICTED_MIN_VIEWPORT.length - 1]}px]:hidden`);
  });

  it('the navigation uses the prediction until it has measured itself', () => {
    const src = read('components/navigation/TeslaStyleNavigation.tsx');
    expect(src).toContain("measured ? (i < visibleCount ? '' : 'hidden') : PREDICTED_ITEM_CLASS[i]");
    expect(src).toContain('(!measured || visibleCount < NAV_ITEMS.length)');
    expect(src).toContain('nav-caps-font');
  });
});

describe('page-specific sources', () => {
  it('AquaScan lays its form out from the first paint (disabled while loading) under an overlay', () => {
    const src = read('external/borehole-ai-engine/src/index.tsx');
    expect(src).toContain('<fieldset className="aq-init-fieldset" disabled={initStatus !== \'ready\'}>');
    expect(src).toContain('init-loading init-loading-overlay');
    expect(src).not.toMatch(/\{initStatus === 'ready' && \(\s*<>/);
    const css = read('external/borehole-ai-engine/src/styles.css');
    expect(css).toMatch(/\.init-loading-overlay\s*\{\s*position:\s*absolute;\s*inset:\s*0;/);
  });

  it('Solar keeps the loader height reserved when the workspace mounts', () => {
    // After the Report A merge the workspace renders through the shared resilient
    // loader (SolarApp); the same full-height reservation wraps it.
    expect(read('components/solar-modules/SolarGeniusProV2.tsx')).toContain('return <div className="min-h-[100dvh]"><SolarApp /></div>;');
  });

  it('the Generator Oracle scan line animates transform, not top', () => {
    const src = read('components/generator-oracle/GeneratorOracleModule.tsx');
    expect(src).toMatch(/@keyframes oracleScanLine \{\s*0% \{ transform: translateY\(-5vh\); \}\s*100% \{ transform: translateY\(105vh\); \}/);
    expect(src).not.toMatch(/@keyframes \w+ \{\s*0% \{ top:/);
  });

  it('the nav caps fallback face is declared next to the Inter alias', () => {
    const src = read('app/layout.tsx');
    expect(src).toContain("@font-face{font-family:'Inter Caps Fallback';src:local('Arial');");
    expect(src).toContain(".nav-caps-font{font-family:${INTER_PRIMARY_FAMILY},'Inter Caps Fallback',Arial,sans-serif}");
  });
});
