import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Globe,
  Instagram,
  MessageSquare,
  Users,
  Award,
  Sparkles,
  Heart,
  Palette,
} from 'lucide-react';
import { ArtistProfile } from '../../types';
import { artistService } from '../../services/artist.service';
import { useAuth } from '../../context/AuthContext';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';
import { EnquiryModal } from '../../components/common/EnquiryModal';

export const ArtistProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [artist, setArtist] = useState<(ArtistProfile & { isFollowing?: boolean }) | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await artistService.getArtistById(slug);
        if (res.success && res.data) {
          setArtist(res.data);
          setIsFollowing(res.data.isFollowing || false);
          setFollowersCount(res.data._count?.followers || 0);
        }
      } catch (err) {
        console.error('Failed to load artist profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleToggleFollow = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (user.role !== 'VISITOR' || !artist) return;

    try {
      setIsFollowLoading(true);
      const res = await artistService.toggleFollow(artist.id);
      setIsFollowing(res.data.following);
      setFollowersCount((prev) => (res.data.following ? prev + 1 : Math.max(0, prev - 1)));
    } catch (err) {
      console.error(err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8">
        <div className="h-64 bg-[#EAE2D5]" />
        <div className="h-12 bg-[#EAE2D5] w-1/3" />
        <div className="h-24 bg-[#EAE2D5] w-2/3" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto">
        <h2 className="font-serif text-3xl text-[#252321]">Artist Studio Not Found</h2>
        <p className="text-xs text-[#858078] mt-2">The requested artist profile is not available.</p>
        <Link
          to="/artists"
          className="inline-block mt-4 px-6 py-2 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-wider"
        >
          View All Artists
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Studio Header Banner */}
      <div className="relative h-64 sm:h-80 bg-[#252321] overflow-hidden">
        {artist.coverImage && (
          <img
            src={artist.coverImage}
            alt=""
            className="w-full h-full object-cover opacity-40 filter saturate-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E8] via-transparent to-transparent" />
      </div>

      {/* Main Profile Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 relative z-10 space-y-16">
        <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-10 shadow-gallery flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-[#EAE2D5] border-4 border-[#FAF7F2] shadow-xl shrink-0">
              <img
                src={artist.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#B49A65] font-semibold">
                Traditional Master
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
                {artist.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#47382F] font-medium">{artist.speciality}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#858078] pt-1">
                {artist.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B49A65]" />
                    {artist.location}
                  </span>
                )}
                {artist.yearsOfExperience && (
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#B49A65]" />
                    {artist.yearsOfExperience} Years of Lineage
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#B49A65]" />
                  {followersCount} Collectors Following
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest transition-all shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#B49A65]" />
              Commission Enquiry
            </button>

            <button
              onClick={handleToggleFollow}
              disabled={isFollowLoading}
              className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 border text-xs uppercase tracking-widest transition-all ${
                isFollowing
                  ? 'border-[#B49A65] bg-[#B49A65] text-[#FAF7F2]'
                  : 'border-[#47382F] text-[#47382F] hover:bg-[#47382F] hover:text-[#FAF7F2]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFollowing ? 'fill-current' : ''}`} />
              {isFollowing ? 'Following' : 'Follow Studio'}
            </button>

            {/* Social links */}
            {artist.website && (
              <a
                href={artist.website}
                target="_blank"
                rel="noreferrer"
                className="p-3 border border-[#D8CEBF] text-[#47382F] hover:bg-[#EAE2D5] transition-colors"
                title="Artist Personal Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {artist.instagram && (
              <a
                href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 border border-[#D8CEBF] text-[#47382F] hover:bg-[#EAE2D5] transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Biography & Artist Philosophy (Statement) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E2D9CB] p-8 space-y-4">
            <h2 className="font-serif text-2xl text-[#252321]">Studio Biography</h2>
            <p className="text-sm text-[#47382F] font-light leading-relaxed whitespace-pre-line">
              {artist.bio || 'Biography details currently being archived.'}
            </p>
          </div>

          <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#B49A65]/40 p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A65] font-semibold">
              <Sparkles className="w-4 h-4" /> Artist Manifesto & Philosophy
            </div>
            <blockquote className="font-serif text-base sm:text-lg italic text-[#252321] leading-relaxed">
              "{artist.statement || 'The hands retain memory that the eye alone cannot decipher.'}"
            </blockquote>
            {artist.disciplines && (
              <div className="pt-2 text-xs text-[#858078]">
                <strong>Physical Media:</strong> {artist.disciplines}
              </div>
            )}
          </div>
        </div>

        {/* Complete Portfolio Gallery Wall */}
        <div className="space-y-8">
          <div className="flex items-end justify-between border-b border-[#E2D9CB] pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-1">
                Studio Catalog
              </span>
              <h2 className="font-serif text-3xl text-[#252321]">
                Masterpiece Portfolio ({artist.artworks?.length || 0})
              </h2>
            </div>
          </div>

          {artist.artworks && artist.artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {artist.artworks.map((art) => (
                <ArtworkCard
                  key={art.id}
                  artwork={{
                    ...art,
                    artist: {
                      id: artist.id,
                      name: artist.name,
                      slug: artist.slug,
                      speciality: artist.speciality,
                      profileImage: artist.profileImage,
                      userId: artist.userId,
                      featured: artist.featured,
                    },
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
              <Palette className="w-10 h-10 text-[#858078] mx-auto mb-2" />
              <p className="text-xs text-[#858078]">No catalogued artworks published yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Commission Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        artistId={artist.id}
        artistName={artist.name}
      />
    </div>
  );
};

