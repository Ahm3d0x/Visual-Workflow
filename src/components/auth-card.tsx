"use client";

import { Chrome, Mail } from "lucide-react";
import { useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";

export function AuthCard({ locale, mode }: { locale: Locale; mode: "sign-in" | "sign-up" }) {
  const [message, setMessage] = useState("");
  const title = mode === "sign-in" ? t(locale, "auth.signInTitle") : t(locale, "auth.signUpTitle");

  async function handleEmail(formData: FormData) {
    if (!isSupabaseConfigured()) {
      setMessage("Supabase env vars are required for live auth.");
      return;
    }
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const supabase = getSupabaseBrowserClient();
    const result = mode === "sign-in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setMessage(result.error?.message ?? "Check your email or continue to the dashboard.");
  }

  async function handleGoogle() {
    if (!isSupabaseConfigured()) {
      setMessage("Supabase env vars are required for Google login.");
      return;
    }
    await getSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/${locale}/dashboard` }
    });
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-md place-items-center px-4">
      <form action={handleEmail} className="panel w-full p-5">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="muted mt-2">{t(locale, "app.tagline")}</p>
        </div>
        <label className="mb-3 block">
          <span className="mb-1 block text-sm">{t(locale, "auth.email")}</span>
          <input className="input" name="email" type="email" required />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm">{t(locale, "auth.password")}</span>
          <input className="input" name="password" type="password" minLength={8} required />
        </label>
        <button className="button primary w-full" type="submit"><Mail size={17} />{title}</button>
        <button className="button mt-3 w-full" type="button" onClick={handleGoogle}><Chrome size={17} />{t(locale, "auth.google")}</button>
        {message ? <p className="muted mt-4 text-sm">{message}</p> : null}
      </form>
    </div>
  );
}
