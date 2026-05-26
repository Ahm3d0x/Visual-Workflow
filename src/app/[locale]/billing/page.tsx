import { CheckCircle2, Sparkles } from "lucide-react";
import { type Locale, t } from "@/lib/i18n";
import { planLimits, planOrder } from "@/lib/plans";

export default async function BillingPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <p className="muted mb-2">{t(locale, "billing.trial")}</p>
        <h1 className="text-3xl font-semibold">{t(locale, "billing.title")}</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        {planOrder.map((plan) => {
          const limits = planLimits[plan];
          return (
            <article className="panel flex flex-col p-4" key={plan}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t(locale, `plans.${plan}`)}</h2>
                {plan === "legend" ? <Sparkles size={18} /> : <CheckCircle2 size={18} />}
              </div>
              <ul className="muted grid gap-2 text-sm">
                <li>{limits.workflows.toLocaleString()} workflows</li>
                <li>{limits.nodesPerWorkflow.toLocaleString()} nodes / workflow</li>
                <li>{limits.collaborators.toLocaleString()} collaborators</li>
                <li>{limits.customElements.toLocaleString()} custom elements</li>
                <li>{limits.favorites.toLocaleString()} favorites</li>
                <li>{limits.aiCredits.toLocaleString()} AI credits</li>
                <li>{limits.exports.join(", ")} export</li>
              </ul>
              <button className={`button mt-5 w-full ${plan === "legend" ? "primary" : ""}`}>Start {t(locale, `plans.${plan}`)}</button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
