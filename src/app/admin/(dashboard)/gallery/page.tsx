import { getAllGalleryImages } from "@/lib/data-admin";
import { AdminGalleryGrid } from "@/components/admin/AdminGalleryGrid";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getAllGalleryImages();
  const rows = images.map((i) => ({
    id: i.id,
    url: i.url,
    alt: i.alt,
    category: i.category,
    isFeatured: i.isFeatured,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-bone">Gallery</h1>
        <p className="mt-1 text-sm text-bone-muted">{images.length} images — changes reflect on /gallery immediately.</p>
      </div>
      <AdminGalleryGrid images={rows} />
    </div>
  );
}
