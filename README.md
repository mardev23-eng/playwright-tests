# 🎭 Playwright Testing Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Playwright testing framework for QA & SDET portfolio validation**

Playwright testing suite demonstrating advanced end-to-end testing capabilities, cross-browser compatibility, quality assurance for [Marvin Marzon's QA & SDET Portfolio](https://marvinmarzon.netlify.app).

## 🎯 Overview

This repository showcases **test automation expertise** through a comprehensive Playwright testing framework that validates:

- ✅ **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile and responsive testing** (iOS, Android, tablets)
- ✅ **Accessibility compliance** (WCAG 2.1 AA standards)
- ✅ **Performance validation** (Core Web Vitals, load times)
- ✅ **API testing integration** (REST endpoints, error handling)
- ✅ **Visual regression testing** (screenshot comparisons)

## 🚀 Quick Start

### Prerequisites
```bash
# Install Node.js 18+ and npm
node --version  # Should be 18+
npm --version

# Clone and setup
git clone <repository-url>
cd playwright-tests
npm install
```

### Installation
```bash
# Install dependencies and browsers
npm run setup

# Or install manually
npm install
npx playwright install
npx playwright install-deps
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:smoke      # Critical path validation
npm run test:regression # Full feature coverage
npm run test:api        # API endpoint testing

# Cross-browser testing
npm run test:chrome     # Chrome only
npm run test:firefox    # Firefox only
npm run test:safari     # Safari only

# Device testing
npm run test:mobile     # Mobile devices
npm run test:parallel   # Parallel execution

# Interactive mode
npm run test:ui         # Playwright UI mode
npm run test:headed     # Headed browser mode
npm run test:debug      # Debug mode
```

### Viewing Reports
```bash
# View HTML report
npm run report

# Generate Allure report
npm run report:allure

# View test traces
npm run trace
```

## 📊 Test Architecture

### Test Structure
```
playwright-tests/
├── 📋 tests/
│   ├── e2e/                    # End-to-end test scenarios
│   │   ├── smoke/              # Critical path validation
│   │   ├── regression/         # Comprehensive feature testing
│   │   └── api/                # API endpoint testing
│   ├── fixtures/               # Test fixtures and utilities
│   ├── pages/                  # Page Object Model
│   ├── utils/                  # Helper utilities
│   └── global-setup.ts         # Global test configuration
├── 📊 test-results/            # Test execution results
├── 📈 playwright-report/       # HTML test reports
├── 🎬 videos/                  # Test execution videos
├── 📸 screenshots/             # Failure screenshots
└── 📚 docs/                    # Documentation
```

### Page Object Model
```typescript
// Example: HomePage class
export class HomePage extends BasePage {
  async navigateToHome() {
    await this.goto('/');
    await this.waitForPageLoad();
  }
  
  async verifyHeroSection() {
    await expect(this.heroSection).toBeVisible();
    await expect(this.heroTitle).toContainText('Selenium');
  }
}
```

### Test Fixtures
```typescript
// Extended test with custom fixtures
export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  performance: async ({ page }, use) => {
    await use(new PerformanceHelper(page));
  }
});
```

## 🎯 Test Scenarios

### Smoke Tests (Critical Path)
- **Homepage Loading**: Core functionality validation
- **Navigation**: Menu and routing verification
- **Contact Form**: Essential user interaction
- **Theme Toggle**: UI state management
- **Mobile Responsiveness**: Layout adaptation
- **Performance**: Basic load time validation
- **Accessibility**: WCAG compliance check

### Regression Tests (Full Coverage)
- **Hero Section**: Complete content validation
- **About Section**: Professional information display
- **Skills Section**: Filtering and categorization
- **GitHub Section**: Repository display and filtering
- **Dashboard Section**: Metrics and analytics
- **Contact Section**: Form validation and submission
- **Cross-browser**: Compatibility across browsers
- **Performance**: Comprehensive metrics validation
- **Accessibility**: Full WCAG 2.1 AA compliance

### API Tests
- **Contact Form Submission**: Backend integration
- **Error Handling**: Graceful failure management
- **Validation**: Server-side input validation
- **Rate Limiting**: API protection mechanisms
- **CORS**: Cross-origin request handling

## 🔧 Features

### Cross-Browser Testing
```typescript
// Configured browsers and devices
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
]
```

### Performance Testing
```typescript
// Core Web Vitals measurement
const metrics = await performance.measureCoreWebVitals();
expect(metrics.lcp).toBeLessThan(2500); // Largest Contentful Paint
expect(metrics.fid).toBeLessThan(100);  // First Input Delay
expect(metrics.cls).toBeLessThan(0.1);  // Cumulative Layout Shift
```

### Accessibility Testing
```typescript
// WCAG 2.1 AA compliance validation
await accessibility.checkWCAGCompliance();
await accessibility.checkColorContrast();
await accessibility.checkKeyboardNavigation();
```

### Visual Regression Testing
```typescript
// Screenshot comparison
await page.screenshot({ path: 'homepage.png', fullPage: true });
await expect(page).toHaveScreenshot('homepage.png');
```

## 📈 Reporting & Analytics

### HTML Dashboard Report
- **Test Results Overview**: Pass/fail statistics
- **Browser Compatibility**: Cross-browser results
- **Performance Metrics**: Load times and Core Web Vitals
- **Accessibility Compliance**: WCAG validation results
- **Error Analysis**: Detailed failure information
- **Screenshots & Videos**: Visual test evidence

### Allure Integration
```bash
# Generate comprehensive Allure report
npm run report:allure
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Run Playwright Tests
  run: npm run test:ci
  
- name: Upload Test Results
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

## 🎯 Performance Benchmarks

### Response Time Targets
- **Page Load**: < 3 seconds (95th percentile)
- **First Contentful Paint**: < 2 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1

### Accessibility Standards
- **WCAG 2.1 AA Compliance**: 100% conformance
- **Color Contrast**: Minimum 4.5:1 ratio
- **Keyboard Navigation**: Full functionality
- **Screen Reader**: Complete compatibility
- **Focus Management**: Visible indicators

### Browser Support
- **Chrome**: Latest 3 versions
- **Firefox**: Latest 3 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile**: iOS Safari, Chrome Mobile

## 🛠️ Advanced Configuration

### Environment Configuration
```typescript
// Multi-environment support
const environments = {
  development: { baseURL: 'https://marvinmarzon.netlify.app' },
  staging: { baseURL: 'https://marvinmarzon.netlify.app' },
  production: { baseURL: 'https://marvinmarzon.netlify.app' }
};
```

### Parallel Execution
```typescript
// Optimized for CI/CD
workers: process.env.CI ? 1 : undefined,
retries: process.env.CI ? 2 : 0,
```

### Custom Assertions
```typescript
// Domain-specific assertions
await expect(contactForm).toBeAccessible();
await expect(page).toHaveGoodPerformance();
await expect(element).toBeResponsive();
```

## 🚀 Value

### For QA Engineers
- **Best Practices**: Industry-standard Playwright patterns
- **Scalable Architecture**: Page Object Model implementation
- **Comprehensive Coverage**: Multiple testing dimensions
- **Professional Patterns**: Production-ready test framework

### For Development Teams
- **Quality Gates**: Automated quality validation
- **Regression Prevention**: Comprehensive test coverage
- **Performance Monitoring**: Continuous performance validation
- **Accessibility Compliance**: WCAG 2.1 AA standards

### For Business Stakeholders
- **Risk Mitigation**: Automated quality assurance
- **User Experience**: Optimal application performance
- **Compliance**: Accessibility and standards adherence
- **Cost Efficiency**: Automated testing reduces manual effort

## 📚 Documentation

- **[Test Scenarios](docs/test-scenarios.md)** - Detailed test case documentation
- **[Performance Guide](docs/performance-guide.md)** - Performance testing methodology
- **[Accessibility Guide](docs/accessibility-guide.md)** - WCAG compliance testing
- **[API Testing](docs/api-testing.md)** - Backend integration testing
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions

## 🤝 Contact

**Marvin Marzon** - QA & SDET
- 📧 **Email**: marvinmarzon@outlook.com
- 💼 **LinkedIn**: [Marvin Marzon](https://www.linkedin.com/in/marvin-marzon-615400170/)
- 🌐 **Portfolio**: [https://marvinmarzon.netlify.app](https://marvinmarzon.netlify.app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**🎭 Professional Test Automation Excellence with Playwright**

*Demonstrating professional QA engineering capabilities through comprehensive end-to-end testing*

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=for-the-badge)](https://marvinmarzon.netlify.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/marvin-marzon-615400170/)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:marvinmarzon@outlook.com)

</div>