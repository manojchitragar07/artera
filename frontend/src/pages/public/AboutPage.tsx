import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Shield, Sparkles, HeartHandshake, Eye, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Manifesto Headline */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold">
          The ARTÉRA Manifesto
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#252321] leading-tight">
          A Sanctuary for the Hand, <br />
          <span className="italic font-normal">the Eye, and the Soul.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#47382F] font-light max-w-2xl mx-auto leading-relaxed pt-2">
          We founded ARTÉRA with an urgent, singular conviction: that physical, manual artistry is not a relic of the past, but the profound anchor of our human culture.
        </p>
      </div>

      {/* Hero Image Section */}
      <div className="relative aspect-[16/9] bg-[#252321] overflow-hidden border border-[#E2D9CB] shadow-gallery">
        <img
          src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80"
          alt="Traditional Art Atelier"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141312]/80 via-transparent to-transparent flex items-end p-8 sm:p-12">
          <p className="font-serif text-xl sm:text-2xl text-[#FAF7F2] max-w-xl italic">
            "Art is not generated; it is lived through physical resistance and human time."
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-8 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EAE2D5] flex items-center justify-center text-[#B49A65]">
            <Feather className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-[#252321]">Manual Primacy</h3>
          <p className="text-xs text-[#858078] leading-relaxed">
            Every artist represented on ARTÉRA works in physical media: oil, tempera, graphite, bronze, terracotta, linen, and lime plaster. We do not exhibit synthetic or prompt-generated imagery.
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-8 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EAE2D5] flex items-center justify-center text-[#B49A65]">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-[#252321]">Curatorial Reverence</h3>
          <p className="text-xs text-[#858078] leading-relaxed">
            We reject the disposable, algorithmic scroll of social media. Our digital sanctuary replicates the contemplative silence and generous spatial rhythm of a world-class fine art institution.
          </p>
        </div>

        <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-8 space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#EAE2D5] flex items-center justify-center text-[#B49A65]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl text-[#252321]">Direct Atelier Access</h3>
          <p className="text-xs text-[#858078] leading-relaxed">
            Collectors can communicate directly with living traditional masters, inquire on museum-grade packing, explore provenance archives, and support artists without predatory intermediary markups.
          </p>
        </div>
      </div>

      {/* Mission Narrative */}
      <div className="bg-[#FAF7F2] border border-[#B49A65]/40 p-8 sm:p-12 space-y-6 text-[#47382F] font-light leading-relaxed">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#252321]">Our Cultural Mission</h2>
        <p className="text-sm">
          Across Florence, Kyoto, Jaipur, Oaxaca, and Edinburgh, generational masters spend decades understanding how pigment reacts with oil, how wet clay responds to high fire, and how light strikes chisel marks on marble.
        </p>
        <p className="text-sm">
          ARTÉRA acts as a bridge between these independent studio masters and discerning art enthusiasts, curators, and collectors who value authentic physical lineage. When you acquire or appreciate artwork here, you are sustaining the living continuity of human civilization.
        </p>
        <div className="pt-4 flex items-center gap-4">
          <Link
            to="/explore"
            className="px-6 py-3 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium hover:bg-[#3A3633] transition-colors"
          >
            Explore the Sanctuary
          </Link>
          <Link
            to="/register?role=artist"
            className="px-6 py-3 border border-[#B49A65] text-[#252321] text-xs uppercase tracking-widest font-medium hover:bg-[#B49A65] hover:text-[#FAF7F2] transition-colors"
          >
            Apply as Traditional Artist
          </Link>
        </div>
      </div>
    </div>
  );
};

