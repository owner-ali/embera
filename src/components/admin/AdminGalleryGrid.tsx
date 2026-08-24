"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2, Star, X } from "lucide-react";
import { addGalleryImage, deleteGalleryImage, toggleGalleryFeatured } from "@/lib/actions/admin-misc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AdminGalleryRow {
  id: string;
  url: string;
  alt: string;
  category: string;
  isFeatured: boolean;
}

const categories = ["FOOD", "INTERIOR", "CHEF", "KITCHEN", "EVENTS"];

export function AdminGalleryGrid({ images }: { images: AdminGalleryRow[] }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  async function handleDelete(id: string) {
    if (!confirm("Delete this image?")) return;
    const result = await deleteGalleryImage(id);
    if (result.success) { toast.success("Image deleted"); router.refresh(); }
    else toast.error(result.error ?? "Failed");
  }

  async function handleFeature(id: string, current: boolean) {
    const result = await toggleGalleryFeatured(id, !current);
    if (result.success) router.refresh();
    else toast.error(result.error ?? "Failed");
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button onClick={() => setModalOpen(true)} className="btn-ember"><Plus size={16} /> Add Image</button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl">
            <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="200px" />
            <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/50 group-hover:opacity-100">
              <div className="flex justify-end gap-1">
                <button onClick={() => handleFeature(img.id, img.isFeatured)} className={cn("rounded-full bg-char/80 p-1.5", img.isFeatured ? "text-gold" : "text-bone")}><Star size={13} /></button>
                <button onClick={() => handleDelete(img.id)} className="rounded-full bg-char/80 p-1.5 text-bone hover:text-ember-400"><Trash2 size={13} /></button>
              </div>
              <p className="truncate rounded bg-char/80 px-2 py-1 text-[10px] text-bone">{img.category}</p>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && <AddImageModal onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); router.refresh(); }} />}
    </div>
  );
}

function AddImageModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [category, setCategory] = useState("FOOD");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await addGalleryImage({ url, alt, category: category as any });
    setSubmitting(false);
    if (!result.success) { toast.error(result.error ?? "Failed"); return; }
    toast.success("Image added");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-char p-7">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl text-bone">Add Gallery Image</h2>
          <button onClick={onClose} className="text-smoke hover:text-bone"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Image URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} required type="url" className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none" />
            <p className="mt-1 text-xs text-smoke">Connect Cloudinary or Supabase Storage keys to enable direct file upload.</p>
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Alt Text</label>
            <input value={alt} onChange={(e) => setAlt(e.target.value)} required className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" disabled={submitting} className="btn-ember w-full disabled:opacity-60">{submitting ? "Adding…" : "Add Image"}</button>
        </form>
      </div>
    </div>
  );
}
