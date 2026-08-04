import React, { useEffect, useState } from "react";

const DEFAULT_LOW_STOCK = [
  {
    _id: "ls_1",
    name: "ORANGERED OVERSIZED MONOLITH HOODIE",
    sku: "HOOD-MONO-01",
    category: "Outerwear",
    basePrice: 2499,
    stockQuantity: 4,
  },
  {
    _id: "ls_2",
    name: "DECONSTRUCTED FLIGHT BOMBER JACKET",
    sku: "BOMB-FLGT-04",
    category: "Outerwear",
    basePrice: 4999,
    stockQuantity: 8,
  },
  {
    _id: "ls_3",
    name: "SIGNATURE MONOGRAM HEAVYWEIGHT TEE",
    sku: "TEE-MONO-06",
    category: "Tops",
    basePrice: 1299,
    stockQuantity: 12,
  },
];

export default function LowStockAlertTable() {
  const [products, setProducts] = useState(DEFAULT_LOW_STOCK);

  useEffect(() => {
    fetch(`https://turf.localhostt.live/api/v1/admin/dashboard/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.lowStockProducts?.length) {
          setProducts(data.lowStockProducts);
        }
      })
      .catch((err) => console.warn("Low stock fetch notice:", err.message));
  }, []);

  const handleRestock = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, stockQuantity: p.stockQuantity + 25 } : p))
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3 dark:border-gray-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
            Inventory Alert
          </span>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
            Low Stock Products ({products.length})
          </h3>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full">
          Threshold: ≤ 20 Units
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 dark:border-gray-800 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">SKU</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3 text-center">Stock Level</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((item) => (
              <tr key={item._id || item.sku} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                <td className="py-3 px-3 font-semibold text-gray-800 dark:text-white/90">
                  {item.name}
                </td>
                <td className="py-3 px-3 font-mono text-gray-500 dark:text-gray-400">{item.sku || "SKU-001"}</td>
                <td className="py-3 px-3 text-gray-500 dark:text-gray-400 font-medium">{item.category}</td>
                <td className="py-3 px-3 font-bold text-gray-800 dark:text-white/90">
                  ₹{(item.basePrice || item.price || 0).toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-3 text-center font-bold text-rose-500">{item.stockQuantity || item.stock || 4}</td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleRestock(item._id)}
                    className="px-3 py-1.5 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 transition-colors"
                  >
                    + Restock (+25)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
