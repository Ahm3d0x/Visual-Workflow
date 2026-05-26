import Link from "next/link";
import { Languages, Workflow } from "lucide-react";
import { localeMeta, locales, type Locale, t } from "@/lib/i18n";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader({ locale }: { locale: Locale }) {
  const otherLocale = locales.find((item) => item !== locale) ?? "en";

  return (
    <header className="sticky top-0 z-30 border-b" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--background) 88%, transparent)", backdropFilter: "blur(16px)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-md" style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}>
            <Workflow size={19} />
          </span>
          <span>{t(locale, "app.name")}</span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <Link className="button" href={`/${locale}/dashboard`}>{t(locale, "nav.dashboard")}</Link>
          <Link className="button" href={`/${locale}/billing`}>{t(locale, "nav.billing")}</Link>
          <Link className="button" href={`/${locale}/settings/workspace`}>{t(locale, "nav.workspace")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link className="button" href={`/${otherLocale}/dashboard`} title={localeMeta[otherLocale].label}>
            <Languages size={17} />
            <span className="hidden sm:inline">{localeMeta[otherLocale].label}</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
