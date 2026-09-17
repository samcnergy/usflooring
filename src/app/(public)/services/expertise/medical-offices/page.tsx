import ExpertiseArticle, { type ExpertiseSection } from "../ExpertiseArticle";

export const metadata = {
  title: "Medical Offices",
  description: "Design-build for medical offices in South Orange County, with federal ADA and California accessibility requirements, code, and phased work around an active practice planned from the start.",
};

const SECTIONS: ExpertiseSection[] = [
  {
    heading: "What a Medical Office Project Requires",
    paragraphs: [
      "Exam rooms, reception areas, and treatment spaces each carry their own layout and code considerations. An exam room needs clearances that work for patients using mobility devices, not just the equipment inside it. A reception counter needs an accessible section. Parking, entrances, and paths of travel all have to connect into a single accessible route from the street to the chair. We build these details into the design from the start, rather than treating them as a checklist to satisfy at the end.",
    ],
  },
  {
    heading: "How We Approach Accessibility and Code Compliance",
    paragraphs: [
      "California applies its own accessibility standards on top of the federal ADA, and the two don't always match. Where they differ, we build to whichever standard provides greater access, because that is what the law requires. This covers exam room clearances and turning space, accessible parking and signage, entrances and door hardware, reception counters, and restroom fixtures.",
      "We also coordinate a Certified Access Specialist (CASp) inspection as part of a medical office project when appropriate. A CASp inspection gives a practice owner documented, third-party confirmation that the space meets applicable standards. That is a meaningful protection in a state where accessibility compliance is actively enforced and litigated.",
    ],
  },
  {
    heading: "Working Within Your Practice",
    paragraphs: [
      "Medical offices rarely have the luxury of starting from an empty shell. Many medical office projects happen around an active practice, with phased work, protected patient areas, and a schedule built around your hours, not ours. We plan access, noise, and dust containment as part of the project plan, not as an afterthought once work has started.",
    ],
  },
];

export default function MedicalOfficesPage() {
  return (
    <ExpertiseArticle
      eyebrow="Medical Offices"
      title="A Practice Space Built for Patients, Staff, and Code"
      intro="A medical office has to work harder than most commercial spaces. It needs to feel calm and professional for patients, function efficiently for staff, and meet accessibility and building code requirements that don't apply to a typical retail buildout. We design and build medical office spaces with all three in view from the first conversation."
      sections={SECTIONS}
      process="Every medical office project follows the same Approach we use across all our work: pre-construction planning, design, coordinated project management, and delivery, adapted to the specific requirements of a clinical space."
      cta="Tell us about your practice, your space, and your timeline. We'll help you understand what your project involves, from layout and accessibility requirements to the practical realities of building around a working office, and identify a clear path forward."
    />
  );
}
