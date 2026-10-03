'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api.js';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/analytics')
      .then((res) => {
        setAnalytics(res.data);
      })
      .catch((err) => {
        console.error('Error fetching admin analytics:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading store performance metrics...</p>
      </div>
    );
  }

  const kpis = analytics?.kpis || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockAlerts: 0,
  };
  const statusCounts = analytics?.statusCounts || {};
  const recentOrders = analytics?.recentOrders || [];
  const lowStockProducts = analytics?.lowStockProducts || [];

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Store Performance Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics and inventory health synced with Port 5000 REST API.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            Manage All Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">
              ${kpis.totalRevenue?.toFixed(2)}
            </span>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Settled paid orders
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Orders Placed
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{kpis.totalOrders}</span>
            <p className="text-[11px] text-slate-500 mt-1">Across all districts</p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Catalog
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{kpis.totalProducts}</span>
            <p className="text-[11px] text-slate-500 mt-1">Ready for purchase</p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customers
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900">{kpis.totalCustomers}</span>
            <p className="text-[11px] text-slate-500 mt-1">Registered buyer accounts</p>
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          Order Processing Queue
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-center">
            <span className="text-[11px] font-bold text-amber-800 uppercase block">Pending</span>
            <span className="text-2xl font-black text-amber-950">{statusCounts.Pending || 0}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 text-center">
            <span className="text-[11px] font-bold text-blue-800 uppercase block">Processing</span>
            <span className="text-2xl font-black text-blue-950">{statusCounts.Processing || 0}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-center">
            <span className="text-[11px] font-bold text-indigo-800 uppercase block">Shipped</span>
            <span className="text-2xl font-black text-indigo-950">{statusCounts.Shipped || 0}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Delivered</span>
            <span className="text-2xl font-black text-emerald-950">{statusCounts.Delivered || 0}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-center">
            <span className="text-[11px] font-bold text-red-800 uppercase block">Cancelled</span>
            <span className="text-2xl font-black text-red-950">{statusCounts.Cancelled || 0}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Low Stock Warnings & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Recent Customer Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">No orders recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentOrders.map((ord) => (
                <div key={ord._id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-900 block">{ord.orderNumber}</span>
                    <span className="text-[11px] text-slate-400">
                      {ord.user?.name || ord.shippingAddress?.fullName} &bull;{' '}
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                    <span className="font-black text-slate-900 text-sm">
                      ${ord.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Inventory Alerts
              </h2>
            </div>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
              {lowStockProducts.length} Alert{lowStockProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <p className="text-xs text-emerald-600 font-semibold">
                ✓ All inventory items are well-stocked.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3"
                >
                  <img
                    src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    alt={prod.name}
                    className="w-12 h-12 object-cover rounded-xl bg-white border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-900 truncate">{prod.name}</p>
                    <span className="text-[11px] font-bold text-red-600">
                      {prod.stock} unit{prod.stock !== 1 ? 's' : ''} remaining
                    </span>
                  </div>
                  <Link
                    href={`/admin/products/${prod._id}/edit`}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
                  >
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
