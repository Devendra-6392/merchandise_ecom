"use client";

export default function Hero({ onExploreClick }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-inverse-surface text-white">
      {/* Background Photography with Ken-Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=85"
          alt="Orangered Studio High Fashion Editorial"
          className="w-full h-full object-cover opacity-40 ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-inverse-surface/60" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[1440px] w-full px-6 md:px-16 py-24 flex flex-col justify-between min-h-[80vh]">
        {/* Top Tagline / Meta */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs tracking-[0.2em] font-body text-primary-fixed uppercase border-b border-white/10 pb-4 gap-2">
          <span>CAPSULE 04 / WINTER COLLECTION</span>
          <span className="text-white/60">LIMITED RUN — 250 PIECES WORLDWIDE</span>
        </div>

        {/* Central Editorial Typography */}
        <div className="my-auto py-12 max-w-4xl">
          <p className="font-body text-xs md:text-sm font-bold tracking-[0.25em] text-primary-fixed mb-4 uppercase">
            ORANGERED HIGH-FASHION LOOKBOOK
          </p>
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.95] text-white mb-6">
            CURATED <br />
            <span className="text-primary italic">ANARCHY</span>
          </h1>
          <p className="font-body text-base md:text-xl text-white/80 max-w-2xl font-light leading-relaxed mb-8">
            Bridging the gap between streetwear energy and couture sophistication. Crafted with heavyweight Japanese cotton and Italian hardware.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="bg-primary hover:bg-primary-container text-white px-8 py-4 font-body text-xs font-bold tracking-[0.15em] uppercase rounded-none transition-all duration-300 horizontal-expansion cursor-pointer shadow-lg"
            >
              EXPLORE COLLECTION
            </button>
            <a
              href="#editorial"
              className="border border-white/40 hover:border-primary text-white hover:text-primary px-8 py-4 font-body text-xs font-bold tracking-[0.15em] uppercase rounded-none transition-colors duration-300 cursor-pointer"
            >
              VIEW LOOKBOOK
            </a>
          </div>
        </div>

        {/* Bottom Specs / Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white/70 border-t border-white/10 pt-6 text-xs font-body tracking-wider uppercase">
          <div>
            <span className="block text-white font-bold mb-1">01 / CRAFT</span>
            <span>Made in Milan & Tokyo</span>
          </div>
          <div>
            <span className="block text-white font-bold mb-1">02 / SILHOUETTE</span>
            <span>Architectural Boxy Cut</span>
          </div>
          <div>
            <span className="block text-white font-bold mb-1">03 / FABRIC</span>
            <span>500 GSM Heavyweight Terry</span>
          </div>
          <div>
            <span className="block text-white font-bold mb-1">04 / DISPATCH</span>
            <span>Express Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </section>
  );
}
