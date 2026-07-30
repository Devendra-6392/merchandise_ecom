"use client";

import { useState } from "react";

export default function ProductQuickViewModal({
  product,
  onClose,
  onAddToCartWithSize,
}) {
  const [selectedSize, setSelectedSize] = useState("");

  if (!product) return null;

  const currentSize = selectedSize || product.sizes[0] || "M";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-surface text-on-surface border border-outline-variant shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-inverse-surface text-white w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Left Column: Image */}
        <div className="md:w-1/2 aspect-[3/4] bg-surface-container-low relative overflow-hidden shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 font-body tracking-widest uppercase">
              {product.badge}
            </span>
          )}
        </div>

        {/* Right Column: Product Specs & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-xs font-body font-bold text-primary tracking-widest uppercase block mb-1">
              {product.category} — CAPSULE 04
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface leading-tight mb-3">
              {product.name}
            </h2>
            <div className="font-body text-xl font-bold text-primary mb-6">
              ₹{product.price?.toLocaleString("en-IN")}
            </div>

            <p className="font-body text-xs text-on-surface-variant leading-relaxed font-light mb-6">
              {product.description}
            </p>

            {/* Specs List */}
            <div className="border-t border-b border-outline-variant/30 py-4 mb-6">
              <span className="font-body text-[11px] font-bold text-on-surface tracking-widest uppercase block mb-2">
                GARMENT SPECIFICATIONS
              </span>
              <ul className="space-y-1">
                {product.specs.map((spec, i) => (
                  <li key={i} className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-body text-xs font-bold text-on-surface tracking-widest uppercase">
                  SELECT SIZE
                </span>
                <button className="font-body text-[10px] font-bold text-primary underline uppercase">
                  SIZE GUIDE
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-3 font-body text-xs font-bold transition-all duration-200 border cursor-pointer ${
                      currentSize === size
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container-low text-on-surface border-outline-variant/40 hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-outline-variant/20">
            <button
              onClick={() => {
                onAddToCartWithSize(product, currentSize);
                onClose();
              }}
              className="w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-300 horizontal-expansion cursor-pointer shadow-lg"
            >
              ADD TO BAG (₹{product.price?.toLocaleString("en-IN")})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
