"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PRODUCTS } from "@/components/home/CollectionsGrid";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    { product: PRODUCTS[0], size: "L", quantity: 1 },
    { product: PRODUCTS[2], size: "32", quantity: 1 },
  ]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        return copy.filter((_, i) => i !== index);
      }
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const removeItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const applyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "ORANGERED10") {
      setDiscount(0.1);
      setPromoApplied(true);
    } else {
      alert("Invalid Code. Try 'ORANGERED10'");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 0 ? 25 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />

      {/* Hero Header */}
      <section className="bg-inverse-surface text-white py-12 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex justify-between items-end">
          <div>
            <span className="text-xs font-body tracking-[0.2em] text-primary-fixed uppercase block mb-2">
              YOUR ATELIERS BAG
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              SHOPPING BAG ({cartItems.length})
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
        {cartItems.length === 0 ? (
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
                <span className="col-span-6">GARMENT DETAILS</span>
                <span className="col-span-2 text-center">SIZE / QTY</span>
                <span className="col-span-2 text-right">PRICE</span>
                <span className="col-span-2 text-right">TOTAL</span>
              </div>

              {cartItems.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.size}-${idx}`}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-surface-container-lowest p-4 border border-outline-variant/30 relative"
                >
                  {/* Thumbnail & Info */}
                  <div className="md:col-span-6 flex gap-4 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover bg-surface-container-low shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-body font-bold text-primary tracking-widest uppercase block">
                        {item.product.category}
                      </span>
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-display text-sm font-bold text-on-surface hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeItem(idx)}
                        className="font-body text-[10px] font-bold text-error uppercase hover:underline mt-2 block"
                      >
                        REMOVE GARMENT
                      </button>
                    </div>
                  </div>

                  {/* Size & Quantity Controls */}
                  <div className="md:col-span-2 flex flex-col items-center gap-2">
                    <span className="font-body text-xs font-bold text-on-surface">SIZE: {item.size}</span>
                    <div className="flex items-center border border-outline-variant/40">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-xs hover:bg-surface-container-high"
                      >
                        -
                      </button>
                      <span className="px-2 font-body font-bold text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-xs hover:bg-surface-container-high"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Unit Price */}
                  <div className="md:col-span-2 text-right font-body text-sm font-bold text-on-surface-variant">
                    ${item.product.price} USD
                  </div>

                  {/* Item Total */}
                  <div className="md:col-span-2 text-right font-body text-base font-bold text-primary">
                    ${item.product.price * item.quantity} USD
                  </div>
                </div>
              ))}

              {/* Promo Code Box */}
              <div className="pt-6">
                <form onSubmit={applyPromo} className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="PROMO CODE (e.g. ORANGERED10)..."
                    className="bg-surface-container-lowest border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary flex-grow"
                  />
                  <button
                    type="submit"
                    className="bg-inverse-surface text-white px-6 py-3 font-body text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors shrink-0"
                  >
                    APPLY
                  </button>
                </form>
                {promoApplied && (
                  <p className="text-xs font-body font-bold text-primary mt-2">
                    ✓ PROMO CODE APPLIED: 10% DISCOUNT
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
                  <span className="font-bold text-on-surface">${subtotal} USD</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>SPECIAL DISCOUNT (10%)</span>
                    <span className="font-bold">-${discountAmount.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>EXPRESS COURIER DISPATCH</span>
                  <span className="font-bold text-on-surface">${shipping} USD</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-4 flex justify-between items-center font-body">
                <span className="font-bold text-sm uppercase tracking-wider">TOTAL ESTIMATE</span>
                <span className="font-display text-2xl font-bold text-primary">${grandTotal.toFixed(2)} USD</span>
              </div>

              <p className="text-[10px] font-body text-on-surface-variant uppercase tracking-wider">
                DUTIES & IMPORT TAXES ARE CALCULATED BEFORE DISPATCH.
              </p>

              <Link
                href="/checkout"
                className="block text-center w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-300 horizontal-expansion shadow-lg cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
