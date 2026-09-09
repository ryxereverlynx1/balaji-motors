import type { Metadata } from "next";
import FinanceContent from "@/components/FinanceContent";
import { getFinanceSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "E-Rickshaw Loan, EMI Calculator & Subsidy Guidance",
  description: "Get on-spot loan approval and low-interest EMI financing for electric rickshaws and cargo loaders in Jalandhar, Punjab. Minimal documentation and fast processing.",
  keywords: [
    "E-Rickshaw Loan Jalandhar",
    "Electric Auto EMI Punjab",
    "E-Rickshaw Down Payment",
    "Commercial Vehicle Finance Punjab",
    "Electric Rickshaw Subsidy Jalandhar",
  ],
  alternates: {
    canonical: "https://balajimotors.ryxer.site/finance",
  },
  openGraph: {
    title: "E-Rickshaw Loan & EMI Guidance | Balaji Motors Jalandhar",
    description: "Get on-spot loan approval and low-interest EMI financing for electric rickshaws and cargo loaders in Jalandhar, Punjab. Minimal documentation and fast processing.",
    url: "https://balajimotors.ryxer.site/finance",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Balaji Motors E-Rickshaw Finance Support",
      },
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much minimum down payment is required to buy an electric rickshaw?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Down payment options start with flexible schemes depending on profile, banking history, and vehicle model. Contact Balaji Motors showroom in Jalandhar for personalized schemes.",
      },
    },
    {
      "@type": "Question",
      name: "Which banks and finance companies provide loans for Balaji Motors e-rickshaws?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Balaji Motors partners with leading NBFCs, private vehicle financers, and commercial vehicle lenders in Punjab to ensure smooth processing and competitive interest rates.",
      },
    },
    {
      "@type": "Question",
      name: "Are electric rickshaw subsidies available in Punjab?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, our team assists you with government EV policy guidelines, road tax exemptions, and vehicle registration paperwork in Punjab.",
      },
    },
  ],
};

export default async function FinancePage() {
  const financeSettings = await getFinanceSettings();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FinanceContent financeSettings={financeSettings} />
    </>
  );
}