'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '../../../lib/api.js';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowLeft,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      api
        .get(`/orders/${params.id}`)
        .then((res) => {
          setOrder(res.data);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load order information.');
        })
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-semibold">Retrieving order details from API...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Could not locate this order.'}</p>
        <Link
          href="/orders"
          className="inline-block px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order History
        </Link>
        <span className="text-xs text-slate-400 font-mono">ID: {order._id}</span>
      </div>

      {/* Confirmation Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
              Order Confirmed &bull; {order.orderNumber}
            </h1>
            <p className="text-xs text-emerald-800 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right shrink-0">
          <span className="text-xs text-emerald-700 font-medium block">Total Charged</span>
          <span className="text-2xl font-black text-emerald-950">${order.totalAmount?.toFixed(2)}</span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Fulfillment Timeline
        </h2>

        <div className="grid grid-cols-4 gap-2 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step} className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? 'text-blue-600 font-bold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {order.trackingNumber && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
            <span className="text-slate-600 font-medium">Courier Tracking Number:</span>
            <span className="font-mono font-bold text-slate-900">{order.trackingNumber}</span>
          </div>
        )}
      </div>

      {/* Grid: Shipping Address & Order Items */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Ordered items */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Items in this Order ({order.orderItems?.length})
          </h2>

          <div className="divide-y divide-slate-100">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="py-3.5 first:pt-0 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl bg-slate-50 border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs text-slate-900 truncate">{item.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Qty: {item.quantity} &times; ${item.price}
                  </p>
                </div>
                <span className="font-bold text-xs text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">${order.itemsPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice?.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax (5%)</span>
              <span>${order.taxPrice?.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
              <span>Grand Total</span>
              <span>${order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment summary */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-xs">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Delivery Destination</span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.street}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.zip}
              </p>
              <p>{order.shippingAddress?.country}</p>
              <p className="pt-1 font-semibold text-slate-800">
                Phone: {order.shippingAddress?.phone}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-xs">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Payment Details</span>
            </div>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-bold text-slate-900 uppercase">
                  {order.paymentMethod?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                    order.isPaid
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {order.isPaid ? 'Paid' : 'Unpaid (COD)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
