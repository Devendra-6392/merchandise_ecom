"use client";

import { useState, useEffect } from "react";
import { useWishlistStore } from "../../store/useWishlistStore";
import { useAuthStore } from "../../store/useAuthStore";

export const PRODUCTS = [
  {
    id: "p1",
    name: "ORANGERED OVERSIZED MONOLITH HOODIE",
    category: "Outerwear",
    price: 2499,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=85",
    badge: "LIMITED / 50 PCS",
    description: "Architectural boxy hoodie crafted from 500 GSM custom-knit French Terry cotton. Features distressed double-layer hood and minimal Orangered tonal embroidery.",
    sizes: ["S", "M", "L", "XL"],
    specs: ["100% Organic French Terry Cotton", "Crafted in Mumbai, India", "Custom Matte Black Hardware", "Preshrunk Heavy Fabric"],
  },
  {
    id: "p2",
    name: "ARCHIVAL TRENCH COAT / ORANGERED ACCENT",
    category: "Coats",
    price: 5999,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
    badge: "RUNWAY EXCLUSIVE",
    description: "Double-breasted trench coat with structured shoulder pads and Orangered silk satin interior lining. Features storm flap and custom engraved horn buttons.",
    sizes: ["M", "L", "XL"],
    specs: ["Water-Resistant Premium Twill", "Orangered Silk Satin Lining", "Belted Waist with Steel Buckle", "Dry Clean Only"],
  },
  {
    id: "p3",
    name: "RAW DENIM SELVEDGE CARGO TROUSERS",
    category: "Pants",
    price: 3299,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=85",
    badge: "NEW IN",
    description: "14oz selvedge denim pant with wide-leg profile, articulated cargo pockets, and Orangered contrast topstitching.",
    sizes: ["28", "30", "32", "34"],
    specs: ["14oz Premium Selvedge Denim", "Custom Rivets & Button Fly", "Articulated Knee Pleats", "Unwashed Raw Finish"],
  },
  {
    id: "p4",
    name: "DECONSTRUCTED FLIGHT BOMBER JACKET",
    category: "Outerwear",
    price: 4999,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85",
    badge: "RESTOCKED",
    description: "Heavy nylon MA-1 flight jacket with asymmetrical Orangered utility straps, custom ribbing, and thermal insulation.",
    sizes: ["S", "M", "L"],
    specs: ["Military-Grade Flight Nylon", "Primaloft Thermal Insulation", "Heavy Duty Two-Way Zip", "Water-Repellent Outer"],
  },
  {
    id: "p5",
    name: "TAILORED EDITORIAL BLAZER / CHARCOAL",
    category: "Tailoring",
    price: 4499,
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85",
    badge: "CLASSIC",
    description: "Single-button peak-lapel blazer in deep charcoal virgin wool with high-waist darting and Orangered interior piping.",
    sizes: ["38R", "40R", "42R", "44R"],
    specs: ["100% Virgin Wool Blend", "Breathable Lining", "Padded Shoulders & Peak Lapel", "Tailored Fit"],
  },
  {
    id: "p6",
    name: "SIGNATURE MONOGRAM HEAVYWEIGHT TEE",
    category: "Tops",
    price: 1299,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85",
    hoverImage: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85",
    badge: "ESSENTIAL",
    description: "Boxy fit short sleeve t-shirt cut from 300 GSM combed jersey with high-density Orangered studio chest print.",
    sizes: ["S", "M", "L", "XL"],
    specs: ["300 GSM Combed Organic Cotton", "Ribbed Collar", "High-Density Screenprint", "Pre-shrunk Garment Wash"],
  },
];

export default function CollectionsGrid({ onQuickView, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [categories, setCategories] = useState(["ALL"]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { items: wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const token = useAuthStore((state) => state.token);

  const handleWishlistToggle = async (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id, token);
    } else {
      await addToWishlist(product, token);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/v1/categories");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.categories && data.categories.length > 0) {
            const dynamicCategories = data.categories.map(c => c.name.toUpperCase());
            setCategories(prev => Array.from(new Set(["ALL", ...dynamicCategories])));
          }
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/v1/products");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.products) {
            const formattedProducts = data.products.map(p => {
              const primaryImage = (p.images && p.images.length > 0 ? p.images[0] : p.image) || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80";
              const hoverImg = p.hoverImage || (p.images && p.images.length > 1 ? p.images[1] : primaryImage);
              const priceVal = Number(p.price ?? p.basePrice ?? 0);
              return {
                ...p,
                id: p._id || p.id,
                _id: p._id || p.id,
                name: p.name || "Untitled Product",
                category: p.category || "Uncategorized",
                price: priceVal,
                basePrice: priceVal,
                image: primaryImage,
                hoverImage: hoverImg,
                badge: p.badge || (p.stockQuantity && p.stockQuantity < 10 ? "LOW STOCK" : ""),
                sizes: p.sizes && p.sizes.length > 0 ? p.sizes : (p.availableSizes && p.availableSizes.length > 0 ? p.availableSizes : ["S", "M", "L", "XL"]),
                specs: p.specs && p.specs.length > 0 ? p.specs : [
                  p.description || "High quality merchandise garment",
                  `Print Types: ${(p.allowedPrintTypes || ["Screen Printing"]).join(", ")}`,
                  `Stock: ${p.stockQuantity ?? 100}`,
                ],
              };
            });
            setProducts(formattedProducts);

            const productCategories = Array.from(
              new Set(formattedProducts.map(p => p.category?.toUpperCase()).filter(Boolean))
            );
            if (productCategories.length > 0) {
              setCategories(prev => Array.from(new Set(["ALL", ...productCategories])));
            }
          }
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === "ALL"
      ? products
      : products.filter((p) => p.category.toUpperCase() === activeCategory);

  return (
    <section id="collections" className="py-24 px-6 md:px-16 max-w-[1440px] mx-auto bg-surface">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-outline-variant pb-8 gap-6">
        <div>
          <span className="font-body text-xs font-bold tracking-[0.2em] text-primary uppercase block mb-2">
            EDITORIAL CATALOG 2026
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-on-surface">
            CAPSULE COLLECTION
          </h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold tracking-[0.15em] font-body uppercase transition-all duration-300 rounded-none cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-surface-container-lowest flex flex-col border border-outline-variant/30 transition-all duration-500 hover:border-primary"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container-low">
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] font-bold px-3 py-1 font-body tracking-widest uppercase">
                  {product.badge}
                </div>
              )}

              {/* Wishlist Heart */}
              <button
                onClick={(e) => handleWishlistToggle(e, product)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full hover:bg-white hover:scale-110 transition-all shadow-sm group/heart cursor-pointer"
              >
                <span className={`material-symbols-outlined text-xl transition-colors ${isInWishlist(product.id) ? 'fill-current text-primary' : 'text-on-surface-variant group-hover/heart:text-primary'}`} style={{ fontVariationSettings: isInWishlist(product.id) ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
              </button>

              {/* Main Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              {/* Hover Image */}
              <img
                src={product.hoverImage}
                alt={`${product.name} detail`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Quick View Overlay Button */}
              <div className="absolute inset-0 bg-inverse-surface/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 gap-3">
                <button
                  onClick={() => onQuickView(product)}
                  className="bg-white text-on-surface px-6 py-3 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer shadow-md"
                >
                  QUICK LOOK
                </button>
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-primary text-white p-3 hover:bg-primary-container transition-colors duration-300 cursor-pointer shadow-md flex items-center justify-center"
                  aria-label="Add to cart"
                >
                  <span className="material-symbols-outlined text-xl">shopping_bag</span>
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 flex flex-col flex-grow justify-between border-t border-outline-variant/20">
              <div>
                <span className="text-[11px] font-body font-bold text-primary tracking-widest uppercase block mb-1">
                  {product.category}
                </span>
                <h3 className="font-display text-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant/10">
                <span className="font-body font-bold text-base text-on-surface">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <button
                  onClick={() => onQuickView(product)}
                  className="font-body text-xs font-bold text-primary hover:underline tracking-wider uppercase"
                >
                  VIEW DETAILS →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
