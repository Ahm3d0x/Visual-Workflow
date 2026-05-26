import { AuthCard } from "@/components/auth-card";
import type { Locale } from "@/lib/i18n";

export default async function SignUpPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <AuthCard locale={locale} mode="sign-up" />;
}
