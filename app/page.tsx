"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { siteConfig } from "@/data/site";
import { vehiclesData } from "@/data/vehicles";
import { useLanguage } from "@/context/LanguageContext";
import { useQuoteModal } from "@/context/QuoteModalContext";
import VehicleCard from "@/components/VehicleCard";
import EnquiryForm from "@/components/EnquiryForm";
import SavingsCalculator from "@/components/SavingsCalculator";
import ScrollReveal from "@/components/ScrollReveal";
import ViewerFallback from "@/components/3d/ViewerFallback";
import {
  ArrowRight,
  Phone,
  MessageSquare,
  Shield,
  Zap,
  Wrench,
  FileText,
  MapPin,
  CheckCircle,
  Navigation,
  Compass,
} from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

const HeroRickshaw = dynamic(() => import("@/components/3d/HeroRickshaw"), {
  ssr: false,
  loading: () => <ViewerFallback vehicleName="Balaji Motors Electric Rickshaw" />,
});

const VehicleViewer = dynamic(() => import("@/components/3d/VehicleViewer"), {
  ssr: false,
  loading: () => <ViewerFallback vehicleName="Interactive 3D Explorer" />,
});

const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is Balaji Motors electric rickshaw showroom located in Jalandhar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Balaji Motors is located at Avtar Nagar Road, Near Hotel Regent Park / Gujral Nagar, Jalandhar, Punjab 144001.",
      },
    },
    {
      "@type": "Question",
      name: "What models of electric rickshaws are available at Balaji Motors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer BAXY Super King Passenger E-Rickshaws, BAXY Cargo Express Loaders, Balaji City Passenger Rickshaws, and Balaji Closed Delivery Vans.",
      },
    },
    {
      "@type": "Question",
      name: "Does Balaji Motors provide on-spot loan and EMI financing in Punjab?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide fast loan assistance with low down payment schemes, flexible EMIs, and minimal documentation through leading vehicle finance partners.",
      },
    },
    {
      "@type": "Question",
      name: "What warranty and service support is provided?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "All vehicles include Manufacturer Warranty on Motor & Drivetrain, along with genuine spare parts, battery diagnostics, and repairs at our Jalandhar workshop.",
      },
    },
  ],
};

export default function HomePage() {
  const { language, dict } = useLanguage();
  const { openQuoteModal } = useQuoteModal();
  const [featuredVehicles, setFeaturedVehicles] = React.useState(vehiclesData.filter((v) => v.featured));
  const explorerVehicle = featuredVehicles[0] || vehiclesData[0];

  React.useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.vehicles) && data.vehicles.length > 0) {
            const feat = data.vehicles.filter((v: any) => v.featured);
            if (feat.length > 0) {
              setFeaturedVehicles(feat);
            }
          }
        }
      } catch {}
    }
    loadFeatured();
  }, []);

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Balaji Motors Avtar Nagar Road Gujral Nagar Jalandhar Punjab"
  )}`;

  return (
    <div className="flex flex-col bg-brand-warmWhite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-b from-brand-cream via-brand-cream/80 to-brand-warmWhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="animate-hero-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-border text-xs font-bold uppercase tracking-wideUpper text-brand-charcoal shadow-xs">
                <span className="w-2 h-2 rounded-full bg-brand-yellow" />
                <span>{dict.hero.badge}</span>
                <span className="text-brand-red ml-1 font-extrabold">• {dict.hero.runningCostBadge}</span>
              </div>

              <h1
                style={{ animationDelay: "100ms" }}
                className="animate-hero-fade-up text-4xl sm:text-5xl lg:text-6xl font-black text-brand-charcoal tracking-tightest leading-[1.08]"
              >
                {dict.hero.titleLine1}<br />
                <span className="text-brand-red">{dict.hero.titleLine2}</span>
              </h1>

              <p
                style={{ animationDelay: "200ms" }}
                className="animate-hero-fade-up text-sm sm:text-base text-brand-muted max-w-lg leading-relaxed font-normal"
              >
                {dict.hero.subtitle}
              </p>

              <div
                style={{ animationDelay: "300ms" }}
                className="animate-hero-fade-up flex flex-wrap items-center gap-3 pt-2"
              >
                <Link
                  href="/vehicles"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] active:translate-y-0.5 text-white text-xs font-bold uppercase tracking-wideUpper transition-all shadow-sm group"
                >
                  <span>{dict.hero.viewVehicles}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <button
                  type="button"
                  onClick={() => openQuoteModal()}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded bg-white hover:bg-brand-cream active:scale-[0.98] active:translate-y-0.5 border border-brand-charcoal/20 text-brand-charcoal text-xs font-bold uppercase tracking-wideUpper transition-colors shadow-xs cursor-pointer"
                >
                  <span>{dict.hero.getQuote}</span>
                </button>
              </div>

              <div
                style={{ animationDelay: "400ms" }}
                className="animate-hero-fade-up pt-6 border-t border-brand-border grid grid-cols-3 gap-4 text-left"
              >
                <div>
                  <div className="text-[11px] uppercase tracking-wideUpper text-brand-muted font-bold">
                    {dict.hero.locationLabel}
                  </div>
                  <div className="text-xs font-bold text-brand-charcoal mt-0.5">{dict.hero.locationValue}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wideUpper text-brand-muted font-bold">
                    {dict.hero.segmentLabel}
                  </div>
                  <div className="text-xs font-bold text-brand-charcoal mt-0.5">{dict.hero.segmentValue}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wideUpper text-brand-muted font-bold">
                    {dict.hero.supportLabel}
                  </div>
                  <div className="text-xs font-bold text-brand-charcoal mt-0.5">{dict.hero.supportValue}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="animate-hero-scale relative rounded-md overflow-hidden bg-gradient-to-b from-brand-warmWhite to-brand-cream/60 border border-brand-border shadow-card">
                <HeroRickshaw />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-brand-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-xs font-bold uppercase tracking-wideUpper text-brand-charcoal">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-red" />
              <span>{dict.ticker.electric3w}</span>
            </span>
            <span className="hidden md:inline text-brand-border">•</span>
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-red" />
              <span>{dict.ticker.financeGuidance}</span>
            </span>
            <span className="hidden md:inline text-brand-border">•</span>
            <span className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-brand-red" />
              <span>{dict.ticker.afterSales}</span>
            </span>
            <span className="hidden md:inline text-brand-border">•</span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-red" />
              <span>{dict.ticker.spareParts}</span>
            </span>
            <span className="hidden md:inline text-brand-border">•</span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-red" />
              <span>{dict.ticker.jalandharShowroom}</span>
            </span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-warmWhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
                  {dict.catalogue.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
                  {dict.catalogue.title}
                </h2>
                <p className="text-sm text-brand-muted mt-2 max-w-xl leading-relaxed">
                  {dict.catalogue.subtitle}
                </p>
              </div>

              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wideUpper text-brand-red hover:text-brand-darkRed transition-colors group"
              >
                <span>{dict.catalogue.exploreAll}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle, idx) => (
              <ScrollReveal key={vehicle.id} delay={idx * 120}>
                <VehicleCard vehicle={vehicle} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-cream/60 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SavingsCalculator />
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-brand-charcoal text-white border-b border-brand-charcoalSoft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal>
                <div className="text-xs font-bold uppercase tracking-widest text-brand-yellow">
                  {dict.whyUs.badge}
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                  {dict.whyUs.title}
                </h2>

                <p className="text-sm sm:text-base text-[#D6D1C7] leading-relaxed font-normal mt-3">
                  {dict.whyUs.subtitle}
                </p>
              </ScrollReveal>

              <div className="space-y-4 pt-2">
                <ScrollReveal delay={100}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{dict.whyUs.point1Title}</h3>
                      <p className="text-xs text-[#A8A296] mt-0.5 leading-relaxed">
                        {dict.whyUs.point1Desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={180}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{dict.whyUs.point2Title}</h3>
                      <p className="text-xs text-[#A8A296] mt-0.5 leading-relaxed">
                        {dict.whyUs.point2Desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={260}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{dict.whyUs.point3Title}</h3>
                      <p className="text-xs text-[#A8A296] mt-0.5 leading-relaxed">
                        {dict.whyUs.point3Desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={340}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-brand-yellow" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{dict.whyUs.point4Title}</h3>
                      <p className="text-xs text-[#A8A296] mt-0.5 leading-relaxed">
                        {dict.whyUs.point4Desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              <ScrollReveal delay={400}>
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>{dict.whyUs.aboutBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={`tel:${siteConfig.primaryPhone}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded bg-brand-charcoalSoft border border-white/15 text-white text-xs font-bold uppercase tracking-wider hover:border-brand-yellow active:scale-[0.98] transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>{dict.whyUs.callBtn} {siteConfig.displayPhone}</span>
                  </a>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-6">
              <ScrollReveal delay={200}>
                <div className="bg-brand-charcoalSoft border border-white/10 rounded-md p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-[11px] uppercase tracking-wideUpper text-brand-yellow font-bold">
                      {dict.whyUs.showroomBoxBadge}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {dict.whyUs.showroomTitle}
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="text-[#A8A296] uppercase tracking-wide font-semibold">{dict.whyUs.addressLabel}</div>
                      <div className="text-white font-medium text-sm mt-0.5 leading-relaxed">
                        {siteConfig.address.fullFormatted}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[#A8A296] uppercase tracking-wide font-semibold">{dict.whyUs.hoursLabel}</div>
                        <div className="text-white font-medium mt-0.5">{dict.whyUs.hoursValue}</div>
                        <div className="text-[#8A8478]">{dict.whyUs.daysValue}</div>
                      </div>
                      <div>
                        <div className="text-[#A8A296] uppercase tracking-wide font-semibold">{dict.whyUs.hotlineLabel}</div>
                        <div className="text-white font-medium mt-0.5">{siteConfig.displayPhone}</div>
                        <div className="text-[#8A8478]">{siteConfig.secondaryPhone}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[#A8A296] uppercase tracking-wide font-semibold">{dict.whyUs.brandLabel}</div>
                      <div className="text-white font-medium mt-0.5">
                        {dict.whyUs.brandValue}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href={getGeneralWhatsAppUrl(language)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded bg-[#25D366] hover:bg-[#20BA5A] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wideUpper transition-all shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{dict.whyUs.whatsappBtn}</span>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-cream/60 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
                {dict.architecture.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
                {dict.architecture.title}
              </h2>
              <p className="text-sm text-brand-muted mt-2 leading-relaxed">
                {dict.architecture.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <VehicleViewer
            category={explorerVehicle.category}
            colors={explorerVehicle.colors}
            hotspots={explorerVehicle.hotspots}
          />

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScrollReveal delay={50}>
              <div className="p-4 rounded bg-white border border-brand-border shadow-xs h-full">
                <div className="text-xs font-bold uppercase tracking-wide text-brand-red">{dict.architecture.bldcTitle}</div>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">{dict.architecture.bldcDesc}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="p-4 rounded bg-white border border-brand-border shadow-xs h-full">
                <div className="text-xs font-bold uppercase tracking-wide text-brand-red">{dict.architecture.frameTitle}</div>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">{dict.architecture.frameDesc}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={190}>
              <div className="p-4 rounded bg-white border border-brand-border shadow-xs h-full">
                <div className="text-xs font-bold uppercase tracking-wide text-brand-red">{dict.architecture.batteryTitle}</div>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">{dict.architecture.batteryDesc}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={260}>
              <div className="p-4 rounded bg-white border border-brand-border shadow-xs h-full">
                <div className="text-xs font-bold uppercase tracking-wide text-brand-red">{dict.architecture.suspensionTitle}</div>
                <p className="text-xs text-brand-muted mt-1 leading-relaxed">{dict.architecture.suspensionDesc}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cream border border-brand-border text-xs font-bold uppercase tracking-wideUpper text-brand-red mb-3">
                <Compass className="w-3.5 h-3.5 text-brand-red" />
                <span>{dict.routesSpotlight.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
                {dict.routesSpotlight.title}
              </h2>
              <p className="text-sm text-brand-muted mt-2 leading-relaxed">
                {dict.routesSpotlight.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal delay={80}>
              <div className="p-6 rounded-md bg-brand-warmWhite border border-brand-border space-y-3 shadow-card hover:-translate-y-1 transition-transform">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-red">
                  01 • PASSENGER TRANSIT
                </span>
                <h3 className="text-lg font-bold text-brand-charcoal">
                  {dict.routesSpotlight.card1Title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {dict.routesSpotlight.card1Desc}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <div className="p-6 rounded-md bg-brand-warmWhite border border-brand-border space-y-3 shadow-card hover:-translate-y-1 transition-transform">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-red">
                  02 • CARGO FREIGHT
                </span>
                <h3 className="text-lg font-bold text-brand-charcoal">
                  {dict.routesSpotlight.card2Title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {dict.routesSpotlight.card2Desc}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="p-6 rounded-md bg-brand-warmWhite border border-brand-border space-y-3 shadow-card hover:-translate-y-1 transition-transform">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-red">
                  03 • BATTERY & RANGE
                </span>
                <h3 className="text-lg font-bold text-brand-charcoal">
                  {dict.routesSpotlight.card3Title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {dict.routesSpotlight.card3Desc}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-warmWhite border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div className="space-y-6">
                <div className="text-xs font-bold uppercase tracking-widest text-brand-red">
                  {dict.financeSection.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
                  {dict.financeSection.title}
                </h2>
                <p className="text-sm sm:text-base text-brand-muted leading-relaxed font-normal">
                  {dict.financeSection.subtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">{dict.financeSection.docTitle}</span>
                    <p className="text-xs text-brand-muted">{dict.financeSection.docDesc}</p>
                  </div>
                  <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">{dict.financeSection.bankTitle}</span>
                    <p className="text-xs text-brand-muted">{dict.financeSection.bankDesc}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/finance"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wideUpper transition-all shadow-xs group"
                  >
                    <span>{dict.financeSection.btnText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="space-y-6">
                <div className="text-xs font-bold uppercase tracking-widest text-brand-red">
                  {dict.servicesSection.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
                  {dict.servicesSection.title}
                </h2>
                <p className="text-sm sm:text-base text-brand-muted leading-relaxed font-normal">
                  {dict.servicesSection.subtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">{dict.servicesSection.diagTitle}</span>
                    <p className="text-xs text-brand-muted">{dict.servicesSection.diagDesc}</p>
                  </div>
                  <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">{dict.servicesSection.sparesTitle}</span>
                    <p className="text-xs text-brand-muted">{dict.servicesSection.sparesDesc}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded bg-brand-charcoal hover:bg-brand-charcoalSoft active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wideUpper transition-all shadow-xs group"
                  >
                    <span>{dict.servicesSection.btnText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-brand-cream border border-brand-border rounded-md p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-red">
                  <MapPin className="w-4 h-4 text-brand-red" />
                  <span>{dict.showroomVisit.badge}</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-charcoal">
                  {dict.showroomVisit.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted max-w-xl leading-relaxed">
                  {dict.showroomVisit.subtitle}
                </p>
                <p className="text-[11px] text-brand-charcoal font-semibold pt-1">
                  ✓ {dict.showroomVisit.parkingNote}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 flex-shrink-0">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{dict.showroomVisit.openMapBtn}</span>
                </a>
                <a
                  href={`tel:${siteConfig.primaryPhone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-white hover:bg-brand-border active:scale-[0.98] border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4 text-brand-red" />
                  <span>{dict.showroomVisit.callShowroomBtn}</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-brand-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-10">
              <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
                {dict.enquiry.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
                {dict.enquiry.title}
              </h2>
              <p className="text-sm text-brand-muted mt-2 leading-relaxed">
                {dict.enquiry.subtitle}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <EnquiryForm sourceContext="Homepage Bottom CTA" />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}