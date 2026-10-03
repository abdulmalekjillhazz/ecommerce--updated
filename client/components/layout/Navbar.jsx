'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useCartStore } from '../../store/useCartStore.js';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Package,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout, fetchMe } = useAuthStore();
  const { totalItems, toggleCart, mergeGuestCartOnLogin } = useCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    fetchMe().then((authenticatedUser) => {
      if (authenticatedUser) {
        mergeGuestCartOnLogin();
      }
    });
  }, [fetchMe, mergeGuestCartOnLogin]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                E
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  ShopSphere
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Premium Store
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/products?category=Audio"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                Audio
              </Link>
              <Link
                href="/products?category=Wearables"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                Wearables
              </Link>
              <Link
                href="/products?category=Computing"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                Computing
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              placeholder="Search genuine electronics, audio, gadgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 text-slate-800 rounded-full border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Admin Badge/Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors border border-amber-300"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Admin Panel
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <span className="hidden md:inline text-sm font-medium text-slate-800 max-w-[120px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700">
                        {user?.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-800 hover:bg-amber-50 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      href="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Package className="w-4 h-4 text-slate-500" />
                      My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-sm hover:shadow transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-800 px-2 py-1.5 hover:bg-slate-50 rounded"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-800 px-2 py-1.5 hover:bg-slate-50 rounded"
              >
                All Products
              </Link>
              <Link
                href="/products?category=Audio"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-800 px-2 py-1.5 hover:bg-slate-50 rounded"
              >
                Audio & Headphones
              </Link>
              <Link
                href="/products?category=Wearables"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-800 px-2 py-1.5 hover:bg-slate-50 rounded"
              >
                Smartwatches & Wearables
              </Link>
              <Link
                href="/products?category=Computing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-800 px-2 py-1.5 hover:bg-slate-50 rounded"
              >
                Keyboards & Mice
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-amber-800 bg-amber-50 px-2 py-1.5 rounded"
                >
                  Admin Panel (Port 5000 API)
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
