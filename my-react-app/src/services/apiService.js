import { getMasterApiUrl } from '../config/settings'

// API Service with retry logic and better error handling
class ApiService {
  constructor() {
    this.baseUrl = getMasterApiUrl()
  }

  // Generic fetch method with retry logic
  async fetchWithRetry(url, options = {}, retryCount = 0) {
    const maxRetries = 3
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      // If response is not ok and we have retries left
      if (!response.ok && retryCount < maxRetries) {
        console.warn(`API request failed (${response.status}), retrying... (${retryCount + 1}/${maxRetries})`)
        await this.delay(1000 * (retryCount + 1)) // Exponential backoff
        return this.fetchWithRetry(url, options, retryCount + 1)
      }

      return response
    } catch (error) {
      if (retryCount < maxRetries) {
        console.warn(`Network error, retrying... (${retryCount + 1}/${maxRetries})`, error.message)
        await this.delay(1000 * (retryCount + 1))
        return this.fetchWithRetry(url, options, retryCount + 1)
      }
      throw error
    }
  }

  // Delay helper for retry logic
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Submit data to Master API
  async submitMasterData(data) {
    console.log('Submitting data to Master API:', data)
    console.log('API URL:', this.baseUrl)

    try {
      const response = await this.fetchWithRetry(this.baseUrl, {
        method: 'POST',
        body: JSON.stringify(data)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        // Try to parse JSON response, but handle cases where response might be empty
        let result = null
        const contentType = response.headers.get('content-type')
        
        if (contentType && contentType.includes('application/json')) {
          try {
            result = await response.json()
          } catch (jsonError) {
            console.warn('Failed to parse JSON response:', jsonError)
          }
        } else {
          const textResponse = await response.text()
          console.log('Non-JSON response:', textResponse)
        }

        return {
          success: true,
          data: result,
          status: response.status,
          message: 'Data submitted successfully!'
        }
      } else {
        // Handle error responses
        let errorMessage = `Server error: ${response.status} ${response.statusText}`
        
        try {
          const errorText = await response.text()
          if (errorText) {
            errorMessage += ` - ${errorText}`
          }
        } catch (textError) {
          console.warn('Failed to read error response:', textError)
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status
        }
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: `Network error: ${error.message}. Please check your internet connection and try again.`
      }
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService()
export default apiService
