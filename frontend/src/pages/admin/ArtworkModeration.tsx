import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Check, X, Star, ExternalLink, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { adminService } from '../../services/admin.service';
import { Artwork, ArtworkStatus } from '../../types';

export const ArtworkModeration: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'ALL');
  const [loading, setLoading] = useState(true);

  // Reject Modal
  const [rejectArtworkId, setRejectArtworkId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await adminService.getArtworks({
        status: statusFilter === 'ALL' ? undefined : (statusFilter as ArtworkStatus),
        limit: 50,
      });
      if (res.success) setArtworks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveArtwork(id);
      await fetchArtworks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectArtworkId) return;
    try {
      await adminService.rejectArtwork(rejectArtworkId, rejectReason);
      setRejectArtworkId(null);
      setRejectReason('');
      await fetchArtworks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeature = async (id: string, current: boolean) => {
    try {
      await adminService.toggleFeatureArtwork(id, !current);
      setArtworks((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isFeatured: !current } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      title="Masterpiece Curation & Approvals"
      subtitle="Examine submitted physical artworks, certify authenticity, feature masterpieces, or request revisions."
    >
      <div className="space-y-6">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 p-1 bg-[#FAF7F2] border border-[#E2D9CB]">
          {['ALL', 'PENDING_APPROVAL', 'PUBLISHED', 'REJECTED', 'DRAFT'].map((st) => (
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

        {/* Artworks List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-[#EAE2D5] animate-pulse" />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="py-20 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
            <p className="font-serif text-xl text-[#252321]">No artworks matching criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="bg-[#FAF7F2] border border-[#E2D9CB] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={art.primaryImageUrl}
                    alt={art.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-[#EAE2D5] border border-[#D8CEBF] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg text-[#252321] font-semibold">{art.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-semibold border ${
                          art.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : art.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        {art.status.replace('_', ' ')}
                      </span>
                      {art.isFeatured && (
                        <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-amber-500 text-white flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#858078]">
                      Artist: <strong className="text-[#252321]">{art.artist?.name}</strong> • {art.category?.name} • {art.medium?.name || 'Traditional'}
                    </p>
                    <p className="text-xs text-[#858078]">
                      {art.dimensions} • Year: {art.creationYear} • {art.price ? `$${art.price.toLocaleString()}` : 'Enquiry Only'}
                    </p>
                    {art.rejectionReason && (
                      <p className="text-xs text-red-700 italic">
                        Revision Note: {art.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E2D9CB]">
                  {art.status === 'PENDING_APPROVAL' && (
                    <>
                      <button
                        onClick={() => handleApprove(art.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs uppercase tracking-wider font-semibold"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => setRejectArtworkId(art.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs uppercase tracking-wider font-semibold"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  )}

                  {art.status === 'PUBLISHED' && (
                    <button
                      onClick={() => handleToggleFeature(art.id, art.isFeatured)}
                      className={`px-3 py-1.5 border text-xs uppercase tracking-wider font-medium flex items-center gap-1 ${
                        art.isFeatured
                          ? 'border-amber-600 bg-amber-50 text-amber-900'
                          : 'border-[#D8CEBF] text-[#47382F] hover:bg-[#EAE2D5]'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${art.isFeatured ? 'fill-current text-amber-600' : ''}`} />
                      {art.isFeatured ? 'Featured' : 'Feature'}
                    </button>
                  )}

                  <Link
                    to={`/artworks/${art.slug}`}
                    className="p-2 border border-[#D8CEBF] text-[#47382F] hover:bg-[#EAE2D5]"
                    title="Preview in Exhibition View"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Artwork Modal */}
        {rejectArtworkId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#FAF7F2] border border-[#B49A65] p-6 max-w-md w-full shadow-2xl space-y-4">
              <h3 className="font-serif text-xl text-[#252321]">Curator Revision Request</h3>
              <p className="text-xs text-[#858078]">
                Provide clear feedback to the artist regarding image clarity, provenance documentation, or dimensions.
              </p>
              <form onSubmit={handleReject} className="space-y-4">
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify why this artwork submission requires revision..."
                  className="w-full px-3 py-2 text-xs bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectArtworkId(null)}
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

