"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createDish, updateDish } from "@/lib/actions/admin-menu";
import { slugify, cn } from "@/lib/utils";
import { toast } from "sonner";

export interface DishFormValues {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  imageUrl: string;
  calories?: string;
  allergens: string;
  ingredients: string;
  categoryId: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
}

const emptyDish: DishFormValues = {
  name: "", slug: "", description: "", price: "", imageUrl: "", calories: "",
  allergens: "", ingredients: "", categoryId: "", isVegetarian: false, isSpicy: false,
  isFeatured: false, isAvailable: true,
};

export function DishFormModal({
  categories,
  initial,
  onClose,
  onSaved,
}: {
  categories: { id: string; name: string }[];
  initial?: DishFormValues;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<DishFormValues>(initial ?? emptyDish);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const isEdit = !!initial?.id;

  function update<K extends keyof DishFormValues>(key: K, val: DishFormValues[K]) {
    setValues((v) => ({ ...v, [key]: val, ...(key === "name" && !isEdit ? { slug: slugify(String(val)) } : {}) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      price: values.price,
      imageUrl: values.imageUrl,
      gallery: [],
      calories: values.calories || undefined,
      allergens: values.allergens.split(",").map((s) => s.trim()).filter(Boolean),
      ingredients: values.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      categoryId: values.categoryId,
      isVegetarian: values.isVegetarian,
      isSpicy: values.isSpicy,
      isFeatured: values.isFeatured,
      isAvailable: values.isAvailable,
    };

    const result = isEdit ? await updateDish(initial!.id!, payload) : await createDish(payload);
    setSubmitting(false);

    if (!result.success) {
      setErrors(result.fieldErrors ?? {});
      toast.error(result.error ?? "Failed to save dish");
      return;
    }
    toast.success(isEdit ? "Dish updated" : "Dish created");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-char p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl text-bone">{isEdit ? "Edit Dish" : "New Dish"}</h2>
          <button onClick={onClose} className="text-smoke hover:text-bone"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Name" value={values.name} onChange={(v) => update("name", v)} error={errors.name} required />
            <TextField label="Slug" value={values.slug} onChange={(v) => update("slug", v)} error={errors.slug} required />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Description</label>
            <textarea
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none"
            />
            {errors.description && <p className="mt-1 text-xs text-ember-400">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Price (USD)" value={values.price} onChange={(v) => update("price", v)} error={errors.price} required type="number" />
            <TextField label="Calories" value={values.calories ?? ""} onChange={(v) => update("calories", v)} type="number" />
          </div>

          <TextField label="Image URL" value={values.imageUrl} onChange={(v) => update("imageUrl", v)} error={errors.imageUrl} required />

          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Category</label>
            <select
              value={values.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none"
            >
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-ember-400">{errors.categoryId}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Ingredients (comma-separated)" value={values.ingredients} onChange={(v) => update("ingredients", v)} />
            <TextField label="Allergens (comma-separated)" value={values.allergens} onChange={(v) => update("allergens", v)} />
          </div>

          <div className="flex flex-wrap gap-5 pt-2">
            <Checkbox label="Vegetarian" checked={values.isVegetarian} onChange={(v) => update("isVegetarian", v)} />
            <Checkbox label="Spicy" checked={values.isSpicy} onChange={(v) => update("isSpicy", v)} />
            <Checkbox label="Featured" checked={values.isFeatured} onChange={(v) => update("isFeatured", v)} />
            <Checkbox label="Available" checked={values.isAvailable} onChange={(v) => update("isAvailable", v)} />
          </div>

          <button type="submit" disabled={submitting} className="btn-ember mt-2 w-full disabled:opacity-60">
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Dish"}
          </button>
        </form>
      </div>
    </div>
  );
}

function TextField({
  label, value, onChange, error, required, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; error?: string; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        required={required}
        className={cn(
          "w-full rounded-xl border bg-ink px-4 py-2.5 text-sm text-bone focus:outline-none",
          error ? "border-ember-500" : "border-white/10 focus:border-ember-500"
        )}
      />
      {error && <p className="mt-1 text-xs text-ember-400">{error}</p>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-bone-muted">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-ember-500" />
      {label}
    </label>
  );
}
