import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * About Page Object
 * Represents the about section functionality
 */
export class AboutPage extends BasePage {
  private aboutSection: Locator;
  
  constructor(page: Page) {
    super(page);
    
    this.aboutSection = page.locator('#about');
  }
  
  /**
   * Navigate to about section
   */
  async navigateToAbout() {
    await this.goto('/#about');
    await this.waitForPageLoad();
  }
  
  /**
   * Verify about section is visible
   */
  async verifyAboutSection() {
    await expect(this.aboutSection).toBeVisible();
    await expect(this.page.locator('h2:has-text("About")')).toBeVisible();
  }
  
  /**
   * Verify professional statistics
   */
  async verifyProfessionalStats() {
    // This would need to be implemented based on actual about section content
    await expect(this.aboutSection).toBeVisible();
  }
  
  /**
   * Verify technology stack display
   */
  async verifyTechStack() {
    // This would need to be implemented based on actual about section content
    await expect(this.aboutSection).toBeVisible();
  }
  
  /**
   * Verify achievements section
   */
  async verifyAchievements() {
    // This would need to be implemented based on actual about section content
    await expect(this.aboutSection).toBeVisible();
  }
}