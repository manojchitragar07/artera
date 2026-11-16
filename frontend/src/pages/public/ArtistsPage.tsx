import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { ArtistProfile } from '../../types';
import { artistService } from '../../services/artist.service';

export const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const res = await artistService.getArtists({ search: search || undefined, limit: 20 });
        if (res.success) {
          setArtists(res.data);
        }
      } catch (err) {
        console.error('Failed to load artists directory:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchArtists, 250);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-2">
          Atelier Masters
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#252321]">
          Master Artists Directory
        </h1>
        <p className="text-sm text-[#858078] mt-3 font-light leading-relaxed">
          Discover traditional painters, bronze sculptors, and ceramists preserving physical heritage across the globe.
        </p>

        {/* Search */}
        <div className="mt-8 relative max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858078]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by artist name, speciality, or region..."
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] placeholder-[#858078]"
          />
        </div>
      </div>

      {/* Artists Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-[#EAE2D5] animate-pulse" />
          ))}
        </div>
      ) : artists.length === 0 ? (
        <div className="py-20 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
          <h3 className="font-serif text-2xl text-[#252321]">No Artists Found</h3>
          <p className="text-xs text-[#858078] mt-1">Try another search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 flex flex-col justify-between group hover:border-[#B49A65] transition-all shadow-sm hover:shadow-gallery"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={artist.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#B49A65]/40"
                  />
                  <div>
                    <h3 className="font-serif text-xl text-[#252321] group-hover:text-[#B49A65] transition-colors">
                      {artist.name}
                    </h3>
                    {artist.location && (
                      <p className="text-xs text-[#858078] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#B49A65]" />
                        {artist.location}
                      </p>
                    )}
                    {artist.yearsOfExperience && (
                      <p className="text-[10px] text-[#B49A65] uppercase tracking-widest mt-1">
                        {artist.yearsOfExperience} Years of Lineage
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-[#47382F] font-medium mb-2">{artist.speciality}</div>
                <p className="text-xs text-[#858078] line-clamp-3 leading-relaxed">{artist.bio}</p>

                {/* Portfolio Preview Mini Strip */}
                {artist.artworks && artist.artworks.length > 0 && (
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {artist.artworks.map((art) => (
                      <div key={art.id} className="aspect-square bg-[#EAE2D5] overflow-hidden">
                        <img
                          src={art.primaryImageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2D9CB] flex items-center justify-between">
                <span className="text-xs text-[#858078]">
                  {artist._count?.artworks || 0} Catalogued Works
                </span>
                <Link
                  to={`/artists/${artist.slug}`}
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#252321] font-medium group-hover:text-[#B49A65]"
                >
                  Enter Studio <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

