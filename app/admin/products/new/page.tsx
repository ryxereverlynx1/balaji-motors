"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { CategoryRecord } from "@/lib/db/types";
import { Loader2 } from "lucide-react";

export default function NewProductPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <AdminLayout>
      {isLoading ? (
        <div className="min-h-[60bvh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </AdminLayout>
  );
}
