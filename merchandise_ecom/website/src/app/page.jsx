"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import CollectionsGrid, { PRODUCTS } from "@/components/home/CollectionsGrid";
import EditorialSection from "@/components/home/EditorialSection";
import JournalSection from "@/components/home/JournalSection";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import ProductQuickViewModal from "@/components/modals/ProductQuickViewModal";
import SearchModal from "@/components/modals/SearchModal";

export default function Home() {
  const [cart, setCart] = useState([
    {
      product: PRODUCTS[0],
      size: "L",
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleAddToCart = (product, size = "M") => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

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
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

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
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
      />

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
