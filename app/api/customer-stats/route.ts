import { NextResponse } from "next/server";
import { getCustomerStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getCustomerStats();
    return NextResponse.json({ success: true, stats });
  } catch {
    return NextResponse.json({ error: "Failed to fetch customer stats" }, { status: 500 });
  }
}