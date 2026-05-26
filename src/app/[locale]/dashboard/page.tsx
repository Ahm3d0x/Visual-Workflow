import Link from "next/link";
import {
  Archive, Bot, Boxes, Clock3, Copy, FileUp, Gauge, Layout, MoreHorizontal,
  Plus, Search, Sparkles, Trash2, Users, Workflow
} from "lucide-react";
import { usageRows } from "@/lib/demo-data";
import { type Locale, t } from "@/lib/i18n";
import { getDashboardData } from "@/lib/workflow-data";

export default async function DashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { authenticated, workflows } = await getDashboardData();

  const statusColors: Record<string, string> = {
    draft: "warning",
    active: "success",
    archived: "info",
    published: "accent"
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 page-enter">
      {/* Header */}
      <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="muted mb-1 text-sm">{t(locale, "app.tagline")}</p>
          <h1 className="heading-lg">{t(locale, "dashboard.title")}</h1>
          <p className="muted mt-1 max-w-2xl text-sm">{t(locale, "dashboard.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="button" type="button">
            <Search size={16} />
            {t(locale, "common.search")}
          </button>
          <button className="button" type="button">
            <Users size={16} />
            {t(locale, "common.invite")}
          </button>
          <Link className="button primary" href={`/${locale}/workflows/customer-onboarding`}>
            <Plus size={16} />
            {t(locale, "common.newWorkflow")}
          </Link>
        </div>
      </section>

      {/* Demo Notice */}
      {!authenticated && (
        <div
          className="panel mb-6 flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between animate-slideUp"
          style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, var(--border))" }}
        >
          <p className="muted text-sm">{t(locale, "dashboard.demoNotice")}</p>
          <Link className="button primary sm" href={`/${locale}/auth/sign-up`}>
            <Sparkles size={14} />
            {t(locale, "dashboard.signUpCta")}
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <section className="metric-grid mb-8">
        {usageRows().map(([label, value, limit]) => (
          <div className="panel metric-card p-4" key={label}>
            <div className="mb-3 flex items-center justify-between">
              <span className="muted text-xs font-medium uppercase tracking-wide">{label}</span>
              <Gauge size={16} className="muted-light" />
            </div>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <div className="muted text-xs mt-1">
              {t(locale, "dashboard.usage")}: {limit.toLocaleString()}
            </div>
            <div className="progress-track mt-3">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, (value / limit) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Workflows List */}
        <section className="panel overflow-hidden">
          <div
            className="flex items-center justify-between p-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <Workflow size={18} style={{ color: "var(--accent)" }} />
              <h2 className="font-semibold">{t(locale, "dashboard.recent")}</h2>
              <span className="badge accent">{workflows.length}</span>
            </div>
            <button className="button ghost sm" type="button">
              <Layout size={14} />
            </button>
          </div>

          {workflows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div
                className="mb-4 grid size-16 place-items-center rounded-xl animate-float"
                style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
              >
                <Workflow size={28} />
              </div>
              <h3 className="font-semibold mb-1">{t(locale, "dashboard.empty")}</h3>
              <p className="muted text-sm mb-4 max-w-xs">{t(locale, "dashboard.emptyDesc")}</p>
              <Link className="button primary" href={`/${locale}/workflows/customer-onboarding`}>
                <Plus size={16} />
                {t(locale, "dashboard.createFirst")}
              </Link>
            </div>
          ) : (
            <div className="divide-border">
              {workflows.map((workflow) => (
                <Link
                  href={`/${locale}/workflows/${workflow.id}`}
                  className="flex items-center gap-3 p-4 transition-all hover:bg-[var(--accent-muted)]"
                  key={workflow.id}
                >
                  {/* Icon */}
                  <div
                    className="grid size-10 shrink-0 place-items-center rounded-lg"
                    style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                  >
                    <Workflow size={18} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{workflow.name}</div>
                    <div className="muted text-xs mt-0.5">
                      {workflow.nodes} {t(locale, "dashboard.nodes")}
                    </div>
                  </div>

                  {/* Status */}
                  <span className={`badge ${statusColors[workflow.status.toLowerCase()] ?? "info"} hidden sm:inline-flex`}>
                    {t(locale, `status.${workflow.status.toLowerCase()}`)}
                  </span>

                  {/* Collaborators */}
                  <span className="muted flex items-center gap-1 text-xs hidden md:flex">
                    <Users size={13} />
                    {workflow.collaborators}
                  </span>

                  {/* Date */}
                  <span className="muted flex items-center gap-1 text-xs hidden lg:flex">
                    <Clock3 size={13} />
                    {workflow.updatedAt}
                  </span>

                  {/* More */}
                  <button
                    className="button ghost sm"
                    onClick={(e) => e.preventDefault()}
                    type="button"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="grid gap-4 content-start">
          {/* Trial Card */}
          <div className="panel p-5 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{ background: "var(--gradient-hero)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">{t(locale, "billing.trial")}</h2>
                <Sparkles size={16} style={{ color: "var(--accent)" }} />
              </div>
              <p className="muted text-sm mb-4">{t(locale, "billing.faq1a")}</p>
              <Link className="button primary w-full" href={`/${locale}/billing`}>
                {t(locale, "nav.billing")}
              </Link>
            </div>
          </div>

          {/* AI Card */}
          <div className="panel p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">{t(locale, "ai.title")}</h2>
              <Bot size={16} style={{ color: "var(--accent)" }} />
            </div>
            <p className="muted text-sm">{t(locale, "ai.description")}</p>
          </div>

          {/* Custom Elements Card */}
          <div className="panel p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">{t(locale, "editor.custom")}</h2>
              <Boxes size={16} style={{ color: "var(--accent)" }} />
            </div>
            <p className="muted text-sm">{t(locale, "landing.feature6Desc")}</p>
          </div>

          {/* Quick Actions */}
          <div className="panel p-5">
            <h2 className="font-semibold mb-3">{t(locale, "dashboard.quickActions")}</h2>
            <div className="grid gap-2">
              <button className="button ghost sm justify-start" type="button">
                <FileUp size={14} />
                {t(locale, "common.import")}
              </button>
              <button className="button ghost sm justify-start" type="button">
                <Copy size={14} />
                {t(locale, "common.duplicate")}
              </button>
              <button className="button ghost sm justify-start" type="button">
                <Archive size={14} />
                {t(locale, "common.archive")}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
