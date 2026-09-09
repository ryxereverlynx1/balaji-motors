"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { vehiclesData, Vehicle, getLocalizedVehicle } from "@/data/vehicles";
import { useLanguage } from "@/context/LanguageContext";
import { useQuoteModal } from "@/context/QuoteModalContext";
import {
  Scale,
  ArrowRight,
  Check,
  Zap,
  Battery,
  Gauge,
  Clock,
  Users,
  Package,
  Shield,
  Layers,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { siteConfig } from "@/data/site";

export default function VehicleComparison() {
  const { language, isHindi } = useLanguage();
  const { openQuoteModal } = useQuoteModal();

  const [slot1Id, setSlot1Id] = useState<string>("sargam-victor-passenger");
  const [slot2Id, setSlot2Id] = useState<string>("king-cargo-express-loader");
  const [slot3Id, setSlot3Id] = useState<string>("mkb-deluxe-passenger");
  const [highlightDiff, setHighlightDiff] = useState(false);

  const getVehicle = (id: string): Vehicle => {
    const raw = vehiclesData.find((v) => v.id === id || v.slug === id) || vehiclesData[0];
    return getLocalizedVehicle(raw, language);
  };

  const v1 = getVehicle(slot1Id);
  const v2 = getVehicle(slot2Id);
  const v3 = getVehicle(slot3Id);

  const comparedVehicles = [v1, v2, v3];

  const specRows = [
    {
      id: "category",
      label: isHindi ? "वाहन श्रेणी" : "Vehicle Category",
      icon: Layers,
      getValue: (v: Vehicle) => v.category,
    },
    {
      id: "range",
      label: isHindi ? "ड्राइविंग रेंज (प्रति चार्ज)" : "Range per Charge",
      icon: Gauge,
      getValue: (v: Vehicle) => v.specs.rangePerCharge,
    },
    {
      id: "motor",
      label: isHindi ? "इलेक्ट्रिक मोटर" : "Electric Motor",
      icon: Zap,
      getValue: (v: Vehicle) => v.specs.motor,
    },
    {
      id: "battery",
      label: isHindi ? "बैटरी प्रकार" : "Battery Chemistry",
      icon: Battery,
      getValue: (v: Vehicle) => v.specs.batteryType,
    },
    {
      id: "capacity",
      label: isHindi ? "क्षमता (सवारी / माल वजन)" : "Capacity (Seats / Payload)",
      icon: Users,
      getValue: (v: Vehicle) => v.specs.seatingCapacity || v.specs.payloadCapacity || "Standard Commercial",
    },
    {
      id: "charging",
      label: isHindi ? "चार्जिंग समय" : "Charging Time",
      icon: Clock,
      getValue: (v: Vehicle) => v.specs.chargingTime,
    },
    {
      id: "speed",
      label: isHindi ? "अधिकतम गति" : "Top Speed",
      icon: Gauge,
      getValue: (v: Vehicle) => v.specs.topSpeed,
    },
    {
      id: "brakes",
      label: isHindi ? "ब्रेकिंग सिस्टम" : "Brakes",
      icon: Shield,
      getValue: (v: Vehicle) => v.specs.brakes,
    },
    {
      id: "chassis",
      label: isHindi ? "चेसिस ढांचा" : "Chassis & Frame",
      icon: Layers,
      getValue: (v: Vehicle) => v.specs.chassisFrame,
    },
    {
      id: "warranty",
      label: isHindi ? "वारंटी सुरक्षा" : "Warranty",
      icon: Shield,
      getValue: (v: Vehicle) => v.specs.warranty,
    },
  ];

  const shareWhatsApp = (v: Vehicle) => {
    const text = isHindi
      ? `नमस्ते बालाजी मोटर्स! मुझे "${v.name}" के बारे में पूछताछ करनी है। कृपया मुझे ऑन-रोड कीमत, बैटरी विकल्प और किश्तों की जानकारी दें।`
      : `Hello Balaji Motors! I am enquiring about "${v.name}" after comparing models on your website. Please provide quotation, battery options, and financing details.`;
    const cleanPhone = siteConfig.whatsappNumber;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-cream/60 p-4 rounded-xl border border-brand-border">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-charcoal">
          <Scale className="w-4 h-4 text-brand-red shrink-0" />
          <span>{isHindi ? "किसी भी मॉडल को बदलने के लिए ड्रॉपडाउन का उपयोग करें" : "Select vehicles from the dropdowns below to compare side-by-side"}</span>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-bold text-brand-charcoal cursor-pointer self-start sm:self-auto">
          <input
            type="checkbox"
            checked={highlightDiff}
            onChange={(e) => setHighlightDiff(e.target.checked)}
            className="w-4 h-4 accent-brand-red rounded cursor-pointer"
          />
          <span>{isHindi ? "अंतर हाइलाइट करें" : "Highlight Differences"}</span>
        </label>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[760px] border border-brand-border rounded-xl bg-white shadow-card overflow-hidden">
          <div className="grid grid-cols-4 divide-x divide-brand-border border-b border-brand-border bg-stone-50">
            <div className="p-4 sm:p-6 flex flex-col justify-end">
              <div className="text-xs font-black uppercase tracking-wider text-brand-red mb-1">
                {isHindi ? "तुलना मैट्रिक्स" : "Comparison Matrix"}
              </div>
              <h3 className="text-lg font-black text-brand-charcoal tracking-tight">
                {isHindi ? "मॉडल विशेषताएं" : "Features & Specs"}
              </h3>
            </div>

            {[
              { slot: slot1Id, setSlot: setSlot1Id, vehicle: v1 },
              { slot: slot2Id, setSlot: setSlot2Id, vehicle: v2 },
              { slot: slot3Id, setSlot: setSlot3Id, vehicle: v3 },
            ].map(({ slot, setSlot, vehicle }, colIdx) => (
              <div key={colIdx} className="p-4 sm:p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full text-xs font-bold text-brand-charcoal bg-white border border-brand-border rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-red cursor-pointer"
                  >
                    {vehiclesData.map((veh) => (
                      <option key={veh.id} value={veh.id}>
                        {isHindi && veh.nameHi ? veh.nameHi : veh.name}
                      </option>
                    ))}
                  </select>

                  <div className="relative h-32 w-full bg-brand-warmWhite rounded-lg border border-brand-border overflow-hidden">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-contain p-2"
                      sizes="220px"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-brand-charcoal leading-snug line-clamp-2">
                      {vehicle.name}
                    </h4>
                    <p className="text-[11px] text-brand-muted mt-0.5">{vehicle.series}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-brand-border/60">
                  <button
                    type="button"
                    onClick={() => openQuoteModal(vehicle.name)}
                    className="w-full py-2 px-3 rounded bg-brand-red hover:bg-brand-darkRed text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    {isHindi ? "कोटेशन लें" : "Get Quote"}
                  </button>
                  <button
                    type="button"
                    onClick={() => shareWhatsApp(vehicle)}
                    className="w-full py-1.5 px-3 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                  <Link
                    href={`/vehicles/${vehicle.slug}`}
                    className="block text-center text-[11px] font-bold text-brand-charcoal hover:text-brand-red transition-colors"
                  >
                    {isHindi ? "पूर्ण विवरण देखें →" : "View Details →"}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-brand-border">
            {specRows.map((row) => {
              const val1 = row.getValue(v1);
              const val2 = row.getValue(v2);
              const val3 = row.getValue(v3);
              const isDiff = val1 !== val2 || val2 !== val3;

              return (
                <div
                  key={row.id}
                  className={`grid grid-cols-4 divide-x divide-brand-border transition-colors ${
                    highlightDiff && isDiff ? "bg-amber-50/50" : "hover:bg-stone-50/50"
                  }`}
                >
                  <div className="p-3.5 sm:p-4 text-xs font-bold text-brand-charcoal flex items-center gap-2 bg-stone-50/40">
                    <row.icon className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span>{row.label}</span>
                  </div>

                  {comparedVehicles.map((veh, vIdx) => (
                    <div key={vIdx} className="p-3.5 sm:p-4 text-xs text-brand-charcoal leading-relaxed font-medium">
                      {row.getValue(veh)}
                    </div>
                  ))}
                </div>
              );
            })}

            <div className="grid grid-cols-4 divide-x divide-brand-border bg-stone-50/40">
              <div className="p-3.5 sm:p-4 text-xs font-bold text-brand-charcoal flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span>{isHindi ? "मुख्य खूबियां" : "Key Highlights"}</span>
              </div>

              {comparedVehicles.map((veh, vIdx) => (
                <div key={vIdx} className="p-3.5 sm:p-4 space-y-1.5">
                  {veh.featuresList.slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-brand-muted leading-tight">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
