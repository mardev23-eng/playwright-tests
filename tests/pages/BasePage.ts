import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object class
 * Contains common functionality shared across all pages
 */
export abstract class BasePage {
  protected page: Page;
  
  // Common selectors
  protected header: Locator;
  protected footer: Locator;
  protected loadingSpinner: Locator;
  protected errorMessage: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.footer = page.locator('footer');
    this.loadingSpinner = page.locator('[data-testid="loading"]');
    this.errorMessage = page.locator('[data-testid="error"]');
  }
  
  /**
   * Navigate to a specific URL
   */
  async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }) {
    await this.page.goto(url, {
      waitUntil: options?.waitUntil || 'networkidle',
      timeout: 30000,
    });
  }
  
  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.waitForLoadingToComplete();
  }
  
  /**
   * Wait for loading spinner to disappear
   */
  async waitForLoadingToComplete() {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Loading spinner might not be present, which is fine
    }
  }
  
  /**
   * Check if page has loaded successfully
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }
  
  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }
  
  /**
   * Take screenshot
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
  
  /**
   * Scroll to element
   */
  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }
  
  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }
  
  /**
   * Check if element exists
   */
  async elementExists(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'attached', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get element text content
   */
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }
  
  /**
   * Click element with retry logic
   */
  async clickElement(locator: Locator, options?: { force?: boolean; timeout?: number }) {
    await locator.click({
      force: options?.force || false,
      timeout: options?.timeout || 10000,
    });
  }
  
  /**
   * Fill input field
   */
  async fillInput(locator: Locator, value: string) {
    await locator.clear();
    await locator.fill(value);
  }
  
  /**
   * Select option from dropdown
   */
  async selectOption(locator: Locator, value: string) {
    await locator.selectOption(value);
  }
  
  /**
   * Verify page accessibility
   */
  async checkAccessibility() {
    // Basic accessibility checks
    await expect(this.page.locator('h1')).toBeVisible();
    await expect(this.page.locator('[alt]')).toHaveAttribute('alt');
  }
  
  /**
   * Verify responsive design
   */
  async checkResponsiveDesign() {
    const viewports = [
      { width: 320, height: 568 },  // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];
    
    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(1000);
      await expect(this.header).toBeVisible();
    }
  }
  
  /**
   * Check page performance metrics
   */
  async getPerformanceMetrics() {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    });
    
    return metrics;
  }
}

export { BasePage }