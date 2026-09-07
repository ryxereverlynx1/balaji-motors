import { NextRequest, NextResponse } from "next/server";
import { getLeadByReferenceId } from "@/lib/leads";
import { generateEnquiryPdf } from "@/lib/pdf";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const refId = searchParams.get("referenceId");

    if (!refId) {
      return NextResponse.json({ error: "Missing referenceId parameter." }, { status: 400 });
    }

    const lead = getLeadByReferenceId(refId);
    if (!lead) {
      return NextResponse.json({ error: "Enquiry record not found." }, { status: 404 });
    }

    const pdfBuffer = await generateEnquiryPdf(lead, { type: "customer" });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Balaji-Motors-Quote-${refId}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error generating PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
