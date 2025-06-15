import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { SkillsPage } from '../pages/SkillsPage';
import { GitHubPage } from '../pages/GitHubPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ContactPage } from '../pages/ContactPage';
import { TestDataManager } from '../utils/TestDataManager';
import { PerformanceHelper } from '../utils/PerformanceHelper';
import { AccessibilityHelper } from '../utils/AccessibilityHelper';

/**
 * Extended test fixtures for enterprise testing
 * Provides page objects, utilities, and test data management
 */
type TestFixtures = {
  homePage: HomePage;
  aboutPage: AboutPage;
  skillsPage: SkillsPage;
  gitHubPage: GitHubPage;
  dashboardPage: DashboardPage;
  contactPage: ContactPage;
  testData: TestDataManager;
  performance: PerformanceHelper;
  accessibility: AccessibilityHelper;
};

export const test = base.extend<TestFixtures>({
  // Page Object fixtures
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  
  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },
  
  skillsPage: async ({ page }, use) => {
    await use(new SkillsPage(page));
  },
  
  gitHubPage: async ({ page }, use) => {
    await use(new GitHubPage(page));
  },
  
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  
  // Utility fixtures
  testData: async ({}, use) => {
    await use(new TestDataManager());
  },
  
  performance: async ({ page }, use) => {
    await use(new PerformanceHelper(page));
  },
  
  accessibility: async ({ page }, use) => {
    await use(new AccessibilityHelper(page));
  },
});

export { expect };