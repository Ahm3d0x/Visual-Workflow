import Link from "next/link";
import { CreditCard, Settings, User } from "lucide-react";
import type { ReactNode } from "react";
import { isLocale, type Locale, t } from "@/lib/i18n";
import { notFound } from "next/navigation";

const settingsNav = [
  { key: "profile", icon: User, href: (l: string) => `/${l}/settings/profile` },
  { key: "workspace", icon: Settings, href: (l: string) => `/${l}/settings/workspace` },
  { key: "billing", icon: CreditCard, href: (l: string) => `/${l}/billing` }
];

export default async function SettingsLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const labels: Record<string, string> = {
    profile: t(locale, "nav.profile"),
    workspace: t(locale, "nav.workspace"),
    billing: t(locale, "nav.billing")
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="heading-lg">{t(locale, "nav.settings")}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="grid gap-1">
            {settingsNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href(locale)}
                  className="button ghost justify-start"
                >
                  <Icon size={17} />
                  {labels[item.key]}
                </Link>
              );
            })}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
