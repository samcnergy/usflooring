import ExpertiseArticle, { type ExpertiseSection } from "../ExpertiseArticle";

export const metadata = {
  title: "Kitchen Remodel",
  description: "Kitchen remodels in South Orange County planned around how you use the space: layout first, the systems behind the walls, function-first design, and a clear budget and schedule.",
};

const SECTIONS: ExpertiseSection[] = [
  {
    heading: "Layout Before Finishes",
    paragraphs: [
      "We begin with workflow, not a mood board. The classic work triangle (sink, stove, and refrigerator) still holds for many kitchens, and larger kitchens often benefit from distinct work zones for prep, cooking, cleanup, and storage. Getting this right early is what prevents the most expensive kind of change order: moving a sink or a range mid-project because the layout wasn't tested first.",
    ],
  },
  {
    heading: "What's Behind the Walls Matters as Much as What's on Them",
    paragraphs: [
      "Electrical capacity, plumbing lines, ventilation, and any structural changes, such as removing a wall or adding an island, get reviewed at the planning stage, not discovered during demolition. In Orange County's older housing stock, that review also means checking for outdated wiring, plumbing, or hidden moisture damage before it becomes a surprise mid-project.",
    ],
  },
  {
    heading: "Function-First Design",
    paragraphs: [
      "Storage, lighting, and ventilation are where a kitchen either works for daily life or doesn't. We plan closed storage (drawers, pull-out pantries, and deep cabinets) before any open shelving, since open shelving photographs well but rarely functions as real storage. We layer lighting across ambient, task, and accent rather than relying on a single overhead fixture. And ventilation gets planned around your actual appliances and their clearances, not added as an afterthought once the layout is set.",
    ],
  },
  {
    heading: "Where to Invest, and Where Not To",
    paragraphs: [
      "Cabinets, layout, and the plumbing and electrical behind them are expensive to redo, so we build those to last. Hardware, paint, and light fixtures are inexpensive to update later, which is where personal style and trends belong. This is also how we help you get the most from your budget without overspending on what won't matter in five years.",
    ],
  },
  {
    heading: "Typical Investment and Timeline",
    paragraphs: [
      "Kitchen remodels in California typically run $15,000 to $125,000, and take 2 to 6 weeks to complete. Where a given project falls in that range depends far less on finish selections than on whether the layout and the systems behind the walls are changing. A cosmetic refresh (refaced cabinets, new countertops, and updated fixtures) sits at the shorter, more affordable end. A full remodel involving a new layout and complete electrical or plumbing rework sits at the longer, more involved end. We help you understand where your project falls before work begins, not after.",
    ],
  },
  {
    heading: "Planning for the Unexpected",
    paragraphs: [
      "Every kitchen budget we build includes room for the unexpected, particularly in older homes where opening a wall can reveal conditions that weren't visible beforehand. We also sequence cabinets and long-lead appliances early in the process, since ordering them late is one of the most common causes of a project stalling partway through.",
    ],
  },
];

export default function KitchenRemodelPage() {
  return (
    <ExpertiseArticle
      eyebrow="Kitchen Remodel"
      title="A Kitchen Planned Around How You Actually Use It"
      intro="A kitchen remodel succeeds or fails long before the first cabinet door is chosen. It succeeds on layout, on the systems behind the walls, and on decisions made in the right order, not on finish selections alone. We start every kitchen project with how the space actually gets used, then build the design and construction plan around that."
      sections={SECTIONS}
      process="Every kitchen remodel follows the same Approach we use across all our work: pre-construction planning, design, coordinated project management, and delivery, applied to the specific realities of a working kitchen."
      cta="Tell us about your kitchen, how you use it, and your timeline. We'll help you understand what your project involves, from layout and systems to budget and schedule, and identify a clear path forward."
    />
  );
}
