import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object
 * Represents the main landing page of the portfolio
 */
export class HomePage extends BasePage {
  // Page elements
  private heroSection: Locator;
  private heroTitle: Locator;
  private heroSubtitle: Locator;
  private ctaButtons: Locator;
  private skillsBadges: Locator;
  private socialLinks: Locator;
  private scrollIndicator: Locator;
  private navigationMenu: Locator;
  private themeToggle: Locator;
  
  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.heroSection = page.locator('#hero');
    this.heroTitle = page.locator('h1').first();
    this.heroSubtitle = page.locator('p').first();
    this.ctaButtons = page.locator('.btn-primary, .btn-outline');
    this.skillsBadges = page.locator('[class*="badge"]');
    this.socialLinks = page.locator('a[aria-label*="GitHub"], a[aria-label*="LinkedIn"]');
    this.scrollIndicator = page.locator('[class*="animate-bounce"]');
    this.navigationMenu = page.locator('nav ul');
    this.themeToggle = page.locator('button[aria-label*="Toggle"]');
  }
  
  /**
   * Get the page instance for direct access when needed
   */
  getPage(): Page {
    return this.page;
  }
  
  /**
   * Navigate to home page
   */
  async navigateToHome() {
    await this.goto('/');
    await this.waitForPageLoad();
  }
  
  /**
   * Verify hero section is displayed correctly
   */
  async verifyHeroSection() {
    await expect(this.heroSection).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroTitle).toContainText('Selenium');
    await expect(this.heroTitle).toContainText('Java');
    await expect(this.heroTitle).toContainText('Cucumber');
  }
  
  /**
   * Verify professional subtitle
   */
  async verifySubtitle() {
    await expect(this.heroSubtitle).toBeVisible();
    await expect(this.heroSubtitle).toContainText('Selenium WebDriver');
    await expect(this.heroSubtitle).toContainText('UiPath RPA');
  }
  
  /**
   * Verify CTA buttons are present and functional
   */
  async verifyCTAButtons() {
    await expect(this.ctaButtons).toHaveCount(2);
    
    const getInTouchBtn = this.page.locator('text="Get in Touch"');
    const viewGitHubBtn = this.page.locator('text="View GitHub"');
    
    await expect(getInTouchBtn).toBeVisible();
    await expect(viewGitHubBtn).toBeVisible();
    
    // Verify buttons are clickable
    await expect(getInTouchBtn).toBeEnabled();
    await expect(viewGitHubBtn).toBeEnabled();
  }
  
  /**
   * Click Get in Touch button
   */
  async clickGetInTouch() {
    const getInTouchBtn = this.page.locator('text="Get in Touch"');
    await this.clickElement(getInTouchBtn);
  }
  
  /**
   * Click View GitHub button
   */
  async clickViewGitHub() {
    const viewGitHubBtn = this.page.locator('text="View GitHub"');
    await this.clickElement(viewGitHubBtn);
  }
  
  /**
   * Verify skills badges
   */
  async verifySkillsBadges() {
    const expectedSkills = ['Selenium + Java', 'Cucumber BDD', 'Postman', 'UiPath RPA'];
    
    for (const skill of expectedSkills) {
      await expect(this.page.locator(`text="${skill}"`)).toBeVisible();
    }
  }
  
  /**
   * Verify social links
   */
  async verifySocialLinks() {
    const githubLink = this.page.locator('a[aria-label="GitHub"]');
    const linkedinLink = this.page.locator('a[aria-label="LinkedIn"]');
    
    await expect(githubLink).toBeVisible();
    await expect(linkedinLink).toBeVisible();
    
    // Verify links have correct attributes
    await expect(githubLink).toHaveAttribute('href', /github/);
    await expect(linkedinLink).toHaveAttribute('href', /linkedin/);
  }
  
  /**
   * Verify navigation menu
   */
  async verifyNavigation() {
    await expect(this.navigationMenu).toBeVisible();
    
    const expectedNavItems = ['Home', 'About', 'Skills', 'GitHub', 'Dashboard', 'Contact'];
    
    for (const item of expectedNavItems) {
      await expect(this.page.locator(`nav a:has-text("${item}")`)).toBeVisible();
    }
  }
  
  /**
   * Navigate to section via menu
   */
  async navigateToSection(sectionName: string) {
    const navLink = this.page.locator(`nav a:has-text("${sectionName}")`);
    await this.clickElement(navLink);
    await this.page.waitForTimeout(1000); // Wait for smooth scroll
  }
  
  /**
   * Toggle dark/light theme
   */
  async toggleTheme() {
    await this.clickElement(this.themeToggle);
    await this.page.waitForTimeout(500); // Wait for theme transition
  }
  
  /**
   * Verify theme toggle functionality
   */
  async verifyThemeToggle() {
    // Check initial theme
    const initialTheme = await this.page.locator('html').getAttribute('class');
    
    // Toggle theme
    await this.toggleTheme();
    
    // Verify theme changed
    const newTheme = await this.page.locator('html').getAttribute('class');
    expect(newTheme).not.toBe(initialTheme);
  }
  
  /**
   * Verify scroll indicator
   */
  async verifyScrollIndicator() {
    await expect(this.scrollIndicator).toBeVisible();
    await expect(this.scrollIndicator).toHaveClass(/animate-bounce/);
  }
  
  /**
   * Verify page title and meta information
   */
  async verifyPageMeta() {
    await expect(this.page).toHaveTitle(/Marvin Marzon/);
    
    // Check meta description
    const metaDescription = this.page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /QA.*SDET/);
  }
  
  /**
   * Verify responsive design on mobile
   */
  async verifyMobileLayout() {
    await this.page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile menu toggle is visible
    const mobileMenuToggle = this.page.locator('button[aria-label="Toggle menu"]');
    await expect(mobileMenuToggle).toBeVisible();
    
    // Verify hero content is still visible
    await expect(this.heroTitle).toBeVisible();
    await expect(this.ctaButtons.first()).toBeVisible();
  }
  
  /**
   * Test mobile navigation
   */
  async testMobileNavigation() {
    await this.page.setViewportSize({ width: 375, height: 667 });
    
    const mobileMenuToggle = this.page.locator('button[aria-label="Toggle menu"]');
    await this.clickElement(mobileMenuToggle);
    
    // Verify mobile menu is open
    await expect(this.navigationMenu).toBeVisible();
    
    // Click a navigation item
    await this.navigateToSection('About');
    
    // Verify menu closes after navigation
    await expect(this.navigationMenu).toBeHidden();
  }
}