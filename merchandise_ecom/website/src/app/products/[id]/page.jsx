"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { PRODUCTS } from "@/components/home/CollectionsGrid";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("SPECS");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`/api/v1/products/${productId}`);
        const data = await res.json();
        if (data.success) {
           const p = { ...data.product, id: data.product._id };
           setProduct(p);
           setSelectedImage(p.image);
           setSelectedSize(p.sizes?.[0] || "M");
           
           const relatedRes = await fetch(`/api/v1/products`);
           const relatedData = await relatedRes.json();
           if (relatedData.success) {
             const allProducts = relatedData.products.map(pr => ({ ...pr, id: pr._id }));
             setRelatedProducts(allProducts.filter(pr => pr.id !== p.id).slice(0, 3));
           }
        }
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);

  const { isCartOpen, setCartOpen, addToCart } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const { items: wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to manage your wishlist.");
      router.push("/login");
      return;
    }
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id, token);
    } else {
      await addToWishlist(product, token);
    }
  };

  const images = product ? [
    product.image,
    product.hoverImage,
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85",
  ].filter(Boolean) : [];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please sign in to add items to your shopping bag.");
      router.push("/login");
      return;
    }
    addToCart({
      product,
      size: selectedSize,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert("Please sign in to proceed to checkout.");
      router.push("/login");
      return;
    }
    handleAddToCart();
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <p className="font-body text-sm font-bold tracking-widest uppercase">Loading Product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="font-body text-sm font-bold tracking-widest uppercase">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="py-4 px-6 md:px-16 border-b border-outline-variant/20 max-w-[1440px] mx-auto w-full">
        <div className="flex items-center gap-2 text-xs font-body tracking-[0.15em] text-on-surface-variant uppercase">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Collections</Link>
          <span>/</span>
          <span className="text-primary font-bold">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <section className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 border overflow-hidden shrink-0 cursor-pointer ${
                    selectedImage === img ? "border-primary border-2" : "border-outline-variant/40 hover:border-primary"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="order-1 md:order-2 flex-grow aspect-[3/4] bg-surface-container-low relative overflow-hidden border border-outline-variant/30">
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] font-bold px-3 py-1 font-body tracking-widest uppercase">
                  {product.badge}
                </span>
              )}
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-body font-bold text-primary tracking-[0.2em] uppercase block mb-2">
                {product.category} — CAPSULE 04
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-on-surface leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="font-body text-2xl font-bold text-primary">₹{product.price?.toLocaleString("en-IN")}</span>
                <span className="text-xs font-body text-on-surface-variant tracking-wider uppercase bg-surface-container-high px-3 py-1 font-bold">
                  FREE DISPATCH ACROSS INDIA
                </span>
              </div>
            </div>

            <p className="font-body text-sm text-on-surface-variant leading-relaxed font-light">
              {product.description}
            </p>

            {/* CUSTOMIZER CALLOUT BANNER */}
            <div className="bg-primary/10 border border-primary/30 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-primary tracking-wider uppercase">
                  🎨 ATELIER CUSTOMIZER STUDIO
                </span>
                <span className="text-[10px] font-body font-bold bg-primary text-white px-2 py-0.5 uppercase">
                  NEW
                </span>
              </div>
              <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                Add your custom vector logo, graphic, or typography. Select print techniques (DTF, Screen Printing, Embroidery) & placement locations.
              </p>
              <Link
                href={`/products/${product.id}/customize`}
                className="inline-block bg-primary text-white px-6 py-2.5 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary-container transition-all cursor-pointer shadow-md mt-2"
              >
                OPEN MERCH CUSTOMIZER →
              </Link>
            </div>

            {/* Size Selector */}
            <div className="border-t border-outline-variant/30 pt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-body text-xs font-bold text-on-surface tracking-widest uppercase">
                  SELECT GARMENT SIZE
                </span>
                <span className="font-body text-[10px] font-bold text-primary underline uppercase cursor-pointer">
                  FIT & SIZE GUIDE
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[56px] h-12 px-4 font-body text-xs font-bold transition-all border cursor-pointer ${
                      selectedSize === size
                        ? "bg-primary text-white border-primary"
                        : "bg-surface-container-low text-on-surface border-outline-variant/40 hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <span className="font-body text-xs font-bold text-on-surface tracking-widest uppercase block mb-2">
                QUANTITY
              </span>
              <div className="flex items-center border border-outline-variant/40 w-36">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center font-bold text-on-surface hover:bg-surface-container-high cursor-pointer"
                >
                  -
                </button>
                <span className="flex-grow text-center font-body font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center font-bold text-on-surface hover:bg-surface-container-high cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-300 horizontal-expansion cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">shopping_bag</span>
                <span>ADD TO SHOPPING BAG (₹{(product.price * quantity).toLocaleString("en-IN")})</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-inverse-surface text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-all cursor-pointer"
              >
                BUY IT NOW & CHECKOUT
              </button>

              <button
                onClick={handleWishlistToggle}
                className="w-full border border-outline-variant/40 text-on-surface py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-surface-container-high transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className={`material-symbols-outlined text-lg ${product && isInWishlist(product.id) ? 'fill-current text-primary' : ''}`} style={{ fontVariationSettings: product && isInWishlist(product.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                <span>{product && isInWishlist(product.id) ? "REMOVE FROM WISHLIST" : "SAVE TO WISHLIST"}</span>
              </button>
            </div>

            {/* Accordion Specs & Care Tabs */}
            <div className="border-t border-outline-variant/30 pt-6">
              <div className="flex gap-6 border-b border-outline-variant/20 mb-4">
                <button
                  onClick={() => setActiveTab("SPECS")}
                  className={`pb-2 font-body text-xs font-bold tracking-widest uppercase cursor-pointer ${
                    activeTab === "SPECS" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  GARMENT SPECS
                </button>
                <button
                  onClick={() => setActiveTab("CARE")}
                  className={`pb-2 font-body text-xs font-bold tracking-widest uppercase cursor-pointer ${
                    activeTab === "CARE" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  CARE & WASHING
                </button>
                <button
                  onClick={() => setActiveTab("DISPATCH")}
                  className={`pb-2 font-body text-xs font-bold tracking-widest uppercase cursor-pointer ${
                    activeTab === "DISPATCH" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  DELIVERY & RETURNS
                </button>
              </div>

              {activeTab === "SPECS" && (
                <ul className="space-y-2 text-xs font-body text-on-surface-variant">
                  {product.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === "CARE" && (
                <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                  Machine wash cold with like colors. Do not bleach. Lay flat to dry or line dry in shade. Cool iron if necessary.
                </p>
              )}

              {activeTab === "DISPATCH" && (
                <p className="text-xs font-body text-on-surface-variant leading-relaxed">
                  All India orders ship via insured Delhivery Express within 24-48 hours. Returns accepted within 7 days of delivery.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        <div className="mt-24 border-t border-outline-variant/30 pt-16">
          <span className="font-body text-xs font-bold tracking-[0.2em] text-primary uppercase block mb-2">
            CURATED PAIRINGS
          </span>
          <h2 className="font-display text-3xl font-bold text-on-surface mb-10">
            YOU MAY ALSO LIKE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <div key={rel.id} className="group border border-outline-variant/30 hover:border-primary transition-all">
                <Link href={`/products/${rel.id}`}>
                  <div className="aspect-[3/4] overflow-hidden bg-surface-container-low">
                    <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-body font-bold text-primary tracking-widest uppercase block">{rel.category}</span>
                    <h3 className="font-display text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">{rel.name}</h3>
                    <span className="font-body font-bold text-sm text-on-surface mt-2 block">₹{rel.price?.toLocaleString("en-IN")}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
