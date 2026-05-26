"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Workflow, Languages, User, Settings, CreditCard, 
  LogOut, Menu, X, ChevronDown 
} from "lucide-react";
import { localeMeta, locales, type Locale, t } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AppHeaderClient({ 
  locale, 
  user 
}: { 
  locale: Locale; 
  user: SupabaseUser | null 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const otherLocale = locales.find((item) => item !== locale) ?? "en";
  const isRtl = locale === "ar";

  // Close menus on path change
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    });
    return () => cancelAnimationFrame(handle);
  }, [pathname]);

  // Handle click outside dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClose = () => setDropdownOpen(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [dropdownOpen]);

  async function handleLogout() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  // Get active menu helper
  const isActive = (path: string) => pathname.includes(path);

  // Switch locale helper
  const handleLocaleSwitch = () => {
    // Replace the locale prefix in the pathname
    const newPathname = pathname.replace(`/${locale}`, `/${otherLocale}`);
    router.push(newPathname || `/${otherLocale}`);
  };

  return (
    <>
      <header 
        className="sticky top-0 z-40 border-b w-full" 
        style={{ 
          borderColor: "var(--border)", 
          background: "color-mix(in srgb, var(--background) 88%, transparent)", 
          backdropFilter: "blur(16px)" 
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo Section */}
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 font-bold text-lg select-none">
            <span 
              className="grid size-9 place-items-center rounded-xl transition-transform hover:scale-105" 
              style={{ 
                background: "var(--gradient-accent)", 
                color: "var(--accent-foreground)",
                boxShadow: "var(--shadow-glow)" 
              }}
            >
              <Workflow size={20} className="animate-pulse" />
            </span>
            <span className="gradient-text font-extrabold tracking-tight">
              {t(locale, "app.name")}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link 
              className={`button ghost px-3 py-1.5 text-sm font-medium ${isActive("/dashboard") ? "active font-semibold text-[var(--accent)]" : "text-muted"}`} 
              href={`/${locale}/dashboard`}
            >
              {t(locale, "nav.dashboard")}
            </Link>
            <Link 
              className={`button ghost px-3 py-1.5 text-sm font-medium ${isActive("/billing") ? "active font-semibold text-[var(--accent)]" : "text-muted"}`} 
              href={`/${locale}/billing`}
            >
              {t(locale, "nav.billing")}
            </Link>
            <Link 
              className={`button ghost px-3 py-1.5 text-sm font-medium ${isActive("/settings/workspace") ? "active font-semibold text-[var(--accent)]" : "text-muted"}`} 
              href={`/${locale}/settings/workspace`}
            >
              {t(locale, "nav.workspace")}
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button 
              className="button ghost size-9 p-0 flex items-center justify-center rounded-xl"
              onClick={handleLocaleSwitch}
              title={localeMeta[otherLocale].label}
            >
              <Languages size={18} />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="flex items-center gap-1.5 p-1 rounded-full border hover:bg-[color-mix(in srgb,var(--accent-muted)_25%,transparent)] transition-all cursor-pointer"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div 
                    className="size-7 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{ 
                      background: "var(--gradient-accent)", 
                      color: "var(--accent-foreground)" 
                    }}
                  >
                    {user.email?.slice(0, 2).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className={`text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Card */}
                {dropdownOpen && (
                  <div 
                    className="absolute top-11 panel p-2 w-56 flex flex-col gap-1 z-50 animate-fadeIn"
                    style={{ 
                      [isRtl ? "left" : "right"]: 0,
                      borderColor: "var(--border)",
                      boxShadow: "var(--shadow-glow)"
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3 py-2 border-b mb-1" style={{ borderColor: "var(--border)" }}>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>

                    <Link 
                      href={`/${locale}/settings/profile`}
                      className="button ghost justify-start text-sm w-full py-1.5"
                    >
                      <User size={16} />
                      {t(locale, "nav.profile")}
                    </Link>

                    <Link 
                      href={`/${locale}/settings/workspace`}
                      className="button ghost justify-start text-sm w-full py-1.5"
                    >
                      <Settings size={16} />
                      {t(locale, "nav.workspace")}
                    </Link>

                    <Link 
                      href={`/${locale}/billing`}
                      className="button ghost justify-start text-sm w-full py-1.5"
                    >
                      <CreditCard size={16} />
                      {t(locale, "nav.billing")}
                    </Link>

                    <button 
                      onClick={handleLogout}
                      className="button ghost justify-start text-sm w-full py-1.5 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <LogOut size={16} />
                      {locale === "ar" ? "تسجيل الخروج" : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                className="button primary px-4 py-1.5 text-sm font-semibold rounded-xl"
                href={`/${locale}/auth/sign-in`}
              >
                {t(locale, "nav.signIn")}
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button 
              className="button ghost size-9 p-0 flex md:hidden items-center justify-center rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute top-0 bottom-0 w-72 flex flex-col p-6 z-40 animate-slideIn border-r"
            style={{ 
              [isRtl ? "right" : "left"]: 0,
              background: "var(--background)",
              borderColor: "var(--border)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 font-bold text-lg">
                <span 
                  className="grid size-8 place-items-center rounded-xl" 
                  style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
                >
                  <Workflow size={17} />
                </span>
                <span className="gradient-text font-extrabold">{t(locale, "app.name")}</span>
              </Link>
              <button 
                className="button ghost size-8 p-0 flex items-center justify-center rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* User Profile Summary (Mobile) */}
            {user && (
              <div 
                className="flex items-center gap-3 p-3 rounded-xl border mb-6"
                style={{ borderColor: "var(--border)", background: "var(--accent-muted)" }}
              >
                <div 
                  className="size-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                  style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
                >
                  {user.email?.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex flex-col gap-2 mb-auto">
              <Link 
                className={`button ghost justify-start py-2.5 px-3 rounded-xl w-full text-base ${isActive("/dashboard") ? "active bg-[var(--accent-muted)] font-semibold text-[var(--accent)]" : ""}`}
                href={`/${locale}/dashboard`}
              >
                {t(locale, "nav.dashboard")}
              </Link>
              <Link 
                className={`button ghost justify-start py-2.5 px-3 rounded-xl w-full text-base ${isActive("/billing") ? "active bg-[var(--accent-muted)] font-semibold text-[var(--accent)]" : ""}`}
                href={`/${locale}/billing`}
              >
                {t(locale, "nav.billing")}
              </Link>
              <Link 
                className={`button ghost justify-start py-2.5 px-3 rounded-xl w-full text-base ${isActive("/settings/workspace") ? "active bg-[var(--accent-muted)] font-semibold text-[var(--accent)]" : ""}`}
                href={`/${locale}/settings/workspace`}
              >
                {t(locale, "nav.workspace")}
              </Link>

              {user && (
                <>
                  <div className="my-2 border-t" style={{ borderColor: "var(--border)" }} />
                  <Link 
                    className={`button ghost justify-start py-2.5 px-3 rounded-xl w-full text-base ${isActive("/settings/profile") ? "active bg-[var(--accent-muted)] font-semibold text-[var(--accent)]" : ""}`}
                    href={`/${locale}/settings/profile`}
                  >
                    <User size={18} />
                    {t(locale, "nav.profile")}
                  </Link>
                </>
              )}
            </nav>

            {/* Footer / Logout */}
            <div className="pt-4 border-t mt-auto" style={{ borderColor: "var(--border)" }}>
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="button ghost justify-start py-2.5 px-3 rounded-xl w-full text-base text-red-400 hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  {locale === "ar" ? "تسجيل الخروج" : "Logout"}
                </button>
              ) : (
                <Link 
                  className="button primary justify-center py-2.5 rounded-xl w-full text-base font-semibold"
                  href={`/${locale}/auth/sign-in`}
                >
                  {t(locale, "nav.signIn")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
