import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { isLocale, localeMeta, type Locale } from "@/lib/i18n";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const { dir } = localeMeta[locale];

  return (
    <div className="app-shell page-enter" lang={locale} dir={dir}>
      <AppHeader locale={locale} />
      <main>{children}</main>
    </div>
  );
}
