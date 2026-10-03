'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api.js';
import { ArrowLeft, Plus, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Audio',
    brand: '',
    price: '',
    discountPrice: '',
    stock: '15',
    imageUrl: '',
    shortDescription: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    isFeatured: false,
  });

  const [specs, setSpecs] = useState([
    { key: 'Warranty', value: '1 Year Official' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        stock: Number(formData.stock),
        shortDescription: formData.shortDescription,
        description: formData.description,
        isFeatured: formData.isFeatured,
        metaTitle: formData.metaTitle || `${formData.name} | Official Store`,
        metaDescription: formData.metaDescription || formData.shortDescription,
        images: [
          {
            url:
              formData.imageUrl ||
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
            alt: formData.name,
            isPrimary: true,
          },
        ],
        specs: specs.filter((s) => s.key.trim() && s.value.trim()),
      };

      await api.post('/products', payload);
      router.push('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product to database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Inventory
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Add New Product
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Core Product Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
            1. Core Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Product Title</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. Sony WH-1000XM5 Wireless Noise Cancelling Headphones"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SKU (Stock Keeping Unit)</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
                placeholder="e.g. AUDIO-SONY-XM5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
                placeholder="e.g. Sony, Apple, Keychron"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="Audio">Audio & ANC</option>
                <option value="Wearables">Smartwatches & Fitness</option>
                <option value="Computing">Keyboards & Mice</option>
                <option value="Photography">Photography & Drones</option>
                <option value="Lifestyle">Lifestyle & Carry</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Inventory Stock Units</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Regular Price ($)</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="399.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Price ($) (Optional)</label>
              <input
                type="number"
                name="discountPrice"
                step="0.01"
                min="0"
                value={formData.discountPrice}
                onChange={handleInputChange}
                placeholder="349.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Media & Descriptions */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
            2. Product Media & Content
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Product Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enter a high-resolution Unsplash or Cloudinary image URL.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Short Description (SEO & Preview)</label>
              <textarea
                name="shortDescription"
                rows={2}
                value={formData.shortDescription}
                onChange={handleInputChange}
                required
                placeholder="Brief 1-2 sentence highlight for search engine snippets and product cards..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Detailed Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Detailed features, ergonomics, audio performance, warranty information..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Technical Specifications
            </h2>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Spec Field
            </button>
          </div>

          <div className="space-y-3">
            {specs.map((spec, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="e.g. Battery Life"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="e.g. 30 Hours ANC"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
                {specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SEO Meta Tags */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 uppercase tracking-wider">
            4. Search Engine Optimization (SEO)
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">SEO Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                placeholder="Product Name | Buy Online - ShopSphere"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SEO Meta Description</label>
              <textarea
                name="metaDescription"
                rows={2}
                value={formData.metaDescription}
                onChange={handleInputChange}
                placeholder="155-character snippet for Google search preview..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600"
              />
              <span className="font-bold text-slate-700">Display in Homepage Featured Showcase</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing to Database...
              </>
            ) : (
              'Publish Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
