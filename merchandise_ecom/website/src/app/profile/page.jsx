"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRODUCTS } from "@/components/home/CollectionsGrid";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("ORDERS");

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

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="font-body text-xs font-bold tracking-widest text-on-surface-variant uppercase">
              AUTHENTICATING SESSION...
            </span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />

        <main className="flex-grow flex items-center justify-center py-20 px-6">
          <div className="w-full max-w-lg bg-surface-container-lowest p-10 md:p-12 border border-outline-variant/40 shadow-2xl text-center space-y-6">
            <span className="material-symbols-outlined text-5xl text-primary block">
              lock
            </span>
            <div className="space-y-2">
              <span className="font-body text-xs font-bold tracking-[0.25em] text-primary uppercase block">
                PRIVATE ACCESS RESTRICTED
              </span>
              <h1 className="font-display text-3xl font-bold text-on-surface">
                CLIENT SIGN IN REQUIRED
              </h1>
              <p className="font-body text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                PLEASE SIGN IN TO YOUR REGISTERED CLIENT ACCOUNT TO VIEW RESERVATION HISTORY, SAVED ADDRESSES, AND ATELIER ORDERS.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Link
                href="/login"
                className="bg-primary text-white px-8 py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all shadow-lg text-center"
              >
                SIGN IN NOW
              </Link>
              <Link
                href="/signup"
                className="border border-outline-variant text-on-surface hover:border-primary hover:text-primary px-8 py-4 font-body text-xs font-bold tracking-[0.2em] uppercase transition-all text-center"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Profile Banner */}
      <section className="bg-inverse-surface text-white py-16 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="text-xs font-body tracking-[0.25em] text-primary-fixed uppercase block mb-2">
              {user?.role ? `${user.role.toUpperCase()} CLIENT` : "VIP CLIENT"}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              {(user?.name || "CLIENT").toUpperCase()}
            </h1>
            <p className="font-body text-xs text-white/70 mt-1 uppercase tracking-wider">
              {user?.email} | MEMBER SINCE 2026
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="border border-white/30 text-white hover:border-primary hover:text-primary px-6 py-3 font-body text-xs font-bold tracking-[0.15em] uppercase transition-colors cursor-pointer"
          >
            SIGN OUT
          </button>
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
              <h3 className="font-display text-lg font-bold text-on-surface">{(user?.name || "Devendra Bhatt").toUpperCase()}</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                {user?.address || "Via Montenapoleone 18, Milan, 20121, Italy"}
              </p>
              <button className="font-body text-xs font-bold text-primary hover:underline uppercase cursor-pointer">EDIT ADDRESS</button>
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
            <button className="bg-primary text-white px-6 py-3 font-body text-xs font-bold tracking-widest uppercase hover:bg-primary-container transition-all cursor-pointer">
              SAVE PREFERENCES
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
