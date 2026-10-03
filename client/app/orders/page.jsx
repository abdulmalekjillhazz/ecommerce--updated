'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore.js';
import api from '../../lib/api.js';
import { Package, ChevronRight, Clock, Loader2, ArrowRight } from 'lucide-react';

export default function OrderHistoryPage() {
  const { user, isAuthenticated, isAuthChecked } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('/orders/mine')
        .then((res) => {
          setOrders(res.data || []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (isAuthChecked) {
      setLoading(false);
    }
  }, [isAuthenticated, isAuthChecked]);

  if (!isAuthChecked || loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <Package className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign In to View Orders</h2>
        <p className="text-xs text-slate-500">
          Please sign in to track your order deliveries, download invoices, and see your purchase history.
        </p>
        <Link
          href="/login?redirect=/orders"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review recent purchases, check delivery timeline, and access order tracking.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Clock className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">No orders found yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven&apos;t placed any orders yet. Discover our latest noise cancelling headphones and keyboards!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{order.orderNumber}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} &bull; {order.orderItems?.length} items
                </p>
                <div className="flex gap-2 pt-2">
                  {order.orderItems?.slice(0, 3).map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      title={item.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-slate-50"
                    />
                  ))}
                  {order.orderItems?.length > 3 && (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center border border-slate-200">
                      +{order.orderItems.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Total</span>
                  <span className="text-base font-black text-slate-900">
                    ${order.totalAmount?.toFixed(2)}
                  </span>
                </div>

                <Link
                  href={`/orders/${order._id}`}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  View Order
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
