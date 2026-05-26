import Link from "next/link";
import {
  ArrowRight, Bot, Boxes, Github, Globe, Lock, Palette,
  Share2, Sparkles, Workflow, Zap
} from "lucide-react";

export default function LandingPage() {
  const features = [
    { icon: Workflow, title: "landing.feature1", desc: "landing.feature1Desc", color: "#0f766e" },
    { icon: Share2, title: "landing.feature2", desc: "landing.feature2Desc", color: "#3b82f6" },
    { icon: Bot, title: "landing.feature3", desc: "landing.feature3Desc", color: "#8b5cf6" },
    { icon: Lock, title: "landing.feature4", desc: "landing.feature4Desc", color: "#ef4444" },
    { icon: Palette, title: "landing.feature5", desc: "landing.feature5Desc", color: "#f59e0b" },
    { icon: Boxes, title: "landing.feature6", desc: "landing.feature6Desc", color: "#10b981" }
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--panel-glass)",
          backdropFilter: "blur(20px) saturate(180%)"
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5 font-semibold">
            <span
              className="grid size-9 place-items-center rounded-lg"
              style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
            >
              <Workflow size={18} />
            </span>
            <span>Visual Workflow</span>
          </div>
          <div className="flex items-center gap-2">
            <Link className="button ghost sm" href="/ar/dashboard">العربية</Link>
            <Link className="button ghost sm" href="/en/auth/sign-in">Sign in</Link>
            <Link className="button primary sm" href="/en/auth/sign-up">
              <Sparkles size={14} />
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 30% 10%, color-mix(in srgb, var(--accent) 15%, transparent), transparent 50%), " +
            "radial-gradient(ellipse at 70% 90%, color-mix(in srgb, #8b5cf6 10%, transparent), transparent 40%), " +
            "var(--background)"
        }}
      >
        <div className="mx-auto max-w-5xl px-4 py-24 md:py-36 text-center">
          <div className="badge accent mx-auto mb-5 animate-fadeIn" style={{ animationDelay: "0ms" }}>
            <Zap size={12} />
            Collaborative Workflow Platform
          </div>
          <h1
            className="heading-xl mb-6 animate-slideUp"
            style={{ animationDelay: "100ms" }}
          >
            Design your{" "}
            <span className="gradient-text">workflow</span>
            {" "}visually
          </h1>
          <p
            className="muted mx-auto max-w-2xl text-lg mb-8 animate-slideUp"
            style={{ animationDelay: "200ms" }}
          >
            Professional platform to build, manage, and share workflows
            with your team in real-time. Powered by AI.
          </p>
          <div
            className="flex flex-wrap justify-center gap-3 animate-slideUp"
            style={{ animationDelay: "300ms" }}
          >
            <Link className="button primary lg" href="/en/auth/sign-up">
              <Sparkles size={18} />
              Start for free
            </Link>
            <Link className="button lg" href="/en/dashboard">
              Watch demo
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto animate-fadeIn"
            style={{ animationDelay: "500ms" }}
          >
            {[
              ["30+", "Node Types"],
              ["5", "Tier Plans"],
              ["∞", "Collaboration"]
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-extrabold gradient-text">{num}</div>
                <div className="text-xs muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="heading-lg">Why Visual Workflow?</h2>
          <p className="muted mt-2 max-w-xl mx-auto">Everything you need to design, collaborate, and automate your workflows</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              className="panel p-6 group cursor-default transition-all hover:shadow-lg"
              key={title}
              style={{ borderTop: `3px solid ${color}` }}
            >
              <div
                className="grid size-12 place-items-center rounded-xl mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${color}15`, color }}
              >
                <Icon size={22} />
              </div>
              <h3 className="font-semibold mb-1.5">{title.replace("landing.", "").replace(/([A-Z])/g, " $1").replace(/\d+/g, "").trim()}</h3>
              <p className="muted text-sm">{desc.replace("landing.", "").replace("Desc", "")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section
        className="py-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 60%), " +
            "var(--background-alt)"
        }}
      >
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="heading-lg mb-3">Plans for everyone</h2>
          <p className="muted mb-10 max-w-lg mx-auto">Start free with 3 workflows. Upgrade as your team grows.</p>
          <div className="grid gap-4 md:grid-cols-5">
            {([
              { name: "Free", price: "$0", desc: "3 workflows", popular: false },
              { name: "Warrior", price: "$9", desc: "20 workflows", popular: false },
              { name: "Elite", price: "$29", desc: "75 workflows", popular: true },
              { name: "Champion", price: "$79", desc: "250 workflows", popular: false },
              { name: "Legend", price: "$199", desc: "1000 workflows", popular: false }
            ] as const).map((plan) => (
              <div
                className={`panel p-5 text-center ${plan.popular ? "relative overflow-hidden" : ""}`}
                key={plan.name}
                style={plan.popular ? { borderColor: "var(--accent)", boxShadow: "var(--shadow-glow)" } : {}}
              >
                {plan.popular && (
                  <div
                    className="absolute top-0 left-0 right-0 py-1 text-xs font-bold"
                    style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
                  >
                    Most Popular
                  </div>
                )}
                <div className={plan.popular ? "mt-4" : ""}>
                  <h3 className="font-bold mb-1">{plan.name}</h3>
                  <div className="text-2xl font-extrabold">{plan.price}</div>
                  <div className="text-xs muted mb-4">/month</div>
                  <div className="muted text-sm">{plan.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <Link className="button primary lg mt-8" href="/en/auth/sign-up">
            <Sparkles size={18} />
            Start 14-day free trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <span
              className="grid size-8 place-items-center rounded-lg"
              style={{ background: "var(--gradient-accent)", color: "var(--accent-foreground)" }}
            >
              <Workflow size={14} />
            </span>
            Visual Workflow
          </div>
          <p className="muted text-sm">© 2026 Visual Workflow. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <Link href="/ar/dashboard" className="button ghost sm">
              <Globe size={14} />
              العربية
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
