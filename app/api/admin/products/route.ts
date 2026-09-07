import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProduct, logActivity } from "@/lib/db";
import { ProductFilter, ProductStatus } from "@/lib/db/types";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || undefined;
    const status = (searchParams.get("status") as ProductStatus | "all") || undefined;
    const search = searchParams.get("search") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    const filter: ProductFilter = {
      categorySlug,
      status,
      search,
      featuredOnly,
    };

    const products = await getProducts(filter);
    return NextResponse.json({ success: true, products });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    const adminEmail = session ? session.email : "admin";

    const body = await req.json();
    const { name, categoryId, shortDescription, fullDescription } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Product name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== "string") {
      return NextResponse.json(
        { error: "Category selection is required." },
        { status: 400 }
      );
    }

    const saved = await saveProduct(body);

    await logActivity({
      adminEmail,
      action: "create_product",
      entityType: "product",
      entityId: saved.id,
      details: `Created product "${saved.name}" (${saved.status})`,
    });

    return NextResponse.json({ success: true, product: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}