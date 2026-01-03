import { test, expect } from '@playwright/test';

/**
 * EMERSON ENERGY - Contact & Forms E2E Tests
 */

test.describe('Contact Page', () => {
  test('should load contact page', async ({ page }) => {
    await page.goto('/contact');
    
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should display phone numbers', async ({ page }) => {
    await page.goto('/contact');
    
    const content = await page.textContent('body');
    
    // Check for Emerson phone numbers
    expect(content).toContain('0768860655');
    // Or formatted version
    const hasPhone = content?.includes('0768') || content?.includes('768');
    expect(hasPhone).toBeTruthy();
  });

  test('should have clickable phone links', async ({ page }) => {
    await page.goto('/contact');
    
    // Check for tel: links
    const phoneLinks = page.locator('a[href^="tel:"]');
    const count = await phoneLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have WhatsApp link', async ({ page }) => {
    await page.goto('/contact');
    
    // Check for WhatsApp link
    const whatsappLink = page.locator('a[href*="wa.me"], a[href*="whatsapp"]');
    const count = await whatsappLink.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Contact Form', () => {
  test('should have contact form elements', async ({ page }) => {
    await page.goto('/contact');
    
    // Look for form elements
    const inputs = page.locator('input, textarea');
    const inputCount = await inputs.count();
    
    // Should have some form inputs
    expect(inputCount).toBeGreaterThan(0);
  });
});
