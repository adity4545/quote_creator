import { Quote } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  onHowItWorks?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHowItWorks }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 shadow-lg backdrop-blur-lg bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Quote className="h-10 w-10 text-primary-400 drop-shadow-lg" />
            <h1 className="ml-4 text-3xl font-extrabold font-heading text-white tracking-tight drop-shadow-lg">
              InstaQuote <span className="text-primary-300">Creator</span>
            </h1>
          </div>
          <div>
            <button
              type="button"
              onClick={onHowItWorks}
              className="text-base text-white/80 hover:text-primary-200 font-semibold px-4 py-2 rounded-lg transition-colors bg-white/10 hover:bg-primary-700/30 shadow focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              How It Works
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header