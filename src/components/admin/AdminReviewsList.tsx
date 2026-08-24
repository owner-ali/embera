"use client";

import { useRouter } from "next/navigation";
import { Star, Check, X, Trash2, Sparkles } from "lucide-react";
import { setReviewApproval, setReviewFeatured, deleteReview } from "@/lib/actions/admin-misc";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";

export interface AdminReviewRow {
  id: string;
  name: string;
  rating: number;
  comment: string;
  dishName: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export function AdminReviewsList({ reviews }: { reviews: AdminReviewRow[] }) {
  const router = useRouter();

  async function act(fn: () => Promise<{ success: boolean; error?: string }>, successMsg: string) {
    const result = await fn();
    if (result.success) { toast.success(successMsg); router.refresh(); }
    else toast.error(result.error ?? "Failed");
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl bg-char p-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className={cn(i < r.rating ? "fill-gold text-gold" : "text-smoke")} />
              ))}
            </div>
            <div className="flex gap-1.5">
              <span className={cn("rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase", r.isApproved ? "bg-green-900/40 text-green-400" : "bg-white/5 text-smoke")}>
                {r.isApproved ? "Approved" : "Pending"}
              </span>
              {r.isFeatured && <span className="rounded-full bg-ember-900/40 px-2.5 py-0.5 font-mono text-[10px] uppercase text-ember-400">Featured</span>}
            </div>
          </div>
          <p className="text-sm text-bone-muted">{r.comment}</p>
          <p className="mt-3 font-mono text-xs text-smoke">
            {r.name} {r.dishName && `· ${r.dishName}`} · {formatDate(r.createdAt)}
          </p>
          <div className="mt-4 flex gap-2 border-t border-white/10 pt-4 text-xs">
            {!r.isApproved ? (
              <button onClick={() => act(() => setReviewApproval(r.id, true), "Review approved")} className="flex items-center gap-1 text-green-400 hover:underline"><Check size={13} /> Approve</button>
            ) : (
              <button onClick={() => act(() => setReviewApproval(r.id, false), "Review unapproved")} className="flex items-center gap-1 text-smoke hover:underline"><X size={13} /> Unapprove</button>
            )}
            <button onClick={() => act(() => setReviewFeatured(r.id, !r.isFeatured), r.isFeatured ? "Unfeatured" : "Featured")} className="flex items-center gap-1 text-gold hover:underline"><Sparkles size={13} /> {r.isFeatured ? "Unfeature" : "Feature"}</button>
            <button
              onClick={() => { if (confirm("Delete this review?")) act(() => deleteReview(r.id), "Review deleted"); }}
              className="ml-auto flex items-center gap-1 text-ember-400 hover:underline"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
