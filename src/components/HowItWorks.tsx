import React from 'react';
import { Upload, Type, Palette, Download, ArrowLeft } from 'lucide-react';

const steps = [
  {
    icon: <Upload className="w-8 h-8 text-primary-400" />,
    title: 'Upload Images',
    desc: 'Add up to 4 images for your background collage.'
  },
  {
    icon: <Type className="w-8 h-8 text-primary-400" />,
    title: 'Enter Your Quote',
    desc: 'Type your quote and author name.'
  },
  {
    icon: <Palette className="w-8 h-8 text-primary-400" />,
    title: 'Style It',
    desc: 'Customize font, color, alignment, background, and more.'
  },
  {
    icon: <Download className="w-8 h-8 text-primary-400" />,
    title: 'Download',
    desc: 'Choose your image format and download your creation.'
  }
];

const HowItWorks: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 font-sans px-4 py-12">
    <div className="max-w-xl w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-extrabold text-white mb-8 text-center drop-shadow-lg">How It Works</h2>
      <ol className="space-y-8">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start space-x-4">
            <div className="flex-shrink-0">{step.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
              <p className="text-white/80 text-base">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
      {onBack && (
        <button
          onClick={onBack}
          className="mt-10 flex items-center px-5 py-3 rounded-2xl bg-gradient-to-r from-primary-700 via-primary-500 to-primary-400 text-white font-bold text-xl shadow-xl hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-primary-400"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
      )}
    </div>
  </div>
);

export default HowItWorks; 