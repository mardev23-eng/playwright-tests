import { faker } from '@faker-js/faker';

/**
 * Test Data Manager
 * Generates and manages test data for various test scenarios
 */
export class TestDataManager {
  
  /**
   * Generate contact form data
   */
  generateContactFormData() {
    return {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      subject: faker.helpers.arrayElement([
        'Job Opportunity',
        'Project Inquiry',
        'Consultation',
        'Collaboration',
        'Other'
      ]),
      message: faker.lorem.paragraphs(2, '\n\n')
    };
  }
  
  /**
   * Generate valid contact form data
   */
  generateValidContactData() {
    return {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Job Opportunity',
      message: 'I am interested in discussing QA opportunities at your company. I have 5+ years of experience in test automation and would love to learn more about your current openings.'
    };
  }
  
  /**
   * Generate invalid contact form data for validation testing
   */
  generateInvalidContactData() {
    return [
      {
        name: '',
        email: 'invalid-email',
        subject: '',
        message: '',
        expectedErrors: ['name', 'email', 'subject', 'message']
      },
      {
        name: 'A',
        email: 'test@',
        subject: 'Test',
        message: 'Short',
        expectedErrors: ['email']
      },
      {
        name: faker.lorem.words(50), // Very long name
        email: 'valid@example.com',
        subject: 'Job Opportunity',
        message: faker.lorem.words(1000), // Very long message
        expectedErrors: []
      }
    ];
  }
  
  /**
   * Generate user personas for testing
   */
  generateUserPersonas() {
    return [
      {
        name: 'Technical Recruiter',
        goals: ['Find qualified QA candidates', 'Review technical skills', 'Contact for opportunities'],
        behaviors: ['Scans skills quickly', 'Looks for specific technologies', 'Uses contact form']
      },
      {
        name: 'Hiring Manager',
        goals: ['Assess technical competency', 'Review project experience', 'Evaluate cultural fit'],
        behaviors: ['Reviews projects in detail', 'Checks GitHub repositories', 'Looks at dashboard metrics']
      },
      {
        name: 'Fellow QA Engineer',
        goals: ['Learn new techniques', 'See testing approaches', 'Network with peers'],
        behaviors: ['Explores GitHub repos', 'Studies testing frameworks', 'Checks performance metrics']
      },
      {
        name: 'Project Manager',
        goals: ['Find QA consultant', 'Understand capabilities', 'Assess project fit'],
        behaviors: ['Reviews about section', 'Looks at project outcomes', 'Uses contact form']
      }
    ];
  }
  
  /**
   * Generate test scenarios for different user journeys
   */
  generateUserJourneys() {
    return [
      {
        name: 'Quick Skills Assessment',
        steps: [
          'Land on homepage',
          'Navigate to skills section',
          'Filter by automation skills',
          'Review skill levels',
          'Navigate to GitHub for examples'
        ],
        expectedOutcome: 'User understands technical capabilities'
      },
      {
        name: 'Detailed Technical Review',
        steps: [
          'Land on homepage',
          'Read about section thoroughly',
          'Review all skills categories',
          'Explore GitHub repositories',
          'Check dashboard metrics',
          'Download resume'
        ],
        expectedOutcome: 'User has comprehensive understanding of qualifications'
      },
      {
        name: 'Quick Contact',
        steps: [
          'Land on homepage',
          'Click "Get in Touch" CTA',
          'Fill contact form',
          'Submit inquiry'
        ],
        expectedOutcome: 'User successfully contacts for opportunities'
      }
    ];
  }
  
  /**
   * Generate performance test data
   */
  generatePerformanceTestData() {
    return {
      expectedLoadTime: 3000, // 3 seconds
      expectedFirstContentfulPaint: 2000, // 2 seconds
      expectedLargestContentfulPaint: 2500, // 2.5 seconds
      expectedCumulativeLayoutShift: 0.1, // CLS score
      expectedFirstInputDelay: 100, // 100ms
      maxImageSize: 500000, // 500KB
      maxJavaScriptSize: 1000000, // 1MB
      maxCSSSize: 100000 // 100KB
    };
  }
  
  /**
   * Generate accessibility test data
   */
  generateAccessibilityTestData() {
    return {
      requiredHeadings: ['h1', 'h2'],
      requiredLandmarks: ['header', 'main', 'footer', 'nav'],
      requiredAltText: true,
      requiredFormLabels: true,
      minimumColorContrast: 4.5, // WCAG AA standard
      requiredFocusIndicators: true,
      requiredKeyboardNavigation: true
    };
  }
  
  /**
   * Generate browser compatibility test data
   */
  generateBrowserTestData() {
    return [
      { name: 'Chrome', version: 'latest', market_share: 65 },
      { name: 'Firefox', version: 'latest', market_share: 15 },
      { name: 'Safari', version: 'latest', market_share: 12 },
      { name: 'Edge', version: 'latest', market_share: 8 }
    ];
  }
  
  /**
   * Generate device test data
   */
  generateDeviceTestData() {
    return [
      { name: 'iPhone 12', viewport: { width: 390, height: 844 }, type: 'mobile' },
      { name: 'iPhone SE', viewport: { width: 375, height: 667 }, type: 'mobile' },
      { name: 'iPad', viewport: { width: 768, height: 1024 }, type: 'tablet' },
      { name: 'iPad Pro', viewport: { width: 1024, height: 1366 }, type: 'tablet' },
      { name: 'Desktop HD', viewport: { width: 1920, height: 1080 }, type: 'desktop' },
      { name: 'Desktop 4K', viewport: { width: 3840, height: 2160 }, type: 'desktop' }
    ];
  }
  
  /**
   * Generate random delay for simulating network conditions
   */
  generateNetworkDelay() {
    return {
      fast: faker.number.int({ min: 50, max: 200 }),
      slow: faker.number.int({ min: 1000, max: 3000 }),
      offline: 0
    };
  }
  
  /**
   * Generate test environment data
   */
  generateEnvironmentData() {
    return {
      development: {
        baseUrl: 'https://marvinmarzon.netlify.app',
        timeout: 10000,
        retries: 0
      },
      staging: {
        baseUrl: 'https://marvinmarzon.netlify.app',
        timeout: 15000,
        retries: 1
      },
      production: {
        baseUrl: 'https://marvinmarzon.netlify.app',
        timeout: 30000,
        retries: 2
      }
    };
  }
}