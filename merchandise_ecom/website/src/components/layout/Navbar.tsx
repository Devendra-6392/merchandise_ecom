"use client";

import { useState, useEffect } from "react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export default function Navbar({ cartCount, onOpenCart, onOpenSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-surface/90 backdrop-blur-md border-b border-outline-variant/40 py-3 shadow-xs"
            : "bg-surface/80 backdrop-blur-sm border-b border-outline-variant/20 py-4"
        }`}
      >
        <div className="flex justify-between items-center w-full px-6 md:px-16 max-w-[1440px] mx-auto">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <a
              href="#"
              className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-primary hover:opacity-90 transition-opacity"
            >
              ORANGERED STUDIO
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#collections"
              className="text-primary font-bold border-b-2 border-primary pb-1 font-body text-xs tracking-[0.15em] uppercase transition-opacity"
            >
              Collections
            </a>
            <a
              href="#new-arrivals"
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body text-xs tracking-[0.15em] uppercase"
            >
              New Arrivals
            </a>
            <a
              href="#editorial"
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body text-xs tracking-[0.15em] uppercase"
            >
              Archive
            </a>
            <a
              href="#journal"
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body text-xs tracking-[0.15em] uppercase"
            >
              Journal
            </a>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-6 text-primary">
            <button
              onClick={onOpenSearch}
              aria-label="Search"
              className="material-symbols-outlined hover:opacity-70 transition-opacity cursor-pointer text-2xl"
            >
              search
            </button>
            <button
              aria-label="Account"
              className="hidden sm:block material-symbols-outlined hover:opacity-70 transition-opacity cursor-pointer text-2xl"
            >
              person
            </button>
            <button
              onClick={onOpenCart}
              aria-label="Shopping Bag"
              className="relative material-symbols-outlined hover:opacity-70 transition-opacity cursor-pointer text-2xl"
            >
              shopping_bag
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden material-symbols-outlined text-primary cursor-pointer text-2xl"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              menu
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col p-6 bg-inverse-surface text-inverse-on-surface transition-all duration-300">
          <div className="flex justify-between items-center mb-10">
            <span className="font-display text-2xl font-bold text-primary-fixed tracking-tight">
              ORANGERED
            </span>
            <button
              className="text-primary-fixed material-symbols-outlined text-3xl cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              close
            </button>
          </div>

          <div className="flex flex-col space-y-8 flex-grow">
            <a
              href="#collections"
              onClick={() => setMobileMenuOpen(false)}
              className="text-primary-fixed font-bold font-display text-2xl hover:pl-4 transition-all duration-300"
            >
              Collections
            </a>
            <a
              href="#new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 font-display text-2xl hover:pl-4 hover:text-primary-fixed transition-all duration-300"
            >
              New Arrivals
            </a>
            <a
              href="#editorial"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 font-display text-2xl hover:pl-4 hover:text-primary-fixed transition-all duration-300"
            >
              Archive
            </a>
            <a
              href="#journal"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 font-display text-2xl hover:pl-4 hover:text-primary-fixed transition-all duration-300"
            >
              Journal
            </a>
          </div>

          <div className="mt-auto border-t border-white/15 pt-6 space-y-4">
            <div className="flex items-center space-x-3 text-white/90">
              <span className="material-symbols-outlined text-primary-fixed">person</span>
              <span className="font-body text-xs tracking-widest uppercase">Client Account</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <span className="material-symbols-outlined text-primary-fixed">favorite</span>
              <span className="font-body text-xs tracking-widest uppercase">Wishlist (0)</span>
            </div>
            <p className="text-white/40 text-[11px] font-body tracking-wider pt-2">
              © ORANGERED STUDIO. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
