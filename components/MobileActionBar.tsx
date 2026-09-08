"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";
import { useQuoteModal } from "@/context/QuoteModalContext";
import { Phone, MessageSquare, Tag } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function MobileActionBar() {
  const { language, dict } = useLanguage();
  const { openQuoteModal } = useQuoteModal();
  const t = dict.mobileBar;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-brand-border px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-lg">
      <div className="grid grid-cols-3 gap-2">
        <a
          href={`tel:${siteConfig.primaryPhone}`}
          className="flex flex-col items-center justify-center py-1.5 rounded bg-brand-cream border border-brand-border text-brand-charcoal active:bg-brand-border transition-colors"
        >
          <Phone className="w-4 h-4 text-brand-red mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t.callNow}</span>
        </a>

        <a
          href={getGeneralWhatsAppUrl(language)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 rounded bg-[#25D366]/15 border border-[#25D366]/30 text-brand-charcoal active:bg-[#25D366]/25 transition-colors"
        >
          <MessageSquare className="w-4 h-4 text-[#25D366] mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t.whatsapp}</span>
        </a>

        <button
          type="button"
          onClick={() => openQuoteModal()}
          className="flex flex-col items-center justify-center py-1.5 rounded bg-brand-red text-white active:bg-brand-darkRed transition-colors shadow-xs cursor-pointer"
        >
          <Tag className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{t.getQuote}</span>
        </button>
      </div>
    </div>
  );
}