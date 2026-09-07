import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import "pdfkit/standard-fonts/Helvetica";
import "pdfkit/standard-fonts/HelveticaBold";
import { LeadRecord } from "@/lib/leads";
import { vehiclesData } from "@/data/vehicles";
import { getAllPublicVehicles } from "@/lib/products";
import { siteConfig } from "@/data/site";

export interface GeneratePdfOptions {
  type: "customer" | "company";
}

function generateFallbackPdf(lead: LeadRecord, options: GeneratePdfOptions): Buffer {
  const isCompany = options.type === "company";
  const lines = [
    "BALAJI MOTORS - JALANDHAR",
    "Commercial Electric Mobility Solutions",
    "-------------------------------------------------------",
    isCompany ? "INTERNAL SALES LEAD & ENQUIRY DOSSIER" : "COMMERCIAL VEHICLE ENQUIRY & QUOTE REQUEST",
    `Reference ID: ${lead.referenceId}`,
    `Date: ${new Date(lead.createdAt).toLocaleDateString("en-IN")}`,
    `Customer Name: ${lead.fullName}`,
    `Mobile Contact: ${lead.phone}`,
    `Email: ${lead.email || "Not Provided"}`,
    `Location / City: ${lead.city}`,
    `Vehicle: ${lead.vehicle}`,
    `Enquiry Type: ${lead.enquiryType}`,
    `Quantity: ${lead.quantity || 1} Unit(s)`,
    `Preferred Contact: ${lead.preferredContact}`,
    `Company / Firm: ${lead.companyName || "Individual Operator"}`,
    `Notes: ${lead.notes || "Standard showroom quotation requested."}`,
    "-------------------------------------------------------",
    "Dealership Notice: Final on-road pricing and state EV subsidies",
    "are finalized upon physical showroom consultation.",
    "Balaji Motors, Avtar Nagar Road, Near Hotel Regent Park, Jalandhar",
    `Phone: ${siteConfig.displayPhone}`
  ];

  let stream = "BT\n/F1 12 Tf\n14.4 TL\n50 780 Td\n";
  for (const line of lines) {
    const escaped = line.replace(/[()\\]/g, "\\$&");
    stream += `(${escaped}) '\n`;
  }
  stream += "ET";
  const streamBuf = Buffer.from(stream, "utf-8");

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  function addObj(content: string) {
    offsets.push(pdf.length);
    pdf += content + "\n";
  }

  addObj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  addObj("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj");
  addObj("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj");
  addObj(`4 0 obj\n<< /Length ${streamBuf.length} >>\nstream\n${stream}\nendstream\nendobj`);
  addObj("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj");

  const startXref = pdf.length;
  pdf += `xref\n0 ${offsets.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${startXref}\n%%EOF`;

  return Buffer.from(pdf, "binary");
}

export async function generateEnquiryPdf(
  lead: LeadRecord,
  options: GeneratePdfOptions = { type: "customer" }
): Promise<Buffer> {
  let dbVehicles: any[] = [];
  try {
    dbVehicles = await getAllPublicVehicles();
  } catch {}

  return new Promise((resolve) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 36, bottom: 36, left: 40, right: 40 },
        info: {
          Title: `Balaji Motors - ${lead.referenceId}`,
          Author: "Balaji Motors Jalandhar",
          Subject: "Electric Rickshaw Dealership Enquiry",
        },
      });

      const buffers: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", () => resolve(generateFallbackPdf(lead, options)));

      const isCompany = options.type === "company";
      const vehicleObj =
        dbVehicles.find(
          (v) => v.name.toLowerCase() === lead.vehicle.toLowerCase() || v.name.includes(lead.vehicle)
        ) ||
        vehiclesData.find(
          (v) => v.name.toLowerCase() === lead.vehicle.toLowerCase() || v.name.includes(lead.vehicle)
        ) ||
        vehiclesData[0];

      doc.rect(0, 0, doc.page.width, 85).fill("#C9232A");
      doc.rect(0, 85, doc.page.width, 5).fill("#F2C94C");

      doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(22).text("BALAJI MOTORS", 40, 20);
      doc.font("Helvetica").fontSize(8).fillColor("#FFE5E5").text("JALANDHAR • COMMERCIAL ELECTRIC VEHICLES", 40, 46);
      doc.fontSize(8).text(
        "Near Hotel Regent Park, Avtar Nagar Road, Gujral Nagar, Jalandhar, Punjab 144001",
        40,
        58
      );
      doc.fontSize(8).text(`Phone: ${siteConfig.displayPhone} | Web: balajimotors-jalandhar.com`, 40, 70);

      const headerRightTitle = isCompany ? "COMPANY LEAD COPY" : "CUSTOMER COPY";
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#F2C94C").text(headerRightTitle, 380, 24, { align: "right", width: 175 });
      doc.font("Helvetica").fontSize(8).fillColor("#FFFFFF").text(`Ref: ${lead.referenceId}`, 380, 40, { align: "right", width: 175 });
      doc.text(`Date: ${new Date(lead.createdAt).toLocaleDateString("en-IN")}`, 380, 52, { align: "right", width: 175 });

      let currentY = 108;

      const docHeading = isCompany
        ? "INTERNAL SALES LEAD & ENQUIRY DOSSIER"
        : "COMMERCIAL VEHICLE ENQUIRY & QUOTE REQUEST";

      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(14).text(docHeading, 40, currentY);
      currentY += 22;

      doc.rect(40, currentY, doc.page.width - 80, 1).fill("#E6DED0");
      currentY += 12;

      doc.rect(40, currentY, doc.page.width - 80, 110).fill("#F7F1E5");
      doc.rect(40, currentY, doc.page.width - 80, 110).stroke("#E6DED0");

      doc.fillColor("#C9232A").font("Helvetica-Bold").fontSize(10).text("PROSPECT / BUYER INFORMATION", 52, currentY + 10);

      const col1Left = 52;
      const col2Left = 240;
      const col3Left = 410;
      const row1Y = currentY + 30;
      const row2Y = currentY + 68;

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(8).text("FULL NAME", col1Left, row1Y);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(10).text(lead.fullName, col1Left, row1Y + 12);

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(8).text("MOBILE CONTACT", col2Left, row1Y);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(10).text(lead.phone, col2Left, row1Y + 12);

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(8).text("EMAIL ADDRESS", col3Left, row1Y);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(9).text(lead.email || "Not Provided", col3Left, row1Y + 12);

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(8).text("LOCATION / DISTRICT", col1Left, row2Y);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(9).text(lead.city || "Jalandhar, Punjab", col1Left, row2Y + 12);

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(8).text("PREFERRED CONTACT", col2Left, row2Y);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(9).text(lead.preferredContact || "Phone Call", col2Left, row2Y + 12);

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(8).text("BUSINESS / FIRM NAME", col3Left, row2Y);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(9).text(lead.companyName || "Individual Operator", col3Left, row2Y + 12);

      currentY += 124;

      doc.fillColor("#C9232A").font("Helvetica-Bold").fontSize(11).text("SELECTED COMMERCIAL VEHICLE", 40, currentY);
      currentY += 18;

      doc.rect(40, currentY, doc.page.width - 80, 160).fill("#FFFDF8");
      doc.rect(40, currentY, doc.page.width - 80, 160).stroke("#E6DED0");

      let imageRendered = false;
      const pngCandidates = [
        path.join(process.cwd(), "public", "products", "baxy-super-king.png"),
        path.join(process.cwd(), "public", "images", "rickshaw-red.webp"),
      ];

      for (const cand of pngCandidates) {
        if (fs.existsSync(cand) && !imageRendered) {
          try {
            doc.image(cand, 52, currentY + 16, { fit: [160, 128], align: "center", valign: "center" });
            imageRendered = true;
          } catch {}
        }
      }

      const vInfoX = imageRendered ? 230 : 52;

      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(13).text(vehicleObj.name, vInfoX, currentY + 14);
      doc.fillColor("#6F6B63").font("Helvetica").fontSize(8).text(`${vehicleObj.series} • ${vehicleObj.category}`, vInfoX, currentY + 32);

      doc.rect(vInfoX, currentY + 44, doc.page.width - 40 - vInfoX, 1).fill("#E6DED0");

      const specCol1 = vInfoX;
      const specCol2 = vInfoX + 160;
      let specY = currentY + 54;

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(7.5).text("MOTOR TYPE", specCol1, specY);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(8.5).text(vehicleObj.specs.motor, specCol1, specY + 10);

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(7.5).text("ESTIMATED RANGE", specCol2, specY);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(8.5).text(vehicleObj.specs.rangePerCharge, specCol2, specY + 10);

      specY += 26;
      doc.fillColor("#6F6B63").font("Helvetica").fontSize(7.5).text("BATTERY CONFIGURATION", specCol1, specY);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(8.5).text(vehicleObj.specs.batteryType, specCol1, specY + 10);

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(7.5).text("CHARGING DURATION", specCol2, specY);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(8.5).text(vehicleObj.specs.chargingTime, specCol2, specY + 10);

      specY += 26;
      const capLabel = vehicleObj.category === "Passenger" ? "SEATING CAPACITY" : "PAYLOAD CAPACITY";
      const capVal = vehicleObj.specs.seatingCapacity || vehicleObj.specs.payloadCapacity || "Commercial";
      doc.fillColor("#6F6B63").font("Helvetica").fontSize(7.5).text(capLabel, specCol1, specY);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(8.5).text(capVal, specCol1, specY + 10);

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(7.5).text("QUANTITY REQUESTED", specCol2, specY);
      doc.fillColor("#C9232A").font("Helvetica-Bold").fontSize(9).text(`${lead.quantity || 1} Unit(s)`, specCol2, specY + 10);

      currentY += 174;

      doc.fillColor("#C9232A").font("Helvetica-Bold").fontSize(11).text("ENQUIRY & COMMERCIAL REQUIREMENTS", 40, currentY);
      currentY += 18;

      doc.rect(40, currentY, doc.page.width - 80, 75).fill("#F7F1E5");
      doc.rect(40, currentY, doc.page.width - 80, 75).stroke("#E6DED0");

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(8).text("PURPOSE / ENQUIRY TYPE", 52, currentY + 10);
      doc.fillColor("#171717").font("Helvetica-Bold").fontSize(9).text(lead.enquiryType, 52, currentY + 22);

      doc.fillColor("#6F6B63").font("Helvetica").fontSize(8).text("CUSTOMER NOTES & SPECIFICATIONS", 52, currentY + 38);
      const notesText = lead.notes && lead.notes.trim() ? lead.notes.trim() : "Standard showroom quotation and battery guidance requested.";
      doc.fillColor("#171717").font("Helvetica").fontSize(8.5).text(notesText, 52, currentY + 50, { width: doc.page.width - 104, height: 20 });

      currentY += 90;

      if (isCompany) {
        doc.rect(40, currentY, doc.page.width - 80, 50).fill("#171717");
        doc.fillColor("#F2C94C").font("Helvetica-Bold").fontSize(8.5).text("INTERNAL SALES ACTION CHECKLIST", 52, currentY + 8);
        doc.fillColor("#FFFFFF").font("Helvetica").fontSize(7.5).text(
          "1. Verify customer contact and preferred callback window within 2 business hours.",
          52,
          currentY + 22
        );
        doc.text(
          "2. Check current physical showroom inventory and verify battery warranty schedule.",
          52,
          currentY + 34
        );
        currentY += 60;
      } else {
        doc.rect(40, currentY, doc.page.width - 80, 50).fill("#FFFDF8");
        doc.rect(40, currentY, doc.page.width - 80, 50).stroke("#E6DED0");
        doc.fillColor("#C9232A").font("Helvetica-Bold").fontSize(8).text("IMPORTANT DEALERSHIP NOTICE", 52, currentY + 8);
        doc.fillColor("#6F6B63").font("Helvetica").fontSize(7.5).text(
          "This summary confirms your expression of interest and price enquiry request logged with Balaji Motors, Jalandhar. Final on-road pricing, applicable state EV subsidies, down payment plans, and delivery schedules are finalized upon physical showroom consultation.",
          52,
          currentY + 20,
          { width: doc.page.width - 104 }
        );
        currentY += 60;
      }

      const footerY = doc.page.height - 45;
      doc.rect(0, footerY - 5, doc.page.width, 50).fill("#171717");
      doc.fillColor("#A8A296").font("Helvetica").fontSize(7.5).text(
        "Balaji Motors • Avtar Nagar Road, Near Hotel Regent Park, Gujral Nagar, Jalandhar, Punjab 144001 • Hotline: +91 94645 18091",
        40,
        footerY + 6,
        { align: "center", width: doc.page.width - 80 }
      );
      doc.fillColor("#F2C94C").fontSize(7).text(
        "Thank you for contacting Balaji Motors. Commercial Electric Mobility for Everyday Work.",
        40,
        footerY + 18,
        { align: "center", width: doc.page.width - 80 }
      );

      doc.end();
    } catch {
      resolve(generateFallbackPdf(lead, options));
    }
  });
}

export const generateLeadPdf = generateEnquiryPdf;
