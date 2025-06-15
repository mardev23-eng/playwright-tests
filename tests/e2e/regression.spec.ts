import { test, expect } from '../fixtures/base-fixtures';

/**
 * Regression Tests - Comprehensive Feature Validation
 * Detailed testing of all major functionality
 */
test.describe('Regression Tests - Full Feature Coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Homepage Functionality', () => {
    test('Hero section displays all elements correctly @regression @hero', async ({ homePage }) => {
      await homePage.verifyHeroSection();
      await homePage.verifySubtitle();
      await homePage.verifySkillsBadges();
      await homePage.verifyScrollIndicator();
    });

    test('CTA buttons navigate correctly @regression @navigation', async ({ homePage }) => {
      // Test "Get in Touch" button
      await homePage.clickGetInTouch();
      expect(homePage.getCurrentUrl()).toContain('#contact');
      
      // Navigate back to home
      await homePage.navigateToSection('Home');
      
      // Test "View GitHub" button
      await homePage.clickViewGitHub();
      expect(homePage.getCurrentUrl()).toContain('#github');
    });

    test('Social links have correct attributes @regression @links', async ({ homePage }) => {
      await homePage.verifySocialLinks();
      
      // Verify external link attributes
      const githubLink = homePage.page.locator('a[aria-label="GitHub"]');
      await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  test.describe('About Section', () => {
    test('About section displays professional information @regression @about', async ({ aboutPage }) => {
      await aboutPage.navigateToAbout();
      await aboutPage.verifyAboutSection();
      await aboutPage.verifyProfessionalStats();
      await aboutPage.verifyTechStack();
    });

    test('Professional achievements are displayed @regression @achievements', async ({ aboutPage }) => {
      await aboutPage.navigateToAbout();
      await aboutPage.verifyAchievements();
    });
  });

  test.describe('Skills Section', () => {
    test('Skills are categorized and filterable @regression @skills', async ({ skillsPage }) => {
      await skillsPage.navigateToSkills();
      await skillsPage.verifySkillsSection();
      await skillsPage.testSkillFiltering();
    });

    test('Skill levels are displayed correctly @regression @skills', async ({ skillsPage }) => {
      await skillsPage.navigateToSkills();
      await skillsPage.verifySkillLevels();
    });
  });

  test.describe('GitHub Section', () => {
    test('GitHub repositories are displayed @regression @github', async ({ gitHubPage }) => {
      await gitHubPage.navigateToGitHub();
      await gitHubPage.verifyGitHubSection();
      await gitHubPage.verifyRepositories();
    });

    test('Repository filtering works correctly @regression @github', async ({ gitHubPage }) => {
      await gitHubPage.navigateToGitHub();
      await gitHubPage.testRepositoryFiltering();
    });
  });

  test.describe('Dashboard Section', () => {
    test('Testing dashboard displays metrics @regression @dashboard', async ({ dashboardPage }) => {
      await dashboardPage.navigateToDashboard();
      await dashboardPage.verifyDashboardSection();
      await dashboardPage.verifyMetrics();
    });

    test('Charts and analytics are interactive @regression @dashboard', async ({ dashboardPage }) => {
      await dashboardPage.navigateToDashboard();
      await dashboardPage.testChartInteractivity();
    });
  });

  test.describe('Contact Section', () => {
    test('Contact form validation works correctly @regression @contact', async ({ contactPage, testData }) => {
      await contactPage.navigateToContact();
      
      // Test form validation
      await contactPage.verifyValidationErrors();
      await contactPage.testFieldValidation();
      await contactPage.testSubjectOptions();
    });

    test('Contact form submission works @regression @contact', async ({ contactPage, testData }) => {
      await contactPage.navigateToContact();
      
      // Fill and submit form with test data
      const formData = testData.generateContactFormData();
      await contactPage.fillContactForm(formData);
      await contactPage.testSubmissionLoadingState();
    });

    test('Contact information is displayed correctly @regression @contact', async ({ contactPage }) => {
      await contactPage.navigateToContact();
      await contactPage.verifyContactInfo();
      await contactPage.testEmailInfoPanel();
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test('Layout consistency across browsers @regression @cross-browser', async ({ page }) => {
      // This test will run across all configured browsers
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });
  });

  test.describe('Performance Validation', () => {
    test('Page load times are within acceptable limits @regression @performance', async ({ page, performance }) => {
      const metrics = await performance.measurePageLoad();
      
      // Assert performance benchmarks
      expect(metrics.loadTime).toBeLessThan(3000);
      expect(metrics.domContentLoaded).toBeLessThan(2000);
      expect(metrics.firstContentfulPaint).toBeLessThan(2500);
    });

    test('Images are optimized and load efficiently @regression @performance', async ({ page }) => {
      // Check image loading
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
        
        // Check if image has loaded
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Accessibility Compliance', () => {
    test('WCAG compliance validation @regression @accessibility', async ({ page, accessibility }) => {
      await accessibility.checkWCAGCompliance();
    });

    test('Keyboard navigation works correctly @regression @accessibility', async ({ page }) => {
      // Test tab navigation
      await page.keyboard.press('Tab');
      
      // Verify focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Test navigation through key elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }
    });

    test('Screen reader compatibility @regression @accessibility', async ({ page }) => {
      // Check ARIA labels and roles
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        
        // Button should have either aria-label or text content
        expect(ariaLabel || textContent).toBeTruthy();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('Mobile layout adapts correctly @regression @responsive', async ({ page }) => {
      const viewports = [
        { width: 320, height: 568, name: 'iPhone SE' },
        { width: 375, height: 667, name: 'iPhone 8' },
        { width: 414, height: 896, name: 'iPhone 11' },
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);
        
        // Verify key elements are still visible
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('.btn-primary')).toBeVisible();
      }
    });

    test('Tablet layout works correctly @regression @responsive', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Verify tablet-specific layout
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    });
  });
});