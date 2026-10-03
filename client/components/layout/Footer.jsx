import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-900/50 text-blue-400 rounded-2xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Express Nationwide Shipping</h4>
                <p className="text-xs text-slate-400">Fast delivery across all 64 districts</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-900/50 text-emerald-400 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">100% Genuine Guarantee</h4>
                <p className="text-xs text-slate-400">Directly sourced official brands</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-900/50 text-amber-400 rounded-2xl">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">7-Day Easy Returns</h4>
                <p className="text-xs text-slate-400">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-900/50 text-purple-400 rounded-2xl">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-400">Expert tech assistance anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                E
              </div>
              <span className="font-bold text-xl text-white tracking-tight">ShopSphere</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated premium consumer electronics, wireless audio, mechanical keyboards, and lifestyle accessories with fast delivery and manufacturer warranty.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Architecture:</span>
              <span className="inline-block px-2.5 py-1 text-[11px] rounded bg-slate-800 text-blue-400 border border-slate-700">
                Client (Port 3000) &bull; API Server (Port 5000)
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=Audio" className="hover:text-white transition-colors">
                  Audio & Headphones
                </Link>
              </li>
              <li>
                <Link href="/products?category=Wearables" className="hover:text-white transition-colors">
                  Smartwatches & Fitness
                </Link>
              </li>
              <li>
                <Link href="/products?category=Computing" className="hover:text-white transition-colors">
                  Keyboards & Mice
                </Link>
              </li>
              <li>
                <Link href="/products?category=Photography" className="hover:text-white transition-colors">
                  Cameras & Drones
                </Link>
              </li>
              <li>
                <Link href="/products?category=Lifestyle" className="hover:text-white transition-colors">
                  Backpacks & Everyday Carry
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 text-slate-400 transition-colors">
                  Admin Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Stay Updated
            </h5>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get exclusive discounts, new product releases, and tech guides.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
              />
              <button className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
