"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid credentials. Please verify your email and password.");
        setIsLoading(false);
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("Network or server connection failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-brand-border rounded-lg shadow-card p-6 sm:p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-cream border border-brand-border mb-4">
          <div className="w-10 h-10 rounded bg-brand-red flex items-center justify-center font-black text-white text-lg">
            BM
          </div>
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
          Dealer Management System
        </div>
        <h1 className="text-2xl font-black text-brand-charcoal tracking-tight">
          Balaji Motors Admin
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Sign in to manage commercial products, specifications, and customer enquiries.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
            Admin Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@balajimotors.com"
              className="w-full pl-9 pr-3 py-2.5 rounded bg-brand-warmWhite border border-brand-border text-sm text-brand-charcoal placeholder-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-muted">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2.5 rounded bg-brand-warmWhite border border-brand-border text-sm text-brand-charcoal placeholder-brand-muted/60 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Session...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-5 border-t border-brand-border flex items-center justify-between text-xs text-brand-muted">
        <Link href="/" className="hover:text-brand-charcoal font-semibold transition-colors">
          ← Back to Website
        </Link>
        <span className="flex items-center gap-1 text-[11px] text-brand-muted font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
          <span>Encrypted Session</span>
        </span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center items-center px-4 py-12">
      <Suspense fallback={<div className="text-xs text-brand-muted font-bold">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}