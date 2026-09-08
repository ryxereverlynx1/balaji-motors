export interface VehicleColor {
  name: string;
  nameHi: string;
  hex: string;
  image: string;
}

export interface VehicleHotspot {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  top: string;
  left: string;
}

export interface VehicleSpecs {
  motor: string;
  batteryType: string;
  batteryCapacity: string;
  rangePerCharge: string;
  chargingTime: string;
  seatingCapacity?: string;
  payloadCapacity?: string;
  topSpeed: string;
  brakes: string;
  chassisFrame: string;
  warranty: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  series: string;
  seriesHi: string;
  category: "Passenger" | "Cargo / Loader";
  categoryHi: string;
  categoryId?: string;
  categoryName?: string;
  tagline: string;
  taglineHi: string;
  shortDescription: string;
  shortDescriptionHi: string;
  fullDescription: string;
  fullDescriptionHi: string;
  priceNote: string;
  priceNoteHi: string;
  approximateStartingPrice?: string;
  approximateStartingPriceHi?: string;
  available: boolean;
  featured: boolean;
  badges: string[];
  badgesHi: string[];
  image: string;
  gallery: string[];
  specs: VehicleSpecs;
  specsHi: VehicleSpecs;
  colors: VehicleColor[];
  hotspots: VehicleHotspot[];
  featuresList: string[];
  featuresListHi: string[];
}

export const vehiclesData: Vehicle[] = [
  {
    id: "baxy-super-king-passenger",
    slug: "baxy-super-king-passenger",
    name: "BAXY Super King E-Rickshaw",
    nameHi: "बैक्सी सुपर किंग ई-रिक्शा",
    series: "Commercial Passenger Series",
    seriesHi: "कमर्शियल पैसेंजर सीरीज",
    category: "Passenger",
    categoryHi: "पैसेंजर ई-रिक्शा",
    tagline: "High-comfort electric three-wheeler built for dependable daily passenger transport in Punjab.",
    taglineHi: "पंजाब की सड़कों पर आरामदायक सवारी व दैनिक पक्की कमाई के लिए निर्मित ई-रिक्शा।",
    shortDescription: "Rugged tubular chassis, ergonomic driver cabin, and cushioned passenger bench seating optimized for city and suburban transit.",
    shortDescriptionHi: "मजबूत ट्यूबलर चेसिस, आरामदायक ड्राइवर केबिन और शहर के सवारी रूटों के लिए गद्देदार पैसेंजर सीटें।",
    fullDescription: "Engineered specifically for heavy daily commercial mileage, the BAXY Super King passenger electric rickshaw provides drivers with low operational cost and passengers with a smooth, stable ride. Built with a reinforced steel chassis, reliable suspension, and high-efficiency electric drivetrain.",
    fullDescriptionHi: "भारी दैनिक व्यावसायिक आवागमन के लिए विशेष रूप से निर्मित, बैक्सी सुपर किंग ई-रिक्शा चालकों को अत्यंत कम संचालन खर्च और सवारियों को आरामदायक व स्थिर सफर देता है। मजबूत स्टील चेसिस और भारी सस्पेंशन से युक्त।",
    priceNote: "Ex-showroom price varies by battery configuration. Contact Balaji Motors for exact on-road quotation and subsidies.",
    priceNoteHi: "एक्स-शोरूम कीमत बैटरी विकल्प पर निर्भर करती है। ऑन-रोड कीमत और सरकारी सब्सिडी के लिए संपर्क करें।",
    approximateStartingPrice: "Price on Enquiry",
    approximateStartingPriceHi: "कीमत पूछताछ पर",
    available: true,
    featured: true,
    badges: ["Best Seller", "Passenger 4+1", "Finance Available"],
    badgesHi: ["सबसे लोकप्रिय", "सवारी 4+1", "लोन सुविधा उपलब्ध"],
    image: "/images/rickshaw-red.webp",
    gallery: [
      "/images/rickshaw-red.webp",
      "/images/rickshaw-blue.webp",
      "/images/rickshaw-green.webp",
      "/images/rickshaw-white.webp",
    ],
    specs: {
      motor: "High Torque BLDC Electric Motor",
      batteryType: "Lead-Acid / Advanced Lithium-Ion Option",
      batteryCapacity: "Configurable upon enquiry",
      rangePerCharge: "80 - 110 km per single charge (estimated)",
      chargingTime: "4 - 8 Hours depending on battery system",
      seatingCapacity: "Driver + 4 Passengers (Govt. Approved Spec)",
      topSpeed: "25 km/h (CMVR Compliant)",
      brakes: "Drum Brakes with Mechanical Parking Brake",
      chassisFrame: "Heavy Duty Tubular Steel Frame",
      warranty: "Manufacturer Warranty on Motor & Drivetrain",
    },
    specsHi: {
      motor: "हाई-टॉर्क BLDC इलेक्ट्रिक मोटर",
      batteryType: "ट्यूबलर लेड-एसिड / आधुनिक लिथियम-आयन विकल्प",
      batteryCapacity: "बजट अनुसार चयन योग्य",
      rangePerCharge: "80 से 110 किमी प्रति चार्ज (अनुमानित)",
      chargingTime: "4 से 8 घंटे (बैटरी प्रकार अनुसार)",
      seatingCapacity: "चालक + 4 सवारियां (सरकार द्वारा स्वीकृत)",
      topSpeed: "25 किमी/घंटा (मानक अनुरूप)",
      brakes: "ड्रम ब्रेक एवं मैकेनिकल हैंडब्रेक",
      chassisFrame: "हेवी ड्यूटी ट्यूबलर स्टील चेसिस",
      warranty: "मोटर व ड्राइवट्रेन पर आधिकारिक वारंटी",
    },
    colors: [
      { name: "Dealership Red", nameHi: "डीलशिप रेड", hex: "#C9232A", image: "/images/rickshaw-red.webp" },
      { name: "Punjab Blue", nameHi: "पंजाब ब्लू", hex: "#1D4ED8", image: "/images/rickshaw-blue.webp" },
      { name: "Emerald Green", nameHi: "एमराल्ड ग्रीन", hex: "#047857", image: "/images/rickshaw-green.webp" },
      { name: "Pure White", nameHi: "प्योर व्हाइट", hex: "#E5E7EB", image: "/images/rickshaw-white.webp" },
    ],
    hotspots: [
      {
        id: "motor",
        title: "BLDC Motor & Drivetrain",
        titleHi: "BLDC मोटर व डिफरेंशियल",
        description: "High-torque electric powertrain delivering quick pickup on flyovers and congested city roads.",
        descriptionHi: "फ्लाईओवरों और भीड़भाड़ में भी बिना झटके तुरंत पिकअप देने वाली शक्तिशाली इलेक्ट्रिक मोटर।",
        top: "72%",
        left: "22%",
      },
      {
        id: "battery",
        title: "Protected Under-Seat Battery Box",
        titleHi: "सुरक्षित अंडर-सीट बैटरी बॉक्स",
        description: "Secure, weather-resistant battery compartment under passenger bench for balanced center of gravity.",
        descriptionHi: "सवारियों की सीट के नीचे संतुलित वजन और मौसम की मार से सुरक्षित बैटरी चेंबर।",
        top: "62%",
        left: "52%",
      },
      {
        id: "cockpit",
        title: "Driver Cockpit & Handlebar",
        titleHi: "ड्राइवर कॉकपिट व हैंडल",
        description: "Reinforced handlebar with throttle controls, reverse switch, and clear digital speedometer console.",
        descriptionHi: "रिवर्स गियर स्विच, हॉर्न, हेडलाइट कंट्रोल और डिजिटल स्पीडोमीटर से सुसज्जित मजबूत हैंडल।",
        top: "45%",
        left: "32%",
      },
      {
        id: "cabin",
        title: "Passenger Compartment",
        titleHi: "पैसेंजर केबिन व सीटें",
        description: "Wide cushioned benches with safety grab handles, weather curtain attachments, and durable roof.",
        descriptionHi: "चौड़ी गद्देदार सीटें, सुरक्षा ग्रैब हैंडल और बारिश से बचाव के लिए मजबूत पर्दे।",
        top: "48%",
        left: "68%",
      },
      {
        id: "canopy",
        title: "Stainless Steel Roof & Luggage Carrier",
        titleHi: "मजबूत छत व लगेज कैरियर",
        description: "Fibre-reinforced aerodynamic canopy with overhead carrier rack for passenger luggage.",
        descriptionHi: "सवारियों के सामान को सुरक्षित रखने के लिए ऊपर कैरियर से युक्त वाटरप्रूफ छत।",
        top: "18%",
        left: "58%",
      },
    ],
    featuresList: [
      "CMVR and ICAT approved electric three-wheeler architecture",
      "Sturdy all-weather roof canopy with roll-down weather shields",
      "Digital instrument cluster with speed and battery level indicators",
      "Reverse gear feature for effortless maneuvering in tight alleys",
      "Front telescopic suspension and rear leaf-spring suspension system",
      "Low maintenance direct-drive transmission",
    ],
    featuresListHi: [
      "भारत सरकार CMVR एवं ICAT द्वारा प्रमाणित 3-व्हीलर चेसिस",
      "बारिश और धूप से बचाव वाली मजबूत छत व साइड कर्टन",
      "बैटरी प्रतिशत व स्पीड दर्शाने वाला डिजिटल मीटर",
      "तंग गलियों में आसानी से मुड़ने के लिए रिवर्स गियर",
      "आगे टेलीस्कोपिक शॉकर्स और पीछे भारी कमानीदार सस्पेंशन",
      "न्यूनतम मेंटेनेंस वाली डायरेक्ट-ड्राइव ट्रांसमिशन तकनीक",
    ],
  },
  {
    id: "baxy-cargo-express-loader",
    slug: "baxy-cargo-express-loader",
    name: "BAXY Cargo Express E-Loader",
    nameHi: "बैक्सी कार्गो एक्सप्रेस ई-लोडर",
    series: "Commercial Cargo Series",
    seriesHi: "कमर्शियल कार्गो सीरीज",
    category: "Cargo / Loader",
    categoryHi: "कमर्शियल ई-लोडर",
    tagline: "Purpose-built electric cargo rickshaw for city freight, wholesale markets, and logistics.",
    taglineHi: "मंडी, थोक व्यापार, गोदामों और पार्सल डिलीवरी के लिए विशेष निर्मित मालवाहक ई-लोडर।",
    shortDescription: "Generous flatbed load tray with drop-down sides, heavy-duty suspension, and optimized payload capacity for local distribution.",
    shortDescriptionHi: "खुलने वाले साइड पैनल वाली चौड़ी लोडिंग ट्रे, भारी कमानी सस्पेंशन और 400-500 किलो माल क्षमता।",
    fullDescription: "The BAXY Cargo Express is built for local merchants, couriers, hardware suppliers, and wholesale transport across Jalandhar and neighboring mandis. It cuts running expenses down to a fraction of diesel or petrol cargo three-wheelers while offering high reliability.",
    fullDescriptionHi: "जालंधर और आसपास की मंडियों, हार्डवेयर व्यापारियों, कूरियर कंपनियों और थोक माल ढुलाई के लिए तैयार। डीजल लोडर की तुलना में रोज 80% ईंधन खर्च बचाता है।",
    priceNote: "Government EV subsidy may apply. Contact Balaji Motors for current commercial quote.",
    priceNoteHi: "सरकारी सब्सिडी लागू हो सकती है। मौजूदा कमर्शियल कीमत के लिए बालाजी मोटर्स से संपर्क करें।",
    approximateStartingPrice: "Price on Enquiry",
    approximateStartingPriceHi: "कीमत पूछताछ पर",
    available: true,
    featured: true,
    badges: ["Heavy Duty", "Commercial Freight", "Low Running Cost"],
    badgesHi: ["भारी माल ढुलाई", "मंडी व गोदाम लोडर", "मात्र ₹0.35/किमी"],
    image: "/images/rickshaw-blue.webp",
    gallery: [
      "/images/rickshaw-blue.webp",
      "/images/rickshaw-red.webp",
      "/images/rickshaw-white.webp",
    ],
    specs: {
      motor: "High Output Commercial Grade Electric Motor",
      batteryType: "Lead-Acid / Lithium-Ion Available",
      batteryCapacity: "Available upon specification request",
      rangePerCharge: "70 - 100 km per charge under typical load",
      chargingTime: "4 - 8 Hours standard charging",
      payloadCapacity: "350 - 500 kg Rated Payload",
      topSpeed: "25 km/h (Commercial Regulation)",
      brakes: "Heavy Duty Drum Brakes with Handbrake",
      chassisFrame: "Reinforced Industrial Rectangular & Tubular Steel",
      warranty: "Comprehensive Powertrain Warranty",
    },
    specsHi: {
      motor: "हैवी-ड्यूटी कमर्शियल इलेक्ट्रिक मोटर",
      batteryType: "लेड-एसिड अथवा लिथियम-आयन पैक",
      batteryCapacity: "लोड के अनुसार चयन योग्य",
      rangePerCharge: "70 से 100 किमी प्रति चार्ज (लोड सहित)",
      chargingTime: "4 से 8 घंटे में फुल चार्ज",
      payloadCapacity: "350 से 500 किलोग्राम पेलोड क्षमता",
      topSpeed: "25 किमी/घंटा",
      brakes: "हैवी ब्रेक ड्रम एवं पार्किंग लीवर",
      chassisFrame: "डबल रीइन्फोर्स्ड इंडस्ट्रियल स्टील फ्रेम",
      warranty: "पावरट्रेन व चेसिस पर आधिकारिक वारंटी",
    },
    colors: [
      { name: "Punjab Blue", nameHi: "पंजाब ब्लू", hex: "#1D4ED8", image: "/images/rickshaw-blue.webp" },
      { name: "Dealership Red", nameHi: "डीलशिप रेड", hex: "#C9232A", image: "/images/rickshaw-red.webp" },
      { name: "Pure White", nameHi: "प्योर व्हाइट", hex: "#E5E7EB", image: "/images/rickshaw-white.webp" },
    ],
    hotspots: [
      {
        id: "motor",
        title: "High Torque Powertrain",
        titleHi: "हाई-टॉर्क पावरट्रेन",
        description: "Tuned for heavy freight transport with high-reduction ratio differential.",
        descriptionHi: "भारी वजन उठाने के लिए विशेष रूप से ट्यून किया गया डिफरेंशियल गियरबॉक्स।",
        top: "70%",
        left: "22%",
      },
      {
        id: "cabin",
        title: "Driver Protective Canopy",
        titleHi: "ड्राइवर सुरक्षा केबिन",
        description: "Windscreen shield and stainless steel safety enclosure.",
        descriptionHi: "तेज हवा, धूल और धूप से ड्राइवर को सुरक्षित रखने वाला फ्रंट शील्ड।",
        top: "40%",
        left: "30%",
      },
      {
        id: "chassis",
        title: "Reinforced Commercial Chassis",
        titleHi: "मजबूत लोडिंग फ्रेम",
        description: "Heavy-gauge steel frame with high tensile leaf spring suspension.",
        descriptionHi: "भारी वजन पर भी स्थिर रहने वाली मोटी स्टील चेसिस व कमानीदार सस्पेंशन।",
        top: "65%",
        left: "60%",
      },
    ],
    featuresList: [
      "Rigid cargo tub with anti-corrosion primer coating",
      "High ground clearance for rough rural and suburban roads",
      "Foldable side and rear panels for flexible pallet or crate loading",
      "Extra heavy leaf spring suspension for cargo stability",
      "High beam twin halogen / LED headlights for night transit",
      "Commercial loan and easy installment support at dealership",
    ],
    featuresListHi: [
      "जंग-रोधी प्राइमर कोटिंग वाली भारी लोडिंग ट्रे",
      "टूटी सड़कों और गड्ढों के लिए बेहतरीन ग्राउंड क्लीयरेंस",
      "क्रेट्स व बोरियां लादने के लिए तीनों तरफ से खुलने वाले पैनल",
      "माल की स्थिरता के लिए अतिरिक्त हैवी कमानी पत्ते",
      "रात में सुरक्षित आवागमन के लिए तेज रोशनी वाली हेडलाइट्स",
      "शोरूम पर ही आसान कमर्शियल लोन व किश्तों की सुविधा",
    ],
  },
  {
    id: "balaji-city-passenger-standard",
    slug: "balaji-city-passenger-standard",
    name: "Balaji City Passenger E-Rickshaw",
    nameHi: "बालाजी सिटी पैसेंजर ई-रिक्शा",
    series: "Urban Transit Series",
    seriesHi: "अर्बन पैसेंजर सीरीज",
    category: "Passenger",
    categoryHi: "पैसेंजर ई-रिक्शा",
    tagline: "Accessible, highly efficient electric rickshaw engineered for everyday owner-operators.",
    taglineHi: "किफायती, टिकाऊ और अधिक दैनिक कमाई देने वाला लोकप्रिय पैसेंजर ई-रिक्शा।",
    shortDescription: "A dependable workhorse for intra-city routes, railway station pickup, and local passenger commuting.",
    shortDescriptionHi: "रेलवे स्टेशन, बस स्टैंड और शहर के अंदरूनी मार्गों पर लगातार सवारियां ढोने के लिए सर्वोत्तम।",
    fullDescription: "Designed for high uptime and minimal maintenance, this passenger e-rickshaw provides accessible entry into clean electric mobility for drivers in Jalandhar. Backed by Balaji Motors' on-site spare parts inventory and expert technician support.",
    fullDescriptionHi: "कम खर्च में ज्यादा कमाई का पक्का जरिया। बालाजी सिटी पैसेंजर ई-रिक्शा जालंधर के चालकों के बीच अपनी लंबी बैटरी लाइफ और मजबूत बनावट के लिए जाना जाता है।",
    priceNote: "Available in multiple battery options. Contact our showroom for live pricing.",
    priceNoteHi: "विभिन्न बैटरी विकल्पों में उपलब्ध। ताज़ा कीमत के लिए हमारे शोरूम से संपर्क करें।",
    approximateStartingPrice: "Price on Enquiry",
    approximateStartingPriceHi: "कीमत पूछताछ पर",
    available: true,
    featured: true,
    badges: ["Popular Choice", "Low Maintenance", "Easy EMI"],
    badgesHi: ["चालकों की पसंद", "कम मेंटेनेंस", "आसान किश्तें"],
    image: "/images/rickshaw-green.webp",
    gallery: [
      "/images/rickshaw-green.webp",
      "/images/rickshaw-red.webp",
      "/images/rickshaw-white.webp",
    ],
    specs: {
      motor: "Reliable Efficient Brushless DC Motor",
      batteryType: "Choice of Tubular Battery or Lithium Pack",
      batteryCapacity: "Specifications provided upon booking",
      rangePerCharge: "80 - 100 km per charge",
      chargingTime: "5 - 7 Hours",
      seatingCapacity: "Driver + 4 Passengers",
      topSpeed: "25 km/h",
      brakes: "Front & Rear Mechanical Drum",
      chassisFrame: "Welded Tubular Steel Structure",
      warranty: "Standard Dealership & Manufacturer Support",
    },
    specsHi: {
      motor: "भरोसेमंद ब्रशलेस डीसी (BLDC) मोटर",
      batteryType: "ट्यूबलर बैटरी अथवा लिथियम-आयन पैक",
      batteryCapacity: "बुकिंग पर चुने अनुसार",
      rangePerCharge: "80 से 100 किमी प्रति चार्ज",
      chargingTime: "5 से 7 घंटे",
      seatingCapacity: "चालक + 4 सवारियां",
      topSpeed: "25 किमी/घंटा",
      brakes: "आगे व पीछे मैकेनिकल ड्रम ब्रेक",
      chassisFrame: "वेल्डेड ट्यूबलर स्टील ढांचा",
      warranty: "डीलरशिप व निर्माता वारंटी",
    },
    colors: [
      { name: "Emerald Green", nameHi: "एमराल्ड ग्रीन", hex: "#047857", image: "/images/rickshaw-green.webp" },
      { name: "Dealership Red", nameHi: "डीलशिप रेड", hex: "#C9232A", image: "/images/rickshaw-red.webp" },
      { name: "Pure White", nameHi: "प्योर व्हाइट", hex: "#E5E7EB", image: "/images/rickshaw-white.webp" },
    ],
    hotspots: [
      {
        id: "motor",
        title: "Efficient Electric Motor",
        titleHi: "किफायती मोटर",
        description: "Tuned for low energy consumption and prolonged battery run-times.",
        descriptionHi: "कम बिजली खपत में ज्यादा माइलेज देने वाली मोटर।",
        top: "70%",
        left: "22%",
      },
      {
        id: "cabin",
        title: "Passenger Seating",
        titleHi: "सवारी सीटिंग",
        description: "Comfortable passenger bench cushions with grab rails.",
        descriptionHi: "सवारियों के आराम के लिए चौड़ी सीटें और पकड़ने के लिए मजबूत पाइप।",
        top: "50%",
        left: "65%",
      },
    ],
    featuresList: [
      "Low per-kilometer running expense compared to fuel autos",
      "Ergonomic handlebar layout with quick-response horn and indicators",
      "Wide passenger entry clearance for comfortable boarding",
      "Luggage storage area under passenger bench",
      "Spare tyre mounting bracket included",
      "Complete registration guidance and paperwork assistance in Punjab",
    ],
    featuresListHi: [
      "डीजल ऑटो के मुकाबले नगण्य रनिंग खर्च",
      "हॉर्न व इंडिकेटर के आसान कंट्रोल वाला हैंडल",
      "सवारियों के चढ़ने-उतरने के लिए चौड़ी जगह",
      "सवारियों के सामान के लिए सीट के नीचे स्टोरेज स्पेस",
      "स्पेयर स्टेपनी टायर माउंटिंग ब्रैकेट शामिल",
      "पंजाब आरटीओ पासिंग व कागजात में पूरा सहयोग",
    ],
  },
  {
    id: "balaji-delivery-closed-van",
    slug: "balaji-delivery-closed-van",
    name: "Balaji Delivery Van E-Carrier",
    nameHi: "बालाजी डिलीवरी वैन ई-कैरियर",
    series: "Secure Logistics Series",
    seriesHi: "सिक्योर लॉजिस्टिक्स सीरीज",
    category: "Cargo / Loader",
    categoryHi: "कमर्शियल बंद वैन",
    tagline: "Lockable covered container electric three-wheeler for parcel courier, FMCG, and valuable cargo.",
    taglineHi: "कूरियर, दवाइयों, बेकरी और ई-कॉमर्स पार्सल की सुरक्षित बारिश-मुक्त डिलीवरी के लिए बंद बॉक्स वैन।",
    shortDescription: "Weatherproof lockable rear cargo box built on a heavy electric chassis, keeping goods dry and secure throughout delivery rounds.",
    shortDescriptionHi: "ताला लगाने योग्य वेदरप्रूफ कंटेनर जो सामान को बारिश, धूल और चोरी से 100% सुरक्षित रखता है।",
    fullDescription: "For logistics companies, e-commerce parcel delivery hubs, bakeries, and pharmaceutical distributors, the Balaji Delivery Van provides secure, rainproof, lockable cargo transport with zero tailpipe emissions and low running costs.",
    fullDescriptionHi: "कूरियर हब, दवा वितरण, ई-कॉमर्स और मूल्यवान सामान पहुंचाने वाली कंपनियों के लिए सुरक्षित समाधान। ताले से बंद होने वाला मजबूत कंटेनर।",
    priceNote: "Custom box dimensions and branding wraps available on order.",
    priceNoteHi: "कस्टम बॉक्स साइज और ब्रांडिंग स्टिकर आर्डर पर उपलब्ध।",
    approximateStartingPrice: "Price on Enquiry",
    approximateStartingPriceHi: "कीमत पूछताछ पर",
    available: true,
    featured: false,
    badges: ["Lockable Box", "Weatherproof", "E-Commerce Fleet"],
    badgesHi: ["ताला बंद कंटेनर", "वाटरप्रूफ", "कूरियर फ्लीट"],
    image: "/images/rickshaw-white.webp",
    gallery: [
      "/images/rickshaw-white.webp",
      "/images/rickshaw-blue.webp",
      "/images/rickshaw-red.webp",
    ],
    specs: {
      motor: "High Torque Drivetrain Motor",
      batteryType: "Long-Cycle Life Battery Setup",
      batteryCapacity: "Configured per route requirement",
      rangePerCharge: "80 - 110 km per charge",
      chargingTime: "4 - 7 Hours",
      payloadCapacity: "300 - 450 kg",
      topSpeed: "25 km/h",
      brakes: "Drum Brakes with Heavy Lever Lock",
      chassisFrame: "Dual-Reinforced Steel Backbone",
      warranty: "Powertrain & Enclosure Warranty",
    },
    specsHi: {
      motor: "हाई-टॉर्क कमर्शियल मोटर",
      batteryType: "लंबी लाइफ वाली बैटरी प्रणाली",
      batteryCapacity: "डिलीवरी रूट अनुसार चयन",
      rangePerCharge: "80 से 110 किमी प्रति चार्ज",
      chargingTime: "4 से 7 घंटे",
      payloadCapacity: "300 से 450 किलोग्राम",
      topSpeed: "25 किमी/घंटा",
      brakes: "ड्रम ब्रेक व हैवी लीवर लॉक",
      chassisFrame: "डबल रीइन्फोर्स्ड स्टील चेसिस",
      warranty: "पावरट्रेन व कंटेनर पर वारंटी",
    },
    colors: [
      { name: "Pure White", nameHi: "प्योर व्हाइट", hex: "#E5E7EB", image: "/images/rickshaw-white.webp" },
      { name: "Dealership Red", nameHi: "डीलशिप रेड", hex: "#C9232A", image: "/images/rickshaw-red.webp" },
      { name: "Punjab Blue", nameHi: "पंजाब ब्लू", hex: "#1D4ED8", image: "/images/rickshaw-blue.webp" },
    ],
    hotspots: [
      {
        id: "motor",
        title: "Commercial Powertrain",
        titleHi: "कमर्शियल मोटर",
        description: "Heavy-duty motor designed for continuous parcel delivery rounds.",
        descriptionHi: "दिनभर की लगातार पार्सल डिलीवरी के लिए शक्तिशाली मोटर।",
        top: "70%",
        left: "22%",
      },
      {
        id: "cargo",
        title: "Enclosed Weatherproof Cargo Space",
        titleHi: "सुरक्षित बंद कंटेनर",
        description: "Lockable box protecting merchandise and courier packages.",
        descriptionHi: "पार्सल व बक्सों को बारिश और चोरी से बचाने वाला ताला-बंद कंटेनर।",
        top: "45%",
        left: "65%",
      },
    ],
    featuresList: [
      "Weatherproof closed cargo body for all-season parcel transport",
      "Rear twin doors with heavy-duty secure latching",
      "Flat internal floor for optimal carton packing",
      "Low operating cost per parcel delivery",
      "Full after-sales support and spare parts availability in Jalandhar",
    ],
    featuresListHi: [
      "हर मौसम में पार्सल को सूखा रखने वाला वाटरप्रूफ कंटेनर",
      "मजबूत ताले व कुंडी वाले दोहरे पिछले दरवाजे",
      "कार्टन व डिब्बों की पैकिंग के लिए समतल फर्श",
      "प्रति पार्सल डिलीवरी न्यूनतम परिचालन खर्च",
      "जालंधर में पुख्ता आफ्टर-सेल्स व स्पेयर पार्ट्स सपोर्ट",
    ],
  },
];

export function getLocalizedVehicle(vehicle: Vehicle, lang: "hi" | "en") {
  if (lang === "hi") {
    return {
      ...vehicle,
      name: vehicle.nameHi || vehicle.name,
      series: vehicle.seriesHi || vehicle.series,
      category: vehicle.categoryHi || vehicle.category,
      tagline: vehicle.taglineHi || vehicle.tagline,
      shortDescription: vehicle.shortDescriptionHi || vehicle.shortDescription,
      fullDescription: vehicle.fullDescriptionHi || vehicle.fullDescription,
      priceNote: vehicle.priceNoteHi || vehicle.priceNote,
      approximateStartingPrice: vehicle.approximateStartingPriceHi || vehicle.approximateStartingPrice,
      badges: vehicle.badgesHi || vehicle.badges,
      specs: vehicle.specsHi || vehicle.specs,
      featuresList: vehicle.featuresListHi || vehicle.featuresList,
      colors: vehicle.colors.map((c) => ({
        ...c,
        name: c.nameHi || c.name,
      })),
      hotspots: vehicle.hotspots.map((h) => ({
        ...h,
        title: h.titleHi || h.title,
        description: h.descriptionHi || h.description,
      })),
    };
  }
  return vehicle;
}