import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || error.response.data?.message || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

/**
 * Process a file or files using the specified endpoint
 * @param {string} endpoint - The API endpoint (e.g., '/merge', '/split')
 * @param {File|File[]} files - The file(s) to process
 * @param {Object} options - Additional options for processing
 * @returns {Promise<Object>} - The processed file information
 */
export const processFile = async (endpoint, files, options = {}) => {
  try {
    const formData = new FormData();
    
    // Handle single file or multiple files
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append('files', file);
      });
    } else {
      formData.append('file', files);
    }
    
    // Add any additional options
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });

    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob', // Expect binary data
    });

    // Create blob URL for download
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/pdf' 
    });
    const url = window.URL.createObjectURL(blob);
    
    // Extract filename from response headers or generate one
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'processed-file.pdf';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    return {
      url,
      filename,
      blob,
      size: blob.size
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Upload files for processing
 * @param {string} endpoint - The API endpoint
 * @param {File[]} files - Array of files to upload
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Upload response
 */
export const uploadFiles = async (endpoint, files, onProgress) => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data;
};

/**
 * Check if the backend is available
 * @returns {Promise<boolean>} - True if backend is available
 */
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default api;