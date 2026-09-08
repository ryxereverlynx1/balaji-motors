"use client";

import React, { useState, useEffect } from "react";
import { useQuoteModal } from "@/context/QuoteModalContext";
import { useLanguage } from "@/context/LanguageContext";
import { vehiclesData, getLocalizedVehicle } from "@/data/vehicles";
import { enquiryTypeOptions } from "@/data/enquiryTypes";
import { siteConfig } from "@/data/site";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import {
  X,
  Send,
  CheckCircle2,
  Download,
  MessageSquare,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";

export default function QuoteModal() {
  const { isOpen, closeQuoteModal, preselectedVehicle, defaultEnquiryType } = useQuoteModal();
  const { language, isHindi } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Jalandhar");
  const [vehicle, setVehicle] = useState(preselectedVehicle);
  const [enquiryType, setEnquiryType] = useState(defaultEnquiryType);
  const [quantity, setQuantity] = useState(1);
  const [preferredContact, setPreferredContact] = useState("Phone Call");
  const [companyName, setCompanyName] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
    if (isOpen) {
      loadDynamic();
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedVehicle) {
      setVehicle(preselectedVehicle);
    }
    if (defaultEnquiryType) {
      setEnquiryType(defaultEnquiryType);
    }
  }, [preselectedVehicle, defaultEnquiryType, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeQuoteModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeQuoteModal]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = isHindi ? "कृपया अपना पूरा नाम लिखें।" : "Please enter your full name.";
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = isHindi ? "कृपया 10 अंकों का वैध मोबाइल नंबर लिखें।" : "Please enter a valid 10-digit mobile number.";
    }
    if (email && email.trim().length > 0 && !email.includes("@")) {
      errs.email = isHindi ? "कृपया वैध ईमेल आईडी लिखें।" : "Please enter a valid email address.";
    }
    if (!city.trim()) {
      errs.city = isHindi ? "कृपया अपना शहर अथवा जिला लिखें।" : "Please enter your city or district in Punjab.";
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
          email,
          city,
          vehicle,
          enquiryType,
          quantity: Number(quantity) || 1,
          preferredContact,
          companyName,
          notes,
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
      setSubmitSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error connecting to dealership server.";
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

  const handleWhatsAppRedirect = () => {
    const text = isHindi
      ? `नमस्ते बालाजी मोटर्स, मैंने वेबसाइट से कोटेशन अनुरोध दर्ज किया है (Ref: ${referenceId})। वाहन: ${vehicle}। कृपया ऑन-रोड कीमत व डिलीवरी की जानकारी साझा करें।`
      : `Hello Balaji Motors, I have submitted an enquiry request (Ref: ${referenceId}) for ${vehicle}. Please share on-road pricing and showroom delivery availability.`;
    const url = createWhatsAppUrl(text);
    window.open(url, "_blank");
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setReferenceId("");
    setPdfBase64(null);
    setFullName("");
    setPhone("");
    setEmail("");
    setCompanyName("");
    setNotes("");
    setQuantity(1);
    closeQuoteModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-[96vw] sm:w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-brand-warmWhite border border-brand-border rounded-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 z-20 bg-brand-warmWhite/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 border-b border-brand-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red shadow-xs shrink-0" />
            <span className="text-xs font-black uppercase tracking-wideUpper text-brand-charcoal truncate">
              BALAJI MOTORS • {isHindi ? "ऑन-रोड कोटेशन अनुरोध" : "GET A QUOTE"}
            </span>
          </div>
          <button
            type="button"
            onClick={closeQuoteModal}
            className="p-1.5 rounded bg-brand-cream hover:bg-brand-border text-brand-charcoal transition-colors shrink-0"
            aria-label="Close quote modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {submitSuccess ? (
            <div className="text-center space-y-4 sm:space-y-5 py-2 sm:py-4 animate-in fade-in">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-lightRed border border-brand-red/30 flex items-center justify-center mx-auto text-brand-red shadow-sm">
                <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>

              <div>
                <div className="inline-block px-3 py-1 rounded bg-brand-cream border border-brand-border text-xs font-mono font-bold text-brand-red mb-2">
                  {referenceId}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-brand-charcoal tracking-tight">
                  {isHindi ? "पूछताछ दर्ज हो चुकी है" : "Enquiry Successfully Logged"}
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto mt-2 leading-relaxed">
                  {isHindi
                    ? `धन्यवाद ${fullName}। आपकी ${vehicle} के लिए कोटेशन पूछताछ हमारे जालंधर शोरूम को प्राप्त हो गई है। हमारी टीम जल्द ही आपसे ${phone} पर संपर्क करेगी।`
                    : `Thank you ${fullName}. Your quote enquiry for ${vehicle} has been registered with our Jalandhar dealership. Our sales desk will reach you shortly on ${phone}.`}
                </p>
                {email && (
                  <p className="text-[11px] text-brand-charcoal font-semibold mt-1">
                    {isHindi
                      ? `कोटेशन सारांश की एक प्रति आपके ईमेल (${email}) पर भी भेज दी गई है।`
                      : `A confirmation copy with PDF summary has also been dispatched to ${email}.`}
                  </p>
                )}
              </div>

              <div className="pt-3 sm:pt-4 border-t border-brand-border flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
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
                  onClick={handleWhatsAppRedirect}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-[#25D366] hover:bg-[#20BA5A] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isHindi ? "व्हाट्सएप पर बात करें" : "WhatsApp Showroom"}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs font-bold text-brand-muted hover:text-brand-charcoal underline uppercase tracking-wider cursor-pointer"
                >
                  {isHindi ? "बंद करें व वापस जाएं" : "Close & Return to Vehicles"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-brand-border pb-3">
                <h2 className="text-xl font-black text-brand-charcoal tracking-tight">
                  {isHindi ? "वाहन कोटेशन व उपलब्धता पूछताछ" : "Request Vehicle On-Road Quote"}
                </h2>
                <p className="text-xs text-brand-muted mt-0.5">
                  {isHindi
                    ? "सीधे बालाजी मोटर्स जालंधर से जुड़ें। सटीक ऑन-रोड दाम, बैटरी विकल्प और किश्तों की जानकारी।"
                    : "Direct contact with Balaji Motors, Jalandhar. Genuine quotes, battery guidance, and low down payments."}
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
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                    {isHindi ? "पूरा नाम" : "Full Name"} <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isHindi ? "उदा. गुरप्रीत सिंह" : "e.g. Gurpreet Singh"}
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal placeholder-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
                  />
                  {errors.fullName && <p className="text-[10px] text-brand-red">{errors.fullName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                    {isHindi ? "मोबाइल नंबर" : "Mobile Number"} <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal placeholder-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
                  />
                  {errors.phone && <p className="text-[10px] text-brand-red">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                    {isHindi ? "ईमेल आईडी (वैकल्पिक)" : "Email Address (Optional)"}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal placeholder-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
                  />
                  {errors.email && <p className="text-[10px] text-brand-red">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                    {isHindi ? "शहर / जिला (पंजाब)" : "City / District (Punjab)"} <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Jalandhar, Phagwara, Kapurthala"
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal placeholder-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
                  />
                  {errors.city && <p className="text-[10px] text-brand-red">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                    {isHindi ? "वाहन मॉडल" : "Vehicle Model"} <span className="text-brand-red">*</span>
                  </label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal focus:outline-none focus:border-brand-red transition-colors"
                  >
                    {availableVehicles.map((v) => {
                      const loc = getLocalizedVehicle(v, language);
                      return (
                        <option key={v.id} value={loc.name}>
                          {loc.name} ({loc.category})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                    {isHindi ? "संख्या / गाड़ियां" : "Quantity"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal focus:outline-none focus:border-brand-red transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                    {isHindi ? "पूछताछ का प्रकार" : "Enquiry Type"}
                  </label>
                  <select
                    value={enquiryType}
                    onChange={(e) => setEnquiryType(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal focus:outline-none focus:border-brand-red transition-colors"
                  >
                    {enquiryTypeOptions.map((opt) => (
                      <option key={opt.id} value={isHindi ? opt.labelHi : opt.labelEn}>
                        {isHindi ? opt.labelHi : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                    {isHindi ? "संपर्क की प्राथमिकता" : "Preferred Contact Method"}
                  </label>
                  <select
                    value={preferredContact}
                    onChange={(e) => setPreferredContact(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal focus:outline-none focus:border-brand-red transition-colors"
                  >
                    <option value="Phone Call">{isHindi ? "फोन कॉल" : "Phone Call"}</option>
                    <option value="WhatsApp">{isHindi ? "व्हाट्सएप संदेश" : "WhatsApp"}</option>
                    <option value="Email">{isHindi ? "ईमेल" : "Email"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                  {isHindi ? "कंपनी / व्यापार का नाम (वैकल्पिक)" : "Company / Firm Name (Optional)"}
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={isHindi ? "उदा. सिंह ट्रांसपोर्ट / व्यक्तिगत" : "e.g. Singh Logistics / Self-Employed"}
                  className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal placeholder-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-charcoal">
                  {isHindi ? "अतिरिक्त विवरण या आवश्यकता" : "Additional Requirements"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isHindi ? "बैटरी पसंद, डाउन पेमेंट बजट या डिलीवरी समय..." : "Mention battery preference, down-payment budget, or route details..."}
                  className="w-full px-3 py-2 rounded bg-white border border-brand-border text-base sm:text-sm text-brand-charcoal placeholder-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-brand-border">
                <div className="flex items-center gap-2 text-xs text-brand-muted">
                  <FileText className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span>{isHindi ? "स्वचालित PDF सारांश तैयार होगा" : "Generates official PDF quote summary"}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={closeQuoteModal}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded bg-brand-cream hover:bg-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {isHindi ? "रद्द करें" : "Cancel"}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] disabled:opacity-70 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{isHindi ? "भेज रहे हैं..." : "Sending..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{isHindi ? "कोटेशन अनुरोध भेजें" : "Submit Enquiry"}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
