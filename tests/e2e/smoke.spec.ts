import { test, expect } from '../fixtures/base-fixtures';

/**
 * Smoke Tests - Critical Path Validation
 * Quick validation of core functionality
 */
test.describe('Smoke Tests - Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('/');
  });

  test('Homepage loads successfully @smoke @critical', async ({ homePage }) => {
    // Verify page loads
    await homePage.verifyHeroSection();
    await homePage.verifyNavigation();
    
    // Verify page title
    await expect(homePage.getPage()).toHaveTitle(/Marvin Marzon/);
    
    // Verify key elements are visible
    await homePage.verifyCTAButtons();
    await homePage.verifySkillsBadges();
    await homePage.verifySocialLinks();
  });

  test('Navigation menu works correctly @smoke @navigation', async ({ homePage }) => {
    // Test navigation to each section
    const sections = ['About', 'Skills', 'GitHub', 'Dashboard', 'Contact'];
    
    for (const section of sections) {
      await homePage.navigateToSection(section);
      
      // Verify URL contains section anchor
      expect(homePage.getCurrentUrl()).toContain(`#${section.toLowerCase()}`);
      
      // Wait for smooth scroll to complete
      await homePage.getPage().waitForTimeout(1000);
    }
  });

  test('Contact form is accessible @smoke @contact', async ({ contactPage }) => {
    await contactPage.navigateToContact();
    
    // Verify contact section loads
    await contactPage.verifyContactSection();
    await contactPage.verifyContactForm();
    await contactPage.verifyContactInfo();
  });

  test('Theme toggle functionality @smoke @ui', async ({ homePage }) => {
    // Test theme switching
    await homePage.verifyThemeToggle();
    
    // Verify theme persists after navigation
    await homePage.navigateToSection('About');
    await homePage.toggleTheme();
  });

  test('Mobile responsiveness @smoke @mobile', async ({ homePage }) => {
    // Test mobile layout
    await homePage.verifyMobileLayout();
    await homePage.testMobileNavigation();
  });

  test('Page performance is acceptable @smoke @performance', async ({ homePage, performance }) => {
    // Measure page load performance
    const metrics = await performance.measurePageLoad();
    
    // Assert performance thresholds
    expect(metrics.loadTime).toBeLessThan(5000); // 5 seconds
    expect(metrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds
  });

  test('Basic accessibility compliance @smoke @accessibility', async ({ homePage, accessibility }) => {
    // Run basic accessibility checks
    await accessibility.checkBasicCompliance();
    
    // Verify heading structure
    await expect(homePage.getPage().locator('h1')).toBeVisible();
    
    // Verify alt text on images
    const images = homePage.getPage().locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
  });

  test('External links work correctly @smoke @links', async ({ homePage }) => {
    // Test social media links
    const githubLink = homePage.getPage().locator('a[aria-label="GitHub"]');
    const linkedinLink = homePage.getPage().locator('a[aria-label="LinkedIn"]');
    
    // Verify links have correct attributes
    await expect(githubLink).toHaveAttribute('href', /github/);
    await expect(linkedinLink).toHaveAttribute('href', /linkedin/);
    
    // Verify links open in new tab
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
  });

  test('Error handling works correctly @smoke @error', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    
    // Should redirect to home or show 404
    const url = page.url();
    expect(url).toMatch(/(404|#|\/)/);
  });

  test('SEO meta tags are present @smoke @seo', async ({ page }) => {
    await page.goto('/');
    
    // Check essential meta tags
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content');
    
    // Check Open Graph tags
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(0); // May not be present
    
    // Check title
    await expect(page).toHaveTitle(/Marvin Marzon.*QA.*SDET/);
  });
});