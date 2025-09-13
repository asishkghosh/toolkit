// Generic Tool Page Component - Restored Original Design + Enhancements
const ToolPage = ({ tool, onBack }) => {
    const [selectedFiles, setSelectedFiles] = React.useState([]);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [result, setResult] = React.useState(null);
    const [error, setError] = React.useState(null);
    
    // Split PDF specific states
    const [splitMode, setSplitMode] = React.useState('all-pages');
    const [splitPageNumber, setSplitPageNumber] = React.useState(null);
    const [totalPages, setTotalPages] = React.useState(null);
    const [isLoadingPages, setIsLoadingPages] = React.useState(false);
    
    // Tool configurations
    const toolConfig = {
        'merge': {
            title: 'Merge PDFs', description: 'Combine multiple PDF files into one document',
            icon: ToolsyComponents.MergeIcon, acceptedTypes: '.pdf', multiple: true, endpoint: '/merge',
            instructions: ['Select multiple PDF files to merge', 'Files will be combined in the order selected', 'Download your merged PDF file']
        },
        'split': {
            title: 'Split PDF', description: 'Split a PDF into multiple files or extract pages',
            icon: ToolsyComponents.SplitIcon, acceptedTypes: '.pdf', multiple: false, endpoint: '/split',
            instructions: ['Select a PDF file to split', 'Choose your split options', 'Download the split files']
        },
        'compress': {
            title: 'Compress PDF', description: 'Reduce PDF file size while maintaining quality',
            icon: ToolsyComponents.PDFCompressIcon, acceptedTypes: '.pdf', multiple: false, endpoint: '/compress',
            instructions: ['Select a PDF file to compress', 'Processing will optimize file size', 'Download your compressed PDF']
        },
        'pdf-to-word': {
            title: 'PDF to Word', description: 'Convert PDF documents to editable Word files',
            icon: ToolsyComponents.PDFToWordIcon, acceptedTypes: '.pdf', multiple: false, endpoint: '/pdf-to-word',
            instructions: ['Select a PDF file to convert', 'Processing will extract text and formatting', 'Download your Word document']
        },
        'word-to-pdf': {
            title: 'Word to PDF', description: 'Convert Word documents to PDF format',
            icon: ToolsyComponents.WordToPDFIcon, acceptedTypes: '.doc,.docx', multiple: false, endpoint: '/word-to-pdf',
            instructions: ['Select a Word document to convert', 'Processing will preserve formatting', 'Download your PDF file']
        }
    };

    const config = toolConfig[tool] || { title: 'Unknown Tool', description: 'Tool not found', icon: () => React.createElement('div'), acceptedTypes: '', multiple: false, endpoint: '', instructions: [] };

    // Get PDF page count for split tool
    React.useEffect(() => {
        if (tool === 'split' && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            setIsLoadingPages(true);
            
            // Use backend for reliable page counting
            getPageCountFromBackend(file)
                .then(count => {
                    console.log(`PDF Analysis for ${file.name}: ${count} pages`);
                    setTotalPages(count);
                })
                .catch(error => {
                    console.error('Backend page count failed, trying client-side parsing:', error);
                    // Fallback to simplified client-side parsing
                    tryClientSidePageCount(file);
                })
                .finally(() => {
                    setIsLoadingPages(false);
                });
        }
    }, [selectedFiles, tool]);

    // Helper function to get page count from backend
    const getPageCountFromBackend = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await axios.post(`${ToolsyUtils.API_BASE_URL}/get-page-count`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            return response.data.page_count || 1;
        } catch (error) {
            console.error('Backend page count failed:', error);
            throw error;
        }
    };

    // Simplified client-side fallback method
    const tryClientSidePageCount = (file) => {
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
                console.log(`Client-side analysis for ${file.name}: ${pageCount} pages`);
                setTotalPages(pageCount);
                
            } catch (error) {
                console.error('Client-side parsing failed:', error);
                setTotalPages(1); // Final fallback
            }
        };
        
        reader.onerror = () => {
            console.error('File reading failed');
            setTotalPages(1);
        };
        
        reader.readAsArrayBuffer(file);
    };

    // Handle file selection
    const handleFilesSelected = (files) => {
        if (config.multiple) {
            setSelectedFiles([...selectedFiles, ...files]);
        } else {
            setSelectedFiles(files);
        }
        setError(null);
        setResult(null);
    };

    // Remove file from selection
    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
    };

    // Process files
    const processFiles = async () => {
        if (selectedFiles.length === 0) return;
        
        // For split tool, validate split parameters
        if (tool === 'split' && splitMode === 'custom-page' && !splitPageNumber) {
            setError('Please specify a page number to split at.');
            return;
        }
        
        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            
            if (config.multiple) {
                selectedFiles.forEach((file) => formData.append('files', file));
            } else {
                formData.append('file', selectedFiles[0]);
            }
            
            // Add split options for Split PDF
            if (tool === 'split') {
                formData.append('split_mode', splitMode);
                if (splitMode === 'custom-page' && splitPageNumber) {
                    formData.append('split_page', splitPageNumber.toString());
                }
            }

            const response = await axios.post(`${ToolsyUtils.API_BASE_URL}${config.endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob',
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });
            
            const blob = response.data;
            const filename = getDownloadFilename(response);
            
            // Show result immediately
            setResult({ blob, filename, size: blob.size, isZip: ToolsyUtils.isZipFile(response) });

        } catch (err) {
            console.error('Processing failed:', err);
            setError(err.response?.data?.detail || 'An error occurred while processing your files.');
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    // Get download filename from response
    const getDownloadFilename = (response) => {
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) return filenameMatch[1];
        }
        const defaults = { 'merge': 'merged_document.pdf', 'split': 'split_files.zip', 'compress': 'compressed_document.pdf', 'pdf-to-word': 'converted_document.docx', 'word-to-pdf': 'converted_document.pdf' };
        return defaults[tool] || 'processed_file';
    };

    // Download result
    const downloadResult = () => {
        if (result) ToolsyUtils.downloadFile(result.blob, result.filename);
    };

    // Reset form
    const resetForm = () => {
        setSelectedFiles([]);
        setResult(null);
        setError(null);
        setProgress(0);
        setSplitMode('all-pages');
        setSplitPageNumber(null);
        setTotalPages(null);
        setIsLoadingPages(false);
    };

    return React.createElement('div', { className: "min-h-screen bg-gray-50" }, [
        // Header Section
        React.createElement('div', { key: 'header', className: "bg-gradient-to-br from-teal-50 to-teal-100 border-b border-gray-200" }, [
            React.createElement('div', { key: 'header-container', className: "container mx-auto px-4 py-8" }, [
                React.createElement('button', { key: 'back-button', onClick: onBack, className: "inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-6 transition-colors group" }, [
                    React.createElement('svg', { key: 'back-icon', className: "w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                        React.createElement('path', { key: 'back-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" })
                    ]),
                    'Back to Tools'
                ]),
                React.createElement('div', { key: 'header-content', className: "flex items-start space-x-6" }, [
                    React.createElement('div', { key: 'icon-container', className: "flex-shrink-0" }, [
                        React.createElement('div', { key: 'icon-wrapper', className: "w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center" }, [
                            React.createElement(config.icon, { key: 'tool-icon' })
                        ])
                    ]),
                    React.createElement('div', { key: 'text-content', className: "flex-1" }, [
                        React.createElement('h1', { key: 'title', className: "text-2xl md:text-3xl font-bold text-gray-800 mb-2" }, config.title),
                        React.createElement('p', { key: 'description', className: "text-lg text-gray-600 mb-4" }, config.description),
                        React.createElement('div', { key: 'accepted-formats', className: "text-sm text-gray-500" }, `Accepted formats: ${config.acceptedTypes}`)
                    ])
                ])
            ])
        ]),

        // Completion Loading Screen
        // Removed - now using inline loading bar

        // Main Content - 2-column layout
        React.createElement('div', { key: 'main-content', className: "container mx-auto px-4 py-8" }, [
            React.createElement('div', { key: 'main-grid', className: "grid grid-cols-1 lg:grid-cols-2 gap-8" }, [
                // Left Column - Upload and Process
                React.createElement('div', { key: 'left-column', className: "space-y-6" }, [
                    // Step 1: File Upload
                    React.createElement('div', { key: 'upload-section', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
                        React.createElement('div', { key: 'upload-header', className: "flex items-center space-x-3 mb-6" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-teal-600 font-semibold text-sm" }, '1')
                            ]),
                            React.createElement('h2', { key: 'upload-title', className: "text-lg font-semibold text-gray-800" }, `Select ${config.multiple ? 'Files' : 'File'}`)
                        ]),
                        
                        selectedFiles.length === 0 ? React.createElement(ToolsyComponents.FileUploadArea, {
                            key: 'upload-area', onFilesSelected: handleFilesSelected, acceptedTypes: config.acceptedTypes, multiple: config.multiple
                        }) : React.createElement('div', { key: 'selected-files', className: "space-y-3" }, [
                            React.createElement('h3', { key: 'files-title', className: "font-medium text-gray-800 mb-3" }, `Selected ${config.multiple ? 'Files' : 'File'}:`),
                            
                            ...selectedFiles.map((file, index) => 
                                React.createElement('div', { key: `file-${index}`, className: "file-item" }, [
                                    React.createElement('div', { key: 'file-icon', className: "file-icon" }, file.name.split('.').pop().toUpperCase()),
                                    React.createElement('div', { key: 'file-info', className: "flex-1 min-w-0" }, [
                                        React.createElement('p', { key: 'file-name', className: "font-medium text-gray-800 truncate" }, file.name),
                                        React.createElement('p', { key: 'file-size', className: "text-sm text-gray-500" }, ToolsyUtils.formatFileSize(file.size))
                                    ]),
                                    React.createElement('button', { key: 'remove-button', onClick: () => removeFile(index), className: "text-red-500 hover:text-red-700 p-1" }, [
                                        React.createElement('svg', { key: 'remove-icon', className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                            React.createElement('path', { key: 'remove-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
                                        ])
                                    ])
                                ])
                            ),
                            
                            config.multiple && React.createElement('button', { 
                                key: 'add-more', 
                                onClick: () => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = config.acceptedTypes;
                                    input.multiple = true;
                                    input.onchange = (e) => {
                                        const newFiles = Array.from(e.target.files);
                                        if (newFiles.length > 0) {
                                            handleFilesSelected(newFiles);
                                        }
                                    };
                                    input.click();
                                }, 
                                className: "w-full py-3 border-2 border-dashed border-teal-300 rounded-lg text-teal-600 hover:border-teal-400 hover:bg-teal-50 transition-colors" 
                            }, '+ Add More Files')
                        ])
                    ]),

                    // Split PDF Options - Always visible for Split PDF tool, but disabled when no files
                    tool === 'split' && React.createElement('div', { key: 'split-options', className: `bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${selectedFiles.length === 0 ? 'opacity-60' : ''}` }, [
                        React.createElement('div', { key: 'split-header', className: "flex items-center space-x-3 mb-6" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-blue-600 font-semibold text-sm" }, '2')
                            ]),
                            React.createElement('h2', { key: 'split-title', className: "text-lg font-semibold text-gray-800" }, 'Split Options')
                        ]),

                        selectedFiles.length === 0 && React.createElement('div', { key: 'upload-first-message', className: "mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center" }, [
                            React.createElement('svg', { key: 'upload-icon', className: "w-8 h-8 text-gray-400 mx-auto mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                React.createElement('path', { key: 'upload-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" })
                            ]),
                            React.createElement('p', { key: 'upload-message', className: "text-sm text-gray-600" }, 'Please upload a PDF file first to see split options')
                        ]),

                        // Page Count Display - show placeholder when no files
                        React.createElement('div', { key: 'page-count', className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg" }, [
                            React.createElement('div', { key: 'page-count-content', className: "flex items-center space-x-2" }, [
                                React.createElement('svg', { key: 'page-icon', className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                    React.createElement('path', { key: 'page-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })
                                ]),
                                selectedFiles.length === 0 ? React.createElement('span', { key: 'no-file', className: "font-medium text-blue-800" }, 'No file selected') :
                                isLoadingPages ? React.createElement('div', { key: 'loading', className: "flex items-center space-x-2" }, [
                                    React.createElement('svg', { key: 'spinner', className: "w-4 h-4 text-blue-600 animate-spin", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                        React.createElement('path', { key: 'spinner-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" })
                                    ]),
                                    React.createElement('span', { key: 'loading-text', className: "font-medium text-blue-800" }, 'Reading PDF pages...')
                                ]) : totalPages ? React.createElement('span', { key: 'page-count-text', className: "font-medium text-blue-800" }, `Document has ${totalPages} page${totalPages !== 1 ? 's' : ''}`) : React.createElement('span', { key: 'no-count', className: "font-medium text-blue-800" }, 'Unable to determine page count')
                            ])
                        ]),

                        // Split Mode Options - always shown but disabled when no files
                        React.createElement('div', { key: 'split-modes', className: "space-y-4" }, [
                            React.createElement('h3', { key: 'mode-title', className: "text-base font-medium text-gray-800 mb-3" }, 'Choose Split Method'),
                            
                            // All Pages Option
                            React.createElement('div', { key: 'all-pages-option', className: "flex items-start space-x-3" }, [
                                React.createElement('input', {
                                    key: 'all-pages-radio',
                                    type: 'radio',
                                    id: 'all-pages',
                                    name: 'splitMode',
                                    value: 'all-pages',
                                    checked: splitMode === 'all-pages',
                                    disabled: selectedFiles.length === 0,
                                    onChange: () => selectedFiles.length > 0 && setSplitMode('all-pages'),
                                    className: "mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                }),
                                React.createElement('label', { key: 'all-pages-label', htmlFor: 'all-pages', className: `flex-1 ${selectedFiles.length === 0 ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}` }, [
                                    React.createElement('div', { key: 'all-pages-title', className: "font-medium text-gray-800" }, 'Split into individual pages'),
                                    React.createElement('div', { key: 'all-pages-desc', className: "text-sm text-gray-600" }, 'Each page becomes a separate PDF file')
                                ])
                            ]),

                            // Custom Page Option
                            React.createElement('div', { key: 'custom-page-option', className: "flex items-start space-x-3" }, [
                                React.createElement('input', {
                                    key: 'custom-page-radio',
                                    type: 'radio',
                                    id: 'custom-page',
                                    name: 'splitMode',
                                    value: 'custom-page',
                                    checked: splitMode === 'custom-page',
                                    disabled: selectedFiles.length === 0,
                                    onChange: () => selectedFiles.length > 0 && setSplitMode('custom-page'),
                                    className: "mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                }),
                                React.createElement('label', { key: 'custom-page-label', htmlFor: 'custom-page', className: `flex-1 ${selectedFiles.length === 0 ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}` }, [
                                    React.createElement('div', { key: 'custom-page-title', className: "font-medium text-gray-800" }, 'Split at specific page'),
                                    React.createElement('div', { key: 'custom-page-desc', className: "text-sm text-gray-600" }, 'Split document into two parts at the selected page')
                                ])
                            ]),

                            // Page Number Input - always shown but disabled
                            splitMode === 'custom-page' && React.createElement('div', { key: 'page-input', className: "ml-7 mt-3" }, [
                                React.createElement('div', { key: 'input-row', className: "flex items-center space-x-3" }, [
                                    React.createElement('label', { key: 'input-label', htmlFor: 'pageNumber', className: "text-sm font-medium text-gray-700" }, 'Split after page:'),
                                    React.createElement('input', {
                                        key: 'page-number-input',
                                        type: 'number',
                                        id: 'pageNumber',
                                        value: splitPageNumber || '',
                                        disabled: selectedFiles.length === 0,
                                        onChange: (e) => selectedFiles.length > 0 && setSplitPageNumber(e.target.value ? parseInt(e.target.value) : null),
                                        min: '1',
                                        max: totalPages ? totalPages - 1 : undefined,
                                        className: "w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100",
                                        placeholder: selectedFiles.length === 0 ? '-' : '1'
                                    }),
                                    totalPages && selectedFiles.length > 0 && React.createElement('span', { key: 'range-hint', className: "text-sm text-gray-500" }, `(1 to ${totalPages - 1})`)
                                ]),
                                splitPageNumber && totalPages && selectedFiles.length > 0 && React.createElement('div', { key: 'split-preview', className: "mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg" }, [
                                    React.createElement('div', { key: 'preview-content', className: "text-sm text-teal-800" }, [
                                        React.createElement('div', { key: 'preview-title', className: "font-medium mb-1" }, 'Result:'),
                                        React.createElement('div', { key: 'first-part' }, `• First part: Pages 1-${splitPageNumber} (${splitPageNumber} pages)`),
                                        React.createElement('div', { key: 'second-part' }, `• Second part: Pages ${parseInt(splitPageNumber) + 1}-${totalPages} (${totalPages - parseInt(splitPageNumber)} pages)`)
                                    ])
                                ])
                            ])
                        ])
                    ]),


                ]),

                // Right Column - Process Modal and Download Section
                React.createElement('div', { key: 'right-column', className: "space-y-6" }, [
                    // Process Section - Always visible on the right
                    React.createElement('div', { key: 'process-modal', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
                        React.createElement('div', { key: 'process-header', className: "flex items-center space-x-3 mb-6" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-teal-600 font-semibold text-sm" }, tool === 'split' ? '3' : '2')
                            ]),
                            React.createElement('h2', { key: 'process-title', className: "text-lg font-semibold text-gray-800" }, 'Process Files')
                        ]),
                        
                        isProcessing ? React.createElement('div', { key: 'processing', className: "space-y-4" }, [
                            React.createElement('div', { key: 'progress-section', className: "bg-teal-50 border border-teal-200 rounded-lg p-4" }, [
                                React.createElement('div', { key: 'progress-header', className: "flex items-center space-x-2 mb-3" }, [
                                    React.createElement('div', { key: 'spinner', className: "w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" }),
                                    React.createElement('span', { key: 'progress-text', className: "text-sm font-medium text-teal-800" }, `Processing... ${progress}%`)
                                ]),
                                React.createElement('div', { key: 'progress-container', className: "progress-container" }, [
                                    React.createElement('div', { 
                                        key: 'progress-bar', 
                                        className: "progress-bar", 
                                        style: { width: `${progress}%` } 
                                    })
                                ]),
                                React.createElement('p', { key: 'processing-message', className: "text-xs text-teal-700 mt-2" }, 'Please wait while we process your files...')
                            ])
                        ]) : React.createElement('button', {
                            key: 'process-button', 
                            onClick: processFiles, 
                            disabled: selectedFiles.length === 0 || (tool === 'split' && splitMode === 'custom-page' && !splitPageNumber),
                            className: `btn-primary w-full py-3 text-sm ${(selectedFiles.length === 0 || (tool === 'split' && splitMode === 'custom-page' && !splitPageNumber)) ? 'opacity-50 cursor-not-allowed' : ''}`
                        }, `Process ${config.multiple ? 'Files' : 'File'}`)
                    ]),

                    // Download Section - Below process section in right column
                    React.createElement('div', { key: 'download-section', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
                        React.createElement('div', { key: 'download-header', className: "flex items-center space-x-3 mb-4" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-teal-600 font-semibold text-sm" }, tool === 'split' ? '4' : '3')
                            ]),
                            React.createElement('h3', { key: 'download-title', className: "text-lg font-semibold text-gray-800" }, 'Download Results')
                        ]),
                        
                        // Always visible animated progress bar
                        React.createElement('div', { key: 'permanent-progress', className: "mb-4" }, [
                            React.createElement('div', { key: 'progress-label', className: "flex justify-between items-center mb-2" }, [
                                React.createElement('span', { key: 'status-text', className: "text-sm font-medium text-gray-700" }, 
                                    (result || error) ? 'Completed' : 'Waiting for processing...'
                                ),
                                React.createElement('span', { key: 'percentage', className: "text-sm text-gray-500" }, 
                                    (result || error) ? '100%' : '0%'
                                )
                            ]),
                            React.createElement('div', { key: 'progress-container', className: "progress-container" }, [
                                React.createElement('div', { 
                                    key: 'progress-bar', 
                                    className: "progress-bar", 
                                    style: { 
                                        width: (result || error) ? '100%' : '0%',
                                        background: error ? '#ef4444' : '#14b8a6'
                                    } 
                                })
                            ])
                        ]),
                        
                        error ? React.createElement('div', { key: 'error-message', className: "status-error" }, [
                            React.createElement('p', { key: 'error-text', className: "font-medium mb-2" }, 'Processing Failed'),
                            React.createElement('p', { key: 'error-details', className: "text-sm" }, error),
                            React.createElement('button', { key: 'try-again', onClick: resetForm, className: "mt-3 text-sm text-red-700 hover:text-red-800 font-medium" }, 'Try Again')
                        ]) : result ? React.createElement('div', { key: 'success-message', className: "status-success" }, [
                            React.createElement('p', { key: 'success-text', className: "font-medium mb-2" }, 'Processing Complete!'),
                            React.createElement('p', { key: 'file-info', className: "text-sm mb-3" }, `File: ${result.filename} (${ToolsyUtils.formatFileSize(result.size)})`),
                            React.createElement('div', { key: 'action-buttons', className: "flex space-x-3" }, [
                                React.createElement('button', { key: 'download-button', onClick: downloadResult, className: "btn-primary" }, [
                                    React.createElement('svg', { key: 'download-icon', className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                        React.createElement('path', { key: 'download-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })
                                    ]),
                                    'Download'
                                ]),
                                React.createElement('button', { key: 'process-another', onClick: resetForm, className: "px-4 py-2 text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50 transition-colors" }, 'Process Another')
                            ])
                        ]) : React.createElement('div', { key: 'waiting-message', className: "text-center py-4" }, [
                            React.createElement('svg', { key: 'waiting-icon', className: "w-8 h-8 text-gray-400 mx-auto mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                React.createElement('path', { key: 'waiting-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" })
                            ]),
                            React.createElement('p', { key: 'waiting-text', className: "text-sm text-gray-500" }, 'Upload and process files to see results here')
                        ])
                    ])
                ])
            ]),



            // How It Works Section - Always shown below the main interface
            React.createElement('div', { key: 'how-it-works-section', className: "mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8" }, [
                React.createElement('div', { key: 'how-it-works-header', className: "text-center mb-8" }, [
                    React.createElement('h2', { key: 'how-it-works-title', className: "text-xl font-bold text-gray-800 mb-3" }, 'How It Works'),
                    React.createElement('p', { key: 'how-it-works-subtitle', className: "text-sm text-gray-600" }, `Learn how our ${config.title.toLowerCase()} process works behind the scenes`)
                ]),

                React.createElement('div', { key: 'how-it-works-steps', className: "grid grid-cols-1 md:grid-cols-3 gap-8" }, [
                    // Step 1 - Secure Upload
                    React.createElement('div', { key: 'step-1', className: "text-center" }, [
                        React.createElement('div', { key: 'step-1-icon', className: "w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4" }, [
                            React.createElement('svg', { key: 'upload-icon', className: "w-6 h-6 text-teal-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                React.createElement('path', { key: 'upload-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" })
                            ])
                        ]),
                        React.createElement('h3', { key: 'step-1-title', className: "text-base font-semibold text-gray-800 mb-2" }, 'Secure Upload'),
                        React.createElement('p', { key: 'step-1-desc', className: "text-gray-600 text-xs" }, 'Your files are securely uploaded to our servers using encrypted connections. No data is stored permanently.')
                    ]),

                    // Step 2 - Advanced Processing
                    React.createElement('div', { key: 'step-2', className: "text-center" }, [
                        React.createElement('div', { key: 'step-2-icon', className: "w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4" }, [
                            React.createElement('svg', { key: 'process-icon', className: "w-6 h-6 text-teal-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                React.createElement('path', { key: 'process-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
                                React.createElement('path', { key: 'process-path-2', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
                            ])
                        ]),
                        React.createElement('h3', { key: 'step-2-title', className: "text-base font-semibold text-gray-800 mb-2" }, 'Advanced Processing'),
                        React.createElement('p', { key: 'step-2-desc', className: "text-gray-600 text-xs" }, 'Our optimized algorithms process your files using industry-standard libraries and techniques for the best quality results.')
                    ]),

                    // Step 3 - Instant Download
                    React.createElement('div', { key: 'step-3', className: "text-center" }, [
                        React.createElement('div', { key: 'step-3-icon', className: "w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4" }, [
                            React.createElement('svg', { key: 'download-icon', className: "w-6 h-6 text-teal-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                React.createElement('path', { key: 'download-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })
                            ])
                        ]),
                        React.createElement('h3', { key: 'step-3-title', className: "text-base font-semibold text-gray-800 mb-2" }, 'Instant Download'),
                        React.createElement('p', { key: 'step-3-desc', className: "text-gray-600 text-xs" }, 'Download your processed file instantly. All files are automatically deleted from our servers within 1 hour for your privacy.')
                    ])
                ])
            ])
        ])
    ]);
};

// Export for global use
window.ToolPage = ToolPage;