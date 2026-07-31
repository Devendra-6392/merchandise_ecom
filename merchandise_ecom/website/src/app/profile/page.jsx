"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, loading: authLoading, updateProfile } = useAuthStore();
  const { orders, fetchMyOrders } = useOrderStore();

  const [activeTab, setActiveTab] = useState("ORDERS");
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders();
    }
  }, [isAuthenticated, fetchMyOrders]);

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    const res = await updateProfile(profileForm);
    setSaveLoading(false);
    if (res.success) {
      setIsEditing(false);
      // We could add a toast here in the future
    } else {
      alert(res.error || "Failed to update profile.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="font-body text-xs font-bold tracking-widest text-on-surface-variant uppercase">
              AUTHENTICATING CLIENT SESSION...
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
            PROFILE & ADDRESSES
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
            {orders.length === 0 ? (
              <div className="py-16 text-center border border-outline-variant/30 bg-surface-container-lowest space-y-4">
                <span className="material-symbols-outlined text-5xl text-outline">local_shipping</span>
                <h3 className="font-display text-xl font-bold">NO ORDERS RECORDED YET</h3>
                <p className="font-body text-xs text-on-surface-variant uppercase">
                  YOUR COMPLETED ORDERS AND CUSTOM MERCHANDISE DISPATCHES WILL APPEAR HERE.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-primary text-white px-6 py-3 font-body text-xs font-bold tracking-widest uppercase hover:bg-primary-container"
                >
                  EXPLORE COLLECTIONS
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id || order.orderNumber}
                  className="bg-surface-container-lowest p-6 border border-outline-variant/30 hover:border-primary transition-colors space-y-4"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-outline-variant/20 pb-4">
                    <div>
                      <span className="font-display font-bold text-lg text-on-surface">{order.orderNumber}</span>
                      <span className="font-body text-xs text-on-surface-variant block mt-1">
                        PLACED ON {new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 font-body text-xs font-bold uppercase tracking-wider">
                        {order.currentStatus}
                      </span>
                      <span className="font-body font-bold text-base text-on-surface">
                        ₹{order.billingSummary?.grandTotal?.toLocaleString("en-IN") || 0}
                      </span>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center bg-surface-container-low p-3 border border-outline-variant/20">
                        {item.artworkUrl && (
                          <img src={item.artworkUrl} alt="Logo" className="w-12 h-14 object-contain bg-white p-1" />
                        )}
                        <div>
                          <h4 className="font-display text-sm font-bold text-on-surface">{item.productName}</h4>
                          <span className="font-body text-xs text-on-surface-variant">
                            SIZE: {item.selectedSize} | QTY: {item.quantity} | ₹{item.unitPrice?.toLocaleString("en-IN")}
                          </span>
                          {item.selectedPrintType && item.selectedPrintType !== "Standard" && (
                            <span className="font-body text-[10px] text-primary font-bold block">
                              TECHNIQUE: {item.selectedPrintType} ({item.printLocation})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-outline-variant/15 flex justify-between items-center">
                    <span className="font-body text-xs text-on-surface-variant uppercase">
                      COURIER: {order.shippingDetails?.courierName || "DELHIVERY EXPRESS"} ({order.shippingDetails?.trackingNumber || "PENDING"})
                    </span>
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      className="bg-primary text-white px-6 py-3 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary-container transition-all cursor-pointer"
                    >
                      TRACK SHIPMENT LIVE →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Profile & Saved Addresses */}
        {activeTab === "ADDRESSES" && (
          <div className="max-w-2xl bg-surface-container-lowest p-8 border border-outline-variant/30">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/20">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest inline-block">
                PRIMARY DISPATCH & CONTACT
              </span>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="font-body text-xs font-bold text-primary hover:underline uppercase cursor-pointer"
                >
                  EDIT PROFILE
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <label className="block text-xs font-body font-bold text-on-surface tracking-widest uppercase mb-2">FULL NAME</label>
                  <input 
                    type="text" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-sm font-body text-on-surface focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-body font-bold text-on-surface tracking-widest uppercase mb-2">PHONE NUMBER</label>
                  <input 
                    type="text" 
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-sm font-body text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body font-bold text-on-surface tracking-widest uppercase mb-2">SHIPPING ADDRESS</label>
                  <textarea 
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    rows={4}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-sm font-body text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                
                <div className="flex gap-4 pt-4 border-t border-outline-variant/20">
                  <button 
                    type="submit" 
                    disabled={saveLoading}
                    className="bg-primary text-white px-8 py-3 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary-container transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saveLoading ? "SAVING..." : "SAVE CHANGES"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    disabled={saveLoading}
                    className="bg-surface-container-high text-on-surface px-8 py-3 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-surface-container-highest transition-all cursor-pointer disabled:opacity-50"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="block text-xs font-body text-on-surface-variant uppercase mb-1">CLIENT NAME</span>
                  <h3 className="font-display text-xl font-bold text-on-surface">{(user?.name || "GUEST CLIENT").toUpperCase()}</h3>
                </div>
                <div>
                  <span className="block text-xs font-body text-on-surface-variant uppercase mb-1">REGISTERED EMAIL</span>
                  <p className="font-body text-base text-on-surface">{user?.email}</p>
                </div>
                <div>
                  <span className="block text-xs font-body text-on-surface-variant uppercase mb-1">CONTACT NUMBER</span>
                  <p className="font-body text-base text-on-surface">{user?.phone || "NOT PROVIDED"}</p>
                </div>
                <div>
                  <span className="block text-xs font-body text-on-surface-variant uppercase mb-1">DEFAULT SHIPPING ADDRESS</span>
                  <p className="font-body text-base text-on-surface leading-relaxed max-w-md">
                    {user?.address || "NO ADDRESS SAVED"}
                  </p>
                </div>
              </div>
            )}
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
              <label className="flex items-center gap-3 font-body text-xs font-bold text-on-surface cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-primary" />
                <span>DELHIVERY EXPRESS DISPATCH TRACKING ALERTS</span>
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
