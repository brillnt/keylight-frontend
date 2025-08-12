/**
 * Configuration for Keylight Intake Form
 * Centralized config for easy Angular migration
 */

const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: 'http://localhost:3000',
    ENDPOINTS: {
      submissions: '/api/submissions',
      health: '/health'
    }
  },

  // Form Field Options
  FIELD_OPTIONS: {
    buyerCategories: [
      { value: 'homebuyer', label: 'I am a homebuyer' },
      { value: 'developer', label: 'I am a developer' }
    ],
    
    financingPlans: [
      { value: 'self_funding', label: 'I will be self-funding the build' },
      { value: 'finance_build', label: 'I intend to finance the build' }
    ],
    
    landStatuses: [
      { value: 'own_land', label: 'Yes, I own land' },
      { value: 'need_land', label: 'No, I need to purchase land' }
    ],
    
    buildBudgets: [
      { value: '200k_250k', label: '$200,000 – $250,000' },
      { value: '250k_350k', label: '$250,000 – $350,000' },
      { value: '350k_400k', label: '$350,000 – $400,000' },
      { value: '400k_500k', label: '$400,000 – $500,000' },
      { value: '500k_plus', label: '$500,000+' }
    ],
    
    constructionTimelines: [
      { value: 'less_than_3_months', label: 'Less than 3 months' },
      { value: '3_to_6_months', label: '3 to 6 months' },
      { value: '6_to_12_months', label: '6 to 12 months' },
      { value: 'more_than_12_months', label: 'More than 12 months' }
    ]
  },

  // Validation Rules
  VALIDATION: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\-\(\)\+\.]{10,}$/,
    required: ['full_name', 'email_address', 'phone_number', 'buyer_category', 
               'financing_plan', 'land_status', 'build_budget', 'construction_timeline', 
               'project_description']
  },

  // Form Steps Configuration
  STEPS: {
    CONTACT: 1,
    PROJECT_TYPE: 2,
    LAND_LOCATION: 3,
    PROJECT_DETAILS: 4,
    REVIEW_SUBMIT: 5,
    TOTAL: 5
  },

  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300,
    SUCCESS_REDIRECT_DELAY: 3000
  }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

