"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { ProductRecord, CategoryRecord } from "@/lib/db/types";
import {
  Package,
  Search,
  Filter,
  Zap,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteModalProduct, setDeleteModalProduct] = useState<ProductRecord | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);

      if (prodsRes.ok && catsRes.ok) {
        const prodsData = await prodsRes.json();
        const catsData = await catsRes.json();
        setProducts(prodsData.products || []);
        setCategories(catsData.categories || []);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load products from server." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTogglePublish = async (prod: ProductRecord) => {
    setActionLoadingId(prod.id);
    const newStatus = prod.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/products/${prod.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...prod, status: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, status: newStatus } : p))
        );
        setMessage({
          type: "success",
          text: `Product "${prod.name}" marked as ${newStatus}.`,
        });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update product status." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (prod: ProductRecord) => {
    setActionLoadingId(prod.id);
    try {
      const res = await fetch(`/api/admin/products/${prod.id}/duplicate`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          setProducts((prev) => [data.product, ...prev]);
          setMessage({
            type: "success",
            text: `Duplicated "${prod.name}" as "${data.product.name}" (Draft).`,
          });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Failed to duplicate product." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalProduct) return;
    const id = deleteModalProduct.id;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setMessage({
          type: "success",
          text: `Product "${deleteModalProduct.name}" deleted successfully.`,
        });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete product." });
    } finally {
      setActionLoadingId(null);
      setDeleteModalProduct(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        p.name.toLowerCase().includes(q) ||
        (p.nameHi && p.nameHi.toLowerCase().includes(q)) ||
        p.slug.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCategory !== "all" && p.categoryId !== selectedCategory) {
      return false;
    }

    if (selectedStatus !== "all" && p.status !== selectedStatus) {
      return false;
    }

    if (featuredFilter === "featured" && !p.featured) {
      return false;
    }
    if (featuredFilter === "standard" && p.featured) {
      return false;
    }

    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-1">
              Vehicle Catalogue
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
              Product Management
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Add, edit, duplicate, and publish electric rickshaws and commercial loaders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="p-2 rounded bg-white hover:bg-brand-cream border border-brand-border text-brand-charcoal transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>+ Add Product</span>
            </Link>
          </div>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded flex items-center justify-between text-xs font-medium border ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <span>{message.text}</span>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="text-xs font-bold hover:underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-white border border-brand-border rounded-lg shadow-card p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by title, slug..."
                className="w-full pl-9 pr-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal placeholder-brand-muted/70 focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.nameHi ? `(${c.nameHi})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
              >
                <option value="all">All Featured & Standard</option>
                <option value="featured">Featured Only</option>
                <option value="standard">Standard Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-lg shadow-card overflow-hidden">
          <div className="px-5 py-3.5 bg-brand-warmWhite border-b border-brand-border flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-brand-charcoal">
              Showing {filteredProducts.length} of {products.length} Products
            </span>
            <span className="text-brand-muted">
              Click &quot;Publish&quot; to toggle live showroom status immediately.
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-red" />
              <div className="text-xs text-brand-muted font-bold">Loading product records...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-10 h-10 mx-auto text-brand-muted/40" />
              <div className="text-sm font-bold text-brand-charcoal">No products match your filters</div>
              <p className="text-xs text-brand-muted">Try clearing the search or category filters above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-warmWhite border-b border-brand-border text-brand-muted uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4 w-16">Image</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price Mode</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4">Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {filteredProducts.map((p) => {
                    const isBusy = actionLoadingId === p.id;
                    return (
                      <tr key={p.id} className="hover:bg-brand-cream/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-12 h-10 rounded border border-brand-border overflow-hidden bg-brand-warmWhite relative flex items-center justify-center">
                            {p.mainImage ? (
                              <Image
                                src={p.mainImage}
                                alt={p.name}
                                fill
                                className="object-contain p-0.5"
                                sizes="48px"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-brand-muted" />
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-brand-charcoal text-sm hover:text-brand-red transition-colors">
                            <Link href={`/admin/products/${p.id}/edit`}>{p.name}</Link>
                          </div>
                          {p.nameHi && (
                            <div className="text-[11px] text-brand-muted font-medium">{p.nameHi}</div>
                          )}
                          <div className="font-mono text-[10px] text-brand-muted mt-0.5">{p.slug}</div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-brand-charcoal">
                          {p.categoryName || "Passenger Vehicle"}
                        </td>

                        <td className="py-3 px-4">
                          {p.priceMode === "fixed_price" && typeof p.price === "number" ? (
                            <span className="font-bold text-brand-charcoal">
                              ₹{p.price.toLocaleString("en-IN")}
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-muted">
                              On Enquiry
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                              p.status === "published"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : p.status === "draft"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {p.featured ? (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-yellow/30 border border-brand-yellow/60 text-brand-charcoal"
                              title="Featured on Homepage"
                            >
                              <Star className="w-3 h-3 fill-brand-yellow text-amber-600" />
                              <span>Yes</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-brand-muted">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-brand-muted text-[11px]">
                          {new Date(p.updatedAt || p.createdAt).toLocaleDateString("en-IN")}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="p-1.5 rounded bg-white hover:bg-brand-cream border border-brand-border text-brand-charcoal transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            <Link
                              href={`/vehicles/${p.slug}?preview=true`}
                              target="_blank"
                              className="p-1.5 rounded bg-white hover:bg-brand-cream border border-brand-border text-brand-charcoal transition-colors cursor-pointer"
                              title="Preview Public Layout"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleTogglePublish(p)}
                              disabled={isBusy}
                              className={`p-1.5 rounded border transition-colors cursor-pointer disabled:opacity-50 ${
                                p.status === "published"
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                              }`}
                              title={p.status === "published" ? "Unpublish to Draft" : "Publish to Live Website"}
                            >
                              {p.status === "published" ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDuplicate(p)}
                              disabled={isBusy}
                              className="p-1.5 rounded bg-white hover:bg-brand-cream border border-brand-border text-brand-charcoal transition-colors cursor-pointer disabled:opacity-50"
                              title="Duplicate Vehicle"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteModalProduct(p)}
                              disabled={isBusy}
                              className="p-1.5 rounded bg-white hover:bg-red-50 border border-brand-border text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                              title="Delete Product"
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

        {deleteModalProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-brand-border shadow-elevated max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <h3 className="text-base font-bold text-brand-charcoal">Delete Vehicle</h3>
              </div>

              <p className="text-xs text-brand-muted leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="font-bold text-brand-charcoal">
                  &quot;{deleteModalProduct.name}&quot;
                </span>
                ? This action cannot be undone and will immediately remove this vehicle from the public
                showroom.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setDeleteModalProduct(null)}
                  className="px-4 py-2 rounded bg-brand-cream hover:bg-brand-border border border-brand-border text-xs font-bold uppercase tracking-wider text-brand-charcoal transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={actionLoadingId !== null}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoadingId !== null ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}