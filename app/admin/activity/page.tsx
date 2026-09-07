"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ActivityRecord } from "@/lib/db/types";
import {
  History,
  RefreshCw,
  Loader2,
  Filter,
  User,
  Clock,
  Package,
  FolderTree,
  Mail,
  Shield,
  Settings,
} from "lucide-react";

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState("all");

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/activity");
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const filtered = activities.filter((act) => {
    if (entityFilter === "all") return true;
    return act.entityType === entityFilter;
  });

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="w-3.5 h-3.5 text-brand-red" />;
      case "category":
        return <FolderTree className="w-3.5 h-3.5 text-amber-600" />;
      case "enquiry":
        return <Mail className="w-3.5 h-3.5 text-blue-600" />;
      case "auth":
        return <Shield className="w-3.5 h-3.5 text-purple-600" />;
      case "settings":
        return <Settings className="w-3.5 h-3.5 text-slate-600" />;
      default:
        return <History className="w-3.5 h-3.5 text-brand-muted" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2.5">
              <History className="w-5 h-5 text-brand-red" />
              <span>Dealership Audit Log</span>
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Complete chronological audit trail of product edits, price updates, lead actions, and security events.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white border border-brand-border rounded px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-brand-muted" />
              <select
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
                className="bg-transparent font-bold text-brand-charcoal focus:outline-none"
              >
                <option value="all">All Activities ({activities.length})</option>
                <option value="product">Products</option>
                <option value="category">Categories</option>
                <option value="enquiry">Enquiries</option>
                <option value="auth">Authentication</option>
                <option value="settings">Settings</option>
              </select>
            </div>

            <button
              type="button"
              onClick={loadActivities}
              className="p-2 border border-brand-border rounded bg-white hover:bg-brand-warmWhite text-brand-muted hover:text-brand-charcoal"
              title="Refresh Activity Log"
            >
              <RefreshCw className={isLoading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
            </button>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-lg shadow-card overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 p-4">
              <History className="w-8 h-8 text-brand-muted mx-auto mb-2" />
              <p className="text-xs font-bold text-brand-charcoal">No audit records found</p>
              <p className="text-[11px] text-brand-muted mt-0.5">
                Actions taken across the dealership admin panel will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-warmWhite border-b border-brand-border text-[10px] font-black uppercase tracking-wider text-brand-charcoal">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border text-xs">
                  {filtered.map((act) => (
                    <tr key={act.id} className="hover:bg-brand-warmWhite/50 transition-colors">
                      <td className="py-3 px-4 text-brand-muted whitespace-nowrap font-mono text-[11px]">
                        {new Date(act.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-cream border border-brand-border text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">
                          {getEntityIcon(act.entityType)}
                          <span>{act.entityType}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-brand-charcoal text-[11px]">
                        {act.action}
                      </td>
                      <td className="py-3 px-4 text-brand-charcoal max-w-md">
                        {act.details}
                      </td>
                      <td className="py-3 px-4 text-brand-muted flex items-center gap-1.5 whitespace-nowrap">
                        <User className="w-3 h-3 text-brand-muted" />
                        <span>{act.adminEmail}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
