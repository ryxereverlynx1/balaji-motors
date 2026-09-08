"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { CategoryRecord, ProductRecord } from "@/lib/db/types";
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [formName, setFormName] = useState("");
  const [formNameHi, setFormNameHi] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDescriptionHi, setFormDescriptionHi] = useState("");
  const [formDisplayOrder, setFormDisplayOrder] = useState(1);
  const [formEnabled, setFormEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteCategory, setDeleteCategory] = useState<CategoryRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/products"),
      ]);
      if (catsRes.ok && prodsRes.ok) {
        const catsData = await catsRes.json();
        const prodsData = await prodsRes.json();
        setCategories(catsData.categories || []);
        setProducts(prodsData.products || []);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load categories from database." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormNameHi("");
    setFormSlug("");
    setFormDescription("");
    setFormDescriptionHi("");
    setFormDisplayOrder(categories.length + 1);
    setFormEnabled(true);
    setShowModal(true);
  };

  const openEditModal = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormNameHi(cat.nameHi || "");
    setFormSlug(cat.slug);
    setFormDescription(cat.description || "");
    setFormDescriptionHi(cat.descriptionHi || "");
    setFormDisplayOrder(cat.displayOrder);
    setFormEnabled(cat.enabled);
    setShowModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) return;

    setIsSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        nameHi: formNameHi.trim() || undefined,
        slug: formSlug.trim().toLowerCase(),
        description: formDescription.trim() || undefined,
        descriptionHi: formDescriptionHi.trim() || undefined,
        displayOrder: Number(formDisplayOrder) || 1,
        enabled: formEnabled,
      };

      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      setMessage({
        type: "success",
        text: editingCategory ? "Category updated successfully." : "New category created successfully.",
      });
      setShowModal(false);
      await loadData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving category",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (cat: CategoryRecord) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !cat.enabled }),
      });

      if (res.ok) {
        setCategories(
          categories.map((c) => (c.id === cat.id ? { ...c, enabled: !c.enabled } : c))
        );
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update category status." });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteCategory.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setMessage({ type: "success", text: "Category deleted successfully." });
      setDeleteCategory(null);
      await loadData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error deleting category",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getProductCountForCategory = (catId: string) => {
    return products.filter((p) => p.categoryId === catId).length;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2.5">
              <FolderTree className="w-5 h-5 text-brand-red" />
              <span>Product Categories</span>
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Manage showroom segments, catalogue groupings, and display order.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              className="p-2 border border-brand-border rounded bg-white hover:bg-brand-warmWhite text-brand-muted hover:text-brand-charcoal"
              title="Refresh Categories"
            >
              <RefreshCw className={isLoading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="px-4 py-2 bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {message && (
          <div className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 text-xs font-bold ${message.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="text-brand-muted hover:text-brand-charcoal"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="bg-white border border-brand-border rounded-lg shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 p-4">
              <FolderTree className="w-8 h-8 text-brand-muted mx-auto mb-2" />
              <p className="text-xs font-bold text-brand-charcoal">No categories found</p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-3 px-4 py-2 bg-brand-red text-white text-xs font-bold rounded"
              >
                Create First Category
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-warmWhite border-b border-brand-border text-[10px] font-black uppercase tracking-wider text-brand-charcoal">
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-4">URL Slug</th>
                    <th className="py-3 px-4">Assigned Vehicles</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-xs">
                  {categories.map((cat) => {
                    const prodCount = getProductCountForCategory(cat.id);
                    return (
                      <tr key={cat.id} className="hover:bg-brand-warmWhite/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-muted">
                          #{cat.displayOrder}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-brand-charcoal">
                            {cat.name}
                          </div>
                          {cat.nameHi && (
                            <div className="text-[11px] text-brand-muted">
                              {cat.nameHi}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-brand-charcoal">
                          {cat.slug}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-[11px] font-bold text-brand-charcoal">
                            {prodCount} vehicles
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(cat)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cat.enabled
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {cat.enabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span>{cat.enabled ? "Active" : "Inactive"}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(cat)}
                              className="p-1.5 rounded border border-brand-border text-brand-charcoal hover:bg-brand-warmWhite"
                              title="Edit Category"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteCategory(cat)}
                              className="p-1.5 rounded border border-brand-border text-brand-muted hover:text-brand-red hover:bg-red-50"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-brand-border shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="p-5 border-b border-brand-border flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1 text-brand-muted hover:text-brand-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                    Category Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!editingCategory) {
                        setFormSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "-")
                            .replace(/-+/g, "-")
                        );
                      }
                    }}
                    placeholder="e.g. Electric Cargo Loader"
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-xs font-bold text-brand-charcoal focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                    Category Name (Hindi)
                  </label>
                  <input
                    type="text"
                    value={formNameHi}
                    onChange={(e) => setFormNameHi(e.target.value)}
                    placeholder="उदा. इलेक्ट्रिक कार्गो लोडर"
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. cargo-loader"
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-xs font-mono text-brand-charcoal focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                      Show Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formDisplayOrder}
                      onChange={(e) => setFormDisplayOrder(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-xs font-bold text-brand-charcoal focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                      Visibility
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        checked={formEnabled}
                        onChange={(e) => setFormEnabled(e.target.checked)}
                        className="w-4 h-4 text-brand-red rounded border-brand-border"
                      />
                      <span className="text-xs font-bold text-brand-charcoal">Active</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto text-center px-4 py-2 border border-brand-border text-xs font-bold uppercase tracking-wider text-brand-charcoal rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto justify-center px-5 py-2 bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{editingCategory ? "Update Category" : "Create Category"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteCategory && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-brand-border shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 text-brand-red mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-sm font-black uppercase tracking-wider text-brand-charcoal">
                  Delete Category?
                </h3>
              </div>

              <p className="text-xs text-brand-muted mb-4">
                Are you sure you want to delete the category <strong className="text-brand-charcoal">"{deleteCategory.name}"</strong>?
                {getProductCountForCategory(deleteCategory.id) > 0 && (
                  <span className="block mt-2 text-red-600 font-bold">
                    WARNING: There are {getProductCountForCategory(deleteCategory.id)} vehicle(s) assigned to this category.
                  </span>
                )}
              </p>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteCategory(null)}
                  className="w-full sm:w-auto text-center px-4 py-2 border border-brand-border text-xs font-bold uppercase tracking-wider text-brand-charcoal rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteCategory}
                  className="w-full sm:w-auto justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Delete Category</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
