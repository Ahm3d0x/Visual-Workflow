import Link from "next/link";
import { Bot, Boxes, Clock3, Gauge, Plus, Search, Share2, Users, Workflow } from "lucide-react";
import { usageRows } from "@/lib/demo-data";
import { type Locale, t } from "@/lib/i18n";
import { getDashboardData } from "@/lib/workflow-data";

export default async function DashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { authenticated, workflows } = await getDashboardData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="muted mb-2">{t(locale, "app.tagline")}</p>
          <h1 className="text-3xl font-semibold">{t(locale, "dashboard.title")}</h1>
          <p className="muted mt-2 max-w-2xl">{t(locale, "dashboard.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="button"><Search size={17} />{t(locale, "common.search")}</button>
          <button className="button"><Users size={17} />{t(locale, "common.invite")}</button>
          <Link className="button primary" href={`/${locale}/workflows/customer-onboarding`}><Plus size={17} />{t(locale, "common.newWorkflow")}</Link>
        </div>
      </section>

      {!authenticated ? (
        <div className="panel mb-6 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <p className="muted">Sign in to use the Supabase-backed workspace. The current dashboard is showing demo data.</p>
          <Link className="button primary" href={`/${locale}/auth/sign-up`}>{t(locale, "nav.signUp")}</Link>
        </div>
      ) : null}

      <section className="metric-grid mb-6">
        {usageRows().map(([label, value, limit]) => (
          <div className="panel p-4" key={label}>
            <div className="mb-3 flex items-center justify-between">
              <span className="muted text-sm">{label}</span>
              <Gauge size={18} />
            </div>
            <div className="text-2xl font-semibold">{value.toLocaleString()}</div>
            <div className="muted mt-1 text-sm">of {limit.toLocaleString()} on Legend</div>
            <div className="mt-3 h-2 rounded-full" style={{ background: "var(--panel-strong)" }}>
              <div className="h-2 rounded-full" style={{ width: `${Math.min(100, (value / limit) * 100)}%`, background: "var(--accent)" }} />
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "var(--border)" }}>
            <div>
              <h2 className="font-semibold">{t(locale, "dashboard.recent")}</h2>
              <p className="muted text-sm">Realtime-ready collaborative workflows</p>
            </div>
            <Workflow size={20} />
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {workflows.map((workflow) => (
              <Link href={`/${locale}/workflows/${workflow.id}`} className="grid gap-3 p-4 transition hover:opacity-80 md:grid-cols-[1fr_auto_auto_auto]" key={workflow.id}>
                <div>
                  <div className="font-medium">{workflow.name}</div>
                  <div className="muted text-sm">{workflow.nodes} nodes</div>
                </div>
                <span className="button">{workflow.status}</span>
                <span className="muted flex items-center gap-2 text-sm"><Users size={15} />{workflow.collaborators}</span>
                <span className="muted flex items-center gap-2 text-sm"><Clock3 size={15} />{workflow.updatedAt}</span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="grid gap-4">
          <div className="panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">{t(locale, "billing.trial")}</h2>
              <Share2 size={18} />
            </div>
            <p className="muted text-sm">Workspace is running with full collaboration, AI, exports, and custom library limits.</p>
            <Link className="button primary mt-4 w-full" href={`/${locale}/billing`}>{t(locale, "nav.billing")}</Link>
          </div>
          <div className="panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">{t(locale, "editor.ai")}</h2>
              <Bot size={18} />
            </div>
            <p className="muted text-sm">Generate workflows, inspect logic gaps, summarize flows, and create node properties using OpenAI or Gemini.</p>
          </div>
          <div className="panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">{t(locale, "editor.custom")}</h2>
              <Boxes size={18} />
            </div>
            <p className="muted text-sm">Custom elements are stored in Supabase per user or workspace.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
