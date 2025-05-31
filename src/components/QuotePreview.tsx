import React, { useEffect, useRef, useState } from 'react';
import { useQuote } from '../context/QuoteContext';
import { InstaQuote } from '../types';

const QuotePreview: React.FC = () => {
  const { quote } = useQuote();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg' | 'jpg' | 'webp'>('png');
  const [fitMode] = useState<'cover'>('cover');

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (quote.imageUrls.length > 0) {
      const images: HTMLImageElement[] = [];
      const loadImages = async () => {
        for (const url of quote.imageUrls) {
          const img = new Image();
          img.src = url;
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
          });
          images.push(img);
        }

        switch (quote.backgroundStyle) {
          case 'collage':
            drawCollage(ctx, images, canvas.width, canvas.height);
            break;
          case 'blend':
            drawBlend(ctx, images, canvas.width, canvas.height, quote.style.imageOpacity ?? 1);
            break;
          default:
            drawCollage(ctx, images, canvas.width, canvas.height);
        }

        drawQuoteText(ctx, quote, canvas.width, canvas.height);
      };

      loadImages();
    } else {
      drawQuoteText(ctx, quote, canvas.width, canvas.height);
    }
  }, [quote, fitMode]);

  const drawCollage = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number
  ) => {
    const gap = 16; // px
    const radius = 48; // px border radius
    ctx.save();
    const count = images.length;
    if (count === 0) {
      ctx.restore();
      return;
    }
    // Compute grid size
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const cellWidth = (width - gap * (cols + 1)) / cols;
    const cellHeight = (height - gap * (rows + 1)) / rows;
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = gap + col * (cellWidth + gap);
      const y = gap + row * (cellHeight + gap);
      drawImageWithRadius(ctx, images[i], x, y, cellWidth, cellHeight, radius, imageDrawFn);
    }
    ctx.restore();
  };

  // Helper to draw image with border radius
  const drawImageWithRadius = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    drawImageFn: (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, width: number, height: number) => void
  ) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
    drawImageFn(ctx, img, x, y, width, height);
    ctx.restore();
  };

  // Helper to draw an image covering the area (may crop)
  const drawImageCovered = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const imgRatio = img.width / img.height;
    const rectRatio = width / height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > rectRatio) {
      drawHeight = height;
      drawWidth = img.width * (drawHeight / img.height);
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = width;
      drawHeight = img.height * (drawWidth / img.width);
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    }

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
  };

  // Always use cover mode for image drawing
  const imageDrawFn = drawImageCovered;

  const drawQuoteText = (
    ctx: CanvasRenderingContext2D,
    quote: InstaQuote,
    width: number,
    height: number
  ) => {
    const { style } = quote;
    const text = `"${quote.quote}"`;
    const author = quote.author;

    ctx.textAlign = style.alignment as CanvasTextAlign;
    ctx.fillStyle = style.color;
    ctx.globalAlpha = style.opacity;

    let fontFamily;
    switch (style.font) {
      case 'sans':
        fontFamily = 'Inter, sans-serif';
        break;
      case 'serif':
        fontFamily = 'Georgia, serif';
        break;
      case 'mono':
        fontFamily = 'monospace';
        break;
      case 'display':
        fontFamily = 'Playfair Display, serif';
        break;
      case 'heading':
        fontFamily = 'Poppins, sans-serif';
        break;
      case 'roboto':
        fontFamily = 'Roboto, sans-serif';
        break;
      case 'lobster':
        fontFamily = 'Lobster, cursive';
        break;
      case 'pacifico':
        fontFamily = 'Pacifico, cursive';
        break;
      case 'oswald':
        fontFamily = 'Oswald, sans-serif';
        break;
      case 'montserrat':
        fontFamily = 'Montserrat, sans-serif';
        break;
      case 'dancing':
        fontFamily = 'Dancing Script, cursive';
        break;
      default:
        fontFamily = 'Inter, sans-serif';
    }

    const maxWidth = width * 0.8;
    const maxBoxHeight = height * 0.7; // Allow some margin
    let fontSize = style.fontSize;
    const minFontSize = 14;
    let lines: string[] = [];
    let lineHeight = fontSize * 1.2;
    let boxHeight = 0;
    let fits = false;
    // Try to fit text by reducing font size if needed
    while (!fits && fontSize >= minFontSize) {
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      lineHeight = fontSize * 1.2;
      const words = text.split(' ');
      let line = '';
      lines = [];
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      // Calculate box height
      boxHeight = lines.length * lineHeight + (author ? lineHeight * 1.5 : 0) + 32 + 32; // boxPaddingY
      if (boxHeight <= maxBoxHeight) {
        fits = true;
      } else {
        fontSize -= 2;
      }
    }
    // If still doesn't fit, just use minFontSize
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    lineHeight = fontSize * 1.2;

    let x;
    switch (style.alignment) {
      case 'left':
        x = width * 0.1;
        break;
      case 'right':
        x = width * 0.9;
        break;
      default:
        x = width / 2;
    }

    const boxPaddingX = 40;
    const boxPaddingY = 32;
    const boxWidth = maxWidth + boxPaddingX;
    // Center the box vertically
    const y = height / 2 - boxHeight / 2 + boxPaddingY / 2 + lineHeight;
    let boxX;
    if (style.alignment === 'left') {
      boxX = x;
    } else if (style.alignment === 'right') {
      boxX = x - boxWidth;
    } else {
      boxX = x - boxWidth / 2;
    }
    const boxY = y - boxPaddingY / 2 - lineHeight;
    // Draw glassmorphic background
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.filter = 'blur(0.1px)';
    ctx.fillStyle = 'rgba(8,8,16,0.70)';
    ctx.beginPath();
    ctx.moveTo(boxX + 32, boxY);
    ctx.lineTo(boxX + boxWidth - 32, boxY);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + 32);
    ctx.lineTo(boxX + boxWidth, boxY + boxHeight - 32);
    ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - 32, boxY + boxHeight);
    ctx.lineTo(boxX + 32, boxY + boxHeight);
    ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - 32);
    ctx.lineTo(boxX, boxY + 32);
    ctx.quadraticCurveTo(boxX, boxY, boxX + 32, boxY);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    ctx.restore();
    // Draw text with shadow
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    let drawY = y;
    for (const l of lines) {
      ctx.fillText(l, x, drawY);
      drawY += lineHeight;
    }
    if (author) {
      ctx.font = `italic ${fontSize * 0.5}px ${fontFamily}`;
      ctx.fillText(`— ${author}`, x, y + lines.length * lineHeight + lineHeight * 0.5);
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };

  const drawBlend = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number,
    opacity: number
  ) => {
    ctx.save();
    images.forEach(img => {
      ctx.globalAlpha = opacity;
      imageDrawFn(ctx, img, 0, 0, width, height);
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col md:flex-row items-center w-full mb-4 gap-3">
        <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl shadow px-3 py-2 border border-white/20">
          <span className="text-sm text-white/80 font-semibold mr-2">Image Fit:</span>
          <span className="text-primary-300 font-bold text-base">Cover (fill, may crop)</span>
        </div>
        <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl shadow px-3 py-2 border border-white/20">
          <label htmlFor="format-select" className="text-sm text-white/80 font-semibold mr-2">Download as:</label>
          <select
            id="format-select"
            value={downloadFormat}
            onChange={e => setDownloadFormat(e.target.value as 'png' | 'jpeg' | 'jpg' | 'webp')}
            className="bg-transparent border-none text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-md transition-all hover:bg-primary-700/20 cursor-pointer"
          >
            <option value="png" className="text-black">PNG</option>
            <option value="jpeg" className="text-black">JPEG</option>
            <option value="jpg" className="text-black">JPG</option>
            <option value="webp" className="text-black">WEBP</option>
          </select>
        </div>
      </div>
      <div className="w-full mb-6 aspect-square relative rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center border-2 border-white/20" style={{background: 'linear-gradient(135deg, #1e293b 0%, #6366f1 100%)'}}>
        {/* Canvas overlay with glassmorphic effect */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{background: 'linear-gradient(120deg,rgba(255,255,255,0.08) 0%,rgba(99,102,241,0.08) 100%)', backdropFilter: 'blur(2px)'}} />
        <canvas
          ref={canvasRef}
          className="w-full h-full relative z-20 drop-shadow-2xl"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = `instaquote.${downloadFormat}`;
            let mimeType = 'image/png';
            if (downloadFormat === 'jpeg' || downloadFormat === 'jpg') {
              mimeType = 'image/jpeg';
            }
            if (downloadFormat === 'webp') mimeType = 'image/webp';
            link.href = canvasRef.current.toDataURL(mimeType);
            link.click();
          }
        }}
        disabled={quote.imageUrls.length === 0}
        className={`mt-2 w-full py-4 px-6 rounded-xl text-white font-extrabold text-lg tracking-wide shadow-xl transition-all duration-200 backdrop-blur-lg bg-gradient-to-r from-fuchsia-600 via-indigo-500 to-sky-400 border-none focus:outline-none focus:ring-2 focus:ring-primary-400 relative overflow-hidden
          ${quote.imageUrls.length === 0 ? 'bg-neutral-700 cursor-not-allowed opacity-60' : 'hover:scale-105 hover:from-fuchsia-700 hover:to-sky-300'}
        `}
        style={{boxShadow: '0 0 24px 0 rgba(99,102,241,0.25), 0 4px 32px 0 rgba(236,72,153,0.12)'}}
      >
        <span className="relative z-10">Download Image</span>
        {/* Glow effect */}
        <span className="absolute inset-0 z-0 rounded-xl bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-sky-300 opacity-30 blur-lg" />
      </button>
    </div>
  );
};

export default QuotePreview;