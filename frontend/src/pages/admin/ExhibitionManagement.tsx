import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Calendar, Sparkles, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { exhibitionService } from '../../services/exhibition.service';
import { artworkService } from '../../services/artwork.service';
import { Exhibition, Artwork, ExhibitionStatus } from '../../types';

export const ExhibitionManagement: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [publishedArtworks, setPublishedArtworks] = useState<Artwork[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [curatorStatement, setCuratorStatement] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<ExhibitionStatus>('UPCOMING');
  const [featured, setFeatured] = useState(false);
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [exhRes, artRes] = await Promise.all([
        exhibitionService.getExhibitions(),
        artworkService.getArtworks({ limit: 100 }),
      ]);
      if (exhRes.success) setExhibitions(exhRes.data);
      if (artRes.success) setPublishedArtworks(artRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleArtwork = (id: string) => {
    setSelectedArtworkIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateExhibition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !curatorStatement || !coverImage || !startDate || !endDate) return;

    try {
      const res = await exhibitionService.createExhibition({
        title,
        subtitle: subtitle || undefined,
        curatorStatement,
        coverImage,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status,
        featured,
        artworkIds: selectedArtworkIds,
      });

      if (res.success) {
        setIsCreating(false);
        setTitle('');
        setSubtitle('');
        setCuratorStatement('');
        setCoverImage('');
        setSelectedArtworkIds([]);
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to create exhibition:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await exhibitionService.deleteExhibition(id);
      setExhibitions((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      title="Curated Exhibition Management"
      subtitle="Curate thematic museum programs, select masterpieces for display, and draft curatorial essays."
    >
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <p className="text-xs text-[#858078]">
            Curated exhibitions appear prominently across the platform and feature curated essays by the Chief Curator.
          </p>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium"
          >
            <Plus className="w-4 h-4 text-[#B49A65]" />
            New Curated Exhibition
          </button>
        </div>

        {/* Create Exhibition Form */}
        {isCreating && (
          <div className="bg-[#FAF7F2] border border-[#B49A65] p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-2xl text-[#252321]">Curate New Exhibition Program</h3>
            <form onSubmit={handleCreateExhibition} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                    Exhibition Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The Venetian Chiaroscuro Dialogue"
                    className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none text-[#252321]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                    Thematic Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Masterworks from 16th Century to Modern Realism"
                    className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none text-[#252321]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                  Exhibition Cover Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none text-[#252321]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                    Inauguration (Start Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none text-[#252321]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                    Conclusion (End Date) *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none text-[#252321]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                    Exhibition Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none text-[#252321]"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ONGOING">Ongoing / Active</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                  Curator Essay & Statement *
                </label>
                <textarea
                  rows={4}
                  required
                  value={curatorStatement}
                  onChange={(e) => setCuratorStatement(e.target.value)}
                  placeholder="Elaborate on the historical, material, and philosophical rationale for this curated grouping..."
                  className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none text-[#252321]"
                />
              </div>

              {/* Masterpiece Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#47382F] font-semibold mb-2">
                  Select Participating Masterpieces ({selectedArtworkIds.length} chosen)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-3 bg-[#F5F0E8] border border-[#D8CEBF]">
                  {publishedArtworks.map((art) => {
                    const isSelected = selectedArtworkIds.includes(art.id);
                    return (
                      <div
                        key={art.id}
                        onClick={() => handleToggleArtwork(art.id)}
                        className={`p-2 border cursor-pointer flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-[#EAE2D5] border-[#B49A65] shadow-sm'
                            : 'bg-[#FAF7F2] border-[#D8CEBF]'
                        }`}
                      >
                        <img src={art.primaryImageUrl} alt="" className="w-10 h-10 object-cover" />
                        <div className="text-[11px] truncate">
                          <strong className="block text-[#252321] truncate">{art.title}</strong>
                          <span className="text-[#858078]">{art.artist?.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#D8CEBF]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs uppercase text-[#858078]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-wider"
                >
                  Publish Curated Exhibition
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Exhibitions */}
        <div className="space-y-6">
          {exhibitions.map((exh) => (
            <div
              key={exh.id}
              className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm"
            >
              <div className="flex items-center gap-5">
                <img
                  src={exh.coverImage}
                  alt=""
                  className="w-24 h-24 object-cover bg-[#EAE2D5] border border-[#D8CEBF]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-semibold text-[#B49A65]">
                      {exh.status}
                    </span>
                    <h3 className="font-serif text-xl text-[#252321] font-semibold">{exh.title}</h3>
                  </div>
                  {exh.subtitle && <p className="text-xs text-[#47382F] italic">{exh.subtitle}</p>}
                  <p className="text-xs text-[#858078]">
                    {new Date(exh.startDate).toLocaleDateString()} — {new Date(exh.endDate).toLocaleDateString()}
                  </p>
                  <span className="text-xs text-[#858078]">
                    {exh._count?.artworks || 0} catalogued artworks included
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/exhibitions/${exh.slug}`}
                  className="p-2 border border-[#D8CEBF] text-[#47382F] hover:bg-[#EAE2D5]"
                  title="View Public Exhibition"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(exh.id)}
                  className="p-2 border border-[#D8CEBF] text-red-700 hover:bg-red-50"
                  title="Delete Exhibition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
