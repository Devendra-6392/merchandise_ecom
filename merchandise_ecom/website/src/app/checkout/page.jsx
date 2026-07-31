"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";
import InvoiceModal from "@/components/invoice/InvoiceModal";
import Lottie from "lottie-react";

export default function CheckoutPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getShippingCharge = useCartStore((state) => state.getShippingCharge);
  const getGrandTotal = useCartStore((state) => state.getGrandTotal);

  const createOrder = useOrderStore((state) => state.createOrder);

  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const token = useAuthStore((state) => state.token);

  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(" ")[0] : "DEVENDRA",
    lastName: user?.name && user.name.split(" ").length > 1 ? user.name.split(" ")[1] : "YADAV",
    email: user?.email || "devendra.yadav@example.com",
    address: typeof user?.address === "object" ? (user.address?.street || "Flat 402, Orangered Residency, Bandra West") : (user?.address || "Flat 402, Orangered Residency, Bandra West"),
    city: typeof user?.address === "object" ? (user.address?.city || "Mumbai") : "Mumbai",
    state: typeof user?.address === "object" ? (user.address?.state || "Maharashtra") : "Maharashtra",
    country: typeof user?.address === "object" ? (user.address?.country || "India") : "India",
    zip: typeof user?.address === "object" ? (user.address?.pincode || user.address?.zip || "400050") : "400050",
    upiId: "devendra@okaxis",
    cardNumber: "•••• •••• •••• 4242",
    expDate: "12/28",
    cvv: "888",
  });

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shipping = getShippingCharge();
  const grandTotal = getGrandTotal();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your shopping bag is empty!");
      return;
    }

    setIsSubmitting(true);

    const streetStr = typeof formData.address === "object" ? (formData.address?.street || "Flat 402, Orangered Residency, Bandra West") : String(formData.address || "Flat 402, Orangered Residency, Bandra West");

    const orderData = {
      paymentMethod,
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: user?.phone || "+91 98765 43210",
        street: streetStr,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.zip,
      },
      items: items.map((i) => {
        const uPrice = Number(i.unitPrice || i.product?.price || i.product?.basePrice || 0);
        const qty = Number(i.quantity || 1);
        return {
          product: i.product?.id || i.product?._id,
          productName: i.product?.name || i.name || "Custom Garment",
          quantity: qty,
          selectedSize: i.size || "M",
          selectedColor: i.color || "Standard",
          selectedPrintType: i.printType || "Screen Printing",
          printLocation: i.printLocation || "Front",
          artworkUrl: i.artworkUrl || "",
          unitPrice: uPrice,
          totalItemPrice: Number(i.totalItemPrice || (uPrice * qty)),
        };
      }),
      billingSummary: {
        subtotal: subtotal,
        discountAmount: discountAmount,
        shippingCharge: shipping,
        grandTotal: grandTotal,
      },
    };

    const res = await createOrder(orderData);

    if (res.success && res.order) {
      if (paymentMethod === "COD") {
        clearCart();
        setOrderSuccess(true);
        setTimeout(() => {
          router.push(`/orders/${res.order.orderNumber}`);
        }, 3000);
      } else {
        // Razorpay flow
        try {
          const loadScript = () => {
            return new Promise((resolve) => {
              const script = document.createElement("script");
              script.src = "https://checkout.razorpay.com/v1/checkout.js";
              script.onload = () => resolve(true);
              script.onerror = () => resolve(false);
              document.body.appendChild(script);
            });
          };
          
          const scriptLoaded = await loadScript();
          if (!scriptLoaded) {
            alert("Razorpay SDK failed to load");
            setIsSubmitting(false);
            return;
          }

          const rzpRes = await fetch("/api/v1/payment/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ orderId: res.order._id })
          });
          
          const rzpData = await rzpRes.json();
          if (!rzpData.success) throw new Error("Failed to create Razorpay order");

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key",
            amount: rzpData.paymentOrder.amount,
            currency: "INR",
            name: "VIRASAT ATELIER",
            description: "Checkout Payment",
            order_id: rzpData.paymentOrder.id,
            handler: async function (response) {
              const verifyRes = await fetch("/api/v1/payment/verify", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  orderId: res.order._id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  status: "Success"
                })
              });
              const verifyData = await verifyRes.json();
              
              if (verifyData.success) {
                clearCart();
                setOrderSuccess(true);
                setTimeout(() => {
                  router.push(`/orders/${res.order.orderNumber}`);
                }, 3000);
              } else {
                alert("Payment verification failed");
              }
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: user?.phone || "9999999999"
            },
            theme: { color: "#FF4500" }
          };
          
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
             alert(response.error.description);
          });
          rzp.open();

        } catch (error) {
          console.error(error);
          alert("Error initializing payment");
        }
      }
    } else {
      alert("Failed to create order. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const { currentOrder } = useOrderStore();

  if (orderSuccess) {
    const activeOrder = currentOrder || {
      orderNumber: createdOrderNumber || "ORD-89241",
      currentStatus: "OrderPlaced",
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: user?.phone || "+91 98765 43210",
        street: typeof formData.address === "object" ? (formData.address?.street || "Flat 402, Virasat Residency, Bandra West") : String(formData.address || "Flat 402, Virasat Residency, Bandra West"),
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.zip,
      },
      billingSummary: {
        subtotal,
        taxAmount: Math.round(subtotal * 0.18),
        shippingCharge: shipping,
        discountAmount,
        grandTotal,
      },
      items,
      paymentDetails: { gateway: paymentMethod, status: "Pending" },
    };

    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />

        <InvoiceModal
          isOpen={invoiceOpen}
          onClose={() => setInvoiceOpen(false)}
          order={activeOrder}
        />

        <main className="flex-grow flex items-center justify-center py-24 text-center px-6">
          <div className="space-y-6 max-w-lg bg-surface-container-lowest p-8 md:p-10 border border-primary/40 shadow-2xl">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <span className="text-xs font-body tracking-[0.25em] text-primary font-bold uppercase block">
              VIRASAT ATELIER ORDER DISPATCH
            </span>
            <h1 className="font-display text-3xl font-bold text-on-surface">ORDER SUCCESSFULLY PLACED!</h1>
            <p className="font-body text-xs text-on-surface-variant uppercase tracking-wider">
              ORDER <span className="font-mono font-bold text-primary">{createdOrderNumber || "CONFIRMED"}</span> IS SAVED & PROCESSING FOR PRINT FLOOR DISPATCH.
            </p>

            <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/30">
              <button
                onClick={() => setInvoiceOpen(true)}
                className="bg-primary text-white px-6 py-3.5 font-body text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-base">receipt_long</span>
                VIEW ORDER CONFIRMATION RECEIPT
              </button>
              <Link
                href={`/orders/${createdOrderNumber || "latest"}`}
                className="border border-outline text-on-surface hover:bg-surface-container-high px-6 py-3.5 font-body text-xs font-bold uppercase tracking-widest transition-all"
              >
                LIVE 10-STAGE ORDER TRACKING →
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-24 text-center px-6">
          <div className="space-y-6 max-w-md">
            <span className="material-symbols-outlined text-6xl text-outline">shopping_bag</span>
            <h1 className="font-display text-3xl font-bold">YOUR BAG IS EMPTY</h1>
            <p className="font-body text-xs text-on-surface-variant uppercase">
              ADD MERCHANDISE PIECES BEFORE PROCEEDING TO EXPRESS CHECKOUT.
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-8 py-4 font-body text-xs font-bold tracking-widest uppercase hover:bg-primary-container transition-all"
            >
              BROWSE CATALOG
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />

      {/* Header */}
      <section className="bg-inverse-surface text-white py-10 px-6 md:px-16 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <div>
            <span className="text-xs font-body tracking-[0.2em] text-primary-fixed uppercase block mb-1">
              SECURE INDIA DISPATCH CHECKOUT
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold">EXPRESS CHECKOUT</h1>
          </div>
          <span className="material-symbols-outlined text-3xl text-primary-fixed">lock</span>
        </div>
      </section>

      {/* Checkout Content */}
      <main className="py-12 px-6 md:px-16 max-w-[1440px] mx-auto w-full flex-grow relative">
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Contact & Shipping Address */}
            <div className="bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/30 space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-3">
                  <span className="w-7 h-7 bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
                  <span>DELIVERY ADDRESS (INDIA)</span>
                </h2>
                <span className="text-xs font-body text-primary font-bold">REQUIRED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">FIRST NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">LAST NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">EMAIL ADDRESS FOR DISPATCH NOTIFICATIONS</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">STREET ADDRESS / FLAT & BUILDING</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">CITY</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">STATE</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-body font-bold text-on-surface-variant uppercase tracking-wider mb-2">PINCODE</label>
                  <input
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 px-4 py-3 text-xs font-body uppercase outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-surface-container-lowest p-6 md:p-8 border border-outline-variant/30 space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-3">
                  <span className="w-7 h-7 bg-primary text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span>PAYMENT METHOD</span>
                </h2>
                <span className="text-xs font-body text-on-surface-variant">RAZORPAY / UPI SECURED</span>
              </div>

              {/* Payment Type Tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`p-3 border font-body text-xs font-bold tracking-wider uppercase cursor-pointer ${
                    paymentMethod === "RAZORPAY" ? "border-primary bg-primary text-white" : "border-outline-variant/40 bg-surface-container-low"
                  }`}
                >
                  SECURE ONLINE PAYMENT (RAZORPAY)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-3 border font-body text-xs font-bold tracking-wider uppercase cursor-pointer ${
                    paymentMethod === "COD" ? "border-primary bg-primary text-white" : "border-outline-variant/40 bg-surface-container-low"
                  }`}
                >
                  CASH ON DELIVERY (COD)
                </button>
              </div>

              {paymentMethod === "RAZORPAY" && (
                <div className="space-y-3 pt-2 text-xs font-body text-on-surface-variant uppercase tracking-widest">
                  YOU WILL BE REDIRECTED TO RAZORPAY SECURE GATEWAY TO COMPLETE YOUR TRANSACTION (UPI, CARDS, NETBANKING).
                </div>
              )}
              {paymentMethod === "COD" && (
                <div className="space-y-3 pt-2 text-xs font-body text-on-surface-variant uppercase tracking-widest">
                  PAY CASH TO THE DELIVERY EXECUTIVE UPON RECEIVING YOUR PARCEL.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 bg-surface-container-low p-6 md:p-8 border border-outline-variant/40 space-y-6">
            <h2 className="font-display text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-4">
              ORDER SUMMARY ({items.length})
            </h2>

            {/* Selected Items */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-outline-variant/15 pb-3">
                  <div className="relative w-16 h-20 bg-surface-container shrink-0 overflow-hidden border border-outline-variant/30">
                    <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                    {item.artworkUrl && (
                      <img src={item.artworkUrl} alt="Logo" className="absolute inset-0 m-auto max-h-10 w-auto object-contain drop-shadow-sm" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-display text-xs font-bold text-on-surface line-clamp-1">{item.product?.name}</h3>
                    <p className="font-body text-[11px] text-on-surface-variant mt-0.5">SIZE: {item.size} | COLOR: {item.color}</p>
                    {item.printType !== "Standard" && (
                      <p className="font-body text-[10px] text-primary font-bold">{item.printType} ({item.printLocation})</p>
                    )}
                    <span className="font-body font-bold text-xs text-primary">₹{item.totalItemPrice?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="border-t border-outline-variant/30 pt-4 space-y-2 font-body text-xs text-on-surface-variant uppercase">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="font-bold text-on-surface">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-primary font-bold">
                  <span>DISCOUNT</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>EXPRESS DISPATCH</span>
                <span className="font-bold text-on-surface">₹{shipping}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-outline-variant/20 font-bold text-base text-on-surface">
                <span>TOTAL DUE</span>
                <span className="text-primary font-display text-xl">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primary text-white py-4 font-body text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-primary-container"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>AUTHORIZING TRANSACTION...</span>
                </>
              ) : (
                `CONFIRM & PAY (₹${grandTotal.toLocaleString("en-IN")})`
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
