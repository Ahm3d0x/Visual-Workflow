import { NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiClient, getOpenAIClient } from "@/lib/ai";

const requestSchema = z.object({
  provider: z.enum(["openai", "gemini"]).default("openai"),
  task: z.enum(["generate", "analyze", "summarize", "properties", "layout"]).default("analyze"),
  prompt: z.string().min(1).max(6000),
  locale: z.enum(["ar", "en"]).default("en"),
  workflow: z.unknown().optional()
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid AI request", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { provider, task, prompt, locale, workflow } = parsed.data;
  const systemPrompt = [
    "You are an expert visual workflow architect.",
    "Return concise, implementation-ready suggestions.",
    "When generating workflows, include nodes, edges, and validation notes.",
    `Respond in ${locale === "ar" ? "Arabic" : "English"}.`,
    `Task: ${task}.`
  ].join("\n");

  try {
    if (provider === "gemini") {
      const model = getGeminiClient().getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`${systemPrompt}\n\nWorkflow:\n${JSON.stringify(workflow ?? {})}\n\nUser:\n${prompt}`);
      return NextResponse.json({ result: result.response.text(), provider });
    }

    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Workflow:\n${JSON.stringify(workflow ?? {})}\n\nUser:\n${prompt}` }
      ]
    });

    return NextResponse.json({ result: completion.choices[0]?.message.content ?? "", provider });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
