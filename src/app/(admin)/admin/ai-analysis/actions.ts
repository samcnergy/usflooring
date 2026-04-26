"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { anthropic, CLAUDE_MODELS } from "@/lib/claude";
import { buildSnapshot, defaultDateRange } from "@/lib/ai-snapshot";

const SYSTEM_PROMPT = `You are a small-business advisor for U.S. Floor, Kitchen & Bath, a
family-owned flooring and remodeling shop in Rancho Santa Margarita, CA. The
owner is going to hand you an aggregated snapshot of the last {N} days of
business. Your job is to:

1. Briefly summarize what's working (1-2 paragraphs).
2. Flag concerns worth investigating (concentration risk on one salesperson,
   under-performing ad sources, growing open balance, etc.).
3. Give 3 specific, actionable recommendations the owner could try this month.
   Each recommendation should be concrete (which lever, expected effect,
   how to measure).
4. Keep the tone direct and practical — they are tradespeople, not analysts.
   No buzzwords, no consultant-speak.

Snapshot follows.`;

export async function runAnalysisAction(formData: FormData) {
  const me = await requireRole("admin");

  const startStr = String(formData.get("rangeStart") ?? "");
  const endStr = String(formData.get("rangeEnd") ?? "");
  const customQuestion = String(formData.get("customQuestion") ?? "").trim();

  let start: Date;
  let end: Date;
  if (startStr && endStr) {
    start = new Date(startStr);
    end = new Date(endStr);
  } else {
    const range = defaultDateRange(90);
    start = range.start;
    end = range.end;
  }

  const snapshot = await buildSnapshot(start, end);

  const userPrompt = [
    `Range: ${snapshot.range.startISO} to ${snapshot.range.endISO} (${snapshot.range.days} days).`,
    "",
    "```json",
    JSON.stringify(snapshot, null, 2),
    "```",
    customQuestion ? `\nThe owner specifically wants you to look at: ${customQuestion}` : "",
  ].join("\n");

  const system = SYSTEM_PROMPT.replace("{N}", String(snapshot.range.days));

  const response = await anthropic.messages.create({
    model: CLAUDE_MODELS.analysis,
    max_tokens: 4096,
    system,
    messages: [{ role: "user", content: userPrompt }],
  });

  const responseText = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n\n");

  const run = await prisma.aiAnalysisRun.create({
    data: {
      requestedById: me.id,
      rangeStart: start,
      rangeEnd: end,
      customQuestion: customQuestion || null,
      snapshotJson: snapshot as object,
      responseMd: responseText,
      modelId: CLAUDE_MODELS.analysis,
      inputTokens: response.usage?.input_tokens ?? null,
      outputTokens: response.usage?.output_tokens ?? null,
    },
  });

  revalidatePath("/admin/ai-analysis");
  redirect(`/admin/ai-analysis/${run.id}`);
}
