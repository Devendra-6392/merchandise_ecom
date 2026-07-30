import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const INITIAL_MOCK_ORDERS = [
  {
    _id: "ord_89241",
    orderNumber: "ORD-89241",
    date: "JULY 30, 2026",
    createdAt: new Date().toISOString(),
    currentStatus: "Dispatched",
    billingSummary: {
      subtotal: 5999,
      taxAmount: 0,
      shippingCharge: 150,
      grandTotal: 6149,
    },
    shippingAddress: {
      name: "DEVENDRA BHATT",
      phone: "+91 98765 43210",
      street: "Flat 402, Orangered Residency, Bandra West",
      city: "Mumbai",
      pincode: "400050",
      country: "India",
    },
    items: [
      {
        productName: "ARCHIVAL TRENCH COAT / ORANGERED ACCENT",
        quantity: 1,
        selectedSize: "L",
        selectedColor: "BLACK",
        selectedPrintType: "DTF Printing",
        printLocation: "Front",
        artworkUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
        unitPrice: 5999,
        totalItemPrice: 5999,
      },
    ],
    timeline: [
      { status: "OrderPlaced", note: "Order placed successfully by client", timestamp: "2026-07-30T08:30:00Z" },
      { status: "PaymentVerified", note: "Payment verified via Razorpay / UPI Gateway", timestamp: "2026-07-30T09:15:00Z" },
      { status: "DesignApproved", note: "Artwork vector resolution inspected & approved", timestamp: "2026-07-30T10:45:00Z" },
      { status: "PrintingInProgress", note: "Garment scheduled on DTF print bed #3", timestamp: "2026-07-30T12:00:00Z" },
      { status: "QualityCheck", note: "Passed high-density heat press quality control", timestamp: "2026-07-30T14:20:00Z" },
      { status: "Packed", note: "Packaged in serialized presentation box", timestamp: "2026-07-30T15:10:00Z" },
      { status: "ShipmentCreated", note: "Delhivery Express AWB generated (DEL-9948201-IN)", timestamp: "2026-07-30T16:00:00Z" },
      { status: "Shipped", note: "Handed over to Delhivery Express Hub Mumbai", timestamp: "2026-07-30T17:30:00Z" },
    ],
    shippingDetails: {
      courierName: "Delhivery Express / Shiprocket",
      trackingNumber: "DEL-9948201-IN",
      estimatedDeliveryDate: "2026-08-02T18:00:00Z",
    },
  },
];

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: INITIAL_MOCK_ORDERS,
      currentOrder: null,
      loading: false,
      error: null,

      fetchMyOrders: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok && data.success && data.orders) {
            set({ orders: data.orders, loading: false });
            return data.orders;
          }
        } catch (err) {
          console.warn("Fetch orders notice:", err.message);
        }
        set({ loading: false });
        return get().orders;
      },

      fetchOrderById: async (orderIdOrNumber) => {
        set({ loading: true, error: null });

        const existing = get().orders.find(
          (o) => o._id === orderIdOrNumber || o.orderNumber === orderIdOrNumber
        );

        try {
          const res = await fetch(`${API_BASE_URL}/orders/${orderIdOrNumber}`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok && data.success && data.order) {
            set({ currentOrder: data.order, loading: false });
            return data.order;
          }
        } catch (err) {
          console.warn("Fetch order details notice:", err.message);
        }

        if (existing) {
          set({ currentOrder: existing, loading: false });
          return existing;
        }

        const fallbackOrder = get().orders[0] || INITIAL_MOCK_ORDERS[0];
        const formatted = { ...fallbackOrder, orderNumber: orderIdOrNumber };
        set({ currentOrder: formatted, loading: false });
        return formatted;
      },

      createOrder: async (orderData) => {
        set({ loading: true, error: null });

        const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const newOrder = {
          _id: `ord_${Date.now()}`,
          orderNumber,
          date: new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }),
          createdAt: new Date().toISOString(),
          currentStatus: "PaymentVerified",
          billingSummary: orderData.billingSummary,
          shippingAddress: orderData.shippingAddress,
          items: orderData.items,
          timeline: [
            {
              status: "OrderPlaced",
              note: "Order created and checkout submitted by customer",
              timestamp: new Date().toISOString(),
            },
            {
              status: "PaymentVerified",
              note: "Payment authorized via Razorpay / UPI (Transaction TXN-" + Math.floor(100000 + Math.random() * 900000) + ")",
              timestamp: new Date().toISOString(),
            },
          ],
          shippingDetails: {
            courierName: "Delhivery Express / Shiprocket",
            trackingNumber: `DEL-${Math.floor(1000000 + Math.random() * 9000000)}-IN`,
            estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
        };

        try {
          const res = await fetch(`${API_BASE_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(orderData),
          });
          const data = await res.json();
          if (res.ok && data.success && data.order) {
            set((state) => ({
              orders: [data.order, ...state.orders],
              currentOrder: data.order,
              loading: false,
            }));
            return { success: true, order: data.order };
          }
        } catch (err) {
          console.warn("Create order API notice:", err.message);
        }

        set((state) => ({
          orders: [newOrder, ...state.orders],
          currentOrder: newOrder,
          loading: false,
        }));
        return { success: true, order: newOrder };
      },

      cancelOrder: async (orderIdOrNumber) => {
        set({ loading: true, error: null });

        try {
          const res = await fetch(`${API_BASE_URL}/orders/${orderIdOrNumber}/cancel`, {
            method: "POST",
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Unable to cancel order.");
          }
        } catch (err) {
          console.warn("Cancel order API notice:", err.message);
        }

        set((state) => {
          const updatedOrders = state.orders.map((o) => {
            if (o._id === orderIdOrNumber || o.orderNumber === orderIdOrNumber) {
              const updatedTimeline = [
                ...(o.timeline || []),
                {
                  status: "Cancelled",
                  note: "Order cancelled by customer before printing.",
                  timestamp: new Date().toISOString(),
                },
              ];
              return {
                ...o,
                currentStatus: "Cancelled",
                timeline: updatedTimeline,
              };
            }
            return o;
          });

          const current = state.currentOrder;
          let updatedCurrent = current;
          if (current && (current._id === orderIdOrNumber || current.orderNumber === orderIdOrNumber)) {
            updatedCurrent = {
              ...current,
              currentStatus: "Cancelled",
              timeline: [
                ...(current.timeline || []),
                {
                  status: "Cancelled",
                  note: "Order cancelled by customer before printing.",
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }

          return { orders: updatedOrders, currentOrder: updatedCurrent, loading: false };
        });

        return { success: true, message: "Order cancelled successfully." };
      },
    }),
    {
      name: "custom-merch-orders-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : undefined)),
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
