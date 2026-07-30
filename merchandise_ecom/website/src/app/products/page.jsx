"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductQuickViewModal from "@/components/modals/ProductQuickViewModal";
import CartDrawer from "@/components/cart/CartDrawer";
import { PRODUCTS } from "@/components/home/CollectionsGrid";
import { useCartStore } from "@/store/useCartStore";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("DEFAULT");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const addToCart = useCartStore((state) => state.addToCart);

  const categories = ["ALL", "OUTERWEAR", "COATS", "PANTS", "TAILORING", "TOPS"];

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory !== "ALL") {
      list = list.filter((p) => p.category.toUpperCase() === selectedCategory);
    }

    if (searchQuery.trim()) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "PRICE_LOW") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "PRICE_HIGH") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "NAME") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [selectedCategory, sortBy, searchQuery]);

  const handleAddToCart = (product, size = "M") => {
    addToCart({ product, size, quantity: 1 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-inverse-surface text-white py-16 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 text-xs font-body tracking-[0.2em] text-primary-fixed uppercase mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Collections</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
            THE ARCHIVE <span className="text-primary italic">CATALOG</span>
          </h1>
          <p className="font-body text-xs md:text-sm text-white/70 max-w-xl font-light leading-relaxed uppercase tracking-wider">
            Explore 500 GSM heavyweight French Terry hoodies, selvedge denim, Italian coats, and high-fashion tailoring.
          </p>
        </div>
      </section>

      {/* Filter and Controls Toolbar */}
      <section className="py-8 px-6 md:px-16 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 border-b border-outline-variant/30 pb-6">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 font-body text-xs font-bold tracking-[0.15em] uppercase transition-all rounded-none cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Box */}
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="FILTER CATALOG..."
                className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface px-4 py-2 text-xs font-body uppercase outline-none focus:border-primary w-full sm:w-60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface px-4 py-2 text-xs font-body font-bold uppercase outline-none focus:border-primary cursor-pointer"
            >
              <option value="DEFAULT">SORT: FEATURED</option>
              <option value="PRICE_LOW">PRICE: LOW TO HIGH</option>
              <option value="PRICE_HIGH">PRICE: HIGH TO LOW</option>
              <option value="NAME">NAME: A-Z</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        <div className="py-4 flex justify-between items-center text-xs font-body text-on-surface-variant">
          <span>SHOWING {filteredProducts.length} GARMENTS</span>
          {(selectedCategory !== "ALL" || searchQuery || sortBy !== "DEFAULT") && (
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
                setSortBy("DEFAULT");
              }}
              className="text-primary font-bold hover:underline uppercase tracking-wider"
            >
              RESET ALL FILTERS
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative bg-surface-container-lowest flex flex-col border border-outline-variant/30 transition-all duration-500 hover:border-primary"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low">
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] font-bold px-3 py-1 font-body tracking-widest uppercase">
                    {product.badge}
                  </div>
                )}

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <img
                  src={product.hoverImage}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Quick Actions Buttons */}
                <div className="absolute inset-0 bg-inverse-surface/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 gap-3">
                  <Link
                    href={`/products/${product.id}/customize`}
                    className="w-full max-w-[200px] text-center bg-primary text-white py-3 px-4 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary-container transition-colors cursor-pointer shadow-md"
                  >
                    🎨 CUSTOMIZE DESIGN
                  </Link>

                  <div className="flex gap-2 w-full max-w-[200px]">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-grow text-center bg-white text-on-surface py-2.5 px-3 font-body text-[11px] font-bold tracking-wider uppercase hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-md"
                    >
                      VIEW SPEC
                    </Link>
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="bg-primary text-white p-2.5 hover:bg-primary-container transition-colors cursor-pointer shadow-md"
                      aria-label="Quick View"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow justify-between border-t border-outline-variant/20">
                <div>
                  <span className="text-[11px] font-body font-bold text-primary tracking-widest uppercase block mb-1">
                    {product.category}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <h2 className="font-display text-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h2>
                  </Link>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant/10">
                  <span className="font-body font-bold text-base text-on-surface">
                    ${product.price} USD
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/products/${product.id}/customize`}
                      className="font-body text-xs font-bold text-primary hover:underline tracking-wider uppercase"
                    >
                      CUSTOMIZE 🎨
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product, "M")}
                      className="font-body text-xs font-bold text-on-surface-variant hover:text-primary tracking-wider uppercase"
                    >
                      + ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCartWithSize={handleAddToCart}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
