"use client";

import { useMemo, useState } from "react";
import { Star, Minus, Plus, Flame } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

const spicyLevels = [
  { value: "mild", label: "Mild", extra: 0 },
  { value: "medium", label: "Medium", extra: 0 },
  { value: "hot", label: "Hot", extra: 0.5 },
  { value: "extra-hot", label: "Extra Hot", extra: 0.5 },
];

const sideDishes = [
  { value: "", label: "No side", extra: 0 },
  { value: "Hand-cut fries", label: "Hand-cut fries", extra: 4 },
  { value: "House salad", label: "House salad", extra: 5 },
  { value: "Truffle mash", label: "Truffle mash", extra: 6 },
];

interface DishCustomizerProps {
  dish: {
    id: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string;
    isSpicy: boolean;
  };
}

export function DishCustomizer({ dish }: DishCustomizerProps) {
  const [quantity, setQuantity] = useState(1);
  const [spicyLevel, setSpicyLevel] = useState("mild");
  const [sideDish, setSideDish] = useState("");
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraSauce, setExtraSauce] = useState(false);
  const [notes, setNotes] = useState("");
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);

  const unitPrice = useMemo(() => {
    let price = dish.price;
    if (dish.isSpicy) price += spicyLevels.find((s) => s.value === spicyLevel)?.extra ?? 0;
    price += sideDishes.find((s) => s.value === sideDish)?.extra ?? 0;
    if (extraCheese) price += 1.5;
    if (extraSauce) price += 1;
    return price;
  }, [dish.price, dish.isSpicy, spicyLevel, sideDish, extraCheese, extraSauce]);

  function handleAddToCart() {
    addItem({
      dishId: dish.id,
      slug: dish.slug,
      name: dish.name,
      imageUrl: dish.imageUrl,
      unitPrice,
      quantity,
      spicyLevel: dish.isSpicy ? spicyLevel : undefined,
      sideDish: sideDish || undefined,
      extraCheese,
      extraSauce,
      notes: notes || undefined,
    });
    toast.success(`${dish.name} added to cart`);
    openCart();
  }

  return (
    <div className="space-y-7">
      {dish.isSpicy && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-smoke">
            <Flame size={12} className="text-ember-400" /> Spice Level
          </p>
          <div className="flex flex-wrap gap-2">
            {spicyLevels.map((s) => (
              <button
                key={s.value}
                onClick={() => setSpicyLevel(s.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs transition-colors",
                  spicyLevel === s.value ? "border-ember-500 bg-ember-500 text-ink" : "border-white/10 text-bone-muted hover:border-white/30"
                )}
              >
                {s.label}{s.extra > 0 && ` +${formatCurrency(s.extra)}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-smoke">Side Dish</p>
        <div className="flex flex-wrap gap-2">
          {sideDishes.map((s) => (
            <button
              key={s.value}
              onClick={() => setSideDish(s.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs transition-colors",
                sideDish === s.value ? "border-ember-500 bg-ember-500 text-ink" : "border-white/10 text-bone-muted hover:border-white/30"
              )}
            >
              {s.label}{s.extra > 0 && ` +${formatCurrency(s.extra)}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-bone-muted">
          <input type="checkbox" checked={extraCheese} onChange={(e) => setExtraCheese(e.target.checked)} className="accent-ember-500" />
          Extra cheese <span className="text-smoke">+{formatCurrency(1.5)}</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-bone-muted">
          <input type="checkbox" checked={extraSauce} onChange={(e) => setExtraSauce(e.target.checked)} className="accent-ember-500" />
          Extra sauce <span className="text-smoke">+{formatCurrency(1)}</span>
        </label>
      </div>

      <div>
        <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">Notes for the kitchen</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={200}
          rows={2}
          placeholder="Allergies, preferences, anything we should know…"
          className="w-full rounded-xl border border-white/10 bg-char px-4 py-3 text-sm text-bone placeholder:text-smoke focus:border-ember-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <div className="flex items-center gap-3 rounded-full border border-white/10 px-3 py-2">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="text-bone/70 hover:text-gold">
            <Minus size={16} />
          </button>
          <span className="w-6 text-center font-mono">{quantity}</span>
          <button onClick={() => setQuantity((q) => Math.min(20, q + 1))} aria-label="Increase quantity" className="text-bone/70 hover:text-gold">
            <Plus size={16} />
          </button>
        </div>
        <span className="font-display text-3xl text-bone">{formatCurrency(unitPrice * quantity)}</span>
      </div>

      <button onClick={handleAddToCart} className="btn-ember w-full">
        Add to Cart
      </button>
    </div>
  );
}
