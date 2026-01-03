import { test, expect } from '@playwright/test';

/**
 * EMERSON ENERGY - Generator Pages E2E Tests
 * Tests for generator product pages and functionality
 */

test.describe('Generators Page', () => {
  test('should load generators page', async ({ page }) => {
    await page.goto('/generators');
    
    // Check page loaded
    await expect(page).toHaveTitle(/generator/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should display generator products', async ({ page }) => {
    await page.goto('/generators');
    
    // Page should have content about generators
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toContain('kva');
  });

  test('should have call-to-action buttons', async ({ page }) => {
    await page.goto('/generators');
    
    // Look for CTA buttons
    const buttons = page.getByRole('button');
    await expect(buttons.first()).toBeVisible();
  });
});

test.describe('Generator Sub-pages', () => {
  test('should load maintenance page', async ({ page }) => {
    await page.goto('/generators/maintenance');
    
    await expect(page.locator('h1').first()).toBeVisible();
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toContain('maintenance');
  });

  test('should load spare parts page', async ({ page }) => {
    await page.goto('/generators/spare-parts');
    
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should load rental page', async ({ page }) => {
    await page.goto('/generators/rental');
    
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should load installation page', async ({ page }) => {
    await page.goto('/generators/installation');
    
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
