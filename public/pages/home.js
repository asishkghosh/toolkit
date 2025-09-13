// Home Page Component
const HomePage = ({ onNavigateToTools, onNavigateToAbout }) => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    
    const categories = [
        { 
            name: 'PDF', 
            icon: React.createElement('svg', {
                className: "w-12 h-12 text-teal-600",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
            }, [
                React.createElement('path', {
                    key: 'pdf-path',
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                })
            ]),
            desc: 'PDF processing and conversion tools' 
        },
        { 
            name: 'Image', 
            icon: React.createElement('svg', {
                className: "w-12 h-12 text-blue-600",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
            }, [
                React.createElement('path', {
                    key: 'image-path',
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                })
            ]),
            desc: 'Image editing and optimization' 
        },
        { 
            name: 'AI', 
            icon: React.createElement('svg', {
                className: "w-12 h-12 text-purple-600",
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
            desc: 'AI-powered content tools' 
        },
        { 
            name: 'Fun', 
            icon: React.createElement('svg', {
                className: "w-12 h-12 text-orange-600",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24"
            }, [
                React.createElement('path', {
                    key: 'fun-path',
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m2-7H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2z"
                })
            ]),
            desc: 'Creative and entertainment tools' 
        }
    ];

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % categories.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return React.createElement('div', {
        className: "min-h-screen"
    }, [
        // Hero Section
        React.createElement('section', {
            key: 'hero',
            className: "bg-gradient-to-br from-teal-50 via-white to-teal-50 py-20"
        }, [
            React.createElement('div', {
                key: 'hero-container',
                className: "container mx-auto px-4 text-center"
            }, [
                React.createElement('h1', {
                    key: 'hero-title',
                    className: "text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 animate-fade-in"
                }, [
                    'Your Ultimate ',
                    React.createElement('span', {
                        key: 'highlight',
                        className: "text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500"
                    }, 'Digital Toolbox')
                ]),
                React.createElement('p', {
                    key: 'hero-subtitle',
                    className: "text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
                }, 'Transform, convert, and optimize your files with our comprehensive suite of modern productivity tools. Fast, secure, and completely free.'),
                React.createElement('div', {
                    key: 'hero-buttons',
                    className: "flex flex-col sm:flex-row gap-4 justify-center items-center"
                }, [
                    React.createElement('button', {
                        key: 'explore-btn',
                        onClick: () => onNavigateToTools(),
                        className: "btn-primary text-lg px-8 py-4"
                    }, [
                        'Explore Tools',
                        React.createElement('svg', {
                            key: 'arrow',
                            className: "w-5 h-5 ml-2",
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
                    ]),
                    React.createElement('button', {
                        key: 'learn-btn',
                        onClick: onNavigateToAbout,
                        className: "px-8 py-4 text-lg font-medium text-teal-600 hover:text-teal-700 transition-colors"
                    }, 'Learn More')
                ])
            ])
        ]),

        // Tool Categories Section
        React.createElement('section', {
            key: 'categories',
            className: "py-20 bg-white"
        }, [
            React.createElement('div', {
                key: 'categories-container',
                className: "container mx-auto px-4"
            }, [
                React.createElement('div', {
                    key: 'categories-header',
                    className: "text-center mb-16"
                }, [
                    React.createElement('h2', {
                        key: 'categories-title',
                        className: "text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                    }, 'Everything You Need'),
                    React.createElement('p', {
                        key: 'categories-subtitle',
                        className: "text-xl text-gray-600 max-w-2xl mx-auto"
                    }, 'Comprehensive tools for all your digital productivity needs')
                ]),

                // Desktop: Grid Layout
                React.createElement('div', {
                    key: 'desktop-grid',
                    className: "hidden lg:grid grid-cols-4 gap-8 max-w-6xl mx-auto"
                }, categories.map((category, index) => 
                    React.createElement('div', {
                        key: `desktop-${category.name}`,
                        className: "card p-8 h-64 text-center group cursor-pointer hover:shadow-xl transition-all duration-300",
                        onClick: () => onNavigateToTools(category.name)
                    }, [
                        React.createElement('div', {
                            key: 'icon-container',
                            className: "flex items-center justify-center mb-6"
                        }, category.icon),
                        React.createElement('h3', {
                            key: 'category-title',
                            className: "text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors"
                        }, category.name),
                        React.createElement('p', {
                            key: 'category-desc',
                            className: "text-gray-600 text-sm leading-relaxed"
                        }, category.desc)
                    ])
                )),

                // Mobile/Tablet: Slider
                React.createElement('div', {
                    key: 'mobile-slider',
                    className: "lg:hidden relative max-w-sm mx-auto"
                }, [
                    React.createElement('div', {
                        key: 'slider-container',
                        className: "relative overflow-hidden"
                    }, [
                        React.createElement('div', {
                            key: 'slider-track',
                            className: "flex transition-transform duration-300 ease-in-out",
                            style: { transform: `translateX(-${currentSlide * 100}%)` }
                        }, categories.map((category, index) => 
                            React.createElement('div', {
                                key: `mobile-${category.name}`,
                                className: "card p-8 h-64 w-full flex-shrink-0 text-center group cursor-pointer",
                                onClick: () => onNavigateToTools(category.name)
                            }, [
                                React.createElement('div', {
                                    key: 'icon-container',
                                    className: "flex items-center justify-center mb-6"
                                }, category.icon),
                                React.createElement('h3', {
                                    key: 'category-title',
                                    className: "text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors"
                                }, category.name),
                                React.createElement('p', {
                                    key: 'category-desc',
                                    className: "text-gray-600 text-sm leading-relaxed"
                                }, category.desc)
                            ])
                        )),

                        // Navigation Arrows
                        React.createElement('button', {
                            key: 'prev-btn',
                            onClick: prevSlide,
                            className: "absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
                        }, [
                            React.createElement('svg', {
                                key: 'prev-icon',
                                className: "w-6 h-6 text-gray-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                            }, [
                                React.createElement('path', {
                                    key: 'prev-path',
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M15 19l-7-7 7-7"
                                })
                            ])
                        ]),
                        React.createElement('button', {
                            key: 'next-btn',
                            onClick: nextSlide,
                            className: "absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
                        }, [
                            React.createElement('svg', {
                                key: 'next-icon',
                                className: "w-6 h-6 text-gray-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                            }, [
                                React.createElement('path', {
                                    key: 'next-path',
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M9 5l7 7-7 7"
                                })
                            ])
                        ])
                    ]),

                    // Dot Indicators
                    React.createElement('div', {
                        key: 'dots',
                        className: "flex justify-center mt-6 space-x-2"
                    }, categories.map((_, index) => 
                        React.createElement('button', {
                            key: `dot-${index}`,
                            onClick: () => goToSlide(index),
                            className: `w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-teal-600 scale-110' : 'bg-gray-300 hover:bg-gray-400'}`
                        })
                    ))
                ])
            ])
        ]),

        // Features Section
        React.createElement('section', {
            key: 'features',
            className: "py-20 bg-gray-50"
        }, [
            React.createElement('div', {
                key: 'features-container',
                className: "container mx-auto px-4"
            }, [
                React.createElement('div', {
                    key: 'features-header',
                    className: "text-center mb-16"
                }, [
                    React.createElement('h2', {
                        key: 'features-title',
                        className: "text-4xl font-bold text-gray-800 mb-4"
                    }, 'Why Choose Toolsy?'),
                    React.createElement('p', {
                        key: 'features-subtitle',
                        className: "text-xl text-gray-600"
                    }, 'Built with modern technology and user experience in mind')
                ]),

                React.createElement('div', {
                    key: 'features-grid',
                    className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                }, [
                    // Feature 1
                    React.createElement('div', {
                        key: 'feature-1',
                        className: "text-center"
                    }, [
                        React.createElement('div', {
                            key: 'feature-1-icon',
                            className: "inline-flex p-4 rounded-full bg-teal-100 text-teal-600 mb-4"
                        }, [
                            React.createElement('svg', {
                                key: 'icon',
                                className: "h-8 w-8",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                            }, [
                                React.createElement('path', {
                                    key: 'path',
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M13 10V3L4 14h7v7l9-11h-7z"
                                })
                            ])
                        ]),
                        React.createElement('h3', {
                            key: 'feature-1-title',
                            className: "text-xl font-semibold text-gray-800 mb-3"
                        }, 'Lightning Fast'),
                        React.createElement('p', {
                            key: 'feature-1-desc',
                            className: "text-gray-600"
                        }, 'Process your files quickly with our optimized algorithms')
                    ]),

                    // Feature 2
                    React.createElement('div', {
                        key: 'feature-2',
                        className: "text-center"
                    }, [
                        React.createElement('div', {
                            key: 'feature-2-icon',
                            className: "inline-flex p-4 rounded-full bg-teal-100 text-teal-600 mb-4"
                        }, [
                            React.createElement('svg', {
                                key: 'icon',
                                className: "h-8 w-8",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                            }, [
                                React.createElement('path', {
                                    key: 'path',
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                })
                            ])
                        ]),
                        React.createElement('h3', {
                            key: 'feature-2-title',
                            className: "text-xl font-semibold text-gray-800 mb-3"
                        }, 'Secure & Private'),
                        React.createElement('p', {
                            key: 'feature-2-desc',
                            className: "text-gray-600"
                        }, 'Your files are processed securely and automatically deleted')
                    ]),

                    // Feature 3
                    React.createElement('div', {
                        key: 'feature-3',
                        className: "text-center"
                    }, [
                        React.createElement('div', {
                            key: 'feature-3-icon',
                            className: "inline-flex p-4 rounded-full bg-teal-100 text-teal-600 mb-4"
                        }, [
                            React.createElement('svg', {
                                key: 'icon',
                                className: "h-8 w-8",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                            }, [
                                React.createElement('path', {
                                    key: 'path',
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                })
                            ])
                        ]),
                        React.createElement('h3', {
                            key: 'feature-3-title',
                            className: "text-xl font-semibold text-gray-800 mb-3"
                        }, 'Easy to Use'),
                        React.createElement('p', {
                            key: 'feature-3-desc',
                            className: "text-gray-600"
                        }, 'Intuitive interface designed for everyone')
                    ])
                ])
            ])
        ])
    ]);
};

// Export for global use
window.HomePage = HomePage;