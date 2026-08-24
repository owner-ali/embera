import { NextRequest, NextResponse } from "next/server";
import { getMenuDishes } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const filters = {
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    minRating: sp.get("minRating") ? Number(sp.get("minRating")) : undefined,
    vegetarian: sp.get("vegetarian") === "true",
    spicy: sp.get("spicy") === "true",
    featured: sp.get("featured") === "true",
    sort: (sp.get("sort") as any) ?? undefined,
  };

  const dishes = await getMenuDishes(filters);
  return NextResponse.json({ dishes });
}
