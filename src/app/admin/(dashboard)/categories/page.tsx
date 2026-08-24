"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/admin-menu";
import { slugify, cn } from "@/lib/utils";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    const result = await deleteCategory(id);
    if (result.success) { toast.success("Category deleted"); load(); }
    else toast.error(result.error ?? "Failed to delete");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-bone">Categories</h1>
          <p className="mt-1 text-sm text-bone-muted">{categories.length} categories</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-ember"><Plus size={16} /> New Category</button>
      </div>

      {loading ? (
        <p className="text-bone-muted">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl bg-char">
              <div className="relative h-32 w-full">
                {c.imageUrl ? (
                  <Image src={c.imageUrl} alt={c.name} fill className="object-cover" sizes="320px" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-white/5 text-smoke">No image</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg text-bone">{c.name}</h3>
                  <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] uppercase", c.isActive ? "bg-green-900/40 text-green-400" : "bg-white/5 text-smoke")}>
                    {c.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-bone-muted">{c.description}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => { setEditing(c); setModalOpen(true); }} className="text-bone-muted hover:text-gold"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="text-bone-muted hover:text-ember-400"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <CategoryModal
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); load(); }}
        />
      )}
    </div>
  );
}

function CategoryModal({ initial, onClose, onSaved }: { initial: Category | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    const payload = { name, slug, description, imageUrl, isActive, sortOrder: initial?.sortOrder ?? 0 };
    const result = initial ? await updateCategory(initial.id, payload) : await createCategory(payload);
    setSubmitting(false);
    if (!result.success) {
      setErrors(result.fieldErrors ?? {});
      toast.error(result.error ?? "Failed to save");
      return;
    }
    toast.success(initial ? "Category updated" : "Category created");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-char p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl text-bone">{initial ? "Edit Category" : "New Category"}</h2>
          <button onClick={onClose} className="text-smoke hover:text-bone"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Name</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); if (!initial) setSlug(slugify(e.target.value)); }}
              required
              className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none" />
            {errors.slug && <p className="mt-1 text-xs text-ember-400">{errors.slug}</p>}
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Image URL</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none" />
          </div>
          <label className="flex items-center gap-2 text-sm text-bone-muted">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-ember-500" />
            Active (visible on menu)
          </label>
          <button type="submit" disabled={submitting} className="btn-ember w-full disabled:opacity-60">
            {submitting ? "Saving…" : initial ? "Save Changes" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
