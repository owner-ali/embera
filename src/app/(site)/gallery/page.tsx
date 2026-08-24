import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/data";
import { GalleryMasonry } from "@/components/site/GalleryMasonry";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container">
        <div className="mb-12 max-w-lg">
          <p className="eyebrow mb-4">Gallery</p>
          <h1 className="section-heading">A look inside EMBERA.</h1>
        </div>
        <GalleryMasonry
          images={images.map((i) => ({ id: i.id, url: i.url, alt: i.alt, category: i.category }))}
        />
      </div>
    </div>
  );
}
