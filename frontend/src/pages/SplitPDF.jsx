import React from 'react';
import { Scissors } from 'lucide-react';
import ToolPage from '../components/ToolPage';

const SplitPDF = () => {
  return (
    <ToolPage
      title="Split PDF"
      description="Extract pages or split a PDF into multiple files"
      icon={Scissors}
      acceptedTypes=".pdf"
      multiple={false}
      endpoint="/split"
    />
  );
};

export default SplitPDF;