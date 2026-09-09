"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Settings,
  Shield,
  KeyRound,
  Database,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  HardDrive,
  Lock,
  Building,
  Percent,
  IndianRupee,
  Save,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [interestRatePerAnnum, setInterestRatePerAnnum] = useState<number>(10.5);
  const [minDownPaymentPercent, setMinDownPaymentPercent] = useState<number>(15);
  const [minDownPaymentAmount, setMinDownPaymentAmount] = useState<number>(20000);
  const [isSavingFinance, setIsSavingFinance] = useState(false);
  const [financeMessage, setFinanceMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadFinanceSettings() {
      try {
        const res = await fetch("/api/admin/finance-settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setInterestRatePerAnnum(data.settings.interestRatePerAnnum ?? 10.5);
            setMinDownPaymentPercent(data.settings.minDownPaymentPercent ?? 15);
            setMinDownPaymentAmount(data.settings.minDownPaymentAmount ?? 20000);
          }
        }
      } catch {}
    }
    loadFinanceSettings();
  }, []);

  const handleFinanceSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFinanceMessage(null);
    setIsSavingFinance(true);

    try {
      const res = await fetch("/api/admin/finance-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interestRatePerAnnum,
          minDownPaymentPercent,
          minDownPaymentAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update finance settings");
      }

      setFinanceMessage({
        type: "success",
        text: "Finance & EMI Calculator settings updated successfully!",
      });
    } catch (err) {
      setFinanceMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving finance settings",
      });
    } finally {
      setIsSavingFinance(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch("/api/admin/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setPasswordMessage({
        type: "success",
        text: "Admin password updated successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error updating password",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider text-brand-charcoal flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-brand-red" />
            <span>Dealership Administration Settings</span>
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Security credentials, database storage engine health, and showroom dealership parameters.
          </p>
        </div>

        <div className="bg-white border border-brand-border rounded-lg shadow-card p-6 space-y-6">
          <div className="border-b border-brand-border pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-brand-red" />
              <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal">
                Loan & EMI Calculator Parameters
              </h2>
            </div>
            <span className="text-[11px] font-bold text-brand-muted bg-stone-100 px-2.5 py-1 rounded">
              Website Live Sync
            </span>
          </div>

          <p className="text-xs text-brand-muted leading-relaxed">
            Configure the fixed annual interest rate and minimum down payment required on the customer-facing EMI calculator (/finance). Changes take effect immediately.
          </p>

          {financeMessage && (
            <div
              className={`p-3.5 rounded-lg border flex items-center gap-2 text-xs font-bold ${
                financeMessage.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {financeMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{financeMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleFinanceSave} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-brand-red" />
                  <span>Fixed Interest Rate (% P.A.) *</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="40"
                  required
                  value={interestRatePerAnnum}
                  onChange={(e) => setInterestRatePerAnnum(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 10.5"
                  className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-base sm:text-xs text-brand-charcoal focus:outline-none focus:border-brand-red font-mono font-bold"
                />
                <span className="text-[10px] text-brand-muted mt-1 block">
                  Fixed yearly rate locked in the calculator
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-brand-red" />
                  <span>Min Down Payment (%) *</span>
                </label>
                <input
                  type="number"
                  step="1"
                  min="5"
                  max="80"
                  required
                  value={minDownPaymentPercent}
                  onChange={(e) => setMinDownPaymentPercent(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 15"
                  className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-base sm:text-xs text-brand-charcoal focus:outline-none focus:border-brand-red font-mono font-bold"
                />
                <span className="text-[10px] text-brand-muted mt-1 block">
                  Minimum percentage required as down payment
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-brand-red" />
                <span>Min Down Payment Floor (₹)</span>
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                max="100000"
                value={minDownPaymentAmount}
                onChange={(e) => setMinDownPaymentAmount(parseInt(e.target.value) || 0)}
                placeholder="e.g. 20000"
                className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-base sm:text-xs text-brand-charcoal focus:outline-none focus:border-brand-red font-mono font-bold"
              />
              <span className="text-[10px] text-brand-muted mt-1 block">
                Absolute minimum rupees down payment (e.g. ₹20,000)
              </span>
            </div>

            <button
              type="submit"
              disabled={isSavingFinance}
              className="px-5 py-2.5 bg-brand-charcoal hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSavingFinance ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 text-brand-red" />
              )}
              <span>Save Finance Parameters</span>
            </button>
          </form>
        </div>

        <div className="bg-white border border-brand-border rounded-lg shadow-card p-6 space-y-6">
          <div className="border-b border-brand-border pb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-brand-red" />
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal">
              Change Administrator Password
            </h2>
          </div>

          {passwordMessage && (
            <div
              className={`p-3.5 rounded-lg border flex items-center gap-2 text-xs font-bold ${
                passwordMessage.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {passwordMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-base sm:text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
                New Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-base sm:text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3 py-2 rounded bg-brand-warmWhite border border-brand-border text-base sm:text-xs text-brand-charcoal focus:outline-none focus:border-brand-red"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingPassword}
              className="px-5 py-2 bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold uppercase tracking-wider rounded shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSavingPassword ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>Update Password</span>
            </button>
          </form>
        </div>

        <div className="bg-white border border-brand-border rounded-lg shadow-card p-6 space-y-4">
          <div className="border-b border-brand-border pb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-brand-red" />
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-charcoal">
              System Architecture & Storage Diagnostics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-brand-warmWhite border border-brand-border space-y-2">
              <div className="flex items-center gap-2 text-brand-charcoal font-bold">
                <HardDrive className="w-4 h-4 text-brand-red" />
                <span>Single Source of Truth Storage</span>
              </div>
              <p className="text-brand-muted text-[11px] leading-relaxed">
                Dual-mode zero-latency storage engine. Data persists to project <code className="text-brand-charcoal">data/db/</code> locally and synchronizes automatically with <code className="text-brand-charcoal">/tmp/balaji_db/</code> on Vercel read-only serverless environments.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-green-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>Storage Active & Healthy</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-brand-warmWhite border border-brand-border space-y-2">
              <div className="flex items-center gap-2 text-brand-charcoal font-bold">
                <Shield className="w-4 h-4 text-brand-red" />
                <span>Security & Session Guard</span>
              </div>
              <p className="text-brand-muted text-[11px] leading-relaxed">
                HMAC-SHA256 Web Crypto edge sessions, bcrypt password hashing with 12 salt rounds, HttpOnly SameSite=Lax cookie verification, and file upload magic-byte inspection.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-green-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>Middleware Protection Enabled</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-brand-warmWhite border border-brand-border space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-brand-charcoal font-bold">
                <Building className="w-4 h-4 text-brand-red" />
                <span>Dealership Commercial Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
                <div>
                  <span className="text-brand-muted block">Dealership:</span>
                  <span className="font-bold text-brand-charcoal">Balaji Motors Jalandhar</span>
                </div>
                <div>
                  <span className="text-brand-muted block">Official Phone / WhatsApp:</span>
                  <span className="font-bold text-brand-charcoal">+91 94645 18091</span>
                </div>
                <div>
                  <span className="text-brand-muted block">Showroom Address:</span>
                  <span className="font-bold text-brand-charcoal">Avtar Nagar Road, Opp. Gujral Nagar, Jalandhar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
