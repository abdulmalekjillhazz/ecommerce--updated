import React from 'react';
import Link from 'next/link';
import ProductCard from '../components/product/ProductCard.jsx';
import { ArrowRight, Sparkles, Zap, Shield, Headphones, Watch, Keyboard, Camera, ShoppingBag } from 'lucide-react';

async function getFeaturedProducts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/products?isFeatured=true&limit=8`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.products || [];
  } catch (error) {
    console.error('Failed to fetch featured products from port 5000:', error.message);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  const categories = [
    { name: 'Audio & ANC', icon: Headphones, count: '12 Items', color: 'from-blue-500 to-indigo-600', link: '/products?category=Audio' },
    { name: 'Smartwatches', icon: Watch, count: '8 Items', color: 'from-purple-500 to-pink-600', link: '/products?category=Wearables' },
    { name: 'Keyboards & Mice', icon: Keyboard, count: '15 Items', color: 'from-emerald-500 to-teal-600', link: '/products?category=Computing' },
    { name: 'Photography', icon: Camera, count: '6 Items', color: 'from-amber-500 to-orange-600', link: '/products?category=Photography' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 sm:py-24">
        {/* Subtle decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Next.js 14 Client (:3000) &bull; Express REST API (:5000)</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Engineered Sound & Precision Tech For Modern Creators.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Experience studio-grade acoustic engineering, tactile custom mechanical keyboards, and precision wearable health trackers with official warranty and free delivery.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                >
                  Explore Product Catalog
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=Audio"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  View Noise Cancelling
                </Link>
              </div>

              {/* Architecture Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs">
                <div>
                  <span className="block text-slate-400">Client Engine</span>
                  <span className="font-bold text-white">Next.js SSR (:3000)</span>
                </div>
                <div>
                  <span className="block text-slate-400">Server Backend</span>
                  <span className="font-bold text-white">Node Express (:5000)</span>
                </div>
                <div>
                  <span className="block text-slate-400">Database</span>
                  <span className="font-bold text-white">MongoDB Mongoose</span>
                </div>
              </div>
            </div>

            {/* Right showcase card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-gradient-to-tr from-slate-800/80 to-slate-800/30 p-2 rounded-3xl border border-slate-700/60 shadow-2xl backdrop-blur-sm">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
                    alt="Featured Sony WH-1000XM5 Headphone"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-400/20">
                    Staff Pick &bull; 4.8 &starf;
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                        Premium Audio
                      </span>
                      <h3 className="font-bold text-base text-white">
                        Sony WH-1000XM5 Wireless
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-white">$349</span>
                      <span className="block text-xs text-slate-400 line-through">$399</span>
                    </div>
                  </div>
                  <Link
                    href="/products/sony-wh-1000xm5-wireless-noise-cancelling-headphones"
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all"
                  >
                    View Product Specs
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Carefully curated hardware categories for performance and durability.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            Browse All Categories
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.link}
                className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Electronics
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top-rated audio devices, smart gadgets, and productivity peripherals.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            View All Products
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">Backend API Standby (Port 5000)</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Start your server with <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-blue-600">npm run dev</code> inside <code className="font-mono">server/</code> and seed data with <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-blue-600">npm run seed</code> to see live products.
            </p>
            <Link
              href="/products"
              className="inline-block px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Browse Products Page
            </Link>
          </div>
        )}
      </section>

      {/* Trust & Guarantees Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-blue-200">
              Reliable Commerce Guarantee
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Cash on Delivery & Secure Online Card Payments.
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              We understand security. Inspect your package at delivery with our hassle-free inspection policy across Dhaka, Chittagong, and all 64 districts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/products"
              className="px-6 py-3 bg-white text-blue-900 font-bold text-xs rounded-xl shadow-md hover:bg-blue-50 transition-colors text-center"
            >
              Start Shopping
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 bg-blue-900/60 text-white border border-white/20 font-bold text-xs rounded-xl hover:bg-blue-900 transition-colors text-center"
            >
              Admin Demonstration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
