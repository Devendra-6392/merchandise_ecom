"use client";

import { useEffect } from "react";

export default function InvoiceModal({ isOpen, onClose, order }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const isDelivered = (order.currentStatus || "").toLowerCase() === "delivered";
  const docTitle = isDelivered ? "OFFICIAL TAX INVOICE" : "ORDER CONFIRMATION RECEIPT";
  const docNumber = isDelivered
    ? `INV-${(order.orderNumber || "89241").replace("ORD-", "")}`
    : `REC-${(order.orderNumber || "89241").replace("ORD-", "")}`;

  const items = order.items || [];
  const billing = order.billingSummary || {};

  const subtotal = billing.subtotal || items.reduce((acc, i) => acc + (i.totalItemPrice || i.unitPrice * i.quantity), 0);
  const taxAmount = billing.taxAmount || Math.round(subtotal * 0.18);
  const shippingCharge = billing.shippingCharge !== undefined ? billing.shippingCharge : 150;
  const discountAmount = billing.discountAmount || 0;
  const grandTotal = billing.grandTotal || (subtotal + taxAmount + shippingCharge - discountAmount);

  // Helper to convert number to words (Indian Currency)
  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(n) {
      if ((n = n.toString()).length > 9) return 'overflow';
      let n_array = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n_array) return '';
      let str = '';
      str += (n_array[1] != 0) ? (a[Number(n_array[1])] || b[n_array[1][0]] + ' ' + a[n_array[1][1]]) + 'Crore ' : '';
      str += (n_array[2] != 0) ? (a[Number(n_array[2])] || b[n_array[2][0]] + ' ' + a[n_array[2][1]]) + 'Lakh ' : '';
      str += (n_array[3] != 0) ? (a[Number(n_array[3])] || b[n_array[3][0]] + ' ' + a[n_array[3][1]]) + 'Thousand ' : '';
      str += (n_array[4] != 0) ? (a[Number(n_array[4])] || b[n_array[4][0]] + ' ' + a[n_array[4][1]]) + 'Hundred ' : '';
      str += (n_array[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n_array[5])] || b[n_array[5][0]] + ' ' + a[n_array[5][1]]) + 'Rupees Only' : 'Rupees Only';
      return str;
    }
    return inWords(num);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatAddress = (addr) => {
    if (!addr) return "Flat 402, Virasat Residency, Bandra West, Mumbai, Maharashtra 400050, India";
    if (typeof addr === "string") return addr;
    return [addr.street, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean).join(", ");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white print:static print:block">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Container */}
      <div
        id="printable-invoice"
        className="relative w-full max-w-4xl bg-white text-neutral-900 rounded-none shadow-2xl border border-neutral-300 p-8 md:p-12 space-y-8 my-8 print:my-0 print:border-none print:shadow-none"
      >
        {/* Modal Top Control Bar (Hidden on Print) */}
        <div className="no-print flex justify-between items-center border-b border-neutral-200 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest ${isDelivered ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-900 border border-amber-300"}`}>
              {isDelivered ? "✓ OFFICIAL TAX INVOICE RELEASED" : "● ORDER CONFIRMATION RECEIPT"}
            </span>
            {!isDelivered && (
              <span className="text-xs text-neutral-500 italic hidden sm:inline">
                (Tax Invoice unlocks automatically upon delivery)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="bg-neutral-900 text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-900 material-symbols-outlined text-2xl cursor-pointer"
            >
              close
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-neutral-900 pb-6 gap-6">
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-extrabold tracking-tighter text-neutral-900 uppercase">
              VIRASAT ATELIER
            </h1>
            <p className="text-[11px] text-neutral-600 font-mono tracking-wider uppercase">
              VIRASAT ATELIER LUXURY INDIA PVT LTD
            </p>
            <p className="text-[11px] text-neutral-500 max-w-sm leading-tight">
              Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051<br />
              GSTIN: <span className="font-mono font-bold text-neutral-900">27AAACV9842K1Z5</span> | PAN: AAACT9842K
            </p>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="inline-block bg-neutral-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-2">
              {docTitle}
            </div>
            <p className="text-sm font-mono font-bold text-neutral-900">{docNumber}</p>
            <p className="text-xs text-neutral-600">
              DATE: <span className="font-semibold text-neutral-900">{new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</span>
            </p>
            <p className="text-xs text-neutral-600">
              ORDER NO: <span className="font-mono font-bold text-neutral-900">{order.orderNumber || "ORD-89241"}</span>
            </p>
            <p className="text-xs text-neutral-600">
              PAYMENT METHOD: <span className="font-bold text-neutral-900 uppercase">{order.paymentDetails?.gateway || "Cash On Delivery"}</span>
            </p>
          </div>
        </div>

        {/* Customer & Shipping Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs bg-neutral-50 p-6 border border-neutral-200">
          <div className="space-y-1.5">
            <span className="font-bold uppercase text-neutral-400 tracking-wider block text-[10px]">BILLED TO / CUSTOMER</span>
            <p className="font-bold text-sm text-neutral-900 uppercase">{order.customer?.name || order.shippingAddress?.name || "DEVENDRA YADAV"}</p>
            <p className="text-neutral-600">Email: {order.customer?.email || order.shippingAddress?.email || "customer@example.com"}</p>
            <p className="text-neutral-600">Phone: {order.customer?.phone || order.shippingAddress?.phone || "+91 98765 43210"}</p>
            <p className="text-neutral-600 pt-1">POS Code: 27 (Maharashtra, India)</p>
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6">
            <span className="font-bold uppercase text-neutral-400 tracking-wider block text-[10px]">SHIPPED TO / DESTINATION</span>
            <p className="font-bold text-sm text-neutral-900 uppercase">{order.shippingAddress?.name || "DEVENDRA YADAV"}</p>
            <p className="text-neutral-700 leading-relaxed font-medium">{formatAddress(order.shippingAddress)}</p>
            <p className="text-neutral-600 pt-1">Courier: <span className="font-bold text-neutral-900">{order.shippingDetails?.courierName || "DELHIVERY EXPRESS (INSURED)"}</span></p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-neutral-300">
            <thead>
              <tr className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider">
                <th className="p-3 border-r border-neutral-700">#</th>
                <th className="p-3 border-r border-neutral-700">Garment Specification & Craft</th>
                <th className="p-3 border-r border-neutral-700 text-center">HSN</th>
                <th className="p-3 border-r border-neutral-700 text-center">Qty</th>
                <th className="p-3 border-r border-neutral-700 text-right">Unit Price (₹)</th>
                <th className="p-3 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-xs">
              {items.length > 0 ? (
                items.map((item, idx) => {
                  const qty = Number(item.quantity || 1);
                  const price = Number(item.unitPrice || item.price || 0);
                  const itemTotal = Number(item.totalItemPrice || price * qty);

                  return (
                    <tr key={idx} className="hover:bg-neutral-50 font-body">
                      <td className="p-3 font-mono font-bold text-neutral-400 border-r border-neutral-200 text-center">{idx + 1}</td>
                      <td className="p-3 border-r border-neutral-200">
                        <p className="font-bold text-neutral-900 uppercase">{item.productName}</p>
                        <p className="text-[11px] text-neutral-600">
                          Size: <span className="font-semibold">{item.selectedSize}</span> | Color: <span className="font-semibold">{item.selectedColor || "Standard"}</span>
                        </p>
                        {item.selectedPrintType && item.selectedPrintType !== "Standard" && (
                          <p className="text-[10px] font-semibold text-neutral-800">
                            Craft: {item.selectedPrintType} ({item.printLocation || "Front"})
                          </p>
                        )}
                      </td>
                      <td className="p-3 border-r border-neutral-200 text-center font-mono text-[11px]">61091000</td>
                      <td className="p-3 border-r border-neutral-200 text-center font-bold">{qty}</td>
                      <td className="p-3 border-r border-neutral-200 text-right font-mono">₹{price.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right font-mono font-bold text-neutral-900">₹{itemTotal.toLocaleString("en-IN")}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-neutral-500 uppercase text-xs">
                    No Item Specifications Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Summary & Words Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
          {/* Amount In Words & Declaration */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-neutral-100 p-4 border border-neutral-200 space-y-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase block tracking-wider">AMOUNT IN WORDS</span>
              <p className="text-xs font-bold text-neutral-900 italic">
                {numberToWords(grandTotal)}
              </p>
            </div>

            <div className="border border-neutral-200 p-4 space-y-2 text-[10px] text-neutral-500 leading-relaxed">
              <p className="font-bold text-neutral-800 uppercase">DECLARATION & TERMS:</p>
              <p>1. We declare that this invoice shows the actual price of the luxury merchandise described and that all particulars are true and correct.</p>
              <p>2. Tax payable on reverse charge: NO. Subject to Mumbai Jurisdiction only.</p>
            </div>
          </div>

          {/* Billing Summary Box */}
          <div className="md:col-span-5 bg-neutral-900 text-white p-5 space-y-3 font-body text-xs">
            <div className="flex justify-between text-neutral-300">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>CGST (9%):</span>
              <span className="font-mono">₹{Math.round(taxAmount / 2).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-neutral-300 text-[11px]">
              <span>SGST (9%):</span>
              <span className="font-mono">₹{Math.round(taxAmount / 2).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-neutral-300">
              <span>Shipping & Delivery Fee:</span>
              <span className="font-mono">₹{shippingCharge.toLocaleString("en-IN")}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount Applied:</span>
                <span className="font-mono">-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-neutral-700 text-base font-bold text-white">
              <span>GRAND TOTAL:</span>
              <span className="font-mono text-emerald-400">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Footer Signature & Verification Stamp */}
        <div className="border-t-2 border-neutral-900 pt-6 flex flex-col sm:flex-row justify-between items-end gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-neutral-900 text-white flex flex-col items-center justify-center p-2 text-center border border-neutral-900">
              <span className="material-symbols-outlined text-xl">qr_code_2</span>
              <span className="text-[8px] font-mono tracking-tighter">VERIFIED</span>
            </div>
            <div className="text-[10px] text-neutral-500 space-y-0.5">
              <p className="font-bold text-neutral-800 uppercase">VIRASAT DIGITAL VERIFICATION</p>
              <p>Digitally Signed Document — Valid Without Physical Seal</p>
              <p>Authenticity Hash: <span className="font-mono text-neutral-700">#VIRASAT-{docNumber}-VERIFIED</span></p>
            </div>
          </div>

          <div className="text-right space-y-4">
            <div className="border-b border-neutral-400 pb-1 w-48 ml-auto">
              <span className="font-display italic text-sm text-neutral-800 font-bold block">Devendra Yadav</span>
            </div>
            <p className="text-[10px] font-bold text-neutral-900 uppercase tracking-wider">
              AUTHORISED SIGNATORY — VIRASAT ATELIER
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
