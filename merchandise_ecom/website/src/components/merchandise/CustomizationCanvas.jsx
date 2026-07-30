"use client";

import { useState, useRef } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

const COLOR_PALETTE = [
  { name: "DEEP BLACK", hex: "#121212", bgClass: "bg-neutral-900" },
  { name: "ATELIER WHITE", hex: "#FAFAFA", bgClass: "bg-slate-100" },
  { name: "HEATHER GREY", hex: "#7E848C", bgClass: "bg-slate-500" },
  { name: "MIDNIGHT NAVY", hex: "#1B263B", bgClass: "bg-slate-800" },
  { name: "CRIMSON MAROON", hex: "#4A0E17", bgClass: "bg-red-950" },
  { name: "EMERALD OLIVE", hex: "#1D3528", bgClass: "bg-emerald-950" },
];

const PRINT_TYPES = [
  { id: "DTF", name: "DTF Printing", desc: "High Detail & Micro-Gradient Color Saturation", priceAdd: 250 },
  { id: "SCREEN", name: "Screen Printing", desc: "Heavy Plastisol Ink — Maximum Durability", priceAdd: 300 },
  { id: "EMBROIDERY", name: "Embroidery", desc: "Premium 3D Raised Threading Finish", priceAdd: 450 },
  { id: "SUBLIMATION", name: "Sublimation", desc: "Seamless Fabric Dye Fusion", priceAdd: 350 },
  { id: "UV", name: "UV Printing", desc: "Gloss Tactile & Metallic Accent Texture", priceAdd: 500 },
];

const PRINT_LOCATIONS = [
  { id: "Front", name: "Front Center", priceAdd: 0 },
  { id: "Back", name: "Full Back", priceAdd: 200 },
  { id: "Left Chest", name: "Left Chest Emblem", priceAdd: 0 },
  { id: "Right Sleeve", name: "Right Sleeve", priceAdd: 150 },
  { id: "Left Sleeve", name: "Left Sleeve", priceAdd: 150 },
  { id: "Full Print", name: "Full Garment Wrap", priceAdd: 600 },
];

const SAMPLE_PRESETS = [
  { name: "ORANGERED MONOGRAM", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80" },
  { name: "CYBERPUNK GRAPHIC", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80" },
  { name: "ATELIER EMBLEM", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80" },
  { name: "MINIMALIST TYPOGRAPHY", url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80" },
];

export default function CustomizationCanvas({ product }) {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedView, setSelectedView] = useState("FRONT");
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "M");
  const [selectedPrintType, setSelectedPrintType] = useState(PRINT_TYPES[0]);
  const [selectedLocation, setSelectedLocation] = useState(PRINT_LOCATIONS[0]);

  const [artworkUrl, setArtworkUrl] = useState(SAMPLE_PRESETS[0].url);
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [artworkScale, setArtworkScale] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  const fileInputRef = useRef(null);

  const basePrice = product?.price || 2499;
  const printTypeCost = selectedPrintType.priceAdd;
  const locationCost = selectedLocation.priceAdd;
  const unitPrice = basePrice + printTypeCost + locationCost;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setArtworkUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      product: product,
      size: selectedSize,
      color: selectedColor.name,
      printType: selectedPrintType.name,
      printLocation: selectedLocation.name,
      artworkUrl: artworkUrl,
      artworkScale: artworkScale,
      unitPrice: unitPrice,
      quantity: 1,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1440px] mx-auto">
      {/* Left Column: Interactive Garment Canvas Stage */}
      <div className="lg:col-span-7 space-y-4">
        {/* Canvas Toolbar View Controls */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-3 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView("FRONT")}
              className={`px-4 py-2 font-body text-xs font-bold tracking-widest uppercase cursor-pointer transition-colors ${
                selectedView === "FRONT" ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              FRONT VIEW
            </button>
            <button
              onClick={() => setSelectedView("BACK")}
              className={`px-4 py-2 font-body text-xs font-bold tracking-widest uppercase cursor-pointer transition-colors ${
                selectedView === "BACK" ? "bg-primary text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              BACK VIEW
            </button>
          </div>

          <span className="text-[11px] font-body text-primary font-bold uppercase tracking-wider">
            CANVAS RESOLUTION: 300 DPI VECTOR
          </span>
        </div>

        {/* Garment Mockup Canvas Stage */}
        <div className="relative aspect-[3/4] w-full bg-surface-container-low border border-outline-variant/40 overflow-hidden flex items-center justify-center shadow-inner">
          {/* Garment Base Color Overlay */}
          <div
            className="absolute inset-0 transition-colors duration-500 opacity-20 pointer-events-none"
            style={{ backgroundColor: selectedColor.hex }}
          />

          {/* Base Product Garment Image */}
          <img
            src={selectedView === "FRONT" ? product?.image : product?.hoverImage || product?.image}
            alt={product?.name}
            className="w-full h-full object-cover mix-blend-multiply transition-all duration-300"
          />

          {/* Interactive Artwork Printing Overlay Zone */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
            <div
              className="relative transition-all duration-200 border-2 border-dashed border-primary/40 p-4 rounded-lg flex flex-col items-center justify-center"
              style={{
                transform: `translate(${posX}px, ${posY}px) scale(${artworkScale})`,
                maxWidth: selectedLocation.id === "Left Chest" ? "120px" : selectedLocation.id === "Right Sleeve" || selectedLocation.id === "Left Sleeve" ? "100px" : "280px",
              }}
            >
              {artworkUrl && (
                <img
                  src={artworkUrl}
                  alt="Custom Artwork"
                  className="max-h-48 w-auto object-contain drop-shadow-2xl mix-blend-hard-light"
                />
              )}

              {customText && (
                <span
                  className="font-display font-bold text-center tracking-wider text-xl uppercase mt-2 drop-shadow-md"
                  style={{ color: textColor }}
                >
                  {customText}
                </span>
              )}

              <span className="absolute -top-3 left-2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest pointer-events-auto">
                {selectedLocation.name} — {selectedPrintType.name}
              </span>
            </div>
          </div>
        </div>

        {/* Canvas Position & Scale Sliders */}
        <div className="bg-surface-container-lowest p-6 border border-outline-variant/30 space-y-4">
          <h3 className="font-display text-sm font-bold text-on-surface uppercase border-b border-outline-variant/20 pb-2">
            ARTWORK POSITION & SCALE CONTROLS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-body font-bold text-on-surface-variant uppercase mb-1">
                SCALE (ZOOM): {artworkScale.toFixed(2)}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={artworkScale}
                onChange={(e) => setArtworkScale(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-body font-bold text-on-surface-variant uppercase mb-1">
                HORIZONTAL (X): {posX}px
              </label>
              <input
                type="range"
                min="-150"
                max="150"
                value={posX}
                onChange={(e) => setPosX(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-body font-bold text-on-surface-variant uppercase mb-1">
                VERTICAL (Y): {posY}px
              </label>
              <input
                type="range"
                min="-150"
                max="150"
                value={posY}
                onChange={(e) => setPosY(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Customization Controls & Specifications */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <span className="text-xs font-body font-bold text-primary tracking-[0.25em] uppercase block mb-2">
            CUSTOM MERCHANDISE ATELIER
          </span>
          <h1 className="font-display text-3xl font-bold text-on-surface leading-tight">
            CUSTOMIZE: {product?.name}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="font-body text-2xl font-bold text-primary">₹{unitPrice.toLocaleString("en-IN")}</span>
            <span className="text-[11px] font-body text-on-surface-variant bg-surface-container-high px-3 py-1 uppercase tracking-wider font-bold">
              BASE: ₹{basePrice.toLocaleString("en-IN")} + PRINT: ₹{(printTypeCost + locationCost).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* 1. Color Selection */}
        <div className="space-y-3">
          <label className="block font-body text-xs font-bold text-on-surface tracking-wider uppercase">
            1. GARMENT COLOR: <span className="text-primary">{selectedColor.name}</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {COLOR_PALETTE.map((col) => (
              <button
                key={col.name}
                onClick={() => setSelectedColor(col)}
                className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer ${
                  selectedColor.name === col.name ? "border-primary scale-110 shadow-lg" : "border-outline-variant/40 hover:scale-105"
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>
        </div>

        {/* 2. Garment Size */}
        <div className="space-y-3">
          <label className="block font-body text-xs font-bold text-on-surface tracking-wider uppercase">
            2. GARMENT SIZE: <span className="text-primary">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {(product?.sizes || ["XS", "S", "M", "L", "XL", "XXL", "3XL"]).map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`min-w-[48px] h-10 px-3 font-body text-xs font-bold transition-all border cursor-pointer ${
                  selectedSize === sz
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-container-low text-on-surface border-outline-variant/40 hover:border-primary"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Print Technique */}
        <div className="space-y-3">
          <label className="block font-body text-xs font-bold text-on-surface tracking-wider uppercase">
            3. PRINTING TECHNIQUE & CRAFT
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRINT_TYPES.map((pt) => (
              <button
                key={pt.id}
                onClick={() => setSelectedPrintType(pt)}
                className={`p-3 text-left border cursor-pointer transition-all ${
                  selectedPrintType.id === pt.id
                    ? "border-primary bg-primary/5 text-on-surface shadow-sm"
                    : "border-outline-variant/40 bg-surface-container-low hover:border-primary/60"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-body text-xs font-bold uppercase">{pt.name}</span>
                  <span className="font-body text-[11px] font-bold text-primary">+₹{pt.priceAdd}</span>
                </div>
                <p className="font-body text-[10px] text-on-surface-variant mt-1 line-clamp-1">{pt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Print Placement Location */}
        <div className="space-y-3">
          <label className="block font-body text-xs font-bold text-on-surface tracking-wider uppercase">
            4. PRINT PLACEMENT LOCATION
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRINT_LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`p-3 font-body text-xs font-bold tracking-wider uppercase text-center border cursor-pointer transition-all ${
                  selectedLocation.id === loc.id
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-container-low text-on-surface border-outline-variant/40 hover:border-primary"
                }`}
              >
                {loc.name} {loc.priceAdd > 0 && `(+₹${loc.priceAdd})`}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Artwork Upload & Presets */}
        <div className="space-y-4 border-t border-outline-variant/30 pt-6">
          <label className="block font-body text-xs font-bold text-on-surface tracking-wider uppercase">
            5. UPLOAD ARTWORK OR CHOOSE PRESET
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-grow bg-inverse-surface text-white py-3 px-4 font-body text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">cloud_upload</span>
              <span>UPLOAD VECTOR / PNG ARTWORK</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div>
            <span className="text-[10px] font-body text-on-surface-variant font-bold uppercase block mb-2">
              OR SELECT CURATED PRESET GRAPHIC:
            </span>
            <div className="grid grid-cols-4 gap-3">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setArtworkUrl(preset.url)}
                  className={`aspect-square border overflow-hidden p-1 bg-surface-container-low cursor-pointer ${
                    artworkUrl === preset.url ? "border-primary border-2" : "border-outline-variant/40 hover:border-primary"
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-[10px] font-body font-bold text-on-surface-variant uppercase mb-1">
              ADD CUSTOM TYPOGRAPHY TEXT (OPTIONAL):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="ENTER CUSTOM TEXT (e.g. ATELIER 2026)..."
                className="flex-grow bg-surface-container-low border border-outline-variant/40 px-3 py-2 text-xs font-body uppercase outline-none focus:border-primary"
              />
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-9 border border-outline-variant/40 cursor-pointer bg-transparent"
                title="Text Color"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 border-t border-outline-variant/30 pt-6">
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            <span>ADD CUSTOMIZED MERCH TO BAG (₹{unitPrice.toLocaleString("en-IN")})</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="w-full bg-inverse-surface text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-all cursor-pointer"
          >
            BUY IT NOW & CHECKOUT →
          </button>
        </div>
      </div>
    </div>
  );
}
