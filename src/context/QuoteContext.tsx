import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InstaQuote, QuoteStyle, BackgroundStyle, Font, TextAlignment } from '../types';

interface QuoteContextType {
  quote: InstaQuote;
  updateQuote: (quote: string) => void;
  updateAuthor: (author: string) => void;
  updateImages: (images: File[]) => void;
  updateStyle: (style: Partial<QuoteStyle>) => void;
  updateBackgroundStyle: (style: BackgroundStyle) => void;
  resetQuote: () => void;
}

const initialStyle: QuoteStyle = {
  font: 'display',
  color: '#ffffff',
  fontSize: 48,
  alignment: 'center',
  opacity: 1,
  shadowColor: '#000000',
  shadowBlur: 5,
};

const initialQuote: InstaQuote = {
  images: [],
  imageUrls: [],
  quote: 'Your quote goes here...',
  author: 'Your Name',
  style: initialStyle,
  backgroundStyle: 'blurred',
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quote, setQuote] = useState<InstaQuote>(initialQuote);

  const updateQuote = (text: string) => {
    setQuote((prev) => ({ ...prev, quote: text }));
  };

  const updateAuthor = (author: string) => {
    setQuote((prev) => ({ ...prev, author }));
  };

  const updateImages = (images: File[]) => {
    const imageUrls = images.map((image) => URL.createObjectURL(image));
    setQuote((prev) => ({ ...prev, images, imageUrls }));
  };

  const updateStyle = (style: Partial<QuoteStyle>) => {
    setQuote((prev) => ({
      ...prev,
      style: { ...prev.style, ...style },
    }));
  };

  const updateBackgroundStyle = (backgroundStyle: BackgroundStyle) => {
    setQuote((prev) => ({ ...prev, backgroundStyle }));
  };

  const resetQuote = () => {
    setQuote(initialQuote);
  };

  return (
    <QuoteContext.Provider
      value={{
        quote,
        updateQuote,
        updateAuthor,
        updateImages,
        updateStyle,
        updateBackgroundStyle,
        resetQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};