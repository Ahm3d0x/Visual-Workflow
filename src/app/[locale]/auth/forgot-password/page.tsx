"use client";

import { use, useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldAlert } from "lucide-react";

export default function ForgotPasswordPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setMessage("Supabase env vars are required for auth actions.");
      setError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/auth/callback?next=/${locale}/dashboard`,
      });

      if (resetError) {
        setMessage(resetError.message);
        setError(true);
      } else {
        setMessage(locale === "ar" ? "تفقد بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور!" : "Check your email for the password reset link!");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setMessage(msg);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const isRtl = locale === "ar";

  return (
    <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-md place-items-center px-4">
      <div className="panel w-full p-6 relative overflow-hidden" style={{ backdropFilter: "blur(16px)" }}>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
            <Mail size={24} />
          </div>
          <h1 className="text-2xl font-bold">{t(locale, "auth.forgotPasswordTitle")}</h1>
          <p className="muted mt-2 text-sm">{t(locale, "auth.forgotPasswordDesc")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t(locale, "auth.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="button primary w-full justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
            ) : null}
            {t(locale, "auth.sendResetLink")}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
              error ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
            }`}
          >
            {error && <ShieldAlert size={16} className="shrink-0 mt-0.5" />}
            <span>{message}</span>
          </div>
        )}

        <div className="mt-6 text-center border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <Link
            href={`/${locale}/auth/sign-in`}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            <ArrowLeft size={16} className={isRtl ? "rotate-180" : ""} />
            {t(locale, "auth.backToSignIn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
