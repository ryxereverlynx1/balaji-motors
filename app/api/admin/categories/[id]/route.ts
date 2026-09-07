import { NextRequest, NextResponse } from "next/server";
import { getCategoryById, saveCategory, deleteCategory, getProducts, logActivity } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    const adminEmail = session ? session.email : "admin";

    const existing = await getCategoryById(id);
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const body = await req.json();
    const updated = await saveCategory({
      ...body,
      id,
    });

    await logActivity({
      adminEmail,
      action: "update_category",
      entityType: "category",
      entityId: id,
      details: `Updated category "${updated.name}"`,
    });

    return NextResponse.json({ success: true, category: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    const adminEmail = session ? session.email : "admin";

    const existing = await getCategoryById(id);
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const products = await getProducts();
    const assignedProducts = products.filter((p) => p.categoryId === id && p.status !== "archived");
    if (assignedProducts.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${existing.name}". It is assigned to ${assignedProducts.length} active products. Reassign those products first.`,
        },
        { status: 400 }
      );
    }

    const success = await deleteCategory(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }

    await logActivity({
      adminEmail,
      action: "delete_category",
      entityType: "category",
      entityId: id,
      details: `Deleted category "${existing.name}"`,
    });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}