"use client";

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

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
              SHOPPING BAG ({cartItems.length})
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
        {cartItems.length === 0 ? (
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
              {cartItems.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.size}-${idx}`}
                  className="flex gap-4 p-4 bg-surface-container-lowest border border-outline-variant/20 relative"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover bg-surface-container-low shrink-0"
                  />
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-display text-sm font-bold text-on-surface line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="font-body text-xs text-on-surface-variant mt-1">
                        SIZE: <span className="font-bold text-on-surface">{item.size}</span> | QTY: {item.quantity}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <span className="font-body font-bold text-sm text-primary">
                        ${item.product.price * item.quantity} USD
                      </span>
                      <button
                        onClick={() => onRemoveItem(idx)}
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
              <button
                onClick={() => alert(`Proceeding to checkout for $${subtotal} USD`)}
                className="w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary-container transition-all duration-300 horizontal-expansion cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
