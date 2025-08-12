/**
 * Validation Module
 * Handles form validation logic
 */

class ValidationService {
  constructor() {
    this.rules = CONFIG.VALIDATION;
  }

  /**
   * Validate a single field
   */
  validateField(fieldName, value, formData = {}) {
    const errors = [];

    // Required field validation
    if (this.rules.required.includes(fieldName)) {
      if (!value || value.toString().trim() === '') {
        errors.push(`${this.getFieldLabel(fieldName)} is required`);
        return errors;
      }
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
      return errors;
    }

    // Email validation
    if (fieldName === 'email_address') {
      if (!this.rules.email.test(value)) {
        errors.push('Please enter a valid email address');
      }
    }

    // Phone validation
    if (fieldName === 'phone_number') {
      if (!this.rules.phone.test(value)) {
        errors.push('Please enter a valid phone number');
      }
    }

    // Conditional validations
    if (fieldName === 'lot_address' && formData.land_status === 'own_land') {
      if (!value || value.trim() === '') {
        errors.push('Lot address is required when you own land');
      }
    }

    if (fieldName === 'preferred_area_description' && 
        formData.land_status === 'need_land' && 
        formData.needs_help_finding_land === true) {
      if (!value || value.trim() === '') {
        errors.push('Preferred area description is required when you need help finding land');
      }
    }

    return errors;
  }

  /**
   * Validate current step
   */
  validateStep(stepNumber, formData) {
    const errors = [];
    const fieldsToValidate = this.getStepFields(stepNumber);

    fieldsToValidate.forEach(fieldName => {
      const fieldErrors = this.validateField(fieldName, formData[fieldName], formData);
      errors.push(...fieldErrors);
    });

    return errors;
  }

  /**
   * Get fields for a specific step
   */
  getStepFields(stepNumber) {
    switch (stepNumber) {
      case CONFIG.STEPS.CONTACT:
        return ['full_name', 'email_address', 'phone_number'];
      
      case CONFIG.STEPS.PROJECT_TYPE:
        return ['buyer_category', 'financing_plan'];
      
      case CONFIG.STEPS.LAND_LOCATION:
        return ['land_status'];
      
      case CONFIG.STEPS.PROJECT_DETAILS:
        return ['build_budget', 'construction_timeline', 'project_description'];
      
      default:
        return [];
    }
  }

  /**
   * Get human-readable field label
   */
  getFieldLabel(fieldName) {
    const labels = {
      full_name: 'Full Name',
      email_address: 'Email Address',
      phone_number: 'Phone Number',
      company_name: 'Company Name',
      buyer_category: 'Buyer Category',
      financing_plan: 'Financing Plan',
      land_status: 'Land Status',
      lot_address: 'Lot Address',
      preferred_area_description: 'Preferred Area',
      build_budget: 'Build Budget',
      construction_timeline: 'Construction Timeline',
      project_description: 'Project Description'
    };

    return labels[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Validate entire form
   */
  validateForm(formData) {
    const errors = [];

    CONFIG.VALIDATION.required.forEach(fieldName => {
      const fieldErrors = this.validateField(fieldName, formData[fieldName], formData);
      errors.push(...fieldErrors);
    });

    return errors;
  }
}

// Create singleton instance
const validationService = new ValidationService();

