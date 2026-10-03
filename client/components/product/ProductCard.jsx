'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore.js';
import { Star, ShoppingCart, Check } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const [added, setAdded] = React.useState(false);

  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const primaryImage =
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300">
      {/* Product Image Area */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full bg-slate-100 overflow-hidden"
      >
        <img
          src={primaryImage}
          alt={product.images?.[0]?.alt || product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase bg-red-600 text-white rounded-md shadow-sm">
              Save {discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase bg-blue-600 text-white rounded-md shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Stock status overlay if out of stock */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-slate-800 text-white rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-600 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <span>{product.brand}</span>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              {product.ratingsAverage || 5.0}
            </span>
            <span className="text-xs text-slate-400">
              ({product.ratingsCount || 12})
            </span>
          </div>
        </div>

        {/* Price and Add to Cart Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">
              ${price}
            </span>
            {originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                ${originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center justify-center transition-all ${
              added
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-white hover:bg-blue-600 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <Check className="w-4 h-4 animate-in zoom-in" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
