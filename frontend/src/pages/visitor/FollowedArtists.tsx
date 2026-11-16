import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { visitorService } from '../../services/visitor.service';
import { ArtistProfile } from '../../types';

export const FollowedArtists: React.FC = () => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowed = async () => {
      try {
        const res = await visitorService.getFollowedArtists();
        if (res.success) setArtists(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowed();
  }, []);

  return (
    <DashboardLayout
      title="Following Studio Lineages"
      subtitle="Keep track of traditional master artists whose evolving oeuvre you support."
    >
      <div className="space-y-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-[#EAE2D5] animate-pulse" />
            ))}
          </div>
        ) : artists.length === 0 ? (
          <div className="py-24 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
            <Users className="w-12 h-12 text-[#858078] mx-auto mb-2" />
            <h3 className="font-serif text-2xl text-[#252321]">Not Following Any Artists Yet</h3>
            <p className="text-xs text-[#858078] mt-1">
              Visit master artists’ profiles and click Follow to subscribe to their atelier dispatches.
            </p>
            <Link
              to="/artists"
              className="mt-4 inline-block px-6 py-2.5 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-widest"
            >
              Browse Artists Directory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 flex flex-col justify-between shadow-sm hover:border-[#B49A65] transition-all"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={artist.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                      alt={artist.name}
                      className="w-14 h-14 rounded-full object-cover border border-[#B49A65]"
                    />
                    <div>
                      <h4 className="font-serif text-lg text-[#252321] font-semibold">{artist.name}</h4>
                      {artist.location && (
                        <p className="text-xs text-[#858078] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#B49A65]" />
                          {artist.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#47382F] font-medium">{artist.speciality}</p>
                  <p className="text-xs text-[#858078] line-clamp-2 mt-2 leading-relaxed">{artist.bio}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2D9CB] flex items-center justify-between">
                  <span className="text-xs text-[#858078]">
                    {artist._count?.artworks || 0} Catalogued Works
                  </span>
                  <Link
                    to={`/artists/${artist.slug}`}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#252321] hover:text-[#B49A65] font-semibold"
                  >
                    View Studio <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

