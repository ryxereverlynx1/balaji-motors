"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, ExternalLink, Navigation, Compass } from "lucide-react";

interface GoogleMapEmbedProps {
  className?: string;
  height?: number;
}

export default function GoogleMapEmbed({
  className = "",
  height = 420,
}: GoogleMapEmbedProps) {
  const { isHindi } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  const encodedQuery = encodeURIComponent(
    "Balaji Motors, Avtar Nagar Road, Near Hotel Regent Park, Gujral Nagar, Jalandhar, Punjab"
  );
  const embedUrl = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`;

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-brand-border bg-white shadow-card ${className}`}>
      <div className="absolute top-4 left-4 z-10 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md p-3.5 rounded-lg border border-brand-border shadow-md pointer-events-auto">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-black text-brand-charcoal leading-tight">
              Balaji Motors Showroom & Workshop
            </h4>
            <p className="text-[11px] text-brand-muted leading-relaxed">
              {siteConfig.address.fullFormatted}
            </p>
            <div className="pt-1.5 flex items-center gap-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-brand-red hover:bg-brand-darkRed text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                <Navigation className="w-3 h-3" />
                <span>{isHindi ? "रास्ता देखें" : "Directions"}</span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodedQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-charcoal hover:text-brand-red transition-colors"
              >
                <span>{isHindi ? "बड़ा नक्शा" : "Full View"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full relative" style={{ height: `${height}px` }}>
        <iframe
          title="Balaji Motors Showroom Location Map"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-40"}`}
        />
      </div>

      <div className="bg-stone-50 px-4 py-2.5 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-semibold text-brand-muted gap-2">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-brand-red shrink-0" />
          <span>Near Hotel Regent Park, Avtar Nagar Road, Gujral Nagar, Jalandhar, Punjab</span>
        </div>
        <div className="text-brand-charcoal font-bold">
          Open Mon - Sat: 9:00 AM - 7:30 PM
        </div>
      </div>
    </div>
  );
}
