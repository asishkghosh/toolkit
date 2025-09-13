import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <div className="flex items-center space-x-1 text-gray-600 mb-4 md:mb-0">
            <span>© 2024 TealPDF. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for better PDF management.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Additional Links */}
        <div className="border-t border-gray-200 mt-6 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <div className="flex space-x-6 mb-2 md:mb-0">
              <a href="#privacy" className="hover:text-teal-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-teal-600 transition-colors">
                Terms of Service
              </a>
              <a href="#contact" className="hover:text-teal-600 transition-colors">
                Contact Us
              </a>
            </div>
            <div>
              <span>Secure PDF processing • No files stored</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;