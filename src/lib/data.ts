import { prisma } from "@/lib/prisma";
import type { CarouselDish } from "@/types";

export async function getFeaturedDishes(limit = 6): Promise<CarouselDish[]> {
  const dishes = await prisma.dish.findMany({
    where: { isFeatured: true, isAvailable: true },
    include: { category: true },
    take: limit,
    orderBy: { rating: "desc" },
  });

  return dishes.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    description: d.description,
    price: Number(d.price),
    imageUrl: d.imageUrl,
    rating: Number(d.rating),
    ratingCount: d.ratingCount,
    category: d.category.name,
    isSpicy: d.isSpicy,
    isVegetarian: d.isVegetarian,
  }));
}

export async function getApprovedReviews(limit = 8) {
  return prisma.review.findMany({
    where: { isApproved: true },
    include: { customer: true, dish: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getReviewStats() {
  const agg = await prisma.review.aggregate({
    where: { isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    average: agg._avg.rating ? Number(agg._avg.rating.toFixed(1)) : 4.9,
    count: agg._count.rating,
  };
}

/** Site-wide CMS settings as a flat key->value map, with sensible fallbacks. */
export async function getSiteSettings() {
  const rows = await prisma.siteSetting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    restaurantName: map.restaurantName ?? "EMBERA",
    tagline: map.tagline ?? "Crafted for the Extraordinary.",
    heroHeading: map.heroHeading ?? "Taste the Extraordinary.",
    heroSubtitle: map.heroSubtitle ?? "Where fire, flavor and creativity meet.",
    aboutText: map.aboutText ?? "",
    phone: map.phone ?? "",
    email: map.email ?? "",
    address: map.address ?? "",
    openingHours: map.openingHours ?? "",
    instagram: map.instagram ?? "#",
    facebook: map.facebook ?? "#",
    seoTitle: map.seoTitle ?? "EMBERA — Crafted for the Extraordinary.",
    seoDescription: map.seoDescription ?? "",
  };
}

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export interface MenuFilters {
  q?: string;
  category?: string; // slug, "all" for none
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  vegetarian?: boolean;
  spicy?: boolean;
  featured?: boolean;
  sort?: "price-asc" | "price-desc" | "popular" | "rating" | "newest";
}

export async function getMenuDishes(filters: MenuFilters) {
  const where: any = { isAvailable: true };

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.category && filters.category !== "all") {
    where.category = { slug: filters.category };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }
  if (filters.minRating !== undefined) where.rating = { gte: filters.minRating };
  if (filters.vegetarian) where.isVegetarian = true;
  if (filters.spicy) where.isSpicy = true;
  if (filters.featured) where.isFeatured = true;

  let orderBy: any = { createdAt: "desc" };
  switch (filters.sort) {
    case "price-asc": orderBy = { price: "asc" }; break;
    case "price-desc": orderBy = { price: "desc" }; break;
    case "popular": orderBy = { ratingCount: "desc" }; break;
    case "rating": orderBy = { rating: "desc" }; break;
    case "newest": orderBy = { createdAt: "desc" }; break;
  }

  const dishes = await prisma.dish.findMany({
    where,
    include: { category: true },
    orderBy,
  });

  return dishes.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    description: d.description,
    price: Number(d.price),
    imageUrl: d.imageUrl,
    rating: Number(d.rating),
    ratingCount: d.ratingCount,
    category: d.category.name,
    categorySlug: d.category.slug,
    isSpicy: d.isSpicy,
    isVegetarian: d.isVegetarian,
    isFeatured: d.isFeatured,
  }));
}

export async function getDishBySlug(slug: string) {
  return prisma.dish.findUnique({
    where: { slug },
    include: {
      category: true,
      ingredients: true,
      reviews: { where: { isApproved: true }, include: { customer: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getRelatedDishes(categoryId: string, excludeId: string, limit = 4) {
  return prisma.dish.findMany({
    where: { categoryId, isAvailable: true, id: { not: excludeId } },
    take: limit,
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: { include: { dish: true } } },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: { include: { dish: true } } },
  });
}

export async function getGalleryImages(category?: string) {
  return prisma.galleryImage.findMany({
    where: category && category !== "all" ? { category: category as any } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getBookedTimesForDate(date: Date) {
  const start = new Date(date); start.setHours(0, 0, 0, 0);
  const end = new Date(date); end.setHours(23, 59, 59, 999);
  const reservations = await prisma.reservation.findMany({
    where: { date: { gte: start, lte: end }, status: { in: ["PENDING", "CONFIRMED"] } },
    select: { time: true },
  });
  return reservations.map((r) => r.time);
}
