export interface EnquiryTypeOption {
  id: string;
  labelEn: string;
  labelHi: string;
}

export const enquiryTypeOptions: EnquiryTypeOption[] = [
  { id: "vehicle-purchase", labelEn: "Vehicle Purchase", labelHi: "नया वाहन खरीद" },
  { id: "price-enquiry", labelEn: "Price Enquiry", labelHi: "ऑन-रोड कीमत पूछताछ" },
  { id: "finance-enquiry", labelEn: "Finance & Loan Enquiry", labelHi: "लोन व आसान किश्तें (EMI)" },
  { id: "bulk-purchase", labelEn: "Bulk Commercial Fleet", labelHi: "कमर्शियल फ्लीट / थोक खरीद" },
  { id: "service-enquiry", labelEn: "Service & Maintenance", labelHi: "सर्विस व मेंटेनेंस" },
  { id: "spares-enquiry", labelEn: "Spare Parts & Battery", labelHi: "स्पेयर पार्ट्स व बैटरी" },
  { id: "other", labelEn: "Other Enquiry", labelHi: "अन्य जानकारी" },
];
