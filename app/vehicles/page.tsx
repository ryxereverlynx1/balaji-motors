import type { Metadata } from "next";
import VehiclesShowroom from "@/components/VehiclesShowroom";
import { getAllPublicVehicles, getPublicCategories } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Electric Rickshaws & Commercial E-Loaders Catalogue",
  description: "Browse heavy-duty electric passenger rickshaws and commercial cargo loaders in Jalandhar, Punjab. Compare models, battery range, payload capacities, and showroom prices.",
  keywords: [
    "Electric Rickshaw Models Jalandhar",
    "E-Rickshaw Catalogue Punjab",
    "Commercial Electric Loader",
    "Passenger E-Rickshaw Price",
    "BAXY Three Wheeler Dealership",
  ],
  alternates: {
    canonical: "https://balajimotors.ryxer.site/vehicles",
  },
  openGraph: {
    title: "Electric Rickshaws & Commercial E-Loaders Catalogue | Balaji Motors",
    description: "Browse heavy-duty electric passenger rickshaws and commercial cargo loaders in Jalandhar, Punjab. Compare models, battery range, payload capacities, and showroom prices.",
    url: "https://balajimotors.ryxer.site/vehicles",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Balaji Motors Electric Rickshaw Showroom",
      },
    ],
  },
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Balaji Motors Electric Three Wheeler Catalogue",
  description: "Electric passenger rickshaws and commercial loaders available at Balaji Motors Jalandhar, Punjab.",
  url: "https://balajimotors.ryxer.site/vehicles",
  isPartOf: {
    "@type": "WebSite",
    name: "Balaji Motors",
    url: "https://balajimotors.ryxer.site",
  },
};

export default async function VehiclesPage() {
  const [initialVehicles, initialCategories] = await Promise.all([
    getAllPublicVehicles(),
    getPublicCategories(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <VehiclesShowroom
        initialVehicles={initialVehicles}
        initialCategories={initialCategories}
      />
    </>
  );
}