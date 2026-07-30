"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRODUCTS } from "@/components/home/CollectionsGrid";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [formData, setFormData] = useState({
    firstName: "Devendra",
    lastName: "Bhatt",
    email: "devendra@example.com",
    address: "Via Montenapoleone 18",
    city: "Milan",
    country: "Italy",
    zip: "20121",
    cardNumber: "•••• •••• •••• 4242",
    expDate: "12/28",
    cvv: "888",
  });

  const cartSummary = [
    { product: PRODUCTS[0], size: "L", quantity: 1 },
    { product: PRODUCTS[2], size: "32", quantity: 1 },
  ];

  const subtotal = cartSummary.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 25;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    router.push("/orders/ORD-89241");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Header */}
      <section className="bg-inverse-surface text-white py-10 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <div>
            <span className="text-xs font-body tracking-[0.2em] text-primary-fixed uppercase block mb-1">
              SECURE DISPATCH CHECKOUT
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold">EXPRESS CHECKOUT</h1>
          </div>
          <span className="material-symbols-outlined text-3xl text-primary-fixed">lock</span>
        </div>
      </section>

      {/* Checkout Content */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Contact & Shipping Address */}
            <div className="bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/30 space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-3">
                  <span className="w-7 h-7 bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
                  <span>SHIPPING ADDRESS</span>
                </h2>
                <span className="text-xs font-body text-primary font-bold">REQUIRED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">FIRST NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">LAST NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">EMAIL ADDRESS FOR DISPATCH NOTIFICATIONS</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">STREET ADDRESS</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">CITY</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">COUNTRY</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">ZIP CODE</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/30 space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-3">
                  <span className="w-7 h-7 bg-primary text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span>PAYMENT SELECTION</span>
                </h2>
                <span className="text-xs font-body text-on-surface-variant">ENCRYPTED 256-BIT SSL</span>
              </div>

              {/* Payment Type Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-3 border font-body text-xs font-bold tracking-wider uppercase cursor-pointer ${
                    paymentMethod === "CARD" ? "border-primary bg-primary text-white" : "border-outline-variant/40 bg-surface-container-low"
                  }`}
                >
                  CREDIT CARD
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("APPLE_PAY")}
                  className={`p-3 border font-body text-xs font-bold tracking-wider uppercase cursor-pointer ${
                    paymentMethod === "APPLE_PAY" ? "border-primary bg-primary text-white" : "border-outline-variant/40 bg-surface-container-low"
                  }`}
                >
                  APPLE PAY
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("PAYPAL")}
                  className={`p-3 border font-body text-xs font-bold tracking-wider uppercase cursor-pointer ${
                    paymentMethod === "PAYPAL" ? "border-primary bg-primary text-white" : "border-outline-variant/40 bg-surface-container-low"
                  }`}
                >
                  PAYPAL
                </button>
              </div>

              {paymentMethod === "CARD" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">CARD NUMBER</label>
                    <input
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">EXPIRATION DATE</label>
                      <input
                        type="text"
                        required
                        value={formData.expDate}
                        onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">CVV SECURITY CODE</label>
                      <input
                        type="text"
                        required
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 bg-surface-container-low p-6 md:p-8 border border-outline-variant/40 space-y-6">
            <h2 className="font-display text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-4">
              ORDER SUMMARY
            </h2>

            {/* Selected Items */}
            <div className="space-y-4">
              {cartSummary.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-20 object-cover bg-surface-container shrink-0" />
                  <div className="flex-grow">
                    <h3 className="font-display text-xs font-bold text-on-surface line-clamp-1">{item.product.name}</h3>
                    <p className="font-body text-[11px] text-on-surface-variant mt-1">SIZE: {item.size} | QTY: {item.quantity}</p>
                    <span className="font-body font-bold text-xs text-primary">${item.product.price * item.quantity} USD</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-outline-variant/30 pt-4 space-y-2 font-body text-xs text-on-surface-variant uppercase">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="font-bold text-on-surface">${subtotal} USD</span>
              </div>
              <div className="flex justify-between">
                <span>EXPRESS DISPATCH</span>
                <span className="font-bold text-on-surface">${shipping} USD</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/20 font-bold text-base text-on-surface">
                <span>TOTAL DUE</span>
                <span className="text-primary font-display text-xl">${total} USD</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-300 horizontal-expansion shadow-lg cursor-pointer"
            >
              CONFIRM & PAY (${total} USD)
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
