"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Vehicle, getLocalizedVehicle } from "@/data/vehicles";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";
import { useQuoteModal } from "@/context/QuoteModalContext";
import ViewerFallback from "@/components/3d/ViewerFallback";
import EnquiryForm from "@/components/EnquiryForm";
import VehicleCard from "@/components/VehicleCard";
import ScrollReveal from "@/components/ScrollReveal";
import ExplodedView from "@/components/ExplodedView";
import {
  MessageSquare,
  Phone,
  Shield,
  Zap,
  Battery,
  Gauge,
  Layers,
  Clock,
  Users,
  Package,
  Wrench,
  Check,
  FileText,
} from "lucide-react";
import { getVehicleWhatsAppUrl } from "@/lib/whatsapp";

const VehicleViewer = dynamic(() => import("@/components/3d/VehicleViewer"), {
  ssr: false,
  loading: () => <ViewerFallback vehicleName="Electric Vehicle Viewer" />,
});

interface VehicleDetailContentProps {
  vehicle: Vehicle;
  relatedVehicles: Vehicle[];
}

export default function VehicleDetailContent({
  vehicle,
  relatedVehicles,
}: VehicleDetailContentProps) {
  const { language, dict } = useLanguage();
  const { openQuoteModal } = useQuoteModal();
  const v = getLocalizedVehicle(vehicle, language);
  const t = dict.vehicleDetail;

  return (
    <div className="pt-24 pb-20 sm:pt-32 sm:pb-28 bg-brand-warmWhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-wideUpper text-brand-muted mb-6">
          <Link href="/" className="hover:text-brand-charcoal transition-colors">
            {t.home}
          </Link>
          <span>/</span>
          <Link href="/vehicles" className="hover:text-brand-charcoal transition-colors">
            {t.vehicles}
          </Link>
          <span>/</span>
          <span className="text-brand-charcoal font-bold">{v.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-start">
          <div className="lg:col-span-7 space-y-3">
            <VehicleViewer
              category={vehicle.category}
              colors={vehicle.colors}
              hotspots={vehicle.hotspots}
              defaultImage={vehicle.image}
            />
            <div className="flex items-center justify-between text-xs text-brand-muted px-1">
              <span>{dict.viewer.inspectLabel}</span>
              <span className="text-brand-red font-semibold">{t.referencePhotos}</span>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wideUpper px-2.5 py-0.5 rounded bg-brand-cream border border-brand-border text-brand-charcoal">
                  {v.category}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wideUpper px-2.5 py-0.5 rounded bg-white border border-brand-border text-brand-muted">
                  {v.series}
                </span>
                {v.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-yellow/30 text-brand-charcoal"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
                {v.name}
              </h1>

              <p className="text-sm font-medium text-brand-muted leading-relaxed">
                {v.tagline}
              </p>

              <div className="p-4 rounded bg-brand-cream/60 border border-brand-border space-y-1.5">
                <div className="text-xs uppercase tracking-wide text-brand-muted font-bold">
                  {t.pricingBadge}
                </div>
                <div className="text-2xl font-black text-brand-charcoal">
                  {v.approximateStartingPrice || "Price on Enquiry"}
                </div>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {v.priceNote}
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => openQuoteModal(v.name)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{dict.nav.getQuote}</span>
                  </button>

                  <a
                    href={getVehicleWhatsAppUrl(v.name, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded bg-[#25D366] hover:bg-[#20BA5A] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.whatsappQuoteBtn}</span>
                  </a>
                </div>

                <a
                  href={`tel:${siteConfig.primaryPhone}`}
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded bg-white hover:bg-brand-cream active:scale-[0.98] border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4 text-brand-red" />
                  <span>{t.callShowroomBtn}</span>
                </a>
              </div>
            </div>

            <div className="border-t border-brand-border pt-4 space-y-2 text-xs text-brand-muted">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>{t.warrantyBadge}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-brand-red flex-shrink-0" />
                <span>{t.sparesBadge}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <ExplodedView
            vehicleName={v.name}
            defaultAssembledImage={vehicle.slug ? `/products/${vehicle.slug}.png` : vehicle.image}
          />
        </div>

        <div className="border-t border-brand-border pt-14 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <ScrollReveal>
                <div>
                  <h2 className="text-2xl font-black text-brand-charcoal tracking-tight mb-4">
                    {t.keySpecsTitle}
                  </h2>
                  <div className="bg-white border border-brand-border rounded-md overflow-hidden divide-y divide-brand-border shadow-card">
                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t.motorType}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">{v.specs.motor}</span>
                    </div>

                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        <Battery className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t.batteryChemistry}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">{v.specs.batteryType}</span>
                    </div>

                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        <Battery className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t.batteryCapacity}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">{v.specs.batteryCapacity}</span>
                    </div>

                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        <Gauge className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t.estimatedRange}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">{v.specs.rangePerCharge}</span>
                    </div>

                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t.chargingTime}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">{v.specs.chargingTime}</span>
                    </div>

                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        {vehicle.category === "Passenger" ? (
                          <Users className="w-3.5 h-3.5 text-brand-red" />
                        ) : (
                          <Package className="w-3.5 h-3.5 text-brand-red" />
                        )}
                        <span>{t.capacityLabel}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">
                        {v.specs.seatingCapacity || v.specs.payloadCapacity}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        <Gauge className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t.topSpeed}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">{v.specs.topSpeed}</span>
                    </div>

                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t.brakingSystem}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">{v.specs.brakes}</span>
                    </div>

                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t.chassisFrame}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">{v.specs.chassisFrame}</span>
                    </div>

                    <div className="grid grid-cols-2 p-3.5 text-xs">
                      <span className="text-brand-muted uppercase font-bold flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-brand-red" />
                        <span>{t.warranty}</span>
                      </span>
                      <span className="text-brand-charcoal font-semibold text-right">{v.specs.warranty}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div>
                  <h3 className="text-lg font-bold text-brand-charcoal tracking-tight mb-3">
                    {t.highlightsTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {v.featuresList.map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded bg-white border border-brand-border flex items-start gap-2.5 text-xs text-brand-charcoal shadow-xs"
                      >
                        <Check className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div>
                  <h3 className="text-lg font-bold text-brand-charcoal tracking-tight mb-2">
                    {t.commercialUtilityTitle}
                  </h3>
                  <p className="text-sm text-brand-muted leading-relaxed">
                    {v.fullDescription}
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="sticky top-24">
                <EnquiryForm
                  preselectedVehicle={v.name}
                  sourceContext={`Vehicle Page (${v.name})`}
                />
              </div>
            </div>
          </div>
        </div>

        {relatedVehicles.length > 0 && (
          <div className="border-t border-brand-border pt-14">
            <ScrollReveal>
              <h3 className="text-2xl font-black text-brand-charcoal tracking-tight mb-8">
                {t.relatedTitle}
              </h3>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVehicles.map((rel, idx) => (
                <ScrollReveal key={rel.id} delay={idx * 120}>
                  <VehicleCard vehicle={rel} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
