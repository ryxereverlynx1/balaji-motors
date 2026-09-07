export interface DealershipConfig {
  name: string;
  legalName: string;
  tagline: string;
  primaryPhone: string;
  displayPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  address: {
    street: string;
    landmark: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    fullFormatted: string;
  };
  brandAffiliation: string;
  openingHours: {
    days: string;
    hours: string;
  }[];
  servicesOffered: string[];
  navLinks: {
    label: string;
    href: string;
  }[];
}

export const siteConfig: DealershipConfig = {
  name: "Balaji Motors",
  legalName: "Balaji Motors Electric Rickshaw Dealership",
  tagline: "Electric Rickshaws for Everyday Business",
  primaryPhone: "+919464518091",
  displayPhone: "+91 94645 18091",
  secondaryPhone: "+91 98728 28091",
  whatsappNumber: "919464518091",
  whatsappDisplay: "+91 94645 18091",
  email: "balajimotors.jalandhar@gmail.com",
  address: {
    street: "Avtar Nagar Road",
    landmark: "Near Hotel Regent Park / Gujral Nagar",
    area: "Gujral Nagar",
    city: "Jalandhar",
    state: "Punjab",
    pincode: "144001",
    country: "India",
    fullFormatted: "Near Hotel Regent Park, Avtar Nagar Road, Gujral Nagar, Jalandhar, Punjab 144001",
  },
  brandAffiliation: "Authorized Dealership for BAXY Electric Three-Wheelers & Leading E-Rickshaw Brands",
  openingHours: [
    { days: "Monday - Saturday", hours: "9:30 AM - 7:30 PM" },
    { days: "Sunday", hours: "10:30 AM - 4:00 PM (By Appointment)" },
  ],
  servicesOffered: [
    "New Electric Passenger Rickshaws",
    "Commercial Electric Cargo Loaders",
    "On-Spot Finance & Loan Guidance",
    "Battery Diagnostics & Replacements",
    "Genuine Spare Parts Supply",
    "Showroom Service & Scheduled Maintenance",
  ],
  navLinks: [
    { label: "Home", href: "/" },
    { label: "E-Rickshaws", href: "/vehicles" },
    { label: "Services", href: "/services" },
    { label: "Finance", href: "/finance" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};