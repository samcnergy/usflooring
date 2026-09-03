import Link from "next/link";

export const metadata = {
  title: "Showroom — US Floor Design Center",
  description: "Visit our Orange County showroom in Rancho Santa Margarita. See cabinets, countertops, flooring, tile, and fixtures in person before you decide.",
};

const WHAT_TO_EXPECT = [
  {
    heading: "See every material in person",
    body: "The showroom carries the full catalog — cabinets, countertops, flooring, tile, fixtures, and finish hardware. Every product is displayed as an installed sample, not a chip or a swatch.",
  },
  {
    heading: "Bring your plans or just your ideas",
    body: "You do not need drawings to visit. If you have measurements, bring them. If you just have photos of what you want to change, that is enough to have a useful conversation.",
  },
  {
    heading: "Walk in or schedule ahead",
    body: "Walk-ins are welcome during showroom hours. If you want dedicated time with one of our designers — no interruptions, a proper assessment, material recommendations — book a showroom discovery appointment.",
  },
  {
    heading: "Samples to take home",
    body: "You can borrow physical samples from the showroom to see how materials look under your own lighting before committing. A sample deposit is refunded when the sample is returned.",
  },
];

const BRING_LIST = [
  "Photos of the existing space",
  "Room dimensions if you have them (not required)",
  "Inspiration photos — a screenshot or magazine clipping is fine",
  "Your honest budget range — it helps us show you the right options",
  "Any HOA restrictions if applicable",
];

export default function ShowroomPage() {
  return (
    <div>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--pub-line)", background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 56px" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>Showroom</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h1 style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 48,
                lineHeight: 1.15, color: "var(--pub-ink)", maxWidth: "13ch",
              }}>
                Come see it before you decide.
              </h1>
              <div>
                <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.7, maxWidth: "42ch", marginBottom: 28 }}>
                  Most material decisions look different under real lighting, next to real finishes, at full scale. Our showroom exists so you can see what you are actually buying before anything is ordered.
                </p>
                <Link href="/request-a-visit" style={{
                  display: "inline-block",
                  background: "var(--pub-forest)", color: "var(--pub-stone)",
                  fontSize: 14, padding: "14px 26px", textDecoration: "none", borderRadius: 2,
                }}>
                  Book a showroom appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location and hours */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48, padding: "56px 0" }}>

            <div>
              <div style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                Address
              </div>
              <p style={{ fontFamily: "var(--pub-serif)", fontSize: 20, color: "var(--pub-ink)", lineHeight: 1.5, margin: 0 }}>
                Rancho Santa Margarita<br />
                Orange County, CA
              </p>
              <p style={{ fontSize: 14, color: "var(--pub-muted)", marginTop: 10, lineHeight: 1.6 }}>
                Free parking in the lot.<br />
                Accessible entrance at the main door.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                Showroom hours
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { days: "Monday – Friday", hours: "9:00 am – 5:30 pm" },
                  { days: "Saturday", hours: "10:00 am – 4:00 pm" },
                  { days: "Sunday", hours: "Closed" },
                ].map((row) => (
                  <div key={row.days} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "var(--pub-ink)" }}>{row.days}</span>
                    <span style={{ color: row.hours === "Closed" ? "var(--pub-muted)" : "var(--pub-ink)" }}>{row.hours}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--pub-muted)", marginTop: 14, lineHeight: 1.55 }}>
                Hours may vary on holidays. Call ahead to confirm.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                Contact
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
                <a href="tel:+1" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Call the showroom</a>
                <a href="mailto:info@usfloordesign.com" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>info@usfloordesign.com</a>
              </div>
              <div style={{ marginTop: 20 }}>
                <Link href="/request-a-visit" style={{
                  display: "inline-block",
                  border: "1px solid var(--pub-ink)", color: "var(--pub-ink)",
                  fontSize: 13, padding: "10px 18px", textDecoration: "none", borderRadius: 2,
                }}>
                  Book an appointment
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* What to expect */}
      <div style={{ background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>What to expect</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 64, alignItems: "start" }}>
              <h2 style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 32,
                color: "var(--pub-ink)", lineHeight: 1.3,
              }}>
                A working showroom, not a sales floor.
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {WHAT_TO_EXPECT.map((item) => (
                  <div key={item.heading} style={{
                    padding: "24px", background: "#fff",
                    border: "1px solid var(--pub-line)", borderRadius: 2,
                  }}>
                    <div style={{ fontFamily: "var(--pub-serif)", fontSize: 17, color: "var(--pub-ink)", marginBottom: 10, lineHeight: 1.35 }}>
                      {item.heading}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--pub-muted)", lineHeight: 1.65, margin: 0 }}>
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What to bring */}
      <div style={{ background: "#fff", borderTop: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>Before you visit</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 16 }}>
                Useful to bring. None of it required.
              </h2>
              <p style={{ fontSize: 15, color: "var(--pub-muted)", lineHeight: 1.7, maxWidth: "36ch" }}>
                Walk-ins are welcome. If you want to get the most out of an hour in the showroom, these help our designers give you more specific direction.
              </p>
            </div>
            <div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
                {BRING_LIST.map((item) => (
                  <li key={item} style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    padding: "16px 20px", border: "1px solid var(--pub-line)", borderRadius: 2,
                    fontSize: 15, color: "var(--pub-ink)", lineHeight: 1.45,
                  }}>
                    <span style={{ color: "var(--pub-brass)", flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
