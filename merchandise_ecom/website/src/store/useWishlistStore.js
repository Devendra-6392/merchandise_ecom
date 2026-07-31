import { create } from "zustand";

export const useWishlistStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchWishlist: async (token) => {
    if (!token) {
      set({ items: [], loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/v1/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.wishlist) {
        // Map _id to id
        const mapped = data.wishlist.products.map(p => ({ ...p, id: p._id }));
        set({ items: mapped, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      set({ error: "Failed to load wishlist", loading: false });
    }
  },

  addToWishlist: async (product, token) => {
    if (!token) return { success: false, message: "Please login to add to wishlist" };
    
    // Optimistic UI update
    const prevItems = get().items;
    if (!prevItems.find(p => p.id === product.id)) {
      set({ items: [...prevItems, product] });
    }

    try {
      const res = await fetch("/api/v1/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        set({ items: prevItems });
        return { success: false, message: data.message };
      }
      return { success: true };
    } catch (error) {
      set({ items: prevItems });
      return { success: false, message: "Network error" };
    }
  },

  removeFromWishlist: async (productId, token) => {
    if (!token) return;

    // Optimistic UI update
    const prevItems = get().items;
    set({ items: prevItems.filter(p => p.id !== productId) });

    try {
      const res = await fetch(`/api/v1/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        set({ items: prevItems });
      }
    } catch (error) {
      set({ items: prevItems });
    }
  },

  isInWishlist: (productId) => {
    return get().items.some(p => p.id === productId);
  },

  clearWishlist: () => set({ items: [] })
}));
