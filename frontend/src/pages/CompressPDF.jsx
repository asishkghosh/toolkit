import React from 'react';
import { Archive } from 'lucide-react';
import ToolPage from '../components/ToolPage';

const CompressPDF = () => {
  return (
    <ToolPage
      title="Compress PDF"
      description="Reduce PDF file size without losing quality"
      icon={Archive}
      acceptedTypes=".pdf"
      multiple={false}
      endpoint="/compress"
    />
  );
};

export default CompressPDF;