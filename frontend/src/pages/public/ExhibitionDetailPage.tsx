import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Compass, ArrowLeft } from 'lucide-react';
import { Exhibition } from '../../types';
import { exhibitionService } from '../../services/exhibition.service';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';

export const ExhibitionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await exhibitionService.getExhibitionById(slug);
        if (res.success) setExhibition(res.data);
      } catch (err) {
        console.error('Failed to load exhibition details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 h-96 bg-[#EAE2D5] animate-pulse" />;
  }

  if (!exhibition) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto">
        <h2 className="font-serif text-3xl text-[#252321]">Exhibition Not Found</h2>
        <Link to="/exhibitions" className="inline-block mt-4 px-6 py-2 bg-[#252321] text-[#FAF7F2] text-xs uppercase">
          Back to Exhibitions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-24">
      {/* Exhibition Cover Banner */}
      <div className="relative h-80 sm:h-96 bg-[#1C1A19] overflow-hidden">
        <img
          src={exhibition.coverImage}
          alt={exhibition.title}
          className="w-full h-full object-cover opacity-50 filter saturate-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E8] via-transparent to-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 space-y-12">
        <Link
          to="/exhibitions"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#47382F] hover:text-[#B49A65] font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> All Exhibitions
        </Link>

        {/* Curator Statement Placard */}
        <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-8 sm:p-12 shadow-gallery space-y-4">
          <div className="flex flex-wrap items-center justify-between text-xs text-[#B49A65] uppercase tracking-widest font-semibold">
            <span>{exhibition.status} EXHIBITION</span>
            <span className="flex items-center gap-1.5 text-[#858078]">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(exhibition.startDate).toLocaleDateString()} — {new Date(exhibition.endDate).toLocaleDateString()}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#252321]">
            {exhibition.title}
          </h1>

          {exhibition.subtitle && (
            <p className="text-sm font-serif italic text-[#47382F]">
              {exhibition.subtitle}
            </p>
          )}

          <div className="pt-4 border-t border-[#E2D9CB]">
            <h3 className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold mb-2">
              Curator’s Essay & Statement
            </h3>
            <p className="text-sm text-[#47382F] font-light leading-relaxed whitespace-pre-line">
              {exhibition.curatorStatement}
            </p>
          </div>
        </div>

        {/* Participating Artworks Wall */}
        <div className="space-y-8">
          <div className="flex items-end justify-between border-b border-[#E2D9CB] pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-1">
                Exhibition Selection
              </span>
              <h2 className="font-serif text-3xl text-[#252321]">
                Catalogued Works ({exhibition.artworks?.length || 0})
              </h2>
            </div>
          </div>

          {exhibition.artworks && exhibition.artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {exhibition.artworks.map((item) => (
                <div key={item.id} className="space-y-3">
                  <ArtworkCard artwork={item.artwork} />
                  {item.curatorNotes && (
                    <div className="p-3 bg-[#FAF7F2] border border-[#E2D9CB] text-xs text-[#858078] italic">
                      Curator’s remark: {item.curatorNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
              <Compass className="w-10 h-10 text-[#858078] mx-auto mb-2" />
              <p className="text-xs text-[#858078]">No artworks in this exhibition yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

