"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/context/LanguageContext";

export default function WhatsAppButton() {
  const { language } = useLanguage();

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      <a
        href={getGeneralWhatsAppUrl(language)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-elevated transition-all duration-200 hover:scale-105 active:scale-95 border border-white/20"
        aria-label="Chat with Balaji Motors on WhatsApp"
      >
        <MessageSquare className="w-4 h-4 fill-current" />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
          WhatsApp
        </span>
      </a>
    </aside>
  );
}