"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function OrderHistoryPage() {
  const { orders, fetchMyOrders, loading } = useOrderStore();
  const { isAuthenticated } = useAuthStore();
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "ALL") return true;
    return (order.currentStatus || "").toUpperCase() === filterStatus.toUpperCase();
  });

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-inverse-surface text-white py-12 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-body tracking-[0.25em] text-primary-fixed uppercase block mb-2">
              CLIENT ORDER MANAGEMENT & DISPATCH
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              ORDER <span className="text-primary italic">HISTORY</span>
            </h1>
            <p className="font-body text-xs text-white/70 mt-1 uppercase tracking-wider">
              VIEW AND TRACK ALL YOUR ATELIER ORDERS AND CUSTOM MERCHANDISE DISPATCHES IN INDIA.
            </p>
          </div>

          <Link
            href="/products"
            className="font-body text-xs font-bold text-primary-fixed hover:underline uppercase tracking-widest"
          >
            ← BROWSE MERCHANDISE
          </Link>
        </div>
      </section>

      {/* Main Order History Section */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow space-y-8">
        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-4">
          {["ALL", "OrderPlaced", "PaymentVerified", "DesignApproved", "PrintingInProgress", "Dispatched", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 font-body text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-primary text-white"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <span className="font-body text-xs font-bold tracking-widest text-on-surface-variant uppercase">
              LOADING ORDER RECORDS...
            </span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center bg-surface-container-lowest border border-outline-variant/30 space-y-4">
            <span className="material-symbols-outlined text-6xl text-outline">local_shipping</span>
            <h2 className="font-display text-2xl font-bold">NO ORDERS FOUND</h2>
            <p className="font-body text-xs text-on-surface-variant max-w-xs mx-auto uppercase tracking-wider">
              THERE ARE NO ATELIER ORDERS MATCHING YOUR FILTER SELECTION.
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-3 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary-container transition-all"
            >
              EXPLORE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id || order.orderNumber}
                className="bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/30 hover:border-primary transition-all space-y-6 shadow-sm"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/20 pb-4">
                  <div>
                    <span className="text-[11px] font-body font-bold text-primary tracking-widest uppercase block mb-1">
                      WAYBILL NO: {order.shippingDetails?.trackingNumber || "DEL-EXPRESS-TRACK"}
                    </span>
                    <h2 className="font-display text-2xl font-bold text-on-surface">
                      ORDER {order.orderNumber}
                    </h2>
                    <span className="font-body text-xs text-on-surface-variant block mt-1">
                      PLACED ON {new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <span className="bg-primary/10 text-primary border border-primary/30 px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wider">
                      STAGE: {order.currentStatus}
                    </span>
                    <span className="font-body font-bold text-xl text-on-surface">
                      ₹{order.billingSummary?.grandTotal?.toLocaleString("en-IN") || 0}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-surface-container-low p-4 border border-outline-variant/20">
                      <div className="relative w-16 h-20 bg-surface-container shrink-0 overflow-hidden border border-outline-variant/30">
                        {item.artworkUrl ? (
                          <img src={item.artworkUrl} alt="Artwork" className="w-full h-full object-contain bg-white p-1" />
                        ) : (
                          <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white text-[10px] font-bold">
                            GARMENT
                          </div>
                        )}
                      </div>

                      <div className="flex-grow space-y-1">
                        <h3 className="font-display text-sm font-bold text-on-surface">{item.productName}</h3>
                        <p className="font-body text-xs text-on-surface-variant">
                          SIZE: <span className="font-bold text-on-surface">{item.selectedSize}</span> | COLOR: <span className="font-bold text-on-surface">{item.selectedColor || "BLACK"}</span> | QTY: {item.quantity}
                        </p>
                        {item.selectedPrintType && item.selectedPrintType !== "Standard" && (
                          <span className="font-body text-[11px] text-primary font-bold block">
                            PRINT: {item.selectedPrintType} ({item.printLocation || "Front"})
                          </span>
                        )}
                      </div>

                      <div className="text-right font-body font-bold text-sm text-primary">
                        ₹{(item.totalItemPrice || item.unitPrice * item.quantity)?.toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-outline-variant/20">
                  <div className="font-body text-xs text-on-surface-variant uppercase">
                    DESTINATION: {order.shippingAddress?.city || "Mumbai"}, {order.shippingAddress?.country || "India"}
                  </div>

                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="w-full sm:w-auto bg-primary text-white px-8 py-3.5 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all text-center shadow-md cursor-pointer"
                  >
                    TRACK 10-STAGE TIMELINE LIVE →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
