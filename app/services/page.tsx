"use client";

import React from "react";
import { siteConfig } from "@/data/site";
import EnquiryForm from "@/components/EnquiryForm";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import {
  Wrench,
  Battery,
  ShieldCheck,
  Cpu,
  RotateCcw,
  Sparkles,
  Phone,
  MessageSquare,
} from "lucide-react";
import { getServiceWhatsAppUrl } from "@/lib/whatsapp";

export default function ServicesPage() {
  const { language, dict } = useLanguage();
  const t = dict.servicesPage;

  const serviceOfferings = [
    {
      icon: Wrench,
      title: t.card1Title,
      description: t.card1Desc,
    },
    {
      icon: Battery,
      title: t.card2Title,
      description: t.card2Desc,
    },
    {
      icon: Cpu,
      title: t.card3Title,
      description: t.card3Desc,
    },
    {
      icon: ShieldCheck,
      title: t.card4Title,
      description: t.card4Desc,
    },
    {
      icon: RotateCcw,
      title: t.card5Title,
      description: t.card5Desc,
    },
    {
      icon: Sparkles,
      title: t.card6Title,
      description: t.card6Desc,
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {serviceOfferings.map((service, idx) => {
            const Icon = service.icon;
            return (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className="bg-white border border-brand-border hover:border-brand-red/30 rounded-md p-6 space-y-4 transition-all shadow-card h-full hover:-translate-y-1">
                  <div className="w-10 h-10 rounded bg-brand-lightRed border border-brand-red/20 flex items-center justify-center text-brand-red">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-charcoal">{service.title}</h3>
                  <p className="text-xs text-brand-muted leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal>
          <div className="bg-brand-cream border border-brand-border rounded-md p-8 mb-16 shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wideUpper text-brand-red">
                  {t.directHelpBadge}
                </span>
                <h3 className="text-2xl font-bold text-brand-charcoal">
                  {t.directHelpTitle}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {t.directHelpDesc}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <a
                  href={getServiceWhatsAppUrl(language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-[#25D366] hover:bg-[#20BA5A] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.whatsappDeskBtn}</span>
                </a>
                <a
                  href={`tel:${siteConfig.primaryPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-white hover:bg-brand-border active:scale-[0.98] border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4 text-brand-red" />
                  <span>{t.callDeskBtn}</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal>
              <h2 className="text-2xl font-black text-brand-charcoal tracking-tight">
                {t.tipsTitle}
              </h2>
            </ScrollReveal>

            <div className="space-y-4 text-xs text-brand-charcoal leading-relaxed">
              <ScrollReveal delay={80}>
                <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                  <h4 className="font-bold text-brand-charcoal text-sm">{t.tip1Title}</h4>
                  <p className="text-brand-muted">{t.tip1Desc}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                  <h4 className="font-bold text-brand-charcoal text-sm">{t.tip2Title}</h4>
                  <p className="text-brand-muted">{t.tip2Desc}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={240}>
                <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                  <h4 className="font-bold text-brand-charcoal text-sm">{t.tip3Title}</h4>
                  <p className="text-brand-muted">{t.tip3Desc}</p>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="lg:col-span-6">
            <ScrollReveal delay={120}>
              <EnquiryForm
                defaultEnquiryType={language === "hi" ? "बैटरी जांच व रिपेयर सर्विस" : "Battery Diagnostics / Service"}
                sourceContext="Services Page"
              />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}