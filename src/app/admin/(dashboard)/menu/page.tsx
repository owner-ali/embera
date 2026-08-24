import { prisma } from "@/lib/prisma";
import { AdminMenuTable } from "@/components/admin/AdminMenuTable";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const [dishes, categories] = await Promise.all([
    prisma.dish.findMany({ include: { category: true, ingredients: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const rows = dishes.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    price: d.price.toString(),
    imageUrl: d.imageUrl,
    calories: d.calories,
    allergens: d.allergens,
    ingredients: d.ingredients.map((i) => i.name),
    categoryId: d.categoryId,
    categoryName: d.category.name,
    isVegetarian: d.isVegetarian,
    isSpicy: d.isSpicy,
    isFeatured: d.isFeatured,
    isAvailable: d.isAvailable,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-bone">Menu Management</h1>
        <p className="mt-1 text-sm text-bone-muted">{dishes.length} dishes — changes go live on /menu immediately.</p>
      </div>
      <AdminMenuTable dishes={rows} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
