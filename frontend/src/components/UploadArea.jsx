import React, { useState, useRef } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

const UploadArea = ({ 
  onFileSelect, 
  acceptedTypes = ".pdf,.doc,.docx", 
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  title = "Upload your files",
  subtitle = "Drag & drop files here or click to browse"
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    const acceptedExtensions = acceptedTypes.split(',').map(type => type.trim());
    
    if (!acceptedExtensions.includes(fileExtension)) {
      return `File type not supported. Accepted types: ${acceptedTypes}`;
    }

    return null;
  };

  const handleFiles = (files) => {
    setError('');
    const fileArray = Array.from(files);
    const validFiles = [];
    
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setError(error);
        return;
      }
      validFiles.push(file);
    }

    if (!multiple && validFiles.length > 1) {
      setError('Please select only one file');
      return;
    }

    setSelectedFiles(validFiles);
    onFileSelect(multiple ? validFiles : validFiles[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect(multiple ? newFiles : null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`upload-area p-8 text-center cursor-pointer ${
          isDragOver ? 'border-teal-500 bg-teal-100' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`h-12 w-12 ${isDragOver ? 'text-teal-600' : 'text-teal-500'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{subtitle}</p>
          </div>

          <div className="text-xs text-gray-500">
            <p>Supported formats: {acceptedTypes.replace(/\./g, '').toUpperCase()}</p>
            <p>Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB</p>
          </div>

          <button className="btn-primary inline-flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Choose Files</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-800">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {Math.round(file.size / 1024)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadArea;