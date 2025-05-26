import React from 'react';
import { useQuote } from '../context/QuoteContext';

const QuoteInput: React.FC = () => {
  const { quote, updateQuote, updateAuthor } = useQuote();

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="quote" className="block text-sm font-medium text-neutral-200 mb-1">
          Quote Text
        </label>
        <textarea
          id="quote"
          rows={4}
          value={quote.quote}
          onChange={(e) => updateQuote(e.target.value)}
          placeholder="Enter your inspirational quote here..."
          className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-neutral-400"
        />
      </div>
      
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-neutral-200 mb-1">
          Author / Source (Optional)
        </label>
        <input
          id="author"
          type="text"
          value={quote.author}
          onChange={(e) => updateAuthor(e.target.value)}
          placeholder="Who said it?"
          className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-neutral-400"
        />
      </div>
    </div>
  );
};

export default QuoteInput