"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Flame, Leaf, Sparkles, Plus } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

export interface DishCardData {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  category: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isFeatured?: boolean;
}

export function DishCard({ dish, index = 0 }: { dish: DishCardData; index?: number }) {
  const addItem = useCart((s) => s.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-char shadow-card transition-transform duration-500 hover:-translate-y-1"
    >
      <Link href={`/menu/${dish.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {dish.isFeatured && (
              <span className="glass-panel flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-gold">
                <Sparkles size={10} /> Featured
              </span>
            )}
            {dish.isVegetarian && (
              <span className="glass-panel flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-green-400">
                <Leaf size={10} /> Veg
              </span>
            )}
            {dish.isSpicy && (
              <span className="glass-panel flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ember-400">
                <Flame size={10} /> Spicy
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">{dish.category}</p>
        <Link href={`/menu/${dish.slug}`}>
          <h3 className="mt-1 font-display text-xl text-bone transition-colors group-hover:text-gold">
            {dish.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm text-bone-muted">{dish.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 font-mono text-xs text-gold">
            <Star size={12} className="fill-gold text-gold" />
            {dish.rating.toFixed(1)}
            <span className="text-smoke">({dish.ratingCount})</span>
          </div>
          <span className="font-display text-lg text-bone">{formatCurrency(dish.price)}</span>
        </div>

        <button
          onClick={() =>
            addItem({
              dishId: dish.id,
              slug: dish.slug,
              name: dish.name,
              imageUrl: dish.imageUrl,
              unitPrice: dish.price,
              quantity: 1,
            })
          }
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-bone transition-all duration-300 hover:border-ember-500 hover:bg-ember-500 hover:text-ink"
        >
          <Plus size={14} /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
