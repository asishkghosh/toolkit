import React from 'react';
import { FileUp } from 'lucide-react';
import ToolPage from '../components/ToolPage';

const WordToPDF = () => {
  return (
    <ToolPage
      title="Word to PDF"
      description="Convert Word documents to PDF format"
      icon={FileUp}
      acceptedTypes=".doc,.docx"
      multiple={false}
      endpoint="/word-to-pdf"
    />
  );
};

export default WordToPDF;