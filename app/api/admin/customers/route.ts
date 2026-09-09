import { NextRequest, NextResponse } from "next/server";
import { getCustomers, createCustomer } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    const customers = await getCustomers({ search, featuredOnly });
    return NextResponse.json({ success: true, customers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      nameHi,
      location,
      locationHi,
      vehicleName,
      vehicleNameHi,
      deliveryDate,
      deliveryDateHi,
      rating = 5,
      quote,
      quoteHi,
      image,
      featured = true,
      displayOrder = 1,
    } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Customer name is required (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!vehicleName || typeof vehicleName !== "string") {
      return NextResponse.json(
        { error: "Vehicle name is required." },
        { status: 400 }
      );
    }

    if (!quote || typeof quote !== "string" || quote.trim().length < 5) {
      return NextResponse.json(
        { error: "Customer quote/review is required (at least 5 characters)." },
        { status: 400 }
      );
    }

    const record = await createCustomer(
      {
        name: name.trim(),
        nameHi: nameHi?.trim() || undefined,
        location: location?.trim() || "Jalandhar, Punjab",
        locationHi: locationHi?.trim() || undefined,
        vehicleName: vehicleName.trim(),
        vehicleNameHi: vehicleNameHi?.trim() || undefined,
        deliveryDate: deliveryDate?.trim() || new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
        deliveryDateHi: deliveryDateHi?.trim() || undefined,
        rating: Math.max(1, Math.min(5, Number(rating) || 5)),
        quote: quote.trim(),
        quoteHi: quoteHi?.trim() || undefined,
        image: image || "/images/SARGAM-VICTOR-BLUE-2.webp",
        featured: Boolean(featured),
        displayOrder: Number(displayOrder) || 1,
      },
      session.email
    );

    return NextResponse.json({ success: true, customer: record });
  } catch {
    return NextResponse.json({ error: "Failed to create customer record" }, { status: 500 });
  }
}
