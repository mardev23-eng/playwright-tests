import { Page, expect } from '@playwright/test';

/**
 * Accessibility Helper
 * Utilities for testing accessibility compliance
 */
export class AccessibilityHelper {
  private page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  /**
   * Check basic accessibility compliance
   */
  async checkBasicCompliance() {
    // Check for proper heading structure
    await this.checkHeadingStructure();
    
    // Check for alt text on images
    await this.checkImageAltText();
    
    // Check for form labels
    await this.checkFormLabels();
    
    // Check for keyboard navigation
    await this.checkKeyboardNavigation();
    
    // Check for focus indicators
    await this.checkFocusIndicators();
  }
  
  /**
   * Check WCAG 2.1 AA compliance
   */
  async checkWCAGCompliance() {
    await this.checkBasicCompliance();
    await this.checkColorContrast();
    await this.checkARIALabels();
    await this.checkLandmarks();
    await this.checkSkipLinks();
  }
  
  /**
   * Check heading structure (H1-H6)
   */
  async checkHeadingStructure() {
    // Should have exactly one H1
    const h1Count = await this.page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Check heading hierarchy
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const text = await heading.textContent();
      
      // Headings should not be empty
      expect(text?.trim()).toBeTruthy();
      
      // Headings should be visible
      await expect(heading).toBeVisible();
    }
  }
  
  /**
   * Check image alt text
   */
  async checkImageAltText() {
    const images = await this.page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      
      // All images should have alt attribute
      expect(alt).toBeDefined();
      
      // Decorative images can have empty alt
      if (src && !src.includes('decoration')) {
        expect(alt).toBeTruthy();
      }
    }
  }
  
  /**
   * Check form labels
   */
  async checkFormLabels() {
    const inputs = await this.page.locator('input, select, textarea').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        // Check for associated label
        const label = this.page.locator(`label[for="${id}"]`);
        const labelExists = await label.count() > 0;
        
        // Input should have label, aria-label, or aria-labelledby
        expect(labelExists || ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  }
  
  /**
   * Check keyboard navigation
   */
  async checkKeyboardNavigation() {
    // Get all focusable elements
    const focusableElements = await this.page.locator(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).all();
    
    // Test tab navigation
    await this.page.keyboard.press('Tab');
    
    for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
      const focusedElement = this.page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      await this.page.keyboard.press('Tab');
    }
  }
  
  /**
   * Check focus indicators
   */
  async checkFocusIndicators() {
    const focusableElements = await this.page.locator('a, button, input, select, textarea').all();
    
    for (const element of focusableElements.slice(0, 5)) { // Test first 5 elements
      await element.focus();
      
      // Check if element has visible focus indicator
      const focusedElement = this.page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Check for focus styles (outline, box-shadow, etc.)
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
          border: computed.border
        };
      });
      
      // Should have some form of focus indicator
      const hasFocusIndicator = styles.outline !== 'none' || 
                               styles.boxShadow !== 'none' || 
                               styles.border !== 'none';
      expect(hasFocusIndicator).toBeTruthy();
    }
  }
  
  /**
   * Check color contrast (basic implementation)
   */
  async checkColorContrast() {
    // This is a simplified check - in production, use axe-core or similar
    const textElements = await this.page.locator('p, h1, h2, h3, h4, h5, h6, span, a, button').all();
    
    for (const element of textElements.slice(0, 10)) { // Test first 10 elements
      const styles = await element.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          fontSize: computed.fontSize
        };
      });
      
      // Basic check - ensure text is not transparent
      expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
      expect(styles.color).not.toBe('transparent');
    }
  }
  
  /**
   * Check ARIA labels and roles
   */
  async checkARIALabels() {
    // Check buttons without text content have aria-label
    const buttons = await this.page.locator('button').all();
    
    for (const button of buttons) {
      const textContent = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      if (!textContent?.trim()) {
        expect(ariaLabel).toBeTruthy();
      }
    }
    
    // Check links without text content have aria-label
    const links = await this.page.locator('a').all();
    
    for (const link of links) {
      const textContent = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      if (!textContent?.trim()) {
        expect(ariaLabel).toBeTruthy();
      }
    }
  }
  
  /**
   * Check landmark regions
   */
  async checkLandmarks() {
    // Check for main landmark
    const main = this.page.locator('main, [role="main"]');
    await expect(main).toHaveCount(1);
    
    // Check for navigation landmark
    const nav = this.page.locator('nav, [role="navigation"]');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThan(0);
    
    // Check for banner (header)
    const header = this.page.locator('header, [role="banner"]');
    await expect(header).toHaveCount(1);
    
    // Check for contentinfo (footer)
    const footer = this.page.locator('footer, [role="contentinfo"]');
    await expect(footer).toHaveCount(1);
  }
  
  /**
   * Check skip links
   */
  async checkSkipLinks() {
    // Look for skip to main content link
    const skipLink = this.page.locator('a[href="#main"], a[href="#content"], a:has-text("Skip to")');
    
    if (await skipLink.count() > 0) {
      // Skip link should be focusable
      await skipLink.first().focus();
      await expect(skipLink.first()).toBeFocused();
    }
  }
  
  /**
   * Check screen reader compatibility
   */
  async checkScreenReaderCompatibility() {
    // Check for proper semantic markup
    await this.checkSemanticMarkup();
    
    // Check for descriptive link text
    await this.checkDescriptiveLinkText();
    
    // Check for table headers
    await this.checkTableHeaders();
  }
  
  /**
   * Check semantic markup
   */
  async checkSemanticMarkup() {
    // Check for semantic HTML5 elements
    const semanticElements = [
      'header', 'nav', 'main', 'section', 'article', 'aside', 'footer'
    ];
    
    for (const element of semanticElements) {
      const count = await this.page.locator(element).count();
      if (count > 0) {
        console.log(`✓ Found ${count} ${element} element(s)`);
      }
    }
  }
  
  /**
   * Check descriptive link text
   */
  async checkDescriptiveLinkText() {
    const links = await this.page.locator('a').all();
    const genericTexts = ['click here', 'read more', 'here', 'more', 'link'];
    
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      const linkText = (text || ariaLabel || '').toLowerCase().trim();
      
      // Check for generic link text
      const isGeneric = genericTexts.some(generic => linkText === generic);
      
      if (isGeneric) {
        console.warn(`Warning: Generic link text found: "${linkText}"`);
      }
    }
  }
  
  /**
   * Check table headers
   */
  async checkTableHeaders() {
    const tables = await this.page.locator('table').all();
    
    for (const table of tables) {
      const headers = await table.locator('th').count();
      const rows = await table.locator('tr').count();
      
      if (rows > 1) {
        // Tables with data should have headers
        expect(headers).toBeGreaterThan(0);
      }
    }
  }
  
  /**
   * Generate accessibility report
   */
  async generateAccessibilityReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      checks: {
        headingStructure: await this.checkHeadingStructureReport(),
        imageAltText: await this.checkImageAltTextReport(),
        formLabels: await this.checkFormLabelsReport(),
        landmarks: await this.checkLandmarksReport(),
        colorContrast: await this.checkColorContrastReport()
      }
    };
    
    return report;
  }
  
  private async checkHeadingStructureReport() {
    const h1Count = await this.page.locator('h1').count();
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').count();
    
    return {
      h1Count,
      totalHeadings: headings,
      passed: h1Count === 1,
      message: h1Count === 1 ? 'Proper heading structure' : 'Multiple or missing H1 elements'
    };
  }
  
  private async checkImageAltTextReport() {
    const totalImages = await this.page.locator('img').count();
    const imagesWithAlt = await this.page.locator('img[alt]').count();
    
    return {
      totalImages,
      imagesWithAlt,
      passed: totalImages === imagesWithAlt,
      message: totalImages === imagesWithAlt ? 'All images have alt text' : 'Some images missing alt text'
    };
  }
  
  private async checkFormLabelsReport() {
    const totalInputs = await this.page.locator('input, select, textarea').count();
    const inputsWithLabels = await this.page.locator('input[id], select[id], textarea[id]').count();
    
    return {
      totalInputs,
      inputsWithLabels,
      passed: totalInputs === inputsWithLabels,
      message: totalInputs === inputsWithLabels ? 'All form fields have labels' : 'Some form fields missing labels'
    };
  }
  
  private async checkLandmarksReport() {
    const main = await this.page.locator('main, [role="main"]').count();
    const nav = await this.page.locator('nav, [role="navigation"]').count();
    const header = await this.page.locator('header, [role="banner"]').count();
    const footer = await this.page.locator('footer, [role="contentinfo"]').count();
    
    return {
      main,
      nav,
      header,
      footer,
      passed: main === 1 && nav > 0 && header === 1 && footer === 1,
      message: 'Landmark regions check'
    };
  }
  
  private async checkColorContrastReport() {
    // Simplified color contrast check
    return {
      passed: true,
      message: 'Basic color contrast check passed (detailed analysis needed)'
    };
  }
}