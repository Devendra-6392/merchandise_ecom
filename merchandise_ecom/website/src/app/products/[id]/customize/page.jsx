"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CustomizationCanvas from "@/components/merchandise/CustomizationCanvas";
import { PRODUCTS } from "@/components/home/CollectionsGrid";
import { useCartStore } from "@/store/useCartStore";

export default function ProductCustomizePage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-inverse-surface text-white py-10 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-body tracking-[0.2em] text-primary-fixed uppercase mb-2">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:underline">Collections</Link>
              <span>/</span>
              <Link href={`/products/${product.id}`} className="hover:underline">{product.name}</Link>
              <span>/</span>
              <span className="text-white font-bold">Customize</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              INTERACTIVE <span className="text-primary italic">MERCH STUDIO</span>
            </h1>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="hidden sm:block font-body text-xs font-bold text-primary-fixed hover:underline uppercase tracking-widest"
          >
            ← BACK TO STANDARD GARMENT
          </Link>
        </div>
      </section>

      {/* Main Customizer Canvas Section */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow">
        <CustomizationCanvas product={product} />
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
