import React, { useState } from 'react';
import { IProductImage } from '../../types';

interface ImageGalleryProps {
  images: IProductImage[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
  const defaultImage =
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  const validImages = images && images.length > 0 ? images : [{ url: defaultImage, isPrimary: true }];

  // Find index of primary image or default to 0
  const primaryIndex = Math.max(
    0,
    validImages.findIndex((img) => img.isPrimary)
  );
  const [selectedIndex, setSelectedIndex] = useState(primaryIndex);

  const selectedImage = validImages[selectedIndex] || validImages[0];

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square sm:aspect-[4/3] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center p-2">
        <img
          src={selectedImage.url}
          alt={selectedImage.altText || productName}
          className="w-full h-full object-contain rounded-xl transition-all duration-300"
        />
      </div>

      {/* Thumbnails row */}
      {validImages.length > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
                selectedIndex === index
                  ? 'border-brand-600 ring-2 ring-brand-100 shadow-md scale-105'
                  : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image.url}
                alt={image.altText || `${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
