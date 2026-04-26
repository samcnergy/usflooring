// Autocomplete endpoint for the brand/style/color typeahead on the
// Invoice form's line-item rows. Reads from MaterialSuggestion (Phase 2
// readiness data) ranked by usage count.
//
//   GET /api/material-suggestions/autocomplete?
//       field=brand|style|color
//       &q=<query>
//       [&category=<LineCategory>]
//       [&brand=<existingBrand>]
//       [&style=<existingStyle>]

import { NextResponse } from "next/server";
import { LineCategory } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";
import { suggestBrand, suggestColor, suggestStyle } from "@/lib/material-suggestion";

export async function GET(req: Request) {
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const field = url.searchParams.get("field");
  const q = (url.searchParams.get("q") ?? "").trim();
  const categoryParam = url.searchParams.get("category");
  const brand = url.searchParams.get("brand") ?? undefined;
  const style = url.searchParams.get("style") ?? undefined;

  if (q.length < 1) return NextResponse.json({ suggestions: [] });

  const category =
    categoryParam && (Object.values(LineCategory) as string[]).includes(categoryParam)
      ? (categoryParam as LineCategory)
      : undefined;

  let suggestions;
  switch (field) {
    case "brand":
      suggestions = await suggestBrand({ q, category });
      break;
    case "style":
      suggestions = await suggestStyle({ q, category, brand });
      break;
    case "color":
      suggestions = await suggestColor({ q, category, brand, style });
      break;
    default:
      return NextResponse.json({ error: "field must be brand|style|color" }, { status: 400 });
  }

  return NextResponse.json({ suggestions });
}
