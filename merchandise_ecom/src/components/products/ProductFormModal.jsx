import { useEffect, useState } from "react";

const CATEGORIES = ["T-Shirts", "Hoodies", "Caps", "Mugs", "Bottles", "Tote Bags", "Stickers"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const ALL_PRINT_TYPES = ["Screen Printing", "DTF Printing", "Sublimation", "Embroidery", "UV Printing"];

export default function ProductFormModal({ isOpen, onClose, onSave, product = null, token }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("T-Shirts");
  const [basePrice, setBasePrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [availableSizes, setAvailableSizes] = useState(["S", "M", "L", "XL"]);
  const [allowedPrintTypes, setAllowedPrintTypes] = useState(["DTF Printing", "Screen Printing"]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSku(product.sku || "");
      setDescription(product.description || "");
      setCategory(product.category || "T-Shirts");
      setBasePrice(product.basePrice !== undefined ? product.basePrice : "");
      setStockQuantity(product.stockQuantity !== undefined ? product.stockQuantity : "");
      setImageUrl(product.images && product.images[0] ? product.images[0] : "");
      setAvailableSizes(product.availableSizes || ["S", "M", "L", "XL"]);
      setAllowedPrintTypes(product.allowedPrintTypes || ["DTF Printing"]);
    } else {
      setName("");
      setSku("");
      setDescription("");
      setCategory("T-Shirts");
      setBasePrice("");
      setStockQuantity("");
      setImageUrl("");
      setAvailableSizes(["S", "M", "L", "XL"]);
      setAllowedPrintTypes(["DTF Printing", "Screen Printing"]);
    }
    setError("");
  }, [product, isOpen]);

  if (!isOpen) return null;

  const toggleSize = (size) => {
    setAvailableSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const togglePrintType = (type) => {
    setAllowedPrintTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !sku || !basePrice || !stockQuantity) {
      setError("Please fill in all required fields (Name, SKU, Price, Stock).");
      return;
    }

    const payload = {
      name,
      sku: sku.toUpperCase(),
      description: description || `${name} - Custom Merchandise`,
      category,
      basePrice: Number(basePrice),
      stockQuantity: Number(stockQuantity),
      images: [imageUrl || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"],
      availableSizes,
      allowedPrintTypes,
    };

    setLoading(true);
    try {
      const url = product
        ? `/api/v1/products/${product._id}`
        : "/api/v1/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save product");
      }

      onSave(data.product);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {product ? "Edit Merchandise Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. Premium Fleece Hoodie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. HOODIE-FLE-002"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                Base Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                placeholder="599"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
                placeholder="100"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
              Image URL
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              rows="2"
              className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm"
              placeholder="Detailed product specs, material GSM, print capabilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => {
                const isSelected = availableSizes.includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition ${
                      isSelected
                        ? "bg-brand-500 text-white border-brand-500"
                        : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-xs font-semibold uppercase text-gray-700 dark:text-gray-300">
              Allowed Print Types
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_PRINT_TYPES.map((type) => {
                const isSelected = allowedPrintTypes.includes(type);
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => togglePrintType(type)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg border transition ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
