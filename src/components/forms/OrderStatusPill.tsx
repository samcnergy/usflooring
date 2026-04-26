import { cn } from "@/lib/cn";
import type { OrderStatus } from "@prisma/client";

const styles: Record<OrderStatus, string> = {
  draft:     "bg-marble-200 text-marble-700",
  finalized: "bg-brand-100 text-brand-700",
  installed: "bg-brand-700 text-white",
  paid:      "bg-brand-900 text-white",
  voided:    "bg-marble-200 text-marble-700 line-through",
};

const labels: Record<OrderStatus, string> = {
  draft:     "Draft",
  finalized: "Finalized",
  installed: "Installed",
  paid:      "Paid",
  voided:    "Voided",
};

export function OrderStatusPill({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span className={cn("inline-block px-2 py-0.5 rounded text-xs font-medium", styles[status], className)}>
      {labels[status]}
    </span>
  );
}
