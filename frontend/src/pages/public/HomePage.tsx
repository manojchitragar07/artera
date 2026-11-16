import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, Feather, ShieldCheck } from 'lucide-react';
import { Artwork, ArtistProfile, Exhibition } from '../../types';
import { artworkService } from '../../services/artwork.service';
import { artistService } from '../../services/artist.service';
import { exhibitionService } from '../../services/exhibition.service';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';
import { Frame } from '../../components/common/Frame';

export const HomePage: React.FC = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<ArtistProfile[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [heroArtwork, setHeroArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksRes, artistsRes, exhRes] = await Promise.all([
          artworkService.getArtworks({ limit: 8, sortBy: 'featured' }),
          artistService.getArtists({ limit: 4, featured: true }),
          exhibitionService.getExhibitions({ limit: 4 }),
        ]);

        if (artworksRes.success && artworksRes.data.length > 0) {
          setFeaturedArtworks(artworksRes.data);
          setHeroArtwork(artworksRes.data[0]);
        }
        if (artistsRes.success) setFeaturedArtists(artistsRes.data);
        if (exhRes.success) setExhibitions(exhRes.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const disciplines = [
    {
      title: 'Canvas & Oil Painting',
      category: 'canvas-painting',
      desc: 'Renaissance glazes, rich impastos, and fine linen stretchers.',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Sketches & Charcoal',
      category: 'sketches-charcoal',
      desc: 'Raw vine charcoal and graphite studies capturing anatomical posture.',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Sculpture & Bronze',
      category: 'sculpture-bronze',
      desc: 'Ancestral lost-wax casting, molten foundry bronze, and chiseled stone.',
      image: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Pure Watercolour',
      category: 'watercolour',
      desc: 'Luminous washes and spontaneous blooms on archival cotton rag.',
      image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Woodfired Pottery',
      category: 'pottery-ceramics',
      desc: 'Anagama kiln stoneware and wild clay vessels shaped by flame and ash.',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Folk & Mineral Art',
      category: 'folk-cultural-art',
      desc: 'Crushed lapis lazuli, malachite, and 24K beaten gold leaf storytelling.',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAE2D5] border border-[#D8CEBF] text-xs uppercase tracking-widest text-[#47382F]">
              <Sparkles className="w-3.5 h-3.5 text-[#B49A65]" />
              A Sanctuary for Physical Mastery
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#252321] tracking-tight">
              Where Art <br />
              <span className="italic font-normal">Finds Its Place.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#47382F] font-light leading-relaxed max-w-xl">
              In an age of instant synthetic generation, ARTÉRA is the dedicated exhibition haven for manual, traditional artists. We celebrate the patient smell of linseed oil, the heat of the bronze foundry, and the raw grit of charcoal on rag paper.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-gallery hover:shadow-gallery-lg"
              >
                <Compass className="w-4 h-4 text-[#B49A65]" />
                Explore Gallery
              </Link>
              <Link
                to="/artists"
                className="inline-flex items-center gap-2 px-8 py-4 border border-[#B49A65] hover:bg-[#B49A65] hover:text-[#FAF7F2] text-[#252321] text-xs uppercase tracking-widest font-medium transition-all"
              >
                Discover Artists
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Hero Artwork Placard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5"
          >
            {heroArtwork ? (
              <div className="relative">
                <Frame style="frame-gold">
                  <div className="aspect-[4/5] overflow-hidden bg-[#EAE2D5]">
                    <img
                      src={heroArtwork.primaryImageUrl}
                      alt={heroArtwork.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </Frame>
                {/* Museum Placard */}
                <div className="mt-4 p-4 bg-[#FAF7F2] border border-[#E2D9CB] shadow-sm">
                  <span className="text-[10px] uppercase tracking-widest text-[#B49A65] font-semibold block">
                    Curator’s Inaugural Highlight
                  </span>
                  <h3 className="font-serif text-lg text-[#252321] mt-0.5">{heroArtwork.title}</h3>
                  <p className="text-xs text-[#858078] mt-0.5">
                    {heroArtwork.artist.name} — {heroArtwork.medium?.name || heroArtwork.category.name} ({heroArtwork.creationYear})
                  </p>
                  <Link
                    to={`/artworks/${heroArtwork.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-[#B49A65] hover:text-[#252321] font-medium mt-2"
                  >
                    View Exhibition Details & Provenance <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/5] bg-[#EAE2D5] animate-pulse" />
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED MASTERPIECES (ASYMMETRICAL GALLERY WALL) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#E2D9CB] pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-1">
              Curated Permanent Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252321]">
              Featured Masterpieces
            </h2>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#47382F] hover:text-[#B49A65] font-medium mt-4 sm:mt-0 transition-colors"
          >
            Enter Full Gallery Wall <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric Gallery Wall Arrangement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
          {featuredArtworks.slice(0, 6).map((art, idx) => (
            <div
              key={art.id}
              className={`${
                idx === 1 ? 'lg:translate-y-8' : idx === 2 ? 'lg:-translate-y-4' : ''
              }`}
            >
              <ArtworkCard artwork={art} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPLORE ARTISTIC DISCIPLINES */}
      <section className="bg-[#FAF7F2] py-20 border-y border-[#E2D9CB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-2">
              Physical Lineages & Mediums
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252321]">
              Artistic Disciplines
            </h2>
            <p className="text-sm text-[#858078] mt-3 leading-relaxed">
              Explore artworks organized by tactile craft. Every artwork exhibited on ARTÉRA has been shaped directly by human hands.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {disciplines.map((d) => (
              <Link
                key={d.category}
                to={`/explore?category=${d.category}`}
                className="group relative overflow-hidden bg-[#F5F0E8] border border-[#E2D9CB] shadow-sm hover:shadow-gallery transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-[#252321] group-hover:text-[#B49A65] transition-colors">
                      {d.title}
                    </h3>
                    <p className="text-xs text-[#858078] mt-2 leading-relaxed">{d.desc}</p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs text-[#47382F] font-medium uppercase tracking-wider">
                    <span>View Category</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED MASTER ARTISTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#E2D9CB] pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-1">
              Atelier Masters
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252321]">
              Featured Traditional Artists
            </h2>
          </div>
          <Link
            to="/artists"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#47382F] hover:text-[#B49A65] font-medium mt-4 sm:mt-0 transition-colors"
          >
            Meet All Masters <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredArtists.map((artist) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 flex flex-col justify-between group hover:border-[#B49A65]/60 transition-all shadow-sm"
            >
              <div>
                <div className="aspect-square overflow-hidden mb-5 bg-[#EAE2D5]">
                  <img
                    src={artist.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#B49A65] font-medium block">
                  {artist.location || 'Studio'}
                </span>
                <h3 className="font-serif text-xl text-[#252321] mt-1 group-hover:text-[#B49A65] transition-colors">
                  {artist.name}
                </h3>
                <p className="text-xs text-[#858078] mt-2 line-clamp-2">{artist.speciality}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2D9CB]">
                <Link
                  to={`/artists/${artist.slug}`}
                  className="inline-flex items-center justify-between w-full text-xs uppercase tracking-wider text-[#252321] font-medium hover:text-[#B49A65]"
                >
                  <span>View Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CURATED EXHIBITIONS */}
      <section className="bg-[#1C1A19] text-[#FAF7F2] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 border-b border-[#3A3633] pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-1">
                Virtual Museum Halls
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2]">
                Curated Digital Exhibitions
              </h2>
            </div>
            <Link
              to="/exhibitions"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#D1BC8A] hover:text-[#FAF7F2] font-medium mt-4 sm:mt-0 transition-colors"
            >
              Explore All Exhibitions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {exhibitions.map((exh) => (
              <Link
                key={exh.id}
                to={`/exhibitions/${exh.slug}`}
                className="group relative flex flex-col bg-[#252321] border border-[#3A3633] overflow-hidden hover:border-[#B49A65]/50 transition-all"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={exh.coverImage}
                    alt={exh.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#B49A65] uppercase tracking-widest mb-2">
                      <span>{exh.status}</span>
                      <span>{new Date(exh.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#FAF7F2] group-hover:text-[#B49A65] transition-colors">
                      {exh.title}
                    </h3>
                    <p className="text-xs text-[#858078] mt-3 leading-relaxed line-clamp-3">
                      {exh.curatorStatement}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#3A3633] flex items-center justify-between text-xs uppercase tracking-widest text-[#D1BC8A] font-medium">
                    <span>Enter Exhibition Hall</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ARTIST INVITATION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#FAF7F2] border border-[#B49A65]/40 p-10 sm:p-16 shadow-gallery relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6">
            <Feather className="w-10 h-10 text-[#B49A65] mx-auto" />
            <h2 className="font-serif text-3xl sm:text-5xl text-[#252321]">
              Your Art Deserves a Gallery.
            </h2>
            <p className="text-sm sm:text-base text-[#47382F] font-light leading-relaxed">
              If your hands hold brushes, chisels, charcoal, or clay, ARTÉRA welcomes you to exhibit. Gain dedicated representation, protect your authentic provenance, and connect with collectors worldwide.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register?role=artist"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md"
              >
                Apply for Artist Representation
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto px-8 py-3.5 border border-[#47382F] text-[#47382F] hover:bg-[#47382F] hover:text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all"
              >
                Read the Manifesto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

