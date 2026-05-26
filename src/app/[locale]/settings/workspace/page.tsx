"use client";

import { Crown, Loader2, Mail, Save, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser";

type Member = {
  userId: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
};

export default function WorkspaceSettingsPage() {
  const locale = (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "ar") as Locale;

  const [workspaceName, setWorkspaceName] = useState("My workspace");
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [plan, setPlan] = useState("legend");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setMembers([
        { userId: "1", email: "admin@example.com", name: "Ahmed", role: "owner" },
        { userId: "2", email: "sara@example.com", name: "Sara", role: "editor" },
        { userId: "3", email: "ali@example.com", name: "Ali", role: "viewer" }
      ]);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return; }

      const { data: membership } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("user_id", data.user.id)
        .limit(1)
        .maybeSingle();

      if (!membership?.workspace_id) { setLoading(false); return; }

      const [{ data: ws }, { data: membersData }, { data: sub }] = await Promise.all([
        supabase.from("workspaces").select("name, plan").eq("id", membership.workspace_id).maybeSingle(),
        supabase
          .from("workspace_members")
          .select("user_id, role, profiles(email, full_name, avatar_url)")
          .eq("workspace_id", membership.workspace_id),
        supabase.from("subscriptions").select("plan, status").eq("workspace_id", membership.workspace_id).maybeSingle()
      ]);

      if (ws) {
        setWorkspaceName(ws.name);
        setPlan(sub?.plan ?? ws.plan ?? "free");
      }

      if (membersData) {
        setMembers(
          membersData.map((m) => {
            const p = m.profiles as unknown as { email?: string; full_name?: string; avatar_url?: string } | null;
            return {
              userId: m.user_id,
              email: p?.email ?? "",
              name: p?.full_name ?? p?.email?.split("@")[0] ?? "",
              role: m.role,
              avatar: p?.avatar_url ?? undefined
            };
          })
        );
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    // In production, update workspace name in Supabase
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const roles = ["owner", "admin", "editor", "commenter", "viewer"];

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
        <h2 className="heading-md">{t(locale, "workspace.title")}</h2>
        <p className="muted text-sm mt-1">{t(locale, "workspace.subtitle")}</p>
      </div>

      {/* Workspace Name */}
      <div className="panel p-6">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium">{t(locale, "workspace.name")}</span>
          <input
            className="input"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </label>

        {/* Plan Badge */}
        <div className="flex items-center gap-3 mt-4">
          <div className="badge accent">
            <Crown size={12} />
            {t(locale, `plans.${plan}`)}
          </div>
          <span className="muted text-sm">{t(locale, "workspace.plan")}</span>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button className="button primary" type="button" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? t(locale, "common.saving") : t(locale, "common.save")}
          </button>
          {saved && (
            <span className="text-sm animate-fadeIn" style={{ color: "var(--success)" }}>
              ✓ {t(locale, "common.saved")}
            </span>
          )}
        </div>
      </div>

      {/* Members */}
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <Users size={18} />
            <h3 className="font-semibold">{t(locale, "workspace.members")}</h3>
            <span className="badge accent">{members.length}</span>
          </div>
        </div>

        {/* Invite Bar */}
        <div className="flex flex-col gap-2 p-4 sm:flex-row" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="relative flex-1">
            <Mail size={16} className="absolute top-1/2 -translate-y-1/2 muted-light" style={{ insetInlineStart: "0.75rem" }} />
            <input
              className="input"
              style={{ paddingInlineStart: "2.5rem" }}
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder={t(locale, "workspace.inviteEmail")}
              type="email"
            />
          </div>
          <select className="input" style={{ width: "auto", minWidth: 120 }} value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
            {roles.filter(r => r !== "owner").map(r => (
              <option key={r} value={r}>{t(locale, `role.${r}`)}</option>
            ))}
          </select>
          <button className="button primary" type="button">
            <UserPlus size={16} />
            {t(locale, "workspace.inviteMember")}
          </button>
        </div>

        {/* Members List */}
        <div className="divide-border">
          {members.map((member) => (
            <div key={member.userId} className="flex items-center gap-3 p-4 transition hover:opacity-80">
              <div className="avatar">
                {member.avatar ? (
                  <img src={member.avatar} alt="" />
                ) : (
                  (member.name?.[0] || "U").toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-sm">{member.name}</div>
                <div className="truncate text-xs muted">{member.email}</div>
              </div>
              <span className={`badge ${member.role === "owner" ? "accent" : "info"}`}>
                {t(locale, `role.${member.role}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="panel p-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck size={20} style={{ color: "var(--accent)" }} />
          <h3 className="font-semibold">{t(locale, "workspace.security")}</h3>
        </div>
        <p className="muted text-sm">{t(locale, "workspace.securityDesc")}</p>
      </div>

      {/* Danger Zone */}
      <div className="panel p-6" style={{ borderColor: "color-mix(in srgb, var(--danger) 30%, var(--border))" }}>
        <h3 className="font-semibold" style={{ color: "var(--danger)" }}>{t(locale, "workspace.deleteWorkspace")}</h3>
        <p className="muted text-sm mt-1">{t(locale, "workspace.deleteWarning")}</p>
        <button className="button danger sm mt-3" type="button">
          <Trash2 size={14} />
          {t(locale, "workspace.deleteWorkspace")}
        </button>
      </div>
    </div>
  );
}
