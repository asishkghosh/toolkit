import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ToolCard = ({ 
  icon: Icon, 
  title, 
  description, 
  route, 
  color = "teal" 
}) => {
  return (
    <Link to={route} className="group">
      <div className="card p-6 h-full">
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-lg bg-${color}-100 text-${color}-600 mb-4 group-hover:bg-${color}-200 transition-colors`}>
          <Icon className="h-8 w-8" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-teal-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center mt-4 text-teal-600 font-medium group-hover:text-teal-700">
          <span className="text-sm">Try it now</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;