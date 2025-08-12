/**
 * Form Controller Module
 * Manages multi-step form logic and interactions
 */

class IntakeFormController {
  constructor() {
    this.currentStep = 1;
    this.formData = {};
    this.isSubmitting = false;
    
    this.init();
  }

  /**
   * Initialize form
   */
  init() {
    this.bindEvents();
    this.populateFieldOptions();
    this.showStep(1);
    this.updateProgressIndicator();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.handleNext());
    }

    // Form submission
    const form = document.getElementById('intakeForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Real-time validation
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateCurrentField(input));
      input.addEventListener('change', () => this.handleFieldChange(input));
    });

    // Conditional field logic
    this.bindConditionalLogic();
  }

  /**
   * Handle field changes for conditional logic
   */
  handleFieldChange(input) {
    const fieldName = input.name;
    const value = input.type === 'checkbox' ? input.checked : input.value;
    
    this.formData[fieldName] = value;
    
    // Handle conditional fields
    if (fieldName === 'land_status') {
      this.toggleConditionalFields();
    }
    
    if (fieldName === 'needs_help_finding_land') {
      this.togglePreferredAreaField();
    }
  }

  /**
   * Bind conditional field logic
   */
  bindConditionalLogic() {
    // Use event delegation for dynamically created radio buttons
    document.addEventListener('change', (e) => {
      if (e.target.name === 'land_status') {
        this.formData.land_status = e.target.value;
        this.toggleConditionalFields();
      }
      
      if (e.target.name === 'needs_help_finding_land') {
        this.formData.needs_help_finding_land = e.target.checked;
        this.togglePreferredAreaField();
      }
    });
  }

  /**
   * Toggle conditional fields based on land status
   */
  toggleConditionalFields() {
    const landStatus = this.formData.land_status;
    const lotAddressField = document.getElementById('lot-address-field');
    const helpFindingField = document.getElementById('help-finding-field');
    const preferredAreaField = document.getElementById('preferred-area-field');

    if (landStatus === 'own_land') {
      if (lotAddressField) lotAddressField.style.display = 'block';
      if (helpFindingField) helpFindingField.style.display = 'none';
      if (preferredAreaField) preferredAreaField.style.display = 'none';
    } else if (landStatus === 'need_land') {
      if (lotAddressField) lotAddressField.style.display = 'none';
      if (helpFindingField) helpFindingField.style.display = 'block';
      this.togglePreferredAreaField();
    } else {
      if (lotAddressField) lotAddressField.style.display = 'none';
      if (helpFindingField) helpFindingField.style.display = 'none';
      if (preferredAreaField) preferredAreaField.style.display = 'none';
    }
  }

  /**
   * Toggle preferred area field
   */
  togglePreferredAreaField() {
    const helpFindingLand = document.getElementById('needs_help_finding_land');
    const preferredAreaField = document.getElementById('preferred-area-field');
    
    if (helpFindingLand && preferredAreaField) {
      preferredAreaField.style.display = helpFindingLand.checked ? 'block' : 'none';
    }
  }

  /**
   * Populate field options from config
   */
  populateFieldOptions() {
    // Buyer categories
    this.populateRadioOptions('buyer_category', CONFIG.FIELD_OPTIONS.buyerCategories);
    
    // Financing plans
    this.populateRadioOptions('financing_plan', CONFIG.FIELD_OPTIONS.financingPlans);
    
    // Land statuses
    this.populateRadioOptions('land_status', CONFIG.FIELD_OPTIONS.landStatuses);
    
    // Build budgets
    this.populateSelectOptions('build_budget', CONFIG.FIELD_OPTIONS.buildBudgets);
    
    // Construction timelines
    this.populateSelectOptions('construction_timeline', CONFIG.FIELD_OPTIONS.constructionTimelines);
  }

  /**
   * Populate radio button options
   */
  populateRadioOptions(fieldName, options) {
    const container = document.getElementById(`${fieldName}-options`);
    if (!container) return;

    container.innerHTML = '';
    
    options.forEach(option => {
      const div = document.createElement('div');
      div.className = 'radio-option';
      
      div.innerHTML = `
        <input type="radio" id="${fieldName}_${option.value}" name="${fieldName}" value="${option.value}">
        <label for="${fieldName}_${option.value}">${option.label}</label>
      `;
      
      container.appendChild(div);
    });
  }

  /**
   * Populate select options
   */
  populateSelectOptions(fieldName, options) {
    const select = document.getElementById(fieldName);
    if (!select) return;

    // Clear existing options except the first (placeholder)
    while (select.children.length > 1) {
      select.removeChild(select.lastChild);
    }
    
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      select.appendChild(optionElement);
    });
  }

  /**
   * Show specific step
   */
  showStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => step.style.display = 'none');

    // Show current step
    const currentStepElement = document.getElementById(`step-${stepNumber}`);
    if (currentStepElement) {
      currentStepElement.style.display = 'block';
    }

    // Populate review section if showing step 5
    if (stepNumber === CONFIG.STEPS.REVIEW_SUBMIT) {
      this.populateReviewSection();
    }

    // Update button text
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      if (stepNumber === CONFIG.STEPS.TOTAL) {
        nextBtn.textContent = 'Submit Application';
        nextBtn.className = 'btn btn-submit';
      } else {
        nextBtn.textContent = 'Next';
        nextBtn.className = 'btn btn-primary';
      }
    }

    this.currentStep = stepNumber;
    this.updateProgressIndicator();
  }

  /**
   * Update progress indicator
   */
  updateProgressIndicator() {
    const indicators = document.querySelectorAll('.progress-dot');
    indicators.forEach((dot, index) => {
      const stepNumber = index + 1;
      if (stepNumber < this.currentStep) {
        dot.className = 'progress-dot completed';
      } else if (stepNumber === this.currentStep) {
        dot.className = 'progress-dot active';
      } else {
        dot.className = 'progress-dot';
      }
    });
  }

  /**
   * Populate review section with form data
   */
  populateReviewSection() {
    // Collect all current form data
    this.collectAllFormData();

    // Helper function to get option label
    const getOptionLabel = (fieldName, value) => {
      const options = CONFIG.FIELD_OPTIONS[fieldName];
      if (options) {
        const option = options.find(opt => opt.value === value);
        return option ? option.label : value;
      }
      return value;
    };

    // Populate review fields
    document.getElementById('review-name').textContent = this.formData.full_name || '';
    document.getElementById('review-email').textContent = this.formData.email_address || '';
    document.getElementById('review-phone').textContent = this.formData.phone_number || '';
    document.getElementById('review-company').textContent = this.formData.company_name || 'Not specified';

    document.getElementById('review-buyer-category').textContent = 
      getOptionLabel('buyerCategories', this.formData.buyer_category) || '';
    document.getElementById('review-financing').textContent = 
      getOptionLabel('financingPlans', this.formData.financing_plan) || '';

    document.getElementById('review-land-status').textContent = 
      getOptionLabel('landStatuses', this.formData.land_status) || '';
    
    let locationDetails = '';
    if (this.formData.land_status === 'own_land' && this.formData.lot_address) {
      locationDetails = this.formData.lot_address;
    } else if (this.formData.land_status === 'need_land') {
      if (this.formData.needs_help_finding_land && this.formData.preferred_area_description) {
        locationDetails = `Help needed finding land in: ${this.formData.preferred_area_description}`;
      } else {
        locationDetails = 'Will find land independently';
      }
    }
    document.getElementById('review-location').textContent = locationDetails || 'Not specified';

    document.getElementById('review-budget').textContent = 
      getOptionLabel('buildBudgets', this.formData.build_budget) || '';
    document.getElementById('review-timeline').textContent = 
      getOptionLabel('constructionTimelines', this.formData.construction_timeline) || '';
    document.getElementById('review-description').textContent = 
      this.formData.project_description || '';
  }

  /**
   * Handle next button click
   */
  async handleNext() {
    if (this.isSubmitting) return;

    // Collect current step data
    this.collectStepData();

    // Validate current step
    const errors = validationService.validateStep(this.currentStep, this.formData);
    
    if (errors.length > 0) {
      this.showErrors(errors);
      return;
    }

    this.clearErrors();

    // If last step, submit form
    if (this.currentStep === CONFIG.STEPS.TOTAL) {
      await this.submitForm();
    } else {
      // Move to next step
      this.showStep(this.currentStep + 1);
    }
  }

  /**
   * Collect data from current step
   */
  collectStepData() {
    const currentStepElement = document.getElementById(`step-${this.currentStep}`);
    if (!currentStepElement) return;

    const inputs = currentStepElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.type === 'radio') {
        if (input.checked) {
          this.formData[input.name] = input.value;
        }
      } else if (input.type === 'checkbox') {
        this.formData[input.name] = input.checked;
      } else {
        this.formData[input.name] = input.value;
      }
    });
  }

  /**
   * Collect all form data
   */
  collectAllFormData() {
    const form = document.getElementById('intakeForm');
    const formData = new FormData(form);

    for (let [key, value] of formData.entries()) {
      this.formData[key] = value;
    }

    // Handle checkboxes that might not be in FormData
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      this.formData[checkbox.name] = checkbox.checked;
    });

    return this.formData;
  }

  /**
   * Submit form
   */
  async submitForm() {
    this.isSubmitting = true;
    this.showLoading(true);

    // Collect all form data
    const allFormData = this.collectAllFormData();
    
    // Final validation
    const errors = validationService.validateForm(allFormData);
    if (errors.length > 0) {
      this.showErrors(errors);
      this.isSubmitting = false;
      this.showLoading(false);
      return;
    }

    // Submit to API
    const result = await apiService.submitIntakeForm(allFormData);
    
    if (result.success) {
      this.showSuccess(result.message);
    } else {
      this.showErrors([result.error]);
    }

    this.isSubmitting = false;
    this.showLoading(false);
  }

  /**
   * Handle form submit event
   */
  handleSubmit(e) {
    e.preventDefault();
    this.handleNext();
  }

  /**
   * Validate current field
   */
  validateCurrentField(input) {
    const fieldName = input.name;
    const value = input.type === 'checkbox' ? input.checked : input.value;
    
    const errors = validationService.validateField(fieldName, value, this.formData);
    
    const errorContainer = input.parentElement.querySelector('.field-error');
    if (errorContainer) {
      if (errors.length > 0) {
        errorContainer.textContent = errors[0];
        errorContainer.style.display = 'block';
        input.classList.add('error');
      } else {
        errorContainer.style.display = 'none';
        input.classList.remove('error');
      }
    }
  }

  /**
   * Show errors
   */
  showErrors(errors) {
    const errorContainer = document.getElementById('errorContainer');
    if (!errorContainer) return;

    errorContainer.innerHTML = `
      <div class="error-message">
        <h4>Please correct the following errors:</h4>
        <ul>
          ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
      </div>
    `;
    errorContainer.style.display = 'block';
    
    // Scroll to top to show errors
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Clear errors
   */
  clearErrors() {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
      errorContainer.style.display = 'none';
    }

    // Clear field-level errors
    const fieldErrors = document.querySelectorAll('.field-error');
    fieldErrors.forEach(error => error.style.display = 'none');

    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));
  }

  /**
   * Show loading state
   */
  showLoading(show) {
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      if (show) {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Submitting...';
      } else {
        nextBtn.disabled = false;
        nextBtn.textContent = this.currentStep === CONFIG.STEPS.TOTAL ? 'Submit Application' : 'Next';
      }
    }
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    const container = document.querySelector('.form-container');
    if (container) {
      container.innerHTML = `
        <div class="success-message">
          <div class="success-icon">✓</div>
          <h2>Application Submitted Successfully!</h2>
          <p>${message || 'Thank you for your submission. We will review your application and contact you soon.'}</p>
          <p>You can close this window or <a href="javascript:location.reload()">submit another application</a>.</p>
        </div>
      `;
    }
  }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new IntakeFormController();
});

