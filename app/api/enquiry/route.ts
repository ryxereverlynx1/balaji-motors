import { NextRequest, NextResponse } from "next/server";
import { saveLead, generateReferenceId, LeadRecord } from "@/lib/leads";
import { generateEnquiryPdf } from "@/lib/pdf";
import { sendEnquiryEmails } from "@/lib/mailer";

const rateLimitMap = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const lastRequest = rateLimitMap.get(ip);
    if (lastRequest && now - lastRequest < 2500) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few seconds before submitting again." },
        { status: 429 }
      );
    }
    rateLimitMap.set(ip, now);

    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      city,
      vehicle,
      enquiryType,
      quantity,
      preferredContact,
      companyName,
      notes,
      language = "en",
      hp_company_url,
    } = body;

    if (hp_company_url && String(hp_company_url).trim().length > 0) {
      return NextResponse.json({ success: true, message: "Enquiry submitted" });
    }

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone || "").replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    if (!city || typeof city !== "string" || city.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide your city or district in Punjab." },
        { status: 400 }
      );
    }

    const referenceId = generateReferenceId();
    const lead: LeadRecord = {
      referenceId,
      fullName: fullName.trim(),
      phone: cleanPhone,
      email: email && typeof email === "string" ? email.trim() : undefined,
      city: city.trim(),
      vehicle: vehicle || "BAXY Super King E-Rickshaw",
      enquiryType: enquiryType || "Vehicle Purchase",
      quantity: typeof quantity === "number" && quantity > 0 ? quantity : 1,
      preferredContact: preferredContact || "Phone Call",
      companyName: companyName && typeof companyName === "string" ? companyName.trim() : undefined,
      notes: notes && typeof notes === "string" ? notes.trim() : undefined,
      language: language === "en" ? "en" : "hi",
      createdAt: new Date().toISOString(),
      status: "new",
      emailStatus: "pending_config",
      ip,
    };

    let customerPdfBuffer: Buffer | null = null;
    let companyPdfBuffer: Buffer | null = null;

    try {
      customerPdfBuffer = await generateEnquiryPdf(lead, { type: "customer" });
      companyPdfBuffer = await generateEnquiryPdf(lead, { type: "company" });
    } catch {}

    if (customerPdfBuffer && companyPdfBuffer) {
      const emailResult = await sendEnquiryEmails({
        lead,
        customerPdf: customerPdfBuffer,
        companyPdf: companyPdfBuffer,
      });

      if (emailResult.customerEmailSent || emailResult.companyEmailSent) {
        lead.emailStatus = "sent";
      } else if (emailResult.pendingConfig) {
        lead.emailStatus = "pending_config";
      } else if (emailResult.error) {
        lead.emailStatus = "failed";
      }
    }

    saveLead(lead);

    const pdfBase64 = customerPdfBuffer ? customerPdfBuffer.toString("base64") : undefined;

    return NextResponse.json({
      success: true,
      referenceId: lead.referenceId,
      customerPdfBase64: pdfBase64,
      emailStatus: lead.emailStatus,
      message: "Enquiry successfully logged.",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
