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
                borderRadius: 2, cursor: "pointer",
                background: "transparent",
                textAlign: "left", transition: "border-color .15s",
                overflow: "hidden", padding: 0,
              }}
            >
              {/* Style photo — fixed height so every card is identical */}
              <div style={{ width: "100%", height: 200, overflow: "hidden", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.image}
                  alt={preset.label}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 65%", display: "block",
                    transition: "transform .3s ease",
                    transform: hovered === key ? "scale(1.04)" : "scale(1)",
                  }}
                />
              </div>
              <div style={{ padding: "16px 18px 20px" }}>
                {/* Palette dots */}
                <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
                  {preset.palette.map((c) => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, flexShrink: 0 }} />
                  ))}
                </div>
                <div style={{ fontFamily: "var(--pub-serif)", fontSize: 17, color: "var(--pub-ink)", marginBottom: 5 }}>
                  {preset.label}
                </div>
                <p style={{ fontSize: 12, color: "var(--pub-muted)", lineHeight: 1.55, margin: 0 }}>
                  {preset.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ borderBottom: "1px solid var(--pub-line)" }} />
    </div>
  );
}
