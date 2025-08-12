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
    // Bind form submission
    const form = document.getElementById('intakeForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Bind next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.handleNext());
    }

    // Bind back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.handleBack());
    }

    // Initialize form fields
    this.initializeFormFields();
    
    // Show first step
    this.showStep(1);
    
    // Conditional field logic
    this.bindConditionalLogic();
  }

  /**
   * Initialize form fields with options
   */
  initializeFormFields() {
    // Create radio button options
    this.createRadioOptions('buyer_category', CONFIG.FIELD_OPTIONS.buyerCategories);
    this.createRadioOptions('financing_plan', CONFIG.FIELD_OPTIONS.financingPlans);
    this.createRadioOptions('land_status', CONFIG.FIELD_OPTIONS.landStatuses);
    
    // Populate select dropdowns
    this.populateSelectOptions('build_budget', CONFIG.FIELD_OPTIONS.buildBudgets);
    this.populateSelectOptions('construction_timeline', CONFIG.FIELD_OPTIONS.constructionTimelines);
  }

  /**
   * Create radio button options
   */
  createRadioOptions(fieldName, options) {
    const container = document.getElementById(`${fieldName}-options`);
    if (!container || !options) return;

    container.innerHTML = '';

    options.forEach(option => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'radio-option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.id = `${fieldName}_${option.value}`;
      input.name = fieldName;
      input.value = option.value;
      input.required = true;

      const label = document.createElement('label');
      label.htmlFor = input.id;
      label.textContent = option.label;

      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      container.appendChild(optionDiv);
    });
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
   * Handle next button click
   */
  handleNext() {
    if (this.isSubmitting) return;

    // Validate current step
    const errors = this.validateCurrentStep();
    if (errors.length > 0) {
      this.showErrors(errors);
      return;
    }

    // Collect current step data
    this.collectCurrentStepData();

    // Move to next step or submit
    if (this.currentStep < CONFIG.STEPS.TOTAL) {
      this.showStep(this.currentStep + 1);
    } else {
      this.submitForm();
    }
  }

  /**
   * Handle back button click
   */
  handleBack() {
    if (this.currentStep > 1) {
      this.showStep(this.currentStep - 1);
    }
  }

  /**
   * Validate current step
   */
  validateCurrentStep() {
    const currentStepElement = document.getElementById(`step-${this.currentStep}`);
    if (!currentStepElement) return [];

    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    const errors = [];

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        const label = currentStepElement.querySelector(`label[for="${field.id}"]`);
        const fieldName = label ? label.textContent.replace('*', '').trim() : field.name;
        errors.push(`${fieldName} is required`);
      }
    });

    return errors;
  }

  /**
   * Collect current step data
   */
  collectCurrentStepData() {
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
   * Populate select options
   */
  populateSelectOptions(fieldName, options) {
    const select = document.getElementById(fieldName);
    if (!select || !options) return;

    // Clear existing options except the first (placeholder)
    while (select.children.length > 1) {
      select.removeChild(select.lastChild);
    }

    // Add new options
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

    // Update button visibility and text
    this.updateButtonStates(stepNumber);

    this.currentStep = stepNumber;
    this.updateProgressIndicator();
  }

  /**
   * Update button states based on current step
   */
  updateButtonStates(stepNumber) {
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const buttonContainer = document.querySelector('.button-container');

    // Update next button
    if (nextBtn) {
      if (stepNumber === CONFIG.STEPS.TOTAL) {
        nextBtn.textContent = 'Submit Application';
        nextBtn.className = 'btn btn-submit';
      } else {
        nextBtn.textContent = 'Next';
        nextBtn.className = 'btn btn-primary';
      }
    }

    // Update back button visibility
    if (backBtn) {
      if (stepNumber === 1) {
        backBtn.style.display = 'none';
        buttonContainer?.classList.add('single-button');
      } else {
        backBtn.style.display = 'block';
        buttonContainer?.classList.remove('single-button');
      }
    }
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
  handleFormSubmit(e) {
    e.preventDefault();
    this.handleNext();
  }

  /**
   * Show loading state
   */
  showLoading(show) {
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    
    if (show) {
      if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.textContent = 'Submitting...';
      }
      if (backBtn) {
        backBtn.disabled = true;
      }
    } else {
      if (nextBtn) {
        nextBtn.disabled = false;
        this.updateButtonStates(this.currentStep);
      }
      if (backBtn) {
        backBtn.disabled = false;
      }
    }
  }

  /**
   * Show errors
   */
  showErrors(errors) {
    // Clear previous errors
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(el => el.textContent = '');

    // Show new errors
    if (errors.length > 0) {
      const firstError = document.querySelector('.field-error');
      if (firstError) {
        firstError.textContent = errors.join(', ');
        firstError.style.display = 'block';
      }
    }
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    // Hide form and show success message
    const form = document.getElementById('intakeForm');
    if (form) {
      form.innerHTML = `
        <div class="success-message">
          <h2>Thank You!</h2>
          <p>${message}</p>
          <p>We'll be in touch soon to discuss your project.</p>
        </div>
      `;
    }
  }
}

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.formController = new IntakeFormController();
});

