import fs from "fs";
import path from "path";
import os from "os";

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

const projectLeadsPath = path.join(process.cwd(), "data", "leads.json");
const memoryLeads = new Map<string, LeadRecord>();
let hasLoadedInitialData = false;

function getTmpLeadsPath(): string {
  if (process.env.VERCEL) {
    return "/tmp/balaji_leads.json";
  }
  const base = process.env.TEMP || process.env.TMP || os.tmpdir();
  return path.join(base, "balaji_leads.json");
}

function loadLeadsFromFile(filePath: string): LeadRecord[] {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as LeadRecord[];
      }
    }
  } catch {}
  return [];
}

function syncFromStorage() {
  if (!hasLoadedInitialData) {
    const bundled = loadLeadsFromFile(projectLeadsPath);
    for (const lead of bundled) {
      if (lead && lead.referenceId) {
        memoryLeads.set(lead.referenceId, lead);
      }
    }
    hasLoadedInitialData = true;
  }

  const tmpPath = getTmpLeadsPath();
  const tmpList = loadLeadsFromFile(tmpPath);
  for (const lead of tmpList) {
    if (lead && lead.referenceId) {
      memoryLeads.set(lead.referenceId, lead);
    }
  }
}

function persistLeads(leads: LeadRecord[]) {
  const jsonContent = JSON.stringify(leads, null, 2);

  let wroteToProject = false;
  try {
    const dir = path.dirname(projectLeadsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(projectLeadsPath, jsonContent, "utf8");
    wroteToProject = true;
  } catch {}

  if (!wroteToProject) {
    try {
      const tmpPath = getTmpLeadsPath();
      const tmpDir = path.dirname(tmpPath);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(tmpPath, jsonContent, "utf8");
    } catch {}
  }
}

export function getAllLeads(): LeadRecord[] {
  syncFromStorage();
  const all = Array.from(memoryLeads.values());
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all;
}

export function generateReferenceId(): string {
  syncFromStorage();
  const year = new Date().getFullYear();
  const count = memoryLeads.size + 101;
  const padded = String(count).padStart(6, "0");
  return `BM-${year}-${padded}`;
}

export function saveLead(lead: LeadRecord): LeadRecord {
  syncFromStorage();
  memoryLeads.set(lead.referenceId, lead);
  const leads = getAllLeads();
  persistLeads(leads);
  return lead;
}

export function getLeadByReferenceId(refId: string): LeadRecord | null {
  syncFromStorage();
  return memoryLeads.get(refId) || null;
}

export function updateLeadStatus(refId: string, status: "new" | "contacted" | "closed"): LeadRecord | null {
  syncFromStorage();
  const lead = memoryLeads.get(refId);
  if (!lead) return null;
  lead.status = status;
  memoryLeads.set(refId, lead);
  persistLeads(getAllLeads());
  return lead;
}
