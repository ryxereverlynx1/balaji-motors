"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const { dict } = useLanguage();
  const t = dict.notFound;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24 text-center bg-brand-warmWhite">
      <div className="max-w-md mx-auto space-y-5">
        <div className="text-6xl font-black text-brand-red font-mono">404</div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-brand-muted leading-relaxed">
          {t.desc}
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.returnHome}</span>
          </Link>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-white hover:bg-brand-cream active:scale-[0.98] border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.viewCatalogue}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}