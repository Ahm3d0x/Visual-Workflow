"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chrome, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";

export function AuthCard({ locale, mode }: { locale: Locale; mode: "sign-in" | "sign-up" }) {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isSignIn = mode === "sign-in";
  const title = isSignIn ? t(locale, "auth.signInTitle") : t(locale, "auth.signUpTitle");
  const subtitle = isSignIn ? t(locale, "auth.welcomeBack") : t(locale, "auth.getStarted");

  async function handleEmail(formData: FormData) {
    if (!isSupabaseConfigured()) {
      setMessage("Supabase env vars are required for live auth.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const supabase = getSupabaseBrowserClient();

    const result = isSignIn
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      setMessageType("error");
      return;
    }

    if (!isSignIn && result.data.user && !result.data.session) {
      setMessage(t(locale, "auth.emailVerification"));
      setMessageType("success");
      return;
    }

    router.push(`/${locale}/dashboard`);
  }

  async function handleGoogle() {
    if (!isSupabaseConfigured()) {
      setMessage("Supabase env vars are required for Google login.");
      setMessageType("error");
      return;
    }
    await getSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/dashboard` }
    });
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-md place-items-center px-4 py-8">
      <form action={handleEmail} className="panel w-full p-6 md:p-8 animate-scaleIn">
        {/* Header */}
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-4 grid size-14 place-items-center rounded-xl"
            style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
          >
            <Lock size={24} />
          </div>
          <h1 className="heading-md">{title}</h1>
          <p className="muted mt-1 text-sm">{subtitle}</p>
        </div>

        {/* Google button */}
        <button className="button w-full mb-4" type="button" onClick={handleGoogle}>
          <Chrome size={17} />
          {t(locale, "auth.google")}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <hr className="separator flex-1" />
          <span className="muted text-xs">{t(locale, "common.or")}</span>
          <hr className="separator flex-1" />
        </div>

        {/* Email */}
        <label className="mb-3 block">
          <span className="mb-1.5 block text-sm font-medium">{t(locale, "auth.email")}</span>
          <div className="relative">
            <Mail size={16} className="absolute top-1/2 -translate-y-1/2 muted-light" style={{ insetInlineStart: "0.75rem" }} />
            <input
              className="input"
              style={{ paddingInlineStart: "2.5rem" }}
              name="email"
              type="email"
              required
              placeholder="name@example.com"
            />
          </div>
        </label>

        {/* Password */}
        <label className="mb-2 block">
          <span className="mb-1.5 block text-sm font-medium">{t(locale, "auth.password")}</span>
          <input className="input" name="password" type="password" minLength={8} required placeholder="••••••••" />
        </label>

        {/* Forgot password */}
        {isSignIn && (
          <div className="mb-4 text-end">
            <Link href={`/${locale}/auth/forgot-password`} className="text-sm font-medium" style={{ color: "var(--accent)" }}>
              {t(locale, "auth.forgotPassword")}
            </Link>
          </div>
        )}

        {/* Submit */}
        <button className="button primary w-full lg" type="submit" disabled={loading}>
          {loading ? <Loader2 size={17} className="animate-spin" /> : <Mail size={17} />}
          {loading ? t(locale, "common.loading") : title}
        </button>

        {/* Toggle between sign-in/sign-up */}
        <p className="mt-4 text-center text-sm muted">
          {isSignIn ? t(locale, "auth.noAccount") : t(locale, "auth.hasAccount")}{" "}
          <Link
            href={isSignIn ? `/${locale}/auth/sign-up` : `/${locale}/auth/sign-in`}
            className="font-semibold"
            style={{ color: "var(--accent)" }}
          >
            {isSignIn ? t(locale, "nav.signUp") : t(locale, "nav.signIn")}
          </Link>
        </p>

        {/* Terms notice for sign-up */}
        {!isSignIn && (
          <p className="mt-3 text-center text-xs muted-light">{t(locale, "auth.termsNotice")}</p>
        )}

        {/* Messages */}
        {message && (
          <div
            className="mt-4 rounded-lg p-3 text-sm animate-slideUp"
            style={{
              background: messageType === "error" ? "color-mix(in srgb, var(--danger) 10%, transparent)" : "color-mix(in srgb, var(--success) 10%, transparent)",
              color: messageType === "error" ? "var(--danger)" : "var(--success)",
              border: `1px solid ${messageType === "error" ? "color-mix(in srgb, var(--danger) 20%, transparent)" : "color-mix(in srgb, var(--success) 20%, transparent)"}`
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
