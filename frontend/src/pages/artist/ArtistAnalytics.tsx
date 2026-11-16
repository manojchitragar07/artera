import React, { useEffect, useState } from 'react';
import { Eye, Heart, MessageSquare, TrendingUp, Users, Palette, Compass } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { artistService } from '../../services/artist.service';

export const ArtistAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await artistService.getDashboard();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = data?.stats || {
    totalArtworks: 0,
    publishedArtworks: 0,
    totalViews: 0,
    totalFavourites: 0,
    totalEnquiries: 0,
    followersCount: 0,
  };

  return (
    <DashboardLayout
      title="Studio Analytics & Metrics"
      subtitle="Exhibition impressions, collector saves, and patron interactions derived from live database records."
    >
      <div className="space-y-10">
        {/* Core Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Total Artwork Impressions
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.totalViews}
            </div>
            <p className="text-xs text-[#858078] mt-1">Unique verified gallery inspections</p>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Collector Sanctuaries
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.totalFavourites}
            </div>
            <p className="text-xs text-[#858078] mt-1">Added to private digital walls</p>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Acquisition Enquiries
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.totalEnquiries}
            </div>
            <p className="text-xs text-[#858078] mt-1">Direct patron communications</p>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Following Collectors
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.followersCount}
            </div>
            <p className="text-xs text-[#858078] mt-1">Subscribed to new studio releases</p>
          </div>
        </div>

        {/* Top Performing Artworks Table */}
        <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-4">
            <div>
              <h3 className="font-serif text-2xl text-[#252321]">Masterpiece Engagement Ledger</h3>
              <p className="text-xs text-[#858078] mt-0.5">
                Real-time breakdown of impressions and saves per catalogued artwork.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-48 bg-[#EAE2D5] animate-pulse" />
          ) : data?.topArtworks && data.topArtworks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D8CEBF] text-[#47382F] uppercase tracking-wider">
                    <th className="py-3 px-4 font-semibold">Masterpiece</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Views</th>
                    <th className="py-3 px-4 font-semibold text-right">Saves</th>
                    <th className="py-3 px-4 font-semibold text-right">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2D9CB]">
                  {data.topArtworks.map((art: any) => {
                    const ratio = art.viewsCount > 0 ? ((art.favoritesCount / art.viewsCount) * 100).toFixed(1) : '0';
                    return (
                      <tr key={art.id} className="hover:bg-[#F5F0E8] transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={art.primaryImageUrl}
                            alt=""
                            className="w-10 h-10 object-cover bg-[#EAE2D5]"
                          />
                          <span className="font-serif font-medium text-[#252321] text-sm">{art.title}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800">
                            {art.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-[#252321]">{art.viewsCount}</td>
                        <td className="py-3 px-4 text-right font-medium text-[#252321]">{art.favoritesCount}</td>
                        <td className="py-3 px-4 text-right font-semibold text-[#B49A65]">{ratio}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-[#858078] py-8 text-center">No artworks catalogued yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

