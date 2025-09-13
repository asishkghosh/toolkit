// About Page Component
const AboutPage = ({ onNavigateToTools }) => {
    return React.createElement('div', {
        className: "min-h-screen bg-gray-50"
    }, [
        // About Header
        React.createElement('section', {
            key: 'about-header',
            className: "bg-gradient-to-br from-teal-50 to-teal-100 py-16"
        }, [
            React.createElement('div', {
                key: 'header-container',
                className: "container mx-auto px-4 text-center"
            }, [
                React.createElement('h1', {
                    key: 'header-title',
                    className: "text-4xl md:text-5xl font-bold text-gray-800 mb-4"
                }, 'About Toolsy'),
                React.createElement('p', {
                    key: 'header-subtitle',
                    className: "text-xl text-gray-600 max-w-2xl mx-auto"
                }, 'Your Ultimate Online Toolbox for Digital Productivity')
            ])
        ]),

        // Mission Section
        React.createElement('section', {
            key: 'mission',
            className: "py-16 bg-white"
        }, [
            React.createElement('div', {
                key: 'mission-container',
                className: "container mx-auto px-4"
            }, [
                React.createElement('div', {
                    key: 'mission-content',
                    className: "max-w-4xl mx-auto text-center"
                }, [
                    React.createElement('h2', {
                        key: 'mission-title',
                        className: "text-4xl font-bold text-gray-800 mb-6"
                    }, 'Our Mission'),
                    React.createElement('div', {
                        key: 'mission-text',
                        className: "text-lg text-gray-600 space-y-6 leading-relaxed"
                    }, [
                        React.createElement('p', {
                            key: 'mission-p1'
                        }, 'Toolsy is a modern, web-based productivity suite designed to make file processing simple and accessible. Built with cutting-edge technology, our platform offers a clean, intuitive interface for all your digital needs.'),
                        React.createElement('p', {
                            key: 'mission-p2'
                        }, 'We believe in privacy and security. All file processing happens securely, and your files are automatically deleted from our servers after processing. No data is stored, and no registration is required.'),
                        React.createElement('p', {
                            key: 'mission-p3'
                        }, 'Whether you\'re a student, professional, or just someone who works with digital files regularly, Toolsy provides the tools you need with the simplicity you deserve.')
                    ])
                ])
            ])
        ]),

        // Features Section
        React.createElement('section', {
            key: 'features',
            className: "py-16 bg-gray-50"
        }, [
            React.createElement('div', {
                key: 'features-container',
                className: "container mx-auto px-4"
            }, [
                React.createElement('div', {
                    key: 'features-header',
                    className: "text-center mb-12"
                }, [
                    React.createElement('h2', {
                        key: 'features-title',
                        className: "text-3xl font-bold text-gray-800 mb-4"
                    }, 'What Makes Us Different'),
                    React.createElement('p', {
                        key: 'features-subtitle',
                        className: "text-lg text-gray-600"
                    }, 'Built with modern web technologies and user-focused design')
                ]),

                React.createElement('div', {
                    key: 'features-grid',
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                }, [
                    // Feature 1
                    React.createElement('div', {
                        key: 'feature-1',
                        className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                    }, [
                        React.createElement('div', {
                            key: 'feature-1-icon',
                            className: "w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4"
                        }, [
                            React.createElement('svg', {
                                key: 'icon',
                                className: "w-6 h-6 text-teal-600",
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
                        }, 'Our optimized algorithms ensure your files are processed quickly and efficiently, saving you valuable time.')
                    ]),

                    // Feature 2
                    React.createElement('div', {
                        key: 'feature-2',
                        className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                    }, [
                        React.createElement('div', {
                            key: 'feature-2-icon',
                            className: "w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4"
                        }, [
                            React.createElement('svg', {
                                key: 'icon',
                                className: "w-6 h-6 text-teal-600",
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
                        }, 'Your privacy is our priority. Files are processed securely and automatically deleted from our servers.')
                    ]),

                    // Feature 3
                    React.createElement('div', {
                        key: 'feature-3',
                        className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                    }, [
                        React.createElement('div', {
                            key: 'feature-3-icon',
                            className: "w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4"
                        }, [
                            React.createElement('svg', {
                                key: 'icon',
                                className: "w-6 h-6 text-teal-600",
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
                        }, 'Intuitive interface designed for everyone, from beginners to power users. No learning curve required.')
                    ]),

                    // Feature 4
                    React.createElement('div', {
                        key: 'feature-4',
                        className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                    }, [
                        React.createElement('div', {
                            key: 'feature-4-icon',
                            className: "w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4"
                        }, [
                            React.createElement('svg', {
                                key: 'icon',
                                className: "w-6 h-6 text-teal-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                            }, [
                                React.createElement('path', {
                                    key: 'path',
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                                })
                            ])
                        ]),
                        React.createElement('h3', {
                            key: 'feature-4-title',
                            className: "text-xl font-semibold text-gray-800 mb-3"
                        }, 'Always Available'),
                        React.createElement('p', {
                            key: 'feature-4-desc',
                            className: "text-gray-600"
                        }, 'Access our tools from anywhere, anytime. No software installation or updates required.')
                    ]),

                    // Feature 5
                    React.createElement('div', {
                        key: 'feature-5',
                        className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                    }, [
                        React.createElement('div', {
                            key: 'feature-5-icon',
                            className: "w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4"
                        }, [
                            React.createElement('svg', {
                                key: 'icon',
                                className: "w-6 h-6 text-teal-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                            }, [
                                React.createElement('path', {
                                    key: 'path',
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                })
                            ])
                        ]),
                        React.createElement('h3', {
                            key: 'feature-5-title',
                            className: "text-xl font-semibold text-gray-800 mb-3"
                        }, 'Completely Free'),
                        React.createElement('p', {
                            key: 'feature-5-desc',
                            className: "text-gray-600"
                        }, 'All our tools are completely free to use. No hidden fees, subscriptions, or premium tiers.')
                    ]),

                    // Feature 6
                    React.createElement('div', {
                        key: 'feature-6',
                        className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                    }, [
                        React.createElement('div', {
                            key: 'feature-6-icon',
                            className: "w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4"
                        }, [
                            React.createElement('svg', {
                                key: 'icon',
                                className: "w-6 h-6 text-teal-600",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                            }, [
                                React.createElement('path', {
                                    key: 'path',
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                })
                            ])
                        ]),
                        React.createElement('h3', {
                            key: 'feature-6-title',
                            className: "text-xl font-semibold text-gray-800 mb-3"
                        }, 'Quality Results'),
                        React.createElement('p', {
                            key: 'feature-6-desc',
                            className: "text-gray-600"
                        }, 'Advanced algorithms ensure high-quality output that meets professional standards.')
                    ])
                ])
            ])
        ]),

        // Technology Section
        React.createElement('section', {
            key: 'technology',
            className: "py-16 bg-white"
        }, [
            React.createElement('div', {
                key: 'tech-container',
                className: "container mx-auto px-4"
            }, [
                React.createElement('div', {
                    key: 'tech-content',
                    className: "max-w-4xl mx-auto text-center"
                }, [
                    React.createElement('h2', {
                        key: 'tech-title',
                        className: "text-3xl font-bold text-gray-800 mb-6"
                    }, 'Built with Modern Technology'),
                    React.createElement('p', {
                        key: 'tech-desc',
                        className: "text-lg text-gray-600 mb-8"
                    }, 'Toolsy is built using cutting-edge web technologies to ensure fast performance, security, and reliability.'),
                    
                    React.createElement('div', {
                        key: 'tech-stack',
                        className: "grid grid-cols-2 md:grid-cols-4 gap-6"
                    }, [
                        React.createElement('div', {
                            key: 'react',
                            className: "text-center"
                        }, [
                            React.createElement('div', {
                                key: 'react-icon',
                                className: "w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3"
                            }, [
                                React.createElement('span', {
                                    key: 'react-text',
                                    className: "text-blue-600 font-bold text-lg"
                                }, 'React')
                            ]),
                            React.createElement('p', {
                                key: 'react-label',
                                className: "text-sm text-gray-600"
                            }, 'Frontend Framework')
                        ]),
                        
                        React.createElement('div', {
                            key: 'fastapi',
                            className: "text-center"
                        }, [
                            React.createElement('div', {
                                key: 'fastapi-icon',
                                className: "w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3"
                            }, [
                                React.createElement('span', {
                                    key: 'fastapi-text',
                                    className: "text-green-600 font-bold text-lg"
                                }, 'API')
                            ]),
                            React.createElement('p', {
                                key: 'fastapi-label',
                                className: "text-sm text-gray-600"
                            }, 'FastAPI Backend')
                        ]),
                        
                        React.createElement('div', {
                            key: 'tailwind',
                            className: "text-center"
                        }, [
                            React.createElement('div', {
                                key: 'tailwind-icon',
                                className: "w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3"
                            }, [
                                React.createElement('span', {
                                    key: 'tailwind-text',
                                    className: "text-teal-600 font-bold text-lg"
                                }, 'CSS')
                            ]),
                            React.createElement('p', {
                                key: 'tailwind-label',
                                className: "text-sm text-gray-600"
                            }, 'Tailwind CSS')
                        ]),
                        
                        React.createElement('div', {
                            key: 'python',
                            className: "text-center"
                        }, [
                            React.createElement('div', {
                                key: 'python-icon',
                                className: "w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3"
                            }, [
                                React.createElement('span', {
                                    key: 'python-text',
                                    className: "text-yellow-600 font-bold text-lg"
                                }, 'Py')
                            ]),
                            React.createElement('p', {
                                key: 'python-label',
                                className: "text-sm text-gray-600"
                            }, 'Python Processing')
                        ])
                    ])
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
                }, 'Ready to Get Started?'),
                React.createElement('p', {
                    key: 'cta-subtitle',
                    className: "text-xl text-teal-100 mb-8 max-w-2xl mx-auto"
                }, 'Join thousands of users who trust Toolsy for their daily productivity needs.'),
                React.createElement('button', {
                    key: 'cta-button',
                    onClick: onNavigateToTools,
                    className: "bg-white text-teal-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
                }, 'Explore All Tools')
            ])
        ])
    ]);
};

// Export for global use
window.AboutPage = AboutPage;