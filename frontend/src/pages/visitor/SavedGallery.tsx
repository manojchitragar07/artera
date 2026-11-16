import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Sparkles } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { visitorService } from '../../services/visitor.service';
import { Artwork } from '../../types';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';

export const SavedGallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    setLoading(true);
    try {
      const res = await visitorService.getFavourites();
      if (res.success) {
        setArtworks(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleFavouriteChange = (artworkId: string, isFav: boolean) => {
    if (!isFav) {
      setArtworks((prev) => prev.filter((a) => a.id !== artworkId));
    }
  };

  return (
    <DashboardLayout
      title="Private Salon Wall"
      subtitle="Your curated sanctuary of traditional masterpieces collected across exhibitions."
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-4">
          <p className="text-xs text-[#858078]">
            Displaying <strong className="text-[#252321]">{artworks.length}</strong> saved works in personal gallery-wall arrangement.
          </p>
          <Link
            to="/explore"
            className="text-xs uppercase tracking-widest text-[#B49A65] hover:text-[#252321] font-semibold"
          >
            Discover More Works →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[#EAE2D5] animate-pulse" />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="py-24 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
            <Heart className="w-12 h-12 text-[#858078] mx-auto mb-3" />
            <h3 className="font-serif text-2xl text-[#252321]">Your Gallery Wall is Empty</h3>
            <p className="text-xs text-[#858078] mt-1 max-w-sm mx-auto">
              As you explore the public halls, click the heart on any painting or sculpture to hang it in your private salon.
            </p>
            <Link
              to="/explore"
              className="mt-6 inline-block px-8 py-3 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-widest"
            >
              Enter Exhibition Halls
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
            {artworks.map((art, idx) => {
              const offsetClass =
                idx % 3 === 1 ? 'lg:translate-y-8' : idx % 3 === 2 ? 'lg:-translate-y-4' : '';
              return (
                <div key={art.id} className={offsetClass}>
                  <ArtworkCard artwork={art} onFavouriteChange={handleFavouriteChange} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

