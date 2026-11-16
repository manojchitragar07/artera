import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ url: string; caption?: string }>;
  currentIndex: number;
  onIndexChange: (index: number) => void;
  artworkTitle?: string;
  artistName?: string;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  artworkTitle,
  artistName,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') onIndexChange((currentIndex - 1 + images.length) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#141312]/95 backdrop-blur-md p-4 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Previous Image */}
        {images.length > 1 && (
          <button
            onClick={() => onIndexChange((currentIndex - 1 + images.length) % images.length)}
            className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-black/40 hover:bg-black/70 text-[#FAF7F2] transition-all hover:scale-105"
            aria-label="Previous artwork view"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Next Image */}
        {images.length > 1 && (
          <button
            onClick={() => onIndexChange((currentIndex + 1) % images.length)}
            className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-black/40 hover:bg-black/70 text-[#FAF7F2] transition-all hover:scale-105"
            aria-label="Next artwork view"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}

        {/* Main Artwork Presentation */}
        <div className="flex flex-col items-center max-w-6xl max-h-[90vh] w-full">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative flex items-center justify-center max-h-[75vh] w-full overflow-hidden"
          >
            <img
              src={currentImage.url}
              alt={currentImage.caption || artworkTitle || 'Artwork'}
              className="max-h-[75vh] max-w-full object-contain rounded-sm shadow-2xl"
            />
          </motion.div>

          {/* Placard Information */}
          <div className="mt-4 text-center text-[#EAE2D5]">
            {artworkTitle && (
              <h3 className="font-serif text-xl sm:text-2xl text-[#FAF7F2] tracking-wide">
                {artworkTitle}
              </h3>
            )}
            {artistName && (
              <p className="text-sm sm:text-base text-[#B49A65] tracking-widest uppercase mt-0.5">
                {artistName}
              </p>
            )}
            {currentImage.caption && (
              <p className="text-xs text-[#858078] italic mt-1">{currentImage.caption}</p>
            )}

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => onIndexChange(idx)}
                    className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                      idx === currentIndex ? 'border-[#B49A65] scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

