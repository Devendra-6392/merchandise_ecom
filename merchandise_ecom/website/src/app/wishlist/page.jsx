"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

export default function WishlistPage() {
  const { items, removeFromWishlist, fetchWishlist, loading } = useWishlistStore();
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (token) {
      fetchWishlist(token);
    }
  }, [token]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <span className="material-symbols-outlined text-6xl text-primary mb-4">favorite</span>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-2">WISHLIST</h1>
          <p className="font-body text-sm text-on-surface-variant mb-6 uppercase tracking-widest">
            Please sign in to view your saved items.
          </p>
          <Link href="/login" className="bg-primary text-white px-8 py-3 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-colors">
            SIGN IN OR REGISTER
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      <section className="py-16 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-outline-variant pb-6">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-on-surface uppercase">
              YOUR WISHLIST
            </h1>
            <p className="font-body text-xs font-bold tracking-[0.2em] text-primary uppercase mt-2">
              {items.length} SAVED ITEM{items.length !== 1 ? 'S' : ''}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/products" className="font-body text-xs font-bold text-on-surface-variant hover:text-primary tracking-widest uppercase underline">
              CONTINUE SHOPPING →
            </Link>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <div className="py-20 flex justify-center">
            <p className="font-body text-sm font-bold tracking-widest uppercase">Loading your wishlist...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center border border-dashed border-outline-variant/50">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">heart_broken</span>
            <p className="font-body text-sm text-on-surface-variant tracking-widest uppercase">
              Your wishlist is currently empty.
            </p>
            <Link href="/products" className="mt-6 border border-primary text-primary px-6 py-2 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-colors">
              EXPLORE CATALOG
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((product) => (
              <div
                key={product.id}
                className="group relative bg-surface-container-lowest flex flex-col border border-outline-variant/30 transition-all duration-500 hover:border-primary"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low">
                  <button
                    onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id, token); }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-sm cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <span className="material-symbols-outlined text-sm text-primary">close</span>
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-inverse-surface/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <button
                      onClick={() => addToCart({ product, size: product.sizes?.[0] || 'M', quantity: 1 })}
                      className="w-full bg-primary text-white py-3 font-body text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-primary-container transition-colors shadow-md"
                    >
                      ADD TO BAG
                    </button>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between border-t border-outline-variant/20">
                  <div>
                    <span className="text-[9px] font-body font-bold text-primary tracking-widest uppercase block mb-1">
                      {product.category}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-display text-sm font-bold text-on-surface line-clamp-1 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  <div className="mt-3 pt-3 border-t border-outline-variant/10">
                    <span className="font-body font-bold text-sm text-on-surface">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
