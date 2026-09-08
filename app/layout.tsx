import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { QuoteModalProvider } from "@/context/QuoteModalContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileActionBar from "@/components/MobileActionBar";
import QuoteModal from "@/components/QuoteModal";
import { siteConfig } from "@/data/site";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Balaji Motors | Electric Rickshaws & E-Loaders in Jalandhar, Punjab",
  description: "Official dealership for commercial electric rickshaws, passenger e-rickshaws, and electric loaders in Jalandhar, Punjab. Genuine service, spare parts, and on-spot finance guidance.",
  keywords: [
    "Electric Rickshaw Dealer in Jalandhar",
    "E-Rickshaw Dealer Jalandhar",
    "Electric Auto Dealer Jalandhar",
    "Electric Three Wheeler Jalandhar",
    "BAXY E-Rickshaw Jalandhar",
    "Balaji Motors Jalandhar",
    "Electric Cargo Rickshaw Punjab",
    "E-Rickshaw Price Jalandhar",
  ],
  authors: [{ name: "Balaji Motors" }],
  creator: "Balaji Motors",
  publisher: "Balaji Motors Jalandhar",
  metadataBase: new URL("https://balajimotors.ryxer.site"),
  openGraph: {
    title: "Balaji Motors | Electric Rickshaw Dealership in Jalandhar",
    description: "Reliable commercial electric three-wheelers, passenger e-rickshaws, and electric cargo loaders with finance and service support in Jalandhar.",
    locale: "hi_IN",
    type: "website",
    siteName: "Balaji Motors",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Balaji Motors Jalandhar",
      },
    ],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "googled80a02406690a5e4",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  description: siteConfig.tagline,
  telephone: siteConfig.primaryPhone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.state,
    postalCode: siteConfig.address.pincode,
    addressCountry: "IN",
  },
  areaServed: ["Jalandhar", "Phagwara", "Kapurthala", "Hoshiarpur", "Punjab"],
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${fontSans.variable} ${fontDevanagari.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-E584XQ5Q3X"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E584XQ5Q3X');
              gtag('config', 'G-0VPTCJZ8RG');
            `,
          }}
        />
      </head>
      <body className="font-sans min-h-screen bg-brand-warmWhite text-brand-charcoal selection:bg-brand-red selection:text-white flex flex-col pb-16 sm:pb-0">
        <LanguageProvider>
          <QuoteModalProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
            <MobileActionBar />
            <QuoteModal />
          </QuoteModalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}