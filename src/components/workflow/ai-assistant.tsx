"use client";

import { Bot, Loader2, Send, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function AIAssistant({ locale }: { locale: Locale }) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAssistant(task: string = "analyze") {
    if (!prompt.trim() && task === "analyze") return;
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/ai/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "openai",
          task,
          prompt: prompt || `${task} this workflow`,
          locale
        })
      });
      const data = await response.json();
      setResult(data.result ?? data.error ?? "No response");
    } catch {
      setResult(t(locale, "common.error"));
    }
    setLoading(false);
  }

  return (
    <div className="grid gap-3 p-4">
      <div className="flex items-center gap-2">
        <Bot size={18} style={{ color: "var(--accent)" }} />
        <h2 className="font-semibold">{t(locale, "ai.title")}</h2>
      </div>
      <p className="muted text-xs">{t(locale, "ai.description")}</p>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-1.5">
        {([
          ["generate", t(locale, "ai.generate"), Sparkles],
          ["analyze", t(locale, "ai.analyze"), Wand2],
          ["summarize", t(locale, "ai.summarize"), Bot]
        ] as const).map(([task, label, Icon]) => (
          <button
            className="button sm ghost"
            key={task}
            type="button"
            onClick={() => runAssistant(task)}
            disabled={loading}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Prompt Input */}
      <div className="relative">
        <textarea
          className="input min-h-24"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t(locale, "ai.placeholder")}
        />
      </div>

      <button
        className="button primary"
        type="button"
        onClick={() => runAssistant("analyze")}
        disabled={loading || !prompt.trim()}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {loading ? t(locale, "common.loading") : t(locale, "ai.run")}
      </button>

      {/* Result */}
      {result && (
        <div
          className="rounded-lg p-3 text-sm animate-slideUp"
          style={{
            background: "var(--panel-strong)",
            border: "1px solid var(--border)",
            maxHeight: "300px",
            overflowY: "auto",
            whiteSpace: "pre-wrap"
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}
