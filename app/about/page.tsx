import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About Balaji Motors | Authorized Electric Vehicle Dealership in Jalandhar",
  description: "Learn about Balaji Motors, Jalandhar's trusted dealership for BAXY electric rickshaws and commercial cargo loaders. Dealership history, customer support, and genuine warranty.",
  keywords: [
    "About Balaji Motors Jalandhar",
    "Electric Rickshaw Dealer History Punjab",
    "BAXY Authorized Dealer Jalandhar",
    "Commercial E-Rickshaw Dealership",
  ],
  alternates: {
    canonical: "https://balajimotors.ryxer.site/about",
  },
  openGraph: {
    title: "About Balaji Motors | Electric Vehicle Dealership in Jalandhar",
    description: "Learn about Balaji Motors, Jalandhar's trusted dealership for BAXY electric rickshaws and commercial cargo loaders. Dealership history, customer support, and genuine warranty.",
    url: "https://balajimotors.ryxer.site/about",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Balaji Motors Jalandhar",
      },
    ],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Balaji Motors",
  url: "https://balajimotors.ryxer.site/about",
  mainEntity: {
    "@type": "AutoDealer",
    name: "Balaji Motors",
    description: "Authorized dealership for BAXY electric three-wheelers and commercial passenger rickshaws and cargo loaders in Jalandhar, Punjab.",
    foundingLocation: {
      "@type": "Place",
      name: "Jalandhar, Punjab, India",
    },
    areaServed: ["Jalandhar", "Phagwara", "Kapurthala", "Hoshiarpur", "Punjab"],
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <AboutContent />
    </>
  );
}