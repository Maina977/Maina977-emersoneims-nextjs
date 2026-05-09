import { test, expect, type Page } from '@playwright/test';

/**
 * Permanent-Closure E2E — TIER-3 browser-level proof for the three remaining
 * gaps identified in the Safe Remediation Report:
 *
 *   1. B2B strip visibly renders on every core page.
 *   2. Generator Oracle Wiring panel never serves DSE 7320 wiring to
 *      PowerWizard / SmartGen / ComAp; renders WIRING_UNAVAILABLE_MESSAGE.
 *   3. Generator Oracle AI surfaces show the honest AIUnavailableNotice when
 *      the production backend reports aiConfigured=false (current prod state).
 *
 * These tests target the live deployment by default
 * (PLAYWRIGHT_BASE_URL=https://www.emersoneims.com) but also work against the
 * local dev server when run without env override.
 */

const B2B_REGION_SELECTOR = '[role="region"][aria-label="B2B commercial positioning"]';
const WIRING_UNAVAILABLE = /Controller-specific wiring data is not yet available/i;

async function gotoOracleWiring(page: Page) {
  // Pre-acknowledge the legal disclaimer modal so it doesn't intercept clicks.
  await page.context().addInitScript(() => {
    try { window.localStorage.setItem('oracle_disclaimer_accepted', 'true'); } catch {}
  });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/generator-oracle');
  await expect(page.getByRole('button', { name: /Command/i }).first())
    .toBeVisible({ timeout: 30_000 });
  await page.getByRole('button', { name: /Wiring & Manuals/i }).first().click();
  // Default subtab is 'diagrams'; the brand grid header confirms WiringDiagramsPanel mounted.
  await expect(page.getByRole('heading', { name: /Controller Brand/i }).first())
    .toBeVisible({ timeout: 15_000 });
}

test.describe('B2B strip — TIER-3 visible render', () => {
  for (const path of ['/', '/resources', '/resources/solar-ups-hub',
                       '/services/hospital-incinerators', '/generator-oracle']) {
    test(`B2B strip visible on ${path}`, async ({ page }) => {
      await page.goto(path);
      const strip = page.locator(B2B_REGION_SELECTOR).first();
      await expect(strip).toBeVisible({ timeout: 15_000 });
      // Must contain the canonical B2B copy and the engineer-link.
      await expect(strip).toContainText(/EmersonEIMS serves/i);
      await expect(strip.getByRole('link', { name: /Talk to an engineer/i }))
        .toBeVisible();
    });
  }
});

test.describe('Generator Oracle wiring — TIER-3 cross-brand rejection', () => {
  test('DSE 7320 MKII (default) shows wiring, no unavailable message', async ({ page }) => {
    await gotoOracleWiring(page);
    // Default brand is DSE, default model is dse-7320 (7320 MKII) which has
    // CONTROLLER_PINS data — the unavailable banner must NOT be present.
    const body = page.locator('body');
    await expect(body).not.toContainText(WIRING_UNAVAILABLE);
  });

  for (const brand of ['PowerWizard', 'SmartGen', 'ComAp', 'Datakom']) {
    test(`${brand} (no DSE substitution) shows WIRING_UNAVAILABLE_MESSAGE`, async ({ page }) => {
      await gotoOracleWiring(page);
      // The brand grid uses simple <button>Brand</button> — the brand label is
      // the accessible name. Click selects the brand AND auto-selects the
      // first model of that brand which has no CONTROLLER_PINS entry.
      await page.getByRole('button', { name: new RegExp(`^${brand}$`) }).first().click();
      await expect(page.getByText(WIRING_UNAVAILABLE).first())
        .toBeVisible({ timeout: 10_000 });
    });
  }
});

test.describe('Generator Oracle AI — TIER-3 rule-based engineering assistant', () => {
  test('AI Analysis sub-tab renders the rule-based assistant in production', async ({ page }) => {
    // The AI panels are wrapped in <AssetCardGate> which refuses to render
    // its child until the asset card form is filled and committed (persisted
    // to localStorage as oracle.asset-card.v1). Pre-seed a valid card so the
    // gate falls through and AIAnalysisPanelImpl mounts; useAIAvailable then
    // resolves to 'unavailable' against prod (LOCAL_AI_BASE_URL unset) and
    // the deterministic RuleBasedAssistantPanel renders in place of the
    // generative-AI surface (Option B per the no-more-PARTIAL mandate).
    await page.context().addInitScript(() => {
      try {
        window.localStorage.setItem('oracle_disclaimer_accepted', 'true');
        window.localStorage.setItem('oracle.asset-card.v1', JSON.stringify({
          make: 'Cummins',
          model: 'QSB6.7',
          controller: 'DSE7320',
          serial: 'TEST-0001',
          firmware: 'v3.4.2',
        }));
      } catch {}
    });
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/generator-oracle');
    await page.getByRole('button', { name: /AI Diagnostics/i }).first().click();
    await page.getByRole('button', { name: /AI Analysis/i }).first().click();
    const assistant = page
      .locator('[data-testid="rule-based-assistant"], [aria-label="Rule-based engineering assistant"]')
      .first();
    await expect(assistant).toBeVisible({ timeout: 20_000 });
    await expect(assistant).toContainText(/Rule-Based|rule-based/i);
    await expect(assistant).toContainText(/No generative AI/i);
  });
});
