import { AlignCenter, AlignLeft, AlignRight, MinusCircle, PlusCircle } from 'lucide-react';
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { useQuote } from '../context/QuoteContext';
import { BackgroundStyle, Font, TextAlignment } from '../types';

const StyleEditor: React.FC = () => {
  const { quote, updateStyle, updateBackgroundStyle } = useQuote();
  const { style, backgroundStyle } = quote;

  const fontOptions: { value: Font; label: string; fontFamily?: string }[] = [
    { value: 'sans', label: 'Sans', fontFamily: 'Inter, sans-serif' },
    { value: 'serif', label: 'Serif', fontFamily: 'Georgia, serif' },
    { value: 'mono', label: 'Mono', fontFamily: 'monospace' },
    { value: 'display', label: 'Display', fontFamily: 'Playfair Display, serif' },
    { value: 'heading', label: 'Heading', fontFamily: 'Poppins, sans-serif' },
    { value: 'roboto', label: 'Roboto', fontFamily: 'Roboto, sans-serif' },
    { value: 'lobster', label: 'Lobster', fontFamily: 'Lobster, cursive' },
    { value: 'pacifico', label: 'Pacifico', fontFamily: 'Pacifico, cursive' },
    { value: 'oswald', label: 'Oswald', fontFamily: 'Oswald, sans-serif' },
    { value: 'montserrat', label: 'Montserrat', fontFamily: 'Montserrat, sans-serif' },
    { value: 'dancing', label: 'Dancing Script', fontFamily: 'Dancing Script, cursive' },
  ];

  const backgroundOptions: { value: BackgroundStyle; label: string }[] = [
    { value: 'collage', label: 'Collage' },
    { value: 'blend', label: 'Blend' },
  ];

  return (
    <div className="space-y-8 text-white">
      <div>
        <label className="block text-base font-semibold mb-2">Font Family</label>
        <div className="grid grid-cols-3 gap-3">
          {fontOptions.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => updateStyle({ font: font.value })}
              className={`px-4 py-2 text-base rounded-xl font-semibold transition-all shadow-md backdrop-blur-md ${
                style.font === font.value
                  ? 'bg-gradient-to-r from-primary-700 to-primary-400 text-white border-2 border-primary-300 scale-105'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-primary-700/30 hover:scale-105'
              }`}
              style={{ fontFamily: font.fontFamily }}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold mb-2">Font Size</label>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => updateStyle({ fontSize: Math.max(style.fontSize - 4, 16) })}
            className="p-2 rounded-xl text-white bg-primary-700/70 hover:bg-primary-500 transition-all shadow"
            aria-label="Decrease font size"
          >
            <MinusCircle className="w-6 h-6" />
          </button>
          <div className="flex-1 bg-white/10 rounded-xl px-4 py-2 text-center font-bold text-lg border border-white/20">
            {style.fontSize}px
          </div>
          <button
            type="button"
            onClick={() => updateStyle({ fontSize: Math.min(style.fontSize + 4, 96) })}
            className="p-2 rounded-xl text-white bg-primary-700/70 hover:bg-primary-500 transition-all shadow"
            aria-label="Increase font size"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold mb-2">Text Alignment</label>
        <div className="flex space-x-3">
          {(['left', 'center', 'right'] as TextAlignment[]).map((alignment) => (
            <button
              key={alignment}
              type="button"
              onClick={() => updateStyle({ alignment })}
              className={`flex-1 py-3 rounded-xl transition-all flex justify-center font-bold text-lg shadow-md backdrop-blur-md ${
                style.alignment === alignment
                  ? 'bg-gradient-to-r from-primary-700 to-primary-400 text-white border-2 border-primary-300 scale-105'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-primary-700/30 hover:scale-105'
              }`}
              aria-label={`Align ${alignment}`}
            >
              {alignment === 'left' && <AlignLeft className="w-6 h-6" />}
              {alignment === 'center' && <AlignCenter className="w-6 h-6" />}
              {alignment === 'right' && <AlignRight className="w-6 h-6" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold mb-2">Text Color</label>
        <HexColorPicker color={style.color} onChange={(color) => updateStyle({ color })} className="w-full mb-2 rounded-xl shadow" />
        <div className="flex items-center mt-2">
          <div
            className="w-10 h-10 rounded-xl border-2 border-white/30 shadow"
            style={{ backgroundColor: style.color }}
          />
          <input
            type="text"
            value={style.color}
            onChange={(e) => updateStyle({ color: e.target.value })}
            className="flex-1 ml-3 px-4 py-2 bg-white/10 border border-white/20 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 text-base text-white font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-base font-semibold mb-2">
          Text Opacity: {Math.round(style.opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={style.opacity}
          onChange={(e) => updateStyle({ opacity: parseFloat(e.target.value) })}
          className="w-full accent-primary-400 h-2 rounded-xl bg-white/20"
        />
      </div>

      <div>
        <label className="block text-base font-semibold mb-2">
          Text Shadow: {style.shadowBlur}px
        </label>
        <input
          type="range"
          min="0"
          max="20"
          value={style.shadowBlur}
          onChange={(e) => updateStyle({ shadowBlur: parseInt(e.target.value, 10) })}
          className="w-full accent-primary-400 h-2 rounded-xl bg-white/20"
        />
      </div>

      <div>
        <label className="block text-base font-semibold mb-2">Background Style</label>
        <div className="grid grid-cols-2 gap-3">
          {backgroundOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateBackgroundStyle(option.value)}
              className={`px-4 py-2 text-base rounded-xl font-semibold transition-all shadow-md backdrop-blur-md ${
                backgroundStyle === option.value
                  ? 'bg-gradient-to-r from-primary-700 to-primary-400 text-white border-2 border-primary-300 scale-105'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-primary-700/30 hover:scale-105'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {backgroundStyle === 'blend' && (
        <div>
          <label className="block text-base font-semibold mb-2">
            Image Opacity: {Math.round((style.imageOpacity ?? 1) * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={style.imageOpacity ?? 1}
            onChange={e => updateStyle({ imageOpacity: parseFloat(e.target.value) })}
            className="w-full accent-primary-400 h-2 rounded-xl bg-white/20"
          />
        </div>
      )}
    </div>
  );
};

export default StyleEditor