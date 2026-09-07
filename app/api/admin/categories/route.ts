import { NextRequest, NextResponse } from "next/server";
import { getCategories, saveCategory, logActivity } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    const adminEmail = session ? session.email : "admin";

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Category name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const saved = await saveCategory(body);

    await logActivity({
      adminEmail,
      action: "create_category",
      entityType: "category",
      entityId: saved.id,
      details: `Created category "${saved.name}"`,
    });

    return NextResponse.json({ success: true, category: saved }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}