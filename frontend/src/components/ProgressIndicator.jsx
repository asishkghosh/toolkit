import React from 'react';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ProgressIndicator = ({ 
  progress = 0, 
  status = 'idle', // 'idle', 'uploading', 'processing', 'complete', 'error'
  message = '',
  className = ''
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <Loader className="h-6 w-6 text-teal-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    if (message) return message;
    
    switch (status) {
      case 'uploading':
        return 'Uploading files...';
      case 'processing':
        return 'Processing your files...';
      case 'complete':
        return 'Processing complete!';
      case 'error':
        return 'An error occurred during processing';
      default:
        return '';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gradient-teal';
    }
  };

  if (status === 'idle') return null;

  return (
    <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
      {/* Status Icon and Message */}
      <div className="flex items-center space-x-3 mb-4">
        {getStatusIcon()}
        <span className="font-medium text-gray-800">
          {getStatusMessage()}
        </span>
      </div>

      {/* Progress Bar */}
      {(status === 'uploading' || status === 'processing') && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`progress-bar h-2 ${getProgressColor()}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{Math.round(progress)}% complete</span>
            <span>Please wait...</span>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {status === 'complete' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            Your files have been processed successfully. You can now download the result.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">
            There was an error processing your files. Please try again or contact support if the issue persists.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;