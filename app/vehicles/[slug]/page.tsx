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
  if (!vehicle) return { title: "Vehicle Not Found | Balaji Motors" };

  return {
    title: `${vehicle.name} | Balaji Motors Jalandhar`,
    description: `${vehicle.tagline} Available at Balaji Motors, Jalandhar, Punjab. Inspect specifications and on-road pricing.`,
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

  return (
    <VehicleDetailContent
      vehicle={vehicle}
      relatedVehicles={relatedVehicles}
    />
  );
}