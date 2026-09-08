"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SavingsCalculator() {
  const { dict } = useLanguage();
  const t = dict.calculator;
  const [km, setKm] = useState(100);

  const dieselCostPerKm = 3.5;
  const electricCostPerKm = 0.35;

  const dieselDaily = Math.round(km * dieselCostPerKm);
  const electricDaily = Math.round(km * electricCostPerKm);
  const dailySavings = dieselDaily - electricDaily;
  const monthlySavings = dailySavings * 30;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="bg-white border border-brand-border rounded-md p-4 sm:p-8 lg:p-10 shadow-card">
      <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cream border border-brand-border text-xs font-bold uppercase tracking-wideUpper text-brand-red mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-brand-red" />
          <span>{t.badge}</span>
        </div>
        <h3 className="text-xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
          {t.title}
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          <div className="space-y-3 bg-brand-warmWhite p-4 sm:p-5 rounded border border-brand-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                {t.dailyKmLabel}
              </label>
              <span className="text-base sm:text-lg font-black text-brand-red font-mono px-2.5 py-0.5 rounded bg-brand-lightRed border border-brand-red/30">
                {km} km
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={150}
              step={5}
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-red"
            />
            <div className="flex justify-between text-[10px] sm:text-[11px] text-brand-muted font-bold">
              <span>60 km</span>
              <span>100 km (सामान्य)</span>
              <span>150 km</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="p-3.5 sm:p-4 rounded bg-brand-cream border border-brand-border space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase text-brand-muted">
                {t.dieselCostLabel}
              </span>
              <div className="text-lg sm:text-xl font-black text-brand-charcoal">₹{dieselDaily} {t.perDaySuffix}</div>
              <div className="text-[10px] text-brand-muted">{t.dieselRate}</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded bg-brand-lightRed/50 border border-brand-red/30 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase text-brand-red">
                {t.electricCostLabel}
              </span>
              <div className="text-lg sm:text-xl font-black text-brand-red">₹{electricDaily} {t.perDaySuffix}</div>
              <div className="text-[10px] text-brand-red font-semibold">{t.electricRate}</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-gradient-to-br from-brand-charcoal to-brand-charcoalSoft text-white p-5 sm:p-8 rounded-md space-y-5 shadow-elevated">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wideUpper text-brand-yellow font-bold">
              {t.monthlySavingsLabel}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-1 tracking-tight break-words">
              ₹{monthlySavings.toLocaleString("en-IN")}
              <span className="text-xs sm:text-base font-normal text-[#D6D1C7] ml-2">
                {t.perMonthSuffix}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wide text-[#A8A296]">
                {t.dailySavingsLabel}
              </span>
              <div className="text-base sm:text-lg font-bold text-brand-yellow mt-0.5">
                +₹{dailySavings} {t.perDaySuffix}
              </div>
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wide text-[#A8A296]">
                {t.annualSavingsLabel}
              </span>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                +₹{annualSavings.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-1 text-xs text-[#D6D1C7] leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-brand-yellow flex-shrink-0 mt-0.5" />
            <p>{t.benefitNote}</p>
          </div>

          <div className="pt-2">
            <Link
              href="/finance"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-sm"
            >
              <span>{t.enquireFinanceBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
