import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "tertiary";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  "inline-flex items-center justify-center font-medium select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 disabled:opacity-50 disabled:pointer-events-none min-h-11 px-4 rounded";

const variants: Record<Variant, string> = {
  // Primary: solid green-900, white text, no shadow, darken 4% on hover.
  primary:
    "bg-brand-900 text-white hover:bg-[color-mix(in_oklab,var(--color-brand-900)_96%,black)]",
  // Secondary: outline green-700, transparent bg, green-100 hover bg.
  secondary:
    "border border-brand-700 text-brand-700 bg-transparent hover:bg-brand-100",
  // Tertiary: underlined green-700 link.
  tertiary: "text-brand-700 underline underline-offset-2 hover:text-brand-900 px-0 min-h-0",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", ...rest },
  ref,
) {
  return (
    <button ref={ref} className={cn(base, variants[variant], className)} {...rest} />
  );
});
