"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartStore((state) => state.getSubtotal());

  if (!isOpen) return null;

  const handleProceedCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-surface text-on-surface h-full flex flex-col z-10 border-l border-outline-variant shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-inverse-surface text-white">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-primary-fixed">shopping_bag</span>
            <h2 className="font-display text-xl font-bold tracking-tight">
              SHOPPING BAG ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-2xl hover:text-primary transition-colors cursor-pointer"
          >
            close
          </button>
        </div>

        {/* Cart Content */}
        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-outline">shopping_bag</span>
            <h3 className="font-display text-2xl font-bold text-on-surface">YOUR BAG IS EMPTY</h3>
            <p className="font-body text-xs text-on-surface-variant max-w-xs uppercase tracking-wider">
              YOUR ORANGERED SELECTION WILL APPEAR HERE ONCE ADDED.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-primary text-white px-8 py-3 font-body text-xs font-bold tracking-[0.15em] uppercase hover:bg-primary-container transition-colors cursor-pointer"
            >
              EXPLORE COLLECTION
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-surface-container-lowest border border-outline-variant/20 relative"
                >
                  {/* Image or Artwork Thumbnail */}
                  <div className="relative w-20 h-24 bg-surface-container-low shrink-0 overflow-hidden border border-outline-variant/30">
                    <img
                      src={item.product?.image || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80"}
                      alt={item.product?.name}
                      className="w-full h-full object-cover"
                    />
                    {item.artworkUrl && (
                      <img
                        src={item.artworkUrl}
                        alt="Custom Logo"
                        className="absolute inset-0 m-auto max-h-12 w-auto object-contain drop-shadow-md"
                      />
                    )}
                  </div>

                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-display text-sm font-bold text-on-surface line-clamp-1">
                        {item.product?.name}
                      </h4>
                      <div className="font-body text-[11px] text-on-surface-variant mt-1 space-y-0.5">
                        <p>
                          SIZE: <span className="font-bold text-on-surface">{item.size}</span> | COLOR: <span className="font-bold text-on-surface">{item.color}</span>
                        </p>
                        {item.printType !== "Standard" && (
                          <p className="text-primary font-bold">
                            {item.printType} ({item.printLocation})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center border border-outline-variant/40">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-surface-container-high"
                        >
                          -
                        </button>
                        <span className="px-2 font-body font-bold text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-xs hover:bg-surface-container-high"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-body font-bold text-sm text-primary">
                        ${item.totalItemPrice} USD
                      </span>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="font-body text-[10px] font-bold text-error uppercase hover:underline cursor-pointer"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Summary */}
            <div className="p-6 border-t border-outline-variant/30 bg-surface-container-low space-y-4">
              <div className="flex justify-between items-center text-xs font-body font-bold uppercase tracking-wider">
                <span>SUBTOTAL</span>
                <span className="text-lg text-primary">${subtotal} USD</span>
              </div>
              <p className="text-[10px] font-body text-on-surface-variant uppercase tracking-wider">
                TAXES AND WORLDWIDE COURIER DISPATCH CALCULATED AT CHECKOUT.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="w-full border border-outline-variant text-on-surface py-3 text-center font-body text-xs font-bold tracking-widest uppercase hover:border-primary hover:text-primary transition-all"
                >
                  VIEW FULL BAG
                </Link>

                <button
                  onClick={handleProceedCheckout}
                  className="w-full bg-primary text-white py-3 font-body text-xs font-bold tracking-widest uppercase hover:bg-primary-container transition-all cursor-pointer shadow-lg"
                >
                  CHECKOUT
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
