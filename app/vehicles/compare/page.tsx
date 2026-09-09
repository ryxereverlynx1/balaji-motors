import type { Metadata } from "next";
import VehicleComparison from "@/components/VehicleComparison";
import EnquiryForm from "@/components/EnquiryForm";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare Electric Rickshaws & Loaders | Balaji Motors Jalandhar",
  description: "Compare technical specifications, battery types, driving range, payload capacities, and warranty of Sargam Victor, King Cargo, MKB Deluxe, and Balaji models side by side.",
  keywords: [
    "Compare E-Rickshaw Models",
    "Sargam Victor vs King Cargo",
    "Electric Rickshaw Specs Comparison Punjab",
    "Best Electric Rickshaw Jalandhar",
    "Electric Loader Comparison",
  ],
  alternates: {
    canonical: "https://balajimotors.ryxer.site/vehicles/compare",
  },
  openGraph: {
    title: "Compare Electric Rickshaws & Loaders | Balaji Motors Jalandhar",
    description: "Compare technical specifications, battery types, driving range, payload capacities, and warranty of Sargam Victor, King Cargo, MKB Deluxe, and Balaji models side by side.",
    url: "https://balajimotors.ryxer.site/vehicles/compare",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Balaji Motors Vehicle Comparison Tool",
      },
    ],
  },
};

export default function ComparePage() {
  return (
    <div className="pt-24 pb-20 sm:pt-32 sm:pb-28 bg-brand-warmWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-brand-border pb-8">
          <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-4">
            <Link href="/" className="hover:text-brand-charcoal transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href="/vehicles" className="hover:text-brand-charcoal transition-colors">
              Vehicles
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-brand-charcoal font-bold">Compare Models</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
                Dealership Comparison Tool
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-brand-charcoal tracking-tight">
                Compare Electric Vehicles
              </h1>
              <p className="text-sm sm:text-base text-brand-muted mt-2 max-w-2xl leading-relaxed">
                Analyze battery capacity, daily driving range, motor wattage, and payloads side-by-side to choose the best fit for your transit route.
              </p>
            </div>

            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-charcoal hover:text-brand-red transition-colors self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Showroom</span>
            </Link>
          </div>
        </div>

        <VehicleComparison />

        <ScrollReveal>
          <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-10 shadow-card">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                Need Commercial Recommendation?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
                Still Deciding Between Models?
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Our showroom specialists in Jalandhar will analyze your daily route kilometers, payload requirements, and budget to recommend the most profitable vehicle configuration.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <EnquiryForm sourceContext="Compare Page Bottom CTA" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
