import { create } from 'zustand';
import api from '../lib/api.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  isAuthChecked: false,
  error: null,

  fetchMe: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/auth/me');
      const user = response.data;
      set({
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading: false,
        isAuthChecked: true,
      });
      return user;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        isAuthChecked: true,
      });
      return null;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const user = response.data.user;
      set({
        user,
        isAuthenticated: true,
        isAdmin: user?.role === 'admin',
        isLoading: false,
      });
      return { success: true, user };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', payload);
      const user = response.data.user;
      set({
        user,
        isAuthenticated: true,
        isAdmin: user?.role === 'admin',
        isLoading: false,
      });
      return { success: true, user };
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post('/auth/logout');
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
