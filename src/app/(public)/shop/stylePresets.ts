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
    palette: ["#C9A87A", "#DDD0BB", "#7A6A55", "#EDE6D6"],
    categories: ["wood", "counterTop", "stone"],
    keywords: ["walnut", "oak", "warm", "matte", "natural"],
  },
  "coastal": {
    label: "Coastal",
    description: "Light tiles, soft whites, sandy textures, and natural weaves. Airy and relaxed.",
    palette: ["#C8D8DC", "#E8E4DF", "#A8B8B8", "#F2EDE8"],
    categories: ["tile", "ceramic", "vinyl", "stone"],
    keywords: ["white", "light", "sand", "soft", "coastal"],
  },
  "transitional": {
    label: "Transitional",
    description: "A balanced mix of classic and contemporary — timeless finishes that work in any room.",
    palette: ["#C8C0B0", "#8C7A6A", "#E0D8CC", "#5A5048"],
    categories: ["wood", "tile", "carpet", "counterTop"],
    keywords: ["transitional", "classic", "balanced", "neutral"],
  },
  "minimalist": {
    label: "Minimalist",
    description: "Concrete, large-format tile, and monochrome palettes. Nothing extra.",
    palette: ["#D0CCCA", "#A8A8A4", "#E8E8E6", "#6C6C6A"],
    categories: ["ceramic", "tile", "vinyl", "stone"],
    keywords: ["concrete", "gray", "large format", "minimal", "clean"],
  },
};
