"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Calculator, IndianRupee, Clock, Percent, ShieldCheck, ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import { siteConfig } from "@/data/site";

export default function LoanCalculator() {
  const { isHindi } = useLanguage();

  const [price, setPrice] = useState<number>(165000);
  const [downPayment, setDownPayment] = useState<number>(35000);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [interestRate, setInterestRate] = useState<number>(11.5);

  const maxDownPayment = Math.max(10000, price - 20000);
  const actualDownPayment = Math.min(downPayment, maxDownPayment);

  const { principal, monthlyEmi, dailyCost, totalInterest, totalPayment, principalPct, interestPct } = useMemo(() => {
    const p = Math.max(10000, price - actualDownPayment);
    const monthlyRate = interestRate / (12 * 100);
    const n = tenureMonths;

    let emi = 0;
    if (monthlyRate > 0) {
      emi = Math.round((p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
    } else {
      emi = Math.round(p / n);
    }

    const totalPay = emi * n;
    const interest = totalPay - p;
    const pPct = totalPay > 0 ? Math.round((p / totalPay) * 100) : 100;
    const iPct = 100 - pPct;
    const daily = Math.round(emi / 30);

    return {
      principal: p,
      monthlyEmi: emi,
      dailyCost: daily,
      totalInterest: interest,
      totalPayment: totalPay,
      principalPct: pPct,
      interestPct: iPct,
    };
  }, [price, actualDownPayment, tenureMonths, interestRate]);

  const formatInr = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const tenurePresets = [12, 18, 24, 36, 48];

  const handlePriceChange = (val: number) => {
    setPrice(val);
    if (downPayment > val - 20000) {
      setDownPayment(Math.max(15000, Math.round((val * 0.2) / 5000) * 5000));
    }
  };

  const shareWhatsApp = () => {
    const text = isHindi
      ? `नमस्ते बालाजी मोटर्स! मैंने आपकी वेबसाइट पर ई-रिक्शा लोन ईएमआई चेक किया:\n• वाहन मूल्य: ${formatInr(price)}\n• डाउन पेमेंट: ${formatInr(actualDownPayment)}\n• लोन राशि: ${formatInr(principal)}\n• समय अवधि: ${tenureMonths} महीने\n• अनुमानित ब्याज दर: ${interestRate}%\n• अनुमानित मासिक ईएमआई: ${formatInr(monthlyEmi)}/महीना (लगभग ₹${dailyCost}/दिन)\nकृपया मुझे लोन प्रक्रिया और आवश्यक दस्तावेजों की जानकारी दें।`
      : `Hello Balaji Motors! I checked the E-Rickshaw Loan EMI calculator on your website:\n• Vehicle Price: ${formatInr(price)}\n• Down Payment: ${formatInr(actualDownPayment)}\n• Loan Principal: ${formatInr(principal)}\n• Tenure: ${tenureMonths} Months\n• Est. Interest Rate: ${interestRate}%\n• Est. Monthly EMI: ${formatInr(monthlyEmi)}/month (~₹${dailyCost}/day)\nPlease guide me regarding loan sanction and documents.`;

    const cleanPhone = siteConfig.whatsappNumber;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const scrollToEnquiry = () => {
    const elem = document.getElementById("finance-enquiry-form");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-lg overflow-hidden mb-16">
      <div className="bg-gradient-to-r from-brand-charcoal via-stone-900 to-brand-charcoal text-white p-6 sm:p-8 border-b border-brand-charcoal/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>{isHindi ? "इंटरेक्टिव ईएमआई कैलकुलेटर" : "Interactive EMI Calculator"}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-warmWhite">
              {isHindi ? "अपने ई-रिक्शा की मासिक किश्त जानें" : "Calculate Your Monthly E-Rickshaw EMI"}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              {isHindi
                ? "डाउन पेमेंट और अवधि चुनकर अपनी सुविधानुसार किश्त का तुरंत अनुमान लगाएं।"
                : "Adjust down payment, loan tenure, and interest rate to see real-time payment breakdown."}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/10 text-xs font-semibold text-stone-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isHindi ? "आसान बैंक व NBFC फाइनेंस" : "Instant Bank & NBFC Guidance"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-brand-border">
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-7 bg-brand-warmWhite/40">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-brand-red" />
                <span>{isHindi ? "अनुमानित वाहन मूल्य" : "Estimated Vehicle Price"}</span>
              </label>
              <span className="text-base sm:text-lg font-black text-brand-charcoal font-mono">
                {formatInr(price)}
              </span>
            </div>
            <input
              type="range"
              min={110000}
              max={300000}
              step={5000}
              value={price}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full accent-brand-red cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-semibold text-brand-muted font-mono">
              <span>₹1,10,000</span>
              <span>₹2,00,000</span>
              <span>₹3,00,000</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-brand-red" />
                <span>{isHindi ? "डाउन पेमेंट राशि" : "Down Payment Amount"}</span>
              </label>
              <div className="text-right">
                <span className="text-base sm:text-lg font-black text-brand-charcoal font-mono">
                  {formatInr(actualDownPayment)}
                </span>
                <span className="text-[11px] font-semibold text-brand-muted block">
                  ({Math.round((actualDownPayment / price) * 100)}% {isHindi ? "वाहन मूल्य का" : "of vehicle price"})
                </span>
              </div>
            </div>
            <input
              type="range"
              min={15000}
              max={maxDownPayment}
              step={5000}
              value={actualDownPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-brand-red cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-semibold text-brand-muted font-mono">
              <span>₹15,000</span>
              <span>{formatInr(Math.round(maxDownPayment / 2))}</span>
              <span>{formatInr(maxDownPayment)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-red" />
                <span>{isHindi ? "ऋण अवधि (महीने)" : "Loan Tenure (Months)"}</span>
              </label>
              <span className="text-base sm:text-lg font-black text-brand-charcoal font-mono">
                {tenureMonths} {isHindi ? "महीने" : "Months"}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {tenurePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTenureMonths(preset)}
                  className={`py-2 px-1 text-xs font-bold rounded border transition-all text-center ${
                    tenureMonths === preset
                      ? "bg-brand-red text-white border-brand-red shadow-sm"
                      : "bg-white text-brand-charcoal border-brand-border hover:border-brand-charcoal/40"
                  }`}
                >
                  {preset}M
                </button>
              ))}
            </div>
            <input
              type="range"
              min={12}
              max={48}
              step={6}
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full accent-brand-red cursor-pointer h-2 bg-stone-200 rounded-lg mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-charcoal flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-brand-red" />
                <span>{isHindi ? "अनुमानित वार्षिक ब्याज दर (% p.a.)" : "Interest Rate (% p.a.)"}</span>
              </label>
              <span className="text-base sm:text-lg font-black text-brand-charcoal font-mono">
                {interestRate.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={8.5}
              max={18.0}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-brand-red cursor-pointer h-2 bg-stone-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-semibold text-brand-muted font-mono">
              <span>8.5% (Best Bank)</span>
              <span>11.5% (Typical)</span>
              <span>18.0% (NBFC)</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 bg-white flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-gradient-to-br from-brand-cream to-white border-2 border-brand-red/20 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-red">
                    {isHindi ? "मासिक किश्त (अनुमानित)" : "Estimated Monthly EMI"}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-brand-charcoal font-mono tracking-tight mt-1">
                    {formatInr(monthlyEmi)}
                    <span className="text-xs font-semibold text-brand-muted font-sans ml-1">
                      {isHindi ? "/ माह" : "/ month"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>~₹{dailyCost} / {isHindi ? "दिन" : "day"}</span>
                  </div>
                  <p className="text-[10px] text-brand-muted mt-1">
                    {isHindi ? "दैनिक आमदनी से आसानी से अदा" : "Easily covered by daily transit"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-brand-charcoal">
                <span>{isHindi ? "भुगतान विवरण" : "Breakdown"}</span>
                <span className="text-brand-muted font-normal">
                  {principalPct}% {isHindi ? "मूल राशि" : "Principal"} / {interestPct}% {isHindi ? "ब्याज" : "Interest"}
                </span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-100 border border-brand-border">
                <div
                  style={{ width: `${principalPct}%` }}
                  className="bg-brand-charcoal transition-all duration-300"
                  title={`Principal: ${formatInr(principal)}`}
                />
                <div
                  style={{ width: `${interestPct}%` }}
                  className="bg-brand-red transition-all duration-300"
                  title={`Interest: ${formatInr(totalInterest)}`}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-brand-muted">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-charcoal inline-block" />
                  <span>{isHindi ? "मूल ऋण राशि" : "Loan Principal"}: <strong className="text-brand-charcoal">{formatInr(principal)}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-red inline-block" />
                  <span>{isHindi ? "कुल ब्याज" : "Total Interest"}: <strong className="text-brand-charcoal">{formatInr(totalInterest)}</strong></span>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-brand-charcoal">
                <span className="font-semibold">{isHindi ? "कुल चुकता राशि (लोन + ब्याज)" : "Total Amount Payable"}</span>
                <span className="font-black font-mono text-sm">{formatInr(totalPayment)}</span>
              </div>
              <div className="flex justify-between text-brand-charcoal">
                <span className="font-semibold">{isHindi ? "डाउन पेमेंट (शुरुआत में)" : "Initial Down Payment"}</span>
                <span className="font-bold font-mono">{formatInr(actualDownPayment)}</span>
              </div>
              <p className="text-[10px] text-brand-muted pt-1 leading-relaxed">
                {isHindi
                  ? "नोट: यह केवल एक सांकेतिक गणना है। वास्तविक ईएमआई बैंक की क्रेडिट नीति, फाइल चार्ज और ब्याज दर पर निर्भर करती है।"
                  : "Note: Indicative calculation only. Final EMI depends on bank credit policies, processing fees, and document verification."}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={shareWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>{isHindi ? "व्हाट्सएप पर ईएमआई विवरण भेजें" : "Share EMI on WhatsApp"}</span>
            </button>
            <button
              type="button"
              onClick={scrollToEnquiry}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-charcoal hover:bg-brand-red text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>{isHindi ? "लोन के लिए अभी आवेदन करें" : "Apply for Finance Approval"}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
