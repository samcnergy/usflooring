import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
};

export function Field({ label, htmlFor, required, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-marble-700">
        {label}
        {required ? <span className="text-marble-700" aria-hidden> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger" role="alert">{error}</p>
      ) : hint ? (
        <p className="text-xs text-marble-700">{hint}</p>
      ) : null}
    </div>
  );
}

// Standard input styling. Required inputs get a 2px brand-green left border
// per § 5 of the design system; on submit-error they get a 2px danger border.
export const inputCls =
  "w-full bg-white border border-marble-200 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700";
export const requiredInputCls =
  "w-full bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700";
export const errorInputCls =
  "w-full bg-white border border-marble-200 border-l-2 border-l-danger rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-danger";

export const selectCls =
  "w-full bg-white border border-marble-200 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700";
export const requiredSelectCls =
  "w-full bg-white border border-marble-200 border-l-2 border-l-brand-700 rounded px-3 py-2.5 text-marble-900 focus:outline-none focus:ring-2 focus:ring-brand-700";
