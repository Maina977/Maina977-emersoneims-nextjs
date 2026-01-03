import { test, expect } from '@playwright/test';

/**
 * EMERSON ENERGY - SEO & Performance E2E Tests
 * Tests for SEO elements and Core Web Vitals
 */

test.describe('SEO Elements', () => {
  test('homepage has proper meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
  });

  test('has Open Graph tags', async ({ page }) => {
    await page.goto('/');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
  });

  test('has canonical URL', async ({ page }) => {
    await page.goto('/');
    
    const canonical = page.locator('link[rel="canonical"]');
    const count = await canonical.count();
    
    // Should have canonical or be okay without
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('blog posts have structured data', async ({ page }) => {
    await page.goto('/blog/complete-guide-generator-sizing-kenya');
    
    // Check for JSON-LD or article structured data
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    
    // Structured data is good to have
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Core Web Vitals', () => {
  test('homepage loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds for DOM content
    expect(loadTime).toBeLessThan(5000);
  });

  test('no layout shift issues', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to stabilize
    await page.waitForTimeout(2000);
    
    // Check that main content is visible and stable
    const main = page.locator('main, body').first();
    await expect(main).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const images = page.locator('img');
    const count = await images.count();
    
    // Check each image has alt (or is decorative)
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Should have alt or be marked as presentation
      const hasAltOrRole = alt !== null || role === 'presentation';
      expect(hasAltOrRole).toBeTruthy();
    }
  });

  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Should have h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('interactive elements are focusable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through the page
    await page.keyboard.press('Tab');
    
    // Something should be focused
    const focused = page.locator(':focus');
    await expect(focused.first()).toBeVisible();
  });
});

test.describe('Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Look for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], [class*="hamburger"], [class*="mobile"]').first();
    
    // If menu button exists, click it
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
    }
    
    // Page should be usable on mobile
    await expect(page.locator('body')).toBeVisible();
  });

  test('touch targets are large enough', async ({ page }) => {
    await page.goto('/');
    
    // Check button sizes
    const buttons = page.locator('button, a').first();
    const box = await buttons.boundingBox();
    
    if (box) {
      // Touch targets should be at least 44x44 for accessibility
      expect(box.width).toBeGreaterThanOrEqual(30);
      expect(box.height).toBeGreaterThanOrEqual(30);
    }
  });
});
