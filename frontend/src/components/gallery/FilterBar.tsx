import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Category, Medium } from '../../types';

interface FilterBarProps {
  categories: Category[];
  mediums: Medium[];
  selectedCategory: string;
  selectedMedium: string;
  searchQuery: string;
  sortBy: string;
  onCategoryChange: (slug: string) => void;
  onMediumChange: (id: string) => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  mediums,
  selectedCategory,
  selectedMedium,
  searchQuery,
  sortBy,
  onCategoryChange,
  onMediumChange,
  onSearchChange,
  onSortChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(selectedCategory || selectedMedium || searchQuery || sortBy !== 'newest');

  return (
    <div className="bg-[#FAF7F2] border border-[#E2D9CB] p-4 sm:p-5 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#858078]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by artwork title, artist name, or keywords..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] placeholder-[#858078]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858078] hover:text-[#252321]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="min-w-[150px]">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 text-xs uppercase tracking-wider bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Medium Dropdown */}
          <div className="min-w-[150px]">
            <select
              value={selectedMedium}
              onChange={(e) => onMediumChange(e.target.value)}
              className="w-full px-3 py-2 text-xs uppercase tracking-wider bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] cursor-pointer"
            >
              <option value="">All Mediums</option>
              {mediums.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="min-w-[140px]">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-3 py-2 text-xs uppercase tracking-wider bg-[#F5F0E8] border border-[#D8CEBF] focus:outline-none focus:border-[#B49A65] text-[#252321] cursor-pointer"
            >
              <option value="newest">Newest Additions</option>
              <option value="popular">Most Visited</option>
              <option value="featured">Curator’s Choice</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-wider text-[#858078] hover:text-[#252321] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

