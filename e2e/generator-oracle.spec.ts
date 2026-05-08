import { test, expect } from '@playwright/test';

/**
 * Generator Oracle E2E — exercises the 6 scoped tabs and proves the AI
 * "honest failure" path is wired end-to-end. No mocking — real backend, real
 * env. The chat assertion accepts either the amber AI_NOT_CONFIGURED banner
 * (no key) or the red AI_UPSTREAM_ERROR banner (key present but rejected) —
 * both are valid honest outcomes.
 */

const TABS = [
  { name: 'Command', id: 'command' },
  { name: 'Controllers & Simulators', id: 'controllers' },
  { name: 'Fault Center', id: 'faults' },
  { name: 'AI Diagnostics', id: 'ai' },
  { name: 'Systems', id: 'systems' },
  { name: 'Wiring & Manuals', id: 'wiring' },
];

test.describe('Generator Oracle', () => {
  test.beforeEach(async ({ page, context }) => {
    // Pre-acknowledge the legal disclaimer modal so it doesn't intercept clicks.
    // The component reads this localStorage flag during initial render.
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem('oracle_disclaimer_accepted', 'true');
      } catch {}
    });
    // Tab strip is in a desktop-only nav (xl breakpoint)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/generator-oracle');
    await expect(page.getByRole('button', { name: /Command/i }).first()).toBeVisible({ timeout: 30_000 });
  });

  test('page renders without runtime error', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.waitForLoadState('networkidle');
    expect(errors, errors.join('\n')).toEqual([]);
  });

  for (const tab of TABS) {
    test(`tab "${tab.name}" switches and renders content`, async ({ page }) => {
      const btn = page.getByRole('button', { name: new RegExp(tab.name, 'i') }).first();
      await btn.click();
      // Inner content <main> (the diagnostic surface) should be visible
      await expect(page.locator('main').last()).toBeVisible();
      // Active tab label should still be visible after click
      await expect(btn.locator('span').filter({ hasText: new RegExp(tab.name, 'i') })).toBeVisible();
    });
  }

  test('Fault Center sub-tabs are present', async ({ page }) => {
    await page.getByRole('button', { name: /Fault Center/i }).first().click();
    await expect(page.getByText(/Fault Code Lookup/i).first()).toBeVisible();
    await expect(page.getByText(/Detailed Analysis/i).first()).toBeVisible();
    await expect(page.getByText(/Interactive Troubleshoot/i).first()).toBeVisible();
  });

  test('Systems sub-tabs are present', async ({ page }) => {
    // Match the 🏭 Systems top-tab button (icon + label) by full accessible name
    await page.getByRole('button', { name: /Systems$/ }).first().click();
    await expect(page.getByText(/Interactive Systems/).first()).toBeVisible();
    await expect(page.getByText(/Engine/).first()).toBeVisible();
    await expect(page.getByText(/Electrical/).first()).toBeVisible();
    await expect(page.getByText(/Sensors/).first()).toBeVisible();
  });

  test('Controllers sub-tabs are present', async ({ page }) => {
    await page.getByRole('button', { name: /Controllers & Simulators/i }).first().click();
    await expect(page.getByText(/Controller Simulator/i).first()).toBeVisible();
    await expect(page.getByText(/ECM Suite/i).first()).toBeVisible();
    await expect(page.getByText(/ECM Hardware Link/i).first()).toBeVisible();
    await expect(page.getByText(/Pro Diagnostic Tools/i).first()).toBeVisible();
  });

  test('Wiring sub-tabs are present', async ({ page }) => {
    await page.getByRole('button', { name: /Wiring & Manuals/i }).first().click();
    await expect(page.getByText(/Wiring Diagrams/i).first()).toBeVisible();
    await expect(page.getByText(/All Controllers/i).first()).toBeVisible();
    await expect(page.getByText(/Repair Manuals/i).first()).toBeVisible();
  });

  test('AI Diagnostics sub-tabs are present', async ({ page }) => {
    await page.getByRole('button', { name: /AI Diagnostics/i }).first().click();
    await expect(page.getByText(/Expert Chat/i).first()).toBeVisible();
    await expect(page.getByText(/Visual Diagnose/i).first()).toBeVisible();
    await expect(page.getByText(/AI Analysis/i).first()).toBeVisible();
  });

  test('Expert Chat surfaces a structured error (honesty path)', async ({ page }) => {
    await page.getByRole('button', { name: /AI Diagnostics/i }).first().click();
    // Default sub-tab is Expert Chat. The chat surface is only mounted when
    // the server reports aiConfigured:true (otherwise the AIUnavailableNotice
    // takes its place — covered by a separate test below). Skip if absent.
    const input = page.locator('textarea').first();
    if (!(await input.isVisible().catch(() => false))) {
      test.skip(true, 'AI is unavailable on this server — covered by AIUnavailableNotice test');
    }
    await input.fill('What does DSE 0027 mean?');
    await input.press('Enter');

    // Either:
    //   (a) AI_NOT_CONFIGURED — amber banner "AI service not configured"
    //   (b) AI_UPSTREAM_ERROR — red banner "AI service error"
    //   (c) NETWORK_ERROR — red banner "Network error"
    // All three are HONEST — none is a fake assistant reply.
    const banner = page
      .getByText(
        /AI service not configured|AI service error|Network error|Request failed/i,
      )
      .first();
    await expect(banner).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/I'm having trouble connecting to the AI service/i)).toHaveCount(0);
  });
});

/**
 * Same module, but every AI panel is forced into its "unavailable" placeholder
 * by intercepting the health endpoints with aiConfigured:false. This proves
 * disabled-AI shows a clear "Coming Soon" notice rather than a half-functional
 * UI that could be mistaken for working AI.
 */
test.describe('Generator Oracle — AI disabled mode', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem('oracle_disclaimer_accepted', 'true');
      } catch {}
    });
    await page.route('**/api/generator-oracle/expert-chat', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'ok', aiConfigured: false, model: 'claude-opus-4-7' }),
        });
      } else {
        await route.continue();
      }
    });
    await page.route('**/api/generator-oracle/ai-visual-diagnose', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'ok', aiConfigured: false, model: 'claude-opus-4-7' }),
        });
      } else {
        await route.continue();
      }
    });
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/generator-oracle');
    await expect(page.getByRole('button', { name: /Command/i }).first()).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /AI Diagnostics/i }).first().click();
  });

  test('Expert Chat shows "Coming Soon" notice', async ({ page }) => {
    await expect(page.getByText(/Expert AI Chat — Coming Soon/i)).toBeVisible({ timeout: 15_000 });
    // Interactive textarea must NOT exist when AI is disabled.
    await expect(page.locator('textarea')).toHaveCount(0);
  });

  test('Visual Diagnose shows "Coming Soon" notice', async ({ page }) => {
    await page.getByRole('button', { name: /Visual Diagnose/i }).first().click();
    await expect(page.getByText(/AI Visual Diagnostic — Coming Soon/i)).toBeVisible({ timeout: 15_000 });
  });

  test('AI Analysis shows "Coming Soon" notice', async ({ page }) => {
    await page.getByRole('button', { name: /AI Analysis/i }).first().click();
    await expect(page.getByText(/AI Parameter Analysis — Coming Soon/i)).toBeVisible({ timeout: 15_000 });
  });
});
