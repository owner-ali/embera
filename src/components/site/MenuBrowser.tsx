"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { DishCard, type DishCardData } from "@/components/site/DishCard";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function MenuBrowser({
  categories,
  initialDishes,
}: {
  categories: Category[];
  initialDishes: DishCardData[];
}) {
  const [dishes, setDishes] = useState<DishCardData[]>(initialDishes);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [vegetarian, setVegetarian] = useState(false);
  const [spicy, setSpicy] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchDishes = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category !== "all") params.set("category", category);
    if (sort) params.set("sort", sort);
    if (vegetarian) params.set("vegetarian", "true");
    if (spicy) params.set("spicy", "true");
    if (featured) params.set("featured", "true");
    if (minRating > 0) params.set("minRating", String(minRating));

    try {
      const res = await fetch(`/api/menu?${params.toString()}`);
      const data = await res.json();
      setDishes(data.dishes ?? []);
    } finally {
      setLoading(false);
    }
  }, [q, category, sort, vegetarian, spicy, featured, minRating]);

  useEffect(() => {
    const id = setTimeout(fetchDishes, 300); // debounce search
    return () => clearTimeout(id);
  }, [fetchDishes]);

  const activeFilterCount = [vegetarian, spicy, featured, minRating > 0].filter(Boolean).length;

  return (
    <div>
      {/* Search + sort + filter toggle */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-smoke" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the menu…"
            className="w-full rounded-full border border-white/10 bg-char py-3 pl-11 pr-4 text-sm text-bone placeholder:text-smoke focus:border-ember-500 focus:outline-none"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-white/10 bg-char px-4 py-3 text-sm text-bone focus:border-ember-500 focus:outline-none"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className={cn(
            "flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm transition-colors",
            filtersOpen || activeFilterCount > 0
              ? "border-ember-500 text-ember-400"
              : "border-white/10 text-bone hover:border-white/30"
          )}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ember-500 font-mono text-[10px] text-ink">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Category chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("all")}
          className={cn(
            "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
            category === "all" ? "border-ember-500 bg-ember-500 text-ink" : "border-white/10 text-bone-muted hover:border-white/30"
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.slug)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
              category === c.slug ? "border-ember-500 bg-ember-500 text-ink" : "border-white/10 text-bone-muted hover:border-white/30"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtersOpen && (
        <div className="glass-panel mb-8 flex flex-wrap items-center gap-6 rounded-2xl px-6 py-5">
          <label className="flex items-center gap-2 text-sm text-bone-muted">
            <input type="checkbox" checked={vegetarian} onChange={(e) => setVegetarian(e.target.checked)} className="accent-ember-500" />
            Vegetarian
          </label>
          <label className="flex items-center gap-2 text-sm text-bone-muted">
            <input type="checkbox" checked={spicy} onChange={(e) => setSpicy(e.target.checked)} className="accent-ember-500" />
            Spicy
          </label>
          <label className="flex items-center gap-2 text-sm text-bone-muted">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-ember-500" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-bone-muted">
            Min rating
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="rounded-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-bone"
            >
              <option value={0}>Any</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
            </select>
          </label>
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setVegetarian(false); setSpicy(false); setFeatured(false); setMinRating(0); }}
              className="ml-auto flex items-center gap-1 font-mono text-xs text-ember-400 hover:text-ember-300"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl bg-char">
              <div className="aspect-[4/3] bg-white/5" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-1/3 rounded bg-white/5" />
                <div className="h-5 w-2/3 rounded bg-white/5" />
                <div className="h-3 w-full rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : dishes.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-2xl text-bone">Nothing matches those filters.</p>
          <p className="mt-2 text-bone-muted">Try widening your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
