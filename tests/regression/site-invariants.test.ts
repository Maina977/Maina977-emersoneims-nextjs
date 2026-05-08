/**
 * Site invariants — regression protection.
 *
 * These tests freeze a small set of structural facts that have repeatedly
 * regressed in the past. Each test corresponds to a documented root cause
 * in the audit report; if a future change breaks any of them the build
 * will fail before deploy.
 *
 *   1. Global B2B strip is mounted in the root layout.
 *   2. Resources index links to the (previously hidden) Solar / UPS Hub.
 *   3. WiringDiagramsPanel never falls back to DSE 7320 wiring.
 *   4. Generator Oracle is NOT placed under the Resources mega menu.
 *   5. /services/hospital-incinerators slug exists in the service registry.
 *   6. PremiumFooter still carries the canonical email + both phone numbers.
 *   7. validateControllerWiringMatch rejects cross-brand wiring (PowerWizard
 *      cannot be served DSE 7320 wiring).
 *
 * NOTE: Tests #8 (no live import from quarantined building mirror) and #12
 * (quarantine destination exists, source removed) are intentionally NOT
 * included in this changeset. They depend on the components/building/** and
 * lib/building/** quarantine, which is a separate architectural change
 * scheduled for a later, isolated commit. Re-add them only when that
 * quarantine actually ships.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { validateControllerWiringMatch } from '@/lib/generator-oracle/wiringGuard';

const ROOT = path.resolve(__dirname, '..', '..');
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

describe('site invariants — regression protection', () => {
  it('1. global B2B strip is mounted in app/layout.tsx', () => {
    const layout = read('app/layout.tsx');
    expect(layout).toMatch(
      /import\s+B2BSiteStrip\s+from\s+['"]@\/components\/b2b\/B2BSiteStrip['"]/,
    );
    expect(layout).toMatch(/<B2BSiteStrip\s*\/?>/);
  });

  it('2. resources index links the Solar / UPS Hub', () => {
    const resources = read('app/resources/page.tsx');
    expect(resources).toContain('/resources/solar-ups-hub');
  });

  it('2b. Solar / UPS Hub stays prominent (Quick Access band OR first card in its category)', () => {
    // Discoverability invariant: after a prior incident where the card was buried as the
    // 6th item of the 3rd section and reported "not visible" on production, freeze its
    // prominence. It must live either inside the Quick Access band at the top of the
    // page, or as the FIRST resource of one of the RESOURCE_CATEGORIES blocks.
    const src = read('app/resources/page.tsx');
    const HUB = '/resources/solar-ups-hub';

    const quickStart = src.indexOf('{/* Quick Access */}');
    const quickEnd = src.indexOf('{/* Resource Categories */}');
    expect(quickStart, 'Quick Access band marker must exist').toBeGreaterThan(0);
    expect(quickEnd, 'Resource Categories marker must exist').toBeGreaterThan(quickStart);
    const quickBand = src.slice(quickStart, quickEnd);
    const inQuickAccess = quickBand.includes(HUB);

    // Fallback: first href inside any `resources: [` block in RESOURCE_CATEGORIES.
    let firstInAnyCategory = false;
    const categoryBlocks = src.matchAll(/resources:\s*\[\s*\{\s*href:\s*['"]([^'"]+)['"]/g);
    for (const m of categoryBlocks) {
      if (m[1] === HUB) {
        firstInAnyCategory = true;
        break;
      }
    }

    expect(
      inQuickAccess || firstInAnyCategory,
      'Solar / UPS Hub must be in Quick Access OR first card of a category',
    ).toBe(true);
  });

  it('3. WiringDiagramsPanel never falls back to DSE 7320 wiring', () => {
    const panel = read('components/generator-oracle/panels/WiringDiagramsPanel.tsx');
    // No pattern of `|| CONTROLLER_PINS['dse-7320']` or `?? CONTROLLER_PINS['dse-7320']`.
    expect(panel).not.toMatch(/\|\|\s*CONTROLLER_PINS\[\s*['"]dse-?7320['"]/i);
    expect(panel).not.toMatch(/\?\?\s*CONTROLLER_PINS\[\s*['"]dse-?7320['"]/i);
    // Wiring guard must be imported and the unavailable message must be used.
    expect(panel).toContain('@/lib/generator-oracle/wiringGuard');
    expect(panel).toContain('WIRING_UNAVAILABLE_MESSAGE');
  });

  it('4. Generator Oracle is NOT placed inside the Resources mega menu', () => {
    const nav = read('components/navigation/TeslaStyleNavigation.tsx');
    // Find the resources mega-menu block and assert /generator-oracle is absent
    // inside it. The block starts at `resources: {` and ends at the next
    // top-level mega key or the closing of MEGA_MENUS.
    const resourcesIdx = nav.indexOf('resources: {');
    expect(resourcesIdx, 'resources mega menu must exist').toBeGreaterThan(0);
    // The block ends at the next `},\n  };` (close of MEGA_MENUS) or the next
    // top-level key like `\n  generators: {` etc. We use a conservative slice.
    const slice = nav.slice(resourcesIdx, resourcesIdx + 4000);
    // Cut off at the next top-level mega key declaration if present.
    const cutAt = slice.search(/\n};/);
    const block = cutAt > 0 ? slice.slice(0, cutAt) : slice;
    expect(block).not.toMatch(/href:\s*['"]\/generator-oracle['"]/);
  });

  it('5. /services/hospital-incinerators slug exists in the service registry', () => {
    const services = read('lib/services/allServices.ts');
    expect(services).toMatch(/slug:\s*['"]hospital-incinerators['"]/);
  });

  it('6. PremiumFooter carries canonical email + both phone numbers', () => {
    const footer = read('components/layout/PremiumFooter.tsx');
    expect(footer).toContain('info@emersoneims.com');
    expect(footer).toContain('+254768860665');
    expect(footer).toContain('+254782914717');
  });

  it('7. validateControllerWiringMatch rejects cross-brand wiring', () => {
    // PowerWizard must never receive DSE wiring.
    const r1 = validateControllerWiringMatch('PowerWizard', '2.0', 'DSE', '7320 MKII');
    expect(r1.ok).toBe(false);
    // SmartGen must never receive DSE wiring.
    const r2 = validateControllerWiringMatch('SmartGen', 'HGM9320', 'DSE', '7320');
    expect(r2.ok).toBe(false);
    // ComAp must never receive DSE wiring.
    const r3 = validateControllerWiringMatch('ComAp', 'InteliGen NT', 'DSE', '7320');
    expect(r3.ok).toBe(false);
    // DSE → DSE passes.
    const r4 = validateControllerWiringMatch('DSE', '7320 MKII', 'DSE', '7320 MKII');
    expect(r4.ok).toBe(true);
  });

  it('9. homepage links the Solar / UPS Hub (restored teaser)', () => {
    const home = read('components/home/HomePageClient.tsx');
    expect(home).toContain('/resources/solar-ups-hub');
    expect(home).toMatch(/Solar\s*\/\s*UPS\s*Hub/i);
  });

  it('10. AI surfaces use the honest unavailable-state primitives', () => {
    // The AI panels MUST gate behind useAIAvailable and render
    // AIUnavailableNotice when the local AI stack is not configured.
    // This prevents the half-fake AI failure mode.
    const aiPanel = read('components/generator-oracle/panels/AIAnalysisPanel.tsx');
    expect(aiPanel).toContain('@/lib/generator-oracle/useAIAvailable');
    expect(aiPanel).toContain('@/components/generator-oracle/AIUnavailableNotice');
    // The diagnostic service must classify its own source honestly.
    const svc = read('lib/generator-oracle/aiDiagnosticService.ts');
    expect(svc).toMatch(/AIDiagnosticSource\s*=\s*['"]rule-based['"]\s*\|\s*['"]local-ai['"]\s*\|\s*['"]unavailable['"]/);
    expect(svc).toContain('isAIDiagnosticsEnabled');
  });

  it('11. eslint config hard-bans imports from the quarantined mirror chain', () => {
    const cfg = read('eslint.config.mjs');
    expect(cfg).toContain('components/building/**');
    expect(cfg).toContain('lib/building/**');
    expect(cfg).toMatch(/DEAD MIRROR/);
  });
});
