import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://turf.localhostt.live/api";
const API_V1_BASE_URL = API_BASE_URL.endsWith('/v1') ? API_BASE_URL : `${API_BASE_URL}/v1`;
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const ALL_PRINT_TYPES = ["Screen Printing", "DTF Printing", "Sublimation", "Embroidery", "UV Printing"];

export default function AddProduct() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [hoverImageFile, setHoverImageFile] = useState(null);
  const [badge, setBadge] = useState("");
  const [specs, setSpecs] = useState("");
  const [availableSizes, setAvailableSizes] = useState(["S", "M", "L", "XL"]);
  const [allowedPrintTypes, setAllowedPrintTypes] = useState(["DTF Printing", "Screen Printing"]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_V1_BASE_URL}/categories`);
        const data = await res.json();
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
          setCategory(data.categories[0].name);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

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
    setSuccess(false);

    if (!name || !sku || !basePrice || !stockQuantity || !imageFile || !hoverImageFile) {
      setError("Please fill in all required fields, including both images.");
      return;
    }

    setLoading(true);
    try {
      // Upload main image
      const formData1 = new FormData();
      formData1.append("image", imageFile);
      const uploadRes1 = await fetch(`${API_BASE_URL}/v1/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData1,
      });
      const uploadData1 = await uploadRes1.json();
      if (!uploadRes1.ok) throw new Error(uploadData1.message || "Failed to upload image");

      // Upload hover image
      const formData2 = new FormData();
      formData2.append("image", hoverImageFile);
      const uploadRes2 = await fetch(`${API_BASE_URL}/v1/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData2,
      });
      const uploadData2 = await uploadRes2.json();
      if (!uploadRes2.ok) throw new Error(uploadData2.message || "Failed to upload hover image");

      const payload = {
        name,
        sku: sku.toUpperCase(),
        description: description || `${name} - Custom Merchandise`,
        category,
        price: Number(basePrice),
        stockQuantity: Number(stockQuantity),
        image: uploadData1.url,
        hoverImage: uploadData2.url,
        badge,
        sizes: availableSizes,
        specs: specs.split('\n').filter(s => s.trim() !== ""),
        allowedPrintTypes,
      };

      const res = await fetch(`${API_BASE_URL}/v1/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create product");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Add New Merchandise Product | MerchStudio"
        description="Add a new custom product to the merchandise store catalog"
      />
      <PageBreadcrumb pageTitle="Add New Product" />

      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 p-6 md:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Create New Merchandise Item
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Add products with SKU, base price, inventory stock, and print customizations.
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
          >
            ← Back to Catalog
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-xs text-red-700 bg-red-100 border border-red-200 rounded-lg dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-6 text-xs text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-lg dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50">
            ✅ Product created successfully! Redirecting to products list...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                placeholder="e.g. Custom Cotton Polo T-Shirt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                SKU / Item Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                placeholder="e.g. TSHIRT-POLO-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={categoriesLoading}
              >
                {categoriesLoading ? (
                  <option>Loading categories...</option>
                ) : categories.length === 0 ? (
                  <option value="">No Categories Available</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Base Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                placeholder="499"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                placeholder="150"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Main Image (Cloudinary) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                onChange={(e) => setImageFile(e.target.files[0])}
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Hover Image (Cloudinary) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                onChange={(e) => setHoverImageFile(e.target.files[0])}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Badge
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. LIMITED / 50 PCS"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows="3"
                className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
                placeholder="Enter product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Specifications (One per line)
            </label>
            <textarea
              rows="4"
              className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500"
              placeholder="100% Organic Cotton&#10;Crafted in Mumbai&#10;Preshrunk"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
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
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition ${
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
            <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
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
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition ${
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

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="px-5 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-md transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Save & Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
