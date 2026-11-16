import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Users, CheckCircle, XCircle, Ban, RefreshCw, ExternalLink, Search } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { adminService } from '../../services/admin.service';
import { User, AccountStatus } from '../../types';

export const ArtistManagement: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artists, setArtists] = useState<User[]>([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Reject modal state
  const [rejectModalArtistId, setRejectModalArtistId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const res = await adminService.getArtists({
        status: statusFilter === 'ALL' ? undefined : (statusFilter as AccountStatus),
        search: search || undefined,
        limit: 50,
      });
      if (res.success) setArtists(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, [statusFilter, search]);

  const handleApprove = async (artistProfileId: string) => {
    try {
      await adminService.approveArtist(artistProfileId);
      await fetchArtists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalArtistId) return;

    try {
      await adminService.rejectArtist(rejectModalArtistId, rejectReason);
      setRejectModalArtistId(null);
      setRejectReason('');
      await fetchArtists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetStatus = async (userId: string, newStatus: AccountStatus) => {
    try {
      await adminService.setAccountStatus(userId, newStatus);
      await fetchArtists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      title="Artist Roster & Induction Moderation"
      subtitle="Review traditional artist representations, approve atelier access, or manage accounts."
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 p-1 bg-[#FAF7F2] border border-[#E2D9CB]">
            {['ALL', 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                  statusFilter === st ? 'bg-[#252321] text-[#FAF7F2]' : 'text-[#858078] hover:text-[#252321]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#858078]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search artist or email..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65]"
            />
          </div>
        </div>

        {/* Artists Table */}
        {loading ? (
          <div className="h-64 bg-[#EAE2D5] animate-pulse" />
        ) : artists.length === 0 ? (
          <div className="py-20 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
            <p className="font-serif text-xl text-[#252321]">No artists matching criteria</p>
          </div>
        ) : (
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D8CEBF] text-[#47382F] uppercase tracking-wider bg-[#F5F0E8]">
                  <th className="py-3 px-4 font-semibold">Artist / Atelier</th>
                  <th className="py-3 px-4 font-semibold">Speciality</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Curatorial Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2D9CB]">
                {artists.map((userArt) => {
                  const profile = userArt.artistProfile;
                  return (
                    <tr key={userArt.id} className="hover:bg-[#F5F0E8] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={profile?.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-[#B49A65]"
                          />
                          <div>
                            <strong className="text-[#252321] font-serif text-sm block">
                              {profile?.name || 'Unnamed Artist'}
                            </strong>
                            <span className="text-[#858078] text-[11px]">{userArt.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#47382F]">{profile?.speciality || '—'}</td>
                      <td className="py-3 px-4 text-[#858078]">{profile?.location || '—'}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] uppercase font-semibold border ${
                            userArt.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : userArt.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : userArt.status === 'SUSPENDED'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : 'bg-gray-100 text-gray-800 border-gray-300'
                          }`}
                        >
                          {userArt.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {profile?.slug && (
                            <Link
                              to={`/artists/${profile.slug}`}
                              className="p-1.5 border border-[#D8CEBF] text-[#47382F] hover:bg-[#EAE2D5]"
                              title="Inspect Studio Profile"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          {userArt.status === 'PENDING_APPROVAL' && profile && (
                            <>
                              <button
                                onClick={() => handleApprove(profile.id)}
                                className="px-3 py-1 bg-emerald-800 text-white text-[11px] uppercase tracking-wider hover:bg-emerald-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectModalArtistId(profile.id)}
                                className="px-3 py-1 bg-red-700 text-white text-[11px] uppercase tracking-wider hover:bg-red-800"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {userArt.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleSetStatus(userArt.id, 'SUSPENDED')}
                              className="px-2.5 py-1 border border-red-300 text-red-700 text-[10px] uppercase hover:bg-red-50"
                            >
                              Suspend
                            </button>
                          )}

                          {userArt.status === 'SUSPENDED' && (
                            <button
                              onClick={() => handleSetStatus(userArt.id, 'ACTIVE')}
                              className="px-2.5 py-1 border border-emerald-400 text-emerald-800 text-[10px] uppercase hover:bg-emerald-50"
                            >
                              Reactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Reject Reason Modal */}
        {rejectModalArtistId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#FAF7F2] border border-[#B49A65] p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="font-serif text-xl text-[#252321]">Reject Artist Application</h3>
              <p className="text-xs text-[#858078]">
                Please document the curatorial reason for this rejection (e.g. portfolio does not demonstrate manual medium provenance).
              </p>
              <form onSubmit={handleReject} className="space-y-4">
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify feedback for the applicant..."
                  className="w-full px-3 py-2 text-xs bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectModalArtistId(null)}
                    className="px-4 py-2 text-xs uppercase text-[#858078]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-700 text-white text-xs uppercase tracking-wider"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

