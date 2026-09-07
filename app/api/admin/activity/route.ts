import { NextRequest, NextResponse } from "next/server";
import { getActivities } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const activities = await getActivities(limit);
    return NextResponse.json({ success: true, activities });
  } catch {
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 });
  }
}