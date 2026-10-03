'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '../../components/product/ProductCard.jsx';
import ProductFilters from '../../components/product/ProductFilters.jsx';
import api from '../../lib/api.js';
import { Search, Loader2, PackageOpen } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'newest';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState(3000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });

  // Fetch categories list
  useEffect(() => {
    api
      .get('/products/categories')
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch(() => {});
  }, []);

  // Fetch products with current active filters
  const loadProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sort: sortBy,
        };

        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchKeyword.trim()) {
          params.search = searchKeyword.trim();
        }
        if (priceRange < 3000) {
          params.maxPrice = priceRange;
        }
        if (inStockOnly) {
          params.inStock = 'true';
        }

        const res = await api.get('/products', { params });
        const data = res.data;
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, totalPages: 1, totalCount: 0 });
      } catch (err) {
        console.error('Error fetching products from API:', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, searchKeyword, priceRange, inStockOnly, sortBy]
  );

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchKeyword('');
    setPriceRange(3000);
    setInStockOnly(false);
    setSortBy('newest');
    router.push('/products');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Electronics & Gadgets Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse our complete selection of noise-cancelling audio, mechanical keyboards, and wearables.
          </p>
        </div>

        {/* Live Filter Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search keywords, brands, models..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            priceRange={priceRange}
            onChangePrice={(p) => setPriceRange(p)}
            inStockOnly={inStockOnly}
            onToggleInStock={(v) => setInStockOnly(v)}
            sortBy={sortBy}
            onChangeSort={(s) => setSortBy(s)}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 bg-white px-4 py-2.5 rounded-xl border border-slate-200">
            <span>
              Showing <strong className="text-slate-800">{products.length}</strong> of{' '}
              <strong className="text-slate-800">{pagination.totalCount}</strong> items
            </span>
            {selectedCategory !== 'All' && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded">
                Category: {selectedCategory}
              </span>
            )}
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Loading catalog from port 5000 API...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <PackageOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, searching for another keyword, or resetting your category filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => loadProducts(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-slate-600 px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => loadProducts(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
