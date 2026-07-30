import { create } from "zustand";
import { PRODUCTS } from "@/components/home/CollectionsGrid";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const DEFAULT_LOW_STOCK = [
  {
    _id: "prod_ls_1",
    id: "p1",
    name: "ORANGERED OVERSIZED MONOLITH HOODIE",
    sku: "HOOD-MONO-01",
    category: "Outerwear",
    basePrice: 2499,
    stockQuantity: 4,
    isActive: true,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "prod_ls_2",
    id: "p4",
    name: "DECONSTRUCTED FLIGHT BOMBER JACKET",
    sku: "BOMB-FLGT-04",
    category: "Outerwear",
    basePrice: 4999,
    stockQuantity: 8,
    isActive: true,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80",
  },
  {
    _id: "prod_ls_3",
    id: "p6",
    name: "SIGNATURE MONOGRAM HEAVYWEIGHT TEE",
    sku: "TEE-MONO-06",
    category: "Tops",
    basePrice: 1299,
    stockQuantity: 12,
    isActive: true,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
  },
];

export const useAdminStore = create((set, get) => ({
  stats: {
    totalProducts: 48,
    totalOrders: 156,
    totalRevenue: 489250,
    pendingOrdersCount: 24,
    printingOrdersCount: 18,
    deliveredOrdersCount: 98,
    lowStockProductsCount: 3,
  },
  lowStockProducts: DEFAULT_LOW_STOCK,
  loading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success && data.stats) {
        set({
          stats: data.stats,
          lowStockProducts: data.lowStockProducts?.length ? data.lowStockProducts : DEFAULT_LOW_STOCK,
          loading: false,
        });
        return data.stats;
      }
    } catch (err) {
      console.warn("Fetch admin stats notice:", err.message);
    }

    set({ loading: false });
    return get().stats;
  },

  restockProduct: (productId, amount = 25) => {
    set((state) => {
      const updatedLowStock = state.lowStockProducts.map((p) => {
        if (p._id === productId || p.id === productId) {
          return { ...p, stockQuantity: p.stockQuantity + amount };
        }
        return p;
      }).filter((p) => p.stockQuantity <= 20);

      return {
        lowStockProducts: updatedLowStock,
        stats: {
          ...state.stats,
          lowStockProductsCount: updatedLowStock.length,
        },
      };
    });
  },
}));
