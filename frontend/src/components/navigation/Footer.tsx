import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C1A19] text-[#EAE2D5] border-t border-[#47382F]/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3A3633]">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-serif text-2xl tracking-widest text-[#FAF7F2]">ARTÉRA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A65]" />
            </Link>
            <p className="text-xs text-[#858078] leading-relaxed max-w-sm">
              A curated digital sanctuary dedicated to manual, traditional fine artists — oil painters, sculptors, watercolorists, charcoal artists, and ceramicists. Elevating authentic human physical mastery.
            </p>
            <div className="pt-2 text-xs text-[#B49A65] tracking-widest uppercase font-medium">
              Where Art Finds Its Place.
            </div>
          </div>

          {/* Traditional Disciplines */}
          <div>
            <h4 className="font-serif text-sm text-[#FAF7F2] tracking-wider mb-4">Disciplines</h4>
            <ul className="space-y-2 text-xs text-[#858078]">
              <li><Link to="/explore?category=canvas-painting" className="hover:text-[#B49A65] transition-colors">Canvas & Oil Painting</Link></li>
              <li><Link to="/explore?category=watercolour" className="hover:text-[#B49A65] transition-colors">Pure Watercolour</Link></li>
              <li><Link to="/explore?category=sketches-charcoal" className="hover:text-[#B49A65] transition-colors">Charcoal & Sketches</Link></li>
              <li><Link to="/explore?category=sculpture-bronze" className="hover:text-[#B49A65] transition-colors">Foundry Bronze & Stone</Link></li>
              <li><Link to="/explore?category=pottery-ceramics" className="hover:text-[#B49A65] transition-colors">Anagama Woodfired Pottery</Link></li>
              <li><Link to="/explore?category=folk-cultural-art" className="hover:text-[#B49A65] transition-colors">Folk & Mineral Art</Link></li>
            </ul>
          </div>

          {/* Exhibition & Sanctuary */}
          <div>
            <h4 className="font-serif text-sm text-[#FAF7F2] tracking-wider mb-4">Sanctuary</h4>
            <ul className="space-y-2 text-xs text-[#858078]">
              <li><Link to="/explore" className="hover:text-[#B49A65] transition-colors">Explore Gallery Wall</Link></li>
              <li><Link to="/artists" className="hover:text-[#B49A65] transition-colors">Master Artists Directory</Link></li>
              <li><Link to="/exhibitions" className="hover:text-[#B49A65] transition-colors">Curated Exhibitions</Link></li>
              <li><Link to="/about" className="hover:text-[#B49A65] transition-colors">The Platform Manifesto</Link></li>
            </ul>
          </div>

          {/* Artists Invitation */}
          <div>
            <h4 className="font-serif text-sm text-[#FAF7F2] tracking-wider mb-4">For Artists</h4>
            <p className="text-xs text-[#858078] mb-3 leading-relaxed">
              Are you a traditional painter, sculptor, or manual craft artisan?
            </p>
            <Link
              to="/register?role=artist"
              className="inline-block px-4 py-2 border border-[#B49A65] text-[#B49A65] hover:bg-[#B49A65] hover:text-[#FAF7F2] text-xs uppercase tracking-widest transition-all"
            >
              Apply as Artist
            </Link>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#858078] gap-4">
          <p>© {new Date().getFullYear()} ARTÉRA. All rights reserved across digital and physical exhibitions.</p>
          <div className="flex space-x-6">
            <span className="hover:text-[#FAF7F2] cursor-pointer">Terms & Provenance</span>
            <span className="hover:text-[#FAF7F2] cursor-pointer">Collector Privacy</span>
            <span className="hover:text-[#FAF7F2] cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

