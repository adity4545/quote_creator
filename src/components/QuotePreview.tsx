import React, { useEffect, useRef } from 'react';
import { useQuote } from '../context/QuoteContext';
import { InstaQuote } from '../types';

const QuotePreview: React.FC = () => {
  const { quote } = useQuote();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadFormat, setDownloadFormat] = React.useState<'png' | 'jpeg' | 'jpg' | 'webp' >('png');

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
          case 'blurred':
            drawBlurred(ctx, images, canvas.width, canvas.height);
            break;
          case 'split':
            drawSplit(ctx, images, canvas.width, canvas.height);
            break;
          case 'gradient':
            drawGradient(ctx, images, canvas.width, canvas.height);
            break;
          default:
            drawBlurred(ctx, images, canvas.width, canvas.height);
        }

        drawQuoteText(ctx, quote, canvas.width, canvas.height);
      };

      loadImages();
    } else {
      drawQuoteText(ctx, quote, canvas.width, canvas.height);
    }
  }, [quote]);

  const drawCollage = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number
  ) => {
    const gap = 16; // px
    const radius = 32; // px border radius
    ctx.save();
    const count = Math.min(images.length, 4);
    if (count === 1) {
      const margin = 64;
      drawImageWithRadius(ctx, images[0], margin, margin, width - margin * 2, height - margin * 2, radius);
    } else if (count === 2) {
      const imgWidth = (width - gap * 3) / 2;
      const imgHeight = height - gap * 2;
      drawImageWithRadius(ctx, images[0], gap, gap, imgWidth, imgHeight, radius);
      drawImageWithRadius(ctx, images[1], imgWidth + gap * 2, gap, imgWidth, imgHeight, radius);
    } else if (count === 3) {
      const imgWidth = (width - gap * 3) / 2;
      const imgHeight = (height - gap * 3) / 2;
      drawImageWithRadius(ctx, images[0], gap, gap, imgWidth, imgHeight, radius);
      drawImageWithRadius(ctx, images[1], imgWidth + gap * 2, gap, imgWidth, imgHeight, radius);
      const bottomImgWidth = width - gap * 2;
      drawImageWithRadius(ctx, images[2], gap, imgHeight + gap * 2, bottomImgWidth, imgHeight, radius);
    } else if (count === 4) {
      // 2x2 grid
      const imgWidth = (width - gap * 3) / 2;
      const imgHeight = (height - gap * 3) / 2;
      drawImageWithRadius(ctx, images[0], gap, gap, imgWidth, imgHeight, radius);
      drawImageWithRadius(ctx, images[1], imgWidth + gap * 2, gap, imgWidth, imgHeight, radius);
      drawImageWithRadius(ctx, images[2], gap, imgHeight + gap * 2, imgWidth, imgHeight, radius);
      drawImageWithRadius(ctx, images[3], imgWidth + gap * 2, imgHeight + gap * 2, imgWidth, imgHeight, radius);
    }
    // Overlay for more than 4 images
    if (images.length > 4) {
      const imgWidth = (width - gap * 3) / 2;
      const imgHeight = (height - gap * 3) / 2;
      const x = imgWidth + gap * 2;
      const y = imgHeight + gap * 2;
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + imgWidth - radius, y);
      ctx.quadraticCurveTo(x + imgWidth, y, x + imgWidth, y + radius);
      ctx.lineTo(x + imgWidth, y + imgHeight - radius);
      ctx.quadraticCurveTo(x + imgWidth, y + imgHeight, x + imgWidth - radius, y + imgHeight);
      ctx.lineTo(x + radius, y + imgHeight);
      ctx.quadraticCurveTo(x, y + imgHeight, x, y + imgHeight - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 64px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`+${images.length - 4}`, x + imgWidth / 2, y + imgHeight / 2);
      ctx.restore();
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
    radius: number
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
    // Use drawImageCovered logic to cover the area
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
    ctx.restore();
  };

  const drawBlurred = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number
  ) => {
    if (images.length > 0) {
      drawImageCovered(ctx, images[0], 0, 0, width, height);
      
      ctx.filter = 'blur(15px)';
      drawImageCovered(ctx, images[0], 0, 0, width, height);
      ctx.filter = 'none';
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, width, height);
      
      const centerSize = width * 0.7;
      const offset = (width - centerSize) / 2;
      drawImageCovered(ctx, images[0], offset, offset, centerSize, centerSize);
    }
  };

  const drawSplit = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#222');
    gradient.addColorStop(1, '#444');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (images.length > 0) {
      const img = images[0];
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;
      
      let drawWidth, drawHeight;
      if (imgAspect > canvasAspect) {
        drawHeight = height / 2;
        drawWidth = drawHeight * imgAspect;
      } else {
        drawWidth = width / 2;
        drawHeight = drawWidth / imgAspect;
      }
      
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
    }
  };

  const drawGradient = (
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    width: number,
    height: number
  ) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#7e22ce');
    gradient.addColorStop(1, '#0891b2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    if (images.length > 0) {
      const size = width * 0.3;
      ctx.globalAlpha = 0.7;
      if (images[0]) drawImageCovered(ctx, images[0], 20, 20, size, size);
      if (images[1]) drawImageCovered(ctx, images[1], width - size - 20, 20, size, size);
      if (images[2]) drawImageCovered(ctx, images[2], 20, height - size - 20, size, size);
      ctx.globalAlpha = 1;
    }
  };

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

  const drawQuoteText = (
    ctx: CanvasRenderingContext2D,
    quote: InstaQuote,
    width: number,
    height: number
  ) => {
    const { style } = quote;
    const text = quote.quote;
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
      default:
        fontFamily = 'Inter, sans-serif';
    }

    ctx.shadowColor = style.shadowColor;
    ctx.shadowBlur = style.shadowBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const fontSize = style.fontSize;
    ctx.font = `bold ${fontSize}px ${fontFamily}`;

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

    const maxWidth = width * 0.8;
    const lineHeight = fontSize * 1.2;
    const words = text.split(' ');
    let line = '';
    let y = height / 2 - lineHeight * (words.length / 4);

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);

    if (author) {
      ctx.font = `italic ${fontSize * 0.5}px ${fontFamily}`;
      ctx.fillText(`— ${author}`, x, y + lineHeight * 1.5);
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mb-4 aspect-square relative border border-neutral-700 rounded-lg overflow-hidden shadow-lg bg-neutral-800">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
      <div className="flex items-center w-full mb-2 space-x-2">
        <label htmlFor="format-select" className="text-sm text-neutral-300">Download as:</label>
        <select
          id="format-select"
          value={downloadFormat}
          onChange={e => setDownloadFormat(e.target.value as 'png' | 'jpeg' | 'jpg' | 'webp')}
          className="bg-neutral-700 border border-neutral-600 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WEBP</option>
        </select>
      </div>
      <button
        type="button"
        onClick={() => {
          if (canvasRef.current) {
            const link = document.createElement('a');
            let ext = downloadFormat;
            let mimeType = 'image/png';
            if (downloadFormat === 'jpeg' || downloadFormat === 'jpg') {
              mimeType = 'image/jpeg';
              ext = 'jpg';
            }
            if (downloadFormat === 'webp') mimeType = 'image/webp';
            link.download = `instaquote.${ext}`;
            link.href = canvasRef.current.toDataURL(mimeType);
            link.click();
          }
        }}
        disabled={quote.imageUrls.length === 0}
        className={`mt-2 w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
          quote.imageUrls.length === 0
            ? 'bg-neutral-700 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        Download Image
      </button>
    </div>
  );
};

export default QuotePreview;