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
    // Default sub-tab is Expert Chat. Find the textarea and send a message.
    const input = page.locator('textarea').first();
    await expect(input).toBeVisible({ timeout: 15_000 });
    await input.fill('What does DSE 0027 mean?');
    // Send via Enter (no shift) — ExpertAIChatPanel's input handler treats this as submit
    await input.press('Enter');

    // Either:
    //   (a) AI_NOT_CONFIGURED — amber banner with "AI service not configured"
    //   (b) AI_UPSTREAM_ERROR — red banner with "AI service error"
    //   (c) NETWORK_ERROR — red banner with "Network error"
    // All three are HONEST — none is a fake assistant reply.
    const banner = page
      .getByText(
        /AI service not configured|AI service error|Network error|Request failed/i,
      )
      .first();
    await expect(banner).toBeVisible({ timeout: 30_000 });

    // Verify the canned fallback ("I'm having trouble connecting to the AI service right now") is GONE.
    await expect(page.getByText(/I'm having trouble connecting to the AI service/i)).toHaveCount(0);
  });
});
