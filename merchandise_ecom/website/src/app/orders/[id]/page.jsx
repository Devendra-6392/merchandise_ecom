"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRODUCTS } from "@/components/home/CollectionsGrid";

export default function OrderTrackingPage({ params }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id || "ORD-89241";

  const trackingSteps = [
    { label: "ORDER CONFIRMED", date: "JUL 30, 08:30 AM", done: true },
    { label: "ATELIER CRAFT & QUALITY CONTROL", date: "JUL 30, 11:15 AM", done: true },
    { label: "DISPATCHED VIA DHL EXPRESS", date: "JUL 30, 02:45 PM", done: true, current: true },
    { label: "OUT FOR COURIER DELIVERY", date: "ESTIMATED AUG 01", done: false },
    { label: "DELIVERED TO CLIENT", date: "PENDING", done: false },
  ];

  const orderedProduct = PRODUCTS[1];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Header */}
      <section className="bg-inverse-surface text-white py-12 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-body tracking-[0.25em] text-primary-fixed uppercase block mb-2">
              DHL EXPRESS SHIPMENT TRACKING
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              SHIPMENT {orderId}
            </h1>
            <p className="font-body text-xs text-white/70 mt-1 uppercase tracking-wider">
              WAYBILL NO: DHL-9948201-IT | ESTIMATED DELIVERY: AUGUST 01, 2026
            </p>
          </div>
          <Link
            href="/profile"
            className="font-body text-xs font-bold text-primary-fixed hover:underline uppercase tracking-widest"
          >
            ← BACK TO PROFILE
          </Link>
        </div>
      </section>

      {/* Main Tracking Body */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow space-y-12">
        {/* Timeline Indicator */}
        <div className="bg-surface-container-lowest p-8 border border-outline-variant/30">
          <h2 className="font-display text-xl font-bold text-on-surface mb-8 border-b border-outline-variant/20 pb-4">
            LIVE DISPATCH TIMELINE
          </h2>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {trackingSteps.map((step, idx) => (
              <div key={idx} className="flex md:flex-col items-center gap-4 text-center z-10 relative flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-body text-xs font-bold transition-all ${
                    step.current
                      ? "bg-primary text-white ring-4 ring-primary/20 scale-110"
                      : step.done
                      ? "bg-inverse-surface text-white"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {step.done ? "✓" : idx + 1}
                </div>
                <div>
                  <h3 className={`font-body text-xs font-bold uppercase tracking-wider ${step.current ? "text-primary" : "text-on-surface"}`}>
                    {step.label}
                  </h3>
                  <span className="font-body text-[11px] text-on-surface-variant block mt-1">{step.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Receipt */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-surface-container-lowest p-8 border border-outline-variant/30 space-y-6">
            <h2 className="font-display text-xl font-bold text-on-surface border-b border-outline-variant/20 pb-4">
              GARMENTS IN THIS SHIPMENT
            </h2>

            <div className="flex gap-6 items-center">
              <img src={orderedProduct.image} alt={orderedProduct.name} className="w-24 h-32 object-cover bg-surface-container shrink-0" />
              <div className="space-y-2">
                <span className="text-xs font-body font-bold text-primary tracking-widest uppercase block">{orderedProduct.category}</span>
                <h3 className="font-display text-lg font-bold text-on-surface">{orderedProduct.name}</h3>
                <p className="font-body text-xs text-on-surface-variant">SIZE: L | QTY: 1</p>
                <span className="font-body font-bold text-base text-primary block">${orderedProduct.price} USD</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-surface-container-low p-8 border border-outline-variant/30 space-y-4 font-body text-xs text-on-surface-variant uppercase">
            <h2 className="font-display text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-3">
              DESTINATION & COURIER
            </h2>

            <div>
              <span className="font-bold text-on-surface block mb-1">RECIPIENT</span>
              <span>DEVENDRA BHATT</span>
            </div>

            <div>
              <span className="font-bold text-on-surface block mb-1">DISPATCH ADDRESS</span>
              <span>Via Montenapoleone 18, Milan, 20121, Italy</span>
            </div>

            <div>
              <span className="font-bold text-on-surface block mb-1">COURIER SERVICE</span>
              <span>DHL EXPRESS INTERNATIONAL (INSURED)</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
