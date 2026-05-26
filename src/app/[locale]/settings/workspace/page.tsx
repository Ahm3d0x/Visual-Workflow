import { ShieldCheck, Users } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export default async function WorkspaceSettingsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  await params;
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-semibold">Workspace settings</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel p-5">
          <Users className="mb-4" />
          <h2 className="font-semibold">Members and roles</h2>
          <p className="muted mt-2">Owner, Admin, Editor, Commenter, and Viewer permissions are enforced through Supabase RLS and server-side checks.</p>
        </section>
        <section className="panel p-5">
          <ShieldCheck className="mb-4" />
          <h2 className="font-semibold">Security</h2>
          <p className="muted mt-2">Workspace data is scoped by membership, workflow share roles, and plan limits.</p>
        </section>
      </div>
    </div>
  );
}
