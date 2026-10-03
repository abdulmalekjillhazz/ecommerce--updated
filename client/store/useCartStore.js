import { create } from 'zustand';
import api from '../lib/api.js';

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, subtotal };
};

const getStoredCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('store_cart_items');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredCart = (items) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('store_cart_items', JSON.stringify(items));
    } catch {
      // Storage unavailable
    }
  }
};

export const useCartStore = create((set, get) => {
  const initialItems = getStoredCart();
  const { totalItems, subtotal } = calculateTotals(initialItems);

  return {
    items: initialItems,
    totalItems,
    subtotal,
    isCartOpen: false,

    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),

    addToCart: (product, quantity = 1) => {
      const currentItems = [...get().items];
      const pId = product._id || product.id;
      const existingIndex = currentItems.findIndex(
        (item) => (item.product || item._id) === pId
      );

      const price = product.discountPrice || product.price;
      const image = product.images?.[0]?.url || product.image || '';

      if (existingIndex > -1) {
        const item = currentItems[existingIndex];
        const newQty = Math.min(item.quantity + quantity, product.stock || 99);
        currentItems[existingIndex] = { ...item, quantity: newQty };
      } else {
        currentItems.push({
          product: pId,
          name: product.name,
          slug: product.slug,
          image,
          price,
          quantity: Math.min(quantity, product.stock || 99),
          stock: product.stock,
        });
      }

      const totals = calculateTotals(currentItems);
      saveStoredCart(currentItems);
      set({ items: currentItems, ...totals, isCartOpen: true });
    },

    removeFromCart: (productId) => {
      const updated = get().items.filter(
        (item) => (item.product || item._id) !== productId
      );
      const totals = calculateTotals(updated);
      saveStoredCart(updated);
      set({ items: updated, ...totals });
    },

    updateQuantity: (productId, quantity) => {
      if (quantity <= 0) {
        get().removeFromCart(productId);
        return;
      }
      const updated = get().items.map((item) => {
        if ((item.product || item._id) === productId) {
          const maxStock = item.stock || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      });

      const totals = calculateTotals(updated);
      saveStoredCart(updated);
      set({ items: updated, ...totals });
    },

    clearCart: () => {
      saveStoredCart([]);
      set({ items: [], totalItems: 0, subtotal: 0 });
    },

    syncWithDB: async () => {
      try {
        const res = await api.put('/cart/sync', { items: get().items });
        if (res.data?.items) {
          const syncedItems = res.data.items;
          const totals = calculateTotals(syncedItems);
          saveStoredCart(syncedItems);
          set({ items: syncedItems, ...totals });
        }
      } catch {
        // Fallback to local cart
      }
    },

    mergeGuestCartOnLogin: async () => {
      try {
        const localItems = get().items;
        if (localItems.length === 0) {
          // If no local items, load user's existing DB cart
          const res = await api.get('/cart');
          if (res.data?.items) {
            const totals = calculateTotals(res.data.items);
            saveStoredCart(res.data.items);
            set({ items: res.data.items, ...totals });
          }
          return;
        }

        const res = await api.post('/cart/merge', { guestCartItems: localItems });
        if (res.data?.items) {
          const merged = res.data.items;
          const totals = calculateTotals(merged);
          saveStoredCart(merged);
          set({ items: merged, ...totals });
        }
      } catch {
        // Fallback
      }
    },
  };
});
