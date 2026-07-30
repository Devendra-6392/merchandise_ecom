"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ cartCount = 0, onOpenCart, onOpenSearch }) {
  const { user, isAuthenticated, logout } = useAuth();
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
            <Link
              href="/"
              className="font-display text-2xl md:text-3xl font-bold tracking-tighter text-primary hover:opacity-90 transition-opacity"
            >
              ORANGERED STUDIO
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="/"
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body text-xs tracking-[0.15em] uppercase"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-primary font-bold border-b-2 border-primary pb-1 font-body text-xs tracking-[0.15em] uppercase transition-opacity"
            >
              Collections
            </Link>
            <Link
              href="/products?category=OUTERWEAR"
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body text-xs tracking-[0.15em] uppercase"
            >
              Outerwear
            </Link>
            <Link
              href="/journal"
              className="text-on-surface-variant font-medium hover:text-primary transition-colors font-body text-xs tracking-[0.15em] uppercase"
            >
              Journal
            </Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-6 text-primary">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                aria-label="Search"
                className="material-symbols-outlined hover:opacity-70 transition-opacity cursor-pointer text-2xl"
              >
                search
              </button>
            )}
            
            <Link
              href={isAuthenticated ? "/profile" : "/login"}
              aria-label="Account"
              title={isAuthenticated ? `Logged in as ${user?.name}` : "Sign In"}
              className="hidden sm:flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <span className="material-symbols-outlined text-2xl">
                {isAuthenticated ? "account_circle" : "person"}
              </span>
              {isAuthenticated && (
                <span className="font-body text-[11px] font-bold tracking-wider uppercase max-w-[100px] truncate hidden lg:inline">
                  {user?.name?.split(" ")[0]}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Shopping Bag"
              className="relative flex items-center material-symbols-outlined hover:opacity-70 transition-opacity text-2xl"
            >
              shopping_bag
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

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
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-primary-fixed font-bold font-display text-2xl hover:pl-4 transition-all duration-300"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 font-display text-2xl hover:pl-4 hover:text-primary-fixed transition-all duration-300"
            >
              Collections
            </Link>
            <Link
              href="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 font-display text-2xl hover:pl-4 hover:text-primary-fixed transition-all duration-300"
            >
              Shopping Bag
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 font-display text-2xl hover:pl-4 hover:text-primary-fixed transition-all duration-300"
            >
              Client Account
            </Link>
          </div>

          <div className="mt-auto border-t border-white/15 pt-6 space-y-4">
            {isAuthenticated ? (
              <div className="flex justify-between items-center">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-white/90 hover:text-primary-fixed"
                >
                  <span className="material-symbols-outlined text-primary-fixed">account_circle</span>
                  <span className="font-body text-xs tracking-widest uppercase font-bold">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-body text-white/50 hover:text-primary uppercase tracking-widest cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 text-white/90 hover:text-primary-fixed"
              >
                <span className="material-symbols-outlined text-primary-fixed">person</span>
                <span className="font-body text-xs tracking-widest uppercase">Sign In / Register</span>
              </Link>
            )}
            <p className="text-white/40 text-[11px] font-body tracking-wider pt-2">
              © ORANGERED STUDIO. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
