import Anthropic from "@anthropic-ai/sdk";

// Server-only — never import this from a client component.
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export const CLAUDE_MODELS = {
  analysis: "claude-opus-4-7",
  cheapSummary: "claude-haiku-4-5",
} as const;
