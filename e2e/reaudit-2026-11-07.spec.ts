import { test, expect } from '@playwright/test';

/**
 * Re-audit 7 November 2026: browser checks for the corrected pages.
 *
 * Run against the LOCAL production build only:
 *   PLAYWRIGHT_BASE_URL=http://localhost:3111 npx playwright test e2e/reaudit-2026-11-07.spec.ts --project=chromium
 *
 * No side effects: /api/contact is answered by the test itself, and every
 * Google tag request is aborted, so nothing is emailed, stored or counted.
 * The site's middleware refuses HeadlessChrome, so a normal desktop UA is set.
 */
test.use({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
});

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com|doubleclick\.net|googleadservices\.com/, (r) => r.abort());
});

test('used generators: unit-by-unit stock, no brand-wide price or hour ranges', async ({ page }) => {
  await page.goto('/generators/used');
  const body = (await page.textContent('body')) ?? '';
  expect(body).toContain('Current Stock');
  expect(body).toContain('Request the current stock list');
  expect(body).toMatch(/2 years? warranty|2-year warranty/i);
  expect(body).not.toMatch(/KSh 800,000|2,000 – 8,500 hrs|AIRDOSER|Certified Pre-Owned Fleet/);
});

test('/specs/used/<brand> redirects to /generators/used', async ({ page }) => {
  const res = await page.goto('/specs/used/cummins');
  expect(page.url()).toMatch(/\/generators\/used$/);
  expect(res?.status()).toBe(200);
});

test('partner marketplace makes no unbacked undertakings', async ({ page }) => {
  await page.goto('/marketplace');
  const body = (await page.textContent('body')) ?? '';
  expect(body).toContain('In Formation');
  expect(body).not.toMatch(/automatic compensation|at no additional cost to you|we take responsibility/i);
  const res = await page.goto('/marketplace/partners/powertech-solutions');
  expect(page.url()).toMatch(/\/marketplace$/);
  expect(res?.status()).toBe(200);
});

test('generator brand table carries no star ratings', async ({ page }) => {
  await page.goto('/generators');
  const table = page.locator('table', { hasText: 'Parent company' }).first();
  await expect(table).toBeVisible();
  expect(await table.textContent()).not.toMatch(/⭐|\$\$/);
});

test('about page states the 2011 founding year', async ({ page }) => {
  await page.goto('/about-us');
  const body = (await page.textContent('body')) ?? '';
  expect(body).toContain('Est. 2011');
  expect(body).not.toContain('Est. 2013');
});

test('contact form: accepted enquiry shows a reference and pushes generate_lead without personal data', async ({ page }) => {
  let posted: Record<string, unknown> | null = null;
  await page.route('**/api/contact', async (route) => {
    posted = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, delivered: true, leadId: 34, reference: 'EIMS-000034', whatsappFallback: 'https://wa.me/254768860665?text=x' }),
    });
  });
  await page.goto('/contact');
  await page.getByPlaceholder('Your name').fill('E2E Test Buyer');
  await page.getByPlaceholder('you@company.com').fill('e2e.test@example.com');
  await page.getByPlaceholder('+254 7XX XXX XXX').fill('+254700000000');
  await page.getByPlaceholder(/Tell us about your site/).fill('Browser test only: please ignore.');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByText('EIMS-000034')).toBeVisible({ timeout: 15000 });
  expect(posted).not.toBeNull();

  const events = await page.evaluate(() => {
    const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
    return JSON.stringify(dl.map((e) => Array.from(e as ArrayLike<unknown>)));
  });
  // components/analytics/GoogleTags.tsx defines gtag() inline, so the event is
  // queued in dataLayer even though the tag script itself is blocked above.
  expect(events).toContain('generate_lead');
  expect(events).not.toMatch(/E2E Test Buyer|e2e\.test@example\.com|\+254700000000|please ignore/);
});
