import React from 'react';
import { FileText } from 'lucide-react';
import ToolPage from '../components/ToolPage';

const MergePDF = () => {
  return (
    <ToolPage
      title="Merge PDFs"
      description="Combine multiple PDF files into a single document"
      icon={FileText}
      acceptedTypes=".pdf"
      multiple={true}
      endpoint="/merge"
    />
  );
};

export default MergePDF;