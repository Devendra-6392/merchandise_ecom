"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CustomizationCanvas from "@/components/merchandise/CustomizationCanvas";
import { PRODUCTS } from "@/components/home/CollectionsGrid";
import { useCartStore } from "@/store/useCartStore";

const formatProduct = (p) => {
  const primaryImage = (p.images && p.images.length > 0 ? p.images[0] : p.image) || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";
  const hoverImg = p.hoverImage || (p.images && p.images.length > 1 ? p.images[1] : primaryImage);
  const priceVal = Number(p.price ?? p.basePrice ?? 0);
  return {
    ...p,
    id: p._id || p.id,
    _id: p._id || p.id,
    name: p.name || "Untitled Product",
    category: p.category || "Uncategorized",
    price: priceVal,
    basePrice: priceVal,
    image: primaryImage,
    hoverImage: hoverImg,
    badge: p.badge || (p.stockQuantity && p.stockQuantity < 10 ? "LOW STOCK" : ""),
    sizes: p.sizes && p.sizes.length > 0 ? p.sizes : (p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ["S", "M", "L", "XL"]),
    specs: p.specs && p.specs.length > 0 ? p.specs : [
      p.description || "High quality merchandise garment",
      `Print Types: ${(p.allowedPrintTypes || ["Screen Printing"]).join(", ")}`,
      `Stock: ${p.stockQuantity ?? 100}`,
    ],
  };
};

export default function ProductCustomizePage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/v1/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            setProduct(formatProduct(data.product));
          }
        }
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <p className="font-body text-sm font-bold tracking-widest uppercase">Loading Customizer...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="font-body text-sm font-bold tracking-widest uppercase">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

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
