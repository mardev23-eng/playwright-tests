import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global setup for Playwright tests
 * Runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright Enterprise Test Suite Global Setup');
  
  // Create necessary directories
  const dirs = ['test-results', 'screenshots', 'videos', 'traces', 'allure-results'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Environment validation
  const requiredEnvVars = ['BASE_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
  }
  
  // Browser warmup - launch and close to ensure browsers are ready
  console.log('🌐 Warming up browsers...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Basic connectivity check
    await page.goto(process.env.BASE_URL || 'https://marvinmarzon.netlify.app', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    console.log('✅ Application is accessible');
  } catch (error) {
    console.error('❌ Application accessibility check failed:', error);
  } finally {
    await browser.close();
  }
  
  // Generate test execution metadata
  const metadata = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'test',
    baseUrl: process.env.BASE_URL || 'https://marvinmarzon.netlify.app',
    playwright_version: require('@playwright/test/package.json').version,
    node_version: process.version,
    platform: process.platform,
    arch: process.arch,
  };
  
  fs.writeFileSync(
    path.join('test-results', 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup;