import { NextResponse } from "next/server";
import { getFinanceSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getFinanceSettings();
    return NextResponse.json({ success: true, settings });
  } catch {
    return NextResponse.json({ error: "Failed to fetch finance settings" }, { status: 500 });
  }
}