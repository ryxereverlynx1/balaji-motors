"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";
import ScrollReveal from "@/components/ScrollReveal";
import {
  MapPin,
  ShieldCheck,
  Wrench,
  Users,
  Phone,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  const { dict } = useLanguage();
  const t = dict.aboutPage;

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
                {t.storyTitle}
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed font-normal mt-3">
                {t.storyP1}
              </p>
              <p className="text-sm text-brand-muted leading-relaxed font-normal mt-3">
                {t.storyP2}
              </p>
            </ScrollReveal>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScrollReveal delay={80}>
                <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs h-full">
                  <span className="text-xs font-bold uppercase text-brand-charcoal">{t.feature1Title}</span>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {t.feature1Desc}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <div className="p-4 rounded bg-white border border-brand-border space-y-1 shadow-xs h-full">
                  <span className="text-xs font-bold uppercase text-brand-charcoal">{t.feature2Title}</span>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    {t.feature2Desc}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ScrollReveal delay={120}>
              <div className="bg-brand-cream border border-brand-border rounded-md p-8 space-y-6 shadow-card">
                <div className="border-b border-brand-border pb-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-brand-red">
                    {t.coordsBadge}
                  </div>
                  <h3 className="text-xl font-bold text-brand-charcoal mt-1">{t.coordsTitle}</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-brand-muted uppercase font-bold">{t.coordsLocationLabel}</div>
                      <div className="text-brand-charcoal font-semibold mt-0.5 leading-relaxed">
                        {siteConfig.address.fullFormatted}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-brand-muted uppercase font-bold">{t.coordsFocusLabel}</div>
                      <div className="text-brand-charcoal font-semibold mt-0.5 leading-relaxed">
                        {t.coordsFocusValue}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wrench className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-brand-muted uppercase font-bold">{t.coordsServiceLabel}</div>
                      <div className="text-brand-charcoal font-semibold mt-0.5 leading-relaxed">
                        {t.coordsServiceValue}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-border">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs group"
                  >
                    <span>{t.visitShowroomBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="mb-16">
          <ScrollReveal>
            <h2 className="text-2xl font-black text-brand-charcoal tracking-tight mb-8">
              {t.commitmentsTitle}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={80}>
              <div className="bg-white border border-brand-border rounded-md p-6 space-y-3 shadow-card h-full hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded bg-brand-lightRed border border-brand-red/20 flex items-center justify-center text-brand-red">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-brand-charcoal">{t.commit1Title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {t.commit1Desc}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <div className="bg-white border border-brand-border rounded-md p-6 space-y-3 shadow-card h-full hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded bg-brand-lightRed border border-brand-red/20 flex items-center justify-center text-brand-red">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-brand-charcoal">{t.commit2Title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {t.commit2Desc}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={240}>
              <div className="bg-white border border-brand-border rounded-md p-6 space-y-3 shadow-card h-full hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded bg-brand-lightRed border border-brand-red/20 flex items-center justify-center text-brand-red">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-brand-charcoal">{t.commit3Title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {t.commit3Desc}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal>
          <div className="bg-brand-cream border border-brand-border rounded-md p-8 text-center space-y-4 shadow-card">
            <h3 className="text-2xl font-bold text-brand-charcoal">
              {t.meetTeamTitle}
            </h3>
            <p className="text-sm text-brand-muted max-w-xl mx-auto leading-relaxed">
              {t.meetTeamSubtitle}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs group"
              >
                <span>{t.visitShowroomBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href={`tel:${siteConfig.primaryPhone}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded bg-white hover:bg-brand-border active:scale-[0.98] border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                <Phone className="w-4 h-4 text-brand-red" />
                <span>Call {siteConfig.displayPhone}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}