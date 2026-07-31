"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/store/useAuthStore";
import Hero from "@/components/home/Hero";
import CollectionsGrid from "@/components/home/CollectionsGrid";
import EditorialSection from "@/components/home/EditorialSection";
import JournalSection from "@/components/home/JournalSection";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ProductQuickViewModal from "@/components/modals/ProductQuickViewModal";
import SearchModal from "@/components/modals/SearchModal";
import { useCartStore } from "@/store/useCartStore";

export default function Home() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const addToCart = useCartStore((state) => state.addToCart);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  const handleAddToCart = (product, size = "M") => {
    if (!isAuthenticated) {
      alert("Please sign in to add items to your shopping bag.");
      router.push("/login");
      return;
    }
    addToCart({ product, size, quantity: 1 });
  };

  const scrollToCollections = () => {
    const el = document.getElementById("collections");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-white py-2 px-4 text-center font-body text-[11px] font-bold tracking-[0.25em] uppercase">
        LIMITED RUN CAPSULE 04 — EXPRESS WORLDWIDE DISPATCH ON ALL ORDERS
      </div>

      {/* Glassmorphic Navbar */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Editorial Hero */}
        <Hero onExploreClick={scrollToCollections} />

        {/* Collections Catalog Grid */}
        <CollectionsGrid
          onQuickView={(product) => setQuickViewProduct(product)}
          onAddToCart={(product) => handleAddToCart(product, "M")}
        />

        {/* Brand Manifesto & Lookbook Spread */}
        <EditorialSection />

        {/* Press & Studio Journal */}
        <JournalSection />

        {/* Private Client Newsletter */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCartWithSize={handleAddToCart}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setQuickViewProduct(product)}
      />
    </div>
  );
}
