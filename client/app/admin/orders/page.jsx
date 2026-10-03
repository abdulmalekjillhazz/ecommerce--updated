'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../lib/api.js';
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronDown,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/orders', { params });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setMessage(`Order status updated to "${newStatus}".`);
      setTimeout(() => setMessage(''), 3000);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTrackingUpdate = async (orderId, currentTracking) => {
    const tracking = prompt('Enter Courier Tracking Number (e.g. STEADFAST-98421):', currentTracking || '');
    if (tracking !== null) {
      try {
        await api.put(`/orders/${orderId}/status`, { trackingNumber: tracking });
        fetchOrders();
      } catch (err) {
        alert(err.message || 'Failed to update tracking number.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Order Fulfillment & Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process incoming orders, update shipping statuses, and track COD payments.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search order #, customer, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-600">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-semibold">Loading customer orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold">No orders found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Order Details</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Destination</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status Workflow</th>
                  <th className="py-3.5 px-4 text-right">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Order Details */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        {order.user?.name || order.shippingAddress?.fullName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {order.shippingAddress?.phone}
                      </span>
                    </td>

                    {/* Destination */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      <span>
                        {order.shippingAddress?.city}, {order.shippingAddress?.street}
                      </span>
                    </td>

                    {/* Items preview */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                    </td>

                    {/* Payment status */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 uppercase block text-[11px]">
                        {order.paymentMethod?.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          order.isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ${order.totalAmount?.toFixed(2)}
                    </td>

                    {/* Order Status Controller */}
                    <td className="py-3.5 px-4">
                      <div className="relative inline-block">
                        <select
                          value={order.orderStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs font-bold py-1.5 pl-2.5 pr-8 rounded-xl border focus:outline-none appearance-none cursor-pointer transition-colors ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-blue-50 border-blue-300 text-blue-800'
                              : order.orderStatus === 'Processing'
                              ? 'bg-purple-50 border-purple-300 text-purple-800'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-red-50 border-red-300 text-red-800'
                              : 'bg-amber-50 border-amber-300 text-amber-800'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>

                    {/* Courier Tracking */}
                    <td className="py-3.5 px-4 text-right">
                      {order.trackingNumber ? (
                        <button
                          onClick={() => handleTrackingUpdate(order._id, order.trackingNumber)}
                          className="font-mono text-[11px] text-blue-600 hover:underline"
                          title="Click to update tracking number"
                        >
                          {order.trackingNumber}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTrackingUpdate(order._id, '')}
                          className="text-[11px] font-semibold text-slate-400 hover:text-blue-600"
                        >
                          + Add Tracking
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
