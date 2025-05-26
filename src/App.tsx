import React from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import QuotePreview from './components/QuotePreview';
import { QuoteProvider } from './context/QuoteContext';

function App() {
  return (
    <QuoteProvider>
      <div className="min-h-screen bg-neutral-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <ControlPanel />
              <div className="mt-6 text-center text-sm text-neutral-400">
                <p>Create beautiful quote images for Instagram with multiple layouts</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <QuotePreview />
            </div>
          </div>
        </main>
        <footer className="py-8 border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} InstaQuote Creator. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </QuoteProvider>
  );
}

export default App