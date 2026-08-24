import type { Metadata } from "next";
import { Hero } from "@/components/site/Hero";
import { FoodCarousel3D } from "@/components/site/FoodCarousel3D";
import { FeatureSection } from "@/components/site/FeatureSection";
import { ReviewsCarousel } from "@/components/site/ReviewsCarousel";
import { ReservationCta } from "@/components/site/ReservationCta";
import { RestaurantSchema } from "@/components/site/RestaurantSchema";
import { getFeaturedDishes, getApprovedReviews, getReviewStats, getSiteSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "EMBERA — Crafted for the Extraordinary.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dishes, reviews, stats, settings] = await Promise.all([
    getFeaturedDishes(6),
    getApprovedReviews(8),
    getReviewStats(),
    getSiteSettings(),
  ]);

  const reviewCards = reviews.map((r: Awaited<ReturnType<typeof getApprovedReviews>>[number]) => ({
    id: r.id,
    name: r.customer?.name ?? r.guestName ?? "Guest",
    rating: r.rating,
    comment: r.comment,
    date: r.createdAt.toISOString(),
  }));

  return (
    <>
      <RestaurantSchema
        name={settings.restaurantName}
        description={settings.seoDescription || settings.tagline}
        phone={settings.phone}
        address={settings.address}
        url={getSiteUrl()}
      />
      <Hero />

      <section className="bg-ink py-24 md:py-32">
        <div className="container">
          <div className="mb-14 max-w-lg">
            <p className="eyebrow mb-4">Signature Dishes</p>
            <h2 className="section-heading">A closer look at the fire.</h2>
          </div>
          {dishes.length > 0 ? (
            <FoodCarousel3D dishes={dishes} />
          ) : (
            <p className="text-bone-muted">
              No featured dishes yet — mark dishes as &ldquo;Featured&rdquo; in{" "}
              <span className="text-ember-400">/admin/menu</span> to populate this carousel.
            </p>
          )}
        </div>
      </section>

      <FeatureSection />

      {reviewCards.length > 0 && (
        <ReviewsCarousel reviews={reviewCards} average={stats.average} total={stats.count} />
      )}

      <ReservationCta />
    </>
  );
}
