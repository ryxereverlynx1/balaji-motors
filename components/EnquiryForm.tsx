"use client";

import React, { useState, useEffect } from "react";
import { vehiclesData, getLocalizedVehicle } from "@/data/vehicles";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { Send, CheckCircle2, MessageSquare, AlertCircle, Download, Loader2 } from "lucide-react";

interface EnquiryFormProps {
  preselectedVehicle?: string;
  defaultEnquiryType?: string;
  sourceContext?: string;
}

export default function EnquiryForm({
  preselectedVehicle,
  defaultEnquiryType,
  sourceContext = "Website Enquiry",
}: EnquiryFormProps) {
  const { language, dict, isHindi } = useLanguage();
  const t = dict.enquiry;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Jalandhar");
  const [vehicle, setVehicle] = useState(preselectedVehicle || "BAXY Super King E-Rickshaw");
  const [enquiryType, setEnquiryType] = useState(defaultEnquiryType || t.options.onRoadPrice);
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [availableVehicles, setAvailableVehicles] = useState(vehiclesData);

  useEffect(() => {
    async function loadDynamic() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data.vehicles)
            ? data.vehicles
            : Array.isArray(data.products)
            ? data.products
            : null;
          if (list !== null) {
            setAvailableVehicles(list);
          }
        }
      } catch {}
    }
    loadDynamic();
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = t.errors.name;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = t.errors.phone;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          city,
          vehicle,
          enquiryType,
          quantity: 1,
          preferredContact: "Phone Call",
          notes: notes ? `${notes} (Source: ${sourceContext})` : `Source: ${sourceContext}`,
          language,
          hp_company_url: honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }

      setReferenceId(data.referenceId || "BM-2026-000101");
      if (data.customerPdfBase64) {
        setPdfBase64(data.customerPdfBase64);
      }
      setIsSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error submitting enquiry.";
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPdf = () => {
    if (pdfBase64) {
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Balaji-Motors-Quote-${referenceId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (referenceId) {
      window.open(`/api/enquiry/${referenceId}/pdf`, "_blank");
    }
  };

  const handleSendToWhatsApp = () => {
    let message = "";
    if (language === "hi") {
      message = `नमस्ते बालाजी मोटर्स,\n\nमैंने वेबसाइट पर पूछताछ दर्ज की है (Ref: ${referenceId}):\n- नाम: ${fullName.trim()}\n- फोन: ${phone.trim()}\n- स्थान: ${city.trim()}\n- वाहन: ${vehicle}\n- विषय: ${enquiryType}${notes ? `\n- विवरण: ${notes.trim()}` : ""}`;
    } else {
      message = `Hello Balaji Motors,\n\nI have registered an enquiry on the website (Ref: ${referenceId}):\n- Name: ${fullName.trim()}\n- Phone: ${phone.trim()}\n- Location: ${city.trim()}\n- Vehicle: ${vehicle}\n- Enquiry Type: ${enquiryType}${notes ? `\n- Notes: ${notes.trim()}` : ""}`;
    }
    const url = createWhatsAppUrl(message);
    window.open(url, "_blank");
  };

  if (isSubmitted) {
    return (
      <div className="bg-white border border-brand-border rounded-md p-8 text-center space-y-4 shadow-card animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-full bg-brand-lightRed border border-brand-red/30 flex items-center justify-center mx-auto text-brand-red">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="inline-block px-3 py-1 rounded bg-brand-cream border border-brand-border text-xs font-mono font-bold text-brand-red">
          {referenceId}
        </div>

        <h3 className="text-xl font-bold text-brand-charcoal">{t.successTitle}</h3>
        <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
          {t.successDesc}
        </p>

        <div className="pt-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={downloadPdf}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isHindi ? "कोटेशन PDF डाउनलोड करें" : "Download PDF Summary"}</span>
          </button>

          <button
            type="button"
            onClick={handleSendToWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.whatsappForwardBtn}</span>
          </button>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setReferenceId("");
              setPdfBase64(null);
              setFullName("");
              setPhone("");
              setNotes("");
            }}
            className="text-xs font-bold text-brand-muted hover:text-brand-charcoal underline uppercase tracking-wider cursor-pointer"
          >
            {t.submitAnotherBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-md p-4 sm:p-8 space-y-4 sm:space-y-5 shadow-card">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-brand-charcoal uppercase tracking-tight">
          {t.formTitle}
        </h3>
        <p className="text-xs text-brand-muted">
          {t.formSubtitle}
        </p>
      </div>

      {serverError && (
        <div className="p-3 rounded bg-brand-lightRed border border-brand-red/30 flex items-start gap-2 text-xs text-brand-red">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <input
        type="text"
        name="hp_company_url"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wideUpper text-brand-charcoal">
            {t.fullName} <span className="text-brand-red">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t.namePlaceholder}
            className="w-full px-3.5 py-2.5 rounded bg-brand-warmWhite border border-brand-border text-brand-charcoal placeholder-brand-muted/60 text-base sm:text-sm focus:outline-none focus:border-brand-red transition-colors"
          />
          {errors.fullName && (
            <p className="text-[11px] text-brand-red flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wideUpper text-brand-charcoal">
            {t.mobileNumber} <span className="text-brand-red">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.phonePlaceholder}
            className="w-full px-3.5 py-2.5 rounded bg-brand-warmWhite border border-brand-border text-brand-charcoal placeholder-brand-muted/60 text-base sm:text-sm focus:outline-none focus:border-brand-red transition-colors"
          />
          {errors.phone && (
            <p className="text-[11px] text-brand-red flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wideUpper text-brand-charcoal">
            {t.vehicleInterested}
          </label>
          <select
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded bg-brand-warmWhite border border-brand-border text-brand-charcoal text-base sm:text-sm focus:outline-none focus:border-brand-red transition-colors"
          >
            {availableVehicles.map((v) => {
              const locV = getLocalizedVehicle(v, language);
              return (
                <option key={v.id} value={locV.name} className="bg-white text-brand-charcoal">
                  {locV.name} ({locV.category})
                </option>
              );
            })}
            <option value="All Models / Needs Recommendation" className="bg-white text-brand-charcoal">
              {t.options.allModels}
            </option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wideUpper text-brand-charcoal">
            {t.enquiryType}
          </label>
          <select
            value={enquiryType}
            onChange={(e) => setEnquiryType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded bg-brand-warmWhite border border-brand-border text-brand-charcoal text-base sm:text-sm focus:outline-none focus:border-brand-red transition-colors"
          >
            <option value="Vehicle On-Road Price" className="bg-white text-brand-charcoal">
              {t.options.onRoadPrice}
            </option>
            <option value="Finance & EMI Guidance" className="bg-white text-brand-charcoal">
              {t.options.financeEmi}
            </option>
            <option value="Test Drive & Showroom Visit" className="bg-white text-brand-charcoal">
              {t.options.testDrive}
            </option>
            <option value="Battery Diagnostics / Service" className="bg-white text-brand-charcoal">
              {t.options.batteryService}
            </option>
            <option value="Commercial Fleet Requirement" className="bg-white text-brand-charcoal">
              {t.options.fleet}
            </option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wideUpper text-brand-charcoal">
          {t.cityLabel}
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t.cityPlaceholder}
          className="w-full px-3.5 py-2.5 rounded bg-brand-warmWhite border border-brand-border text-brand-charcoal placeholder-brand-muted/60 text-base sm:text-sm focus:outline-none focus:border-brand-red transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wideUpper text-brand-charcoal">
          {t.notesLabel}
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.notesPlaceholder}
          className="w-full px-3.5 py-2.5 rounded bg-brand-warmWhite border border-brand-border text-brand-charcoal placeholder-brand-muted/60 text-base sm:text-sm focus:outline-none focus:border-brand-red transition-colors resize-none"
        />
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] active:translate-y-0.5 disabled:opacity-70 text-white text-xs font-bold uppercase tracking-wideUpper transition-all shadow-sm cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{isHindi ? "भेज रहे हैं..." : "Submitting..."}</span>
            </>
          ) : (
            <>
              <span>{t.submitBtn}</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <div className="text-xs text-brand-muted flex items-center justify-center sm:justify-start gap-2">
          <span>{t.callDirectPrompt}</span>
          <a href={`tel:${siteConfig.primaryPhone}`} className="text-brand-charcoal font-bold hover:text-brand-red hover:underline">
            {siteConfig.displayPhone}
          </a>
        </div>
      </div>
    </form>
  );
}