// Tools Page Component
const ToolsPage = ({ onToolSelect, initialCategory = 'All' }) => {
    const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);

    // Tools data organized by category
    const toolsData = {
        PDF: [
            { 
                id: 'merge', 
                title: 'Merge PDFs', 
                description: 'Combine multiple PDF files into one document', 
                icon: ToolsyComponents.MergeIcon, 
                endpoint: '/merge', 
                multiple: true, 
                acceptedTypes: '.pdf' 
            },
            { 
                id: 'split', 
                title: 'Split PDF', 
                description: 'Split a PDF into multiple files or extract pages', 
                icon: ToolsyComponents.SplitIcon, 
                endpoint: '/split', 
                multiple: false, 
                acceptedTypes: '.pdf' 
            },
            { 
                id: 'compress', 
                title: 'Compress PDF', 
                description: 'Reduce PDF file size while maintaining quality', 
                icon: ToolsyComponents.PDFCompressIcon, 
                endpoint: '/compress', 
                multiple: false, 
                acceptedTypes: '.pdf' 
            },
            { 
                id: 'pdf-to-word', 
                title: 'PDF to Word', 
                description: 'Convert PDF documents to editable Word files', 
                icon: ToolsyComponents.PDFToWordIcon, 
                endpoint: '/pdf-to-word', 
                multiple: false, 
                acceptedTypes: '.pdf' 
            },
            { 
                id: 'word-to-pdf', 
                title: 'Word to PDF', 
                description: 'Convert Word documents to PDF format', 
                icon: ToolsyComponents.WordToPDFIcon, 
                endpoint: '/word-to-pdf', 
                multiple: false, 
                acceptedTypes: '.doc,.docx' 
            }
        ],
        Image: [
            { 
                id: 'resize-image', 
                title: 'Resize Images', 
                description: 'Change image dimensions and resolution', 
                icon: ToolsyComponents.ResizeIcon || (() => React.createElement('svg', {
                    className: "w-8 h-8 text-blue-600",
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
                ])),
                endpoint: '/image/resize', 
                multiple: false, 
                acceptedTypes: '.jpg,.png,.jpeg,.bmp,.tiff,.webp' 
            },
            { 
                id: 'compress-image', 
                title: 'Compress Images', 
                description: 'Reduce image file size while maintaining quality', 
                icon: ToolsyComponents.ImageCompressIcon || (() => React.createElement('svg', {
                    className: "w-8 h-8 text-blue-600",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                }, [
                    React.createElement('path', {
                        key: 'img-compress-path',
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    })
                ])),
                endpoint: '/image/compress', 
                multiple: false, 
                acceptedTypes: '.jpg,.png,.jpeg,.bmp,.tiff,.webp' 
            },
            { 
                id: 'crop-image', 
                title: 'Crop Images', 
                description: 'Crop images to specific dimensions or areas', 
                icon: ToolsyComponents.CropIcon || (() => React.createElement('svg', {
                    className: "w-8 h-8 text-blue-600",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                }, [
                    React.createElement('path', {
                        key: 'crop-path',
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M7 7h10v10M7 7v10h10M7 7L3 3m4 4L3 3m0 18l4-4m0 0h10m-10 0v-10m10 10v-10"
                    })
                ])),
                endpoint: '/image/crop', 
                multiple: false, 
                acceptedTypes: '.jpg,.png,.jpeg,.bmp,.tiff,.webp' 
            }
        ],
        AI: [
            { 
                id: 'summarize', 
                title: 'AI Summarizer', 
                description: 'Summarize long documents using AI', 
                icon: () => React.createElement('svg', {
                    className: "w-8 h-8 text-purple-600",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                }, [
                    React.createElement('path', {
                        key: 'ai-path',
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    })
                ]),
                endpoint: '/summarize', 
                multiple: false, 
                acceptedTypes: '.pdf,.txt' 
            },
            { 
                id: 'translate', 
                title: 'AI Translator', 
                description: 'Translate documents to different languages', 
                icon: () => React.createElement('svg', {
                    className: "w-8 h-8 text-purple-600",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                }, [
                    React.createElement('path', {
                        key: 'translate-path',
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    })
                ]),
                endpoint: '/translate', 
                multiple: false, 
                acceptedTypes: '.pdf,.txt' 
            }
        ],
        Fun: [
            { 
                id: 'meme-generator', 
                title: 'Meme Generator', 
                description: 'Create memes from your images', 
                icon: () => React.createElement('svg', {
                    className: "w-8 h-8 text-orange-600",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                }, [
                    React.createElement('path', {
                        key: 'meme-path',
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m2-7H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2z"
                    })
                ]),
                endpoint: '/meme', 
                multiple: false, 
                acceptedTypes: '.jpg,.png,.jpeg' 
            },
            { 
                id: 'qr-generator', 
                title: 'QR Code Generator', 
                description: 'Generate QR codes for text or URLs', 
                icon: () => React.createElement('svg', {
                    className: "w-8 h-8 text-orange-600",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                }, [
                    React.createElement('path', {
                        key: 'qr-path',
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    })
                ]),
                endpoint: '/qr', 
                multiple: false, 
                acceptedTypes: '.txt' 
            }
        ]
    };

    const categories = ['All', 'PDF', 'Image', 'AI', 'Fun'];

    // Get filtered tools based on selected category
    const getFilteredTools = () => {
        if (selectedCategory === 'All') {
            return Object.values(toolsData).flat();
        }
        return toolsData[selectedCategory] || [];
    };

    const filteredTools = getFilteredTools();

    return React.createElement('div', {
        className: "min-h-screen bg-gray-50"
    }, [
        // Header Section
        React.createElement('section', {
            key: 'header',
            className: "bg-gradient-to-br from-teal-50 to-teal-100 py-16"
        }, [
            React.createElement('div', {
                key: 'header-container',
                className: "container mx-auto px-4 text-center"
            }, [
                React.createElement('h1', {
                    key: 'header-title',
                    className: "text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                }, 'All Tools'),
                React.createElement('p', {
                    key: 'header-subtitle',
                    className: "text-xl text-gray-600 max-w-2xl mx-auto"
                }, 'Discover our complete suite of productivity tools designed to make your workflow more efficient')
            ])
        ]),

        // Category Filter Section
        React.createElement('section', {
            key: 'filters',
            className: "py-8 bg-white border-b border-gray-200"
        }, [
            React.createElement('div', {
                key: 'filters-container',
                className: "container mx-auto px-4"
            }, [
                React.createElement('div', {
                    key: 'filter-buttons',
                    className: "flex flex-wrap justify-center gap-4"
                }, categories.map(category => 
                    React.createElement('button', {
                        key: category,
                        onClick: () => setSelectedCategory(category),
                        className: `px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                            selectedCategory === category 
                                ? 'bg-teal-600 text-white shadow-lg' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`
                    }, category)
                ))
            ])
        ]),

        // Tools Grid Section
        React.createElement('section', {
            key: 'tools-grid',
            className: "py-16"
        }, [
            React.createElement('div', {
                key: 'tools-container',
                className: "container mx-auto px-4"
            }, [
                // Tools count display
                React.createElement('div', {
                    key: 'tools-count',
                    className: "mb-8 text-center"
                }, [
                    React.createElement('p', {
                        key: 'count-text',
                        className: "text-gray-600"
                    }, `Showing ${filteredTools.length} ${selectedCategory === 'All' ? '' : selectedCategory.toLowerCase()} tool${filteredTools.length !== 1 ? 's' : ''}`)
                ]),

                // Tools Grid
                filteredTools.length > 0 ? React.createElement('div', {
                    key: 'grid',
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
                }, filteredTools.map(tool => 
                    React.createElement(ToolsyComponents.EnhancedToolCard, {
                        key: tool.id,
                        icon: tool.icon,
                        title: tool.title,
                        description: tool.description,
                        category: Object.keys(toolsData).find(cat => 
                            toolsData[cat].some(t => t.id === tool.id)
                        ),
                        onClick: () => onToolSelect(tool.id)
                    })
                )) : React.createElement('div', {
                    key: 'no-tools',
                    className: "text-center py-16"
                }, [
                    React.createElement('div', {
                        key: 'no-tools-icon',
                        className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    }, [
                        React.createElement('svg', {
                            key: 'icon',
                            className: "w-8 h-8 text-gray-400",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                        }, [
                            React.createElement('path', {
                                key: 'path',
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            })
                        ])
                    ]),
                    React.createElement('h3', {
                        key: 'no-tools-title',
                        className: "text-xl font-medium text-gray-600 mb-2"
                    }, 'No tools found'),
                    React.createElement('p', {
                        key: 'no-tools-desc',
                        className: "text-gray-500"
                    }, 'Try selecting a different category or check back later for new tools.')
                ])
            ])
        ]),

        // CTA Section
        React.createElement('section', {
            key: 'cta',
            className: "py-16 bg-teal-600"
        }, [
            React.createElement('div', {
                key: 'cta-container',
                className: "container mx-auto px-4 text-center"
            }, [
                React.createElement('h2', {
                    key: 'cta-title',
                    className: "text-3xl md:text-4xl font-bold text-white mb-4"
                }, 'Ready to boost your productivity?'),
                React.createElement('p', {
                    key: 'cta-subtitle',
                    className: "text-xl text-teal-100 mb-8 max-w-2xl mx-auto"
                }, 'Choose any tool above and start transforming your workflow today. No registration required!')
            ])
        ])
    ]);
};

// Export for global use
window.ToolsPage = ToolsPage;