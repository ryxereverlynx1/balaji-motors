import { NextRequest, NextResponse } from "next/server";
import { getLeadByReferenceId } from "@/lib/leads";
import { generateEnquiryPdf } from "@/lib/pdf";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const lead = getLeadByReferenceId(id);

    if (!lead) {
      return NextResponse.json({ error: "Enquiry record not found." }, { status: 404 });
    }

    const pdfBuffer = await generateEnquiryPdf(lead, { type: "customer" });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Balaji-Motors-Quote-${id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error generating PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
