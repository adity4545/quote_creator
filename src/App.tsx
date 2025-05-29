import { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import Header from './components/Header';
import HowItWorks from './components/HowItWorks';
import QuotePreview from './components/QuotePreview';
import { QuoteProvider } from './context/QuoteContext';

function App() {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  if (showHowItWorks) {
    return <HowItWorks onBack={() => setShowHowItWorks(false)} />;
  }
  return (
    <QuoteProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 font-sans">
        <Header onHowItWorks={() => setShowHowItWorks(true)} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="order-2 lg:order-1">
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
                <ControlPanel />
                <div className="mt-8 text-center text-base text-white/70">
                  <p>Create beautiful quote images for Instagram with multiple layouts</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full">
                <QuotePreview />
              </div>
            </div>
          </div>
        </main>
        <footer className="py-8 border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-base text-white/60">
              &copy; {new Date().getFullYear()} InstaQuote Creator. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </QuoteProvider>
  );
}

export default App