import React from "react";
import { Sparkles } from "lucide-react";

interface ViewerFallbackProps {
  vehicleName: string;
  category?: string;
}

export default function ViewerFallback({
  vehicleName,
  category = "Commercial Electric Rickshaw",
}: ViewerFallbackProps) {
  return (
    <div className="relative w-full h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-brand-warmWhite to-brand-cream border border-brand-border rounded-md p-8 text-center shadow-card">
      <div className="w-16 h-16 rounded-full bg-white border border-brand-border flex items-center justify-center mb-4 shadow-sm">
        <Sparkles className="w-7 h-7 text-brand-red" />
      </div>
      <span className="text-xs uppercase tracking-wideUpper text-brand-red font-bold mb-2">
        {category}
      </span>
      <h3 className="text-xl font-bold text-brand-charcoal mb-2">{vehicleName}</h3>
      <p className="text-sm text-brand-muted max-w-md leading-relaxed">
        Interactive 3D view is initializing or paused. Visit the Balaji Motors showroom on Avtar Nagar Road, Jalandhar to inspect this vehicle in person.
      </p>
    </div>
  );
}