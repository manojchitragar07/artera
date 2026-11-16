import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MessageSquare, Compass, ArrowRight, FolderKanban } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { visitorService } from '../../services/visitor.service';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';

export const VisitorOverview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await visitorService.getDashboard();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = data?.stats || {
    favouritesCount: 0,
    followingCount: 0,
    enquiriesCount: 0,
    collectionsCount: 0,
  };

  return (
    <DashboardLayout
      title="Personal Salon Overview"
      subtitle="Your curated private digital sanctuary, favourite masterworks, and correspondence with studio masters."
    >
      <div className="space-y-12">
        {/* Salon Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Saved Masterpieces
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.favouritesCount}
            </div>
            <Link to="/visitor/saved" className="text-xs text-[#B49A65] hover:text-[#252321] mt-1 inline-block">
              View Private Wall →
            </Link>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Following Masters
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.followingCount}
            </div>
            <Link to="/visitor/following" className="text-xs text-[#B49A65] hover:text-[#252321] mt-1 inline-block">
              Studio Lineages →
            </Link>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Studio Enquiries
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.enquiriesCount}
            </div>
            <Link to="/visitor/enquiries" className="text-xs text-[#B49A65] hover:text-[#252321] mt-1 inline-block">
              Track Correspondence →
            </Link>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Curated Collections
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.collectionsCount}
            </div>
            <span className="text-xs text-[#858078] mt-1 inline-block">Personal series</span>
          </div>
        </div>

        {/* Recently Saved Masterpieces (Gallery Wall) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-1">
                Private Gallery Wall
              </span>
              <h3 className="font-serif text-2xl text-[#252321]">Recent Sanctuary Saves</h3>
            </div>
            <Link
              to="/visitor/saved"
              className="text-xs uppercase tracking-widest text-[#B49A65] hover:text-[#252321] font-semibold"
            >
              Enter Full Saved Gallery →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-[#EAE2D5] animate-pulse" />
              ))}
            </div>
          ) : data?.recentFavourites && data.recentFavourites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.recentFavourites.slice(0, 3).map((art: any) => (
                <ArtworkCard key={art.id} artwork={art} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
              <Heart className="w-10 h-10 text-[#858078] mx-auto mb-2" />
              <p className="font-serif text-lg text-[#252321]">Your private salon wall is empty.</p>
              <p className="text-xs text-[#858078] mt-1">
                Save artworks as you explore to assemble your personal museum collection.
              </p>
              <Link
                to="/explore"
                className="mt-4 inline-block px-6 py-2.5 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-widest"
              >
                Explore Artworks
              </Link>
            </div>
          )}
        </div>

        {/* Recent Studio Enquiries */}
        {data?.recentEnquiries && data.recentEnquiries.length > 0 && (
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-3">
              <h3 className="font-serif text-xl text-[#252321]">Recent Acquisition Enquiries</h3>
              <Link to="/visitor/enquiries" className="text-xs uppercase text-[#B49A65] hover:text-[#252321]">
                View All Enquiries →
              </Link>
            </div>

            <div className="space-y-3">
              {data.recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="p-4 bg-[#F5F0E8] border border-[#D8CEBF] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#B49A65] uppercase font-semibold block">
                      To Master: {enq.artist?.name}
                    </span>
                    <h4 className="font-serif text-sm text-[#252321] font-medium">{enq.subject}</h4>
                    {enq.artistResponse && (
                      <p className="text-xs text-emerald-800 mt-1 italic font-light">
                        ✓ Artist responded: "{enq.artistResponse.slice(0, 80)}..."
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[10px] uppercase font-semibold ${
                      enq.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

