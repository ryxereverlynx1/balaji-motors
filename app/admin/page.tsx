import React from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { getDashboardStats, getActivities } from "@/lib/db";
import { getAllLeads } from "@/lib/leads";
import {
  Package,
  CheckCircle2,
  FileEdit,
  FolderTree,
  Mail,
  Zap,
  ArrowRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const leads = getAllLeads().slice(0, 5);
  const activities = await getActivities(6);

  const statCards = [
    {
      title: "Total Vehicles",
      value: stats.totalProducts,
      sub: "In product catalogue",
      icon: Package,
      color: "border-brand-border text-brand-charcoal",
      badge: "Fleet Count",
    },
    {
      title: "Published",
      value: stats.publishedProducts,
      sub: "Live on showroom website",
      icon: CheckCircle2,
      color: "border-emerald-200 text-emerald-800 bg-emerald-50/50",
      badge: "Public",
    },
    {
      title: "Happy Customers",
      value: (stats as any).totalCustomers || 0,
      sub: "Delivery stories published",
      icon: Users,
      color: "border-blue-200 text-blue-800 bg-blue-50/50",
      badge: "Testimonials",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      sub: "Vehicle segments active",
      icon: FolderTree,
      color: "border-brand-border text-brand-charcoal",
      badge: "Classification",
    },
    {
      title: "Total Enquiries",
      value: stats.totalEnquiries,
      sub: `${stats.newEnquiries} new pending callback`,
      icon: Mail,
      color: "border-brand-red/30 text-brand-red bg-red-50/40",
      badge: "Customer Leads",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-1">
              Dealership Operations
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Manage dynamic vehicle inventory, specifications, categories, and customer price quotes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>+ Add Vehicle</span>
            </Link>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white hover:bg-brand-cream border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <Mail className="w-4 h-4 text-brand-red" />
              <span>View Quotes ({stats.totalEnquiries})</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-lg border bg-white shadow-card flex flex-col justify-between ${card.color}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-brand-border/40 text-brand-muted">
                    {card.badge}
                  </span>
                  <Icon className="w-4 h-4 opacity-70" />
                </div>
                <div>
                  <div className="text-3xl font-black tracking-tight">{card.value}</div>
                  <div className="text-xs font-bold uppercase tracking-wide mt-1">{card.title}</div>
                  <div className="text-[11px] text-brand-muted mt-0.5">{card.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white border border-brand-border rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-brand-charcoal uppercase tracking-wider">
                  Recent Customer Enquiries
                </h2>
                <p className="text-xs text-brand-muted">Latest quotation requests from showroom visitors</p>
              </div>
              <Link
                href="/admin/enquiries"
                className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                <span>All Enquiries</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {leads.length === 0 ? (
              <div className="py-12 text-center text-xs text-brand-muted">No customer enquiries logged yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-warmWhite border-y border-brand-border text-brand-muted uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Ref ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {leads.map((lead) => (
                      <tr key={lead.referenceId} className="hover:bg-brand-cream/30 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-brand-charcoal">
                          {lead.referenceId}
                        </td>
                        <td className="py-3 px-3 font-semibold text-brand-charcoal">
                          {lead.fullName}
                        </td>
                        <td className="py-3 px-3 text-brand-muted">{lead.phone}</td>
                        <td className="py-3 px-3 font-medium text-brand-charcoal truncate max-w-[180px]">
                          {lead.vehicle}
                        </td>
                        <td className="py-3 px-3 text-brand-muted">
                          {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              lead.status === "new"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : lead.status === "contacted"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white border border-brand-border rounded-lg shadow-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-brand-charcoal uppercase tracking-wider">
                    Recent Activity Log
                  </h2>
                  <p className="text-xs text-brand-muted">Administrative operations audit</p>
                </div>
                <Link
                  href="/admin/activity"
                  className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>Full Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {activities.length === 0 ? (
                <div className="py-12 text-center text-xs text-brand-muted">No activity logged yet.</div>
              ) : (
                <div className="space-y-3">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded bg-brand-warmWhite border border-brand-border text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-brand-muted">
                        <span className="font-bold uppercase text-brand-charcoal">{act.action}</span>
                        <span>{new Date(act.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-brand-charcoal font-medium text-[11px] leading-snug">
                        {act.details}
                      </p>
                      <div className="text-[10px] text-brand-muted">{act.adminEmail}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Single Source of Truth Active</span>
              </span>
              <Link href="/admin/settings" className="hover:text-brand-charcoal underline">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}