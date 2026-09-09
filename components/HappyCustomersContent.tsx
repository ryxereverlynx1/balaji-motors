"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/context/LanguageContext";
import { CustomerStoryRecord, CustomerStatCard } from "@/lib/db/types";
import { siteConfig } from "@/data/site";
import {
  Users,
  MapPin,
  Calendar,
  Star,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
} from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface HappyCustomersContentProps {
  initialCustomers?: CustomerStoryRecord[];
  initialStats?: CustomerStatCard[];
}

export default function HappyCustomersContent({
  initialCustomers = [],
  initialStats = [],
}: HappyCustomersContentProps) {
  const { language, isHindi } = useLanguage();
  const [customers, setCustomers] = useState<CustomerStoryRecord[]>(initialCustomers);
  const [stats, setStats] = useState<CustomerStatCard[]>(initialStats);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch("/api/customers");
        if (res.ok) {
          const data = await res.json();
          if (data.customers && data.customers.length > 0) {
            setCustomers(data.customers);
          }
        }
      } catch {}
    }
    loadCustomers();

    if (!initialStats || initialStats.length === 0) {
      fetch("/api/customer-stats")
        .then((res) => res.json())
        .then((data) => {
          if (data?.stats && Array.isArray(data.stats)) {
            setStats(data.stats);
          }
        })
        .catch(() => {});
    }
  }, [initialStats]);

  const vehicleFilters = [
    { id: "all", label: isHindi ? "सभी गाड़ियां" : "All Vehicles" },
    { id: "passenger", label: isHindi ? "पैसेंजर ई-रिक्शा" : "Passenger E-Rickshaw" },
    { id: "cargo", label: isHindi ? "कार्गो / लोडर" : "Cargo / Loader" },
  ];

  const filtered = customers.filter((c) => {
    if (selectedVehicle === "passenger") {
      return c.vehicleName.toLowerCase().includes("passenger") || c.vehicleName.toLowerCase().includes("rickshaw");
    }
    if (selectedVehicle === "cargo") {
      return c.vehicleName.toLowerCase().includes("cargo") || c.vehicleName.toLowerCase().includes("loader") || c.vehicleName.toLowerCase().includes("van");
    }
    return true;
  });

  return (
    <div className="pt-24 pb-20 sm:pt-32 sm:pb-28 bg-brand-warmWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="border-b border-brand-border pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-bold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>{isHindi ? "बालाजी परिवार • पंजाब" : "Balaji Motors Family • Punjab"}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-brand-charcoal tracking-tight">
            {isHindi ? "हमारे खुशहाल ग्राहक व डिलीवरी" : "Happy Customers & Handover Stories"}
          </h1>
          <p className="text-sm sm:text-base text-brand-muted mt-3 max-w-3xl leading-relaxed">
            {isHindi
              ? "जालंधर, फगवाड़ा, कपूरथला और पूरे पंजाब के उन मेहनती चालकों और व्यापारियों से मिलें, जिन्होंने बालाजी मोटर्स पर भरोसा किया और अपनी कमाई में भारी बढ़ोतरी की।"
              : "Meet the proud owner-operators and commercial businesses across Jalandhar and Punjab who rely on Balaji Motors for daily earnings and dependable transport."}
          </p>

          {stats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {stats.map((st) => (
                <div key={st.id} className="p-4 rounded-xl bg-white border border-brand-border space-y-1 shadow-xs">
                  <div className="text-2xl sm:text-3xl font-black text-brand-charcoal font-mono">
                    {isHindi && st.valueHi ? st.valueHi : st.value}
                  </div>
                  <div className="text-xs font-bold text-brand-charcoal">
                    {isHindi && st.titleHi ? st.titleHi : st.title}
                  </div>
                  {(st.description || st.descriptionHi) && (
                    <p className="text-[11px] text-brand-muted">
                      {isHindi && st.descriptionHi ? st.descriptionHi : st.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {vehicleFilters.map((vf) => (
              <button
                key={vf.id}
                type="button"
                onClick={() => setSelectedVehicle(vf.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedVehicle === vf.id
                    ? "bg-brand-charcoal text-white shadow-sm"
                    : "bg-white text-brand-charcoal border border-brand-border hover:border-brand-charcoal/40"
                }`}
              >
                {vf.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-brand-muted">
            {isHindi ? `दिखाए जा रहे हैं: ${filtered.length} खुशहाल ग्राहक` : `Showing ${filtered.length} delivery stories`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((cust, idx) => (
            <ScrollReveal key={cust.id} delay={idx * 80}>
              <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full group">
                <div>
                  <div className="relative h-60 w-full bg-stone-100 overflow-hidden border-b border-brand-border">
                    <Image
                      src={cust.image || "/images/SARGAM-VICTOR-BLUE-2.webp"}
                      alt={cust.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-brand-charcoal/90 backdrop-blur-xs text-white text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>{isHindi ? "सत्यापित डिलीवरी" : "Verified Delivery"}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-amber-400 text-xs">
                        {Array.from({ length: cust.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <div className="text-[11px] font-mono font-bold bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{isHindi && cust.deliveryDateHi ? cust.deliveryDateHi : cust.deliveryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-brand-charcoal tracking-tight">
                        {isHindi && cust.nameHi ? cust.nameHi : cust.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-brand-muted mt-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                        <span>{isHindi && cust.locationHi ? cust.locationHi : cust.location}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-cream border border-brand-border text-xs font-bold text-brand-charcoal">
                      <span className="w-2 h-2 rounded-full bg-brand-red shrink-0" />
                      <span>{isHindi && cust.vehicleNameHi ? cust.vehicleNameHi : cust.vehicleName}</span>
                    </div>

                    <div className="relative pt-2">
                      <p className="text-xs text-brand-charcoal leading-relaxed italic bg-brand-warmWhite p-4 rounded-xl border border-brand-border/60">
                        &ldquo;{isHindi && cust.quoteHi ? cust.quoteHi : cust.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 px-6 bg-stone-50 border-t border-brand-border flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{isHindi ? "ऑन-रोड प्रमाणित ग्राहक" : "Balaji Motors Owner"}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="bg-gradient-to-r from-brand-charcoal via-stone-900 to-brand-charcoal rounded-2xl p-8 sm:p-12 text-white border border-brand-charcoal shadow-xl relative overflow-hidden">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHindi ? "अपनी नई गाड़ी बुक करें" : "Start Your Success Story Today"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-brand-warmWhite">
                {isHindi ? "क्या आप भी अपनी दैनिक कमाई बढ़ाना चाहते हैं?" : "Ready to Boost Your Daily Take-Home Earnings?"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {isHindi
                  ? "होटल रीजेंट पार्क के पास, अवतार नगर रोड शोरूम में आएं और अपनी पसंद के ई-रिक्शा की टेस्ट राइड लें। ऑन-द-स्पॉट लोन व रजिस्ट्रेशन सुविधा।"
                  : "Visit our showroom near Hotel Regent Park, Avtar Nagar Road, Jalandhar for live test drives, instant loan assessment, and same-week delivery handovers."}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href={`tel:${siteConfig.primaryPhone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-red hover:bg-brand-darkRed text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>{isHindi ? "शोरूम पर कॉल करें" : "Call Showroom"}</span>
                </a>

                <a
                  href={getGeneralWhatsAppUrl(language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isHindi ? "व्हाट्सएप पर बात करें" : "WhatsApp Enquiry"}</span>
                </a>

                <Link
                  href="/finance"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <span>{isHindi ? "ईएमआई कैलकुलेटर देखें" : "Calculate EMI"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
