// PDF Tool Page Component - Modular PDF Tools Implementation
const PDFToolPage = ({ tool, onBack }) => {
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

    // Move file up in the list (for merge tool)
    const moveFileUp = (index) => {
        if (index > 0) {
            const newFiles = [...selectedFiles];
            [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
            setSelectedFiles(newFiles);
        }
    };

    // Move file down in the list (for merge tool)
    const moveFileDown = (index) => {
        if (index < selectedFiles.length - 1) {
            const newFiles = [...selectedFiles];
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
            setSelectedFiles(newFiles);
        }
    };

    // Process files
    const processFiles = async () => {
        if (selectedFiles.length === 0) return;
        
        // For merge tool, validate minimum 2 files
        if (tool === 'merge' && selectedFiles.length < 2) {
            setError('Please select at least 2 PDF files to merge.');
            return;
        }
        
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
                    // Upload progress takes up to 80% of the bar
                    const uploadPercent = Math.round((progressEvent.loaded * 80) / progressEvent.total);
                    setProgress(uploadPercent);
                },
                onDownloadProgress: (progressEvent) => {
                    // Download/processing progress from 80% to 95%
                    if (progressEvent.total) {
                        const downloadPercent = 80 + Math.round((progressEvent.loaded * 15) / progressEvent.total);
                        setProgress(downloadPercent);
                    } else {
                        // If total is unknown, just show processing
                        setProgress(85);
                    }
                }
            });
            
            // Show final processing step (95% to 100%)
            setProgress(95);
            await new Promise(resolve => setTimeout(resolve, 200)); // Small delay for visual feedback
            
            const blob = response.data;
            const filename = getDownloadFilename(response);
            
            // Show result immediately
            setResult({ blob, filename, size: blob.size, isZip: ToolsyUtils.isZipFile(response) });
            setProgress(100); // Ensure progress shows 100% on completion

        } catch (err) {
            console.error('Processing failed:', err);
            setError(err.response?.data?.detail || 'An error occurred while processing your files.');
            setProgress(100); // Show 100% even on error to indicate completion
        } finally {
            setIsProcessing(false);
            // Don't reset progress to 0 here - keep it at 100% to show completion
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

    // Main render - simplified version with essential structure
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

        // Main Content 
        React.createElement('div', { key: 'main-content', className: "container mx-auto px-4 py-8" }, [
            React.createElement('div', { key: 'main-grid', className: "grid grid-cols-1 lg:grid-cols-2 gap-8" }, [
                // Left Column - Upload and Process
                React.createElement('div', { key: 'left-column', className: "space-y-6" }, [
                    // File Upload Section
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
                            React.createElement('h3', { key: 'files-title', className: "font-medium text-gray-800 mb-3" }, `Selected ${config.multiple ? 'Files' : 'File'}:${config.multiple ? ` (${selectedFiles.length} files)` : ''}`),
                            
                            ...selectedFiles.map((file, index) => 
                                React.createElement('div', { key: `file-${index}`, className: "file-item" }, [
                                    // Order number for merge tool
                                    config.multiple ? React.createElement('div', { key: 'order-number', className: "w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3 flex-shrink-0" }, index + 1) : null,
                                    
                                    React.createElement('div', { key: 'file-icon', className: "file-icon" }, file.name.split('.').pop().toUpperCase()),
                                    React.createElement('div', { key: 'file-info', className: "flex-1 min-w-0" }, [
                                        React.createElement('p', { key: 'file-name', className: "font-medium text-gray-800 truncate" }, file.name),
                                        React.createElement('p', { key: 'file-size', className: "text-sm text-gray-500" }, ToolsyUtils.formatFileSize(file.size))
                                    ]),
                                    
                                    // Reorder buttons for merge tool
                                    config.multiple ? React.createElement('div', { key: 'reorder-buttons', className: "flex flex-col space-y-1 mr-2" }, [
                                        React.createElement('button', {
                                            key: 'move-up',
                                            onClick: () => moveFileUp(index),
                                            disabled: index === 0,
                                            className: `p-1 text-gray-400 hover:text-teal-600 transition-colors ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`
                                        }, [
                                            React.createElement('svg', { key: 'up-icon', className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                                React.createElement('path', { key: 'up-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 15l7-7 7 7" })
                                            ])
                                        ]),
                                        React.createElement('button', {
                                            key: 'move-down',
                                            onClick: () => moveFileDown(index),
                                            disabled: index === selectedFiles.length - 1,
                                            className: `p-1 text-gray-400 hover:text-teal-600 transition-colors ${index === selectedFiles.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`
                                        }, [
                                            React.createElement('svg', { key: 'down-icon', className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                                React.createElement('path', { key: 'down-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
                                            ])
                                        ])
                                    ]) : null,
                                    
                                    React.createElement('button', { key: 'remove-button', onClick: () => removeFile(index), className: "text-red-500 hover:text-red-700 p-1" }, [
                                        React.createElement('svg', { key: 'remove-icon', className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                            React.createElement('path', { key: 'remove-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
                                        ])
                                    ])
                                ])
                            ),
                            
                            // Add More Files button for merge tool
                            config.multiple ? React.createElement('button', {
                                key: 'add-more-files',
                                onClick: () => document.getElementById('additional-file-input').click(),
                                className: "w-full mt-3 py-3 px-4 border-2 border-dashed border-teal-300 text-teal-600 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                            }, [
                                React.createElement('svg', { key: 'add-icon', className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                    React.createElement('path', { key: 'add-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" })
                                ]),
                                React.createElement('span', { key: 'add-text' }, 'Add More Files')
                            ]) : null,
                            
                            // Hidden input for additional files
                            config.multiple ? React.createElement('input', {
                                key: 'additional-file-input',
                                id: 'additional-file-input',
                                type: 'file',
                                accept: config.acceptedTypes,
                                multiple: true,
                                onChange: (e) => {
                                    const newFiles = Array.from(e.target.files);
                                    if (newFiles.length > 0) {
                                        handleFilesSelected(newFiles);
                                    }
                                    e.target.value = ''; // Reset input to allow selecting same files again
                                },
                                style: { display: 'none' }
                            }) : null
                        ])
                    ]),
                    
                    // Split Options Section (only for split tool)
                    tool === 'split' ? React.createElement('div', { key: 'split-options-section', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
                        React.createElement('div', { key: 'split-header', className: "flex items-center space-x-3 mb-6" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-blue-600 font-semibold text-sm" }, '2')
                            ]),
                            React.createElement('h2', { key: 'split-title', className: "text-lg font-semibold text-gray-800" }, 'Split Options')
                        ]),
                        
                        // Page Count Display
                        React.createElement('div', { key: 'page-count-display', className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg" }, [
                            React.createElement('div', { key: 'page-count-content', className: "flex items-center space-x-2" }, [
                                React.createElement('svg', { key: 'page-icon', className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                    React.createElement('path', { key: 'page-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })
                                ]),
                                selectedFiles.length === 0 ? React.createElement('span', { key: 'no-file-text', className: "font-medium text-blue-800" }, 'Select a PDF file to see page count') : isLoadingPages ? React.createElement('div', { key: 'loading-pages', className: "flex items-center space-x-2" }, [
                                    React.createElement('svg', { key: 'loading-icon', className: "w-4 h-4 text-blue-600 animate-spin", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                        React.createElement('path', { key: 'loading-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" })
                                    ]),
                                    React.createElement('span', { key: 'loading-text', className: "font-medium text-blue-800" }, 'Reading PDF pages...')
                                ]) : totalPages ? React.createElement('span', { key: 'page-count-text', className: "font-medium text-blue-800" }, `Document has ${totalPages} page${totalPages !== 1 ? 's' : ''}`) : React.createElement('span', { key: 'unknown-pages', className: "font-medium text-blue-800" }, 'Unable to determine page count')
                            ])
                        ]),
                        
                        // Split Mode Options
                        React.createElement('div', { key: 'split-modes', className: "space-y-4" }, [
                            React.createElement('h3', { key: 'modes-title', className: "text-lg font-medium text-gray-800 mb-3" }, 'Choose Split Method'),
                            
                            // All Pages Option
                            React.createElement('div', { key: 'all-pages-option', className: "flex items-start space-x-3" }, [
                                React.createElement('input', {
                                    key: 'all-pages-radio',
                                    type: 'radio',
                                    id: 'all-pages',
                                    name: 'splitMode',
                                    value: 'all-pages',
                                    checked: splitMode === 'all-pages',
                                    onChange: () => setSplitMode('all-pages'),
                                    className: 'mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500'
                                }),
                                React.createElement('label', { key: 'all-pages-label', htmlFor: 'all-pages', className: "flex-1 cursor-pointer" }, [
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
                                    onChange: () => setSplitMode('custom-page'),
                                    className: 'mt-1 w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500'
                                }),
                                React.createElement('label', { key: 'custom-page-label', htmlFor: 'custom-page', className: "flex-1 cursor-pointer" }, [
                                    React.createElement('div', { key: 'custom-page-title', className: "font-medium text-gray-800" }, 'Split at specific page'),
                                    React.createElement('div', { key: 'custom-page-desc', className: "text-sm text-gray-600" }, 'Split document into two parts at the selected page')
                                ])
                            ]),
                            
                            // Page Number Input
                            splitMode === 'custom-page' ? React.createElement('div', { key: 'page-number-input', className: "ml-7 mt-3" }, [
                                React.createElement('div', { key: 'input-container', className: "flex items-center space-x-3" }, [
                                    React.createElement('label', { key: 'input-label', htmlFor: 'pageNumber', className: "text-sm font-medium text-gray-700" }, 'Split after page:'),
                                    React.createElement('input', {
                                        key: 'page-input',
                                        type: 'number',
                                        id: 'pageNumber',
                                        value: splitPageNumber || '',
                                        onChange: (e) => setSplitPageNumber(e.target.value ? parseInt(e.target.value) : null),
                                        min: '1',
                                        max: totalPages ? totalPages - 1 : undefined,
                                        disabled: selectedFiles.length === 0,
                                        className: `w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${selectedFiles.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`,
                                        placeholder: selectedFiles.length === 0 ? 'Select file first' : '1'
                                    }),
                                    totalPages && selectedFiles.length > 0 ? React.createElement('span', { key: 'page-range', className: "text-sm text-gray-500" }, `(1 to ${totalPages - 1})`) : selectedFiles.length === 0 ? React.createElement('span', { key: 'no-file-range', className: "text-sm text-gray-400" }, '(select file first)') : null
                                ]),
                                splitPageNumber && totalPages && selectedFiles.length > 0 ? React.createElement('div', { key: 'split-preview', className: "mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg" }, [
                                    React.createElement('div', { key: 'preview-content', className: "text-sm text-teal-800" }, [
                                        React.createElement('div', { key: 'preview-title', className: "font-medium mb-1" }, 'Result:'),
                                        React.createElement('div', { key: 'part-1' }, `• First part: Pages 1-${splitPageNumber} (${splitPageNumber} pages)`),
                                        React.createElement('div', { key: 'part-2' }, `• Second part: Pages ${parseInt(splitPageNumber) + 1}-${totalPages} (${totalPages - parseInt(splitPageNumber)} pages)`)
                                    ])
                                ]) : null
                            ]) : null
                        ])
                    ]) : null
                ]),

                // Right Column - Process and Download
                React.createElement('div', { key: 'right-column', className: "space-y-6" }, [
                    // Process Section
                    React.createElement('div', { key: 'process-section', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
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
                                ])
                            ])
                        ]) : React.createElement('button', {
                            key: 'process-button', 
                            onClick: processFiles, 
                            disabled: selectedFiles.length === 0,
                            className: `btn-primary w-full py-3 text-sm ${selectedFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`
                        }, `Process ${config.multiple ? 'Files' : 'File'}`)
                    ]),

                    // Download Section
                    React.createElement('div', { key: 'download-section', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
                        React.createElement('div', { key: 'download-header', className: "flex items-center space-x-3 mb-4" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-teal-600 font-semibold text-sm" }, tool === 'split' ? '4' : '3')
                            ]),
                            React.createElement('h3', { key: 'download-title', className: "text-lg font-semibold text-gray-800" }, 'Download Results')
                        ]),
                        
                        // Progress Bar - Always visible
                        React.createElement('div', { key: 'progress-section', className: "mb-6" }, [
                            React.createElement('div', { key: 'progress-label', className: "flex justify-between items-center mb-2" }, [
                                React.createElement('span', { key: 'progress-message', className: "text-sm font-medium text-gray-700" }, 
                                    isProcessing ? 'Processing...' : 
                                    result ? 'Completed!' : 
                                    error ? 'Failed' : 'Ready to process'
                                ),
                                React.createElement('span', { key: 'progress-percentage', className: "text-sm text-gray-500" }, `${progress}%`)
                            ]),
                            React.createElement('div', { key: 'progress-container', className: "progress-container" }, [
                                React.createElement('div', { 
                                    key: 'progress-bar', 
                                    className: `progress-bar ${result ? 'bg-green-500' : error ? 'bg-red-500' : ''}`, 
                                    style: { 
                                        width: result ? '100%' : error ? '100%' : `${progress}%`,
                                        backgroundColor: result ? '#10b981' : error ? '#ef4444' : undefined
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
            ])
        ])
    ]);
};

// Export for global use
window.PDFToolPage = PDFToolPage;