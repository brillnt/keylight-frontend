/**
 * API Service Module
 * Handles all API communication
 */

class ApiService {
  constructor() {
    this.baseUrl = CONFIG.API.BASE_URL;
  }

  /**
   * Submit intake form data
   */
  async submitIntakeForm(formData) {
    try {
      const response = await fetch(`${this.baseUrl}${CONFIG.API.ENDPOINTS.submissions}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Submission failed');
      }

      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  }

  /**
   * Check API health
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}${CONFIG.API.ENDPOINTS.health}`);
      const result = await response.json();
      
      return {
        success: response.ok,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

