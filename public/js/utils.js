// Toolsy - Shared Utilities and API

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// File size formatter
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// File type validation
const isValidFileType = (file, acceptedTypes) => {
    if (!acceptedTypes) return true;
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    return acceptedTypes.split(',').some(type => type.trim() === fileExtension);
};

// PDF page count detection (client-side fallback)
const getClientSidePageCount = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const arrayBuffer = e.target.result;
                const uint8Array = new Uint8Array(arrayBuffer);
                let pdfText = '';
                
                // Convert to string (sample first 100KB for speed)
                const sampleSize = Math.min(uint8Array.length, 100000);
                for (let i = 0; i < sampleSize; i++) {
                    pdfText += String.fromCharCode(uint8Array[i]);
                }
                
                let pageCount = 1;
                
                // Look for the most reliable page count indicator
                const pagesMatch = pdfText.match(/\/Type\s*\/Pages[^}]*\/Count\s+(\d+)/i);
                if (pagesMatch) {
                    pageCount = parseInt(pagesMatch[1]);
                } else {
                    // Fallback: count page objects
                    const pageMatches = pdfText.match(/\/Type\s*\/Page(?![s\w])/gi);
                    if (pageMatches && pageMatches.length > 0) {
                        pageCount = pageMatches.length;
                    }
                }
                
                pageCount = Math.max(1, Math.min(pageCount, 1000));
                resolve(pageCount);
                
            } catch (error) {
                console.error('Client-side parsing failed:', error);
                resolve(1); // Final fallback
            }
        };
        
        reader.onerror = () => {
            console.error('File reading failed');
            resolve(1);
        };
        
        reader.readAsArrayBuffer(file);
    });
};

// Get page count from backend
const getPageCountFromBackend = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(`${API_BASE_URL}/get-page-count`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return response.data.page_count || 1;
    } catch (error) {
        console.error('Backend page count failed:', error);
        throw error;
    }
};

// Generic file upload with progress
const uploadFileWithProgress = async (endpoint, files, onProgress, additionalData = {}) => {
    try {
        const formData = new FormData();
        
        // Add files
        if (Array.isArray(files)) {
            files.forEach(file => formData.append('files', file));
        } else {
            formData.append('file', files);
        }
        
        // Add additional data
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });
        
        const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'blob',
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                if (onProgress) onProgress(percentCompleted);
            }
        });
        
        return response;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
};

// Download file helper
const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

// Check if response is ZIP file
const isZipFile = (response) => {
    const contentType = response.headers['content-type'];
    return contentType && contentType.includes('application/zip');
};

// Drag and drop helpers
const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
};

const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
};

const handleDrop = (e, onFilesSelected, acceptedTypes) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => isValidFileType(file, acceptedTypes));
    
    if (validFiles.length > 0) {
        onFilesSelected(validFiles);
    } else {
        alert('Please select valid file types.');
    }
};

// Debounce helper
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Local storage helpers
const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
};

const getFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Failed to read from localStorage:', error);
        return defaultValue;
    }
};

// Error handling
const handleError = (error, customMessage = '') => {
    console.error('Error:', error);
    const message = customMessage || error.message || 'An unexpected error occurred';
    return {
        error: true,
        message: message,
        details: error.response?.data || error
    };
};

// Success handling
const handleSuccess = (data, message = 'Operation completed successfully') => {
    return {
        success: true,
        message: message,
        data: data
    };
};

// Export all utilities
window.ToolsyUtils = {
    API_BASE_URL,
    formatFileSize,
    isValidFileType,
    getClientSidePageCount,
    getPageCountFromBackend,
    uploadFileWithProgress,
    downloadFile,
    isZipFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    debounce,
    saveToLocalStorage,
    getFromLocalStorage,
    handleError,
    handleSuccess
};