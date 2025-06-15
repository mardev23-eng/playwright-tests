import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global teardown for Playwright tests
 * Runs once after all tests complete
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting Playwright Enterprise Test Suite Global Teardown');
  
  try {
    // Generate test execution summary
    const resultsPath = path.join('test-results', 'results.json');
    
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      
      const summary = {
        totalTests: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
        timestamp: new Date().toISOString(),
      };
      
      fs.writeFileSync(
        path.join('test-results', 'summary.json'),
        JSON.stringify(summary, null, 2)
      );
      
      console.log('📊 Test Execution Summary:');
      console.log(`   Total Tests: ${summary.totalTests}`);
      console.log(`   Passed: ${summary.passed}`);
      console.log(`   Failed: ${summary.failed}`);
      console.log(`   Skipped: ${summary.skipped}`);
      console.log(`   Duration: ${(summary.duration / 1000).toFixed(2)}s`);
    }
    
    // Cleanup temporary files if needed
    const tempFiles = ['temp-*.json', '*.tmp'];
    tempFiles.forEach(pattern => {
      // Add cleanup logic if needed
    });
    
    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
  }
}

export default globalTeardown;