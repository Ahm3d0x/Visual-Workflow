"use client";

import { Camera, Loader2, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";
import { useTheme } from "next-themes";

export default function ProfilePage() {
  const locale = (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "ar") as Locale;
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [language, setLanguage] = useState<"ar" | "en">(locale);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setFullName("Demo User");
      setEmail("demo@example.com");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setLoading(false);
        return;
      }
      setEmail(data.user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile) {
        setFullName(profile.full_name ?? "");
        setAvatarUrl(profile.avatar_url ?? "");
      }

      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("language, theme")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (prefs) {
        setLanguage(prefs.language as "ar" | "en");
        if (prefs.theme) setTheme(prefs.theme);
      }
      setLoading(false);
    });
  }, [setTheme]);

  async function handleSave() {
    if (!isSupabaseConfigured()) return;

    setSaving(true);
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) { setSaving(false); return; }

    await Promise.all([
      supabase.from("profiles").update({ full_name: fullName }).eq("id", data.user.id),
      supabase.from("user_preferences").update({ language, theme: theme ?? "system" }).eq("user_id", data.user.id)
    ]);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Redirect if language changed
    if (language !== locale) {
      window.location.href = `/${language}/settings/profile`;
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4">
        <div className="skeleton h-8 w-48" />
        <div className="panel p-6"><div className="skeleton h-64 w-full" /></div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="heading-md">{t(locale, "profile.title")}</h2>
        <p className="muted text-sm mt-1">{t(locale, "profile.subtitle")}</p>
      </div>

      {/* Avatar Section */}
      <div className="panel p-6">
        <div className="flex items-center gap-4">
          <div className="avatar xl" style={avatarUrl ? {} : {}}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" />
            ) : (
              (fullName?.[0] || "U").toUpperCase()
            )}
          </div>
          <div>
            <h3 className="font-semibold">{t(locale, "profile.avatar")}</h3>
            <p className="muted text-sm mt-0.5">{email}</p>
            <button className="button sm mt-2" type="button">
              <Camera size={14} />
              {t(locale, "profile.changeAvatar")}
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="panel p-6">
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium">{t(locale, "profile.fullName")}</span>
            <input
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t(locale, "profile.fullName")}
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium">{t(locale, "profile.email")}</span>
            <input className="input" value={email} readOnly style={{ opacity: 0.6 }} />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">{t(locale, "profile.language")}</span>
              <select className="input" value={language} onChange={(e) => setLanguage(e.target.value as "ar" | "en")}>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium">{t(locale, "profile.theme")}</span>
              <select className="input" value={theme ?? "system"} onChange={(e) => setTheme(e.target.value)}>
                <option value="system">{t(locale, "profile.themeSystem")}</option>
                <option value="light">{t(locale, "profile.themeLight")}</option>
                <option value="dark">{t(locale, "profile.themeDark")}</option>
              </select>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button className="button primary" type="button" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? t(locale, "common.saving") : t(locale, "common.save")}
            </button>
            {saved && (
              <span className="text-sm animate-fadeIn" style={{ color: "var(--success)" }}>
                ✓ {t(locale, "profile.saved")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="panel p-6" style={{ borderColor: "color-mix(in srgb, var(--danger) 30%, var(--border))" }}>
        <h3 className="font-semibold" style={{ color: "var(--danger)" }}>{t(locale, "profile.deleteAccount")}</h3>
        <p className="muted text-sm mt-1">{t(locale, "profile.deleteWarning")}</p>
        <button className="button danger sm mt-3" type="button">
          <Trash2 size={14} />
          {t(locale, "profile.deleteAccount")}
        </button>
      </div>
    </div>
  );
}
