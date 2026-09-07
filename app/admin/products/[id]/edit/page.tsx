"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { ProductRecord, CategoryRecord } from "@/lib/db/types";
import { Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [prodRes, catsRes] = await Promise.all([
          fetch(`/api/admin/products/${id}`),
          fetch("/api/admin/categories"),
        ]);

        if (!prodRes.ok) {
          throw new Error("Vehicle record not found on the server.");
        }

        const prodData = await prodRes.json();
        const catsData = await catsRes.json();

        setProduct(prodData.product || null);
        setCategories(catsData.categories || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load vehicle.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  return (
    <AdminLayout>
      {isLoading ? (
        <div className="min-h-[60bvh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
        </div>
      ) : error || !product ? (
        <div className="max-w-lg mx-auto p-6 min-h-[50bvh] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-brand-red flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-lg font-black text-brand-charcoal mb-2">
            Vehicle Record Not Found
          </h1>
          <p className="text-xs text-brand-muted mb-6">
            {error || "The requested vehicle ID does not exist in the Balaji Motors database."}
          </p>
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-brand-charcoal text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products Catalogue</span>
          </Link>
        </div>
      ) : (
        <ProductForm initialProduct={product} categories={categories} isEdit />
      )}
    </AdminLayout>
  );
}
