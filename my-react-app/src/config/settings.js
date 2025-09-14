// Application Settings and Configuration
export const settings = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://rajanbio-dotnet.onrender.com',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
    endpoints: {
      master: '/api/Master'
    }
  },
  
  // Authentication
  auth: {
    passphrase: 'rajan123'
  },
  
  // UI Configuration
  ui: {
    animationDuration: 300,
    debounceDelay: 500
  }
}

// Helper functions
export const getApiUrl = (endpoint) => {
  return `${settings.api.baseUrl}${settings.api.endpoints[endpoint]}`
}

export const getMasterApiUrl = () => {
  return getApiUrl('master')
}

export const getPassphrase = () => {
  return settings.auth.passphrase
}

export default settings
