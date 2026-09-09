import type { Metadata } from "next";
import HappyCustomersContent from "@/components/HappyCustomersContent";
import { getCustomers, getCustomerStats } from "@/lib/db";

export const metadata: Metadata = {
  title: "Happy Customers & Vehicle Deliveries | Balaji Motors Jalandhar",
  description: "See real customer delivery photos, testimonials, and verified reviews of electric rickshaws and cargo loaders purchased from Balaji Motors in Jalandhar, Punjab.",
  keywords: [
    "Balaji Motors Customers",
    "E-Rickshaw Delivery Jalandhar",
    "Electric Rickshaw Review Punjab",
    "Sargam Victor Customer",
    "King Cargo Loader Delivery",
    "Electric Auto Review Jalandhar",
  ],
  alternates: {
    canonical: "https://balajimotors.ryxer.site/happy-customers",
  },
  openGraph: {
    title: "Happy Customers & Vehicle Deliveries | Balaji Motors Jalandhar",
    description: "See real customer delivery photos, testimonials, and verified reviews of electric rickshaws and cargo loaders purchased from Balaji Motors in Jalandhar, Punjab.",
    url: "https://balajimotors.ryxer.site/happy-customers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Balaji Motors Happy Customers and Vehicle Deliveries",
      },
    ],
  },
};

export default async function HappyCustomersPage() {
  const initialCustomers = await getCustomers();
  const initialStats = await getCustomerStats();

  const customerJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialCustomers.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: c.name,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: c.rating,
          bestRating: 5,
        },
        reviewBody: c.quote,
        itemReviewed: {
          "@type": "Product",
          name: c.vehicleName,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(customerJsonLd) }}
      />
      <HappyCustomersContent initialCustomers={initialCustomers} initialStats={initialStats} />
    </>
  );
}
