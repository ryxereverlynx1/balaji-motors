"use client";

import React, { useState, useEffect } from "react";
import { vehiclesData, Vehicle } from "@/data/vehicles";
import VehicleCard from "@/components/VehicleCard";
import ScrollReveal from "@/components/ScrollReveal";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, MessageSquare, Filter } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

import { CategoryRecord } from "@/lib/db/types";

interface VehiclesShowroomProps {
  initialVehicles?: Vehicle[];
  initialCategories?: CategoryRecord[];
}

export default function VehiclesShowroom({
  initialVehicles,
  initialCategories,
}: VehiclesShowroomProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    initialVehicles && initialVehicles.length > 0 ? initialVehicles : vehiclesData
  );
  const [categories, setCategories] = useState<CategoryRecord[]>(
    initialCategories || []
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const { language, dict } = useLanguage();
  const t = dict.catalogue;

  useEffect(() => {
    async function loadDynamicShowroom() {
      try {
        const [prodsRes, catsRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (prodsRes.ok) {
          const prodsData = await prodsRes.json();
          const list = Array.isArray(prodsData.vehicles)
            ? prodsData.vehicles
            : Array.isArray(prodsData.products)
            ? prodsData.products
            : null;
          if (list !== null) {
            setVehicles(list);
          }
        }

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          if (Array.isArray(catsData.categories)) {
            setCategories(catsData.categories);
          }
        }
      } catch {}
    }

    loadDynamicShowroom();
  }, []);

  const categoryTabs = [
    { id: "all", label: t.allModels },
    ...categories.map((c) => ({
      id: c.id,
      label: language === "hi" && c.nameHi ? c.nameHi : c.name,
    })),
  ];

  const filteredVehicles =
    selectedCategoryId === "all"
      ? vehicles
      : vehicles.filter((v) => {
          const activeCat = categories.find((c) => c.id === selectedCategoryId);
          if (!activeCat) return true;

          const catId = (v as any).categoryId;
          if (catId && catId === activeCat.id) return true;

          const catName = (v as any).categoryName || v.category || v.series;
          if (catName && catName.toLowerCase() === activeCat.name.toLowerCase()) return true;

          if (
            activeCat.slug === "passenger" ||
            activeCat.slug === "e-rickshaw" ||
            activeCat.slug === "passenger-vehicle"
          ) {
            return v.category === "Passenger";
          }

          if (
            activeCat.slug === "cargo-loader" ||
            activeCat.slug === "cargo" ||
            activeCat.slug === "loader" ||
            activeCat.slug === "electric-loader"
          ) {
            return v.category === "Cargo / Loader";
          }

          return false;
        });

  return (
    <div className="pt-24 pb-20 sm:pt-32 sm:pb-28 bg-brand-warmWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-brand-border pb-10 mb-10">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
            {t.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-charcoal tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-brand-muted mt-3 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 bg-brand-cream p-1 rounded border border-brand-border">
              <div className="flex items-center gap-1 px-2.5 text-xs text-brand-muted uppercase tracking-wider font-bold">
                <Filter className="w-3.5 h-3.5 text-brand-red" />
                <span className="hidden sm:inline">{t.filterLabel}</span>
              </div>
              {categoryTabs.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3.5 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors active:scale-95 ${
                    selectedCategoryId === cat.id
                      ? "bg-brand-red text-white shadow-xs"
                      : "text-brand-charcoal hover:text-brand-red hover:bg-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-brand-muted">
              {t.showingCount} <span className="text-brand-charcoal font-bold">{filteredVehicles.length}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle, idx) => (
            <ScrollReveal key={vehicle.id} delay={idx * 100}>
              <VehicleCard vehicle={vehicle} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={150}>
          <div className="mt-16 bg-white border border-brand-border rounded-md p-8 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wide text-brand-red">
                  {language === "hi" ? "???????? ????? ? ?????????? ????" : "Commercial Fleet & Custom Bodies"}
                </span>
                <h3 className="text-2xl font-bold text-brand-charcoal">
                  {language === "hi"
                    ? "???? ???? ????? ????? ??? ?? ??????? ????? ?? ????? ???"
                    : "Need Custom Battery Configuration or Commercial Fleet Delivery?"}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {language === "hi"
                    ? "?????? ?????? ?? ????? ?????? ???? ?????? ?? ???-??? ??? ??? ?????, ?????? ???????? ?? ??????? ?? ?? ??? ????? ????? ?????? ?? ???? ???"
                    : "Balaji Motors supplies single units for owner-drivers as well as bulk vehicle batches for cargo distributors, delivery hubs, and logistics contractors in Punjab."}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <a
                  href={getGeneralWhatsAppUrl(language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-[#25D366] hover:bg-[#20BA5A] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{language === "hi" ? "????????? ?? ??? ????" : "Enquire via WhatsApp"}</span>
                </a>
                <a
                  href={`tel:${siteConfig.primaryPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-brand-cream hover:bg-brand-border active:scale-[0.98] border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <Phone className="w-4 h-4 text-brand-red" />
                  <span>{language === "hi" ? "????? ?? ??? ????" : "Call Showroom"}</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}