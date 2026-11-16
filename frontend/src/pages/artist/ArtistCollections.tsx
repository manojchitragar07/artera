import React, { useEffect, useState } from 'react';
import { Plus, FolderKanban, Trash2, ExternalLink } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { collectionService } from '../../services/collection.service';
import { Collection } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const ArtistCollections: React.FC = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    if (!user?.artistProfile?.id) return;
    setLoading(true);
    try {
      const res = await collectionService.getCollections({ artistId: user.artistProfile.id });
      if (res.success) setCollections(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await collectionService.createCollection({ title, description });
      if (res.success) {
        setCollections((prev) => [res.data, ...prev]);
        setTitle('');
        setDescription('');
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await collectionService.deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      title="Artist Series & Collections"
      subtitle="Organize your portfolio into thematic bodies of work, seasonal cycles, or historical series."
    >
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <p className="text-xs text-[#858078]">
            Grouping artworks into cohesive collections allows collectors to experience your creative periods.
          </p>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-widest font-medium"
          >
            <Plus className="w-4 h-4 text-[#B49A65]" />
            New Series
          </button>
        </div>

        {/* Create Series Form */}
        {isCreating && (
          <div className="bg-[#FAF7F2] border border-[#B49A65] p-6 shadow-sm">
            <h3 className="font-serif text-lg text-[#252321] mb-4">Create Thematic Series</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                  Series Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Venetian Winter Studies, High Desert Horizons"
                  className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none text-[#252321]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#47382F] font-medium mb-1">
                  Series Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Curator commentary explaining the continuity of medium, philosophy, or subject..."
                  className="w-full px-3 py-2 text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none text-[#252321]"
                />
              </div>

              <div className="flex justify-end gap-3">
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
                  Save Series
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Collections */}
        {loading ? (
          <div className="h-48 bg-[#EAE2D5] animate-pulse" />
        ) : collections.length === 0 ? (
          <div className="py-20 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
            <FolderKanban className="w-10 h-10 text-[#858078] mx-auto mb-2" />
            <p className="font-serif text-xl text-[#252321]">No Art Series Created Yet</p>
            <p className="text-xs text-[#858078] mt-1">
              Group your paintings or sculptures into series to guide collector appreciation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((col) => (
              <div
                key={col.id}
                className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-xl text-[#252321]">{col.title}</h3>
                    <button
                      onClick={() => handleDelete(col.id)}
                      className="text-[#858078] hover:text-red-700 p-1"
                      title="Delete Series"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {col.description && (
                    <p className="text-xs text-[#858078] mt-2 line-clamp-3 leading-relaxed">
                      {col.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2D9CB] flex items-center justify-between text-xs text-[#858078]">
                  <span>{col._count?.artworks || 0} catalogued artworks</span>
                  <span className="text-[#B49A65] uppercase tracking-wider font-medium">Public Series</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

