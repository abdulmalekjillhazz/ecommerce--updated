'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore.js';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeFromCart, clearCart } =
    useCartStore();

  const tax = subtotal * 0.05;
  const shipping = subtotal >= 200 || subtotal === 0 ? 0 : 15;
  const total = subtotal + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 pb-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review your selected audio, peripherals, and wearables before secure checkout.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
          >
            Clear Entire Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
          <p className="text-xs text-slate-500">
            Looks like you haven&apos;t added any items yet. Discover genuine electronics with fast delivery.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
          >
            Explore Catalog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping progress banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs">
              <div className="flex justify-between font-bold text-blue-900 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  {subtotal >= 200
                    ? '🎉 You unlocked FREE Nationwide Express Shipping!'
                    : `Add $${(200 - subtotal).toFixed(2)} more to unlock FREE Shipping!`}
                </span>
                <span>${subtotal.toFixed(0)} / $200</span>
              </div>
              <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / 200) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
              {items.map((item) => {
                const pId = item.product || item._id;
                return (
                  <div key={pId} className="p-5 flex flex-col sm:flex-row gap-5 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-2xl bg-slate-50 border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 space-y-1 w-full text-center sm:text-left">
                      <Link
                        href={`/products/${item.slug || pId}`}
                        className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs font-semibold text-slate-400">
                        Unit Price: ${item.price}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => updateQuantity(pId, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(pId, item.quantity + 1)}
                        disabled={item.quantity >= (item.stock || 99)}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-600 disabled:opacity-40 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line total & remove */}
                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                      <span className="font-black text-sm text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(pId)}
                        className="text-slate-400 hover:text-red-600 text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'text-slate-900'}>
                  {shipping === 0 ? 'Free Shipping' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted Checkout & Cash on Delivery Available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
