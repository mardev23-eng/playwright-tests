import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Enterprise Playwright Configuration
 * Comprehensive setup for cross-browser, cross-platform testing
 */
export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Global test timeout
  timeout: 30 * 1000,
  
  // Expect timeout for assertions
  expect: {
    timeout: 10 * 1000,
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['list'],
    ['github'], // GitHub Actions integration
  ],
  
  // Global setup and teardown
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),
  
  // Shared settings for all tests
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'https://marvinmarzon.netlify.app',
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Artifacts on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
    // Navigation timeout
    navigationTimeout: 30 * 1000,
    actionTimeout: 10 * 1000,
    
    // User agent
    userAgent: 'Playwright-Enterprise-Tests/1.0.0 (QA-SDET-Portfolio)',
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    // Permissions
    permissions: ['geolocation', 'notifications'],
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'X-Test-Framework': 'Playwright',
      'X-Test-Suite': 'Enterprise',
    },
  },

  // Test projects for different browsers and devices
  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Tablet
    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
    },
    
    // High DPI
    {
      name: 'high-dpi',
      use: { 
        ...devices['Desktop Chrome HiDPI'],
        deviceScaleFactor: 2,
      },
    },
    
    // API Testing
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://marvinmarzon.netlify.app/api',
      },
    },
    
    // Performance Testing
    {
      name: 'performance',
      testMatch: '**/performance/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--enable-precise-memory-info'],
        },
      },
    },
    
    // Accessibility Testing
    {
      name: 'accessibility',
      testMatch: '**/accessibility/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Output directory for test artifacts
  outputDir: 'test-results/',
  
  // Web server configuration for local development
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});