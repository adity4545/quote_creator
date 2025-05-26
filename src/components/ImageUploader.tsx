import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Upload, X } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

const ImageUploader: React.FC = () => {
  const { quote, updateImages } = useQuote();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const images = acceptedFiles.slice(0, 3);
      updateImages(images);
    },
    [updateImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 3,
  });

  const removeImage = (index: number) => {
    const newImages = [...quote.images];
    newImages.splice(index, 1);
    updateImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? 'border-primary-500 bg-primary-900/20'
            : 'border-neutral-600 hover:border-primary-400 hover:bg-neutral-700/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload
            className={`w-12 h-12 mb-4 ${
              isDragActive ? 'text-primary-400' : 'text-neutral-400'
            }`}
          />
          <p className="text-neutral-200 font-medium mb-1">
            {isDragActive ? 'Drop images here...' : 'Drag & drop images here'}
          </p>
          <p className="text-neutral-400 text-sm mb-3">or click to browse files</p>
          <p className="text-xs text-neutral-500">Upload up to 3 images (JPG, PNG)</p>
        </div>
      </div>

      {quote.imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {quote.imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-neutral-900 bg-opacity-70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {Array.from({ length: 3 - quote.imageUrls.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-full h-24 border border-dashed border-neutral-600 rounded-md flex items-center justify-center bg-neutral-700/50"
            >
              <Image className="w-6 h-6 text-neutral-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader