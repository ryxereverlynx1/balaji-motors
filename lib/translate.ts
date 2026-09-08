const CLIENT_DICTIONARY: Record<string, string> = {
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

const cache = new Map<string, string>();

function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

export async function translateToHindi(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (CLIENT_DICTIONARY[lower]) {
    return CLIENT_DICTIONARY[lower];
  }

  if (cache.has(trimmed)) {
    return cache.get(trimmed)!;
  }

  try {
    const res = await fetch("/api/admin/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.translation && typeof data.translation === "string") {
        cache.set(trimmed, data.translation);
        return data.translation;
      }
    }
  } catch {}

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const parts = data[0].map((item: unknown) => (Array.isArray(item) ? item[0] : "")).filter(Boolean);
        const joined = parts.join("");
        if (joined) {
          const clean = unescapeHtml(joined.trim());
          cache.set(trimmed, clean);
          return clean;
        }
      }
    }
  } catch {}

  return "";
}
