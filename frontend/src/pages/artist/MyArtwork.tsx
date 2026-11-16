import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { artworkService } from '../../services/artwork.service';
import { Artwork } from '../../types';

export const MyArtwork: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMyArtworks = async () => {
    setLoading(true);
    try {
      const res = await artworkService.getMyArtworks();
      if (res.success) {
        setArtworks(res.data);
      }
    } catch (err) {
      console.error('Failed to load artist artworks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyArtworks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await artworkService.deleteArtwork(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete artwork:', err);
    }
  };

  const filtered = artworks.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  const getStatusBadge = (status: string, reason?: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">Published</span>;
      case 'PENDING_APPROVAL':
        return <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold bg-amber-100 text-amber-800 border border-amber-300">Pending Review</span>;
      case 'REJECTED':
        return (
          <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold bg-red-100 text-red-800 border border-red-300" title={reason}>
            Revision Required
          </span>
        );
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold bg-gray-100 text-gray-800 border border-gray-300">Draft</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <DashboardLayout
      title="My Artwork Portfolio"
      subtitle="Manage your catalogued masterpieces, pricing, availability, and curatorial approvals."
    >
      <div className="space-y-8">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1 bg-[#FAF7F2] border border-[#E2D9CB]">
            {['ALL', 'PUBLISHED', 'PENDING_APPROVAL', 'DRAFT', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-[#252321] text-[#FAF7F2]'
                    : 'text-[#858078] hover:text-[#252321]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <Link
            to="/artist/upload"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#252321] hover:bg-[#3A3633] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#B49A65]" />
            Upload Masterpiece
          </Link>
        </div>

        {/* Artworks List / Table */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[#EAE2D5] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
            <p className="font-serif text-xl text-[#252321]">No artworks found</p>
            <p className="text-xs text-[#858078] mt-1">Begin exhibiting by uploading your first manual creation.</p>
            <Link
              to="/artist/upload"
              className="mt-4 inline-block px-6 py-2.5 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-wider"
            >
              Upload Artwork
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((art) => (
              <div
                key={art.id}
                className="bg-[#FAF7F2] border border-[#E2D9CB] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#B49A65]/50 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={art.primaryImageUrl}
                    alt={art.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-[#EAE2D5] shrink-0 border border-[#D8CEBF]"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg text-[#252321] font-medium">{art.title}</h3>
                      {getStatusBadge(art.status, art.rejectionReason)}
                    </div>
                    <p className="text-xs text-[#858078]">
                      {art.medium?.name || art.category.name} • {art.dimensions} • {art.creationYear}
                    </p>
                    <p className="text-xs font-semibold text-[#47382F]">
                      {art.isEnquiryOnly
                        ? 'Direct Enquiry Only'
                        : art.price
                        ? `$${art.price.toLocaleString()}`
                        : 'Price upon request'}
                    </p>
                    {art.rejectionReason && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Curator note: {art.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E2D9CB]">
                  {art.status === 'PUBLISHED' && (
                    <Link
                      to={`/artworks/${art.slug}`}
                      className="p-2 border border-[#D8CEBF] text-[#47382F] hover:bg-[#EAE2D5] transition-colors"
                      title="View in Public Gallery"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}

                  {deleteConfirmId === art.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="px-3 py-1.5 bg-red-700 text-white text-xs uppercase tracking-wider"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-3 py-1.5 border border-[#D8CEBF] text-xs uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(art.id)}
                      className="p-2 border border-[#D8CEBF] text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete Artwork"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

