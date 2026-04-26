import Link from "next/link";
import { format, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { runAnalysisAction } from "./actions";

export default async function AiAnalysisPage() {
  const runs = await prisma.aiAnalysisRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      rangeStart: true,
      rangeEnd: true,
      createdAt: true,
      customQuestion: true,
      modelId: true,
    },
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const ninetyDaysAgo = format(subDays(new Date(), 90), "yyyy-MM-dd");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">AI Business Analysis</h1>
        <p className="text-marble-700 text-sm mt-1">
          Hand Claude an aggregated snapshot of recent business and get a
          plain-English read on what&apos;s working, what to investigate, and what
          to try this month.
        </p>
      </div>

      <form action={runAnalysisAction} className="bg-marble-100 border border-marble-200 rounded-lg p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-marble-700">Range start</span>
            <input
              type="date"
              name="rangeStart"
              defaultValue={ninetyDaysAgo}
              className="bg-white border border-marble-200 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-marble-700">Range end</span>
            <input
              type="date"
              name="rangeEnd"
              defaultValue={today}
              className="bg-white border border-marble-200 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-marble-700">
            Anything specific you want me to look at? (optional)
          </span>
          <textarea
            name="customQuestion"
            rows={3}
            placeholder="e.g. why is open balance growing? are there ad sources we should drop?"
            className="bg-white border border-marble-200 rounded px-3 py-2 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </label>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center min-h-11 px-5 rounded bg-brand-900 text-white font-medium hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)]"
          >
            Run analysis
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold text-marble-900 mb-3">Past runs</h2>
        {runs.length === 0 ? (
          <div className="bg-marble-100 border border-marble-200 rounded-lg p-6 text-center text-marble-700 text-sm">
            No runs yet — kick off your first analysis above.
          </div>
        ) : (
          <ul className="border border-marble-200 rounded-lg divide-y divide-marble-200 bg-white">
            {runs.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/admin/ai-analysis/${r.id}`}
                  className="block px-4 py-3 hover:bg-brand-100/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-marble-900 font-medium">
                        {format(r.rangeStart, "MMM d, yyyy")} – {format(r.rangeEnd, "MMM d, yyyy")}
                      </p>
                      {r.customQuestion ? (
                        <p className="text-marble-700 text-xs mt-0.5 line-clamp-1">
                          “{r.customQuestion}”
                        </p>
                      ) : null}
                    </div>
                    <p className="text-marble-700 text-xs whitespace-nowrap">
                      {format(r.createdAt, "MMM d · h:mm a")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
