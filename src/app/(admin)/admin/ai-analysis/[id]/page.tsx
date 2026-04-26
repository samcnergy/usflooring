import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

type Params = Promise<{ id: string }>;

export default async function AiAnalysisRunPage({ params }: { params: Params }) {
  await requireRole("admin");
  const { id } = await params;
  const run = await prisma.aiAnalysisRun.findUnique({ where: { id } });
  if (!run) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-marble-700">
          <Link href="/admin/ai-analysis" className="text-brand-700 hover:underline">
            ← All runs
          </Link>
        </p>
        <h1 className="text-3xl font-bold text-brand-700">
          Analysis: {format(run.rangeStart, "MMM d, yyyy")} – {format(run.rangeEnd, "MMM d, yyyy")}
        </h1>
        <p className="text-marble-700 text-sm mt-1">
          {format(run.createdAt, "MMM d, yyyy h:mm a")} ·{" "}
          {run.modelId}
          {run.inputTokens != null && run.outputTokens != null
            ? ` · ${run.inputTokens.toLocaleString()} in / ${run.outputTokens.toLocaleString()} out`
            : ""}
        </p>
        {run.customQuestion ? (
          <p className="mt-2 text-marble-900 italic">“{run.customQuestion}”</p>
        ) : null}
      </div>

      <article className="prose prose-sm max-w-none bg-white border border-marble-200 rounded-lg p-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{run.responseMd}</ReactMarkdown>
      </article>
    </div>
  );
}
