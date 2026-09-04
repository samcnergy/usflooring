"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STYLE_PRESETS } from "./stylePresets";

export function StyleQuiz() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ padding: "56px 0 0" }}>
      <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>Find your style</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 48, alignItems: "start", marginBottom: 48 }}>
        <div>
          <h2 style={{
            fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 32,
            color: "var(--pub-ink)", lineHeight: 1.25, marginBottom: 14,
          }}>
            What direction are you thinking?
          </h2>
          <p style={{ fontSize: 15, color: "var(--pub-muted)", lineHeight: 1.65, maxWidth: "36ch" }}>
            Pick the style closest to what you have in mind. We will show you the materials that fit it best - and our designers can help narrow it down further in the showroom.
          </p>
          <a href="/shop?browse=1" onClick={(e) => { e.preventDefault(); router.push("/shop?browse=1"); }} style={{
            display: "inline-block", marginTop: 20,
            fontSize: 13, color: "var(--pub-muted)",
            borderBottom: "1px solid var(--pub-line)", paddingBottom: 2,
            textDecoration: "none",
          }}>
            Skip - browse everything
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => router.push(`/shop?style=${key}`)}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                border: `1px solid ${hovered === key ? "var(--pub-ink)" : "var(--pub-line)"}`,
                borderRadius: 2, padding: "24px 22px", cursor: "pointer",
                background: hovered === key ? "rgba(30,35,32,0.04)" : "transparent",
                textAlign: "left", transition: "border-color .15s, background .15s",
              }}
            >
              {/* Palette dots */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {preset.palette.map((c) => (
                  <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{ fontFamily: "var(--pub-serif)", fontSize: 19, color: "var(--pub-ink)", marginBottom: 6 }}>
                {preset.label}
              </div>
              <p style={{ fontSize: 13, color: "var(--pub-muted)", lineHeight: 1.55, margin: 0 }}>
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>
      <div style={{ borderBottom: "1px solid var(--pub-line)" }} />
    </div>
  );
}
