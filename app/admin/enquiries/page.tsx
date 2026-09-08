"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { LeadRecord } from "@/lib/leads";
import {
  Mail,
  Search,
  Filter,
  Phone,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  RefreshCw,
  Loader2,
  Eye,
  Download,
  X,
  User,
  MapPin,
  Car,
  AlertCircle,
} from "lucide-react";

export default function AdminEnquiriesPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleUpdateStatus = async (refId: string, newStatus: "new" | "contacted" | "closed") => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${refId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setLeads(leads.map((l) => (l.referenceId === refId ? data.lead : l)));
        if (selectedLead && selectedLead.referenceId === refId) {
          setSelectedLead(data.lead);
        }
      }
    } catch {
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lead.fullName.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.city.toLowerCase().includes(q) ||
      lead.referenceId.toLowerCase().includes(q) ||
      lead.vehicle.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalCount = leads.length;
  const newCount = leads.filter((l) => l.status === "new").length;
  const contactedCount = leads.filter((l) => l.status === "contacted").length;
  const closedCount = leads.filter((l) => l.status === "closed").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-brand-red" />
              <span>Customer Enquiries & Leads</span>
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Commercial quotations, customer test-ride requests, and showroom inquiries.
            </p>
          </div>

          <button
            type="button"
            onClick={loadLeads}
            className="p-2 border border-brand-border rounded bg-white hover:bg-brand-warmWhite text-brand-muted hover:text-brand-charcoal flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw className={isLoading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-brand-border rounded-lg p-4 shadow-card">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
              Total Enquiries
            </div>
            <div className="text-2xl font-black text-brand-charcoal mt-1">{totalCount}</div>
          </div>

          <div className="bg-white border border-brand-border rounded-lg p-4 shadow-card">
            <div className="text-[11px] font-bold uppercase tracking-wider text-green-700">
              New Uncontacted
            </div>
            <div className="text-2xl font-black text-green-700 mt-1">{newCount}</div>
          </div>

          <div className="bg-white border border-brand-border rounded-lg p-4 shadow-card">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              In Follow-Up
            </div>
            <div className="text-2xl font-black text-blue-700 mt-1">{contactedCount}</div>
          </div>

          <div className="bg-white border border-brand-border rounded-lg p-4 shadow-card">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Completed Deals
            </div>
            <div className="text-2xl font-black text-slate-700 mt-1">{closedCount}</div>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-lg p-4 shadow-card flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, phone, city, vehicle, or BM reference ID..."
              className="w-full pl-9 pr-3 py-2 bg-brand-warmWhite border border-brand-border rounded text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-brand-muted shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-brand-warmWhite border border-brand-border rounded text-xs font-bold text-brand-charcoal focus:outline-none focus:border-brand-red w-full sm:w-auto"
            >
              <option value="all">All Enquiries ({totalCount})</option>
              <option value="new">New ({newCount})</option>
              <option value="contacted">Contacted ({contactedCount})</option>
              <option value="closed">Closed ({closedCount})</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-lg shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 p-4">
              <Mail className="w-8 h-8 text-brand-muted mx-auto mb-2" />
              <p className="text-xs font-bold text-brand-charcoal">No customer enquiries found</p>
              <p className="text-[11px] text-brand-muted mt-0.5">
                Customer quote requests from the website will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-warmWhite border-b border-brand-border text-[10px] font-black uppercase tracking-wider text-brand-charcoal">
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-xs">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.referenceId} className="hover:bg-brand-warmWhite/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-charcoal">
                        {lead.referenceId}
                      </td>
                      <td className="py-3.5 px-4 text-brand-muted whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-brand-charcoal">{lead.fullName}</div>
                        <div className="text-[11px] text-brand-muted">{lead.city}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={`tel:${lead.phone}`}
                          className="font-mono text-brand-charcoal hover:text-brand-red font-bold inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-brand-muted" />
                          <span>{lead.phone}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-brand-charcoal truncate max-w-[200px]">
                          {lead.vehicle}
                        </div>
                        <div className="text-[11px] text-brand-muted">
                          Qty: {lead.quantity || 1} • {lead.enquiryType || "Quotation"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            lead.status === "new"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : lead.status === "contacted"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {lead.status === "new" && <Clock className="w-2.5 h-2.5" />}
                          {lead.status === "contacted" && <CheckCircle2 className="w-2.5 h-2.5" />}
                          {lead.status === "closed" && <Archive className="w-2.5 h-2.5" />}
                          <span>{lead.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 rounded border border-brand-border text-brand-charcoal hover:bg-brand-warmWhite"
                            title="View Full Lead Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`/api/quote/pdf?referenceId=${lead.referenceId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded border border-brand-border text-brand-muted hover:text-brand-red hover:bg-red-50"
                            title="Download PDF Quotation"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-brand-border shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2">
                    <span>Enquiry Lead</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-brand-cream border border-brand-border">
                      {selectedLead.referenceId}
                    </span>
                  </h2>
                  <p className="text-[11px] text-brand-muted mt-0.5">
                    Received on {new Date(selectedLead.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1 text-brand-muted hover:text-brand-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 bg-brand-warmWhite rounded border border-brand-border">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-brand-muted">Customer Name</div>
                    <div className="text-xs font-bold text-brand-charcoal mt-0.5">{selectedLead.fullName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-brand-muted">Phone Number</div>
                    <div className="text-xs font-bold text-brand-charcoal mt-0.5">
                      <a href={`tel:${selectedLead.phone}`} className="text-brand-red hover:underline">
                        {selectedLead.phone}
                      </a>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-brand-muted">City / Region</div>
                    <div className="text-xs font-bold text-brand-charcoal mt-0.5">{selectedLead.city}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-brand-muted">Preferred Contact</div>
                    <div className="text-xs font-bold text-brand-charcoal mt-0.5 uppercase">
                      {selectedLead.preferredContact}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-brand-warmWhite rounded border border-brand-border space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-brand-muted">Vehicle of Interest</div>
                      <div className="text-xs font-bold text-brand-charcoal mt-0.5">{selectedLead.vehicle}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-brand-muted">Quantity</div>
                      <div className="text-xs font-bold text-brand-charcoal mt-0.5">{selectedLead.quantity} Unit(s)</div>
                    </div>
                  </div>
                  {selectedLead.companyName && (
                    <div>
                      <div className="text-[10px] uppercase font-bold text-brand-muted">Company / Business</div>
                      <div className="text-xs text-brand-charcoal mt-0.5">{selectedLead.companyName}</div>
                    </div>
                  )}
                  {selectedLead.notes && (
                    <div>
                      <div className="text-[10px] uppercase font-bold text-brand-muted">Customer Note</div>
                      <div className="text-xs text-brand-charcoal mt-0.5 italic bg-white p-2 rounded border border-brand-border">
                        "{selectedLead.notes}"
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-brand-muted mb-2">Update Follow-Up Status</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(selectedLead.referenceId, "new")}
                      className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors ${
                        selectedLead.status === "new"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-brand-charcoal border-brand-border hover:bg-brand-warmWhite"
                      }`}
                    >
                      New
                    </button>
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(selectedLead.referenceId, "contacted")}
                      className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors ${
                        selectedLead.status === "contacted"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-brand-charcoal border-brand-border hover:bg-brand-warmWhite"
                      }`}
                    >
                      Contacted
                    </button>
                    <button
                      type="button"
                      disabled={isUpdatingStatus}
                      onClick={() => handleUpdateStatus(selectedLead.referenceId, "closed")}
                      className={`px-3 py-1.5 text-xs font-bold rounded border transition-colors ${
                        selectedLead.status === "closed"
                          ? "bg-slate-700 text-white border-slate-700"
                          : "bg-white text-brand-charcoal border-brand-border hover:bg-brand-warmWhite"
                      }`}
                    >
                      Closed / Deal Done
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <a
                    href={`/api/quote/pdf?referenceId=${selectedLead.referenceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto justify-center px-4 py-2 bg-brand-charcoal hover:bg-brand-charcoal/90 text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Official PDF Quotation</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="w-full sm:w-auto text-center px-4 py-2 border border-brand-border text-xs font-bold uppercase tracking-wider text-brand-charcoal rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
