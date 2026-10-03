'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

export default function ProductFilters({
  categories = [],
  selectedCategory,
  onSelectCategory,
  priceRange,
  onChangePrice,
  inStockOnly,
  onToggleInStock,
  sortBy,
  onChangeSort,
  onResetFilters,
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort Products
        </label>
        <select
          value={sortBy}
          onChange={(e) => onChangeSort(e.target.value)}
          className="w-full text-xs font-medium py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Categories
        </label>
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => onSelectCategory('All')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-between items-center ${
              !selectedCategory || selectedCategory === 'All'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-between items-center ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCategory === cat.name ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Max Price: ${priceRange}
        </label>
        <input
          type="range"
          min="50"
          max="3000"
          step="50"
          value={priceRange}
          onChange={(e) => onChangePrice(Number(e.target.value))}
          className="w-full accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>$50</span>
          <span>$3,000</span>
        </div>
      </div>

      {/* Availability */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
          />
          <span className="text-xs font-medium text-slate-700">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}
