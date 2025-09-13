import React from 'react';
import ToolCard from '../components/ToolCard';
import { 
  FileText, 
  Scissors, 
  Archive, 
  FileDown, 
  FileUp,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

const Home = () => {
  const tools = [
    {
      icon: FileText,
      title: "Merge PDFs",
      description: "Combine multiple PDF files into a single document. Perfect for consolidating reports, presentations, or any collection of PDFs.",
      route: "/merge"
    },
    {
      icon: Scissors,
      title: "Split PDF",
      description: "Extract specific pages or split a PDF into multiple files. Great for separating chapters or sections.",
      route: "/split"
    },
    {
      icon: Archive,
      title: "Compress PDF",
      description: "Reduce PDF file size without losing quality. Optimize your documents for faster sharing and storage.",
      route: "/compress"
    },
    {
      icon: FileDown,
      title: "PDF to Word",
      description: "Convert PDF files to editable Word documents. Maintain formatting while making content editable.",
      route: "/pdf-to-word"
    },
    {
      icon: FileUp,
      title: "Word to PDF",
      description: "Convert Word documents to PDF format. Preserve formatting and ensure universal compatibility.",
      route: "/word-to-pdf"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Lightning-fast PDF operations powered by optimized algorithms"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your files are processed securely and deleted immediately after use"
    },
    {
      icon: Clock,
      title: "No Registration",
      description: "Start using our tools immediately without creating an account"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-teal-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Modern PDF Tools for
              <span className="text-teal-600 block">Everyone</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Process your PDF files with ease using our suite of powerful, 
              secure, and user-friendly tools. No registration required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#tools" className="btn-primary">
                Explore Tools
              </a>
              <a href="#about" className="btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              PDF Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our collection of PDF processing tools. 
              Each tool is designed to be simple, fast, and reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ToolCard {...tool} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose TealPDF?
            </h2>
            <p className="text-xl text-gray-600">
              Built with modern technology and user experience in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="inline-flex p-4 rounded-full bg-teal-100 text-teal-600 mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              About TealPDF
            </h2>
            <div className="text-lg text-gray-600 space-y-6 leading-relaxed">
              <p>
                TealPDF is a modern, web-based PDF toolkit designed to make PDF processing 
                simple and accessible. Built with cutting-edge technology, our platform 
                offers a clean, intuitive interface for all your PDF needs.
              </p>
              <p>
                We believe in privacy and security. All file processing happens securely, 
                and your files are automatically deleted from our servers after processing. 
                No data is stored, and no registration is required.
              </p>
              <p>
                Whether you're a student, professional, or just someone who works with PDFs 
                regularly, TealPDF provides the tools you need with the simplicity you deserve.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;