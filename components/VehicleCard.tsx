"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Vehicle, getLocalizedVehicle } from "@/data/vehicles";
import { useLanguage } from "@/context/LanguageContext";
import { useQuoteModal } from "@/context/QuoteModalContext";
import { ArrowRight, BatteryCharging, Gauge, Users, Package, MessageSquare } from "lucide-react";
import { getVehicleWhatsAppUrl } from "@/lib/whatsapp";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { language, dict } = useLanguage();
  const { openQuoteModal } = useQuoteModal();
  const v = getLocalizedVehicle(vehicle, language);
  const t = dict.catalogue;

  return (
    <div className="group flex flex-col bg-white border border-brand-border hover:border-brand-red/40 rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
      <div className="relative aspect-[16/11] bg-gradient-to-br from-brand-warmWhite to-brand-cream/80 p-3.5 sm:p-5 flex flex-col justify-between overflow-hidden border-b border-brand-border">
        <div className="flex flex-wrap items-center justify-between gap-1.5 z-10">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wideUpper px-2 sm:px-2.5 py-0.5 rounded bg-white/90 border border-brand-border text-brand-charcoal shadow-xs max-w-[65%] truncate">
            {v.category}
          </span>
          {v.featured && (
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wideUpper px-1.5 sm:px-2 py-0.5 rounded bg-brand-yellow/30 border border-brand-yellow/60 text-brand-charcoal shrink-0">
              {v.badges[0] || "Popular"}
            </span>
          )}
        </div>

        <div className="relative z-10 my-auto w-full h-[160px] sm:h-[180px] flex items-center justify-center py-2">
          <div className="relative w-full h-full transform group-hover:scale-[1.03] transition-transform duration-500 ease-out">
            <Image
              src={v.image}
              alt={v.name}
              fill
              className="object-contain drop-shadow-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 z-10">
          {v.colors.map((c) => (
            <span
              key={c.hex}
              className="w-3.5 h-3.5 rounded-full border border-brand-charcoal/20 shadow-xs"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between space-y-4 sm:space-y-5">
        <div>
          <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wideUpper text-brand-red mb-1">
            {v.series}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-brand-charcoal group-hover:text-brand-red transition-colors">
            {v.name}
          </h3>
          <p className="text-xs text-brand-muted mt-2 line-clamp-2 leading-relaxed">
            {v.shortDescription}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-2 py-2.5 sm:py-3 border-y border-brand-border bg-brand-warmWhite rounded px-2 sm:px-3">
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-wideUpper text-brand-muted mb-1 font-semibold truncate">
              <Gauge className="w-3 h-3 text-brand-red shrink-0" />
              <span className="truncate">{t.speed}</span>
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-brand-charcoal truncate">{v.specs.topSpeed}</div>
          </div>

          <div className="text-left border-x border-brand-border px-1.5 sm:px-2 min-w-0">
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-wideUpper text-brand-muted mb-1 font-semibold truncate">
              <BatteryCharging className="w-3 h-3 text-brand-red shrink-0" />
              <span className="truncate">{t.range}</span>
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-brand-charcoal truncate" title={v.specs.rangePerCharge}>
              {v.specs.rangePerCharge.split(" ")[0]} km*
            </div>
          </div>

          <div className="text-left min-w-0">
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-wideUpper text-brand-muted mb-1 font-semibold truncate">
              {v.category.includes("Cargo") || v.category.includes("लोडर") ? (
                <Package className="w-3 h-3 text-brand-red shrink-0" />
              ) : (
                <Users className="w-3 h-3 text-brand-red shrink-0" />
              )}
              <span className="truncate">{t.capacity}</span>
            </div>
            <div className="text-[11px] sm:text-xs font-bold text-brand-charcoal truncate">
              {v.specs.seatingCapacity || v.specs.payloadCapacity || "Commercial"}
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="text-xs font-semibold text-brand-muted">
            {language === "hi" ? "कीमत:" : "Price:"}{" "}
            <span className="text-brand-charcoal font-bold">
              {v.approximateStartingPrice || t.priceOnEnquiry}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <Link
                href={`/vehicles/${vehicle.slug}`}
                className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded bg-brand-cream hover:bg-brand-border active:scale-[0.98] border border-brand-border text-brand-charcoal text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all truncate"
              >
                <span className="truncate">{t.viewSpecs}</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </Link>

              <button
                type="button"
                onClick={() => openQuoteModal(v.name)}
                className="inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer truncate"
              >
                <span className="truncate">{dict.nav.getQuote}</span>
              </button>
            </div>

            <a
              href={getVehicleWhatsAppUrl(v.name, language)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded bg-[#25D366]/10 hover:bg-[#25D366]/20 active:scale-[0.98] border border-[#25D366]/30 text-brand-charcoal text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all truncate"
            >
              <MessageSquare className="w-3 h-3 text-[#25D366] shrink-0" />
              <span className="truncate">{t.askPrice}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}