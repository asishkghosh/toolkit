// Image Tool Page Component - Modular Image Tools Implementation
const ImageToolPage = ({ tool, onBack }) => {
    const [selectedFiles, setSelectedFiles] = React.useState([]);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [result, setResult] = React.useState(null);
    const [error, setError] = React.useState(null);
    
    // Image-specific states
    const [resizeWidth, setResizeWidth] = React.useState('');
    const [resizeHeight, setResizeHeight] = React.useState('');
    const [resizePercentage, setResizePercentage] = React.useState('');
    const [resizeType, setResizeType] = React.useState('pixels'); // 'pixels' or 'percentage'
    const [maintainAspectRatio, setMaintainAspectRatio] = React.useState(true);
    const [originalDimensions, setOriginalDimensions] = React.useState(null);
    const [compressionQuality, setCompressionQuality] = React.useState(85);
    
    // Tool configuration mapping (handle both hyphenated and non-hyphenated names)
    const getToolKey = (toolName) => {
        const toolMapping = {
            'resize-image': 'resize',
            'resize': 'resize',
            'compress-image': 'compress', 
            'compress': 'compress',
            'crop-image': 'crop',
            'crop': 'crop'
        };
        return toolMapping[toolName] || toolName;
    };
    
    const actualTool = getToolKey(tool);
    
    // Image Tool configurations
    const toolConfig = {
        'resize': {
            title: 'Resize Image', description: 'Change image dimensions while maintaining aspect ratio',
            icon: ToolsyComponents.ResizeIcon, acceptedTypes: '.jpg,.jpeg,.png,.bmp,.tiff,.webp', multiple: false, endpoint: '/image/resize',
            instructions: ['Select an image to resize', 'Choose new dimensions', 'Download your resized image']
        },
        'compress': {
            title: 'Compress Image', description: 'Advanced lossless compression with intelligent format optimization',
            icon: ToolsyComponents.ImageCompressIcon, acceptedTypes: '.jpg,.jpeg,.png,.bmp,.tiff,.webp', multiple: false, endpoint: '/image/compress',
            instructions: ['Select an image to compress', 'Configure compression settings', 'Download your optimally compressed image']
        },
        'crop': {
            title: 'Crop Image', description: 'Remove unwanted parts of your image',
            icon: ToolsyComponents.CropIcon, acceptedTypes: '.jpg,.jpeg,.png,.bmp,.tiff,.webp', multiple: false, endpoint: '/image/crop',
            instructions: ['Select an image to crop', 'Define crop area', 'Download your cropped image']
        }
    };

    const config = toolConfig[actualTool] || { title: 'Unknown Tool', description: 'Tool not found', icon: () => React.createElement('div'), acceptedTypes: '', multiple: false, endpoint: '', instructions: [] };

    // Get image dimensions
    const getImageDimensions = (file) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => {
                resolve(null);
            };
            img.src = URL.createObjectURL(file);
        });
    };
    
    // Get file format from filename
    const getFileFormat = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        const formatMap = {
            'jpg': 'JPEG', 'jpeg': 'JPEG', 'png': 'PNG', 'webp': 'WebP',
            'bmp': 'BMP', 'tiff': 'TIFF', 'tif': 'TIFF'
        };
        return formatMap[extension] || extension.toUpperCase();
    };

    // Handle file selection
    const handleFilesSelected = async (files) => {
        if (config.multiple) {
            setSelectedFiles([...selectedFiles, ...files]);
        } else {
            setSelectedFiles(files);
            
            // Get image dimensions for resize tool
            if (actualTool === 'resize' && files.length > 0) {
                const dimensions = await getImageDimensions(files[0]);
                setOriginalDimensions(dimensions);
            }
        }
        setError(null);
        setResult(null);
    };

    // Remove file from selection
    const removeFile = (index) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        
        if (actualTool === 'resize') {
            setOriginalDimensions(null);
            setResizeWidth('');
            setResizeHeight('');
            setResizePercentage('');
        }
    };

    // Calculate dimensions maintaining aspect ratio
    const calculateAspectRatio = (width, height, newWidth, newHeight) => {
        if (!originalDimensions) return { width: newWidth, height: newHeight };
        
        const aspectRatio = originalDimensions.width / originalDimensions.height;
        
        if (newWidth && !newHeight) {
            return { width: newWidth, height: Math.round(newWidth / aspectRatio) };
        } else if (!newWidth && newHeight) {
            return { width: Math.round(newHeight * aspectRatio), height: newHeight };
        }
        
        return { width: newWidth, height: newHeight };
    };

    // Handle width change with aspect ratio
    const handleWidthChange = (value) => {
        setResizeWidth(value);
        if (maintainAspectRatio && value && originalDimensions) {
            const newHeight = Math.round(value / (originalDimensions.width / originalDimensions.height));
            setResizeHeight(newHeight.toString());
        }
    };

    // Handle height change with aspect ratio
    const handleHeightChange = (value) => {
        setResizeHeight(value);
        if (maintainAspectRatio && value && originalDimensions) {
            const newWidth = Math.round(value * (originalDimensions.width / originalDimensions.height));
            setResizeWidth(newWidth.toString());
        }
    };

    // Handle percentage change
    const handlePercentageChange = (value) => {
        setResizePercentage(value);
        if (value && originalDimensions) {
            const scale = value / 100;
            const newWidth = Math.round(originalDimensions.width * scale);
            const newHeight = Math.round(originalDimensions.height * scale);
            setResizeWidth(newWidth.toString());
            setResizeHeight(newHeight.toString());
        }
    };

    // Process files
    const processFiles = async () => {
        if (selectedFiles.length === 0) return;
        
        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFiles[0]);
            
            // Add tool-specific parameters
            if (actualTool === 'resize') {
                if (resizeType === 'percentage' && resizePercentage) {
                    formData.append('resize_type', 'percentage');
                    formData.append('percentage', resizePercentage);
                } else if (resizeType === 'pixels') {
                    formData.append('resize_type', 'pixels');
                    if (resizeWidth) formData.append('width', resizeWidth);
                    if (resizeHeight) formData.append('height', resizeHeight);
                }
                formData.append('maintain_aspect_ratio', maintainAspectRatio.toString());
            } else if (actualTool === 'compress') {
                formData.append('quality', compressionQuality.toString());
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
            
            setResult({ blob, filename, size: blob.size, isZip: false });

        } catch (err) {
            console.error('Processing failed:', err);
            setError(err.response?.data?.detail || 'An error occurred while processing your image.');
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
        const defaults = { 
            'resize': 'resized_image.jpg', 
            'compress': 'compressed_image.jpg', 
            'crop': 'cropped_image.jpg' 
        };
        return defaults[actualTool] || 'processed_image.jpg';
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
        setResizeWidth('');
        setResizeHeight('');
        setResizePercentage('');
        setResizeType('pixels');
        setMaintainAspectRatio(true);
        setOriginalDimensions(null);
        setCompressionQuality(85);
    };

    return React.createElement('div', { className: "min-h-screen bg-gray-50" }, [
        // Header Section
        React.createElement('div', { key: 'header', className: "bg-gradient-to-br from-blue-50 to-blue-100 border-b border-gray-200" }, [
            React.createElement('div', { key: 'header-container', className: "container mx-auto px-4 py-8" }, [
                React.createElement('button', { key: 'back-button', onClick: onBack, className: "inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors group" }, [
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

        // Main Content - 2-column layout
        React.createElement('div', { key: 'main-content', className: "container mx-auto px-4 py-8" }, [
            React.createElement('div', { key: 'main-grid', className: "grid grid-cols-1 lg:grid-cols-2 gap-8" }, [
                // Left Column - Upload and Options
                React.createElement('div', { key: 'left-column', className: "space-y-6" }, [
                    // Step 1: File Upload
                    React.createElement('div', { key: 'upload-section', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
                        React.createElement('div', { key: 'upload-header', className: "flex items-center space-x-3 mb-6" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-blue-600 font-semibold text-sm" }, '1')
                            ]),
                            React.createElement('h2', { key: 'upload-title', className: "text-lg font-semibold text-gray-800" }, 'Select Image')
                        ]),
                        
                        selectedFiles.length === 0 ? React.createElement(ToolsyComponents.FileUploadArea, {
                            key: 'upload-area', onFilesSelected: handleFilesSelected, acceptedTypes: config.acceptedTypes, multiple: false
                        }) : React.createElement('div', { key: 'selected-files', className: "space-y-3" }, [
                            React.createElement('h3', { key: 'files-title', className: "font-medium text-gray-800 mb-3" }, 'Selected Image:'),
                            React.createElement('div', { key: 'file-0', className: "file-item" }, [
                                React.createElement('div', { key: 'file-icon', className: "file-icon" }, selectedFiles[0].name.split('.').pop().toUpperCase()),
                                React.createElement('div', { key: 'file-info', className: "flex-1 min-w-0" }, [
                                    React.createElement('p', { key: 'file-name', className: "font-medium text-gray-800 truncate" }, selectedFiles[0].name),
                                    React.createElement('p', { key: 'file-size', className: "text-sm text-gray-500" }, ToolsyUtils.formatFileSize(selectedFiles[0].size))
                                ]),
                                React.createElement('button', { key: 'remove-button', onClick: () => removeFile(0), className: "text-red-500 hover:text-red-700 p-1" }, [
                                    React.createElement('svg', { key: 'remove-icon', className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                        React.createElement('path', { key: 'remove-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
                                    ])
                                ])
                            ])
                        ])
                    ]),

                    // Tool-specific options
                    selectedFiles.length > 0 && React.createElement('div', { key: 'tool-options', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
                        React.createElement('div', { key: 'options-header', className: "flex items-center space-x-3 mb-6" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-blue-600 font-semibold text-sm" }, '2')
                            ]),
                            React.createElement('h2', { key: 'options-title', className: "text-lg font-semibold text-gray-800" }, 'Options')
                        ]),

                        // Resize options
                        actualTool === 'resize' && React.createElement('div', { key: 'resize-options', className: "space-y-6" }, [
                            // Original image dimensions display
                            originalDimensions && React.createElement('div', { key: 'original-dims', className: "p-4 bg-blue-50 border border-blue-200 rounded-lg" }, [
                                React.createElement('div', { key: 'dims-content', className: "flex items-center space-x-2" }, [
                                    React.createElement('svg', { key: 'dims-icon', className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                        React.createElement('path', { key: 'dims-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" })
                                    ]),
                                    React.createElement('span', { key: 'dims-text', className: "font-medium text-blue-800" }, `Original: ${originalDimensions.width} × ${originalDimensions.height} pixels`)
                                ])
                            ]),
                            
                            // Resize type selection
                            React.createElement('div', { key: 'resize-type', className: "space-y-3" }, [
                                React.createElement('h3', { key: 'type-title', className: "text-lg font-medium text-gray-800" }, 'Resize Method'),
                                
                                // Pixels option
                                React.createElement('div', { key: 'pixels-option', className: "flex items-start space-x-3" }, [
                                    React.createElement('input', {
                                        key: 'pixels-radio',
                                        type: 'radio',
                                        id: 'resize-pixels',
                                        name: 'resizeType',
                                        value: 'pixels',
                                        checked: resizeType === 'pixels',
                                        onChange: () => setResizeType('pixels'),
                                        className: 'mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                                    }),
                                    React.createElement('label', { key: 'pixels-label', htmlFor: 'resize-pixels', className: "flex-1 cursor-pointer" }, [
                                        React.createElement('div', { key: 'pixels-title', className: "font-medium text-gray-800" }, 'Specific Dimensions (Pixels)'),
                                        React.createElement('div', { key: 'pixels-desc', className: "text-sm text-gray-600" }, 'Set exact width and height in pixels')
                                    ])
                                ]),
                                
                                // Percentage option
                                React.createElement('div', { key: 'percentage-option', className: "flex items-start space-x-3" }, [
                                    React.createElement('input', {
                                        key: 'percentage-radio',
                                        type: 'radio',
                                        id: 'resize-percentage',
                                        name: 'resizeType',
                                        value: 'percentage',
                                        checked: resizeType === 'percentage',
                                        onChange: () => setResizeType('percentage'),
                                        className: 'mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                                    }),
                                    React.createElement('label', { key: 'percentage-label', htmlFor: 'resize-percentage', className: "flex-1 cursor-pointer" }, [
                                        React.createElement('div', { key: 'percentage-title', className: "font-medium text-gray-800" }, 'Scale by Percentage'),
                                        React.createElement('div', { key: 'percentage-desc', className: "text-sm text-gray-600" }, 'Resize proportionally by percentage')
                                    ])
                                ])
                            ]),
                            
                            // Aspect ratio checkbox
                            React.createElement('div', { key: 'aspect-ratio', className: "flex items-center space-x-3" }, [
                                React.createElement('input', {
                                    key: 'aspect-checkbox',
                                    type: 'checkbox',
                                    id: 'maintain-aspect-ratio',
                                    checked: maintainAspectRatio,
                                    onChange: (e) => setMaintainAspectRatio(e.target.checked),
                                    className: 'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
                                    disabled: resizeType === 'percentage'
                                }),
                                React.createElement('label', { key: 'aspect-label', htmlFor: 'maintain-aspect-ratio', className: "flex-1 cursor-pointer" }, [
                                    React.createElement('div', { key: 'aspect-title', className: "font-medium text-gray-800" }, 'Maintain Aspect Ratio'),
                                    React.createElement('div', { key: 'aspect-desc', className: "text-sm text-gray-600" }, resizeType === 'percentage' ? 'Automatically maintained for percentage scaling' : 'Prevent image distortion by keeping original proportions')
                                ])
                            ]),
                            
                            // Percentage input
                            resizeType === 'percentage' && React.createElement('div', { key: 'percentage-input', className: "space-y-3" }, [
                                React.createElement('div', { key: 'percentage-field' }, [
                                    React.createElement('label', { key: 'percentage-label', className: "block text-sm font-medium text-gray-700 mb-2" }, 'Scale Percentage'),
                                    React.createElement('input', {
                                        key: 'percentage-input-field',
                                        type: 'number',
                                        value: resizePercentage,
                                        onChange: (e) => handlePercentageChange(e.target.value),
                                        min: '1',
                                        max: '500',
                                        className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                        placeholder: '100'
                                    }),
                                    React.createElement('p', { key: 'percentage-note', className: "text-xs text-gray-500 mt-1" }, 'Enter percentage (e.g., 50 for half size, 200 for double size)')
                                ]),
                                
                                // Preview dimensions for percentage
                                resizePercentage && originalDimensions && React.createElement('div', { key: 'percentage-preview', className: "p-3 bg-green-50 border border-green-200 rounded-lg" }, [
                                    React.createElement('div', { key: 'preview-content', className: "text-sm text-green-800" }, [
                                        React.createElement('div', { key: 'preview-title', className: "font-medium mb-1" }, 'New Dimensions:'),
                                        React.createElement('div', { key: 'preview-dims' }, `${Math.round(originalDimensions.width * resizePercentage / 100)} × ${Math.round(originalDimensions.height * resizePercentage / 100)} pixels`)
                                    ])
                                ])
                            ]),
                            
                            // Pixel inputs
                            resizeType === 'pixels' && React.createElement('div', { key: 'pixel-inputs', className: "space-y-4" }, [
                                React.createElement('div', { key: 'pixel-fields', className: "grid grid-cols-2 gap-4" }, [
                                    React.createElement('div', { key: 'width-input' }, [
                                        React.createElement('label', { key: 'width-label', className: "block text-sm font-medium text-gray-700 mb-2" }, 'Width (px)'),
                                        React.createElement('input', {
                                            key: 'width-field',
                                            type: 'number',
                                            value: resizeWidth,
                                            onChange: (e) => handleWidthChange(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                            placeholder: maintainAspectRatio ? 'Auto calculated' : 'Enter width'
                                        })
                                    ]),
                                    React.createElement('div', { key: 'height-input' }, [
                                        React.createElement('label', { key: 'height-label', className: "block text-sm font-medium text-gray-700 mb-2" }, 'Height (px)'),
                                        React.createElement('input', {
                                            key: 'height-field',
                                            type: 'number',
                                            value: resizeHeight,
                                            onChange: (e) => handleHeightChange(e.target.value),
                                            className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                                            placeholder: maintainAspectRatio ? 'Auto calculated' : 'Enter height'
                                        })
                                    ])
                                ]),
                                
                                React.createElement('p', { key: 'pixel-note', className: "text-xs text-gray-500" }, 
                                    maintainAspectRatio ? 
                                    'Enter either width or height - the other will be calculated automatically to maintain aspect ratio' :
                                    'Enter both width and height for exact dimensions (may distort image)'
                                )
                            ])
                        ]),

                        // Compression options
                        actualTool === 'compress' && React.createElement('div', { key: 'compress-options', className: "space-y-6" }, [
                            // Algorithm info
                            React.createElement('div', { key: 'algorithm-info', className: "p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg" }, [
                                React.createElement('div', { key: 'algorithm-header', className: "flex items-center space-x-2 mb-2" }, [
                                    React.createElement('svg', { key: 'algorithm-icon', className: "w-5 h-5 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                        React.createElement('path', { key: 'algorithm-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })
                                    ]),
                                    React.createElement('h3', { key: 'algorithm-title', className: "font-semibold text-green-800" }, 'Advanced Compression Algorithm')
                                ]),
                                React.createElement('p', { key: 'algorithm-desc', className: "text-sm text-green-700 mb-2" }, 'Our intelligent compression engine automatically tests multiple formats and selects the best result:'),
                                React.createElement('ul', { key: 'algorithm-list', className: "text-xs text-green-600 space-y-1 ml-4" }, [
                                    React.createElement('li', { key: 'alg1' }, '• PNG with maximum compression (lossless)'),
                                    React.createElement('li', { key: 'alg2' }, '• WebP lossless compression'),
                                    React.createElement('li', { key: 'alg3' }, '• TIFF with LZW compression'),
                                    React.createElement('li', { key: 'alg4' }, '• Optimized JPEG (when quality < 100%)'),
                                    React.createElement('li', { key: 'alg5' }, '• Automatic metadata removal & palette optimization')
                                ])
                            ]),
                            
                            // Quality settings
                            React.createElement('div', { key: 'quality-section', className: "space-y-4" }, [
                                React.createElement('h3', { key: 'quality-title', className: "text-lg font-medium text-gray-800" }, 'Compression Settings'),
                                
                                React.createElement('div', { key: 'quality-input' }, [
                                    React.createElement('label', { key: 'quality-label', className: "block text-sm font-medium text-gray-700 mb-2" }, 
                                        compressionQuality === 100 ? 'Quality: 100% (Lossless Only)' : `Quality: ${compressionQuality}% (Allows Some Loss)`
                                    ),
                                    React.createElement('input', {
                                        key: 'quality-slider',
                                        type: 'range',
                                        min: '10',
                                        max: '100',
                                        value: compressionQuality,
                                        onChange: (e) => setCompressionQuality(parseInt(e.target.value)),
                                        className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    }),
                                    React.createElement('div', { key: 'quality-labels', className: "flex justify-between text-xs text-gray-500 mt-1" }, [
                                        React.createElement('span', { key: 'min' }, 'Smaller file'),
                                        React.createElement('span', { key: 'max' }, 'Highest quality')
                                    ])
                                ]),
                                
                                // Quality explanation
                                React.createElement('div', { key: 'quality-explanation', className: `p-3 rounded-lg border ${
                                    compressionQuality === 100 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'
                                }` }, [
                                    React.createElement('div', { key: 'explanation-content', className: "flex items-start space-x-2" }, [
                                        React.createElement('svg', { 
                                            key: 'explanation-icon', 
                                            className: `w-4 h-4 mt-0.5 ${
                                                compressionQuality === 100 ? 'text-blue-600' : 'text-orange-600'
                                            }`, 
                                            fill: "none", 
                                            stroke: "currentColor", 
                                            viewBox: "0 0 24 24" 
                                        }, [
                                            React.createElement('path', { 
                                                key: 'explanation-path', 
                                                strokeLinecap: "round", 
                                                strokeLinejoin: "round", 
                                                strokeWidth: 2, 
                                                d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                            })
                                        ]),
                                        React.createElement('div', { key: 'explanation-text', className: "flex-1" }, [
                                            React.createElement('p', { 
                                                key: 'explanation-main', 
                                                className: `text-sm font-medium ${
                                                    compressionQuality === 100 ? 'text-blue-800' : 'text-orange-800'
                                                }` 
                                            }, compressionQuality === 100 ? 
                                                'Lossless Compression Mode' : 
                                                'Balanced Compression Mode'
                                            ),
                                            React.createElement('p', { 
                                                key: 'explanation-detail', 
                                                className: `text-xs ${
                                                    compressionQuality === 100 ? 'text-blue-700' : 'text-orange-700'
                                                }` 
                                            }, compressionQuality === 100 ? 
                                                'Only lossless formats (PNG, WebP, TIFF) will be used. Maximum quality preserved.' :
                                                'Includes optimized JPEG option for better compression ratios when beneficial.'
                                            )
                                        ])
                                    ])
                                ]),
                                
                                // Expected outcome
                                selectedFiles.length > 0 && React.createElement('div', { key: 'expected-outcome', className: "p-3 bg-gray-50 border border-gray-200 rounded-lg" }, [
                                    React.createElement('div', { key: 'outcome-content', className: "flex items-center space-x-2" }, [
                                        React.createElement('svg', { key: 'outcome-icon', className: "w-4 h-4 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                            React.createElement('path', { key: 'outcome-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" })
                                        ]),
                                        React.createElement('div', { key: 'outcome-text', className: "text-sm text-gray-700" }, [
                                            React.createElement('span', { key: 'outcome-label', className: "font-medium" }, 'Original size: '),
                                            React.createElement('span', { key: 'outcome-size' }, ToolsyUtils.formatFileSize(selectedFiles[0].size)),
                                            React.createElement('span', { key: 'outcome-note', className: "text-gray-500 ml-2" }, '→ Algorithm will find optimal compression')
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),

                // Right Column - Process and Download
                React.createElement('div', { key: 'right-column', className: "space-y-6" }, [
                    // Process Section
                    React.createElement('div', { key: 'process-modal', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
                        React.createElement('div', { key: 'process-header', className: "flex items-center space-x-3 mb-6" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-blue-600 font-semibold text-sm" }, '3')
                            ]),
                            React.createElement('h2', { key: 'process-title', className: "text-lg font-semibold text-gray-800" }, 'Process Image')
                        ]),
                        
                        isProcessing ? React.createElement('div', { key: 'processing', className: "space-y-4" }, [
                            React.createElement('div', { key: 'progress-section', className: "bg-blue-50 border border-blue-200 rounded-lg p-4" }, [
                                React.createElement('div', { key: 'progress-header', className: "flex items-center space-x-2 mb-3" }, [
                                    React.createElement('div', { key: 'spinner', className: "w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }),
                                    React.createElement('span', { key: 'progress-text', className: "text-sm font-medium text-blue-800" }, `Processing... ${progress}%`)
                                ]),
                                React.createElement('div', { key: 'progress-container', className: "progress-container" }, [
                                    React.createElement('div', { 
                                        key: 'progress-bar', 
                                        className: "progress-bar", 
                                        style: { width: `${progress}%`, background: '#2563eb' } 
                                    })
                                ]),
                                React.createElement('p', { key: 'processing-message', className: "text-xs text-blue-700 mt-2" }, 'Please wait while we process your image...')
                            ])
                        ]) : React.createElement('button', {
                            key: 'process-button', 
                            onClick: processFiles, 
                            disabled: selectedFiles.length === 0,
                            className: `btn-primary w-full py-3 text-sm ${selectedFiles.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`
                        }, 'Process Image')
                    ]),

                    // Download Section
                    React.createElement('div', { key: 'download-section', className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6" }, [
                        React.createElement('div', { key: 'download-header', className: "flex items-center space-x-3 mb-4" }, [
                            React.createElement('div', { key: 'step-number', className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" }, [
                                React.createElement('span', { key: 'number', className: "text-blue-600 font-semibold text-sm" }, '4')
                            ]),
                            React.createElement('h3', { key: 'download-title', className: "text-lg font-semibold text-gray-800" }, 'Download Results')
                        ]),
                        
                        // Progress bar
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
                                        background: error ? '#ef4444' : '#2563eb'
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
                                React.createElement('button', { key: 'process-another', onClick: resetForm, className: "px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors" }, 'Process Another')
                            ])
                        ]) : React.createElement('div', { key: 'waiting-message', className: "text-center py-4" }, [
                            React.createElement('svg', { key: 'waiting-icon', className: "w-8 h-8 text-gray-400 mx-auto mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
                                React.createElement('path', { key: 'waiting-path', strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" })
                            ]),
                            React.createElement('p', { key: 'waiting-text', className: "text-sm text-gray-500" }, 'Upload and process image to see results here')
                        ])
                    ])
                ])
            ])
        ])
    ]);
};

// Export for global use
window.ImageToolPage = ImageToolPage;