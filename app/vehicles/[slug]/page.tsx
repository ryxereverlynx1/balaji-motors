import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { vehiclesData } from "@/data/vehicles";
import { getVehicleBySlug, getAllPublicVehicles } from "@/lib/products";
import VehicleDetailContent from "@/components/VehicleDetailContent";

interface VehiclePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const dbVehicles = await getAllPublicVehicles();
  const slugs = new Set<string>();
  for (const v of dbVehicles) slugs.add(v.slug);
  for (const v of vehiclesData) slugs.add(v.slug);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = (await getVehicleBySlug(slug, true)) || vehiclesData.find((v) => v.slug === slug);
  if (!vehicle) return { title: "Vehicle Not Found" };

  const canonicalUrl = `https://balajimotors.ryxer.site/vehicles/${vehicle.slug}`;
  const pageTitle = `${vehicle.name} - Price, Specs & Range | Balaji Motors`;
  const pageDesc = `${vehicle.name} (${vehicle.tagline}) available at Balaji Motors Jalandhar, Punjab. Inspect battery range, payload capacity, finance guidance, and on-road showroom price.`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      images: [
        {
          url: vehicle.image.startsWith("http") ? vehicle.image : `https://balajimotors.ryxer.site${vehicle.image}`,
          width: 800,
          height: 600,
          alt: `${vehicle.name} Electric Rickshaw at Balaji Motors`,
        },
      ],
    },
  };
}

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  const { slug } = await params;
  const vehicle = (await getVehicleBySlug(slug, true)) || vehiclesData.find((v) => v.slug === slug);

  if (!vehicle) {
    notFound();
  }

  const all = await getAllPublicVehicles();
  const pool = all.length > 0 ? all : vehiclesData;
  const relatedVehicles = pool
    .filter((v) => v.id !== vehicle.id)
    .slice(0, 3);

  const rawPrice = (vehicle as any).startingPrice || vehicle.approximateStartingPrice || "165000";
  const cleanPrice = String(rawPrice).replace(/[^0-9]/g, "") || "165000";
  const desc = vehicle.shortDescription || vehicle.fullDescription || vehicle.tagline;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: vehicle.name,
    image: vehicle.image.startsWith("http") ? vehicle.image : `https://balajimotors.ryxer.site${vehicle.image}`,
    description: desc,
    brand: {
      "@type": "Brand",
      name: vehicle.name.toUpperCase().includes("BAXY") ? "BAXY" : "Balaji Motors",
    },
    category: "Motor Vehicles > Three-Wheeler Electric Vehicles",
    offers: {
      "@type": "Offer",
      url: `https://balajimotors.ryxer.site/vehicles/${vehicle.slug}`,
      priceCurrency: "INR",
      price: cleanPrice,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: "Balaji Motors Jalandhar",
        telephone: "+91 94645 18091",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://balajimotors.ryxer.site",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Vehicles",
        item: "https://balajimotors.ryxer.site/vehicles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: vehicle.name,
        item: `https://balajimotors.ryxer.site/vehicles/${vehicle.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <VehicleDetailContent
        vehicle={vehicle}
        relatedVehicles={relatedVehicles}
      />
    </>
  );
}