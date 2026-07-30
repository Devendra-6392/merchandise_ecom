"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const applyPromoCode = useCartStore((state) => state.applyPromoCode);
  const promoCode = useCartStore((state) => state.promoCode);
  const discount = useCartStore((state) => state.discount);

  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getShippingCharge = useCartStore((state) => state.getShippingCharge);
  const getGrandTotal = useCartStore((state) => state.getGrandTotal);

  const [inputCode, setInputCode] = useState("");
  const [promoNotice, setPromoNotice] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const res = applyPromoCode(inputCode);
    setPromoNotice(res.message);
  };

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shipping = getShippingCharge();
  const grandTotal = getGrandTotal();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-inverse-surface text-white py-12 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex justify-between items-end">
          <div>
            <span className="text-xs font-body tracking-[0.2em] text-primary-fixed uppercase block mb-2">
              YOUR ATELIERS BAG
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              SHOPPING BAG ({items.length})
            </h1>
          </div>
          <Link
            href="/products"
            className="hidden sm:block font-body text-xs font-bold text-primary-fixed hover:underline uppercase tracking-widest"
          >
            ← CONTINUE SHOPPING
          </Link>
        </div>
      </section>

      {/* Main Cart Content */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow">
        {items.length === 0 ? (
          <div className="py-24 text-center space-y-6">
            <span className="material-symbols-outlined text-7xl text-outline">shopping_bag</span>
            <h2 className="font-display text-3xl font-bold text-on-surface">YOUR SHOPPING BAG IS EMPTY</h2>
            <p className="font-body text-xs text-on-surface-variant max-w-sm mx-auto uppercase tracking-wider">
              EXPLORE OUR CAPSULE VOL. 04 COLLECTION AND ADD ARCHIVAL PIECES TO YOUR SELECTION.
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all cursor-pointer"
            >
              EXPLORE COLLECTIONS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Cart Items Table */}
            <div className="lg:col-span-8 space-y-6">
              <div className="hidden md:grid grid-cols-12 text-xs font-body font-bold text-on-surface-variant tracking-wider uppercase border-b border-outline-variant/30 pb-3">
                <span className="col-span-6">GARMENT & PRINT SPECIFICATIONS</span>
                <span className="col-span-2 text-center">SIZE / QTY</span>
                <span className="col-span-2 text-right">UNIT PRICE</span>
                <span className="col-span-2 text-right">TOTAL</span>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-surface-container-lowest p-4 border border-outline-variant/30 relative"
                >
                  <div className="md:col-span-6 flex gap-4 items-center">
                    <div className="relative w-20 h-24 bg-surface-container-low shrink-0 overflow-hidden border border-outline-variant/30">
                      <img
                        src={item.product?.image || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                      {item.artworkUrl && (
                        <img
                          src={item.artworkUrl}
                          alt="Custom Artwork"
                          className="absolute inset-0 m-auto max-h-12 w-auto object-contain drop-shadow-md"
                        />
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-body font-bold text-primary tracking-widest uppercase block">
                        {item.product?.category || "MERCHANDISE"}
                      </span>
                      <Link href={`/products/${item.product?.id}`}>
                        <h3 className="font-display text-sm font-bold text-on-surface hover:text-primary transition-colors">
                          {item.product?.name}
                        </h3>
                      </Link>

                      <div className="text-[11px] font-body text-on-surface-variant mt-1 space-y-0.5">
                        <p>COLOR: <span className="font-bold text-on-surface">{item.color}</span></p>
                        {item.printType !== "Standard" && (
                          <p className="text-primary font-bold">
                            TECHNIQUE: {item.printType} ({item.printLocation})
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="font-body text-[10px] font-bold text-error uppercase hover:underline mt-2 block cursor-pointer"
                      >
                        REMOVE GARMENT
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col items-center gap-2">
                    <span className="font-body text-xs font-bold text-on-surface">SIZE: {item.size}</span>
                    <div className="flex items-center border border-outline-variant/40">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-xs hover:bg-surface-container-high cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 font-body font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-xs hover:bg-surface-container-high cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-right font-body text-sm font-bold text-on-surface-variant">
                    ₹{item.unitPrice?.toLocaleString("en-IN")}
                  </div>

                  <div className="md:col-span-2 text-right font-body text-base font-bold text-primary">
                    ₹{item.totalItemPrice?.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}

              <div className="pt-6">
                <form onSubmit={handleApplyPromo} className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="PROMO CODE (e.g. ORANGERED10)..."
                    className="bg-surface-container-lowest border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary flex-grow"
                  />
                  <button
                    type="submit"
                    className="bg-inverse-surface text-white px-6 py-3 font-body text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors shrink-0 cursor-pointer"
                  >
                    APPLY
                  </button>
                </form>

                {promoNotice && (
                  <p className={`text-xs font-body font-bold mt-2 ${discount > 0 ? "text-primary" : "text-error"}`}>
                    {promoNotice}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4 bg-surface-container-low p-6 md:p-8 border border-outline-variant/40 space-y-6">
              <h2 className="font-display text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-4">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 font-body text-xs tracking-wider uppercase text-on-surface-variant">
                <div className="flex justify-between">
                  <span>GARMENTS SUBTOTAL</span>
                  <span className="font-bold text-on-surface">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>PROMO DISCOUNT ({(discount * 100).toFixed(0)}%)</span>
                    <span className="font-bold">-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>EXPRESS INDIA DISPATCH</span>
                  <span className="font-bold text-on-surface">₹{shipping}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-center font-body">
                <span className="font-bold text-sm uppercase tracking-wider">TOTAL ESTIMATE</span>
                <span className="font-display text-2xl font-bold text-primary">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>

              <p className="text-[10px] font-body text-on-surface-variant uppercase tracking-wider">
                INCLUSIVE OF ALL APPLICABLE GST TAXES ACROSS INDIA.
              </p>

              <button
                onClick={() => router.push("/checkout")}
                className="block text-center w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-300 horizontal-expansion shadow-lg cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
