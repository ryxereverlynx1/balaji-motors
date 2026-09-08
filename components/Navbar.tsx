"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";
import { useQuoteModal } from "@/context/QuoteModalContext";
import { Phone, MessageSquare, ArrowRight, Globe } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, dict, isHindi } = useLanguage();
  const { openQuoteModal } = useQuoteModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: dict.nav.home, href: "/" },
    { label: dict.nav.vehicles, href: "/vehicles" },
    { label: dict.nav.services, href: "/services" },
    { label: dict.nav.finance, href: "/finance" },
    { label: dict.nav.about, href: "/about" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-brand-red z-50 pointer-events-none transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-brand-warmWhite/95 backdrop-blur-md border-b border-brand-border py-2 shadow-sm"
            : "bg-brand-warmWhite/90 backdrop-blur-sm border-b border-brand-border/60 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="group flex flex-col shrink min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-brand-charcoal uppercase group-hover:text-brand-red transition-colors truncate">
                  BALAJI MOTORS
                </span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-yellow shadow-xs shrink-0" />
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-wideUpper uppercase text-brand-muted font-bold -mt-0.5 truncate">
                JALANDHAR • E-RICKSHAWS
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "text-brand-red font-extrabold"
                        : "text-brand-charcoal hover:text-brand-red"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-red rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden sm:flex items-center gap-3">
              <div className="inline-flex items-center p-0.5 rounded-full bg-brand-cream border border-brand-border shadow-xs text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    isHindi
                      ? "bg-brand-red text-white shadow-xs"
                      : "text-brand-charcoal hover:text-brand-red"
                  }`}
                  aria-label="Switch to Hindi"
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    !isHindi
                      ? "bg-brand-red text-white shadow-xs"
                      : "text-brand-charcoal hover:text-brand-red"
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
              </div>

              <a
                href={`tel:${siteConfig.primaryPhone}`}
                className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-brand-charcoal hover:text-brand-red px-2 py-1 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-brand-red" />
                <span>{siteConfig.displayPhone}</span>
              </a>

              <button
                type="button"
                onClick={() => openQuoteModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] active:translate-y-0.5 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm group cursor-pointer"
              >
                <span>{dict.nav.getQuote}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="inline-flex sm:hidden items-center p-0.5 rounded-full bg-brand-cream border border-brand-border text-[9px] sm:text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full ${
                    isHindi ? "bg-brand-red text-white" : "text-brand-charcoal"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-full ${
                    !isHindi ? "bg-brand-red text-white" : "text-brand-charcoal"
                  }`}
                >
                  EN
                </button>
              </div>

              <a
                href={`tel:${siteConfig.primaryPhone}`}
                className="p-1.5 sm:p-2 rounded bg-brand-cream border border-brand-border text-brand-charcoal hover:text-brand-red"
                aria-label="Call Balaji Motors"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-red" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded bg-brand-cream border border-brand-border text-brand-charcoal hover:text-brand-red transition-colors flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9"
                aria-label="Toggle Navigation Menu"
              >
                <div className="relative w-4 h-3.5 flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 transform origin-center ${
                      mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-current rounded-full transition-opacity duration-200 ${
                      mobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 transform origin-center ${
                      mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-warmWhite border-b border-brand-border px-4 pt-3 pb-6 space-y-3 shadow-elevated animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-brand-border">
              <span className="text-xs font-bold uppercase tracking-wide text-brand-muted flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-red" />
                <span>भाषा / Language</span>
              </span>
              <div className="inline-flex items-center p-0.5 rounded-full bg-brand-cream border border-brand-border text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    isHindi ? "bg-brand-red text-white" : "text-brand-charcoal"
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-full transition-all ${
                    !isHindi ? "bg-brand-red text-white" : "text-brand-charcoal"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-1 pt-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2.5 rounded text-sm font-bold uppercase tracking-wide transition-colors ${
                      isActive
                        ? "text-brand-red bg-brand-cream/80"
                        : "text-brand-charcoal hover:text-brand-red hover:bg-brand-cream/40"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-brand-border space-y-2.5">
              <div className="text-xs text-brand-muted px-3 leading-relaxed">
                {dict.nav.showroomAddress}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${siteConfig.primaryPhone}`}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-brand-cream border border-brand-border text-xs font-bold text-brand-charcoal uppercase tracking-wider active:bg-brand-border"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-red" />
                  <span>{dict.nav.callUs}</span>
                </a>
                <a
                  href={getGeneralWhatsAppUrl(language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded bg-[#25D366]/15 border border-[#25D366]/30 text-xs font-bold text-brand-charcoal uppercase tracking-wider active:bg-[#25D366]/25"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openQuoteModal();
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
              >
                <span>{dict.nav.getQuote}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}