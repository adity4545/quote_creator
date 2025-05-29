import { Upload, X } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQuote } from '../context/QuoteContext';

const ImageUploader: React.FC = () => {
  const { quote, updateImages } = useQuote();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const images = [...quote.images, ...acceptedFiles];
      updateImages(images);
    },
    [updateImages, quote.images]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 100,
  });

  const removeImage = (index: number) => {
    const newImages = [...quote.images];
    newImages.splice(index, 1);
    updateImages(newImages);
  };

  const [editIndex, setEditIndex] = React.useState<number|null>(null);

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
          <p className="text-xs text-neutral-500">Upload as many images as you like (JPG, PNG, GIF)</p>
        </div>
      </div>

      {quote.imageUrls.length > 0 && (
        <div className={`grid gap-2`} style={{gridTemplateColumns: `repeat(auto-fill, minmax(96px, 1fr))`}}>
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
                className="absolute top-1 right-1 bg-neutral-900 bg-opacity-70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setEditIndex(index)}
                className="absolute bottom-1 right-1 bg-primary-700 bg-opacity-80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="Edit image"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 1 1 2.828 2.828L11.828 15.828a2 2 0 0 1-1.414.586H7v-3a2 2 0 0 1 .586-1.414z"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {editIndex !== null && quote.imageUrls[editIndex] && (
        <ImageEditModal
          imageUrl={quote.imageUrls[editIndex]}
          onClose={() => setEditIndex(null)}
          onSave={(editedUrl) => {
            // For now, just close the modal. Later, update the image.
            setEditIndex(null);
          }}
        />
      )}
    </div>
  );
};

const ImageEditModal: React.FC<{
  imageUrl: string;
  onClose: () => void;
  onSave: (editedUrl: string) => void;
}> = ({ imageUrl, onClose, onSave }) => {
  // For now, just preview the image and allow cancel/save
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative">
        <img src={imageUrl} alt="Edit" className="w-full h-64 object-contain rounded-xl mb-4 bg-neutral-100" />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-200 text-neutral-800 font-semibold hover:bg-neutral-300">Cancel</button>
          <button onClick={() => onSave(imageUrl)} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700">Save</button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader