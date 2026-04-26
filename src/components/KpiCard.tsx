import { cn } from "@/lib/cn";

type Props = {
  label: string;
  value: string;
  sub?: string;
  delta?: { pct: number; up: boolean } | null;
  className?: string;
};

export function KpiCard({ label, value, sub, delta, className }: Props) {
  return (
    <div className={cn("bg-marble-100 border border-marble-200 rounded-lg p-4", className)}>
      <p className="text-xs text-marble-700 uppercase tracking-wide font-semibold">{label}</p>
      <p className="text-2xl font-bold text-marble-900 tabular-money mt-1">{value}</p>
      <div className="flex items-center gap-2 mt-1 text-xs text-marble-700">
        {sub ? <span>{sub}</span> : null}
        {delta ? (
          <span className={delta.up ? "text-brand-700" : "text-danger"}>
            {delta.up ? "▲" : "▼"} {Math.abs(delta.pct).toFixed(0)}%
          </span>
        ) : null}
      </div>
    </div>
  );
}
