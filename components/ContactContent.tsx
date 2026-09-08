"use client";

import React from "react";
import { siteConfig } from "@/data/site";
import EnquiryForm from "@/components/EnquiryForm";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import {
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function ContactContent() {
  const { language, dict } = useLanguage();
  const t = dict.contactPage;

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Balaji Motors Avtar Nagar Road Gujral Nagar Jalandhar Punjab"
  )}`;

  return (
    <div className="pt-24 pb-20 sm:pt-32 sm:pb-28 bg-brand-warmWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-brand-border pb-10 mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
            {t.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-charcoal tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-brand-muted mt-3 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal>
              <div className="bg-brand-cream border border-brand-border rounded-md p-6 sm:p-8 space-y-6 shadow-card">
                <div className="border-b border-brand-border pb-4">
                  <span className="text-xs font-bold uppercase tracking-wide text-brand-red">
                    {t.headOfficeBadge}
                  </span>
                  <h3 className="text-xl font-bold text-brand-charcoal mt-1">{siteConfig.name}</h3>
                  <p className="text-xs text-brand-muted mt-0.5">{siteConfig.legalName}</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-brand-muted uppercase font-bold">{t.addressLabel}</div>
                      <div className="text-brand-charcoal font-semibold mt-0.5 text-sm leading-relaxed">
                        {siteConfig.address.street}
                      </div>
                      <div className="text-brand-muted mt-0.5">
                        {siteConfig.address.landmark}
                      </div>
                      <div className="text-brand-muted">
                        {siteConfig.address.city}, {siteConfig.address.state} - {siteConfig.address.pincode}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <Phone className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-brand-muted uppercase font-bold">{t.phoneLinesLabel}</div>
                      <div className="text-brand-charcoal font-bold mt-0.5 text-sm">
                        <a href={`tel:${siteConfig.primaryPhone}`} className="hover:text-brand-red">
                          {siteConfig.displayPhone}
                        </a>
                      </div>
                      <div className="text-brand-muted mt-0.5">
                        <a href={`tel:${siteConfig.secondaryPhone}`} className="hover:text-brand-red">
                          {siteConfig.secondaryPhone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <Clock className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-brand-muted uppercase font-bold">{t.hoursLabel}</div>
                      <div className="text-brand-charcoal font-semibold mt-0.5">
                        {language === "hi" ? "सोमवार - शनिवार: सुबह 9:30 से शाम 7:30" : "Monday - Saturday: 9:30 AM - 7:30 PM"}
                      </div>
                      <div className="text-brand-muted mt-0.5">
                        {language === "hi" ? "रविवार: सुबह 10:30 से शाम 4:00 (अपॉइंटमेंट द्वारा)" : "Sunday: 10:30 AM - 4:00 PM (By Appointment)"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border space-y-2">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{t.directionsBtn}</span>
                  </a>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${siteConfig.primaryPhone}`}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-white hover:bg-brand-border active:scale-[0.98] border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-red" />
                      <span>{t.callUsBtn}</span>
                    </a>

                    <a
                      href={getGeneralWhatsAppUrl(language)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 active:scale-[0.98] border border-[#25D366]/30 text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>{t.whatsappBtn}</span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7">
            <ScrollReveal delay={120}>
              <EnquiryForm sourceContext="Contact Us Page" />
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal>
          <div className="bg-brand-cream border border-brand-border rounded-md p-6 sm:p-8 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-brand-red">
                  {t.mapCardBadge}
                </span>
                <h3 className="text-xl font-bold text-brand-charcoal mt-1">{t.mapCardTitle}</h3>
              </div>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-red hover:text-brand-darkRed group"
              >
                <span>{t.openInMaps}</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="relative w-full h-[300px] sm:h-[360px] bg-white border border-brand-border rounded-md overflow-hidden flex flex-col items-center justify-center text-center p-6 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-brand-lightRed border border-brand-red/20 flex items-center justify-center mb-3 text-brand-red shadow-xs">
                <MapPin className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-brand-charcoal">Balaji Motors Showroom</h4>
              <p className="text-xs text-brand-muted max-w-md mt-1 leading-relaxed">
                {siteConfig.address.fullFormatted}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  {t.gpsBtn}
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}