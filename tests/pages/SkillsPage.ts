import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Skills Page Object
 * Represents the skills section functionality
 */
export class SkillsPage extends BasePage {
  private skillsSection: Locator;
  
  constructor(page: Page) {
    super(page);
    
    this.skillsSection = page.locator('#skills');
  }
  
  /**
   * Navigate to skills section
   */
  async navigateToSkills() {
    await this.goto('/#skills');
    await this.waitForPageLoad();
  }
  
  /**
   * Verify skills section is visible
   */
  async verifySkillsSection() {
    await expect(this.skillsSection).toBeVisible();
    await expect(this.page.locator('h2:has-text("Skills")')).toBeVisible();
  }
  
  /**
   * Test skill filtering functionality
   */
  async testSkillFiltering() {
    // This would need to be implemented based on actual skills section content
    await expect(this.skillsSection).toBeVisible();
  }
  
  /**
   * Verify skill levels are displayed
   */
  async verifySkillLevels() {
    // This would need to be implemented based on actual skills section content
    await expect(this.skillsSection).toBeVisible();
  }
}