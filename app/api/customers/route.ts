import { NextRequest, NextResponse } from "next/server";
import { getCustomers } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    const customers = await getCustomers({ search, featuredOnly });
    return NextResponse.json({ success: true, customers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch customer stories" }, { status: 500 });
  }
}
