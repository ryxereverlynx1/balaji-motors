import { getProducts, getProductBySlug, getCategories } from "./db";
import { ProductRecord, CategoryRecord } from "./db/types";
import { Vehicle, VehicleSpecs, VehicleColor, VehicleHotspot } from "@/data/vehicles";

const defaultColors: VehicleColor[] = [
  { name: "Dealership Red", nameHi: "डीलशिप रेड", hex: "#C9232A", image: "/images/rickshaw-red.webp" },
  { name: "Punjab Blue", nameHi: "पंजाब ब्लू", hex: "#1D4ED8", image: "/images/rickshaw-blue.webp" },
  { name: "Emerald Green", nameHi: "एमराल्ड ग्रीन", hex: "#047857", image: "/images/rickshaw-green.webp" },
  { name: "Pure White", nameHi: "प्योर व्हाइट", hex: "#E5E7EB", image: "/images/rickshaw-white.webp" },
];

const defaultHotspots: VehicleHotspot[] = [
  {
    id: "motor",
    title: "Commercial Powertrain",
    titleHi: "कमर्शियल मोटर",
    description: "High-torque electric motor with differential axle for smooth city driving.",
    descriptionHi: "दिनभर की लगातार माल ढुलाई व सवारी के लिए शक्तिशाली मोटर।",
    top: "70%",
    left: "22%",
  },
  {
    id: "cockpit",
    title: "Driver Cockpit",
    titleHi: "ड्राइवर केबिन",
    description: "Ergonomic handlebar with digital speedometer and responsive controls.",
    descriptionHi: "डिजिटल स्पीडोमीटर और आसान नियंत्रण वाला आरामदायक ड्राइवर केबिन।",
    top: "44%",
    left: "32%",
  },
  {
    id: "battery",
    title: "Battery Compartment",
    titleHi: "बैटरी कम्पार्टमेंट",
    description: "Lockable chassis tray supporting lead-acid or lithium battery systems.",
    descriptionHi: "लेड-एसिड व आधुनिक लिथियम बैटरी के लिए सुरक्षित ट्रे।",
    top: "62%",
    left: "52%",
  },
  {
    id: "seating",
    title: "Commercial Cabin",
    titleHi: "केबिन कम्फर्ट",
    description: "Reinforced structure designed for everyday commercial work.",
    descriptionHi: "दैनिक व्यावसायिक आवागमन के लिए मजबूत व टिकाऊ बनावट।",
    top: "48%",
    left: "68%",
  },
];

export function mapProductToVehicle(p: ProductRecord): Vehicle {
  const specsMap: Record<string, string> = {};
  const specsMapHi: Record<string, string> = {};

  if (Array.isArray(p.specifications)) {
    for (const spec of p.specifications) {
      specsMap[spec.label.toLowerCase()] = spec.value;
      if (spec.valueHi) {
        specsMapHi[spec.label.toLowerCase()] = spec.valueHi;
      }
    }
  }

  const isCargo =
    (p.categoryName && (p.categoryName.toLowerCase().includes("cargo") || p.categoryName.toLowerCase().includes("loader"))) ||
    p.categoryId.includes("cargo") ||
    p.categoryId.includes("loader");

  const enSpecs: VehicleSpecs = {
    motor: specsMap["motor type"] || specsMap["motor"] || "High Torque BLDC Electric Motor",
    batteryType: specsMap["battery chemistry"] || specsMap["battery"] || "Lead-Acid / Advanced Lithium-Ion Option",
    batteryCapacity: specsMap["battery capacity"] || "Configurable upon enquiry",
    rangePerCharge: specsMap["estimated range"] || specsMap["range"] || "80 - 110 km per single charge (estimated)",
    chargingTime: specsMap["charging time"] || "4 - 8 Hours depending on battery system",
    seatingCapacity: isCargo ? undefined : specsMap["capacity (seats / payload)"] || "Driver + 4 Passengers (Govt. Approved Spec)",
    payloadCapacity: isCargo ? specsMap["capacity (seats / payload)"] || "Heavy Commercial Payload" : undefined,
    topSpeed: specsMap["top speed"] || "25 km/h (CMVR Compliant)",
    brakes: specsMap["braking system"] || "Drum Brakes with Mechanical Parking Brake",
    chassisFrame: specsMap["chassis frame"] || "Heavy Duty Tubular Steel Frame",
    warranty: specsMap["warranty"] || "Manufacturer Warranty on Motor & Drivetrain",
  };

  const hiSpecs: VehicleSpecs = {
    motor: specsMapHi["motor type"] || specsMapHi["motor"] || specsMap["motor type"] || "हाई टॉर्क बीएलडीसी इलेक्ट्रिक मोटर",
    batteryType: specsMapHi["battery chemistry"] || specsMapHi["battery"] || specsMap["battery chemistry"] || "लेड-एसिड / आधुनिक लिथियम-आयन विकल्प",
    batteryCapacity: specsMapHi["battery capacity"] || specsMap["battery capacity"] || "पूछताछ अनुसार विन्यास योग्य",
    rangePerCharge: specsMapHi["estimated range"] || specsMapHi["range"] || specsMap["estimated range"] || "80 - 110 किमी प्रति सिंगल चार्ज (अनुमानित)",
    chargingTime: specsMapHi["charging time"] || specsMap["charging time"] || "बैटरी सिस्टम के अनुसार 4 - 8 घंटे",
    seatingCapacity: isCargo ? undefined : specsMapHi["capacity (seats / payload)"] || specsMap["capacity (seats / payload)"] || "चालक + 4 यात्री (सरकारी प्रमाणित)",
    payloadCapacity: isCargo ? specsMapHi["capacity (seats / payload)"] || specsMap["capacity (seats / payload)"] || "भारी व्यावसायिक पेलोड" : undefined,
    topSpeed: specsMapHi["top speed"] || specsMap["top speed"] || "25 किमी/घंटा (सीएमवीआर अनुरूप)",
    brakes: specsMapHi["braking system"] || specsMap["braking system"] || "ड्रम ब्रेक व मैकेनिकल हैंडब्रेक",
    chassisFrame: specsMapHi["chassis frame"] || specsMap["chassis frame"] || "हैवी ड्यूटी ट्यूबलर स्टील फ्रेम",
    warranty: specsMapHi["warranty"] || specsMap["warranty"] || "मोटर व ड्राइवट्रेन पर निर्माता वारंटी",
  };

  const priceText = p.priceMode === "fixed_price" && typeof p.price === "number"
    ? `₹${p.price.toLocaleString("en-IN")}`
    : "Price on Enquiry";

  const priceTextHi = p.priceMode === "fixed_price" && typeof p.price === "number"
    ? `₹${p.price.toLocaleString("en-IN")}`
    : "कीमत पूछताछ पर";

  const priceNote = p.priceMode === "fixed_price" && typeof p.price === "number"
    ? `Fixed Ex-Showroom Price: ₹${p.price.toLocaleString("en-IN")}. Contact Balaji Motors for applicable state EV subsidies and on-road registration.`
    : "Ex-showroom price varies by battery configuration. Contact Balaji Motors for exact on-road quotation and subsidies.";

  const priceNoteHi = p.priceMode === "fixed_price" && typeof p.price === "number"
    ? `नियत एक्स-शोरूम कीमत: ₹${p.price.toLocaleString("en-IN")}। सरकारी सब्सिडी और ऑन-रोड विवरण के लिए संपर्क करें।`
    : "एक्स-शोरूम कीमत बैटरी विकल्प पर निर्भर करती है। ऑन-रोड कीमत और सरकारी सब्सिडी के लिए संपर्क करें।";

  const featuresList = [
    "High-efficiency BLDC powertrain engineered for commercial reliability",
    "Heavy-duty reinforced tubular steel chassis with electrostatic anti-corrosion coat",
    "Comfortable ergonomically balanced suspension for everyday roads",
    "Low operating running cost per kilometre",
    "Authorized Balaji Motors service, spare parts and battery support in Punjab",
  ];

  const featuresListHi = [
    "व्यावसायिक मजबूती और विश्वसनीयता के लिए निर्मित शक्तिशाली बीएलडीसी मोटर",
    "जंगरोधी कोटिंग युक्त मजबूत ट्यूबलर स्टील चेसिस",
    "हर दिन के सफर के लिए आरामदायक और संतुलित सस्पेंशन",
    "प्रति किलोमीटर न्यूनतम बिजली व संचालन खर्च",
    "जालंधर में अधिकृत बालाजी मोटर्स सर्विस और असली स्पेयर पार्ट्स सपोर्ट",
  ];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    nameHi: p.nameHi || p.name,
    series: p.categoryName || (isCargo ? "Commercial Cargo Series" : "Commercial Passenger Series"),
    seriesHi: p.categoryName || (isCargo ? "कमर्शियल कार्गो सीरीज" : "कमर्शियल पैसेंजर सीरीज"),
    category: isCargo ? "Cargo / Loader" : "Passenger",
    categoryHi: isCargo ? "लोडर / मालवाहक" : "पैसेंजर ई-रिक्शा",
    categoryId: p.categoryId,
    categoryName: p.categoryName,
    tagline: p.shortDescription,
    taglineHi: p.shortDescriptionHi || p.shortDescription,
    shortDescription: p.shortDescription,
    shortDescriptionHi: p.shortDescriptionHi || p.shortDescription,
    fullDescription: p.fullDescription,
    fullDescriptionHi: p.fullDescriptionHi || p.fullDescription,
    priceNote,
    priceNoteHi,
    approximateStartingPrice: priceText,
    approximateStartingPriceHi: priceTextHi,
    available: p.status === "published",
    featured: p.featured,
    badges: p.featured ? ["Popular Model", "Finance Available"] : ["Finance Available"],
    badgesHi: p.featured ? ["लोकप्रिय मॉडल", "लोन सुविधा उपलब्ध"] : ["लोन सुविधा उपलब्ध"],
    image: p.mainImage,
    gallery: p.galleryImages.length > 0 ? p.galleryImages : [p.mainImage],
    specs: enSpecs,
    specsHi: hiSpecs,
    colors: defaultColors,
    hotspots: defaultHotspots,
    featuresList,
    featuresListHi,
  };
}

export async function getAllPublicVehicles(): Promise<Vehicle[]> {
  const products = await getProducts({ status: "published" });
  return products.map(mapProductToVehicle);
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const products = await getProducts({ status: "published", featuredOnly: true });
  return products.map(mapProductToVehicle);
}

export async function getVehicleBySlug(slug: string, allowDraft = false): Promise<Vehicle | null> {
  const product = await getProductBySlug(slug, allowDraft);
  if (!product) return null;
  return mapProductToVehicle(product);
}

export async function getPublicCategories(): Promise<CategoryRecord[]> {
  const all = await getCategories();
  return all.filter((c) => c.enabled);
}