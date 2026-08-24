"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { DishFormModal, type DishFormValues } from "@/components/admin/DishFormModal";
import { deleteDish, toggleDishAvailability } from "@/lib/actions/admin-menu";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AdminDishRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  imageUrl: string;
  calories: number | null;
  allergens: string[];
  ingredients: string[];
  categoryId: string;
  categoryName: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
}

export function AdminMenuTable({
  dishes,
  categories,
}: {
  dishes: AdminDishRow[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DishFormValues | undefined>(undefined);

  function openCreate() {
    setEditing(undefined);
    setModalOpen(true);
  }
  function openEdit(d: AdminDishRow) {
    setEditing({
      id: d.id, name: d.name, slug: d.slug, description: d.description, price: d.price,
      imageUrl: d.imageUrl, calories: d.calories ? String(d.calories) : "",
      allergens: d.allergens.join(", "), ingredients: d.ingredients.join(", "),
      categoryId: d.categoryId, isVegetarian: d.isVegetarian, isSpicy: d.isSpicy,
      isFeatured: d.isFeatured, isAvailable: d.isAvailable,
    });
    setModalOpen(true);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    const result = await deleteDish(id);
    if (result.success) { toast.success("Dish deleted"); router.refresh(); }
    else toast.error(result.error ?? "Failed to delete");
  }

  async function handleToggleAvailable(id: string, current: boolean) {
    const result = await toggleDishAvailability(id, !current);
    if (result.success) { toast.success("Availability updated"); router.refresh(); }
    else toast.error(result.error ?? "Failed to update");
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button onClick={openCreate} className="btn-ember"><Plus size={16} /> New Dish</button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-char">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-smoke">
              <th className="px-5 py-4 font-mono">Dish</th>
              <th className="px-5 py-4 font-mono">Category</th>
              <th className="px-5 py-4 font-mono">Price</th>
              <th className="px-5 py-4 font-mono">Flags</th>
              <th className="px-5 py-4 font-mono">Available</th>
              <th className="px-5 py-4 font-mono text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((d) => (
              <tr key={d.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                      <Image src={d.imageUrl} alt={d.name} fill className="object-cover" sizes="44px" />
                    </div>
                    <span className="text-bone">{d.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-bone-muted">{d.categoryName}</td>
                <td className="px-5 py-4 font-mono text-bone">{formatCurrency(d.price)}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-1.5">
                    {d.isFeatured && <span title="Featured"><Star size={13} className="text-gold" /></span>}
                    {d.isVegetarian && <span className="font-mono text-[10px] text-green-400">VEG</span>}
                    {d.isSpicy && <span className="font-mono text-[10px] text-ember-400">SPICY</span>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleToggleAvailable(d.id, d.isAvailable)}
                    className={cn("rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider", d.isAvailable ? "bg-green-900/40 text-green-400" : "bg-white/5 text-smoke")}
                  >
                    {d.isAvailable ? "Available" : "Hidden"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(d)} aria-label={`Edit ${d.name}`} className="text-bone-muted hover:text-gold"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(d.id, d.name)} aria-label={`Delete ${d.name}`} className="text-bone-muted hover:text-ember-400"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <DishFormModal
          categories={categories}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); router.refresh(); }}
        />
      )}
    </div>
  );
}
