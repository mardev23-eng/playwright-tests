import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Contact Page Object
 * Represents the contact section functionality
 */
export class ContactPage extends BasePage {
  // Form elements
  private contactSection: Locator;
  private contactForm: Locator;
  private nameInput: Locator;
  private emailInput: Locator;
  private subjectSelect: Locator;
  private messageTextarea: Locator;
  private submitButton: Locator;
  private successMessage: Locator;
  // Remove the private errorMessage declaration since it's inherited from BasePage
  private contactInfo: Locator;
  private emailInfoButton: Locator;
  private emailInfoPanel: Locator;
  
  constructor(page: Page) {
    super(page);
    
    this.contactSection = page.locator('#contact');
    this.contactForm = page.locator('form');
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.subjectSelect = page.locator('select[name="subject"]');
    this.messageTextarea = page.locator('textarea[name="message"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('[class*="success"]');
    // errorMessage is inherited from BasePage as protected
    this.contactInfo = page.locator('[class*="contact-info"]');
    this.emailInfoButton = page.locator('button[title*="Email delivery"]');
    this.emailInfoPanel = page.locator('[class*="blue-50"]');
  }
  
  /**
   * Navigate to contact section
   */
  async navigateToContact() {
    await this.goto('/#contact');
    await this.waitForPageLoad();
  }
  
  /**
   * Verify contact section is visible
   */
  async verifyContactSection() {
    await expect(this.contactSection).toBeVisible();
    await expect(this.page.locator('h2:has-text("Get In Touch")')).toBeVisible();
  }
  
  /**
   * Verify contact form elements
   */
  async verifyContactForm() {
    await expect(this.contactForm).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.subjectSelect).toBeVisible();
    await expect(this.messageTextarea).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
  
  /**
   * Verify contact information display
   */
  async verifyContactInfo() {
    // Check email
    await expect(this.page.locator('text="marvinmarzon@outlook.com"')).toBeVisible();
    
    // Check phone
    await expect(this.page.locator('text="(+639) 678 337 280"')).toBeVisible();
    
    // Check location
    await expect(this.page.locator('text="Cebu City, Cebu Philippines"')).toBeVisible();
    
    // Check availability tags
    const availabilityTags = ['Contract Work', 'Freelance', 'Full-time Positions', 'Consulting'];
    for (const tag of availabilityTags) {
      await expect(this.page.locator(`text="${tag}"`)).toBeVisible();
    }
  }
  
  /**
   * Fill contact form with valid data
   */
  async fillContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    await this.fillInput(this.nameInput, data.name);
    await this.fillInput(this.emailInput, data.email);
    await this.selectOption(this.subjectSelect, data.subject);
    await this.fillInput(this.messageTextarea, data.message);
  }
  
  /**
   * Submit contact form
   */
  async submitForm() {
    await this.clickElement(this.submitButton);
  }
  
  /**
   * Verify form submission success
   */
  async verifySubmissionSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 15000 });
    await expect(this.page.locator('text="Message Sent Successfully!"')).toBeVisible();
    await expect(this.page.locator('text="marvinmarzon@outlook.com"')).toBeVisible();
  }
  
  /**
   * Verify form validation errors
   */
  async verifyValidationErrors() {
    // Submit empty form
    await this.submitForm();
    
    // Check HTML5 validation
    await expect(this.nameInput).toHaveAttribute('required');
    await expect(this.emailInput).toHaveAttribute('required');
    await expect(this.subjectSelect).toHaveAttribute('required');
    await expect(this.messageTextarea).toHaveAttribute('required');
  }
  
  /**
   * Test email info panel
   */
  async testEmailInfoPanel() {
    await this.clickElement(this.emailInfoButton);
    await expect(this.emailInfoPanel).toBeVisible();
    
    // Verify info content
    await expect(this.page.locator('text="Email Delivery"')).toBeVisible();
    await expect(this.page.locator('text="marvinmarzon@outlook.com"')).toBeVisible();
  }
  
  /**
   * Test form field validation
   */
  async testFieldValidation() {
    // Test invalid email
    await this.fillInput(this.emailInput, 'invalid-email');
    await this.submitForm();
    
    // Browser should show validation message
    const emailValidity = await this.emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(emailValidity).toBe(false);
    
    // Test valid email
    await this.fillInput(this.emailInput, 'test@example.com');
    const validEmailValidity = await this.emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(validEmailValidity).toBe(true);
  }
  
  /**
   * Test subject dropdown options
   */
  async testSubjectOptions() {
    const expectedOptions = [
      'Job Opportunity',
      'Project Inquiry', 
      'Consultation',
      'Collaboration',
      'Other'
    ];
    
    for (const option of expectedOptions) {
      await this.selectOption(this.subjectSelect, option);
      const selectedValue = await this.subjectSelect.inputValue();
      expect(selectedValue).toBe(option);
    }
  }
  
  /**
   * Test form accessibility
   */
  async testFormAccessibility() {
    // Check labels are associated with inputs
    await expect(this.nameInput).toHaveAttribute('id');
    await expect(this.page.locator('label[for="name"]')).toBeVisible();
    
    await expect(this.emailInput).toHaveAttribute('id');
    await expect(this.page.locator('label[for="email"]')).toBeVisible();
    
    await expect(this.subjectSelect).toHaveAttribute('id');
    await expect(this.page.locator('label[for="subject"]')).toBeVisible();
    
    await expect(this.messageTextarea).toHaveAttribute('id');
    await expect(this.page.locator('label[for="message"]')).toBeVisible();
  }
  
  /**
   * Test form submission loading state
   */
  async testSubmissionLoadingState() {
    // Fill form with valid data
    await this.fillContactForm({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Job Opportunity',
      message: 'This is a test message for form submission.'
    });
    
    // Submit and check loading state
    await this.submitForm();
    
    // Button should show loading state
    await expect(this.submitButton).toBeDisabled();
    await expect(this.page.locator('text="Sending to marvinmarzon@outlook.com"')).toBeVisible();
  }
  
  /**
   * Test responsive contact form
   */
  async testResponsiveForm() {
    // Test mobile layout
    await this.page.setViewportSize({ width: 375, height: 667 });
    
    await expect(this.contactForm).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    
    // Test tablet layout
    await this.page.setViewportSize({ width: 768, height: 1024 });
    
    await expect(this.contactForm).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}