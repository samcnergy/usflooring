import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "2027 Interior Design Trends | US Floor Design Center",
  description: "Discover the 2027 interior design trends shaping Orange County homes - from natural wood kitchens and tactile tile to wellness baths and collected interiors.",
};

const TRENDS = [
  {
    n: "01",
    title: "Design for a Feeling, Not Just a Look",
    body: "In 2027, wellness is moving beyond spa accessories and into the way a room is planned. Deep seating, softer shapes, warm light, natural materials and easier circulation can make a home feel calmer before any decorative layer is added. Comfort is becoming visible: chairs invite you to stay, a reading corner earns real space, and a bathroom is planned around an unhurried routine rather than a checklist of fixtures.\n\nThis approach also makes design more personal. Instead of copying a complete style, homeowners can begin with the feeling they want - grounded, energized, social or serene - and use that as a filter for layout, color, texture and lighting.",
    takeaway: "Define three words for how each room should feel before selecting finishes. Those words become a practical decision tool when dozens of tile, flooring and cabinet options compete for attention.",
  },
  {
    n: "02",
    title: "The “Quiet Kitchen” Replaces Visual Clutter",
    body: "The so-called anti-kitchen does not eliminate the kitchen; it makes its hardworking parts less dominant. Integrated appliances, appliance garages, concealed charging, furniture-style cabinetry and disciplined storage help the main room read as calm architecture rather than a wall of equipment.\n\nWhere space allows, a scullery or back kitchen can hold small appliances, pantry goods and prep mess. In a smaller footprint, the same effect can come from full-height storage, fewer counter interruptions and cabinet interiors planned around specific tools. The best version is not empty minimalism. It is a warm, highly functional room whose visual order is supported by thoughtful storage.",
    takeaway: "A successful quiet kitchen begins with an inventory. Plan where the coffee maker, mixer, recycling, pet supplies and countertop devices will live before cabinet drawings are finalized.",
  },
  {
    n: "03",
    title: "Natural Wood Kitchens Gain Depth and Character",
    body: "Painted cabinetry remains useful, but wood grain is returning as a central design feature. Medium and deeper wood tones add warmth, age gracefully and connect easily to stone, porcelain and metal. The 2027 version feels tailored rather than rustic: clean profiles, carefully matched grain, expressive islands and furniture-like details.\n\nWood does not have to cover every surface. A wood island can soften painted perimeter cabinets; a paneled pantry wall can add continuity; or a darker vanity can create contrast in a light bathroom. The key is to coordinate undertones across cabinetry, floors and countertops so the materials feel intentional together.",
    takeaway: "View cabinet, flooring and countertop samples together in both daylight and evening light. Orange County's strong natural light can reveal undertones that are easy to miss under showroom lighting.",
  },
  {
    n: "04",
    title: "Texture Becomes the New Neutral",
    body: "Flat, featureless surfaces are giving way to materials that reward a closer look. Visible wood grain, honed or textured stone, tactile ceramic, linen-like surfaces and brushed metal add richness without requiring a loud pattern. This is especially effective in neutral rooms, where texture creates depth while the palette remains calm.\n\nContrast matters as much as the individual material. A glossy tile beside a matte wall, polished stone against open-grain wood, or a brushed metal fixture against handmade ceramic creates subtle tension. Gloss is returning, but usually in controlled doses rather than across every surface.",
    takeaway: "Use the most durable texture where hands, water and traffic are highest. Confirm cleanability, slip resistance, sealing requirements and sun exposure before choosing a finish solely for its appearance.",
  },
  {
    n: "05",
    title: "Bathrooms Become Immersive Architectural Retreats",
    body: "Bathrooms are being treated as complete environments instead of collections of unrelated fixtures. Continuous surface treatments, large-format porcelain, coordinated wall and floor finishes, sculptural basins and carefully placed lighting can make even a compact bath feel composed. In more dramatic rooms, one color or material may wrap multiple surfaces to create an enveloping effect.\n\nWellness remains central, but the focus is practical: a generous shower, a comfortable tub where space supports it, warm surfaces, useful niches, flattering light and effective ventilation. Visual simplicity depends on technical precision behind the finish - especially waterproofing, drainage, substrate preparation and transitions.",
    takeaway: "Choose the waterproofing and tile assembly as carefully as the visible tile. For wet rooms, ask about slip resistance, grout maintenance, ventilation, access panels and how every edge will terminate before installation begins.",
  },
  {
    n: "06",
    title: "Small-Format Tile Makes a Graphic Return",
    body: "Large-format slabs continue to create calm, low-joint surfaces, but 2027 also makes room for the opposite: small squares, slender strips, mosaics and checkerboard arrangements. These formats bring rhythm, craftsmanship and scale to showers, backsplashes, powder rooms and fireplace surrounds.\n\nGrout becomes part of the composition. A close color match creates a soft field; contrast emphasizes geometry. The smartest applications use pattern strategically, allowing it to define a focal area rather than forcing every surface to compete.",
    takeaway: "Mock up the tile with the actual grout color before approval. Small formats create more grout lines, so maintenance expectations, joint consistency and installer skill matter as much as the tile itself.",
  },
  {
    n: "07",
    title: "Warm Mineral Colors Meet Confident Accents",
    body: "The emerging palette begins with earth: clay, sand, cocoa, muted terracotta, olive and softened green. These tones feel grounded and work naturally with wood and stone. Alongside them, concentrated accents - inky blue, teal, lavender, beetroot and electric blue - bring energy without turning the entire home into a color experiment.\n\nColor drenching can make a small room feel intentional by carrying one family of color across walls, trim, cabinetry or ceiling. In open plans, color can also define a zone without adding a wall. The most enduring schemes balance expressive color with materials that already contain natural variation.",
    takeaway: "Put long-life colors in materials you genuinely love and use easier-to-change surfaces for experiments. Cabinet interiors, powder rooms, paint, art and textiles are lower-risk places for a bolder forecast color.",
  },
  {
    n: "08",
    title: "Curves and Sculptural Forms Soften the Floor Plan",
    body: "Rounded seating, organic tables, curved chair backs and sculpted casework are continuing because they do more than signal a style: they soften circulation and make rooms feel less rigid. Oversized, deeply cushioned seating reinforces the comfort-first direction, while an artful table or vanity can give a practical object a memorable silhouette.\n\nThe goal is not to make every piece curved. A few rounded forms are most effective against straighter architecture. Sculptural lighting can provide the same sense of movement overhead, using materials such as ceramic, metal, stone or glass to add another tactile layer.",
    takeaway: "Protect walkways and furniture clearances first. In tighter rooms, one curved coffee table, pendant or vanity edge can provide the effect without sacrificing usable space.",
  },
  {
    n: "09",
    title: "Homes Make More Room for Connection and Ritual",
    body: "Design forecasts are putting renewed emphasis on game tables, statement dining tables, home lounges and dedicated beverage stations. The common purpose is connection. These spaces turn ordinary routines - morning coffee, family games, dinner with friends - into activities the floor plan actively supports.\n\nAn underused formal room can become a comfortable lounge or library without a major addition. A coffee or wellness bar can reduce traffic through the main work zone of a kitchen. Flexible tables and movable seating allow one room to support quiet weekdays and larger gatherings.",
    takeaway: "Before adding square footage, identify rooms or corners that are rarely used. A lighting change, built-in storage, durable flooring and purpose-specific furniture may create more daily value than a larger footprint.",
  },
  {
    n: "10",
    title: "Collected Interiors Replace the Showroom Set",
    body: "Matching every item is giving way to rooms that feel assembled over time. Vintage pieces, contemporary forms, restored millwork, handmade ceramics and family objects can coexist when color, scale or material provides a connecting thread. This is a more forgiving approach and often a more sustainable one because it begins with what is worth keeping.\n\nCraftsmanship becomes the luxury signal. A well-resolved cabinet edge, a custom railing, a carefully laid tile pattern or a beautiful lighting detail can matter more than an abundance of decoration. These elements give a renovation identity and reward daily use.",
    takeaway: "Start every remodel with a keep, relocate and replace review. Designing around meaningful pieces prevents a generic result and can focus the budget on construction details that are difficult to add later.",
  },
  {
    n: "11",
    title: "Flexible Foundations Make Homes Future-Ready",
    body: "Adaptability is becoming a design feature rather than an afterthought. Modular seating, nesting tables, layered lighting, flexible rooms and accessible circulation help a home respond to guests, work, hobbies and changing family needs. The foundation should remain coherent even as movable elements change.\n\nFor renovations, future-ready thinking includes sufficient electrical capacity, useful outlets, storage that can change purpose, durable continuous flooring and layouts that reduce unnecessary obstacles. These choices are less visible than a trend color, but they often produce the greatest long-term satisfaction.",
    takeaway: "Ask how the room may need to work in five or ten years. Planning power, lighting, blocking, door widths and flooring transitions during construction is easier than retrofitting them later.",
  },
];

export default function Trends2027Page() {
  return (
    <div>

      {/* Full-width hero image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/7", overflow: "hidden" }}>
        <Image
          src="/blog-2027-hero.png"
          alt="Orange County kitchen and living room - 2027 design trends by US Floor Design Center"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(30,35,32,0.55) 0%, rgba(30,35,32,0.1) 60%, transparent 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 48, left: 0, right: 0, maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ fontSize: 12, color: "rgba(241,238,231,0.7)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            2027 Design Forecast · Orange County, California
          </div>
          <h1 style={{
            fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 52,
            color: "#F1EEE7", lineHeight: 1.1, maxWidth: "14ch", margin: 0,
          }}>
            2027 Interior Design Trends
          </h1>
          <p style={{ color: "rgba(241,238,231,0.8)", fontSize: 16, marginTop: 12, fontStyle: "italic" }}>
            A more personal, comfortable and enduring home
          </p>
        </div>
      </div>

      {/* Byline + intro */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "48px 0 0", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--pub-line)" }}>
                <span style={{ fontSize: 13, color: "var(--pub-muted)" }}>By US Floor Design Center</span>
                <span style={{ color: "var(--pub-line)" }}>·</span>
                <span style={{ fontSize: 13, color: "var(--pub-muted)" }}>2027 Design Forecast</span>
                <span style={{ color: "var(--pub-line)" }}>·</span>
                <span style={{ fontSize: 13, color: "var(--pub-muted)" }}>Orange County, CA</span>
              </div>
              <p style={{ fontFamily: "var(--pub-serif)", fontSize: 20, color: "var(--pub-ink)", lineHeight: 1.75, marginBottom: 20 }}>
                The defining design story of 2027 is not one color, material or furniture shape. It is a shift away from perfectly staged rooms and toward homes that feel restorative, expressive, adaptable and built for real life.
              </p>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8, marginBottom: 48 }}>
                This forecast synthesizes ideas appearing across four 2027 design reports and translates them into practical decisions for kitchens, bathrooms, flooring and whole-home renovations in Orange County. Trends are a source of direction - not a requirement to replace everything you already love.
              </p>
            </div>
            {/* Jump links */}
            <div style={{ paddingTop: 56 }}>
              <div style={{ position: "sticky", top: 24 }}>
                <div style={{ fontSize: 11, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>In this article</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {TRENDS.map((t) => (
                    <a key={t.n} href={`#trend-${t.n}`} style={{
                      fontSize: 13, color: "var(--pub-muted)", textDecoration: "none",
                      lineHeight: 1.5, display: "flex", gap: 8,
                    }}>
                      <span style={{ color: "var(--pub-brass)", flexShrink: 0 }}>{t.n}</span>
                      {t.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend articles */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ maxWidth: 760 }}>
            {TRENDS.map((trend, i) => (
              <div key={trend.n} id={`trend-${trend.n}`} style={{
                padding: "64px 0",
                borderBottom: i < TRENDS.length - 1 ? "1px solid var(--pub-line)" : "none",
              }}>
                <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 10, letterSpacing: "0.06em" }}>
                  {trend.n}
                </div>
                <h2 style={{
                  fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 28,
                  color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 24,
                }}>
                  {trend.title}
                </h2>
                {trend.body.split("\n\n").map((para, j) => (
                  <p key={j} style={{
                    fontSize: 16, color: "#4B4A45", lineHeight: 1.8,
                    margin: 0, marginBottom: 18,
                  }}>
                    {para}
                  </p>
                ))}
                {/* Takeaway callout */}
                <div style={{
                  marginTop: 28, padding: "20px 24px",
                  borderLeft: "3px solid var(--pub-brass)",
                  background: "var(--pub-stone)",
                }}>
                  <div style={{ fontSize: 11, color: "var(--pub-brass)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                    Orange County takeaway
                  </div>
                  <p style={{ fontSize: 15, color: "var(--pub-ink)", lineHeight: 1.7, margin: 0 }}>
                    {trend.takeaway}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Closing section */}
      <div style={{ background: "var(--pub-stone)", borderTop: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ maxWidth: 760, padding: "64px 0" }}>
            <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 20 }}>
              How to use 2027 trends without dating your remodel.
            </h2>
            <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8, marginBottom: 16 }}>
              A trend is most valuable when it helps you recognize a lasting preference. If you have always loved natural wood, tactile tile or rooms designed for conversation, 2027 offers new ways to express that preference. If a glossy finish or dramatic color only appeals because it is suddenly everywhere, test it in a smaller, reversible application first.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, margin: "32px 0" }}>
              <div style={{ padding: "24px", background: "#fff", border: "1px solid var(--pub-line)", borderRadius: 2 }}>
                <div style={{ fontFamily: "var(--pub-serif)", fontSize: 17, color: "var(--pub-ink)", marginBottom: 10 }}>Invest for the long term</div>
                <p style={{ fontSize: 14, color: "var(--pub-muted)", lineHeight: 1.7, margin: 0 }}>
                  Layout, cabinetry construction, waterproofing, flooring performance, lighting, ventilation, storage and well-selected natural materials. These decisions shape how the home works and are expensive to redo.
                </p>
              </div>
              <div style={{ padding: "24px", background: "#fff", border: "1px solid var(--pub-line)", borderRadius: 2 }}>
                <div style={{ fontFamily: "var(--pub-serif)", fontSize: 17, color: "var(--pub-ink)", marginBottom: 10 }}>Experiment with confidence</div>
                <p style={{ fontSize: 14, color: "var(--pub-muted)", lineHeight: 1.7, margin: 0 }}>
                  Paint, hardware, decorative tile moments, lamps, textiles, movable furniture and artwork. These layers can evolve without dismantling the architecture of the room.
                </p>
              </div>
            </div>
            <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8 }}>
              The best forecast for 2027 is not that every home will look the same. It is that more homes will feel specific to the people who live in them: calmer where rest matters, more generous where people gather, more tactile where materials are touched, and more thoughtful about what deserves to last.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--pub-ink)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--pub-serif)", fontSize: 28, color: "var(--pub-stone)", fontWeight: 400, lineHeight: 1.3, marginBottom: 12 }}>
                Ready to plan your 2027 remodel?
              </p>
              <p style={{ fontSize: 15, color: "rgba(241,238,231,0.65)", lineHeight: 1.7, maxWidth: "44ch" }}>
                Visit our showroom in Rancho Santa Margarita or schedule a design consultation to begin your kitchen, bathroom, flooring or whole-home project.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/request-a-visit" style={{
                display: "inline-block",
                background: "var(--pub-stone)", color: "var(--pub-forest)",
                fontSize: 14, fontWeight: 500, padding: "14px 26px",
                textDecoration: "none", borderRadius: 2,
              }}>
                Schedule a consultation
              </Link>
              <Link href="/showroom" style={{
                display: "inline-block",
                background: "transparent", color: "var(--pub-stone)",
                border: "1px solid rgba(241,238,231,0.3)",
                fontSize: 14, padding: "14px 26px",
                textDecoration: "none", borderRadius: 2,
              }}>
                Visit the showroom
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
