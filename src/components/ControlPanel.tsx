import { Palette, Type, Upload } from 'lucide-react';
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import QuoteInput from './QuoteInput';
import StyleEditor from './StyleEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';

const ControlPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('images');

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6 bg-gradient-to-r from-indigo-800 via-purple-800 to-blue-800 rounded-xl overflow-hidden shadow">
          <TabsTrigger value="images" className="flex items-center justify-center px-0 py-3 text-white font-semibold transition-all hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:text-primary-300">
            <Upload className="w-4 h-4 mr-1" /> Images
          </TabsTrigger>
          <TabsTrigger value="quote" className="flex items-center justify-center px-0 py-3 text-white font-semibold transition-all hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:text-primary-300">
            <Type className="w-4 h-4 mr-1" /> Quote
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center justify-center px-0 py-3 text-white font-semibold transition-all hover:bg-white/10 data-[state=active]:bg-white/20 data-[state=active]:text-primary-300">
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