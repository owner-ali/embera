import type { Metadata } from "next";
import { getMenuDishes, getActiveCategories } from "@/lib/data";
import { MenuBrowser } from "@/components/site/MenuBrowser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menu",
  description: "Explore the full EMBERA menu — starters, pizza, burgers, pasta, steak, desserts, and drinks.",
};

export default async function MenuPage() {
  const [dishes, categories] = await Promise.all([
    getMenuDishes({ sort: "newest" }),
    getActiveCategories(),
  ]);

  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container">
        <div className="mb-12 max-w-lg">
          <p className="eyebrow mb-4">The Menu</p>
          <h1 className="section-heading">Every dish, built around fire.</h1>
        </div>
        <MenuBrowser categories={categories} initialDishes={dishes} />
      </div>
    </div>
  );
}
