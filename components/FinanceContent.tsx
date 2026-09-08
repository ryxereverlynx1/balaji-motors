"use client";

import React from "react";
import EnquiryForm from "@/components/EnquiryForm";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import {
  FileText,
  HelpCircle,
  Phone,
  MessageSquare,
  BadgeAlert,
} from "lucide-react";
import { siteConfig } from "@/data/site";
import { getFinanceWhatsAppUrl } from "@/lib/whatsapp";

export default function FinanceContent() {
  const { language, dict } = useLanguage();
  const t = dict.financePage;

  const requiredDocuments = [
    {
      title: t.doc1Title,
      desc: t.doc1Desc,
    },
    {
      title: t.doc2Title,
      desc: t.doc2Desc,
    },
    {
      title: t.doc3Title,
      desc: t.doc3Desc,
    },
    {
      title: t.doc4Title,
      desc: t.doc4Desc,
    },
    {
      title: t.doc5Title,
      desc: t.doc5Desc,
    },
    {
      title: t.doc6Title,
      desc: t.doc6Desc,
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      step: "02",
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      step: "03",
      title: t.step3Title,
      desc: t.step3Desc,
    },
    {
      step: "04",
      title: t.step4Title,
      desc: t.step4Desc,
    },
    {
      step: "05",
      title: t.step5Title,
      desc: t.step5Desc,
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

          <div className="mt-6 flex items-start gap-3 p-4 rounded bg-brand-cream border border-brand-border text-xs text-brand-charcoal">
            <BadgeAlert className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold uppercase tracking-wide">{t.noticeLabel}</span> {t.noticeText}
            </p>
          </div>
        </div>

        <div className="mb-16">
          <ScrollReveal>
            <h2 className="text-2xl font-black text-brand-charcoal tracking-tight mb-8">
              {t.checklistTitle}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requiredDocuments.map((doc, idx) => (
              <ScrollReveal key={idx} delay={idx * 70}>
                <div className="p-6 rounded bg-white border border-brand-border space-y-2 shadow-card h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-2 text-brand-charcoal font-bold text-sm">
                    <FileText className="w-4 h-4 text-brand-red" />
                    <span>{doc.title}</span>
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed">{doc.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal>
          <div className="mb-16 bg-brand-cream border border-brand-border rounded-md p-8 shadow-card">
            <h2 className="text-2xl font-black text-brand-charcoal tracking-tight mb-8">
              {t.processTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {processSteps.map((s) => (
                <div key={s.step} className="space-y-2">
                  <div className="text-2xl font-black text-brand-red font-mono">{s.step}</div>
                  <h3 className="text-sm font-bold text-brand-charcoal">{s.title}</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal>
              <h2 className="text-2xl font-black text-brand-charcoal tracking-tight">
                {t.faqTitle}
              </h2>
            </ScrollReveal>

            <div className="space-y-4 text-xs text-brand-charcoal">
              <ScrollReveal delay={80}>
                <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                  <div className="font-bold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
                    <span>{t.faq1Q}</span>
                  </div>
                  <p className="leading-relaxed pl-6 text-brand-muted">
                    {t.faq1A}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                  <div className="font-bold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
                    <span>{t.faq2Q}</span>
                  </div>
                  <p className="leading-relaxed pl-6 text-brand-muted">
                    {t.faq2A}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={240}>
                <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs">
                  <div className="font-bold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
                    <span>{t.faq3Q}</span>
                  </div>
                  <p className="leading-relaxed pl-6 text-brand-muted">
                    {t.faq3A}
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={300}>
              <div className="p-6 rounded bg-brand-cream border border-brand-border space-y-3 shadow-xs">
                <h4 className="text-sm font-bold text-brand-charcoal">{t.directFinanceTitle}</h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {t.directFinanceDesc}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={`tel:${siteConfig.primaryPhone}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{siteConfig.displayPhone}</span>
                  </a>
                  <a
                    href={getFinanceWhatsAppUrl(undefined, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 active:scale-[0.98] border border-[#25D366]/30 text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7">
            <ScrollReveal delay={120}>
              <EnquiryForm
                defaultEnquiryType={language === "hi" ? "??? ? ???? ??????? (EMI)" : "Finance & EMI Guidance"}
                sourceContext="Finance Page"
              />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}