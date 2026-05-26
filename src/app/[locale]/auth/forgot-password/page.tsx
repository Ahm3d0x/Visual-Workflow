"use client";

import Link from "next/link";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";

export default function ForgotPasswordPage({ params }: { params: Promise<{ locale: Locale }> }) {
  return <ForgotPasswordForm />;
}

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // We read locale from the URL since this is client-rendered
  const locale = (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "ar") as "ar" | "en";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setError("Supabase not configured");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await getSupabaseBrowserClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/${locale}/auth/sign-in`
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-md place-items-center px-4 py-8">
      <div className="panel w-full p-6 md:p-8 animate-scaleIn">
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-4 grid size-14 place-items-center rounded-xl"
            style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
          >
            <Mail size={24} />
          </div>
          <h1 className="heading-md">{t(locale, "auth.resetPassword")}</h1>
        </div>

        {sent ? (
          <div className="text-center">
            <div
              className="rounded-lg p-4 mb-4 text-sm"
              style={{
                background: "color-mix(in srgb, var(--success) 10%, transparent)",
                color: "var(--success)",
                border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)"
              }}
            >
              {t(locale, "auth.resetSent")}
            </div>
            <Link href={`/${locale}/auth/sign-in`} className="button ghost" style={{ color: "var(--accent)" }}>
              <ArrowRight size={16} style={{ transform: locale === "ar" ? "scaleX(-1)" : "none" }} />
              {t(locale, "auth.backToSignIn")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-medium">{t(locale, "auth.email")}</span>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </label>

            <button className="button primary w-full lg" type="submit" disabled={loading}>
              {loading ? <Loader2 size={17} className="animate-spin" /> : null}
              {loading ? t(locale, "common.loading") : t(locale, "auth.resetPassword")}
            </button>

            {error && (
              <div
                className="mt-4 rounded-lg p-3 text-sm"
                style={{
                  background: "color-mix(in srgb, var(--danger) 10%, transparent)",
                  color: "var(--danger)",
                  border: "1px solid color-mix(in srgb, var(--danger) 20%, transparent)"
                }}
              >
                {error}
              </div>
            )}

            <p className="mt-4 text-center text-sm muted">
              <Link href={`/${locale}/auth/sign-in`} style={{ color: "var(--accent)" }}>
                {t(locale, "auth.backToSignIn")}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
