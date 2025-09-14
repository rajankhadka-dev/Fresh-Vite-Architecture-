# Configuration System

This directory contains the application configuration files and settings.

## Files

### `settings.js`
Main configuration file that exports application settings including:
- API configuration (base URL, timeout, retry attempts)
- Authentication settings (passphrase)
- UI configuration (animation duration, debounce delay)

### `api.json`
JSON configuration file for API endpoints (alternative approach).

## Usage

### Basic Usage
```javascript
import { getMasterApiUrl, getPassphrase } from '../config/settings'

// Get API URL
const apiUrl = getMasterApiUrl()

// Get passphrase
const passphrase = getPassphrase()
```

### Environment Variables
You can override default settings using environment variables:
- `VITE_API_BASE_URL` - Override the API base URL
- `VITE_API_TIMEOUT` - Override the API timeout
- `VITE_API_RETRY_ATTEMPTS` - Override retry attempts

### API Service
Use the `apiService` for making API calls with built-in retry logic and error handling:

```javascript
import apiService from '../services/apiService'

// Submit data
const result = await apiService.submitMasterData(formData)
```

## Configuration Best Practices

1. **Centralized Configuration**: All settings are in one place
2. **Environment Support**: Different settings for development/production
3. **Type Safety**: Clear structure and helper functions
4. **Error Handling**: Built-in retry logic and error management
5. **Logging**: Comprehensive logging for debugging

## Changing API URL

To change the API URL, you can either:

1. **Modify `settings.js`**:
   ```javascript
   api: {
     baseUrl: 'https://your-new-api-url.com',
     // ...
   }
   ```

2. **Use environment variable**:
   Create a `.env` file in the project root:
   ```
   VITE_API_BASE_URL=https://your-new-api-url.com
   ```

3. **Runtime configuration** (advanced):
   The configuration can be made dynamic by reading from a remote config file.
