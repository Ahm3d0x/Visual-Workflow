"use client";

import { Bot, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export function AIAssistant({ locale }: { locale: Locale }) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("AI workflow generation, analysis, summaries, and auto-layout suggestions are wired through /api/ai/workflow.");

  async function runAssistant() {
    const response = await fetch("/api/ai/workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "openai", task: "analyze", prompt, locale })
    });
    const data = await response.json();
    setResult(data.result ?? data.error ?? "No response");
  }

  return (
    <div className="grid gap-3 p-4">
      <div className="flex items-center gap-2">
        <Bot size={18} />
        <h2 className="font-semibold">AI Assistant</h2>
      </div>
      <textarea className="input min-h-28" value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe the workflow you want, or ask for improvements." />
      <button className="button primary" type="button" onClick={runAssistant}><Sparkles size={16} />Run assistant</button>
      <p className="muted text-sm">{result}</p>
    </div>
  );
}
