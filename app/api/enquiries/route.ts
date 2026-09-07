import { NextResponse } from "next/server";
import { getAllLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = getAllLeads();
    return NextResponse.json({
      total: leads.length,
      leads: leads.map((l) => ({
        referenceId: l.referenceId,
        fullName: l.fullName,
        phone: l.phone,
        email: l.email,
        city: l.city,
        vehicle: l.vehicle,
        enquiryType: l.enquiryType,
        quantity: l.quantity,
        createdAt: l.createdAt,
        status: l.status,
        emailStatus: l.emailStatus,
      })),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error retrieving leads";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
