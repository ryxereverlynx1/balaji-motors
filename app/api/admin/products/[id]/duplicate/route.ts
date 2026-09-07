import { NextRequest, NextResponse } from "next/server";
import { duplicateProduct, logActivity } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    const adminEmail = session ? session.email : "admin";

    const copy = await duplicateProduct(id);
    if (!copy) {
      return NextResponse.json({ error: "Failed to duplicate product" }, { status: 404 });
    }

    await logActivity({
      adminEmail,
      action: "duplicate_product",
      entityType: "product",
      entityId: copy.id,
      details: `Duplicated product into "${copy.name}" (${copy.slug})`,
    });

    return NextResponse.json({ success: true, product: copy }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to duplicate product" }, { status: 500 });
  }
}