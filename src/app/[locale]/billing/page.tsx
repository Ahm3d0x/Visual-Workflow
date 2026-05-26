"use client";

import { Check, ChevronDown, ChevronUp, Crown, Sparkles, X, Zap } from "lucide-react";
import { useState } from "react";
import { type Locale, t } from "@/lib/i18n";
import { planLimits, planOrder, planPricing, getSavingsPercent, type PlanId } from "@/lib/plans";

export default function BillingPage() {
  const locale = (typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "ar") as Locale;
  const [yearly, setYearly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const currentPlan: PlanId = "legend"; // TODO: fetch from Supabase
  const trialDays = 12; // TODO: calculate from trial_ends_at

  const planIcons: Record<PlanId, typeof Crown> = {
    free: Zap,
    warrior: Zap,
    elite: Sparkles,
    champion: Crown,
    legend: Crown
  };

  const faqs = [
    { q: t(locale, "billing.faq1q"), a: t(locale, "billing.faq1a") },
    { q: t(locale, "billing.faq2q"), a: t(locale, "billing.faq2a") },
    { q: t(locale, "billing.faq3q"), a: t(locale, "billing.faq3a") }
  ];

  const featureKeys: Array<{ key: keyof typeof planLimits.free; label: string }> = [
    { key: "workflows", label: t(locale, "billing.workflows") },
    { key: "nodesPerWorkflow", label: t(locale, "billing.nodesPerWorkflow") },
    { key: "collaborators", label: t(locale, "billing.collaboratorsLimit") },
    { key: "customElements", label: t(locale, "billing.customElementsLimit") },
    { key: "favorites", label: t(locale, "billing.favoritesLimit") },
    { key: "aiCredits", label: t(locale, "billing.aiCreditsLimit") },
    { key: "versionHistory", label: t(locale, "billing.versionHistory") }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 page-enter">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="badge accent mx-auto mb-3">
          <Crown size={12} />
          {t(locale, "billing.trial")}
        </div>
        <h1 className="heading-lg">{t(locale, "billing.title")}</h1>
        {trialDays > 0 && (
          <p className="muted mt-2">
            <span className="font-semibold" style={{ color: "var(--accent)" }}>{trialDays}</span> {t(locale, "billing.trialDays")}
          </p>
        )}

        {/* Billing Toggle */}
        <div className="mt-6 inline-flex items-center gap-3">
          <span className={`text-sm font-medium ${!yearly ? "" : "muted"}`}>{t(locale, "billing.monthly")}</span>
          <button
            className="relative h-7 w-12 rounded-full transition-colors"
            style={{ background: yearly ? "var(--accent)" : "var(--border)" }}
            onClick={() => setYearly(!yearly)}
            type="button"
          >
            <span
              className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all"
              style={{ insetInlineStart: yearly ? "calc(100% - 1.625rem)" : "0.125rem" }}
            />
          </button>
          <span className={`text-sm font-medium ${yearly ? "" : "muted"}`}>
            {t(locale, "billing.yearly")}
            {yearly && <span className="badge success ms-1.5">-20%</span>}
          </span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-4 lg:grid-cols-5 mb-12">
        {planOrder.map((plan) => {
          const limits = planLimits[plan];
          const pricing = planPricing[plan];
          const Icon = planIcons[plan];
          const isCurrent = plan === currentPlan;
          const isPopular = plan === "elite";
          const price = yearly ? Math.round(pricing.yearlyPrice / 12) : pricing.monthlyPrice;

          return (
            <article
              className="panel flex flex-col p-5 relative overflow-hidden transition-all hover:shadow-lg"
              key={plan}
              style={
                isPopular
                  ? { borderColor: "var(--accent)", boxShadow: "0 0 0 1px var(--accent), var(--shadow-glow)" }
                  : isCurrent
                    ? { borderColor: "var(--accent)" }
                    : {}
              }
            >
              {isPopular && (
                <div
                  className="absolute top-0 left-0 right-0 py-1 text-center text-xs font-bold"
                  style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
                >
                  {t(locale, "billing.popular")}
                </div>
              )}

              <div className={isPopular ? "mt-5" : ""}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">{t(locale, `plans.${plan}`)}</h2>
                  <Icon size={18} style={{ color: "var(--accent)" }} />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-3xl font-extrabold">${price}</span>
                  {price > 0 && <span className="muted text-sm">{t(locale, "billing.perMonth")}</span>}
                  {yearly && price > 0 && (
                    <div className="text-xs muted mt-0.5">
                      ${pricing.yearlyPrice}{t(locale, "billing.perYear")}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="grid gap-2 text-sm mb-5">
                  {featureKeys.map(({ key, label }) => {
                    const val = limits[key];
                    return (
                      <li key={key} className="flex items-center gap-2">
                        <Check size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
                        <span>{typeof val === "number" ? val.toLocaleString() : ""} {label}</span>
                      </li>
                    );
                  })}
                  <li className="flex items-center gap-2">
                    {limits.integrations ? (
                      <Check size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
                    ) : (
                      <X size={14} className="muted-light" style={{ flexShrink: 0 }} />
                    )}
                    <span className={limits.integrations ? "" : "muted"}>{t(locale, "billing.integrations")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {limits.prioritySupport ? (
                      <Check size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
                    ) : (
                      <X size={14} className="muted-light" style={{ flexShrink: 0 }} />
                    )}
                    <span className={limits.prioritySupport ? "" : "muted"}>{t(locale, "billing.prioritySupport")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} style={{ color: "var(--success)", flexShrink: 0 }} />
                    <span>{limits.exports.map(e => e.toUpperCase()).join(", ")} {t(locale, "billing.exportFormats")}</span>
                  </li>
                </ul>

                {/* CTA */}
                <button
                  className={`button w-full ${isPopular || plan === "legend" ? "primary" : ""}`}
                  type="button"
                >
                  {isCurrent
                    ? t(locale, "billing.currentPlan")
                    : plan === "free"
                      ? t(locale, "billing.startTrial")
                      : t(locale, "billing.subscribe")}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-2xl">
        <h2 className="heading-md text-center mb-6">{t(locale, "billing.faq")}</h2>
        <div className="grid gap-3">
          {faqs.map((faq, i) => (
            <div className="panel overflow-hidden" key={i}>
              <button
                className="flex w-full items-center justify-between p-4 text-start font-medium"
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                type="button"
              >
                {faq.q}
                {expandedFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedFaq === i && (
                <div className="px-4 pb-4 text-sm muted animate-slideDown">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
