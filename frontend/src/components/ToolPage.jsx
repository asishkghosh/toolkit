import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import UploadArea from '../components/UploadArea';
import ProgressIndicator from '../components/ProgressIndicator';
import { processFile } from '../utils/api';

const ToolPage = ({ 
  title, 
  description, 
  icon: Icon, 
  acceptedTypes = ".pdf", 
  multiple = false,
  endpoint 
}) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  const handleFileSelect = (files) => {
    setSelectedFiles(files);
    setProcessedFile(null);
    setError('');
    setStatus('idle');
    setProgress(0);
  };

  const handleProcess = async () => {
    if (!selectedFiles) return;

    setIsProcessing(true);
    setStatus('uploading');
    setProgress(10);

    try {
      // Simulate upload progress
      setProgress(30);
      setStatus('processing');
      
      // Call API
      const result = await processFile(endpoint, selectedFiles);
      
      setProgress(100);
      setStatus('complete');
      setProcessedFile(result);
      setError('');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'An error occurred during processing');
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedFile) {
      const a = document.createElement('a');
      a.href = processedFile.url;
      a.download = processedFile.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    setSelectedFiles(null);
    setProcessedFile(null);
    setError('');
    setStatus('idle');
    setProgress(0);
    setIsProcessing(false);
  };

  const canProcess = selectedFiles && !isProcessing && status !== 'complete';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Link>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Icon className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {multiple ? 'Select Files' : 'Select File'}
              </h2>
              <UploadArea
                onFileSelect={handleFileSelect}
                acceptedTypes={acceptedTypes}
                multiple={multiple}
                title={multiple ? "Upload your files" : "Upload your file"}
                subtitle={multiple ? "Select multiple files to process" : "Select a file to process"}
              />
            </div>

            {/* Process Button */}
            {selectedFiles && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleProcess}
                    disabled={!canProcess}
                    className={`btn-primary flex-1 ${
                      !canProcess ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Process ${multiple ? 'Files' : 'File'}`
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="btn-secondary"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status and Download Section */}
          <div className="space-y-6">
            {/* Progress Indicator */}
            <ProgressIndicator
              progress={progress}
              status={status}
              message={error}
            />

            {/* Download Section */}
            {processedFile && status === 'complete' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Download Result
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">
                          {processedFile.filename}
                        </p>
                        <p className="text-sm text-green-600">
                          Ready for download
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleDownload}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tool Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                How it works
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </div>
                  <p>Upload your {multiple ? 'files' : 'file'} using the upload area above</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </div>
                  <p>Click the process button to start the operation</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </div>
                  <p>Download your processed file once complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPage;