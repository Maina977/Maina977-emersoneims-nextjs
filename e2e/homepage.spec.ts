import { test, expect } from '@playwright/test';

/**
 * EMERSON ENERGY - Homepage E2E Tests
 * Critical user flows for the homepage
 */

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Emerson/i);
    
    // Check main heading is visible
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Check navigation exists
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
    
    // Check key navigation links
    await expect(page.getByRole('link', { name: /generator/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /solar/i }).first()).toBeVisible();
  });

  test('should have contact information visible', async ({ page }) => {
    // Check phone numbers are present somewhere on page
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('0768');
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
    
    // No horizontal scroll
    const body = page.locator('body');
    const bodyWidth = await body.evaluate(el => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });
});

test.describe('Navigation Flow', () => {
  test('should navigate to generators page', async ({ page }) => {
    await page.goto('/');
    
    // Click on generators link
    await page.getByRole('link', { name: /generator/i }).first().click();
    
    // Should be on generators page
    await expect(page).toHaveURL(/generator/);
  });

  test('should navigate to solar page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /solar/i }).first().click();
    
    await expect(page).toHaveURL(/solar/);
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /contact/i }).first().click();
    
    await expect(page).toHaveURL(/contact/);
  });
});

test.describe('Blog Section', () => {
  test('should load blog page', async ({ page }) => {
    await page.goto('/blog');
    
    // Check blog title
    await expect(page.locator('h1')).toContainText(/blog|insight|article/i);
  });

  test('should display blog articles', async ({ page }) => {
    await page.goto('/blog');
    
    // Check articles are present
    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();
  });

  test('should navigate to individual blog post', async ({ page }) => {
    await page.goto('/blog');
    
    // Click first article link
    await page.locator('article a').first().click();
    
    // Should be on article page
    await expect(page).toHaveURL(/blog\/.+/);
  });
});
