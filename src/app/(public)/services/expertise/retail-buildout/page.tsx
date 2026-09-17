import ExpertiseArticle, { type ExpertiseSection } from "../ExpertiseArticle";

export const metadata = {
  title: "Retail Buildout",
  description: "Retail buildouts in South Orange County planned around your lease, landlord approvals, ADA and Title 24 requirements, and a fixed opening date.",
};

const SECTIONS: ExpertiseSection[] = [
  {
    heading: "Brand, Layout, and Customer Experience",
    paragraphs: [
      "Retail space has to do real work: guide customers through the store, put merchandise where it sells, support your point-of-sale and back-of-house flow, and reflect your brand the moment someone walks in. We work through layout and material selections with all of that in view, not as decoration applied after the floor plan is set.",
    ],
  },
  {
    heading: "Understanding Your Lease Before We Design",
    paragraphs: [
      "Every retail buildout starts with the lease, not the floor plan. We review the delivery condition of the space, any tenant improvement allowance and how it's disbursed, and the rent commencement terms tied to completion, so the design and construction plan is built around the real constraints of your lease from day one, not discovered partway through.",
    ],
  },
  {
    heading: "Coordinating With the Landlord",
    paragraphs: [
      "Most retail spaces come with a landlord design and construction process that runs alongside city permitting, not instead of it. We handle:",
    ],
    list: [
      { title: "Design criteria compliance.", text: "We design storefronts, signage, and exterior finishes to match the landlord's design criteria package before submitting for their approval." },
      { title: "Landlord plan approval.", text: "We track this as its own milestone in the project schedule, alongside city plan check, since the two run on separate timelines." },
      { title: "Sign permitting.", text: "We coordinate both landlord approval and the separate city sign permit required for exterior signage." },
      { title: "Base building coordination.", text: "We confirm what the space allows (tie-ins to existing HVAC, electrical capacity, and fire sprinkler systems) and what requires landlord sign-off or dedicated new systems." },
      { title: "Construction rules of conduct.", text: "We work within the landlord's requirements for work hours, loading access, and protection of common areas, and manage any required construction security deposit." },
      { title: "Required documentation.", text: "We provide the certificate of insurance, lien waivers, and as-built drawings landlords require at each stage, including before the final tenant improvement allowance is released." },
    ],
  },
  {
    heading: "Code Requirements Specific to Retail",
    paragraphs: [
      "Retail space is a public accommodation and must meet ADA and California Title 24 accessibility standards: accessible routes, parking, entrances, restrooms, point-of-sale counters, and aisle widths through merchandise displays. Mercantile occupancy also carries its own egress and fire-rated separation requirements from neighboring tenants, which are particularly relevant in a second-generation space or a change of use.",
    ],
  },
  {
    heading: "Built Around Your Opening Date",
    paragraphs: [
      "Retail projects are almost always driven by a fixed date: a lease deadline, a marketed opening, or a season you can't miss. We build the construction schedule around that date and coordinate with your other vendors (fixtures, POS, and security) so everything lands in time for opening, not after it.",
    ],
  },
];

export default function RetailBuildoutPage() {
  return (
    <ExpertiseArticle
      eyebrow="Retail Buildout"
      title="A Store Built to Open on Time, in a Space You Don't Fully Control"
      intro="A retail buildout happens inside someone else's building, on someone else's timeline. Design and layout matter, but a retail project succeeds or fails just as much on landlord coordination, lease requirements, and code compliance that has nothing to do with how the store looks. We manage all three together, from the first walkthrough through opening day."
      sections={SECTIONS}
      process="Every retail buildout follows the same Approach we use across all our work: pre-construction planning, design, coordinated project management, and delivery, adapted to the realities of building inside a leased space."
      cta="Tell us about your space, your lease, and your opening date. We'll help you understand what your buildout involves, from landlord requirements to code compliance to the practical realities of hitting your deadline, and identify a clear path forward."
    />
  );
}
