import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import { Artwork, Category, Medium } from '../../types';
import { artworkService } from '../../services/artwork.service';
import { categoryService } from '../../services/category.service';
import { ArtworkCard } from '../../components/gallery/ArtworkCard';
import { FilterBar } from '../../components/gallery/FilterBar';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mediums, setMediums] = useState<Medium[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filter States from URL query params
  const categoryParam = searchParams.get('category') || '';
  const mediumParam = searchParams.get('medium') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sortBy') || 'newest';

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catsRes, medsRes] = await Promise.all([
          categoryService.getCategories(),
          categoryService.getMediums(),
        ]);
        if (catsRes.success) setCategories(catsRes.data);
        if (medsRes.success) setMediums(medsRes.data);
      } catch (err) {
        console.error('Error fetching gallery categories:', err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const params: any = {
          page,
          limit: 12,
          categorySlug: categoryParam || undefined,
          mediumId: mediumParam || undefined,
          search: searchParam || undefined,
          sortBy: sortParam,
        };

        const res = await artworkService.getArtworks(params);
        if (res.success) {
          setArtworks(res.data);
          if (res.pagination) {
            setTotalCount(res.pagination.total);
            setTotalPages(res.pagination.totalPages);
          }
        }
      } catch (err) {
        console.error('Failed to load gallery artworks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [categoryParam, mediumParam, searchParam, sortParam, page]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setPage(1);
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#B49A65] font-semibold block mb-2">
          Sanctuary Collection
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#252321]">
          Explore the Digital Gallery Wall
        </h1>
        <p className="text-sm text-[#858078] mt-3 font-light leading-relaxed">
          Step into our asymmetrical exhibition halls. Browse by medium, school, or craft lineage. Every piece is presented in archival museum fidelity.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        categories={categories}
        mediums={mediums}
        selectedCategory={categoryParam}
        selectedMedium={mediumParam}
        searchQuery={searchParam}
        sortBy={sortParam}
        onCategoryChange={(slug) => updateParam('category', slug)}
        onMediumChange={(id) => updateParam('medium', id)}
        onSearchChange={(q) => updateParam('search', q)}
        onSortChange={(sort) => updateParam('sortBy', sort)}
        onReset={handleReset}
      />

      {/* Results Count Placard */}
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#858078] mb-8 pb-3 border-b border-[#E2D9CB]">
        <span>
          Showing <strong className="text-[#252321]">{artworks.length}</strong> of{' '}
          <strong className="text-[#252321]">{totalCount}</strong> catalogued masterpieces
        </span>
        {categoryParam && (
          <span className="text-[#B49A65]">
            Filtered by Category: {categories.find((c) => c.slug === categoryParam)?.name}
          </span>
        )}
      </div>

      {/* Gallery Wall Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-[#EAE2D5] animate-pulse rounded-none" />
          ))}
        </div>
      ) : artworks.length === 0 ? (
        <div className="py-24 text-center bg-[#FAF7F2] border border-[#E2D9CB]">
          <Compass className="w-12 h-12 text-[#858078] mx-auto mb-3" />
          <h3 className="font-serif text-2xl text-[#252321]">No Artworks Discovered</h3>
          <p className="text-xs text-[#858078] mt-1">
            Try adjusting your search criteria or clearing filters.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-6 py-2 bg-[#252321] text-[#FAF7F2] text-xs uppercase tracking-wider"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
          {artworks.map((artwork, idx) => {
            // Stagger vertical offsets for authentic asymmetric gallery wall rhythm
            const offsetClass =
              idx % 3 === 1 ? 'lg:translate-y-8' : idx % 3 === 2 ? 'lg:-translate-y-4' : '';

            return (
              <div key={artwork.id} className={offsetClass}>
                <ArtworkCard artwork={artwork} />
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 pt-8 border-t border-[#E2D9CB] flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-[#D8CEBF] text-xs uppercase tracking-widest text-[#47382F] hover:bg-[#252321] hover:text-[#FAF7F2] disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-[#858078] px-3 font-medium">
            Hall {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-[#D8CEBF] text-xs uppercase tracking-widest text-[#47382F] hover:bg-[#252321] hover:text-[#FAF7F2] disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

