import { NextRequest, NextResponse } from "next/server";
import { updateLeadStatus, getLeadByReferenceId } from "@/lib/leads";
import { logActivity } from "@/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const lead = getLeadByReferenceId(id);
    if (!lead) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch enquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["new", "contacted", "closed"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'new', 'contacted', or 'closed'." },
        { status: 400 }
      );
    }

    const updated = updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    await logActivity({
      adminEmail: "admin@balajimotors.com",
      action: "update_enquiry_status",
      entityType: "enquiry",
      entityId: id,
      details: `Lead ${id} (${updated.fullName}) marked as ${status}`,
    });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update enquiry status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
