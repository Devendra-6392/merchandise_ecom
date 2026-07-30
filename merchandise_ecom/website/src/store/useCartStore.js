import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [
        {
          id: "default-item-1",
          product: {
            id: "prod_coat_01",
            name: "ATELIER DOUBLE-BREASTED TRENCH",
            price: 580,
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85",
            hoverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
            category: "COATS",
          },
          size: "L",
          color: "BLACK",
          printType: "DTF Printing",
          printLocation: "Front",
          artworkUrl: null,
          unitPrice: 580,
          quantity: 1,
          totalItemPrice: 580,
        },
      ],
      promoCode: "",
      discount: 0,
      isCartOpen: false,

      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addToCart: (newItem) => {
        const currentItems = get().items;

        const unitPrice = newItem.unitPrice || newItem.product?.price || 0;
        const qty = newItem.quantity || 1;
        const itemObj = {
          id: newItem.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          product: newItem.product,
          size: newItem.size || "M",
          color: newItem.color || "BLACK",
          printType: newItem.printType || "Standard",
          printLocation: newItem.printLocation || "None",
          artworkUrl: newItem.artworkUrl || null,
          artworkScale: newItem.artworkScale || 1,
          unitPrice: unitPrice,
          quantity: qty,
          totalItemPrice: unitPrice * qty,
        };

        // Check for matching item signature
        const existingIndex = currentItems.findIndex(
          (i) =>
            i.product?.id === itemObj.product?.id &&
            i.size === itemObj.size &&
            i.color === itemObj.color &&
            i.printType === itemObj.printType &&
            i.printLocation === itemObj.printLocation &&
            i.artworkUrl === itemObj.artworkUrl
        );

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const existing = updatedItems[existingIndex];
          const newQty = existing.quantity + qty;
          updatedItems[existingIndex] = {
            ...existing,
            quantity: newQty,
            totalItemPrice: existing.unitPrice * newQty,
          };
          set({ items: updatedItems, isCartOpen: true });
        } else {
          set({ items: [...currentItems, itemObj], isCartOpen: true });
        }
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, delta) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === itemId) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                return {
                  ...item,
                  quantity: newQty,
                  totalItemPrice: item.unitPrice * newQty,
                };
              }
              return item;
            })
            .filter(Boolean);
          return { items: updated };
        });
      },

      clearCart: () => set({ items: [], promoCode: "", discount: 0 }),

      applyPromoCode: (code) => {
        const cleanCode = (code || "").trim().toUpperCase();
        if (cleanCode === "ORANGERED10" || cleanCode === "VIP10") {
          set({ promoCode: cleanCode, discount: 0.1 });
          return { success: true, message: "10% VIP Discount applied successfully!" };
        } else if (cleanCode === "CUSTOM20") {
          set({ promoCode: cleanCode, discount: 0.2 });
          return { success: true, message: "20% Custom Merch Special applied!" };
        }
        return { success: false, message: "Invalid promo code. Try 'ORANGERED10' or 'CUSTOM20'." };
      },

      removePromoCode: () => set({ promoCode: "", discount: 0 }),

      // Calculated getters
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + (item.totalItemPrice || 0), 0);
      },
      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        return subtotal * get().discount;
      },
      getShippingCharge: () => {
        const subtotal = get().getSubtotal();
        return subtotal > 0 ? 25 : 0;
      },
      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const discountAmt = get().getDiscountAmount();
        const shipping = get().getShippingCharge();
        return Math.max(0, subtotal - discountAmt + shipping);
      },
      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "custom-merch-cart-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : undefined)),
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode, discount: state.discount }),
    }
  )
);
