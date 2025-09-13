// Toolsy - Shared Components

// Modern Toolsy Logo Component
const ToolsyLogo = ({ size = "large" }) => {
    const dimensions = size === "large" ? "w-10 h-10" : "w-8 h-8";
    const textSize = size === "large" ? "text-2xl" : "text-xl";
    
    return React.createElement('div', {
        className: "flex items-center space-x-3 group"
    }, [
        React.createElement('div', {
            key: 'logo-icon',
            className: `${dimensions} bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden`
        }, [
            // Background Pattern
            React.createElement('div', {
                key: 'bg-pattern',
                className: "absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
            }),
            
            // Main Logo Elements
            React.createElement('div', {
                key: 'main-elements',
                className: "relative h-full flex items-center justify-center"
            }, [
                // Tool Icons Arranged in Grid
                React.createElement('div', {
                    key: 'icon-grid',
                    className: "grid grid-cols-2 gap-0.5 w-6 h-6"
                }, [
                    // Top Left - PDF Icon
                    React.createElement('div', {
                        key: 'pdf-icon',
                        className: "bg-white/90 rounded-sm flex items-center justify-center"
                    }, [
                        React.createElement('div', {
                            key: 'pdf-inner',
                            className: "w-2 h-2.5 bg-teal-600 rounded-sm relative"
                        }, [
                            React.createElement('div', {
                                key: 'pdf-dot',
                                className: "absolute top-0 right-0 w-0.5 h-0.5 bg-white"
                            })
                        ])
                    ]),
                    
                    // Top Right - Image Icon
                    React.createElement('div', {
                        key: 'image-icon',
                        className: "bg-white/90 rounded-sm flex items-center justify-center"
                    }, [
                        React.createElement('div', {
                            key: 'image-inner',
                            className: "w-2 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm"
                        })
                    ]),
                    
                    // Bottom Left - AI Icon
                    React.createElement('div', {
                        key: 'ai-icon',
                        className: "bg-white/90 rounded-sm flex items-center justify-center"
                    }, [
                        React.createElement('div', {
                            key: 'ai-inner',
                            className: "w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                        })
                    ]),
                    
                    // Bottom Right - Settings Icon
                    React.createElement('div', {
                        key: 'settings-icon',
                        className: "bg-white/90 rounded-sm flex items-center justify-center"
                    }, [
                        React.createElement('div', {
                            key: 'settings-outer',
                            className: "w-1.5 h-1.5 border border-gray-600 rounded-full relative"
                        }, [
                            React.createElement('div', {
                                key: 'settings-inner',
                                className: "absolute inset-0.5 bg-gray-600 rounded-full"
                            })
                        ])
                    ])
                ])
            ]),
            
            // Shine Effect
            React.createElement('div', {
                key: 'shine',
                className: "absolute -top-1 -right-1 w-3 h-3 bg-white/40 rounded-full blur-sm group-hover:animate-pulse"
            })
        ]),
        
        React.createElement('span', {
            key: 'logo-text',
            className: `${textSize} font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-300`
        }, [
            'Tool',
            React.createElement('span', {
                key: 'sy',
                className: "text-teal-600"
            }, 'sy')
        ])
    ]);
};

// Header Component with Navigation
const Header = ({ currentPage, onPageChange }) => React.createElement('header', {
    className: "bg-white shadow-sm border-b border-gray-100"
}, [
    React.createElement('div', {
        key: 'container',
        className: "container mx-auto px-4 py-4"
    }, [
        React.createElement('div', {
            key: 'flex-container',
            className: "flex items-center justify-between"
        }, [
            React.createElement('button', {
                key: 'logo-button',
                onClick: () => onPageChange('home'),
                className: "hover:scale-105 transition-transform duration-200"
            }, [
                React.createElement(ToolsyLogo, { key: 'logo', size: "large" })
            ]),
            
            React.createElement('nav', {
                key: 'navigation',
                className: "hidden md:flex items-center space-x-8"
            }, [
                React.createElement('button', {
                    key: 'home-nav',
                    onClick: () => onPageChange('home'),
                    className: `font-medium transition-colors ${currentPage === 'home' ? 'text-teal-600 border-b-2 border-teal-600 pb-1' : 'text-gray-600 hover:text-teal-600'}`
                }, 'Home'),
                React.createElement('button', {
                    key: 'tools-nav',
                    onClick: () => onPageChange('tools'),
                    className: `font-medium transition-colors ${currentPage === 'tools' ? 'text-teal-600 border-b-2 border-teal-600 pb-1' : 'text-gray-600 hover:text-teal-600'}`
                }, 'Tools'),
                React.createElement('button', {
                    key: 'about-nav',
                    onClick: () => onPageChange('about'),
                    className: `font-medium transition-colors ${currentPage === 'about' ? 'text-teal-600 border-b-2 border-teal-600 pb-1' : 'text-gray-600 hover:text-teal-600'}`
                }, 'About'),
                React.createElement('span', {
                    key: 'contact-nav',
                    className: "text-gray-600 hover:text-teal-600 font-medium transition-colors cursor-pointer"
                }, 'Contact')
            ])
        ])
    ])
]);

// Tool Icons Components
const MergeIcon = () => React.createElement('svg', {
    className: "w-8 h-8 text-teal-600",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
}, [
    React.createElement('path', {
        key: 'merge-path',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
    })
]);

const SplitIcon = () => React.createElement('svg', {
    className: "w-8 h-8 text-teal-600",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
}, [
    React.createElement('path', {
        key: 'split-path',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M4 7h16M4 17h16M8 3v4m8-4v4M8 17v4m8-4v4"
    })
]);

const PDFCompressIcon = () => React.createElement('svg', {
    className: "w-8 h-8 text-teal-600",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
}, [
    React.createElement('path', {
        key: 'compress-path1',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    }),
    React.createElement('path', {
        key: 'compress-path2',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M13 16l-4-4 4-4"
    }),
    React.createElement('path', {
        key: 'compress-path3',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M11 16l4-4-4-4"
    })
]);

const PDFToWordIcon = () => React.createElement('svg', {
    className: "w-8 h-8 text-teal-600",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
}, [
    React.createElement('path', {
        key: 'pdf2word-path1',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    }),
    React.createElement('path', {
        key: 'pdf2word-path2',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M17 8l4 4-4 4"
    })
]);

const WordToPDFIcon = () => React.createElement('svg', {
    className: "w-8 h-8 text-teal-600",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
}, [
    React.createElement('path', {
        key: 'word2pdf-path',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    })
]);

// Image Tool Icons
const ResizeIcon = () => React.createElement('svg', {
    className: "w-8 h-8 text-teal-600",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
}, [
    React.createElement('path', {
        key: 'resize-path',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
    })
]);

const ImageCompressIcon = () => React.createElement('svg', {
    className: "w-8 h-8 text-teal-600",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
}, [
    React.createElement('path', {
        key: 'image-compress-path1',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    }),
    React.createElement('path', {
        key: 'image-compress-path2',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M13 16l-4-4 4-4m0 8l4-4-4-4"
    })
]);

const ConvertIcon = () => React.createElement('svg', {
    className: "w-8 h-8 text-teal-600",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
}, [
    React.createElement('path', {
        key: 'convert-path1',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    }),
    React.createElement('path', {
        key: 'convert-path2',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M17 8l4 4-4 4"
    })
]);

const CropIcon = () => React.createElement('svg', {
    className: "w-8 h-8 text-teal-600",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24"
}, [
    React.createElement('path', {
        key: 'crop-path',
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M3 3l6 6m0 0V5a2 2 0 012-2h4m-6 4h10a2 2 0 012 2v10m0 0l-6-6m6 6v-4a2 2 0 00-2-2H9"
    })
]);

// Enhanced Tool Card Component for Tools Page
const EnhancedToolCard = ({ icon: Icon, title, description, category, onClick }) => React.createElement('div', {
    className: "card p-6 h-full group cursor-pointer",
    onClick: onClick
}, [
    React.createElement('div', {
        key: 'card-content',
        className: "relative h-full flex flex-col"
    }, [
        React.createElement('div', {
            key: 'category-badge',
            className: "absolute top-0 right-0 -mt-2 -mr-2"
        }, [
            React.createElement('span', {
                key: 'badge',
                className: "bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full"
            }, category)
        ]),
        
        // Icon
        React.createElement('div', {
            key: 'icon-container',
            className: "flex items-center justify-center w-16 h-16 bg-teal-50 rounded-lg mb-4 group-hover:bg-teal-100 transition-colors"
        }, [
            React.createElement(Icon, { key: 'icon' })
        ]),
        
        // Content
        React.createElement('div', {
            key: 'text-content',
            className: "flex-1 space-y-3"
        }, [
            React.createElement('h3', {
                key: 'title',
                className: "text-lg font-semibold text-gray-800 group-hover:text-teal-600 transition-colors"
            }, title),
            React.createElement('p', {
                key: 'description',
                className: "text-gray-600 text-sm leading-relaxed"
            }, description)
        ]),
        
        // CTA
        React.createElement('div', {
            key: 'cta',
            className: "flex items-center mt-4 text-teal-600 font-medium group-hover:text-teal-700"
        }, [
            React.createElement('span', {
                key: 'cta-text',
                className: "text-sm"
            }, 'Try it now'),
            React.createElement('svg', {
                key: 'arrow',
                className: "w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
            }, [
                React.createElement('path', {
                    key: 'arrow-path',
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M9 5l7 7-7 7"
                })
            ])
        ])
    ])
]);

// Progress Indicator Component
const ProgressIndicator = ({ progress, message }) => React.createElement('div', {
    className: "w-full"
}, [
    React.createElement('div', {
        key: 'progress-label',
        className: "flex justify-between items-center mb-2"
    }, [
        React.createElement('span', {
            key: 'message',
            className: "text-sm font-medium text-gray-700"
        }, message || 'Processing...'),
        React.createElement('span', {
            key: 'percentage',
            className: "text-sm text-gray-500"
        }, `${progress}%`)
    ]),
    React.createElement('div', {
        key: 'progress-bar-container',
        className: "progress-container"
    }, [
        React.createElement('div', {
            key: 'progress-bar',
            className: "progress-bar",
            style: { width: `${progress}%` }
        })
    ])
]);

// File Upload Component
const FileUploadArea = ({ onFilesSelected, acceptedTypes, multiple = false, children }) => {
    const [isDragOver, setIsDragOver] = React.useState(false);
    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };
    
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter(file => 
            ToolsyUtils.isValidFileType(file, acceptedTypes)
        );
        
        if (validFiles.length > 0) {
            onFilesSelected(multiple ? validFiles : [validFiles[0]]);
        }
    };
    
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        onFilesSelected(multiple ? files : [files[0]]);
    };
    
    return React.createElement('div', {
        className: `upload-area ${isDragOver ? 'dragover' : ''}`,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        onClick: () => document.getElementById('file-input').click()
    }, [
        React.createElement('input', {
            key: 'file-input',
            id: 'file-input',
            type: 'file',
            accept: acceptedTypes,
            multiple: multiple,
            onChange: handleFileSelect,
            style: { display: 'none' }
        }),
        children || React.createElement('div', {
            key: 'default-content',
            className: "text-center"
        }, [
            React.createElement('div', {
                key: 'upload-icon',
                className: "w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4"
            }, [
                React.createElement('svg', {
                    key: 'icon',
                    className: "w-8 h-8 text-teal-600",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                }, [
                    React.createElement('path', {
                        key: 'path',
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    })
                ])
            ]),
            React.createElement('p', {
                key: 'upload-text',
                className: "text-lg font-medium text-gray-700 mb-2"
            }, 'Choose Files or Drag & Drop'),
            React.createElement('p', {
                key: 'format-text',
                className: "text-sm text-gray-500"
            }, `Accepted formats: ${acceptedTypes}`)
        ])
    ]);
};

// Loading Overlay Component
const LoadingOverlay = ({ message = "Processing your files..." }) => React.createElement('div', {
    className: "loading-overlay"
}, [
    React.createElement('div', {
        key: 'loading-content',
        className: "loading-content"
    }, [
        React.createElement('div', {
            key: 'spinner',
            className: "spinner mx-auto mb-4"
        }),
        React.createElement('p', {
            key: 'message',
            className: "text-gray-700 font-medium"
        }, message)
    ])
]);

// Export all components
window.ToolsyComponents = {
    ToolsyLogo,
    Header,
    MergeIcon,
    SplitIcon,
    PDFCompressIcon,
    PDFToWordIcon,
    WordToPDFIcon,
    ResizeIcon,
    ImageCompressIcon,
    ConvertIcon,
    CropIcon,
    EnhancedToolCard,
    ProgressIndicator,
    FileUploadArea,
    LoadingOverlay
};