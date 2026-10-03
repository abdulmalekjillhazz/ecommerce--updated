'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../../store/useCartStore.js';
import { useAuthStore } from '../../../store/useAuthStore.js';
import api from '../../../lib/api.js';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

export default function ProductDetailClient({ initialProduct }) {
  const [product, setProduct] = useState(initialProduct);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const price = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1500);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      setReviewSuccess('Thank you! Your verified review has been published.');
      setReviewTitle('');
      setReviewComment('');
      // Prepend review to state
      setProduct((prev) => ({
        ...prev,
        reviews: [res.data, ...(prev.reviews || [])],
        ratingsCount: (prev.ratingsCount || 0) + 1,
      }));
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review. You may have already reviewed this product.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const currentImage = product.images?.[activeImageIndex]?.url || product.images?.[0]?.url;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/products" className="hover:text-blue-600">Catalog</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href={`/products?category=${product.category}`} className="hover:text-blue-600">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase bg-red-600 text-white rounded-lg shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-blue-600 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-bold text-blue-600 uppercase tracking-wider">
                {product.brand} &bull; {product.category}
              </span>
              <span className="font-mono text-slate-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.ratingsAverage || 5)
                        ? 'fill-current'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-900">
                {product.ratingsAverage || 5.0}
              </span>
              <span className="text-xs text-slate-400">
                ({product.ratingsCount || 0} customer reviews)
              </span>
            </div>
          </div>

          {/* Price Area */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">${price}</span>
            {originalPrice && (
              <span className="text-base text-slate-400 line-through">
                ${originalPrice}
              </span>
            )}
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
              In Stock & Ready to Ship
            </span>
          </div>

          {/* Short description */}
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Stock status indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.stock > 5 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
              }`}
            />
            <span className="font-semibold text-slate-700">
              {product.stock > 0 ? `${product.stock} units available in inventory` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity and Add to Cart Button */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-md ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:shadow-lg disabled:opacity-50'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5 animate-in zoom-in" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add {quantity} to Cart
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-slate-600 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Express Courier</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>7 Days Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Verified Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Customer Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div className="prose prose-slate max-w-none text-sm text-slate-600">
                <h3 className="text-base font-bold text-slate-900 mb-2">Overview</h3>
                <p>{product.description}</p>
              </div>

              {product.specs && product.specs.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">Key Hardware Specs</h3>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                    {product.specs.map((spec, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs ${
                          i % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                        }`}
                      >
                        <span className="font-bold text-slate-700">{spec.key}</span>
                        <span className="sm:col-span-2 text-slate-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{rev.userName}</span>
                          {rev.isVerifiedPurchase && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-current' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800">{rev.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No customer reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>

              {/* Submit a Review Form */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-2">Write a Product Review</h3>
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                    {reviewSuccess && (
                      <div className="p-3 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl">
                        {reviewSuccess}
                      </div>
                    )}
                    {reviewError && (
                      <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
                        {reviewError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Your Rating
                      </label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value={5}>5 Stars - Outstanding</option>
                        <option value={4}>4 Stars - Great</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Poor</option>
                        <option value={1}>1 Star - Terribly Unhappy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Best noise cancellation I have ever used"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        required
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Review Details
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe build quality, battery life, sound, or ergonomics..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                        className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
                    </button>
                  </form>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <p className="text-xs text-slate-600">
                      Please sign in to submit a verified product review.
                    </p>
                    <Link
                      href="/login"
                      className="px-4 py-1.5 bg-blue-600 text-white font-semibold text-xs rounded-xl"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
