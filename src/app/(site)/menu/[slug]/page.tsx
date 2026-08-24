import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, Flame as FlameIcon, Leaf, TriangleAlert } from "lucide-react";
import { getDishBySlug, getRelatedDishes } from "@/lib/data";
import { DishCustomizer } from "@/components/site/DishCustomizer";
import { DishCard } from "@/components/site/DishCard";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const dish = await getDishBySlug(params.slug);
  if (!dish) return {};
  return {
    title: dish.name,
    description: dish.description,
    openGraph: { images: [dish.imageUrl] },
  };
}

export default async function DishPage({ params }: { params: { slug: string } }) {
  const dish = await getDishBySlug(params.slug);
  if (!dish) notFound();

  const related = await getRelatedDishes(dish.categoryId, dish.id);
  const gallery = [dish.imageUrl, ...dish.gallery].filter(Boolean);

  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container grid grid-cols-1 gap-14 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-card">
            <Image src={gallery[0]} alt={dish.name} fill priority className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.slice(1).map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image src={src} alt={`${dish.name} ${i + 2}`} fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest2 text-smoke">
            <span>{dish.category.name}</span>
            {dish.isSpicy && <FlameIcon size={12} className="text-ember-400" />}
            {dish.isVegetarian && <Leaf size={12} className="text-green-400" />}
          </div>
          <h1 className="font-display text-4xl text-bone md:text-5xl">{dish.name}</h1>

          <div className="mt-3 flex items-center gap-2 font-mono text-sm text-gold">
            <Star size={15} className="fill-gold text-gold" />
            {Number(dish.rating).toFixed(1)}
            <span className="text-smoke">({dish.ratingCount} reviews)</span>
          </div>

          <p className="mt-5 leading-relaxed text-bone-muted">{dish.description}</p>

          <div className="mt-6 flex flex-wrap gap-6 border-y border-white/10 py-5 font-mono text-xs text-smoke">
            {dish.calories && <span>{dish.calories} cal</span>}
            {dish.ingredients.length > 0 && (
              <span className="max-w-full">
                Ingredients: {dish.ingredients.map((i) => i.name).join(", ")}
              </span>
            )}
          </div>

          {dish.allergens.length > 0 && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-ember-800 bg-ember-900/30 px-4 py-3 text-xs text-ember-300">
              <TriangleAlert size={14} className="mt-0.5 shrink-0" />
              Contains: {dish.allergens.join(", ")}
            </div>
          )}

          <div className="mt-8">
            <DishCustomizer
              dish={{
                id: dish.id,
                slug: dish.slug,
                name: dish.name,
                price: Number(dish.price),
                imageUrl: dish.imageUrl,
                isSpicy: dish.isSpicy,
              }}
            />
          </div>
        </div>
      </div>

      {/* Reviews */}
      {dish.reviews.length > 0 && (
        <div className="container mt-24">
          <h2 className="mb-8 font-display text-2xl text-bone">What guests say</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {dish.reviews.map((r) => (
              <div key={r.id} className="rounded-2xl bg-char p-6">
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={cn(i < r.rating ? "fill-gold text-gold" : "text-smoke")} />
                  ))}
                </div>
                <p className="text-sm text-bone-muted">{r.comment}</p>
                <p className="mt-3 font-mono text-xs text-smoke">
                  {r.customer?.name ?? r.guestName} · {formatDate(r.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="container mt-24">
          <h2 className="mb-8 font-display text-2xl text-bone">You might also like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((d, i) => (
              <DishCard
                key={d.id}
                index={i}
                dish={{
                  id: d.id,
                  slug: d.slug,
                  name: d.name,
                  description: d.description,
                  price: Number(d.price),
                  imageUrl: d.imageUrl,
                  rating: Number(d.rating),
                  ratingCount: d.ratingCount,
                  category: dish.category.name,
                  isSpicy: d.isSpicy,
                  isVegetarian: d.isVegetarian,
                  isFeatured: d.isFeatured,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
