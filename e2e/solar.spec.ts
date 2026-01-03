import { test, expect } from '@playwright/test';

/**
 * EMERSON ENERGY - Solar Pages E2E Tests
 */

test.describe('Solar Page', () => {
  test('should load solar page', async ({ page }) => {
    await page.goto('/solar');
    
    await expect(page.locator('h1').first()).toBeVisible();
    
    const content = await page.textContent('body');
    expect(content?.toLowerCase()).toContain('solar');
  });

  test('should display solar solutions', async ({ page }) => {
    await page.goto('/solar');
    
    // Check for solar-related content
    const content = await page.textContent('body');
    const hasSolarContent = 
      content?.toLowerCase().includes('panel') ||
      content?.toLowerCase().includes('battery') ||
      content?.toLowerCase().includes('inverter') ||
      content?.toLowerCase().includes('kw');
    
    expect(hasSolarContent).toBeTruthy();
  });
});
