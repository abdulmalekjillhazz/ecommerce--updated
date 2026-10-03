'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore.js';
import AdminSidebar from '../../components/layout/AdminSidebar.jsx';
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, isAuthenticated, isAdmin, isAuthChecked, fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (!isAuthChecked) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 text-white">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs font-semibold text-slate-400">Verifying administrative credentials...</p>
      </div>
    );
  }

  // Guard: Must be logged in AND have role === 'admin'
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Administrative Access Required</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              This section is restricted to store administrators. You must sign in with an authorized admin account.
            </p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 text-left space-y-1">
            <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
              Default Admin Credentials:
            </span>
            <p><strong>Email:</strong> admin@store.com</p>
            <p><strong>Password:</strong> Admin@12345</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/login?redirect=/admin"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Sign In as Administrator
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700">
              API Server Online &bull; Port 5000 REST
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500">
              Logged in as <strong className="text-slate-800">{user?.name}</strong>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-900 border border-amber-300">
              Super Admin
            </span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
