import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Palette,
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { adminService } from '../../services/admin.service';

export const AdminOverview: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await adminService.getDashboard();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const stats = data?.stats || {
    totalArtists: 0,
    totalVisitors: 0,
    totalArtworks: 0,
    pendingArtists: 0,
    pendingArtworks: 0,
    publishedArtworks: 0,
    totalEnquiries: 0,
  };

  return (
    <DashboardLayout
      title="Chief Curator Dashboard"
      subtitle="Institutional oversight of artist inductions, masterpiece moderation, and platform activity."
    >
      <div className="space-y-10">
        {/* Pending Moderation Action Banners */}
        {(stats.pendingArtists > 0 || stats.pendingArtworks > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.pendingArtists > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span className="text-xs text-amber-900 font-medium">
                    <strong className="font-semibold">{stats.pendingArtists}</strong> Artist applications require verification
                  </span>
                </div>
                <Link
                  to="/admin/artists?status=PENDING_APPROVAL"
                  className="px-3 py-1 bg-amber-700 text-white text-[11px] uppercase tracking-wider font-semibold hover:bg-amber-800"
                >
                  Review
                </Link>
              </div>
            )}

            {stats.pendingArtworks > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-xs text-blue-900 font-medium">
                    <strong className="font-semibold">{stats.pendingArtworks}</strong> Artworks awaiting curatorial approval
                  </span>
                </div>
                <Link
                  to="/admin/artworks?status=PENDING_APPROVAL"
                  className="px-3 py-1 bg-blue-700 text-white text-[11px] uppercase tracking-wider font-semibold hover:bg-blue-800"
                >
                  Review
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Platform Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Registered Artists
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.totalArtists}
            </div>
            <Link to="/admin/artists" className="text-xs text-[#B49A65] hover:text-[#252321] mt-1 inline-block">
              Manage Roster →
            </Link>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Total Masterpieces
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.totalArtworks}
            </div>
            <div className="text-xs text-[#858078] mt-1">
              <span className="text-emerald-700 font-medium">{stats.publishedArtworks}</span> published in gallery
            </div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Art Enthusiasts / Collectors
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.totalVisitors}
            </div>
            <span className="text-xs text-[#858078] mt-1 inline-block">Registered visitors</span>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#858078] font-semibold block mb-1">
              Acquisition Communications
            </span>
            <div className="font-serif text-3xl sm:text-4xl text-[#252321] font-semibold">
              {stats.totalEnquiries}
            </div>
            <span className="text-xs text-[#858078] mt-1 inline-block">Total inquiries logged</span>
          </div>
        </div>

        {/* Dual Section: Recent Curatorial Audit Log & Newest Artwork Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Audit Log */}
          <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-3">
              <h3 className="font-serif text-xl text-[#252321]">Curatorial Action Audit Log</h3>
              <Link to="/admin/reports" className="text-xs uppercase text-[#B49A65] hover:text-[#252321]">
                Full History →
              </Link>
            </div>

            {data?.recentLogs && data.recentLogs.length > 0 ? (
              <div className="space-y-3">
                {data.recentLogs.map((log: any) => (
                  <div key={log.id} className="p-3 bg-[#F5F0E8] border border-[#E2D9CB] text-xs flex items-start justify-between">
                    <div>
                      <strong className="text-[#252321] font-semibold block">{log.action}</strong>
                      <span className="text-[#858078]">
                        Target: {log.targetType} #{log.targetId.slice(-6)}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#858078]">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#858078] py-8 text-center">No audit records logged yet.</p>
            )}
          </div>

          {/* Newest Artworks */}
          <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E2D9CB] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2D9CB] pb-3">
              <h3 className="font-serif text-xl text-[#252321]">Recent Artworks</h3>
              <Link to="/admin/artworks" className="text-xs uppercase text-[#B49A65] hover:text-[#252321]">
                Manage All →
              </Link>
            </div>

            {data?.recentArtworks && data.recentArtworks.length > 0 ? (
              <div className="space-y-3">
                {data.recentArtworks.map((art: any) => (
                  <div key={art.id} className="p-3 bg-[#F5F0E8] border border-[#E2D9CB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={art.primaryImageUrl} alt="" className="w-10 h-10 object-cover bg-[#EAE2D5]" />
                      <div className="text-xs">
                        <h4 className="font-serif font-medium text-[#252321] truncate max-w-[150px]">{art.title}</h4>
                        <span className="text-[10px] text-[#858078]">{art.artist?.name}</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800">
                      {art.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#858078] py-8 text-center">No artworks catalogued yet.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

