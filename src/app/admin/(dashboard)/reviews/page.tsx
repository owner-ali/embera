import { getAllReviews } from "@/lib/data-admin";
import { AdminReviewsList } from "@/components/admin/AdminReviewsList";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();
  const rows = reviews.map((r) => ({
    id: r.id,
    name: r.customer?.name ?? r.guestName ?? "Guest",
    rating: r.rating,
    comment: r.comment,
    dishName: r.dish?.name ?? null,
    isApproved: r.isApproved,
    isFeatured: r.isFeatured,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-bone">Reviews</h1>
        <p className="mt-1 text-sm text-bone-muted">{reviews.filter((r) => !r.isApproved).length} pending approval</p>
      </div>
      {rows.length > 0 ? <AdminReviewsList reviews={rows} /> : <p className="rounded-2xl bg-char p-10 text-center text-bone-muted">No reviews yet.</p>}
    </div>
  );
}
