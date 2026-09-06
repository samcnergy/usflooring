"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const SAMPLE_OPTIONS = [
  { key: "order", label: "Order a sample", desc: "A 4×4 inch sample shipped to your address. $5, credited against purchase." },
  { key: "borrow", label: "Borrow a showroom sample", desc: "Take a full showroom sample home for up to 7 days. Refundable deposit required." },
  { key: "board", label: "Designer material board", desc: "Have a designer curate a sample box matched to your project brief. Complimentary with a planning appointment." },
];

const SHIPPING_POLICY = [
  {
    q: "Freight or local delivery?",
    a: "Orders over 100 sq ft or any order containing large-format tile (24×24 or larger) ship via freight carrier. All other orders are handled by our local delivery team within a 60-mile radius of Rancho Santa Margarita. Freight delivery timelines are longer and charges differ - pricing is shown at checkout.",
  },
  {
    q: "Curbside or inside delivery?",
    a: "Our local delivery includes inside delivery to the first dry interior space at no additional charge. Freight carriers deliver curbside only - you are responsible for moving product from the delivery point.",
  },
  {
    q: "What to do when the order arrives?",
    a: "Inspect all cartons before signing the delivery receipt. Count boxes, check for visible damage, and open one carton to verify product condition. Do not refuse delivery unless damage is severe - instead, note the damage on the receipt and contact us within 48 hours.",
  },
  {
    q: "Damage claim deadline?",
    a: "Damage claims must be submitted within 48 hours of delivery. Claims submitted after this window cannot be processed with the carrier. Email info@usfloordesign.com with photos and your order number.",
  },
  {
    q: "Restocking fees?",
    a: "Unopened, undamaged product in original packaging may be returned within 30 days for a 15% restocking fee. Opened product is not eligible for return unless the material is defective.",
  },
  {
    q: "Can opened boxes be returned?",
    a: "No. Once a carton is opened, it cannot be returned. We recommend ordering samples before purchasing full quantities.",
  },
  {
    q: "Natural stone - is variation a defect?",
    a: "No. Variation in color, veining, and surface texture is an inherent characteristic of natural stone and is not considered a defect. Order a sample and review the full lot before purchasing.",
  },
  {
    q: "Are special orders final?",
    a: "Yes. Special-order products - those not stocked in our standard inventory - are final sale. They cannot be returned or exchanged once ordered.",
  },
  {
    q: "What about surplus tile?",
    a: "We recommend purchasing 10–15% overage for cuts and future repairs. Surplus tile that matches your lot number can sometimes be returned (unopened, within 90 days) - contact us before returning.",
  },
];

const MOCK_PRODUCT = {
  name: "Bianco Venatino Marble Tile",
  sku: "MRB-BV-2424",
  category: "Tile",
  price: 24.5,
  unit: "sq ft",
  coverage: "Each tile covers 4 sq ft",
  availability: "In stock",
  leadTime: "Ships within 3–5 business days",
  description: "Italian Bianco Venatino marble with fine grey veining on a white field. Suitable for flooring, walls, shower surrounds, and countertops. Each slab is hand-selected for consistency; natural variation is expected.",
  specs: [
    { label: "Size", value: "24 × 24 inches" },
    { label: "Thickness", value: "3/8 inch (10mm)" },
    { label: "Finish", value: "Polished" },
    { label: "Material", value: "Natural stone - Italian marble" },
    { label: "Use", value: "Floor and wall, interior" },
    { label: "Slip resistance (wet)", value: "COF 0.42 - suitable for wet areas with appropriate sealer" },
    { label: "PEI rating", value: "N/A (stone)" },
  ],
  care: [
    "Seal before installation and annually thereafter.",
    "Clean with a pH-neutral stone cleaner - avoid vinegar, bleach, or acidic products.",
    "Wipe spills immediately; marble is porous and will stain if left wet.",
    "Do not use abrasive pads or steam cleaners.",
  ],
  installation: [
    "Install on a flat, structurally sound substrate (deflection ≤ L/360).",
    "Use a white polymer-modified thinset mortar.",
    "Back-butter each tile for full coverage.",
    "Grout with a non-sanded grout - 1/16 to 1/8 inch joint recommended.",
    "Allow full cure before grouting (24 hours minimum).",
  ],
  coordinating: [
    { label: "Bianco Venatino 12×24", sku: "MRB-BV-1224" },
    { label: "Bianco Venatino Hex Mosaic", sku: "MRB-BV-HEX" },
    { label: "Carrara White 24×24", sku: "MRB-CW-2424" },
    { label: "Arabescato Marble 12×12", sku: "MRB-AR-1212" },
  ],
};

export default function ProductDetailPage() {
  const params = useParams();
  const product = MOCK_PRODUCT;

  const [sqft, setSqft] = useState(100);
  const wasteFactor = 1.12;
  const recommended = Math.ceil(sqft * wasteFactor);
  const total = (recommended * product.price).toFixed(2);

  const [sampleOpen, setSampleOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const [openPolicy, setOpenPolicy] = useState<number | null>(null);

  const [tab, setTab] = useState<"specs" | "care" | "install" | "shipping">("specs");

  return (
    <div>

      {/* Breadcrumb */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "14px 0", fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 8, alignItems: "center" }}>
            <Link href="/shop" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Shop</Link>
            <span>›</span>
            <span style={{ color: "var(--text)" }}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main product layout */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, padding: "56px 0" }}>

            {/* Left - image placeholder */}
            <div>
              <div style={{
                width: "100%", aspectRatio: "1 / 1",
                background: "linear-gradient(135deg, #E8E4DD 0%, #D6CFC4 60%, #C9C0B3 100%)",
                borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Product image</span>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{
                    width: 64, height: 64,
                    background: "linear-gradient(135deg, #E8E4DD, #C9C0B3)",
                    borderRadius: 0, border: "1px solid var(--line)", cursor: "pointer",
                  }} />
                ))}
              </div>
            </div>

            {/* Right - details */}
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                {product.category} · {product.sku}
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 32, color: "var(--text)", lineHeight: 1.2, marginBottom: 16 }}>
                {product.name}
              </h1>
              <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.45, marginBottom: 24 }}>
                {product.description}
              </p>

              {/* Price */}
              <div style={{ marginBottom: 28, padding: "18px 20px", border: "1px solid var(--line)", borderRadius: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)" }}>${product.price.toFixed(2)}</span>
                    <span style={{ fontSize: 14, color: "var(--text-muted)", marginLeft: 6 }}>per {product.unit}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--red)", fontWeight: 500 }}>
                    {product.availability}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  {product.coverage} · {product.leadTime}
                </div>
              </div>

              {/* Coverage calculator */}
              <div style={{ marginBottom: 24, padding: "20px", background: "var(--surface)", borderRadius: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
                  Coverage calculator
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <label style={{ fontSize: 14, color: "var(--text)", flexShrink: 0 }}>Room size (sq ft)</label>
                  <input
                    type="number"
                    min={1}
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    style={{
                      width: 90, padding: "8px 12px",
                      border: "1px solid var(--line)", borderRadius: 0,
                      fontSize: 15, textAlign: "right", background: "#fff",
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--text-muted)" }}>Recommended (12% waste): <strong style={{ color: "var(--text)" }}>{recommended} sq ft</strong></span>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>${total}</span>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Link href="/request-a-visit?type=order" style={{
                  display: "block", textAlign: "center",
                  background: "var(--red)", color: "var(--text-invert)",
                  fontSize: 15, padding: "15px 24px", textDecoration: "none", borderRadius: 0,
                }}>
                  Request a quote
                </Link>

                <button
                  onClick={() => setSampleOpen(!sampleOpen)}
                  style={{
                    background: "#fff", color: "var(--text)",
                    border: "1px solid var(--line)", borderRadius: 0,
                    fontSize: 14, padding: "13px 24px", cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Order a sample
                </button>

                {sampleOpen && (
                  <div style={{ border: "1px solid var(--line)", borderRadius: 0, overflow: "hidden" }}>
                    {SAMPLE_OPTIONS.map((opt) => (
                      <div
                        key={opt.key}
                        onClick={() => setSelectedSample(opt.key)}
                        style={{
                          padding: "16px 18px", cursor: "pointer",
                          background: selectedSample === opt.key ? "var(--surface)" : "#fff",
                          borderBottom: "1px solid var(--line)",
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{opt.desc}</div>
                      </div>
                    ))}
                    {selectedSample && (
                      <div style={{ padding: "14px 18px", background: "var(--surface)", display: "flex", justifyContent: "flex-end" }}>
                        <Link href={`/request-a-visit?type=sample&product=${params.id}&option=${selectedSample}`} style={{
                          background: "var(--red)", color: "var(--text-invert)",
                          fontSize: 13, padding: "10px 20px", textDecoration: "none", borderRadius: 0,
                        }}>
                          Continue
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <Link href="/request-a-visit?type=designer" style={{
                  display: "block", textAlign: "center",
                  color: "var(--text-muted)", fontSize: 13, textDecoration: "none",
                  padding: "10px 0",
                }}>
                  Ask a designer about this product →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab section: Specs / Care / Install / Shipping */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>

          {/* Tab nav */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--line)", gap: 0 }}>
            {(["specs", "care", "install", "shipping"] as const).map((t) => {
              const labels = { specs: "Specifications", care: "Care and cleaning", install: "Installation notes", shipping: "Shipping and returns" };
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    background: "none", border: "none", borderBottom: tab === t ? "2px solid var(--text)" : "2px solid transparent",
                    padding: "20px 24px", cursor: "pointer",
                    fontSize: 14, color: tab === t ? "var(--text)" : "var(--text-muted)",
                    fontFamily: "var(--font-body)", fontWeight: tab === t ? 600 : 400,
                    marginBottom: -1,
                  }}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div style={{ padding: "48px 0" }}>
            {tab === "specs" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 800 }}>
                {product.specs.map((s) => (
                  <div key={s.label} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-muted)", minWidth: 140, flexShrink: 0 }}>{s.label}</span>
                    <span style={{ fontSize: 14, color: "var(--text)" }}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === "care" && (
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14, maxWidth: 680 }}>
                {product.care.map((item) => (
                  <li key={item} style={{ display: "flex", gap: 14, alignItems: "flex-start", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.45 }}>
                    <span style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {tab === "install" && (
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14, maxWidth: 680 }}>
                {product.installation.map((item) => (
                  <li key={item} style={{ display: "flex", gap: 14, alignItems: "flex-start", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.45 }}>
                    <span style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 2 }}>·</span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {tab === "shipping" && (
              <div style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: 0 }}>
                {SHIPPING_POLICY.map((item, i) => (
                  <div key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                    <button
                      onClick={() => setOpenPolicy(openPolicy === i ? null : i)}
                      style={{
                        width: "100%", textAlign: "left", background: "none", border: "none",
                        padding: "18px 0", cursor: "pointer",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text)", fontWeight: 500,
                      }}
                    >
                      {item.q}
                      <span style={{ color: "var(--text-muted)", fontSize: 18, lineHeight: 1 }}>
                        {openPolicy === i ? "−" : "+"}
                      </span>
                    </button>
                    {openPolicy === i && (
                      <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.45, margin: "0 0 18px" }}>
                        {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coordinating products */}
      <div style={{ background: "#fff", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "56px 0" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Coordinates with</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {product.coordinating.map((c) => (
                <Link href={`/shop/${c.sku.toLowerCase()}`} key={c.sku} style={{
                  textDecoration: "none", border: "1px solid var(--line)", borderRadius: 0,
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: 120,
                    background: "linear-gradient(135deg, #E8E4DD, #C9C0B3)",
                  }} />
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4, lineHeight: 1.35 }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.sku}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
