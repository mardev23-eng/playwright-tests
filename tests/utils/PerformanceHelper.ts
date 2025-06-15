import { Page } from '@playwright/test';

/**
 * Performance Helper
 * Utilities for measuring and validating performance metrics
 */
export class PerformanceHelper {
  private page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
  
  /**
   * Measure page load performance
   */
  async measurePageLoad() {
    const metrics = await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        // Navigation timing
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        
        // Paint timing
        firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        
        // Resource timing
        totalSize: navigation.transferSize || 0,
        
        // Connection timing
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        serverResponse: navigation.responseEnd - navigation.requestStart,
        
        // Full page load - use startTime instead of navigationStart
        fullLoadTime: navigation.loadEventEnd - navigation.startTime,
      };
    });
    
    return metrics;
  }
  
  /**
   * Measure Core Web Vitals
   */
  async measureCoreWebVitals() {
    const vitals = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {};
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            vitals.fid = entry.processingStart - entry.startTime;
          });
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after a delay to collect metrics
        setTimeout(() => resolve(vitals), 3000);
      });
    });
    
    return vitals;
  }
  
  /**
   * Measure resource loading performance
   */
  async measureResourcePerformance() {
    const resources = await this.page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      return resources.map(resource => ({
        name: resource.name,
        type: resource.initiatorType,
        size: resource.transferSize || 0,
        duration: resource.duration,
        startTime: resource.startTime,
        responseEnd: resource.responseEnd,
      }));
    });
    
    // Categorize resources
    const categorized = {
      images: resources.filter(r => r.type === 'img'),
      scripts: resources.filter(r => r.type === 'script'),
      stylesheets: resources.filter(r => r.type === 'link'),
      fonts: resources.filter(r => r.name.includes('.woff') || r.name.includes('.ttf')),
      other: resources.filter(r => !['img', 'script', 'link'].includes(r.type))
    };
    
    return {
      resources,
      categorized,
      totalSize: resources.reduce((sum, r) => sum + r.size, 0),
      totalRequests: resources.length,
      slowestResource: resources.reduce((slowest, current) => 
        current.duration > slowest.duration ? current : slowest, resources[0])
    };
  }
  
  /**
   * Measure JavaScript performance
   */
  async measureJavaScriptPerformance() {
    const jsMetrics = await this.page.evaluate(() => {
      const scripts = performance.getEntriesByType('resource')
        .filter((resource: any) => resource.initiatorType === 'script');
      
      return {
        scriptCount: scripts.length,
        totalScriptSize: scripts.reduce((sum: number, script: any) => sum + (script.transferSize || 0), 0),
        largestScript: scripts.reduce((largest: any, current: any) => 
          (current.transferSize || 0) > (largest.transferSize || 0) ? current : largest, scripts[0]),
        scriptLoadTime: scripts.reduce((sum: number, script: any) => sum + script.duration, 0)
      };
    });
    
    return jsMetrics;
  }
  
  /**
   * Measure CSS performance
   */
  async measureCSSPerformance() {
    const cssMetrics = await this.page.evaluate(() => {
      const stylesheets = performance.getEntriesByType('resource')
        .filter((resource: any) => resource.initiatorType === 'link' && resource.name.includes('.css'));
      
      return {
        stylesheetCount: stylesheets.length,
        totalCSSSize: stylesheets.reduce((sum: number, css: any) => sum + (css.transferSize || 0), 0),
        largestStylesheet: stylesheets.reduce((largest: any, current: any) => 
          (current.transferSize || 0) > (largest.transferSize || 0) ? current : largest, stylesheets[0]),
        cssLoadTime: stylesheets.reduce((sum: number, css: any) => sum + css.duration, 0)
      };
    });
    
    return cssMetrics;
  }
  
  /**
   * Measure image performance
   */
  async measureImagePerformance() {
    const imageMetrics = await this.page.evaluate(() => {
      const images = performance.getEntriesByType('resource')
        .filter((resource: any) => resource.initiatorType === 'img');
      
      return {
        imageCount: images.length,
        totalImageSize: images.reduce((sum: number, img: any) => sum + (img.transferSize || 0), 0),
        largestImage: images.reduce((largest: any, current: any) => 
          (current.transferSize || 0) > (largest.transferSize || 0) ? current : largest, images[0]),
        imageLoadTime: images.reduce((sum: number, img: any) => sum + img.duration, 0),
        averageImageSize: images.length > 0 ? 
          images.reduce((sum: number, img: any) => sum + (img.transferSize || 0), 0) / images.length : 0
      };
    });
    
    return imageMetrics;
  }
  
  /**
   * Generate performance report
   */
  async generatePerformanceReport() {
    const pageLoad = await this.measurePageLoad();
    const resources = await this.measureResourcePerformance();
    const javascript = await this.measureJavaScriptPerformance();
    const css = await this.measureCSSPerformance();
    const images = await this.measureImagePerformance();
    
    const report = {
      timestamp: new Date().toISOString(),
      url: this.page.url(),
      pageLoad,
      resources,
      javascript,
      css,
      images,
      recommendations: this.generateRecommendations(pageLoad, resources, javascript, css, images)
    };
    
    return report;
  }
  
  /**
   * Generate performance recommendations
   */
  private generateRecommendations(pageLoad: any, resources: any, js: any, css: any, images: any) {
    const recommendations = [];
    
    // Page load recommendations
    if (pageLoad.fullLoadTime > 3000) {
      recommendations.push('Page load time exceeds 3 seconds. Consider optimizing resources.');
    }
    
    if (pageLoad.firstContentfulPaint > 2000) {
      recommendations.push('First Contentful Paint is slow. Optimize critical rendering path.');
    }
    
    // Resource recommendations
    if (resources.totalRequests > 50) {
      recommendations.push('High number of HTTP requests. Consider bundling resources.');
    }
    
    if (resources.totalSize > 2000000) { // 2MB
      recommendations.push('Total page size is large. Optimize and compress resources.');
    }
    
    // JavaScript recommendations
    if (js.totalScriptSize > 500000) { // 500KB
      recommendations.push('JavaScript bundle is large. Consider code splitting.');
    }
    
    // CSS recommendations
    if (css.totalCSSSize > 100000) { // 100KB
      recommendations.push('CSS size is large. Remove unused styles.');
    }
    
    // Image recommendations
    if (images.averageImageSize > 200000) { // 200KB
      recommendations.push('Images are large. Optimize and use modern formats.');
    }
    
    return recommendations;
  }
  
  /**
   * Monitor performance during test execution
   */
  async startPerformanceMonitoring() {
    await this.page.evaluate(() => {
      (window as any).performanceData = [];
      
      // Monitor resource loading
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          (window as any).performanceData.push({
            type: 'resource',
            name: entry.name,
            duration: entry.duration,
            timestamp: Date.now()
          });
        });
      }).observe({ entryTypes: ['resource'] });
      
      // Monitor long tasks
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          (window as any).performanceData.push({
            type: 'longtask',
            duration: entry.duration,
            timestamp: Date.now()
          });
        });
      }).observe({ entryTypes: ['longtask'] });
    });
  }
  
  /**
   * Get monitored performance data
   */
  async getMonitoredData() {
    return await this.page.evaluate(() => {
      return (window as any).performanceData || [];
    });
  }
}