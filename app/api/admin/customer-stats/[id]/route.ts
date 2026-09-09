import { NextRequest, NextResponse } from "next/server";
import { updateCustomerStat, deleteCustomerStat } from "@/lib/db";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await updateCustomerStat(id, body, session.email);
    if (!updated) {
      return NextResponse.json({ error: "Stat card not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, stat: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update customer stat card" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteCustomerStat(id, session.email);
    if (!success) {
      return NextResponse.json({ error: "Stat card not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Stat card deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete customer stat card" }, { status: 500 });
  }
}