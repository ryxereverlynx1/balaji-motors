"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Mail,
  History,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, exact: false },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail, exact: false },
  { href: "/admin/activity", label: "Activity Log", icon: History, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>("admin@balajimotors.com");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/admin/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user?.email) {
            setAdminEmail(data.user.email);
          }
        }
      } catch {}
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {}
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col md:flex-row text-brand-charcoal antialiased">
      <div className="md:hidden bg-brand-charcoal text-white px-4 py-3 flex items-center justify-between border-b border-brand-border/20 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand-red flex items-center justify-center font-black text-white text-sm">
            BM
          </div>
          <div>
            <div className="text-xs font-black tracking-wider uppercase text-white">Balaji Motors</div>
            <div className="text-[10px] text-brand-yellow font-bold uppercase tracking-wider">Admin Panel</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-charcoal text-white flex flex-col justify-between border-r border-black/20 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-brand-red flex items-center justify-center font-black text-white text-base shadow-sm">
                BM
              </div>
              <div>
                <div className="text-sm font-black tracking-wider uppercase text-white">Balaji Motors</div>
                <div className="text-[10px] text-brand-yellow font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Control Center</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Signed in as</div>
            <div className="text-xs text-white font-medium truncate" title={adminEmail}>
              {adminEmail}
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                    active
                      ? "bg-brand-red text-white shadow-xs"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Showroom</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/30 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-brand-border sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Balaji Motors Dealership CMS
            </span>
            <span className="text-xs text-brand-border">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Active</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-brand-red hover:bg-brand-darkRed active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>+ Add Vehicle</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-cream hover:bg-brand-border border border-brand-border text-brand-charcoal text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}