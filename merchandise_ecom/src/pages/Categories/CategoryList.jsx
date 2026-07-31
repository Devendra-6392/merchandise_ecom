import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";

export default function CategoryList() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/categories");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch categories");
      }
      setCategories(data.categories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setAdding(true);
    try {
      const res = await fetch("/api/v1/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategoryName, description: newCategoryDesc })
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create category");
      }
      
      setNewCategoryName("");
      setNewCategoryDesc("");
      fetchCategories();
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/v1/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete category");
      }
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <PageMeta title="Manage Categories | MerchStudio" description="Manage product categories" />
      <PageBreadcrumb pageTitle="Categories" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Add Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  placeholder="e.g. OUTERWEAR"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  rows="3"
                  className="w-full px-3.5 py-2.5 border rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                  placeholder="Optional description"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={adding}
                className="w-full px-4 py-2 text-sm font-bold text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition disabled:opacity-50"
              >
                {adding ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Categories</h3>
            
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading categories...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No categories found. Add one to get started.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Description</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-2 font-semibold text-gray-900 dark:text-white">
                          {cat.name}
                        </td>
                        <td className="py-3 px-2 text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {cat.description || "—"}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 bg-red-50 hover:bg-red-100 rounded transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
