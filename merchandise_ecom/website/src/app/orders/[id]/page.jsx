"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useOrderStore } from "@/store/useOrderStore";

const STAGES = [
  { key: "OrderPlaced", label: "1. ORDER PLACED" },
  { key: "PaymentVerified", label: "2. PAYMENT VERIFIED" },
  { key: "DesignApproved", label: "3. ARTWORK APPROVED" },
  { key: "PrintingInProgress", label: "4. PRINTING IN PROGRESS" },
  { key: "QualityCheck", label: "5. QUALITY CHECK" },
  { key: "Packed", label: "6. PACKED" },
  { key: "ShipmentCreated", label: "7. SHIPMENT CREATED" },
  { key: "Shipped", label: "8. DISPATCHED" },
  { key: "OutForDelivery", label: "9. OUT FOR DELIVERY" },
  { key: "Delivered", label: "10. DELIVERED" },
];

const CANCELLABLE_STATES = ["OrderPlaced", "PaymentVerified", "DesignApproved"];

export default function OrderTrackingPage({ params }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id || "ORD-89241";

  const { fetchOrderById, currentOrder, cancelOrder } = useOrderStore();
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId, fetchOrderById]);

  const order = currentOrder || {
    orderNumber: orderId,
    currentStatus: "PaymentVerified",
    shippingAddress: { name: "DEVENDRA BHATT", street: "Flat 402, Orangered Residency, Bandra West", city: "Mumbai", state: "Maharashtra", country: "India", pincode: "400050" },
    billingSummary: { grandTotal: 6149 },
    items: [],
    timeline: [],
  };

  const currentStageIndex = STAGES.findIndex((s) => s.key === order.currentStatus);
  const isCancelled = order.currentStatus === "Cancelled";
  const canCancel = CANCELLABLE_STATES.includes(order.currentStatus) && !isCancelled;

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;

    setCancelling(true);
    const res = await cancelOrder(order.orderNumber || order._id);
    setCancelling(false);
    if (res.message) {
      setCancelMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Header */}
      <section className="bg-inverse-surface text-white py-12 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-body tracking-[0.25em] text-primary-fixed uppercase block mb-2">
              DELHIVERY / SHIPROCKET EXPRESS TRACKING (INDIA)
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              SHIPMENT {order.orderNumber || orderId}
            </h1>
            <p className="font-body text-xs text-white/70 mt-1 uppercase tracking-wider">
              WAYBILL NO: {order.shippingDetails?.trackingNumber || "DEL-9948201-IN"} | COURIER: {order.shippingDetails?.courierName || "DELHIVERY EXPRESS"}
            </p>
          </div>
          <Link
            href="/orders"
            className="font-body text-xs font-bold text-primary-fixed hover:underline uppercase tracking-widest"
          >
            ← BACK TO ALL ORDERS
          </Link>
        </div>
      </section>

      {/* Main Tracking Body */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow space-y-10">
        {cancelMessage && (
          <div className="bg-primary/10 border border-primary/40 p-4 text-xs font-body text-primary uppercase tracking-wider">
            ✓ {cancelMessage}
          </div>
        )}

        {/* 10-Stage Sequential Order Lifecycle Tracker */}
        <div className="bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/30 space-y-8 shadow-sm">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
            <h2 className="font-display text-xl font-bold text-on-surface">
              STRICT 10-STAGE SEQUENTIAL ORDER LIFECYCLE TRACKER
            </h2>
            <span className={`px-4 py-1 font-body text-xs font-bold uppercase ${isCancelled ? "bg-error/10 text-error" : "bg-primary/10 text-primary"}`}>
              STATUS: {order.currentStatus}
            </span>
          </div>

          {isCancelled ? (
            <div className="bg-error/10 border border-error/30 p-6 text-center text-error space-y-2">
              <span className="material-symbols-outlined text-4xl block">cancel</span>
              <h3 className="font-display text-lg font-bold">ORDER HAS BEEN CANCELLED</h3>
              <p className="font-body text-xs uppercase">
                THIS ORDER WAS CANCELLED PRIOR TO PRINT FLOOR DISPATCH. REFUND PROCESSING TO YOUR ORIGINAL UPI/PAYMENT METHOD HAS BEEN AUTHORIZED.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-3 pt-2">
              {STAGES.map((stage, idx) => {
                const isCompleted = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div
                    key={stage.key}
                    className={`p-3 border flex flex-col items-center justify-between text-center transition-all ${
                      isCurrent
                        ? "bg-primary text-white border-primary shadow-lg ring-2 ring-primary/20 scale-105"
                        : isCompleted
                        ? "bg-inverse-surface/90 text-white border-inverse-surface"
                        : "bg-surface-container-low text-on-surface-variant/50 border-outline-variant/30"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center mb-2 ${
                        isCurrent ? "bg-white text-primary" : isCompleted ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <span className="font-body text-[9px] font-bold uppercase tracking-wider leading-tight">
                      {stage.label.split(". ")[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cancellation Control */}
          {canCancel && (
            <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs font-body text-on-surface-variant uppercase">
                ORDER IS CURRENTLY ELIGIBLE FOR CANCELLATION BEFORE PRINT FLOOR ASSIGNMENT.
              </p>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="bg-error text-white px-6 py-2.5 font-body text-xs font-bold tracking-widest uppercase hover:bg-error/80 transition-colors cursor-pointer shrink-0"
              >
                {cancelling ? "CANCELLING..." : "CANCEL ORDER"}
              </button>
            </div>
          )}
        </div>

        {/* Order Items & Artwork Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-surface-container-lowest p-8 border border-outline-variant/30 space-y-6">
            <h2 className="font-display text-xl font-bold text-on-surface border-b border-outline-variant/20 pb-4">
              GARMENTS & CUSTOM ARTWORK SPECIFICATIONS
            </h2>

            <div className="space-y-6">
              {order.items?.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-6 items-start bg-surface-container-low p-5 border border-outline-variant/20">
                    <div className="relative w-24 h-32 bg-white shrink-0 overflow-hidden border border-outline-variant/30 p-1 flex items-center justify-center">
                      {item.artworkUrl ? (
                        <img src={item.artworkUrl} alt="Custom Artwork" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">STANDARD MERCH</span>
                      )}
                    </div>

                    <div className="space-y-2 flex-grow">
                      <span className="text-xs font-body font-bold text-primary tracking-widest uppercase block">
                        PRODUCT SPECIFICATION
                      </span>
                      <h3 className="font-display text-lg font-bold text-on-surface">{item.productName}</h3>
                      <div className="font-body text-xs text-on-surface-variant space-y-1">
                        <p>SIZE: <span className="font-bold text-on-surface">{item.selectedSize}</span> | COLOR: <span className="font-bold text-on-surface">{item.selectedColor || "BLACK"}</span> | QUANTITY: <span className="font-bold text-on-surface">{item.quantity}</span></p>
                        {item.selectedPrintType && item.selectedPrintType !== "Standard" && (
                          <p className="text-primary font-bold">
                            CRAFT: {item.selectedPrintType} — PLACEMENT: {item.printLocation || "Front Center"}
                          </p>
                        )}
                      </div>
                      <span className="font-body font-bold text-base text-primary block pt-1">
                        ₹{(item.totalItemPrice || item.unitPrice * item.quantity)?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs font-body text-on-surface-variant uppercase">NO ITEM DETAILS FOUND FOR THIS SHIPMENT.</p>
              )}
            </div>
          </div>

          {/* Destination & Timeline Log */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low p-8 border border-outline-variant/30 space-y-4 font-body text-xs text-on-surface-variant uppercase">
              <h2 className="font-display text-lg font-bold text-on-surface border-b border-outline-variant/20 pb-3">
                DESTINATION & COURIER
              </h2>

              <div>
                <span className="font-bold text-on-surface block mb-1">RECIPIENT</span>
                <span>{order.shippingAddress?.name || "DEVENDRA BHATT"}</span>
              </div>

              <div>
                <span className="font-bold text-on-surface block mb-1">DISPATCH ADDRESS</span>
                <span>
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state || "Maharashtra"}, {order.shippingAddress?.pincode}, {order.shippingAddress?.country || "India"}
                </span>
              </div>

              <div>
                <span className="font-bold text-on-surface block mb-1">COURIER SERVICE</span>
                <span>{order.shippingDetails?.courierName || "DELHIVERY EXPRESS (INSURED)"}</span>
              </div>
            </div>

            {/* Timeline Audit Log */}
            <div className="bg-surface-container-lowest p-6 border border-outline-variant/30 space-y-4">
              <h3 className="font-display text-sm font-bold text-on-surface uppercase border-b border-outline-variant/20 pb-2">
                TIMELINE AUDIT LOG
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {(order.timeline || []).map((entry, idx) => (
                  <div key={idx} className="border-l-2 border-primary pl-3 py-1 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-body text-xs font-bold text-on-surface uppercase">{entry.status}</span>
                      <span className="text-[10px] text-on-surface-variant font-mono">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] font-body text-on-surface-variant">{entry.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
