"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductRecord, CategoryRecord, SpecificationItem, PriceMode, ProductStatus } from "@/lib/db/types";
import { defaultSpecificationTemplates } from "@/lib/db/seed";
import {
  Package,
  Upload,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Star,
  Check,
  Eye,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Layers,
  Zap,
  DollarSign,
  Settings,
  Globe,
  Sliders,
  Save,
} from "lucide-react";

interface ProductFormProps {
  initialProduct?: ProductRecord | null;
  categories: CategoryRecord[];
  isEdit?: boolean;
}

export default function ProductForm({
  initialProduct,
  categories,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialProduct?.name || "");
  const [nameHi, setNameHi] = useState(initialProduct?.nameHi || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [isSlugCustomized, setIsSlugCustomized] = useState(isEdit);
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || (categories.length > 0 ? categories[0].id : "cat_passenger")
  );

  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [shortDescriptionHi, setShortDescriptionHi] = useState(initialProduct?.shortDescriptionHi || "");
  const [fullDescription, setFullDescription] = useState(initialProduct?.fullDescription || "");
  const [fullDescriptionHi, setFullDescriptionHi] = useState(initialProduct?.fullDescriptionHi || "");

  const [mainImage, setMainImage] = useState(initialProduct?.mainImage || "/images/rickshaw-red.webp");
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialProduct?.galleryImages && initialProduct.galleryImages.length > 0
      ? initialProduct.galleryImages
      : ["/images/rickshaw-red.webp"]
  );

  const [priceMode, setPriceMode] = useState<PriceMode>(initialProduct?.priceMode || "on_enquiry");
  const [price, setPrice] = useState<number | "">(
    typeof initialProduct?.price === "number" ? initialProduct.price : ""
  );
  const [currency, setCurrency] = useState(initialProduct?.currency || "INR");

  const buildInitialSpecs = (): SpecificationItem[] => {
    if (initialProduct?.specifications && initialProduct.specifications.length > 0) {
      return initialProduct.specifications;
    }
    return defaultSpecificationTemplates.map((tmpl, idx) => ({
      id: `spec_new_${idx + 1}`,
      productId: "",
      label: tmpl.label,
      labelHi: tmpl.labelHi,
      value: tmpl.defaultValue,
      valueHi: tmpl.defaultValueHi,
      icon: tmpl.icon,
      displayOrder: tmpl.displayOrder,
    }));
  };

  const [specifications, setSpecifications] = useState<SpecificationItem[]>(buildInitialSpecs());
  const [featured, setFeatured] = useState<boolean>(initialProduct?.featured || false);
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || "draft");
  const [displayOrder, setDisplayOrder] = useState<number>(
    typeof initialProduct?.displayOrder === "number" ? initialProduct.displayOrder : 1
  );
  const [model3dUrl, setModel3dUrl] = useState<string>(initialProduct?.model3dUrl || "");

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSlugCustomized && name.trim()) {
      const generated = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generated);
    }
  }, [name, isSlugCustomized]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `Upload failed for ${file.name}`);
        }

        const data = await res.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        if (!mainImage || mainImage === "/images/rickshaw-red.webp") {
          setMainImage(uploadedUrls[0]);
        }
        setGalleryImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Image upload failed";
      setError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSetMainImage = (url: string) => {
    setMainImage(url);
    if (!galleryImages.includes(url)) {
      setGalleryImages((prev) => [url, ...prev]);
    }
  };

  const handleRemoveGalleryImage = (url: string) => {
    const updated = galleryImages.filter((img) => img !== url);
    setGalleryImages(updated);
    if (mainImage === url) {
      setMainImage(updated.length > 0 ? updated[0] : "");
    }
  };

  const handleAddCustomSpecification = () => {
    const newSpec: SpecificationItem = {
      id: `spec_custom_${Date.now()}`,
      productId: initialProduct?.id || "",
      label: "New Specification",
      labelHi: "नई विशिष्टता",
      value: "Standard Commercial Spec",
      valueHi: "मानक व्यावसायिक विवरण",
      icon: "layers",
      displayOrder: specifications.length + 1,
    };
    setSpecifications([...specifications, newSpec]);
  };

  const handleAddSpec = handleAddCustomSpecification;

  const handleResetToDefaults = () => {
    setSpecifications(
      defaultSpecificationTemplates.map((tmpl, idx) => ({
        id: `spec_default_${idx + 1}`,
        productId: initialProduct?.id || "",
        label: tmpl.label,
        labelHi: tmpl.labelHi,
        value: tmpl.defaultValue,
        valueHi: tmpl.defaultValueHi,
        icon: tmpl.icon,
        displayOrder: tmpl.displayOrder,
      }))
    );
  };

  const handleUpdateSpec = (idx: number, field: keyof SpecificationItem, val: string) => {
    const updated = [...specifications];
    updated[idx] = { ...updated[idx], [field]: val };
    setSpecifications(updated);
  };

  const handleDeleteSpec = (idx: number) => {
    const updated = specifications.filter((_, i) => i !== idx);
    setSpecifications(updated);
  };

  const handleMoveSpec = (idx: number, direction: "up" | "down") => {
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === specifications.length - 1)) {
      return;
    }
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...specifications];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((s, i) => {
      s.displayOrder = i + 1;
    });
    setSpecifications(updated);
  };
  const handleSave = async (overrideStatus?: ProductStatus) => {
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Please enter a product name.");
      return;
    }

    if (!slug.trim()) {
      setError("Please enter a valid URL slug.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!shortDescription.trim()) {
      setError("Please enter a short description.");
      return;
    }

    if (priceMode === "fixed_price" && (price === "" || isNaN(Number(price)))) {
      setError("Please enter a valid numeric price for Fixed Price mode.");
      return;
    }

    setIsSaving(true);

    const payload = {
      name: name.trim(),
      nameHi: nameHi.trim() || undefined,
      slug: slug.trim().toLowerCase(),
      categoryId,
      shortDescription: shortDescription.trim(),
      shortDescriptionHi: shortDescriptionHi.trim() || undefined,
      fullDescription: fullDescription.trim(),
      fullDescriptionHi: fullDescriptionHi.trim() || undefined,
      mainImage: mainImage || (galleryImages[0] || "/images/rickshaw-red.webp"),
      galleryImages: galleryImages.length > 0 ? galleryImages : [mainImage || "/images/rickshaw-red.webp"],
      priceMode,
      price: priceMode === "fixed_price" ? Number(price) : null,
      currency,
      featured,
      status: overrideStatus || status,
      displayOrder: Number(displayOrder) || 1,
      model3dUrl: model3dUrl.trim() || null,
      specifications,
    };

    try {
      const url = isEdit && initialProduct
        ? `/api/admin/products/${initialProduct.id}`
        : "/api/admin/products";

      const method = isEdit && initialProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product record.");
      }

      setSuccess(
        isEdit
          ? `Product "${data.product.name}" updated successfully!`
          : `Product "${data.product.name}" created successfully!`
      );

      if (!isEdit && data.product?.id) {
        setTimeout(() => {
          router.push(`/admin/products/${data.product.id}/edit`);
        }, 800);
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving product";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded bg-white hover:bg-brand-cream border border-brand-border text-brand-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-0.5">
              {isEdit ? "Update Vehicle Record" : "New Vehicle Record"}
            </div>
            <h1 className="text-2xl font-black text-brand-charcoal tracking-tight">
              {name || "Untitled Vehicle"}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {slug && (
            <Link
              href={`/vehicles/${slug}?preview=true`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-white hover:bg-brand-cream border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Preview</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="px-4 py-2 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>Publish Vehicle</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <div>
            <div className="font-bold">Validation or Save Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div className="font-bold">{success}</div>
        </div>
      )}

      <div className="bg-white border border-brand-border rounded-lg shadow-card p-6 space-y-6">
        <div className="border-b border-brand-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-red" />
              <span>Section 1 — Basic Information</span>
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Public commercial titles, classification, and vehicle descriptions.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-muted">
            Step 1 of 5
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
              Product Name (English) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BAXY Super King E-Rickshaw"
              className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-sm font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
              Product Name (Hindi)
            </label>
            <input
              type="text"
              value={nameHi}
              onChange={(e) => setNameHi(e.target.value)}
              placeholder="e.g. बैक्सी सुपर किंग ई-रिक्शा"
              className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-sm font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
              URL Slug *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setIsSlugCustomized(true);
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                }}
                placeholder="baxy-super-king-passenger"
                className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-mono text-brand-charcoal focus:outline-none focus:border-brand-red"
              />
            </div>
            <p className="text-[11px] text-brand-muted mt-1">
              Public URL: <span className="font-mono">/vehicles/{slug || "slug"}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
              Vehicle Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-bold text-brand-charcoal focus:outline-none focus:border-brand-red"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.nameHi ? `(${c.nameHi})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
              Short Description (English) *
            </label>
            <textarea
              rows={3}
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief summary for product cards and search results..."
              className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
              Short Description (Hindi)
            </label>
            <textarea
              rows={3}
              value={shortDescriptionHi}
              onChange={(e) => setShortDescriptionHi(e.target.value)}
              placeholder="कार्ड और सर्च के लिए संक्षिप्त विवरण..."
              className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
              Full Commercial Description (English)
            </label>
            <textarea
              rows={4}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="Detailed engineering and commercial transit capabilities..."
              className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
              Full Commercial Description (Hindi)
            </label>
            <textarea
              rows={4}
              value={fullDescriptionHi}
              onChange={(e) => setFullDescriptionHi(e.target.value)}
              placeholder="विस्तृत व्यावसायिक व तकनीकी विवरण..."
              className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>
      </div>
      <div className="bg-white border border-brand-border rounded-lg shadow-card p-6 space-y-6">
        <div className="border-b border-brand-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-red" />
              <span>Section 2 — Images & Gallery</span>
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Main product showcase photograph and supplementary showroom gallery images.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-muted">
            Step 2 of 5
          </span>
        </div>

        <div className="border-2 border-dashed border-brand-border rounded-lg p-6 text-center hover:border-brand-red/60 transition-colors bg-brand-warmWhite/50">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileUpload}
            className="hidden"
            id="product-image-uploader"
          />
          <label
            htmlFor="product-image-uploader"
            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-brand-border flex items-center justify-center text-brand-red shadow-xs">
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
            </div>
            <div className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
              {isUploading ? "Uploading & Verifying Security..." : "Click to Upload Product Photographs"}
            </div>
            <p className="text-[11px] text-brand-muted">
              Supported formats: JPEG, PNG, WebP, AVIF. Maximum size: 5 MB per image.
            </p>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-3">
            Product Gallery & Showcase Images ({galleryImages.length})
          </label>

          {galleryImages.length === 0 ? (
            <div className="text-center py-6 text-xs text-brand-muted bg-brand-warmWhite rounded border border-brand-border">
              No images uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {galleryImages.map((imgUrl, idx) => {
                const isMain = mainImage === imgUrl;
                return (
                  <div
                    key={idx}
                    className={`relative group rounded-lg border overflow-hidden p-2 flex flex-col justify-between bg-brand-warmWhite ${
                      isMain ? "border-brand-red ring-2 ring-brand-red/30 bg-red-50/20" : "border-brand-border"
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-white border border-brand-border/40">
                      <Image
                        src={imgUrl}
                        alt={`Vehicle image ${idx + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="180px"
                      />
                      {isMain && (
                        <div className="absolute top-1.5 left-1.5 z-10">
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-red text-white shadow-xs">
                            Main Image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-brand-border/60 flex items-center justify-between text-[11px]">
                      {!isMain ? (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(imgUrl)}
                          className="text-[10px] font-bold text-brand-charcoal hover:text-brand-red uppercase cursor-pointer"
                        >
                          Set as Main
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-brand-red uppercase">Selected</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(imgUrl)}
                        className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-lg shadow-card p-6 space-y-6">
        <div className="border-b border-brand-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-red" />
              <span>Section 3 — Commercial Pricing</span>
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Configure price mode between &quot;On Enquiry&quot; and exact fixed ex-showroom price.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-muted">
            Step 3 of 5
          </span>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal">
            Price Display Mode *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPriceMode("on_enquiry")}
              className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                priceMode === "on_enquiry"
                  ? "border-brand-red bg-red-50/20 ring-2 ring-brand-red/20 shadow-xs"
                  : "border-brand-border bg-brand-warmWhite hover:bg-white"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${
                  priceMode === "on_enquiry" ? "border-brand-red bg-brand-red" : "border-brand-border"
                }`}
              >
                {priceMode === "on_enquiry" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-brand-charcoal">
                  ON ENQUIRY (Recommended)
                </div>
                <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">
                  Displays &quot;Price on Enquiry&quot; publicly. Customer requests custom battery quote
                  based on subsidy and loan terms.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPriceMode("fixed_price")}
              className={`p-4 rounded-lg border text-left flex items-start gap-3 transition-all cursor-pointer ${
                priceMode === "fixed_price"
                  ? "border-brand-red bg-red-50/20 ring-2 ring-brand-red/20 shadow-xs"
                  : "border-brand-border bg-brand-warmWhite hover:bg-white"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${
                  priceMode === "fixed_price" ? "border-brand-red bg-brand-red" : "border-brand-border"
                }`}
              >
                {priceMode === "fixed_price" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-brand-charcoal">
                  FIXED PRICE
                </div>
                <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">
                  Displays a concrete numeric ex-showroom price (e.g. ₹1,45,000) on cards and quote dossier.
                </p>
              </div>
            </button>
          </div>

          {priceMode === "fixed_price" && (
            <div className="p-4 rounded-lg bg-brand-cream/50 border border-brand-border grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
                  Ex-Showroom Price (INR) *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-brand-charcoal">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="145000"
                    className="w-full pl-8 pr-3 py-2 rounded bg-white border border-brand-border text-sm font-bold text-brand-charcoal focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
                  Currency Symbol
                </label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-white border border-brand-border text-xs font-bold text-brand-charcoal focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white border border-brand-border rounded-lg shadow-card p-6 space-y-6">
        <div className="border-b border-brand-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-red" />
              <span>Section 4 — Technical Specifications</span>
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              10 standard engineering parameters plus custom specifications. Reorder or edit values.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="px-2.5 py-1 text-[11px] font-bold text-brand-charcoal hover:text-brand-red border border-brand-border rounded hover:bg-brand-warmWhite transition-colors"
            >
              Reset 10 Defaults
            </button>
            <button
              type="button"
              onClick={handleAddSpec}
              className="px-2.5 py-1 text-[11px] font-bold text-white bg-brand-charcoal hover:bg-brand-red rounded transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Custom Spec</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {specifications.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-brand-border rounded bg-brand-cream/30">
              <p className="text-xs text-brand-muted">No specifications defined for this vehicle yet.</p>
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="mt-2 px-3 py-1.5 text-xs font-bold text-brand-red border border-brand-red rounded hover:bg-red-50"
              >
                Load 10 Standard Dealership Specs
              </button>
            </div>
          ) : (
            specifications.map((spec, idx) => (
              <div
                key={spec.id || idx}
                className="p-3.5 bg-brand-warmWhite/60 border border-brand-border rounded-lg space-y-2 hover:border-brand-charcoal/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-5 h-5 rounded-full bg-brand-cream border border-brand-border text-[10px] font-black text-brand-charcoal flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={spec.label}
                      onChange={(e) => handleUpdateSpec(idx, "label", e.target.value)}
                      placeholder="Specification Label (English)"
                      className="text-xs font-bold text-brand-charcoal bg-white px-2.5 py-1 rounded border border-brand-border focus:outline-none focus:border-brand-red w-48 sm:w-56"
                    />
                    <input
                      type="text"
                      value={spec.labelHi || ""}
                      onChange={(e) => handleUpdateSpec(idx, "labelHi", e.target.value)}
                      placeholder="লेবਲ (हिंदी)"
                      className="text-xs text-brand-charcoal bg-white px-2 py-1 rounded border border-brand-border focus:outline-none focus:border-brand-red w-36 sm:w-44"
                    />
                    <select
                      value={spec.category || "General"}
                      onChange={(e) => handleUpdateSpec(idx, "category", e.target.value)}
                      className="text-[11px] font-bold text-brand-charcoal bg-white px-2 py-1 rounded border border-brand-border focus:outline-none focus:border-brand-red"
                    >
                      <option value="Drivetrain">Drivetrain</option>
                      <option value="Battery">Battery</option>
                      <option value="Performance">Performance</option>
                      <option value="Chassis">Chassis</option>
                      <option value="General">General</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSpec(idx, "up")}
                      className="p-1 rounded text-brand-muted hover:text-brand-charcoal hover:bg-brand-cream disabled:opacity-30 disabled:pointer-events-none"
                      title="Move up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === specifications.length - 1}
                      onClick={() => handleMoveSpec(idx, "down")}
                      className="p-1 rounded text-brand-muted hover:text-brand-charcoal hover:bg-brand-cream disabled:opacity-30 disabled:pointer-events-none"
                      title="Move down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSpec(idx)}
                      className="p-1 rounded text-brand-muted hover:text-brand-red hover:bg-red-50"
                      title="Delete specification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-brand-border/40">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-0.5">
                      Value (English) *
                    </label>
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                      placeholder="e.g. 1200W High Torque"
                      className="w-full text-xs text-brand-charcoal bg-white px-2.5 py-1 rounded border border-brand-border focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-0.5">
                      Value (Hindi)
                    </label>
                    <input
                      type="text"
                      value={spec.valueHi || ""}
                      onChange={(e) => handleUpdateSpec(idx, "valueHi", e.target.value)}
                      placeholder="੢xा. 1200 ᤵाट हाई ञौर्क"
                      className="w-full text-xs text-brand-charcoal bg-white px-2.5 py-1 rounded border border-brand-border focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-muted mb-0.5">
                      Unit (Optional)
                    </label>
                    <input
                      type="text"
                      value={spec.unit || ""}
                      onChange={(e) => handleUpdateSpec(idx, "unit", e.target.value)}
                      placeholder="km, W, Hours, kg"
                      className="w-full text-xs text-brand-charcoal bg-white px-2.5 py-1 rounded border border-brand-border focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-lg shadow-card p-6 space-y-6">
        <div className="border-b border-brand-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-red" />
              <span>Section 5 — Website Settings & 3D Viewer</span>
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Publication visibility, homepage spotlight, sorting position, and interactive 3D model path.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-muted">
            Step 5 of 5
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-brand-warmWhite border border-brand-border">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-2">
              Publication Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              className="w-full px-3 py-2 rounded bg-white border border-brand-border text-xs font-bold text-brand-charcoal focus:outline-none focus:border-brand-red"
            >
              <option value="published">Published (Visible in Showroom)</option>
              <option value="draft">Draft (Hidden from Showroom)</option>
              <option value="archived">Archived (De-listed)</option>
            </select>
            <p className="text-[11px] text-brand-muted mt-2">
              Published products are immediately visible on showroom and accessible in the PDF quote generator.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-brand-warmWhite border border-brand-border">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-2">
              Showcase Position
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded bg-white border border-brand-border text-xs font-bold text-brand-charcoal focus:outline-none focus:border-brand-red"
            />
            <p className="text-[11px] text-brand-muted mt-2">
              Lower numbers appear first on the vehicle catalogue page. (e.g. 1 = top of showroom).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-brand-warmWhite border border-brand-border">
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-2">
              Homepage Featured Spotlight
            </label>
            <label className="flex items-center gap-3 cursor-pointer mt-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 5-4 text-brand-red rounded border-brand-border focus:ring-brand-red"
              />
              <span className="text-xs font-bold text-brand-charcoal">
                Feature on Balaji Motors Homepage
              </span>
            </label>
            <p className="text-[11px] text-brand-muted mt-2">
              Displays this vehicle in the prominent hero showcase section on the homepage.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-brand-border">
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5 flex items-center justify-between">
            <span>3D Model Asset Path (.glb format)</span>
            <span className="text-[11px] font-normal text-brand-muted lowercase">optional</span>
          </label>
          <input
            type="text"
            value={model3dUrl}
            onChange={(e) => setModel3dUrl(e.target.value)}
            placeholder="/models/rickshaw_clean.glb"
            className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-mono text-brand-charcoal focus:outline-none focus:border-brand-red"
          />
          <p className="text-[11px] text-brand-muted mt-1.5">
            Balaji Motors features an interactive 3D electric rickshaw viewer with exploded parts and colorway customizer. Leave empty to use the standard default 3D model asset.
          </p>
        </div>
      </div>


      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur border border-brand-border rounded-lg shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-brand-muted">
          <span className="w-2 h-2 rounded-full bg-brand-green" />
          <span>Single Source of Truth: Database Storage Engine Active</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => router.push("/admin/products")}
            className="w-full sm:w-auto text-center px-4 py-2 border border-brand-border text-brand-charcoal hover:bg-brand-warmWhite text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave("draft")}
            className="w-full sm:w-auto text-center px-4 py-2 border border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSave()}
            className="w-full sm:w-auto justify-center px-5 py-2 bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isEdit ? "Update Vehicle Record" : "Save & Publish Vehicle"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
