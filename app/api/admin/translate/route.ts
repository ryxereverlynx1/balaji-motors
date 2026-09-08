import { NextRequest, NextResponse } from "next/server";

const DICTIONARY: Record<string, string> = {
  "motor power": "मोटर पावर",
  "battery capacity": "बैटरी क्षमता",
  "driving range": "ड्राइविंग रेंज",
  "top speed": "अधिकतम गति",
  "charging time": "चार्जिंग समय",
  "seating capacity": "बैठने की क्षमता",
  "payload capacity": "पेलोड क्षमता",
  "gross vehicle weight": "सकल वाहन वजन",
  "brakes": "ब्रेक",
  "tyre size": "टायर का आकार",
  "front suspension": "फ्रंट सस्पेंशन",
  "rear suspension": "रियर सस्पेंशन",
  "ground clearance": "ग्राउंड क्लीयरेंस",
  "warranty": "वारंटी",
  "electric rickshaw": "इलेक्ट्रिक रिक्शा",
  "passenger e-rickshaw": "पैसेंजर ई-रिक्शा",
  "cargo loader": "कार्गो लोडर",
  "electric cargo loader": "इलेक्ट्रिक कार्गो लोडर",
  "delivery van": "डिलीवरी वैन",
  "closed van": "क्लोज्ड वैन",
  "high torque": "हाई टॉर्क",
  "lithium battery": "लिथियम बैटरी",
  "lead acid battery": "लेड एसिड बैटरी",
  "passenger vehicle": "यात्री वाहन",
  "cargo vehicle": "मालवाहक वाहन",
  "commercial vehicle": "व्यावसायिक वाहन",
  "electric vehicle": "इलेक्ट्रिक वाहन",
  "drum brakes": "ड्रम ब्रेक",
  "hydraulic brakes": "हाइड्रोलिक ब्रेक",
  "disc brakes": "डिस्क ब्रेक",
  "heavy duty": "हैवी ड्यूटी",
  "chassis": "चेसिस",
  "drivetrain": "ड्राइवट्रेन",
  "transmission": "ट्रांसमिशन",
  "on enquiry": "पूछताछ पर",
  "fixed price": "निश्चित मूल्य",
};

function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

async function translateViaGoogle(text: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const parts = data[0].map((item: unknown) => (Array.isArray(item) ? item[0] : "")).filter(Boolean);
      const joined = parts.join("");
      return joined ? unescapeHtml(joined.trim()) : null;
    }
    return null;
  } catch {
    return null;
  }
}

async function translateViaMyMemory(text: string): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.responseData?.translatedText) {
      const translated = unescapeHtml(data.responseData.translatedText.trim());
      if (!translated.toUpperCase().includes("MYMEMORY WARNING")) {
        return translated;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (!text) {
      return NextResponse.json({ success: true, translation: "" });
    }

    const lower = text.toLowerCase();
    if (DICTIONARY[lower]) {
      return NextResponse.json({
        success: true,
        translation: DICTIONARY[lower],
        source: "dictionary",
      });
    }

    let translation = await translateViaGoogle(text);

    if (!translation) {
      translation = await translateViaMyMemory(text);
    }

    if (!translation) {
      return NextResponse.json(
        { success: false, error: "Translation service unavailable", translation: text },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      translation,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Translation error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
