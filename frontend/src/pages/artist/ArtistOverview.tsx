import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Palette,
  Eye,
  Heart,
  MessageSquare,
  Users,
  Upload,
  ArrowRight,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { artistService } from '../../services/artist.service';
import { useAuth } from '../../context/AuthContext';

export const ArtistOverview: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await artistService.getDashboard();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load artist dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const stats = data?.stats || {
    totalArtworks: 0,
    publishedArtworks: 0,
    pendingArtworks: 0,
    totalViews: 0,
    totalFavourites: 0,
    totalEnquiries: 0,
    followersCount: 0,
  };

  return (
    <DashboardLayout
      title="Artist Studio Overview"
      subtitle="Monitor your catalogued masterpieces, visitor appreciation, and acquisition enquiries."
    >
      <div className="space-y-10">
        {/* Verification Alert Banner if Pending */}
        {user?.status === 'PENDING_APPROVAL' && (
          <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Application Status: Pending Curator Verification</strong>
              <span>
                Your traditional artist profile and artwork drafts are currently being reviewed by the ARTÉRA curatorial committee. You can upload and organize artwork drafts; they will be approved for public exhibition shortly.
              </span>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#858078] uppercase tracking-wider mb-2">
              <span>Catalogued Works</span>
              <Palette className="w-4 h-4 text-[#B49A65]" />
            </div>
            <div className="font-serif text-3xl text-[#252321] font-semibold">{stats.totalArtworks}</div>
            <div className="text-[11px] text-[#858078] mt-1">
              <span className="text-emerald-700 font-medium">{stats.publishedArtworks}</span> published • {stats.pendingArtworks} pending
            </div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#858078] uppercase tracking-wider mb-2">
              <span>Gallery Impressions</span>
              <Eye className="w-4 h-4 text-[#B49A65]" />
            </div>
            <div className="font-serif text-3xl text-[#252321] font-semibold">{stats.totalViews}</div>
            <div className="text-[11px] text-[#858078] mt-1">Direct visitor exhibition views</div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#858078] uppercase tracking-wider mb-2">
              <span>Saved to Sanctuaries</span>
              <Heart className="w-4 h-4 text-[#B49A65]" />
            </div>
            <div className="font-serif text-3xl text-[#252321] font-semibold">{stats.totalFavourites}</div>
            <div className="text-[11px] text-[#858078] mt-1">Collectors favourited your works</div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#858078] uppercase tracking-wider mb-2">
              <span>Studio Enquiries</span>
              <MessageSquare className="w-4 h-4 text-[#B49A65]" />
            </div>
            <div className="font-serif text-3xl text-[#252321] font-semibold">{stats.totalEnquiries}</div>
            <div className="text-[11px] text-[#858078] mt-1">
              {stats.followersCount} collectors following studio
            </div>
          </div>
        </div>

        {/* Quick Studio Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/artist/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all shadow-md"
          >
            <Upload className="w-4 h-4 text-[#B49A65]" />
            Upload New Masterpiece
          </Link>
          <Link
            to="/artist/artwork"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#B49A65] text-[#252321] hover:bg-[#B49A65] hover:text-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all"
          >
            Manage Artwork Catalog
          </Link>
          <Link
            to={`/artists/${user?.artistProfile?.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#D8CEBF] text-[#47382F] hover:bg-[#FAF7F2] text-xs uppercase tracking-widest font-medium transition-all"
          >
            View Public Profile
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dual Section: Top Viewed Artworks & Recent Enquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Top Viewed Works */}
          <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E2D9CB] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-3">
              <h3 className="font-serif text-xl text-[#252321]">Curator Impressions</h3>
              <Link to="/artist/analytics" className="text-xs uppercase tracking-wider text-[#B49A65] hover:text-[#252321]">
                Full Analytics →
              </Link>
            </div>

            {data?.topArtworks && data.topArtworks.length > 0 ? (
              <div className="space-y-3">
                {data.topArtworks.map((art: any) => (
                  <div
                    key={art.id}
                    className="flex items-center justify-between p-3 bg-[#F5F0E8] border border-[#E2D9CB]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={art.primaryImageUrl}
                        alt=""
                        className="w-12 h-12 object-cover bg-[#EAE2D5]"
                      />
                      <div>
                        <h4 className="font-serif text-sm text-[#252321] font-medium">{art.title}</h4>
                        <span className="text-[10px] text-[#858078] uppercase tracking-wider">
                          Status: {art.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-[#858078]">
                      <div><strong className="text-[#252321]">{art.viewsCount}</strong> views</div>
                      <div><strong className="text-[#252321]">{art.favoritesCount}</strong> saves</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#858078] py-8 text-center">No artworks catalogued yet.</p>
            )}
          </div>

          {/* Recent Studio Enquiries */}
          <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E2D9CB] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-3">
              <h3 className="font-serif text-xl text-[#252321]">Recent Inquiries</h3>
              <Link to="/artist/enquiries" className="text-xs uppercase tracking-wider text-[#B49A65] hover:text-[#252321]">
                View All →
              </Link>
            </div>

            {data?.recentEnquiries && data.recentEnquiries.length > 0 ? (
              <div className="space-y-3">
                {data.recentEnquiries.map((enq: any) => (
                  <Link
                    key={enq.id}
                    to="/artist/enquiries"
                    className="block p-3 bg-[#F5F0E8] border border-[#E2D9CB] hover:border-[#B49A65] transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <strong className="text-[#252321] font-serif">{enq.senderName}</strong>
                      <span className="text-[10px] text-[#B49A65] uppercase font-semibold">{enq.status}</span>
                    </div>
                    <p className="text-xs text-[#47382F] font-medium truncate">{enq.subject}</p>
                    <p className="text-[11px] text-[#858078] line-clamp-1 mt-0.5">{enq.message}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#858078] py-8 text-center">No enquiries received yet.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

