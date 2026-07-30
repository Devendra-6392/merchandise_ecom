"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";

export default function CheckoutPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getShippingCharge = useCartStore((state) => state.getShippingCharge);
  const getGrandTotal = useCartStore((state) => state.getGrandTotal);

  const createOrder = useOrderStore((state) => state.createOrder);

  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(" ")[0] : "DEVENDRA",
    lastName: user?.name && user.name.split(" ").length > 1 ? user.name.split(" ")[1] : "BHATT",
    email: user?.email || "devendra@example.com",
    address: user?.address || "Via Montenapoleone 18",
    city: "Milan",
    country: "Italy",
    zip: "20121",
    cardNumber: "•••• •••• •••• 4242",
    expDate: "12/28",
    cvv: "888",
  });

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shipping = getShippingCharge();
  const grandTotal = getGrandTotal();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your shopping bag is empty!");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: user?.phone || "+1 (555) 019-2834",
        street: formData.address,
        city: formData.city,
        country: formData.country,
        pincode: formData.zip,
      },
      items: items.map((i) => ({
        productName: i.product?.name || "Garment",
        quantity: i.quantity,
        selectedSize: i.size,
        selectedColor: i.color,
        selectedPrintType: i.printType,
        printLocation: i.printLocation,
        artworkUrl: i.artworkUrl,
        unitPrice: i.unitPrice,
        totalItemPrice: i.totalItemPrice,
      })),
      billingSummary: {
        subtotal: subtotal,
        discountAmount: discountAmount,
        shippingCharge: shipping,
        grandTotal: grandTotal,
      },
    };

    const res = await createOrder(orderData);
    setIsSubmitting(false);

    if (res.success && res.order) {
      clearCart();
      router.push(`/orders/${res.order.orderNumber}`);
    } else {
      alert("Failed to create order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-24 text-center px-6">
          <div className="space-y-6 max-w-md">
            <span className="material-symbols-outlined text-6xl text-outline">shopping_bag</span>
            <h1 className="font-display text-3xl font-bold">YOUR BAG IS EMPTY</h1>
            <p className="font-body text-xs text-on-surface-variant uppercase">
              ADD MERCHANDISE PIECES BEFORE PROCEEDING TO EXPRESS CHECKOUT.
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-4 font-body text-xs font-bold tracking-widest uppercase hover:bg-primary-container transition-all"
            >
              BROWSE CATALOG
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-3 border font-body text-xs font-bold tracking-wider uppercase cursor-pointer ${
                    paymentMethod === "UPI" ? "border-primary bg-primary text-white" : "border-outline-variant/40 bg-surface-container-low"
                  }`}
                >
                  UPI / NETBANKING
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`p-3 border font-body text-xs font-bold tracking-wider uppercase cursor-pointer ${
                    paymentMethod === "RAZORPAY" ? "border-primary bg-primary text-white" : "border-outline-variant/40 bg-surface-container-low"
                  }`}
                >
                  RAZORPAY
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
              ORDER SUMMARY ({items.length})
            </h2>

            {/* Selected Items */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-outline-variant/15 pb-3">
                  <div className="relative w-16 h-20 bg-surface-container shrink-0 overflow-hidden border border-outline-variant/30">
                    <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                    {item.artworkUrl && (
                      <img src={item.artworkUrl} alt="Logo" className="absolute inset-0 m-auto max-h-10 w-auto object-contain drop-shadow-sm" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-display text-xs font-bold text-on-surface line-clamp-1">{item.product?.name}</h3>
                    <p className="font-body text-[11px] text-on-surface-variant mt-0.5">SIZE: {item.size} | COLOR: {item.color}</p>
                    {item.printType !== "Standard" && (
                      <p className="font-body text-[10px] text-primary font-bold">{item.printType} ({item.printLocation})</p>
                    )}
                    <span className="font-body font-bold text-xs text-primary">${item.totalItemPrice} USD</span>
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

              {discountAmount > 0 && (
                <div className="flex justify-between text-primary font-bold">
                  <span>DISCOUNT</span>
                  <span>-${discountAmount.toFixed(2)} USD</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>EXPRESS DISPATCH</span>
                <span className="font-bold text-on-surface">${shipping} USD</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-outline-variant/20 font-bold text-base text-on-surface">
                <span>TOTAL DUE</span>
                <span className="text-primary font-display text-xl">${grandTotal.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-primary-container"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>AUTHORIZING TRANSACTION...</span>
                </>
              ) : (
                `CONFIRM & PAY ($${grandTotal.toFixed(2)} USD)`
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
