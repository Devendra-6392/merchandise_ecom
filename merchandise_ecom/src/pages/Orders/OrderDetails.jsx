import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

const ORDER_STATUSES = [
  "OrderPlaced",
  "PaymentVerified",
  "DesignApproved",
  "PrintingInProgress",
  "QualityCheck",
  "Packed",
  "ShipmentCreated",
  "Shipped",
  "OutForDelivery",
  "Delivered",
  "Cancelled"
];

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load order");
      }
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && id) fetchOrder();
  }, [token, id]);

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Update order status to ${newStatus}?`)) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status");
      }
      
      // Refresh order data
      fetchOrder();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>{error || "Order not found"}</p>
        <Link to="/orders" className="text-brand-500 underline mt-4 inline-block">Back to Orders</Link>
      </div>
    );
  }

  const currentIndex = ORDER_STATUSES.indexOf(order.currentStatus);
  const nextStatus = currentIndex >= 0 && currentIndex < ORDER_STATUSES.length - 2 ? ORDER_STATUSES[currentIndex + 1] : null;

  return (
    <>
      <PageMeta title={`Order ${order.orderNumber} | MerchStudio`} description="Order details and management" />
      <PageBreadcrumb pageTitle={`Order ${order.orderNumber}`} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Details & Items */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Items Table */}
          <div className="bg-white rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 overflow-hidden shadow-xs p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Items Ordered</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3">Product</th>
                    <th className="py-3">Specs</th>
                    <th className="py-3">Qty</th>
                    <th className="py-3">Price</th>
                    <th className="py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                  {order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-4">
                        <div className="font-semibold text-gray-900 dark:text-white text-xs">{item.productName}</div>
                      </td>
                      <td className="py-4 text-xs text-gray-600 dark:text-gray-400">
                        {item.selectedSize} | {item.selectedColor} | {item.selectedPrintType}
                      </td>
                      <td className="py-4 text-xs">{item.quantity}</td>
                      <td className="py-4 text-xs">₹{item.unitPrice}</td>
                      <td className="py-4 text-xs text-right font-semibold">₹{item.totalItemPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <div className="w-64 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{order.billingSummary.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">₹{order.billingSummary.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold">₹{order.billingSummary.shippingCharge}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-800 text-base font-bold text-gray-900 dark:text-white">
                  <span>Grand Total:</span>
                  <span>₹{order.billingSummary.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Customer, Shipping, Status */}
        <div className="space-y-6">
          
          {/* Status Management */}
          <div className="bg-white rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 overflow-hidden shadow-xs p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tracking Status</h3>
            
            <div className="mb-6">
              <span className="block text-xs text-gray-500 mb-1">Current Status:</span>
              <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                {order.currentStatus}
              </span>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-1">
                  Update Order Status
                </label>
                <select
                  value={order.currentStatus}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={updating}
                  className="w-full px-3 py-2 text-sm border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-medium"
                >
                  {ORDER_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {nextStatus && (
                <button 
                  onClick={() => handleStatusUpdate(nextStatus)}
                  disabled={updating}
                  className="w-full py-2 px-4 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                >
                  Advance to: {nextStatus}
                </button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 overflow-hidden shadow-xs p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Customer & Shipping</h3>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-gray-500">Customer</span>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{order.customer?.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{order.customer?.email}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{order.customer?.phone}</div>
              </div>

              <div>
                <span className="block text-xs text-gray-500">Shipping Address</span>
                <div className="text-sm text-gray-900 dark:text-gray-300">
                  {order.shippingAddress?.name}<br/>
                  {order.shippingAddress?.street}<br/>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br/>
                  {order.shippingAddress?.country}<br/>
                  Phone: {order.shippingAddress?.phone}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
