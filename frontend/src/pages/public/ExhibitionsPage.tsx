import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Exhibition } from '../../types';
import { exhibitionService } from '../../services/exhibition.service';

export const ExhibitionsPage: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const res = await exhibitionService.getExhibitions();
        if (res.success) setExhibitions(res.data);
      } catch (err) {
        console.error('Failed to load exhibitions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExhibitions();
  }, []);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-2">
          Curated Museum Programs
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#252321]">
          Curated Exhibitions
        </h1>
        <p className="text-sm text-[#858078] mt-3 font-light leading-relaxed">
          Thematic surveys uniting international traditional masters around shared concepts of craft, material gravity, and historical dialogue.
        </p>
      </div>

      {loading ? (
        <div className="space-y-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-[#EAE2D5] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-16">
          {exhibitions.map((exh, idx) => (
            <div
              key={exh.id}
              className={`bg-[#FAF7F2] border border-[#E2D9CB] shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-7 h-80 sm:h-96 overflow-hidden">
                <img
                  src={exh.coverImage}
                  alt={exh.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="lg:col-span-5 p-8 sm:p-12 space-y-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#B49A65] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{exh.status} EXHIBITION</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#252321] leading-tight">
                  {exh.title}
                </h2>

                {exh.subtitle && (
                  <p className="text-xs text-[#47382F] font-medium tracking-wide">
                    {exh.subtitle}
                  </p>
                )}

                <p className="text-xs text-[#858078] leading-relaxed line-clamp-4">
                  {exh.curatorStatement}
                </p>

                <div className="text-xs text-[#858078] flex items-center gap-1.5 pt-2">
                  <Calendar className="w-4 h-4 text-[#B49A65]" />
                  <span>
                    {new Date(exh.startDate).toLocaleDateString()} — {new Date(exh.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/exhibitions/${exh.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest transition-all font-medium"
                  >
                    Step Into Exhibition
                    <ArrowRight className="w-3.5 h-3.5 text-[#B49A65]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

