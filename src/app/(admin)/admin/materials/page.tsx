// PHASE 2 placeholder — see docs/usfloorkb_phase1_prompt.md § 14.

export default function MaterialsCatalogPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-700">Materials Catalog</h1>
      <p className="mt-2 text-marble-700">Coming in Phase 2.</p>
      <p className="mt-2 text-sm text-marble-700">
        Phase 1 collects usage data passively in the <code>MaterialSuggestion</code>
        table. Phase 2 seeds the catalog from the top-N rows by usage.
      </p>
    </div>
  );
}
