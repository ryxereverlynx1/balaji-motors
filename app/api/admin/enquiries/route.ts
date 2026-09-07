import { NextResponse } from "next/server";
import { getAllLeads } from "@/lib/leads";

export async function GET() {
  try {
    const leads = getAllLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch enquiries";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
