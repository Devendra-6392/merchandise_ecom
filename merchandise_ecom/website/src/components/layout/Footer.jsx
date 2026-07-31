"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-inverse-surface text-white border-t border-white/10 pt-20 pb-12 px-6 md:px-16">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="font-display text-3xl font-bold tracking-tighter text-primary inline-block">
            ORANGERED STUDIO
          </Link>
          <p className="font-body text-xs text-white/70 font-light max-w-sm leading-relaxed">
            Minimalist Editorial with High-Contrast accents. Engineering monuments in luxury streetwear and architectural fashion curation.
          </p>
          <div className="flex space-x-6 text-white/60 pt-2">
            <a href="#" className="hover:text-primary transition-colors text-xs font-body tracking-widest uppercase">
              INSTAGRAM
            </a>
            <a href="#" className="hover:text-primary transition-colors text-xs font-body tracking-widest uppercase">
              TWITTER / X
            </a>
            <a href="#" className="hover:text-primary transition-colors text-xs font-body tracking-widest uppercase">
              SPOTIFY
            </a>
          </div>
        </div>

        {/* Column 2: Collections */}
        <div>
          <h3 className="font-body text-xs font-bold tracking-[0.2em] text-primary-fixed uppercase mb-4">
            COLLECTIONS
          </h3>
          <ul className="space-y-3 font-body text-xs text-white/70">
            <li>
              <Link href="/products" className="hover:text-white transition-colors">
                All Archives
              </Link>
            </li>
            <li>
              <Link href="/products?category=OUTERWEAR" className="hover:text-white transition-colors">
                Outerwear Monoliths
              </Link>
            </li>
            <li>
              <Link href="/products?category=PANTS" className="hover:text-white transition-colors">
                Selvedge Denim
              </Link>
            </li>
            <li>
              <Link href="/products?category=TOPS" className="hover:text-white transition-colors">
                Heavyweight Tees
              </Link>
            </li>
            <li>
              <Link href="/products?category=TAILORING" className="hover:text-white transition-colors">
                Tailored Suits
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Client Services */}
        <div>
          <h3 className="font-body text-xs font-bold tracking-[0.2em] text-primary-fixed uppercase mb-4">
            CLIENT CONCIERGE
          </h3>
          <ul className="space-y-3 font-body text-xs text-white/70">
            <li>
              <Link href="/profile" className="hover:text-white transition-colors">
                Account Dashboard
              </Link>
            </li>
            <li>
              <Link href="/orders/ORD-89241" className="hover:text-white transition-colors">
                Order Tracking
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white transition-colors">
                Shopping Bag
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white transition-colors">
                Client Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white transition-colors">
                Private Registry
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Atelier Locations */}
        <div>
          <h3 className="font-body text-xs font-bold tracking-[0.2em] text-primary-fixed uppercase mb-4">
            STUDIO ATELIERS
          </h3>
          <div className="space-y-3 font-body text-xs text-white/70">
            <div>
              <span className="block text-white font-bold">MUMBAI</span>
              <span className="text-[11px]">Bandra Kurla Complex, Bandra East, Mumbai 400051</span>
            </div>
            <div>
              <span className="block text-white font-bold">DELHI NCR</span>
              <span className="text-[11px]">Cyber City, DLF Phase 2, Gurugram 122002</span>
            </div>
            <div>
              <span className="block text-white font-bold">BENGALURU</span>
              <span className="text-[11px]">100 Feet Road, Indiranagar, Bengaluru 560038</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] font-body text-white/50 tracking-wider uppercase gap-4">
        <span>© {new Date().getFullYear()} ORANGERED STUDIO. ALL RIGHTS RESERVED.</span>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">
            PRIVACY POLICY
          </a>
          <a href="#" className="hover:text-white transition-colors">
            TERMS OF SERVICE
          </a>
          <a href="#" className="hover:text-white transition-colors">
            COOKIES
          </a>
        </div>
      </div>
    </footer>
  );
}
