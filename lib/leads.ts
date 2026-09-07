import fs from "fs";
import path from "path";

export interface LeadRecord {
  referenceId: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  vehicle: string;
  enquiryType: string;
  quantity: number;
  preferredContact: string;
  companyName?: string;
  notes?: string;
  language: "hi" | "en";
  createdAt: string;
  status: "new" | "contacted" | "closed";
  emailStatus: "sent" | "failed" | "pending_config" | "skipped";
  ip?: string;
}

const leadsFilePath = path.join(process.cwd(), "data", "leads.json");

function ensureLeadsFileExists() {
  const dir = path.dirname(leadsFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(leadsFilePath)) {
    fs.writeFileSync(leadsFilePath, JSON.stringify([], null, 2), "utf8");
  }
}

export function getAllLeads(): LeadRecord[] {
  ensureLeadsFileExists();
  try {
    const raw = fs.readFileSync(leadsFilePath, "utf8");
    return JSON.parse(raw) as LeadRecord[];
  } catch {
    return [];
  }
}

export function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const leads = getAllLeads();
  const count = leads.length + 101;
  const padded = String(count).padStart(6, "0");
  return `BM-${year}-${padded}`;
}

export function saveLead(lead: LeadRecord): LeadRecord {
  ensureLeadsFileExists();
  const leads = getAllLeads();
  leads.unshift(lead);
  fs.writeFileSync(leadsFilePath, JSON.stringify(leads, null, 2), "utf8");
  return lead;
}

export function getLeadByReferenceId(refId: string): LeadRecord | null {
  const leads = getAllLeads();
  return leads.find((l) => l.referenceId === refId) || null;
}
