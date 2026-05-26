"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Languages, LogOut, Menu, Settings, User, Workflow, X } from "lucide-react";
import { useEffect, useState } from "react";
import { localeMeta, locales, type Locale, t } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";

export function AppHeader({ locale }: { locale: Locale }) {
  const otherLocale = locales.find((item) => item !== locale) ?? "en";
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0],
          avatar: data.user.user_metadata?.avatar_url
        });
      }
    });
  }, []);

  async function handleSignOut() {
    if (!isSupabaseConfigured()) return;
    await getSupabaseBrowserClient().auth.signOut();
    setUser(null);
    router.push(`/${locale}/auth/sign-in`);
  }

  const navLinks = [
    { href: `/${locale}/dashboard`, label: t(locale, "nav.dashboard") },
    { href: `/${locale}/billing`, label: t(locale, "nav.billing") },
    { href: `/${locale}/settings/workspace`, label: t(locale, "nav.workspace") }
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--panel-glass)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)"
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2.5 font-semibold group">
            <span
              className="grid size-9 place-items-center rounded-lg transition-transform group-hover:scale-110"
              style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
            >
              <Workflow size={18} />
            </span>
            <span className="text-base tracking-tight">{t(locale, "app.name")}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link className="button ghost" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <Link
              className="button ghost sm"
              href={`/${otherLocale}/dashboard`}
              title={localeMeta[otherLocale].label}
            >
              <Languages size={16} />
              <span className="hidden sm:inline">{localeMeta[otherLocale].label}</span>
            </Link>

            <ThemeToggle />

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href={`/${locale}/settings/profile`} className="button ghost sm" title={t(locale, "nav.profile")}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="avatar sm" style={{ width: 24, height: 24 }} />
                  ) : (
                    <div className="avatar sm" style={{ width: 24, height: 24, fontSize: "0.625rem" }}>
                      {(user.name?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate text-sm">{user.name}</span>
                </Link>
                <button className="button ghost sm" onClick={handleSignOut} title={t(locale, "nav.signOut")}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link className="button primary sm hidden md:inline-flex" href={`/${locale}/auth/sign-in`}>
                {t(locale, "nav.signIn")}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="button ghost sm md:hidden" onClick={() => setMenuOpen(true)} aria-label={t(locale, "nav.menu")}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setMenuOpen(false)} />
          <div className="drawer">
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="font-semibold">{t(locale, "nav.menu")}</span>
              <button className="button ghost sm" onClick={() => setMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-3 p-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" />
                  ) : (
                    (user.name?.[0] || "U").toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium text-sm">{user.name}</div>
                  <div className="truncate text-xs muted">{user.email}</div>
                </div>
              </div>
            )}

            <nav className="grid gap-1 p-3">
              {navLinks.map((link) => (
                <Link
                  className="button ghost justify-start"
                  href={link.href}
                  key={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    className="button ghost justify-start"
                    href={`/${locale}/settings/profile`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={16} />
                    {t(locale, "nav.profile")}
                  </Link>
                  <Link
                    className="button ghost justify-start"
                    href={`/${locale}/settings/workspace`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings size={16} />
                    {t(locale, "nav.settings")}
                  </Link>
                  <hr className="separator my-2" />
                  <button className="button danger justify-start" onClick={() => { handleSignOut(); setMenuOpen(false); }}>
                    <LogOut size={16} />
                    {t(locale, "nav.signOut")}
                  </button>
                </>
              )}
              {!user && (
                <>
                  <hr className="separator my-2" />
                  <Link
                    className="button primary justify-center"
                    href={`/${locale}/auth/sign-in`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(locale, "nav.signIn")}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
