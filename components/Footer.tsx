"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, MapPin, Clock, ArrowUpRight, MessageSquare, ShieldCheck } from "lucide-react";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  const { language, dict } = useLanguage();
  const t = dict.footer;

  return (
    <footer className="bg-brand-charcoal text-[#D6D1C7] border-t border-brand-charcoalSoft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white uppercase">
                {t.dealershipHeading}
              </span>
              <span className="w-2 h-2 rounded-full bg-brand-yellow" />
            </div>
            <p className="text-xs text-brand-yellow uppercase tracking-wideUpper font-bold">
              {t.cityLine}
            </p>
            <p className="text-sm text-[#A8A296] leading-relaxed font-normal">
              {t.tagline}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-white font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-red flex-shrink-0" />
              <span>{siteConfig.brandAffiliation}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wideUpper text-white mb-4">
              {t.exploreHeading}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/vehicles/sargam-victor-passenger"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>{language === "hi" ? "सरगम विक्टर ई-रिक्शा" : "Sargam Victor E-Rickshaw"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-yellow" />
                </Link>
              </li>
              <li>
                <Link
                  href="/vehicles/king-cargo-express-loader"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>{language === "hi" ? "किंग कार्गो एक्सप्रेस ई-लोडर" : "King Cargo Express E-Loader"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-yellow" />
                </Link>
              </li>
              <li>
                <Link
                  href="/vehicles/balaji-city-passenger-standard"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>{language === "hi" ? "बालाजी सिटी पैसेंजर" : "Balaji City Passenger"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-yellow" />
                </Link>
              </li>
              <li>
                <Link
                  href="/vehicles/balaji-delivery-closed-van"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>{language === "hi" ? "बालाजी डिलीवरी बॉक्स वैन" : "Balaji Delivery Box Van"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-yellow" />
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/vehicles"
                  className="text-xs text-brand-yellow hover:text-white font-bold uppercase tracking-wider inline-flex items-center gap-1"
                >
                  {t.viewAllModels}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wideUpper text-white mb-4">
              {t.servicesHeading}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/finance" className="hover:text-white transition-colors">
                  {language === "hi" ? "लोन व आसान किश्तें" : "Finance & Easy Installments"}
                </Link>
              </li>
              <li>
                <Link href="/vehicles/compare" className="hover:text-white transition-colors">
                  {language === "hi" ? "मॉडलों की तुलना करें" : "Compare E-Rickshaw Models"}
                </Link>
              </li>
              <li>
                <Link href="/happy-customers" className="hover:text-white transition-colors">
                  {language === "hi" ? "खुशहाल ग्राहक व डिलीवरी" : "Happy Customers & Deliveries"}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {language === "hi" ? "नियमित वाहन मेंटेनेंस" : "Scheduled Vehicle Maintenance"}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {language === "hi" ? "बैटरी हेल्थ व टेस्टिंग" : "Battery Testing & Diagnostics"}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  {language === "hi" ? "असली स्पेयर पार्ट्स सप्लाई" : "Genuine Spare Parts Supply"}
                </Link>
              </li>
              <li>
                <Link href="/enquiry" className="hover:text-white transition-colors">
                  {language === "hi" ? "ऑन-रोड कीमत कोटेशन" : "On-Road Price Quotation"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {language === "hi" ? "जालंधर डीलरशिप के बारे में" : "About Our Jalandhar Dealership"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wideUpper text-white mb-4">
              {t.showroomHeading}
            </h3>
            <div className="flex items-start gap-2.5 text-xs leading-relaxed text-[#A8A296]">
              <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
              <span>{siteConfig.address.fullFormatted}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#A8A296] pt-1">
              <Phone className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
              <div className="flex flex-wrap items-center gap-1.5">
                <a href={`tel:${siteConfig.primaryPhone}`} className="hover:text-white font-semibold text-white">
                  {siteConfig.displayPhone}
                </a>
                <span>•</span>
                <a href={`tel:${siteConfig.secondaryPhone}`} className="hover:text-white">
                  {siteConfig.secondaryPhone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#A8A296] pt-1">
              <Clock className="w-4 h-4 text-brand-yellow flex-shrink-0 mt-0.5" />
              <div>
                <p>{language === "hi" ? "सोम - शनि: सुबह 9:30 से शाम 7:30" : "Mon - Sat: 9:30 AM - 7:30 PM"}</p>
                <p className="text-[#8A8478]">{language === "hi" ? "रवि: अपॉइंटमेंट द्वारा" : "Sun: By Appointment"}</p>
              </div>
            </div>
            <div className="pt-3">
              <a
                href={getGeneralWhatsAppUrl(language)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>{t.whatsappChat}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A8478] text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. {t.rights}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">
              {t.contactLink}
            </Link>
            <Link href="/enquiry" className="hover:text-white transition-colors">
              {t.enquireLink}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}