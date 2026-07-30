"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRODUCTS } from "@/components/home/CollectionsGrid";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("ORDERS");

  const user = {
    name: "Devendra Bhatt",
    email: "devendra@example.com",
    memberSince: "JULY 2026",
    status: "VIP CLIENT — LEVEL 04",
  };

  const orders = [
    {
      id: "ORD-89241",
      date: "JULY 30, 2026",
      status: "IN DISPATCH (DHL)",
      total: 620,
      items: [PRODUCTS[1]],
      trackingUrl: "/orders/ORD-89241",
    },
    {
      id: "ORD-77192",
      date: "JULY 15, 2026",
      status: "DELIVERED",
      total: 280,
      items: [PRODUCTS[0]],
      trackingUrl: "/orders/ORD-77192",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Profile Banner */}
      <section className="bg-inverse-surface text-white py-16 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-xs font-body tracking-[0.25em] text-primary-fixed uppercase block mb-2">
              {user.status}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              {user.name.toUpperCase()}
            </h1>
            <p className="font-body text-xs text-white/70 mt-1 uppercase tracking-wider">
              {user.email} | CLIENT SINCE {user.memberSince}
            </p>
          </div>
          <Link
            href="/login"
            className="border border-white/30 text-white hover:border-primary hover:text-primary px-6 py-3 font-body text-xs font-bold tracking-[0.15em] uppercase transition-colors"
          >
            SIGN OUT
          </Link>
        </div>
      </section>

      {/* Main Dashboard Body */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow">
        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-outline-variant/30 mb-10 overflow-x-auto">
          <button
            onClick={() => setActiveTab("ORDERS")}
            className={`pb-4 font-body text-xs font-bold tracking-[0.15em] uppercase shrink-0 cursor-pointer ${
              activeTab === "ORDERS"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            ORDER HISTORY & DISPATCH ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("ADDRESSES")}
            className={`pb-4 font-body text-xs font-bold tracking-[0.15em] uppercase shrink-0 cursor-pointer ${
              activeTab === "ADDRESSES"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            SAVED ATELIER ADDRESSES
          </button>
          <button
            onClick={() => setActiveTab("SETTINGS")}
            className={`pb-4 font-body text-xs font-bold tracking-[0.15em] uppercase shrink-0 cursor-pointer ${
              activeTab === "SETTINGS"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            ACCOUNT PREFERENCES
          </button>
        </div>

        {/* Tab 1: Orders List */}
        {activeTab === "ORDERS" && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface-container-lowest p-6 border border-outline-variant/30 hover:border-primary transition-colors space-y-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-outline-variant/20 pb-4">
                  <div>
                    <span className="font-display font-bold text-lg text-on-surface">{order.id}</span>
                    <span className="font-body text-xs text-on-surface-variant block mt-1">PLACED ON {order.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 font-body text-xs font-bold uppercase tracking-wider">
                      {order.status}
                    </span>
                    <span className="font-body font-bold text-base text-on-surface">${order.total} USD</span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {order.items.map((product) => (
                    <div key={product.id} className="flex gap-4 items-center">
                      <img src={product.image} alt={product.name} className="w-16 h-20 object-cover bg-surface-container shrink-0" />
                      <div>
                        <h4 className="font-display text-sm font-bold text-on-surface">{product.name}</h4>
                        <span className="font-body text-xs text-on-surface-variant">${product.price} USD</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-outline-variant/15 flex justify-end">
                  <Link
                    href={order.trackingUrl}
                    className="bg-primary text-white px-6 py-3 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary-container transition-all cursor-pointer"
                  >
                    TRACK SHIPMENT LIVE →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === "ADDRESSES" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-6 border border-outline-variant/30 space-y-3">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest inline-block">
                PRIMARY DISPATCH ADDRESS
              </span>
              <h3 className="font-display text-lg font-bold text-on-surface">DEVENDRA BHATT</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                Via Montenapoleone 18<br />
                Milan, 20121<br />
                Italy
              </p>
              <button className="font-body text-xs font-bold text-primary hover:underline uppercase">EDIT ADDRESS</button>
            </div>
          </div>
        )}

        {/* Tab 3: Account Preferences */}
        {activeTab === "SETTINGS" && (
          <div className="max-w-xl bg-surface-container-lowest p-6 border border-outline-variant/30 space-y-6">
            <h3 className="font-display text-lg font-bold text-on-surface">PRIVATE NOTIFICATION PREFERENCES</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 font-body text-xs text-on-surface cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-primary" />
                <span>RECEIVE PRIVATE 1-HOUR CAPSULE DROP ANNOUNCEMENTS</span>
              </label>
              <label className="flex items-center gap-3 font-body text-xs text-on-surface cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-primary" />
                <span>DHL EXPRESS DISPATCH TRACKING ALERTS</span>
              </label>
            </div>
            <button className="bg-primary text-white px-6 py-3 font-body text-xs font-bold tracking-widest uppercase hover:bg-primary-container transition-all">
              SAVE PREFERENCES
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
