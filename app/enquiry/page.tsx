"use client";

import React from "react";
import { siteConfig } from "@/data/site";
import EnquiryForm from "@/components/EnquiryForm";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, MessageSquare, ShieldCheck, Clock } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function EnquiryPage() {
  const { language, dict } = useLanguage();
  const t = dict.enquiryPage;

  return (
    <div className="pt-24 pb-20 sm:pt-32 sm:pb-28 bg-brand-warmWhite min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
            {t.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-charcoal tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm sm:text-base text-brand-muted mt-3 max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <ScrollReveal delay={50}>
            <div className="p-4 rounded bg-white border border-brand-border flex items-center gap-3 text-xs shadow-card h-full">
              <ShieldCheck className="w-5 h-5 text-brand-red flex-shrink-0" />
              <div>
                <div className="font-bold text-brand-charcoal uppercase">{t.trust1Title}</div>
                <div className="text-brand-muted">{t.trust1Desc}</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="p-4 rounded bg-white border border-brand-border flex items-center gap-3 text-xs shadow-card h-full">
              <Clock className="w-5 h-5 text-brand-red flex-shrink-0" />
              <div>
                <div className="font-bold text-brand-charcoal uppercase">{t.trust2Title}</div>
                <div className="text-brand-muted">{t.trust2Desc}</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={190}>
            <div className="p-4 rounded bg-white border border-brand-border flex items-center gap-3 text-xs shadow-card h-full">
              <Phone className="w-5 h-5 text-brand-red flex-shrink-0" />
              <div>
                <div className="font-bold text-brand-charcoal uppercase">{t.trust3Title}</div>
                <a href={`tel:${siteConfig.primaryPhone}`} className="text-brand-red font-bold hover:underline">
                  {siteConfig.displayPhone}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={100}>
          <EnquiryForm sourceContext="Dedicated Enquiry Page" />
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="mt-8 p-6 rounded bg-brand-cream border border-brand-border text-center space-y-3 shadow-card">
            <h4 className="text-sm font-bold text-brand-charcoal tracking-wide">
              {t.instantWhatsappTitle}
            </h4>
            <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
              {t.instantWhatsappSubtitle}
            </p>
            <div className="pt-1">
              <a
                href={getGeneralWhatsAppUrl(language)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#25D366] hover:bg-[#20BA5A] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.messageWhatsappBtn}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}