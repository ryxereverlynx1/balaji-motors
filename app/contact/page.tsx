import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";

export const metadata: Metadata = {
  title: "Contact & Showroom Location | Avtar Nagar Road, Jalandhar",
  description: "Visit Balaji Motors electric rickshaw showroom at Avtar Nagar Road, Near Hotel Regent Park, Jalandhar, Punjab. Call +91 94645 18091 for instant price quotes and test drives.",
  keywords: [
    "Balaji Motors Jalandhar Contact",
    "E-Rickshaw Showroom Jalandhar Address",
    "Electric Auto Dealership Near Me",
    "Balaji Motors Phone Number",
    "Electric Rickshaw Dealership Punjab",
  ],
  alternates: {
    canonical: "https://balajimotors.ryxer.site/contact",
  },
  openGraph: {
    title: "Visit Balaji Motors Showroom | Jalandhar, Punjab",
    description: "Visit Balaji Motors electric rickshaw showroom at Avtar Nagar Road, Near Hotel Regent Park, Jalandhar, Punjab. Call +91 94645 18091 for instant price quotes and test drives.",
    url: "https://balajimotors.ryxer.site/contact",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Balaji Motors Showroom Location Jalandhar",
      },
    ],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Balaji Motors",
  url: "https://balajimotors.ryxer.site/contact",
  mainEntity: {
    "@type": "AutoDealer",
    name: "Balaji Motors",
    telephone: "+91 94645 18091",
    email: "balajimotors.jalandhar@gmail.com",
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
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <ContactContent />
    </>
  );
}