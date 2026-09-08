import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/db";
import { ProductFilter } from "@/lib/db/types";
import { mapProductToVehicle } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";
    const search = searchParams.get("search") || undefined;

    const filter: ProductFilter = {
      status: "published",
      categorySlug,
      featuredOnly,
      search,
    };

    const products = await getProducts(filter);
    const vehicles = products.map(mapProductToVehicle);
    return NextResponse.json({ success: true, products, vehicles });
  } catch {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}