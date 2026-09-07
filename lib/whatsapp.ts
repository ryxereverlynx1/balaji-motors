import { siteConfig } from "@/data/site";

export function createWhatsAppUrl(messageText: string): string {
  const cleanPhone = siteConfig.whatsappNumber.replace(/[^0-9]/g, "");
  const encoded = encodeURIComponent(messageText.trim());
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function getVehicleWhatsAppUrl(vehicleName: string, lang: "hi" | "en" = "hi"): string {
  if (lang === "hi") {
    const text = `नमस्ते बालाजी मोटर्स, मुझे ${vehicleName} में रुचि है। कृपया जालंधर शोरूम में इसकी ऑन-रोड कीमत, बैटरी विकल्प और डाउन पेमेंट की जानकारी साझा करें।`;
    return createWhatsAppUrl(text);
  }
  const text = `Hi Balaji Motors, I am interested in the ${vehicleName}. Please share current on-road price, battery options, and availability in Jalandhar.`;
  return createWhatsAppUrl(text);
}

export function getFinanceWhatsAppUrl(vehicleName?: string, lang: "hi" | "en" = "hi"): string {
  if (lang === "hi") {
    const vText = vehicleName ? ` (${vehicleName})` : "";
    const text = `नमस्ते बालाजी मोटर्स, मुझे ई-रिक्शा के लिए कमर्शियल लोन, डाउन पेमेंट और आसान किश्तों (EMI) की जानकारी चाहिए${vText}।`;
    return createWhatsAppUrl(text);
  }
  const vText = vehicleName ? ` for ${vehicleName}` : "";
  const text = `Hi Balaji Motors, I would like to check electric rickshaw finance, loan options, and down payment details${vText}.`;
  return createWhatsAppUrl(text);
}

export function getServiceWhatsAppUrl(lang: "hi" | "en" = "hi"): string {
  if (lang === "hi") {
    const text = "नमस्ते बालाजी मोटर्स, मुझे अपने ई-रिक्शा की सर्विस, बैटरी टेस्टिंग या असली स्पेयर पार्ट्स के बारे में पूछना है।";
    return createWhatsAppUrl(text);
  }
  const text = "Hi Balaji Motors, I would like to inquire about service, spare parts, or battery support for my electric rickshaw in Jalandhar.";
  return createWhatsAppUrl(text);
}

export function getGeneralWhatsAppUrl(lang: "hi" | "en" = "hi"): string {
  if (lang === "hi") {
    const text = "नमस्ते बालाजी मोटर्स, मैं आपके जालंधर शोरूम में उपलब्ध इलेक्ट्रिक थ्री-व्हीलर्स के बारे में जानकारी चाहता हूँ।";
    return createWhatsAppUrl(text);
  }
  const text = "Hi Balaji Motors, I would like to inquire about your electric rickshaws available at your Jalandhar dealership.";
  return createWhatsAppUrl(text);
}