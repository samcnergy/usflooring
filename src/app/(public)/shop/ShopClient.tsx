"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";

export const CATEGORY_LABELS: Record<string, string> = {
  cabinet:    "Cabinets",
  carpet:     "Carpet",
  vinyl:      "Vinyl",
  wood:       "Hardwood",
  ceramic:    "Ceramic",
  counterTop: "Countertops",
  fireplace:  "Fireplace",
  shower:     "Shower",
  tile:       "Tile",
  stone:      "Stone",
  molding:    "Molding",
  fixture:    "Fixtures",
  other:      "Other",
};

// Swatch gradient per category
export const CATEGORY_SWATCH: Record<string, string> = {
  cabinet:    "linear-gradient(135deg,#C4A882 0%,#A07850 40%,#C9B090 70%,#8B5E35 100%)",
  carpet:     "linear-gradient(135deg,#D4C5B0 0%,#BEA98F 40%,#CFC0A8 70%,#A89070 100%)",
  vinyl:      "linear-gradient(135deg,#C8C0B8 0%,#A8A098 40%,#D0C8C0 70%,#908880 100%)",
  wood:       "linear-gradient(135deg,#D4A870 0%,#A07040 40%,#C89858 70%,#8B5E30 100%)",
  ceramic:    "linear-gradient(135deg,#E8E4E0 0%,#D0CCC8 40%,#E4E0DC 70%,#C0BCB8 100%)",
  counterTop: "linear-gradient(135deg,#E0D8D0 0%,#C8C0B8 40%,#DCD4CC 70%,#B8B0A8 100%)",
  fireplace:  "linear-gradient(135deg,#8C7868 0%,#6C5848 40%,#9C8878 70%,#5C4838 100%)",
  shower:     "linear-gradient(135deg,#C8D8DC 0%,#A8C0C8 40%,#D0DDE0 70%,#90A8B0 100%)",
  tile:       "linear-gradient(135deg,#D8D0C8 0%,#B8B0A8 50%,#C8C0B8 100%)",
  stone:      "linear-gradient(135deg,#C8C4BE 0%,#A8A49E 30%,#D0CCC6 60%,#B0ACA6 100%)",
  molding:    "linear-gradient(135deg,#D8C8A8 0%,#C0A888 40%,#D4C0A0 70%,#B09878 100%)",
  fixture:    "linear-gradient(135deg,#C8C0B0 0%,#A8A098 40%,#D0C8B8 70%,#988880 100%)",
  other:      "linear-gradient(135deg,#D0CCc8 0%,#B8B4B0 50%,#C8C4C0 100%)",
};

function formatCents(cents: number, unit: string): string {
  const price = (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const unitLabels: Record<string, string> = {
    sqft: "sq ft", sqyd: "sq yd", slab: "slab", box: "box",
    piece: "pc", linearFt: "lin ft", each: "ea", hour: "hr", lump: "job",
  };
  return `${price} / ${unitLabels[unit] ?? unit}`;
}

type Material = {
  id: string; name: string; brand: string | null; style: string | null;
  color: string | null; sizeSpec: string | null; category: string;
  defaultUnit: string | null; defaultUnitPriceCents: number | null;
  images: { url: string }[];
};

export function CategoryTabs({ current, counts, styleParam }: { current: string; counts: Record<string, number>; styleParam?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  function navigate(cat: string) {
    startTransition(() => {
      const params = new URLSearchParams();
      if (cat) params.set("cat", cat);
      if (styleParam) params.set("style", styleParam);
      router.push(`${pathname}${params.size ? `?${params}` : ""}`);
    });
  }

  const tabs = [{ value: "", label: "All" }, ...Object.entries(CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))];

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
      {tabs.map((tab) => {
        const isActive = current === tab.value;
        const count = tab.value ? counts[tab.value] : Object.values(counts).reduce((a, b) => a + b, 0);
        return (
          <button
            key={tab.value}
            onClick={() => navigate(tab.value)}
            style={{
              padding: "7px 14px", borderRadius: 0, fontSize: 13, cursor: "pointer",
              border: `1px solid ${isActive ? "var(--red)" : "var(--line)"}`,
              background: isActive ? "var(--red)" : "transparent",
              color: isActive ? "var(--text-invert)" : "var(--text)",
              fontFamily: "var(--font-body)", transition: "all .15s",
            }}
          >
            {tab.label}
            {count != null && <span style={{ marginLeft: 5, opacity: 0.6, fontSize: 11 }}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function SearchBox({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) params.set("q", val); else params.delete("q");
      router.replace(`${pathname}?${params}`);
    });
  }

  return (
    <input
      type="search"
      defaultValue={defaultValue}
      onChange={handleChange}
      placeholder="Search by brand, style, color..."
      style={{
        padding: "10px 14px", borderRadius: 0, border: "1px solid var(--line)",
        fontSize: 14, width: "100%", maxWidth: 340, background: "#fff",
        color: "var(--text)", fontFamily: "var(--font-body)", outline: "none",
      }}
    />
  );
}

export function MaterialGrid({ materials }: { materials: Material[] }) {
  if (materials.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)", fontSize: 15 }}>
        No materials found. Try a different search or category.
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 24,
    }}>
      {materials.map((m) => (
        <MaterialCard key={m.id} material={m} />
      ))}
    </div>
  );
}

function MaterialCard({ material: m }: { material: Material }) {
  const swatch = CATEGORY_SWATCH[m.category] ?? CATEGORY_SWATCH.other;
  const label = CATEGORY_LABELS[m.category] ?? m.category;

  return (
    <div style={{
      border: "1px solid var(--line)", borderRadius: 0, overflow: "hidden",
      background: "#fff", display: "flex", flexDirection: "column",
    }}>
      {/* Swatch */}
      <div style={{
        height: 180, position: "relative",
        background: m.images[0]?.url ? "transparent" : swatch,
      }}>
        {m.images[0]?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.images[0].url}
            alt={m.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        <span style={{
          position: "absolute", top: 12, left: 12, fontSize: 11,
          background: "var(--text-invert-muted)", color: "var(--text-muted)",
          padding: "3px 8px", borderRadius: 0, letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          {label}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {m.brand && (
          <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
            {m.brand}
          </p>
        )}
        <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", margin: "2px 0 6px" }}>
          {m.style ?? m.name}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
          {m.color && <span>{m.color}</span>}
          {m.color && m.sizeSpec && <span>·</span>}
          {m.sizeSpec && <span>{m.sizeSpec}</span>}
        </div>
        <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
            {m.defaultUnitPriceCents && m.defaultUnit
              ? formatCents(m.defaultUnitPriceCents, m.defaultUnit)
              : "Contact for pricing"}
          </span>
          <Link
            href={`/request-a-visit?material=${encodeURIComponent(m.name)}`}
            style={{
              background: "var(--red)", color: "var(--text-invert)", fontSize: 12,
              padding: "8px 14px", textDecoration: "none", borderRadius: 0, whiteSpace: "nowrap",
            }}
          >
            Get pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
