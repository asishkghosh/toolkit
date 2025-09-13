import React from 'react';
import { FileDown } from 'lucide-react';
import ToolPage from '../components/ToolPage';

const PDFToWord = () => {
  return (
    <ToolPage
      title="PDF to Word"
      description="Convert PDF files to editable Word documents"
      icon={FileDown}
      acceptedTypes=".pdf"
      multiple={false}
      endpoint="/pdf-to-word"
    />
  );
};

export default PDFToWord;