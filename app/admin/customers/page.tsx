"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { CustomerStoryRecord, CustomerStatCard } from "@/lib/db/types";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Upload,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Languages,
  X,
  MapPin,
  Calendar,
  Sparkles,
  BarChart3,
  Hash,
} from "lucide-react";

export default function AdminCustomersPage() {
  const [activeTab, setActiveTab] = useState<"stories" | "stats">("stories");

  const [customers, setCustomers] = useState<CustomerStoryRecord[]>([]);
  const [stats, setStats] = useState<CustomerStatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerStoryRecord | null>(null);
  const [deleteModalCustomer, setDeleteModalCustomer] = useState<CustomerStoryRecord | null>(null);

  const [name, setName] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [location, setLocation] = useState("");
  const [locationHi, setLocationHi] = useState("");
  const [vehicleName, setVehicleName] = useState("Sargam Victor Passenger E-Rickshaw");
  const [vehicleNameHi, setVehicleNameHi] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryDateHi, setDeliveryDateHi] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [quote, setQuote] = useState("");
  const [quoteHi, setQuoteHi] = useState("");
  const [image, setImage] = useState("/images/SARGAM-VICTOR-BLUE-2.webp");
  const [featured, setFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);

  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<CustomerStatCard | null>(null);
  const [deleteModalStat, setDeleteModalStat] = useState<CustomerStatCard | null>(null);
  const [statValue, setStatValue] = useState("");
  const [statValueHi, setStatValueHi] = useState("");
  const [statTitle, setStatTitle] = useState("");
  const [statTitleHi, setStatTitleHi] = useState("");
  const [statDesc, setStatDesc] = useState("");
  const [statDescHi, setStatDescHi] = useState("");
  const [statOrder, setStatOrder] = useState<number>(1);
  const [isSavingStat, setIsSavingStat] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resCust, resStats] = await Promise.all([
        fetch("/api/admin/customers"),
        fetch("/api/admin/customer-stats"),
      ]);
      if (resCust.ok) {
        const data = await resCust.json();
        setCustomers(data.customers || []);
      }
      if (resStats.ok) {
        const dataStats = await resStats.json();
        setStats(dataStats.stats || []);
      }
    } catch {
      setMessage({ type: "error", text: "Network error loading customer data." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateStatModal = () => {
    setEditingStat(null);
    setStatValue("");
    setStatValueHi("");
    setStatTitle("");
    setStatTitleHi("");
    setStatDesc("");
    setStatDescHi("");
    setStatOrder(stats.length + 1);
    setIsStatModalOpen(true);
  };

  const openEditStatModal = (st: CustomerStatCard) => {
    setEditingStat(st);
    setStatValue(st.value);
    setStatValueHi(st.valueHi || st.value);
    setStatTitle(st.title);
    setStatTitleHi(st.titleHi || "");
    setStatDesc(st.description || "");
    setStatDescHi(st.descriptionHi || "");
    setStatOrder(st.displayOrder);
    setIsStatModalOpen(true);
  };

  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statValue.trim() || !statTitle.trim()) {
      setMessage({ type: "error", text: "Metric value and title are required." });
      return;
    }
    setIsSavingStat(true);
    const payload = {
      value: statValue.trim(),
      valueHi: statValueHi.trim() || statValue.trim(),
      title: statTitle.trim(),
      titleHi: statTitleHi.trim() || undefined,
      description: statDesc.trim(),
      descriptionHi: statDescHi.trim() || undefined,
      displayOrder: Number(statOrder) || 1,
    };

    try {
      if (editingStat) {
        const res = await fetch(`/api/admin/customer-stats/${editingStat.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setStats((prev) =>
            prev.map((s) => (s.id === editingStat.id ? data.stat : s)).sort((a, b) => a.displayOrder - b.displayOrder)
          );
          setMessage({ type: "success", text: "Stat card updated successfully." });
          setIsStatModalOpen(false);
        } else {
          const err = await res.json();
          setMessage({ type: "error", text: err.error || "Failed to update stat card." });
        }
      } else {
        const res = await fetch("/api/admin/customer-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setStats((prev) => [...prev, data.stat].sort((a, b) => a.displayOrder - b.displayOrder));
          setMessage({ type: "success", text: "Stat card created successfully." });
          setIsStatModalOpen(false);
        } else {
          const err = await res.json();
          setMessage({ type: "error", text: err.error || "Failed to create stat card." });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Network error saving stat card." });
    } finally {
      setIsSavingStat(false);
    }
  };

  const handleDeleteStat = async () => {
    if (!deleteModalStat) return;
    setActionLoadingId(deleteModalStat.id);
    try {
      const res = await fetch(`/api/admin/customer-stats/${deleteModalStat.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStats((prev) => prev.filter((s) => s.id !== deleteModalStat.id));
        setMessage({ type: "success", text: `"${deleteModalStat.title}" stat card removed.` });
        setDeleteModalStat(null);
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.error || "Failed to delete stat card." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error deleting stat card." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setName("");
    setNameHi("");
    setLocation("Jalandhar, Punjab");
    setLocationHi("जालंधर, पंजाब");
    setVehicleName("Sargam Victor Passenger E-Rickshaw");
    setVehicleNameHi("सरगम विक्टर पैसेंजर ई-रिक्शा");
    setDeliveryDate(new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }));
    setDeliveryDateHi("");
    setRating(5);
    setQuote("");
    setQuoteHi("");
    setImage("/images/SARGAM-VICTOR-BLUE-2.webp");
    setFeatured(true);
    setDisplayOrder(customers.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (cust: CustomerStoryRecord) => {
    setEditingCustomer(cust);
    setName(cust.name);
    setNameHi(cust.nameHi || "");
    setLocation(cust.location);
    setLocationHi(cust.locationHi || "");
    setVehicleName(cust.vehicleName);
    setVehicleNameHi(cust.vehicleNameHi || "");
    setDeliveryDate(cust.deliveryDate);
    setDeliveryDateHi(cust.deliveryDateHi || "");
    setRating(cust.rating);
    setQuote(cust.quote);
    setQuoteHi(cust.quoteHi || "");
    setImage(cust.image);
    setFeatured(cust.featured);
    setDisplayOrder(cust.displayOrder);
    setIsModalOpen(true);
  };

  const handleTranslateField = async (fieldKey: string, textEn: string, onDone: (res: string) => void) => {
    if (!textEn || textEn.trim().length === 0) return;
    setIsTranslating((prev) => ({ ...prev, [fieldKey]: true }));
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textEn, targetLanguage: "hi" }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translated) {
          onDone(data.translated);
        }
      }
    } catch {}
    setIsTranslating((prev) => ({ ...prev, [fieldKey]: false }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setImage(data.url);
          setMessage({ type: "success", text: "Customer delivery photo uploaded." });
        }
      } else {
        const errData = await res.json();
        setMessage({ type: "error", text: errData.error || "Upload failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error uploading image." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage({ type: "error", text: "Customer name is required." });
      return;
    }
    if (!quote.trim()) {
      setMessage({ type: "error", text: "Customer review/quote is required." });
      return;
    }

    setIsSaving(true);
    const payload = {
      name,
      nameHi,
      location,
      locationHi,
      vehicleName,
      vehicleNameHi,
      deliveryDate,
      deliveryDateHi,
      rating,
      quote,
      quoteHi,
      image,
      featured,
      displayOrder,
    };

    try {
      if (editingCustomer) {
        const res = await fetch(`/api/admin/customers/${editingCustomer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers((prev) =>
            prev.map((c) => (c.id === editingCustomer.id ? data.customer : c))
          );
          setIsModalOpen(false);
          setMessage({ type: "success", text: `Updated "${name}" successfully.` });
        } else {
          const errData = await res.json();
          setMessage({ type: "error", text: errData.error || "Update failed." });
        }
      } else {
        const res = await fetch("/api/admin/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers((prev) => [data.customer, ...prev]);
          setIsModalOpen(false);
          setMessage({ type: "success", text: `Added "${name}" successfully.` });
        } else {
          const errData = await res.json();
          setMessage({ type: "error", text: errData.error || "Creation failed." });
        }
      }
    } catch {
      setMessage({ type: "error", text: "Server error saving customer." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (cust: CustomerStoryRecord) => {
    setActionLoadingId(cust.id);
    try {
      const res = await fetch(`/api/admin/customers/${cust.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== cust.id));
        setDeleteModalCustomer(null);
        setMessage({ type: "success", text: `Customer story for "${cust.name}" removed.` });
      } else {
        setMessage({ type: "error", text: "Failed to delete customer story." });
      }
    } catch {
      setMessage({ type: "error", text: "Server error during deletion." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (cust: CustomerStoryRecord) => {
    setActionLoadingId(cust.id);
    const updatedFeatured = !cust.featured;
    try {
      const res = await fetch(`/api/admin/customers/${cust.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: updatedFeatured }),
      });
      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === cust.id ? { ...c, featured: updatedFeatured } : c))
        );
        setMessage({
          type: "success",
          text: `"${cust.name}" ${updatedFeatured ? "marked as featured" : "unfeatured"}.`,
        });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update featured status." });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.nameHi && c.nameHi.toLowerCase().includes(term)) ||
      c.location.toLowerCase().includes(term) ||
      c.vehicleName.toLowerCase().includes(term) ||
      c.quote.toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
                Happy Customers & Deliveries
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-brand-red/10 text-brand-red font-mono text-xs font-bold">
                {customers.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              Showcase real delivery handovers, customer photos, locations, and testimonials on the public site.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="p-2.5 rounded bg-white border border-brand-border text-brand-charcoal hover:bg-stone-50 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-brand-red" : ""}`} />
            </button>
            {activeTab === "stories" ? (
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer Story</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openCreateStatModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stat Card</span>
              </button>
            )}
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded text-xs font-semibold flex items-center justify-between gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="p-1 hover:opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex border-b border-brand-border gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("stories")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "stories"
                ? "border-brand-red text-brand-red"
                : "border-transparent text-brand-muted hover:text-brand-charcoal"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Stories ({customers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "stats"
                ? "border-brand-red text-brand-red"
                : "border-transparent text-brand-muted hover:text-brand-charcoal"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Showcase Stat Cards ({stats.length})</span>
          </button>
        </div>

        {activeTab === "stories" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-brand-border shadow-xs">
          <Search className="w-4 h-4 text-brand-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, location, vehicle model, or quote..."
            className="w-full text-xs font-semibold text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-none bg-transparent"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch(e => "")}
              className="text-xs font-bold text-brand-muted hover:text-brand-charcoal"
            >
              Clear
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-red animate-spin mx-auto" />
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Loading Customer Stories...
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-white border border-brand-border rounded-xl p-12 text-center space-y-4">
            <Users className="w-12 h-12 text-stone-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-brand-charcoal">No customer stories found</h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                {search ? "No stories matched your search term." : "Start by adding your first delivery handover photo."}
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-brand-charcoal hover:bg-brand-red text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Story</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="bg-white border border-brand-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-stone-100 border-b border-brand-border">
                    <Image
                      src={cust.image || "/images/SARGAM-VICTOR-BLUE-2.webp"}
                      alt={cust.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {cust.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Featured</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                        #{cust.displayOrder}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-0.5 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded text-amber-400 text-xs">
                      {Array.from({ length: cust.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-black text-brand-charcoal">
                        {cust.name}
                      </h3>
                      {cust.nameHi && (
                        <p className="text-xs font-semibold text-brand-muted">{cust.nameHi}</p>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-brand-muted">
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                        <span>{cust.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold text-brand-charcoal">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span>{cust.vehicleName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>Delivered: {cust.deliveryDate}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded bg-brand-cream/60 border border-brand-border/60 text-xs text-brand-charcoal italic leading-relaxed">
                      &ldquo;{cust.quote}&rdquo;
                      {cust.quoteHi && (
                        <p className="not-italic text-[11px] text-brand-muted mt-1.5 font-normal">
                          &ldquo;{cust.quoteHi}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-brand-border flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(cust)}
                    disabled={actionLoadingId === cust.id}
                    className={`px-2.5 py-1.5 rounded font-bold transition-colors text-[11px] cursor-pointer ${
                      cust.featured
                        ? "bg-brand-red/10 text-brand-red hover:bg-brand-red/20"
                        : "bg-white border border-brand-border text-brand-muted hover:text-brand-charcoal"
                    }`}
                  >
                    {cust.featured ? "Featured ★" : "Make Featured"}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(cust)}
                      className="p-1.5 rounded bg-white border border-brand-border text-brand-charcoal hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Edit Customer Story"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModalCustomer(cust)}
                      className="p-1.5 rounded bg-white border border-brand-border text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Customer Story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-brand-warmWhite border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-red" />
                  <span>Public Showcase Metric Highlights</span>
                </h2>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                  These highlight cards appear directly beneath the title on the Happy Customers page (/happy-customers). You can edit values, change titles, reorder, add new cards, or remove cards.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateStatModal}
                className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stat Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-xl bg-white border border-brand-border shadow-card flex flex-col justify-between space-y-4 group hover:border-brand-charcoal/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-mono font-bold">
                        Order #{st.displayOrder}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditStatModal(st)}
                          className="p-1.5 rounded hover:bg-stone-100 text-brand-charcoal transition-colors cursor-pointer"
                          title="Edit Card"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModalStat(st)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-3xl font-black text-brand-charcoal font-mono tracking-tight">
                      {st.value}
                    </div>
                    {st.valueHi && st.valueHi !== st.value && (
                      <div className="text-xs text-brand-muted font-mono font-bold">
                        (हिन्दी: {st.valueHi})
                      </div>
                    )}

                    <div className="text-xs font-bold text-brand-charcoal pt-1">
                      {st.title}
                    </div>
                    {st.titleHi && (
                      <div className="text-[11px] text-brand-muted">
                        {st.titleHi}
                      </div>
                    )}

                    {st.description && (
                      <p className="text-[11px] text-brand-muted pt-1 border-t border-brand-border/60 leading-relaxed">
                        {st.description}
                        {st.descriptionHi && (
                          <span className="block text-[10px] text-brand-muted/80">
                            ({st.descriptionHi})
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between text-[11px]">
                    <span className="text-brand-muted">Live on website</span>
                    <button
                      type="button"
                      onClick={() => openEditStatModal(st)}
                      className="text-brand-red hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Edit Card →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {stats.length === 0 && (
              <div className="p-12 text-center rounded-xl bg-white border border-dashed border-brand-border space-y-3">
                <BarChart3 className="w-8 h-8 text-brand-muted mx-auto" />
                <h3 className="text-sm font-bold text-brand-charcoal">No Stat Cards Configured</h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Add your first highlight card to display on the Happy Customers page header.
                </p>
                <button
                  type="button"
                  onClick={openCreateStatModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-brand-red text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Card</span>
                </button>
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl border border-brand-border max-w-2xl w-full my-8 overflow-hidden">
              <div className="p-5 bg-brand-charcoal text-white flex items-center justify-between border-b border-black/20">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-red" />
                  <h3 className="text-base font-black tracking-tight">
                    {editingCustomer ? "Edit Customer Story" : "Add New Customer Story"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                        Customer Name (English) *
                      </label>
                      <button
                        type="button"
                        onClick={() => handleTranslateField("name", name, (val) => setNameHi(val))}
                        className="text-[10px] font-bold text-brand-red hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        {isTranslating["name"] ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Languages className="w-2.5 h-2.5" />}
                        <span>Auto Hindi</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Gurpreet Singh"
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                      Customer Name (Hindi)
                    </label>
                    <input
                      type="text"
                      value={nameHi}
                      onChange={(e) => setNameHi(e.target.value)}
                      placeholder="e.g. गुरप्रीत सिंह"
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                        Location / City (English) *
                      </label>
                      <button
                        type="button"
                        onClick={() => handleTranslateField("loc", location, (val) => setLocationHi(val))}
                        className="text-[10px] font-bold text-brand-red hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        {isTranslating["loc"] ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Languages className="w-2.5 h-2.5" />}
                        <span>Auto Hindi</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Rama Mandi, Jalandhar"
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                      Location (Hindi)
                    </label>
                    <input
                      type="text"
                      value={locationHi}
                      onChange={(e) => setLocationHi(e.target.value)}
                      placeholder="e.g. रामा मंडी, जालंधर"
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                      Vehicle Purchased *
                    </label>
                    <select
                      value={vehicleName}
                      onChange={(e) => setVehicleName(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
                    >
                      <option value="Sargam Victor Passenger E-Rickshaw">Sargam Victor Passenger E-Rickshaw</option>
                      <option value="King Cargo Express E-Loader">King Cargo Express E-Loader</option>
                      <option value="MKB Deluxe Passenger E-Rickshaw">MKB Deluxe Passenger E-Rickshaw</option>
                      <option value="Balaji City Passenger E-Rickshaw">Balaji City Passenger E-Rickshaw</option>
                      <option value="Balaji Delivery Van E-Carrier">Balaji Delivery Van E-Carrier</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                      Delivery Date *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      placeholder="e.g. August 2026"
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                    Handover / Customer Photo *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-20 bg-stone-100 rounded border border-brand-border overflow-hidden shrink-0">
                      <Image
                        src={image || "/images/SARGAM-VICTOR-BLUE-2.webp"}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <label className="inline-flex items-center gap-2 px-3 py-2 rounded bg-brand-warmWhite border border-brand-border hover:bg-stone-100 text-xs font-bold text-brand-charcoal cursor-pointer">
                        {isUploading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-red" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-brand-red" />
                        )}
                        <span>{isUploading ? "Uploading..." : "Upload New Photo"}</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Or enter image URL path (e.g. /images/rickshaw-red.webp)"
                        className="w-full px-3 py-1.5 rounded bg-brand-warmWhite border border-brand-border text-[11px] font-mono text-brand-charcoal focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                      Customer Quote / Review (English) *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateField("quote", quote, (val) => setQuoteHi(val))}
                      className="text-[10px] font-bold text-brand-red hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isTranslating["quote"] ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Languages className="w-2.5 h-2.5" />}
                      <span>Auto Hindi</span>
                    </button>
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="e.g. Balaji Motors made my loan approval so smooth and delivered the vehicle within 2 days! Daily earning increased significantly."
                    className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal focus:outline-none focus:border-brand-red leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                    Customer Quote / Review (Hindi)
                  </label>
                  <textarea
                    rows={3}
                    value={quoteHi}
                    onChange={(e) => setQuoteHi(e.target.value)}
                    placeholder="e.g. बालाजी मोटर्स से लोन बहुत आसानी से पास हो गया और मात्र 2 दिन में गाड़ी मिल गई। अब कमाई भी बढ़ गई है।"
                    className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal focus:outline-none focus:border-brand-red leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                      Star Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★☆</option>
                      <option value={3}>3 Stars ★★★☆☆</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs font-semibold text-brand-charcoal focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="featured-checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 accent-brand-red rounded cursor-pointer"
                    />
                    <label htmlFor="featured-checkbox" className="text-xs font-bold text-brand-charcoal cursor-pointer">
                      Featured on Homepage
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded border border-brand-border text-xs font-bold text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingCustomer ? "Save Changes" : "Publish Customer Story"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteModalCustomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-brand-border max-w-md w-full p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-brand-charcoal">
                  Delete Customer Story?
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Are you sure you want to remove the story for <strong>{deleteModalCustomer.name}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalCustomer(null)}
                  className="px-4 py-2 rounded border border-brand-border text-xs font-bold text-brand-muted hover:text-brand-charcoal transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteModalCustomer)}
                  disabled={actionLoadingId === deleteModalCustomer.id}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  {actionLoadingId === deleteModalCustomer.id ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isStatModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl border border-brand-border max-w-lg w-full overflow-hidden my-8">
              <div className="bg-brand-charcoal text-white p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black tracking-tight">
                    {editingStat ? "Edit Stat Card" : "Add Stat Card"}
                  </h2>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    Configure metric value, title, and bilingual descriptions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsStatModalOpen(false)}
                  className="p-1 rounded hover:bg-white/10 text-stone-300 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStat} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                      Metric Value (EN) *
                    </label>
                    <input
                      type="text"
                      required
                      value={statValue}
                      onChange={(e) => setStatValue(e.target.value)}
                      placeholder="e.g. 1000+, 98%, 4.9 ★"
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal font-mono font-bold focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                      Metric Value (HI)
                    </label>
                    <input
                      type="text"
                      value={statValueHi}
                      onChange={(e) => setStatValueHi(e.target.value)}
                      placeholder="e.g. 1000+, 98%"
                      className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal font-mono focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                      Card Title (EN) *
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateField("statTitle", statTitle, setStatTitleHi)}
                      disabled={isTranslating["statTitle"] || !statTitle.trim()}
                      className="inline-flex items-center gap-1 text-[11px] text-brand-red hover:underline font-bold disabled:opacity-40 cursor-pointer"
                    >
                      <Languages className="w-3 h-3" />
                      <span>{isTranslating["statTitle"] ? "Translating..." : "Auto-Translate to Hindi"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={statTitle}
                    onChange={(e) => setStatTitle(e.target.value)}
                    placeholder="e.g. Vehicles on Road"
                    className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal font-semibold focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                    Card Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={statTitleHi}
                    onChange={(e) => setStatTitleHi(e.target.value)}
                    placeholder="e.g. सड़क पर गाड़ियां"
                    className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                      Subtitle / Description (EN)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleTranslateField("statDesc", statDesc, setStatDescHi)}
                      disabled={isTranslating["statDesc"] || !statDesc.trim()}
                      className="inline-flex items-center gap-1 text-[11px] text-brand-red hover:underline font-bold disabled:opacity-40 cursor-pointer"
                    >
                      <Languages className="w-3 h-3" />
                      <span>{isTranslating["statDesc"] ? "Translating..." : "Auto-Translate to Hindi"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={statDesc}
                    onChange={(e) => setStatDesc(e.target.value)}
                    placeholder="e.g. Across Punjab"
                    className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                    Subtitle / Description (Hindi)
                  </label>
                  <input
                    type="text"
                    value={statDescHi}
                    onChange={(e) => setStatDescHi(e.target.value)}
                    placeholder="e.g. पूरे पंजाब में"
                    className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1">
                    Display Order *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={statOrder}
                    onChange={(e) => setStatOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-xs text-brand-charcoal font-mono focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsStatModalOpen(false)}
                    className="px-4 py-2 rounded border border-brand-border text-xs font-bold text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingStat}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    {isSavingStat && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingStat ? "Save Changes" : "Create Stat Card"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteModalStat && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-brand-border max-w-md w-full p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-brand-charcoal">
                  Delete Stat Card?
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Are you sure you want to remove the card &ldquo;<strong>{deleteModalStat.title} ({deleteModalStat.value})</strong>&rdquo;? It will no longer appear on the public website.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalStat(null)}
                  className="px-4 py-2 rounded border border-brand-border text-xs font-bold text-brand-muted hover:text-brand-charcoal transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStat}
                  disabled={actionLoadingId === deleteModalStat.id}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  {actionLoadingId === deleteModalStat.id ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
