export type Font = 'sans' | 'serif' | 'mono' | 'display' | 'heading';

export type TextAlignment = 'left' | 'center' | 'right';

export type BackgroundStyle = 'collage' | 'blurred' | 'split' | 'gradient';

export interface QuoteStyle {
  font: Font;
  color: string;
  fontSize: number;
  alignment: TextAlignment;
  opacity: number;
  shadowColor: string;
  shadowBlur: number;
}

export interface InstaQuote {
  images: File[];
  imageUrls: string[];
  quote: string;
  author: string;
  style: QuoteStyle;
  backgroundStyle: BackgroundStyle;
}