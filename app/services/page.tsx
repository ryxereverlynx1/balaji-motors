import type { Metadata } from "next";
import ServicesContent from "@/components/ServicesContent";

export const metadata: Metadata = {
  title: "E-Rickshaw Service, Battery Replacement & Spare Parts",
  description: "Official service center for electric rickshaws in Jalandhar, Punjab. Battery diagnostics, controller repairs, motor servicing, and genuine BAXY spare parts.",
  keywords: [
    "E-Rickshaw Service Jalandhar",
    "Electric Rickshaw Battery Replacement Punjab",
    "E-Rickshaw Controller Repair",
    "BAXY Spare Parts Jalandhar",
    "Electric Auto Maintenance Punjab",
  ],
  alternates: {
    canonical: "https://balajimotors.ryxer.site/services",
  },
  openGraph: {
    title: "E-Rickshaw Service & Battery Center | Balaji Motors Jalandhar",
    description: "Official service center for electric rickshaws in Jalandhar, Punjab. Battery diagnostics, controller repairs, motor servicing, and genuine BAXY spare parts.",
    url: "https://balajimotors.ryxer.site/services",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Balaji Motors Service Center Jalandhar",
      },
    ],
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Balaji Motors Service Center",
  description: "Official electric three-wheeler workshop providing battery diagnostics, motor repair, chassis alignment, and genuine spare parts in Jalandhar.",
  url: "https://balajimotors.ryxer.site/services",
  telephone: "+91 94645 18091",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Avtar Nagar Road, Near Hotel Regent Park, Gujral Nagar",
    addressLocality: "Jalandhar",
    addressRegion: "Punjab",
    postalCode: "144001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 31.326,
    longitude: 75.5762,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "19:30",
    },
  ],
  areaServed: ["Jalandhar", "Phagwara", "Kapurthala", "Hoshiarpur", "Punjab"],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <ServicesContent />
    </>
  );
}