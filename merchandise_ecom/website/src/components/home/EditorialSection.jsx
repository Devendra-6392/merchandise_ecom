"use client";

export default function EditorialSection() {
  return (
    <section id="editorial" className="py-24 bg-inverse-surface text-inverse-on-surface relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        {/* Section Header */}
        <div className="mb-20 max-w-3xl">
          <span className="font-body text-xs font-bold tracking-[0.25em] text-primary-fixed uppercase block mb-3">
            BRAND MANIFESTO / VOL. 04
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            THE ARCHITECTURE OF HIGH-FASHION <span className="text-primary italic">ANARCHY</span>
          </h2>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Large Imagery */}
          <div className="lg:col-span-7 relative">
            <div className="aspect-[4/5] w-full overflow-hidden relative shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85"
                alt="Editorial Runway Model"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-inverse-surface/90 backdrop-blur-md p-6 border border-white/10">
                <span className="font-body text-[10px] font-bold tracking-widest text-primary-fixed block uppercase mb-1">
                  LOOKBOOK NO. 14 — SHOWN IN MUMBAI
                </span>
                <p className="font-display text-lg font-bold text-white">
                  "WE DO NOT DESIGN FOR PASSING SEASONS; WE DESIGN MONUMENTS IN TEXTILE."
                </p>
              </div>
            </div>
          </div>

          {/* Text Content & Smaller Imagery Overlay */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div className="border-l-2 border-primary pl-6">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                CURATED IN MUMBAI, FORGED IN BENGALURU
              </h3>
              <p className="font-body text-sm text-white/70 leading-relaxed font-light">
                Virasat Atelier rejects mass production in favor of architectural precision. Each piece is crafted in limited batches of 250 individually numbered garments, using custom-milled Indian organic cotton and heavyweight French Terry.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white/5 p-6 border border-white/10">
                <span className="font-display text-3xl font-bold text-primary block mb-1">500 GSM</span>
                <span className="font-body text-xs text-white/60 tracking-wider uppercase">Heavyweight Fabric Standard</span>
              </div>
              <div className="bg-white/5 p-6 border border-white/10">
                <span className="font-display text-3xl font-bold text-primary block mb-1">0mm</span>
                <span className="font-body text-xs text-white/60 tracking-wider uppercase">Sharp Edge Precision Cuts</span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="#collections"
                className="inline-block bg-primary text-white px-8 py-4 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary-container transition-all duration-300 horizontal-expansion cursor-pointer"
              >
                DISCOVER THE ARCHIVE
              </a>
            </div>
          </div>
        </div>

        {/* Feature Highlight Strip */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-12">
          <div className="space-y-3">
            <span className="material-symbols-outlined text-primary text-3xl">diamond</span>
            <h4 className="font-display text-xl font-bold text-white">LIMITED RUN AUTHENTICITY</h4>
            <p className="font-body text-xs text-white/60 leading-relaxed">
              Every garment features a serialized stainless-steel tag engraved with its individual collection production number.
            </p>
          </div>
          <div className="space-y-3">
            <span className="material-symbols-outlined text-primary text-3xl">cut</span>
            <h4 className="font-display text-xl font-bold text-white">ARCHITECTURAL CUTS</h4>
            <p className="font-body text-xs text-white/60 leading-relaxed">
              Engineered with 3D drop-shoulder seams and sharp zero-radius hem geometry for a commanding silhouette.
            </p>
          </div>
          <div className="space-y-3">
            <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
            <h4 className="font-display text-xl font-bold text-white">EXPRESS WORLDWIDE DISPATCH</h4>
            <p className="font-body text-xs text-white/60 leading-relaxed">
              Insured courier delivery worldwide in custom Virasat matte black magnetic presentation packaging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
