"use client";

import { Chrome, Mail } from "lucide-react";
import { useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";
import Link from "next/link";

export function AuthCard({ locale, mode }: { locale: Locale; mode: "sign-in" | "sign-up" }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const title = mode === "sign-in" ? t(locale, "auth.signInTitle") : t(locale, "auth.signUpTitle");

  async function handleEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setMessage("Supabase env vars are required for live auth.");
      setError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const supabase = getSupabaseBrowserClient();

    try {
      const result = mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (result.error) {
        setMessage(result.error.message);
        setError(true);
      } else {
        setMessage(mode === "sign-in" ? "Success! Redirecting..." : "Success! Check your email to confirm your account.");
        // Redirect to dashboard on successful sign-in
        if (mode === "sign-in") {
          window.location.href = `/${locale}/dashboard`;
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setMessage(msg);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!isSupabaseConfigured()) {
      setMessage("Supabase env vars are required for Google login.");
      setError(true);
      return;
    }
    setError(false);
    await getSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/dashboard` }
    });
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-md place-items-center px-4">
      <div className="panel w-full p-6 relative overflow-hidden" style={{ backdropFilter: "blur(16px)" }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="muted mt-2 text-sm">{t(locale, "app.tagline")}</p>
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t(locale, "auth.email")}</label>
            <input
              className="input w-full"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">{t(locale, "auth.password")}</label>
              {mode === "sign-in" && (
                <Link
                  href={`/${locale}/auth/forgot-password`}
                  className="text-xs font-semibold hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {t(locale, "auth.forgotPassword")}
                </Link>
              )}
            </div>
            <input
              className="input w-full"
              name="password"
              type="password"
              placeholder="••••••••"
              minLength={8}
              required
              disabled={loading}
            />
          </div>

          {mode === "sign-in" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember-me"
                className="rounded border-gray-300 text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <label htmlFor="remember-me" className="text-xs text-muted cursor-pointer select-none">
                {t(locale, "auth.rememberMe")}
              </label>
            </div>
          )}

          <button
            className="button primary w-full justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
            ) : (
              <Mail size={17} className="mr-2" />
            )}
            {title}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <hr className="border-t" style={{ borderColor: "var(--border)" }} />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs text-muted bg-[var(--background)]">
            {locale === "ar" ? "أو" : "OR"}
          </span>
        </div>

        <button
          className="button w-full justify-center"
          type="button"
          onClick={handleGoogle}
          disabled={loading}
        >
          <Chrome size={17} className="mr-2" />
          {t(locale, "auth.google")}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm border ${
              error ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center border-t pt-4" style={{ borderColor: "var(--border)" }}>
          {mode === "sign-in" ? (
            <p className="text-xs text-muted">
              {locale === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
              <Link href={`/${locale}/auth/sign-up`} className="font-semibold hover:underline" style={{ color: "var(--accent)" }}>
                {t(locale, "auth.signUpTitle")}
              </Link>
            </p>
          ) : (
            <p className="text-xs text-muted">
              {locale === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
              <Link href={`/${locale}/auth/sign-in`} className="font-semibold hover:underline" style={{ color: "var(--accent)" }}>
                {t(locale, "auth.signInTitle")}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
