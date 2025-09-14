// API Configuration
const apiConfig = {
  development: {
    baseUrl: 'https://localhost:44300',
    endpoints: {
      master: '/api/Master'
    },
    timeout: 10000,
    retryAttempts: 3
  },
  production: {
    baseUrl: 'https://rajanbio-dotnet.onrender.com',
    endpoints: {
      master: '/api/Master'
    },
    timeout: 15000,
    retryAttempts: 3
  }
}

// Get current environment (default to development)
const currentEnv = import.meta.env.MODE || 'development'

// Export the configuration for the current environment
export const config = apiConfig[currentEnv] || apiConfig.development

// Helper function to get full URL for an endpoint
export const getApiUrl = (endpoint) => {
  return `${config.baseUrl}${config.endpoints[endpoint]}`
}

// Helper function to get the master API URL
export const getMasterApiUrl = () => {
  return getApiUrl('master')
}

export default config
