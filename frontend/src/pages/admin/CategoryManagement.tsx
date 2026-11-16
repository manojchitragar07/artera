import React, { useEffect, useState } from 'react';
import { Layers, Plus, Tag } from 'lucide-react';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { categoryService } from '../../services/category.service';
import { Category, Medium } from '../../types';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediums, setMediums] = useState<Medium[]>([]);

  // New Category State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // New Medium State
  const [medName, setMedName] = useState('');
  const [medDesc, setMedDesc] = useState('');

  const fetchMetadata = async () => {
    try {
      const [catsRes, medsRes] = await Promise.all([
        categoryService.getCategories(),
        categoryService.getMediums(),
      ]);
      if (catsRes.success) setCategories(catsRes.data);
      if (medsRes.success) setMediums(medsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;
    try {
      const res = await categoryService.createCategory({ name: catName, description: catDesc });
      if (res.success) {
        setCategories((prev) => [...prev, res.data]);
        setCatName('');
        setCatDesc('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMedium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;
    try {
      const res = await categoryService.createMedium({ name: medName, description: medDesc });
      if (res.success) {
        setMediums((prev) => [...prev, res.data]);
        setMedName('');
        setMedDesc('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      title="Category & Medium Taxonomies"
      subtitle="Define official artistic categories, physical mediums, and material classifications."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Categories Section */}
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-xl text-[#252321] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#B49A65]" />
              Artistic Categories ({categories.length})
            </h3>

            <form onSubmit={handleCreateCategory} className="space-y-3 pt-2">
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="New Category Name (e.g. Traditional Textiles)"
                className="w-full px-3 py-2 text-xs bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none"
              />
              <textarea
                rows={2}
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Category description..."
                className="w-full px-3 py-2 text-xs bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-wider"
              >
                Add Category
              </button>
            </form>

            <div className="divide-y divide-[#E2D9CB] pt-4">
              {categories.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#252321] font-medium block">{c.name}</strong>
                    <span className="text-[#858078] text-[11px]">{c.slug}</span>
                  </div>
                  <span className="text-[#858078]">{c._count?.artworks || 0} works</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mediums Section */}
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-xl text-[#252321] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#B49A65]" />
              Physical Mediums ({mediums.length})
            </h3>

            <form onSubmit={handleCreateMedium} className="space-y-3 pt-2">
              <input
                type="text"
                required
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="New Medium Name (e.g. Hand-pulled Lithograph)"
                className="w-full px-3 py-2 text-xs bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none"
              />
              <textarea
                rows={2}
                value={medDesc}
                onChange={(e) => setMedDesc(e.target.value)}
                placeholder="Medium description..."
                className="w-full px-3 py-2 text-xs bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-wider"
              >
                Add Medium
              </button>
            </form>

            <div className="divide-y divide-[#E2D9CB] pt-4">
              {mediums.map((m) => (
                <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#252321] font-medium block">{m.name}</strong>
                    <span className="text-[#858078] text-[11px]">{m.slug}</span>
                  </div>
                  <span className="text-[#858078]">{m._count?.artworks || 0} works</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

