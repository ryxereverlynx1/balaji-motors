import nodemailer from "nodemailer";
import { LeadRecord } from "@/lib/leads";
import { siteConfig } from "@/data/site";

interface SendEnquiryEmailParams {
  lead: LeadRecord;
  customerPdf: Buffer;
  companyPdf: Buffer;
}

interface MailerResult {
  customerEmailSent: boolean;
  companyEmailSent: boolean;
  pendingConfig?: boolean;
  error?: string;
}

export async function sendEnquiryEmails({
  lead,
  customerPdf,
  companyPdf,
}: SendEnquiryEmailParams): Promise<MailerResult> {
  const host = process.env.MAIL_HOST;
  const port = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587;
  const user = process.env.MAIL_USERNAME;
  const pass = process.env.MAIL_PASSWORD;
  const from = process.env.MAIL_FROM || `Balaji Motors <${siteConfig.email}>`;
  const companyEmail = process.env.COMPANY_EMAIL || siteConfig.email;

  if (!host || !user || !pass) {
    return {
      customerEmailSent: false,
      companyEmailSent: false,
      pendingConfig: true,
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    let customerSent = false;
    let companySent = false;

    if (lead.email && lead.email.includes("@")) {
      const isHi = lead.language === "hi";
      const subject = isHi
        ? `बालाजी मोटर्स — पूछताछ विवरण व कोटेशन सारांश — [${lead.referenceId}]`
        : `Balaji Motors — Enquiry Summary — [${lead.referenceId}]`;

      const textBody = isHi
        ? `नमस्ते ${lead.fullName},\n\nबालाजी मोटर्स जालंधर से संपर्क करने के लिए धन्यवाद।\n\nआपकी ${lead.vehicle} के लिए पूछताछ दर्ज कर ली गई है। संदर्भ संख्या: ${lead.referenceId}।\n\nकृपया संलग्न कोटेशन सारांश PDF देखें। हमारी टीम जल्द ही आपसे फोन नंबर ${lead.phone} पर संपर्क करेगी।\n\nबालाजी मोटर्स, अवतार नगर रोड, जालंधर\nहेल्पलाइन: ${siteConfig.displayPhone}`
        : `Dear ${lead.fullName},\n\nThank you for contacting Balaji Motors, Jalandhar.\n\nYour enquiry for ${lead.vehicle} has been logged with reference ID: ${lead.referenceId}.\n\nPlease find your Enquiry Summary PDF document attached. Our team will contact you shortly on ${lead.phone}.\n\nBalaji Motors, Avtar Nagar Road, Jalandhar\nDirect Line: ${siteConfig.displayPhone}`;

      await transporter.sendMail({
        from,
        to: lead.email,
        subject,
        text: textBody,
        attachments: [
          {
            filename: `Balaji-Motors-Quote-${lead.referenceId}.pdf`,
            content: customerPdf,
            contentType: "application/pdf",
          },
        ],
      });
      customerSent = true;
    }

    const companySubject = `New Balaji Motors Lead — [${lead.referenceId}] — ${lead.fullName} (${lead.city})`;
    const companyText = `NEW DEALERSHIP ENQUIRY RECEIVED:\n\nReference: ${lead.referenceId}\nTimestamp: ${lead.createdAt}\n\nPROSPECT DETAILS:\n- Name: ${lead.fullName}\n- Mobile: ${lead.phone}\n- Email: ${lead.email || "Not Provided"}\n- City/District: ${lead.city}\n- Business Name: ${lead.companyName || "N/A"}\n- Preferred Contact: ${lead.preferredContact}\n\nVEHICLE REQUIREMENT:\n- Model: ${lead.vehicle}\n- Type: ${lead.enquiryType}\n- Quantity: ${lead.quantity}\n- Customer Notes: ${lead.notes || "None"}\n\nPlease review the attached internal lead dossier for sales action.`;

    await transporter.sendMail({
      from,
      to: companyEmail,
      subject: companySubject,
      text: companyText,
      attachments: [
        {
          filename: `Internal-Lead-${lead.referenceId}.pdf`,
          content: companyPdf,
          contentType: "application/pdf",
        },
      ],
    });
    companySent = true;

    return {
      customerEmailSent: customerSent,
      companyEmailSent: companySent,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    return {
      customerEmailSent: false,
      companyEmailSent: false,
      error: message,
    };
  }
}
