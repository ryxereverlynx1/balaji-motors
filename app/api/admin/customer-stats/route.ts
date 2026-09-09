import { NextRequest, NextResponse } from "next/server";
import { getCustomerStats, createCustomerStat } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getCustomerStats();
    return NextResponse.json({ success: true, stats });
  } catch {
    return NextResponse.json({ error: "Failed to fetch customer stats" }, { status: 500 });
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
    const { value, valueHi, title, titleHi, description, descriptionHi, displayOrder = 1 } = body;

    if (!value || typeof value !== "string" || !value.trim()) {
      return NextResponse.json({ error: "Metric value is required (e.g. 1000+ or 98%)." }, { status: 400 });
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const newStat = await createCustomerStat(
      {
        value: value.trim(),
        valueHi: valueHi?.trim() || value.trim(),
        title: title.trim(),
        titleHi: titleHi?.trim() || undefined,
        description: description?.trim() || "",
        descriptionHi: descriptionHi?.trim() || undefined,
        displayOrder: Number(displayOrder) || 1,
      },
      session.email
    );

    return NextResponse.json({ success: true, stat: newStat }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create customer stat card" }, { status: 500 });
  }
}