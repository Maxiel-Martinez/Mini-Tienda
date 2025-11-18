const API_BASE_URL = 'http://localhost:4000/api';

/**
 * Generic API fetcher function
 * @param {string} endpoint - API endpoint (e.g., '/products' or '/products/1')
 * @param {object} [options={}] - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - Parsed JSON response or [] if error
 */
export const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};
