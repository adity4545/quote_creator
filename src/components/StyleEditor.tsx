import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { AlignLeft, AlignCenter, AlignRight, PlusCircle, MinusCircle } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { BackgroundStyle, Font, TextAlignment } from '../types';

const StyleEditor: React.FC = () => {
  const { quote, updateStyle, updateBackgroundStyle } = useQuote();
  const { style, backgroundStyle } = quote;

  const fontOptions: { value: Font; label: string }[] = [
    { value: 'sans', label: 'Sans' },
    { value: 'serif', label: 'Serif' },
    { value: 'mono', label: 'Mono' },
    { value: 'display', label: 'Display' },
    { value: 'heading', label: 'Heading' },
  ];

  const backgroundOptions: { value: BackgroundStyle; label: string }[] = [
    { value: 'collage', label: 'Collage' },
  ];

  return (
    <div className="space-y-6 text-neutral-200">
      <div>
        <label className="block text-sm font-medium mb-2">Font Family</label>
        <div className="grid grid-cols-3 gap-2">
          {fontOptions.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => updateStyle({ font: font.value })}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                style.font === font.value
                  ? 'bg-primary-900/50 text-primary-400 border border-primary-700'
                  : 'bg-neutral-700 text-neutral-200 border border-neutral-600 hover:bg-neutral-600'
              }`}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Font Size</label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => updateStyle({ fontSize: Math.max(style.fontSize - 4, 16) })}
            className="p-1 rounded-md text-neutral-300 hover:bg-neutral-700"
            aria-label="Decrease font size"
          >
            <MinusCircle className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-neutral-700 rounded-md px-3 py-2 text-center font-medium">
            {style.fontSize}px
          </div>
          <button
            type="button"
            onClick={() => updateStyle({ fontSize: Math.min(style.fontSize + 4, 96) })}
            className="p-1 rounded-md text-neutral-300 hover:bg-neutral-700"
            aria-label="Increase font size"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Text Alignment</label>
        <div className="flex space-x-2">
          {(['left', 'center', 'right'] as TextAlignment[]).map((alignment) => (
            <button
              key={alignment}
              type="button"
              onClick={() => updateStyle({ alignment })}
              className={`flex-1 py-2 rounded-md transition-colors flex justify-center ${
                style.alignment === alignment
                  ? 'bg-primary-900/50 text-primary-400 border border-primary-700'
                  : 'bg-neutral-700 text-neutral-300 border border-neutral-600 hover:bg-neutral-600'
              }`}
              aria-label={`Align ${alignment}`}
            >
              {alignment === 'left' && <AlignLeft className="w-5 h-5" />}
              {alignment === 'center' && <AlignCenter className="w-5 h-5" />}
              {alignment === 'right' && <AlignRight className="w-5 h-5" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Text Color</label>
        <HexColorPicker color={style.color} onChange={(color) => updateStyle({ color })} className="w-full mb-2" />
        <div className="flex items-center mt-2">
          <div
            className="w-8 h-8 rounded border border-neutral-600"
            style={{ backgroundColor: style.color }}
          />
          <input
            type="text"
            value={style.color}
            onChange={(e) => updateStyle({ color: e.target.value })}
            className="flex-1 ml-2 px-3 py-1 bg-neutral-700 border border-neutral-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Text Opacity: {Math.round(style.opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={style.opacity}
          onChange={(e) => updateStyle({ opacity: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Text Shadow: {style.shadowBlur}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={style.shadowBlur}
          onChange={(e) => updateStyle({ shadowBlur: parseInt(e.target.value, 10) })}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Background Style</label>
        <div className="grid grid-cols-2 gap-2">
          {backgroundOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateBackgroundStyle(option.value)}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                backgroundStyle === option.value
                  ? 'bg-primary-900/50 text-primary-400 border border-primary-700'
                  : 'bg-neutral-700 text-neutral-200 border border-neutral-600 hover:bg-neutral-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleEditor