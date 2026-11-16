import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, ArrowUpRight } from 'lucide-react';
import { Artwork } from '../../types';
import { Frame } from '../common/Frame';
import { useAuth } from '../../context/AuthContext';
import { visitorService } from '../../services/visitor.service';

interface ArtworkCardProps {
  artwork: Artwork;
  priority?: boolean;
  onFavouriteChange?: (artworkId: string, isFav: boolean) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  priority = false,
  onFavouriteChange,
}) => {
  const { user } = useAuth();
  const [isFavourited, setIsFavourited] = useState(artwork.isFavourited || false);
  const [isFavLoading, setIsFavLoading] = useState(false);

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (user.role !== 'VISITOR') return;

    try {
      setIsFavLoading(true);
      const res = await visitorService.toggleFavourite(artwork.id);
      setIsFavourited(res.data.isFavourited);
      if (onFavouriteChange) {
        onFavouriteChange(artwork.id, res.data.isFavourited);
      }
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
    } finally {
      setIsFavLoading(false);
    }
  };

  const formattedPrice = artwork.price
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
        artwork.price
      )
    : 'Price upon Request';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group flex flex-col justify-between"
    >
      <Link to={`/artworks/${artwork.slug}`} className="block relative">
        {/* Frame container */}
        <Frame style={artwork.frameStyle || 'natural-oak'}>
          <div className="relative overflow-hidden aspect-[4/5] bg-[#EAE2D5] flex items-center justify-center">
            <img
              src={artwork.primaryImageUrl}
              alt={artwork.title}
              loading={priority ? 'eager' : 'lazy'}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle dark gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141312]/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-[#FAF7F2]">
              <span className="text-xs uppercase tracking-widest text-[#D1BC8A] font-medium">
                {artwork.medium?.name || artwork.category.name}
              </span>
              <p className="text-xs text-[#EAE2D5] mt-0.5">{artwork.dimensions}</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <button
                onClick={handleToggleFav}
                disabled={isFavLoading}
                aria-label="Add to favourites"
                className={`p-2 rounded-full transition-all duration-300 shadow-md ${
                  isFavourited
                    ? 'bg-[#B49A65] text-white scale-110'
                    : 'bg-black/40 text-white/80 hover:text-white hover:bg-black/70'
                }`}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavourited ? 'fill-current text-white' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </Frame>
      </Link>

      {/* Museum Placard */}
      <div className="mt-3.5 px-1">
        <div className="flex items-start justify-between gap-2">
          <div className="truncate">
            <Link
              to={`/artworks/${artwork.slug}`}
              className="font-serif text-lg text-[#252321] hover:text-[#B49A65] transition-colors truncate block font-medium"
            >
              {artwork.title}
            </Link>
            <Link
              to={`/artists/${artwork.artist.slug}`}
              className="text-xs uppercase tracking-widest text-[#858078] hover:text-[#252321] transition-colors block mt-0.5"
            >
              {artwork.artist.name}
            </Link>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-medium text-[#47382F] tracking-wide block">
              {artwork.isEnquiryOnly ? 'Enquire' : formattedPrice}
            </span>
            <span className="text-[10px] text-[#858078] block">
              {artwork.creationYear}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

