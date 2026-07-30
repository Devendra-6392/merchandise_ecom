"use client";

import { useState } from "react";
import { PRODUCTS, Product } from "../home/CollectionsGrid";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelectProduct,
}: SearchModalProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : PRODUCTS.slice(0, 3);

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-surface/98 text-on-surface backdrop-blur-md transition-all">
      {/* Search Header */}
      <div className="p-6 md:p-10 max-w-[1440px] w-full mx-auto flex justify-between items-center border-b border-outline-variant">
        <span className="font-display text-2xl font-bold text-primary tracking-tighter">
          ORANGERED SEARCH
        </span>
        <button
          onClick={onClose}
          className="material-symbols-outlined text-3xl hover:text-primary transition-colors cursor-pointer"
        >
          close
        </button>
      </div>

      {/* Input Field */}
      <div className="max-w-4xl w-full mx-auto px-6 py-12">
        <div className="relative border-b-2 border-primary">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH HOODIE, TRENCH, DENIM, BLAZER..."
            className="w-full bg-transparent py-4 text-2xl md:text-4xl font-display font-bold outline-none uppercase placeholder:text-outline-variant"
          />
          <span className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-3xl text-primary">
            search
          </span>
        </div>

        {/* Results Header */}
        <div className="mt-10 mb-6">
          <span className="font-body text-xs font-bold tracking-[0.2em] text-primary uppercase">
            {query.trim() ? `RESULTS (${results.length})` : "RECOMMENDED ARCHIVE"}
          </span>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onSelectProduct(product);
                onClose();
              }}
              className="group bg-surface-container-lowest p-4 border border-outline-variant/30 hover:border-primary transition-all cursor-pointer flex gap-4 items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-20 object-cover bg-surface-container-low shrink-0"
              />
              <div>
                <span className="text-[10px] font-body font-bold text-primary tracking-widest uppercase block">
                  {product.category}
                </span>
                <h4 className="font-display text-xs font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h4>
                <span className="font-body font-bold text-xs text-on-surface mt-1 block">
                  ${product.price} USD
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
