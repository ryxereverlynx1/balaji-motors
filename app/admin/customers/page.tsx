"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { CustomerStoryRecord } from "@/lib/db/types";
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
} from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerStoryRecord[]>([]);
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

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      } else {
        setMessage({ type: "error", text: "Failed to load customer stories." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error loading customer stories." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer Story</span>
            </button>
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
      </div>
    </AdminLayout>
  );
}
