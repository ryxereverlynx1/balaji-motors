import { NextResponse } from "next/server";
import { getCategories } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const all = await getCategories();
    const categories = all.filter((c) => c.enabled);
    return NextResponse.json({ success: true, categories });
  } catch {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}