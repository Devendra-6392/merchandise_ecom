import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { EyeIcon } from "../../icons";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const { token } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/v1/admin/orders";
      if (statusFilter) url += `?status=${encodeURIComponent(statusFilter)}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load orders");
      }
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [statusFilter, token]);

  const getStatusColor = (status) => {
    const statusColors = {
      OrderPlaced: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      PaymentVerified: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      DesignApproved: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      PrintingInProgress: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      QualityCheck: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      Packed: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
      ShipmentCreated: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      Shipped: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
      OutForDelivery: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
      Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    };
    return statusColors[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  return (
    <>
      <PageMeta
        title="Manage Orders | MerchStudio"
        description="View and manage customer orders and their tracking status."
      />
      <PageBreadcrumb pageTitle="All Orders" />
      
      <div className="bg-white rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 overflow-hidden shadow-xs">
        <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Customer Orders
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Manage all orders placed on the website
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              className="px-3 py-2 text-xs border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="OrderPlaced">Order Placed</option>
              <option value="PaymentVerified">Payment Verified</option>
              <option value="DesignApproved">Design Approved</option>
              <option value="PrintingInProgress">Printing In Progress</option>
              <option value="QualityCheck">Quality Check</option>
              <option value="Packed">Packed</option>
              <option value="ShipmentCreated">Shipment Created</option>
              <option value="Shipped">Shipped</option>
              <option value="OutForDelivery">Out For Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 m-4 text-xs text-red-700 bg-red-100 border border-red-200 rounded-lg dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 dark:bg-gray-800/40 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Total</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="inline-flex items-center gap-2 text-xs font-medium">
                      <svg className="w-4 h-4 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 dark:text-gray-400 text-xs">
                    No orders found matching your filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                    <td className="px-5 py-4 font-mono text-xs font-medium text-gray-900 dark:text-white">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <div className="font-medium text-gray-900 dark:text-white">{order.customer?.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">{order.customer?.email}</div>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-900 dark:text-white text-xs">
                      ₹{order.billingSummary?.grandTotal}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${getStatusColor(order.currentStatus)}`}>
                        {order.currentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="inline-flex items-center justify-center p-2 text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 dark:bg-brand-950/40 dark:text-brand-300 dark:hover:bg-brand-900/60 transition"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
