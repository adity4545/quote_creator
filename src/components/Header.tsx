import React from 'react';
import { Quote } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-neutral-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Quote className="h-8 w-8 text-primary-400" />
            <h1 className="ml-2 text-xl font-heading font-semibold text-white">InstaQuote Creator</h1>
          </div>
          <div>
            <a
              href="#"
              className="text-sm text-primary-400 hover:text-primary-300 font-medium"
            >
              How It Works
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header