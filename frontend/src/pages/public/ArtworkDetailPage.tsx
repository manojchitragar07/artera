import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Share2,
  MessageSquare,
  Maximize2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Ruler,
  MapPin,
} from 'lucide-react';
import { Artwork } from '../../types';
import { artworkService } from '../../services/artwork.service';
import { visitorService } from '../../services/visitor.service';
import { useAuth } from '../../context/AuthContext';
import { Frame } from '../../components/common/Frame';
import { Lightbox } from '../../components/common/Lightbox';
import { EnquiryModal } from '../../components/common/EnquiryModal';
import { ShareModal } from '../../components/common/ShareModal';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';

export const ArtworkDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isFavourited, setIsFavourited] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await artworkService.getArtworkById(id);
        if (res.success && res.data) {
          setArtwork(res.data);
          setIsFavourited(res.data.isFavourited || false);
          setSelectedImageIndex(0);
        }
      } catch (err) {
        console.error('Failed to load artwork detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
    window.scrollTo(0, 0);
  }, [id]);

  const handleToggleFav = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (user.role !== 'VISITOR' || !artwork) return;

    try {
      setIsFavLoading(true);
      const res = await visitorService.toggleFavourite(artwork.id);
      setIsFavourited(res.data.isFavourited);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-[4/5] bg-[#EAE2D5]" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-10 bg-[#EAE2D5] w-3/4" />
            <div className="h-4 bg-[#EAE2D5] w-1/2" />
            <div className="h-24 bg-[#EAE2D5] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto">
        <h2 className="font-serif text-3xl text-[#252321]">Masterpiece Not Found</h2>
        <p className="text-xs text-[#858078] mt-2">The requested artwork may have been archived.</p>
        <Link
          to="/explore"
          className="inline-block mt-4 px-6 py-2 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-wider"
        >
          Return to Gallery
        </Link>
      </div>
    );
  }

  const allImages = artwork.images && artwork.images.length > 0
    ? artwork.images.map((img) => ({ url: img.url, caption: img.caption || artwork.title }))
    : [{ url: artwork.primaryImageUrl, caption: artwork.title }];

  const currentDisplayUrl = allImages[selectedImageIndex]?.url || artwork.primaryImageUrl;

  const formattedPrice = artwork.price
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
        artwork.price
      )
    : 'Price upon Request';

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#858078]">
        <Link to="/explore" className="hover:text-[#252321]">
          Gallery
        </Link>
        <span>/</span>
        <Link to={`/explore?category=${artwork.category.slug}`} className="hover:text-[#252321]">
          {artwork.category.name}
        </Link>
        <span>/</span>
        <span className="text-[#252321] font-medium truncate">{artwork.title}</span>
      </div>

      {/* Main Exhibition Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Framed Primary Image & Thumbnail Strip */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative group">
            <Frame style={artwork.frameStyle || 'frame-gold'}>
              {/* Preserves original aspect ratio and prevents image stretching */}
              <div className="relative bg-[#FAF7F2] flex items-center justify-center min-h-[400px] max-h-[700px] overflow-hidden">
                <img
                  src={currentDisplayUrl}
                  alt={artwork.title}
                  className="max-h-[700px] w-auto h-auto max-w-full object-contain mx-auto"
                />

                {/* Inspect Lightbox Button */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-4 right-4 p-2.5 bg-black/60 hover:bg-black/85 text-white rounded-full transition-all shadow-lg"
                  title="Expand to Fullscreen Lightbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </Frame>
          </div>

          {/* Additional Photographs Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto py-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 transition-all p-0.5 bg-[#FAF7F2] ${
                    selectedImageIndex === idx ? 'border-[#B49A65] scale-105 shadow-md' : 'border-[#D8CEBF] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Museum Placard & Artist Information */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border-b border-[#E2D9CB] pb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold">
                {artwork.category.name}
              </span>
              <span className="text-xs px-2.5 py-0.5 bg-[#EAE2D5] text-[#47382F] uppercase tracking-wider font-medium">
                {artwork.isEnquiryOnly ? 'Direct Enquiry Only' : 'Available for Acquisition'}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#252321] leading-tight font-semibold">
              {artwork.title}
            </h1>

            {/* Price Placard */}
            <div className="pt-2 flex items-baseline justify-between">
              <span className="font-serif text-2xl sm:text-3xl text-[#252321]">
                {artwork.isEnquiryOnly ? 'Contact Studio' : formattedPrice}
              </span>
              <span className="text-xs text-[#858078] tracking-widest uppercase">
                Creation Year: {artwork.creationYear}
              </span>
            </div>
          </div>

          {/* Artist Vignette */}
          <div className="p-5 bg-[#FAF7F2] border border-[#E2D9CB] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={artwork.artist.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                alt={artwork.artist.name}
                className="w-14 h-14 rounded-full object-cover border border-[#B49A65]/40"
              />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#858078] block">Master Artist</span>
                <Link
                  to={`/artists/${artwork.artist.slug}`}
                  className="font-serif text-lg text-[#252321] hover:text-[#B49A65] font-medium"
                >
                  {artwork.artist.name}
                </Link>
                {artwork.artist.location && (
                  <p className="text-xs text-[#858078] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#B49A65]" />
                    {artwork.artist.location}
                  </p>
                )}
              </div>
            </div>

            <Link
              to={`/artists/${artwork.artist.slug}`}
              className="text-xs uppercase tracking-widest text-[#B49A65] hover:text-[#252321] font-semibold"
            >
              View Studio →
            </Link>
          </div>

          {/* Artwork Provenance & Specifications Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#FAF7F2] border border-[#E2D9CB]">
              <span className="text-[10px] uppercase tracking-wider text-[#858078] block flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#B49A65]" /> Medium
              </span>
              <p className="font-medium text-[#252321] mt-1">{artwork.medium?.name || 'Traditional Media'}</p>
            </div>

            <div className="p-3 bg-[#FAF7F2] border border-[#E2D9CB]">
              <span className="text-[10px] uppercase tracking-wider text-[#858078] block flex items-center gap-1">
                <Ruler className="w-3 h-3 text-[#B49A65]" /> Dimensions
              </span>
              <p className="font-medium text-[#252321] mt-1">{artwork.dimensions}</p>
            </div>

            <div className="p-3 bg-[#FAF7F2] border border-[#E2D9CB]">
              <span className="text-[10px] uppercase tracking-wider text-[#858078] block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#B49A65]" /> Year Completed
              </span>
              <p className="font-medium text-[#252321] mt-1">{artwork.creationYear}</p>
            </div>

            <div className="p-3 bg-[#FAF7F2] border border-[#E2D9CB]">
              <span className="text-[10px] uppercase tracking-wider text-[#858078] block flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#B49A65]" /> Provenance
              </span>
              <p className="font-medium text-[#252321] mt-1">Direct from Studio Archive</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg text-[#252321]">Curator & Artist Notes</h3>
            <p className="text-sm text-[#47382F] font-light leading-relaxed whitespace-pre-line">
              {artwork.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-[#B49A65]" />
              Inquire with Artist
            </button>

            <button
              onClick={handleToggleFav}
              disabled={isFavLoading}
              className={`px-5 py-3.5 border transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${
                isFavourited
                  ? 'border-[#B49A65] bg-[#B49A65] text-[#FAF7F2]'
                  : 'border-[#47382F] text-[#47382F] hover:bg-[#47382F] hover:text-[#FAF7F2]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavourited ? 'fill-current' : ''}`} />
              {isFavourited ? 'Saved' : 'Save'}
            </button>

            <button
              onClick={() => setIsShareOpen(true)}
              className="p-3.5 border border-[#D8CEBF] text-[#47382F] hover:bg-[#EAE2D5] transition-colors"
              title="Share Artwork"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Related Artworks Section */}
      {artwork.relatedArtworks && artwork.relatedArtworks.length > 0 && (
        <div className="pt-16 border-t border-[#E2D9CB]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#252321]">
              Related Masterpieces
            </h2>
            <Link
              to={`/explore?category=${artwork.category.slug}`}
              className="text-xs uppercase tracking-widest text-[#B49A65] hover:text-[#252321] font-semibold"
            >
              View More in {artwork.category.name} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {artwork.relatedArtworks.map((related) => (
              <ArtworkCard key={related.id} artwork={related} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={allImages}
        currentIndex={selectedImageIndex}
        onIndexChange={setSelectedImageIndex}
        artworkTitle={artwork.title}
        artistName={artwork.artist.name}
      />

      {/* Acquisition Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        artwork={artwork}
        artistId={artwork.artist.id}
        artistName={artwork.artist.name}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={artwork.title}
        url={window.location.href}
      />
    </div>
  );
};

