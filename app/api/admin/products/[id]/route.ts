import { NextRequest, NextResponse } from "next/server";
import { getProductById, saveProduct, deleteProduct, logActivity } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    const adminEmail = session ? session.email : "admin";

    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await req.json();
    const updated = await saveProduct({
      ...body,
      id,
    });

    await logActivity({
      adminEmail,
      action: "update_product",
      entityType: "product",
      entityId: id,
      details: `Updated product "${updated.name}" (${updated.status})`,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    const adminEmail = session ? session.email : "admin";

    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }

    await logActivity({
      adminEmail,
      action: "delete_product",
      entityType: "product",
      entityId: id,
      details: `Deleted product "${existing.name}"`,
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}