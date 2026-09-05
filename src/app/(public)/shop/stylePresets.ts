export const STYLE_PRESETS: Record<string, {
  label: string;
  description: string;
  palette: string[];
  categories: string[];
  keywords: string[];
}> = {
  "warm-modern": {
    label: "Warm Modern",
    description: "Natural wood tones, matte stone, and warm neutrals. Clean lines with organic materials.",
    palette: ["#C9A87A", "#DDD0BB", "#7A6A55"],
    categories: ["wood", "counterTop", "stone"],
    keywords: ["walnut", "oak", "warm", "matte", "natural"],
  },
  "coastal-contemporary": {
    label: "Coastal Contemporary",
    description: "Light tiles, soft whites, sandy textures. Airy, relaxed, and quietly refined.",
    palette: ["#C8D8DC", "#E8E4DF", "#A8B8B8", "#F2EDE8", "#1B3A5C"],
    categories: ["tile", "ceramic", "vinyl", "stone"],
    keywords: ["white", "light", "sand", "soft", "coastal"],
  },
  "organic-modern": {
    label: "Organic Modern",
    description: "Raw textures, earthy tones, and live-edge materials. Warmth without formality.",
    palette: ["#B8A890", "#8C7868", "#D4C8B0", "#6A5A48"],
    categories: ["wood", "stone", "tile", "counterTop"],
    keywords: ["earthy", "raw", "linen", "terracotta", "natural stone"],
  },
  "transitional": {
    label: "Transitional",
    description: "A balanced mix of classic and contemporary - timeless finishes that work in any room.",
    palette: ["#C8C0B0", "#8C7A6A", "#E0D8CC", "#5A5048"],
    categories: ["wood", "tile", "carpet", "counterTop"],
    keywords: ["transitional", "classic", "balanced", "neutral"],
  },
  "modern-mediterranean": {
    label: "Modern Mediterranean",
    description: "Terracotta, zellige, warm stone, and hand-crafted tile. Texture and depth.",
    palette: ["#C07848", "#D8B890", "#8C5830", "#EDD8B8"],
    categories: ["tile", "ceramic", "stone", "counterTop"],
    keywords: ["terracotta", "zellige", "warm", "handcrafted", "mediterranean"],
  },
  "traditional": {
    label: "Traditional",
    description: "Raised-panel cabinetry, classic stone, rich hardwood. Formal and enduring.",
    palette: ["#8C7058", "#C4A880", "#6A5040", "#E0D0B8"],
    categories: ["wood", "cabinet", "carpet", "counterTop"],
    keywords: ["traditional", "raised panel", "cherry", "marble", "formal"],
  },
  "minimalist": {
    label: "Minimalist",
    description: "Concrete, large-format tile, and monochrome palettes. Nothing extra.",
    palette: ["#D0CCCA", "#A8A8A4", "#E8E8E6", "#6C6C6A", "#1A1A1A"],
    categories: ["ceramic", "tile", "vinyl", "stone"],
    keywords: ["concrete", "gray", "large format", "minimal", "clean"],
  },
  "california-casual": {
    label: "California Casual",
    description: "Indoor-outdoor living, wood-look LVP, and relaxed finishes. Built for real life.",
    palette: ["#B8C8A0", "#D8D0B8", "#8A9E78", "#EDE8DC"],
    categories: ["vinyl", "wood", "tile", "stone"],
    keywords: ["california", "outdoor", "LVP", "wood look", "casual", "indoor outdoor"],
  },
};
