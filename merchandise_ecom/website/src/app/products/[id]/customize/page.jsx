"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import CustomizationCanvas from "@/components/merchandise/CustomizationCanvas";
import { PRODUCTS } from "@/components/home/CollectionsGrid";
import { useCartStore } from "@/store/useCartStore";

export default function ProductCustomizePage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/v1/products/${productId}`);
        const data = await res.json();
        if (data.success) {
          setProduct({ ...data.product, id: data.product._id });
        }
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <p className="font-body text-sm font-bold tracking-widest uppercase">Loading Customizer...</p>
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

      {/* Header Banner */}
      <section className="bg-inverse-surface text-white py-10 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-body tracking-[0.2em] text-primary-fixed uppercase mb-2">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:underline">Collections</Link>
              <span>/</span>
              <Link href={`/products/${product.id}`} className="hover:underline">{product.name}</Link>
              <span>/</span>
              <span className="text-white font-bold">Customize</span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              INTERACTIVE <span className="text-primary italic">MERCH STUDIO</span>
            </h1>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="hidden sm:block font-body text-xs font-bold text-primary-fixed hover:underline uppercase tracking-widest"
          >
            ← BACK TO STANDARD GARMENT
          </Link>
        </div>
      </section>

      {/* Main Customizer Canvas Section */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow">
        <CustomizationCanvas product={product} />
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
