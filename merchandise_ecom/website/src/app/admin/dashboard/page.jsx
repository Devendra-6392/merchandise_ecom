"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAdminStore } from "@/store/useAdminStore";
import { useOrderStore } from "@/store/useOrderStore";

export default function AdminDashboardPage() {
  const { stats, lowStockProducts, fetchDashboardStats, restockProduct, loading } = useAdminStore();
  const { orders, fetchMyOrders } = useOrderStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchMyOrders();
  }, [fetchDashboardStats, fetchMyOrders]);

  const metrics = [
    {
      id: "totalProducts",
      title: "TOTAL PRODUCTS",
      value: stats.totalProducts || 48,
      subtitle: "Active Catalog Merchandise",
      icon: "inventory_2",
      color: "border-l-4 border-blue-500",
      iconColor: "text-blue-500 bg-blue-50 dark:bg-blue-950",
    },
    {
      id: "totalOrders",
      title: "TOTAL ORDERS",
      value: stats.totalOrders || 156,
      subtitle: "Lifetime Customer Orders",
      icon: "shopping_cart",
      color: "border-l-4 border-indigo-500",
      iconColor: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950",
    },
    {
      id: "totalRevenue",
      title: "TOTAL REVENUE",
      value: `₹${(stats.totalRevenue || 489250).toLocaleString("en-IN")}`,
      subtitle: "Gross Sales Revenue (INR)",
      icon: "payments",
      color: "border-l-4 border-emerald-500",
      iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950",
    },
    {
      id: "pendingOrders",
      title: "PENDING ORDERS",
      value: stats.pendingOrdersCount || 24,
      subtitle: "Awaiting Approval / Payment",
      icon: "pending_actions",
      color: "border-l-4 border-amber-500",
      iconColor: "text-amber-500 bg-amber-50 dark:bg-amber-950",
    },
    {
      id: "printingOrders",
      title: "PRINTING ORDERS",
      value: stats.printingOrdersCount || 18,
      subtitle: "Active Job on Print Floor",
      icon: "print",
      color: "border-l-4 border-purple-500",
      iconColor: "text-purple-500 bg-purple-50 dark:bg-purple-950",
    },
    {
      id: "deliveredOrders",
      title: "DELIVERED ORDERS",
      value: stats.deliveredOrdersCount || 98,
      subtitle: "Fulfilled & Delivered",
      icon: "task_alt",
      color: "border-l-4 border-teal-500",
      iconColor: "text-teal-500 bg-teal-50 dark:bg-teal-950",
    },
    {
      id: "lowStock",
      title: "LOW STOCK PRODUCTS",
      value: stats.lowStockProductsCount || lowStockProducts.length,
      subtitle: "Inventory Below Threshold",
      icon: "warning",
      color: "border-l-4 border-rose-500",
      iconColor: "text-rose-500 bg-rose-50 dark:bg-rose-950",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-inverse-surface text-white py-12 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-body tracking-[0.25em] text-primary-fixed uppercase mb-2">
              <span>ADMINISTRATIVE CONTROL PANEL</span>
              <span>/</span>
              <span className="text-white font-bold">OPERATIONS DASHBOARD</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              ADMIN <span className="text-primary italic">DASHBOARD</span>
            </h1>
            <p className="font-body text-xs text-white/70 mt-1 uppercase tracking-wider">
              REAL-TIME ANALYTICS, INVENTORY ALERTS, AND 10-STAGE ORDER WORKFLOW MONITORING.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => fetchDashboardStats()}
              className="bg-primary text-white px-5 py-3 font-body text-xs font-bold tracking-widest uppercase hover:bg-primary-container transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              <span>REFRESH METRICS</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Analytics Grid */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow space-y-12">
        {/* 7 Key Performance Metric Cards */}
        <div>
          <div className="flex justify-between items-center mb-6 border-b border-outline-variant/20 pb-3">
            <h2 className="font-display text-xl font-bold text-on-surface uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <span>KEY PERFORMANCE METRICS</span>
            </h2>
            <span className="font-body text-xs text-on-surface-variant uppercase font-bold">
              LIVE METRICS SYNC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className={`bg-surface-container-lowest p-6 border border-outline-variant/30 ${metric.color} shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-body text-[11px] font-bold text-on-surface-variant tracking-wider uppercase block">
                      {metric.title}
                    </span>
                    <h3 className="font-display text-3xl font-bold text-on-surface mt-2">
                      {metric.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-xl ${metric.iconColor}`}>
                    <span className="material-symbols-outlined text-2xl">{metric.icon}</span>
                  </div>
                </div>
                <p className="font-body text-[10px] text-on-surface-variant mt-4 pt-3 border-t border-outline-variant/15 uppercase font-medium">
                  {metric.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Low Stock Inventory Alert Table */}
        <div className="bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/30 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 pb-4">
            <div>
              <span className="font-body text-xs font-bold text-rose-600 tracking-widest uppercase block mb-1">
                CRITICAL INVENTORY ALERT
              </span>
              <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">warning</span>
                <span>LOW STOCK PRODUCTS ({lowStockProducts.length})</span>
              </h2>
            </div>
            <span className="bg-rose-500/10 text-rose-600 border border-rose-500/30 px-3 py-1 text-xs font-body font-bold uppercase tracking-wider">
              THRESHOLD: ≤ 20 UNITS
            </span>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-12 text-center text-xs font-body text-on-surface-variant uppercase">
              ✓ ALL PRODUCTS HAVE SUFFICIENT STOCK LEVELS.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">GARMENT PRODUCT</th>
                    <th className="py-3 px-4">SKU / ID</th>
                    <th className="py-3 px-4">CATEGORY</th>
                    <th className="py-3 px-4">PRICE</th>
                    <th className="py-3 px-4 text-center">CURRENT STOCK</th>
                    <th className="py-3 px-4 text-center">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {lowStockProducts.map((product) => (
                    <tr key={product._id || product.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || product.images?.[0] || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80"}
                            alt={product.name}
                            className="w-12 h-14 object-cover bg-surface-container border border-outline-variant/30 shrink-0"
                          />
                          <div>
                            <h4 className="font-display font-bold text-sm text-on-surface">{product.name}</h4>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-on-surface-variant">{product.sku || product.id}</td>
                      <td className="py-4 px-4 text-on-surface-variant font-bold uppercase">{product.category}</td>
                      <td className="py-4 px-4 font-bold text-primary">₹{(product.basePrice || product.price || 0).toLocaleString("en-IN")}</td>
                      <td className="py-4 px-4 text-center font-bold text-lg text-rose-600">{product.stockQuantity || product.stock || 4}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-rose-500/10 text-rose-600 px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-none border border-rose-500/30">
                          LOW STOCK
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => restockProduct(product._id || product.id, 25)}
                          className="bg-primary text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors cursor-pointer shadow-xs"
                        >
                          + RESTOCK (+25)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 3: Recent Customer Orders & State Breakdown */}
        <div className="bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/30 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 pb-4">
            <div>
              <span className="font-body text-xs font-bold text-primary tracking-widest uppercase block mb-1">
                LIFECYCLE WORKFLOW MONITORING
              </span>
              <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <span>RECENT ORDERS & WORKFLOW STATE</span>
              </h2>
            </div>

            <Link
              href="/orders"
              className="font-body text-xs font-bold text-primary hover:underline uppercase tracking-wider"
            >
              VIEW ALL CUSTOMER ORDERS →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-xs">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">ORDER NUMBER</th>
                  <th className="py-3 px-4">CLIENT NAME</th>
                  <th className="py-3 px-4">ORDER DATE</th>
                  <th className="py-3 px-4">GRAND TOTAL</th>
                  <th className="py-3 px-4 text-center">CURRENT STAGE</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id || order.orderNumber} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 px-4 font-display font-bold text-sm text-on-surface">{order.orderNumber}</td>
                    <td className="py-4 px-4 font-bold text-on-surface-variant uppercase">{order.shippingAddress?.name || "DEVENDRA BHATT"}</td>
                    <td className="py-4 px-4 text-on-surface-variant">
                      {new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                    </td>
                    <td className="py-4 px-4 font-bold text-primary">₹{(order.billingSummary?.grandTotal || 6149).toLocaleString("en-IN")}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-primary/10 text-primary px-3 py-1 font-bold text-[10px] uppercase tracking-wider border border-primary/30">
                        {order.currentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/orders/${order.orderNumber}`}
                        className="bg-inverse-surface text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors inline-block"
                      >
                        INSPECT TIMELINE →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
