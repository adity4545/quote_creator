import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import ImageUploader from './ImageUploader';
import QuoteInput from './QuoteInput';
import StyleEditor from './StyleEditor';
import { Upload, Type, Palette } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('images');

  return (
    <div className="bg-neutral-800 rounded-lg shadow-md p-5">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="images" className="flex items-center justify-center">
            <Upload className="w-4 h-4 mr-1" /> Images
          </TabsTrigger>
          <TabsTrigger value="quote" className="flex items-center justify-center">
            <Type className="w-4 h-4 mr-1" /> Quote
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center justify-center">
            <Palette className="w-4 h-4 mr-1" /> Style
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="images">
          <ImageUploader />
        </TabsContent>
        
        <TabsContent value="quote">
          <QuoteInput />
        </TabsContent>
        
        <TabsContent value="style">
          <StyleEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlPanel