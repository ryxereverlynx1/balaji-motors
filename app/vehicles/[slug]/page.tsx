import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { vehiclesData } from "@/data/vehicles";
import VehicleDetailContent from "@/components/VehicleDetailContent";

interface VehiclePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return vehiclesData.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

export function generateMetadata({ params }: VehiclePageProps): Metadata {
  const vehicle = vehiclesData.find((v) => v.slug === params.slug);
  if (!vehicle) return { title: "Vehicle Not Found | Balaji Motors" };

  return {
    title: `${vehicle.name} | Balaji Motors Jalandhar`,
    description: `${vehicle.tagline} Available at Balaji Motors, Jalandhar, Punjab. Inspect specifications and on-road pricing.`,
  };
}

export default function VehicleDetailPage({ params }: VehiclePageProps) {
  const vehicle = vehiclesData.find((v) => v.slug === params.slug);

  if (!vehicle) {
    notFound();
  }

  const relatedVehicles = vehiclesData
    .filter((v) => v.id !== vehicle.id)
    .slice(0, 3);

  return (
    <VehicleDetailContent
      vehicle={vehicle}
      relatedVehicles={relatedVehicles}
    />
  );
}