import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import ProductFormModal from "./ProductFormModal";
import { PencilIcon, TrashBinIcon } from "../../icons";

export default function ProductListTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { token, user } = useAuth();
  const isAdmin = user && user.role === "admin";

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/v1/products?";
      if (categoryFilter) url += `category=${encodeURIComponent(categoryFilter)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load products");
      }
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(`Delete Error: ${err.message}`);
    }
  };

  const handleSaveProduct = (savedProduct) => {
    fetchProducts();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 overflow-hidden shadow-xs">
      {/* Header Controls */}
      <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Merchandise Product Catalog
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage custom apparel, accessories, and print settings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search product, SKU..."
              className="w-full px-3 py-2 text-xs border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="px-3 py-2 text-xs font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <select
            className="px-3 py-2 text-xs border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Hoodies">Hoodies</option>
            <option value="Caps">Caps</option>
            <option value="Mugs">Mugs</option>
            <option value="Bottles">Bottles</option>
            <option value="Tote Bags">Tote Bags</option>
            <option value="Stickers">Stickers</option>
          </select>

          {/* Add Product Button */}
          <Link
            to="/products/add"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-xs transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 m-4 text-xs text-red-700 bg-red-100 border border-red-200 rounded-lg dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 dark:bg-gray-800/40 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
              <th className="px-5 py-3.5">Product</th>
              <th className="px-4 py-3.5">SKU</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Stock</th>
              <th className="px-4 py-3.5">Print Types</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="inline-flex items-center gap-2 text-xs font-medium">
                    <svg className="w-4 h-4 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Loading merchandise catalog...
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-500 dark:text-gray-400 text-xs">
                  No merchandise products found matching your filter.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"}
                        alt={p.name}
                        className="w-11 h-11 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-xs leading-snug">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate max-w-xs">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs font-medium text-gray-600 dark:text-gray-400">
                    {p.sku}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 dark:text-white text-xs">
                    ₹{(p.price ?? p.basePrice ?? 0).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-4">
                    {p.stockQuantity > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-100 rounded-full dark:bg-emerald-950/60 dark:text-emerald-300">
                        <span className="w-1.5 h-1.5 mr-1 rounded-full bg-emerald-500"></span>
                        {p.stockQuantity} in stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-red-700 bg-red-100 rounded-full dark:bg-red-950/60 dark:text-red-300">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.allowedPrintTypes && p.allowedPrintTypes.map((pt) => (
                        <span
                          key={pt}
                          className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded dark:bg-gray-800 dark:text-gray-300"
                        >
                          {pt}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        title="Edit Product"
                        aria-label="Edit Product"
                        className="inline-flex items-center justify-center p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id, p.name)}
                        title="Delete Product"
                        aria-label="Delete Product"
                        className="inline-flex items-center justify-center p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60 transition"
                      >
                        <TrashBinIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        token={token}
      />
    </div>
  );
}
