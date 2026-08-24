"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import type { Role, GalleryCategory, PermissionKey } from "@prisma/client";

export interface ActionResult {
  success: boolean;
  error?: string;
}

// ---------------- Reviews ----------------

export async function setReviewApproval(id: string, isApproved: boolean): Promise<ActionResult> {
  const session = await requireAdmin("REVIEWS");
  if (!session) return { success: false, error: "Not authorized." };

  const review = await prisma.review.update({ where: { id }, data: { isApproved } });
  if (isApproved && review.dishId) {
    const stats = await prisma.review.aggregate({ where: { dishId: review.dishId, isApproved: true }, _avg: { rating: true }, _count: true });
    await prisma.dish.update({
      where: { id: review.dishId },
      data: { rating: stats._avg.rating ?? 0, ratingCount: stats._count },
    });
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  return { success: true };
}

export async function setReviewFeatured(id: string, isFeatured: boolean): Promise<ActionResult> {
  const session = await requireAdmin("REVIEWS");
  if (!session) return { success: false, error: "Not authorized." };
  await prisma.review.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function deleteReview(id: string): Promise<ActionResult> {
  const session = await requireAdmin("REVIEWS");
  if (!session) return { success: false, error: "Not authorized." };
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  return { success: true };
}

// ---------------- Gallery ----------------

export async function addGalleryImage(data: { url: string; alt: string; category: GalleryCategory }): Promise<ActionResult> {
  const session = await requireAdmin("GALLERY");
  if (!session) return { success: false, error: "Not authorized." };
  await prisma.galleryImage.create({ data });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  const session = await requireAdmin("GALLERY");
  if (!session) return { success: false, error: "Not authorized." };
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function toggleGalleryFeatured(id: string, isFeatured: boolean): Promise<ActionResult> {
  const session = await requireAdmin("GALLERY");
  if (!session) return { success: false, error: "Not authorized." };
  await prisma.galleryImage.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin/gallery");
  return { success: true };
}

// ---------------- Messages ----------------

export async function markMessageRead(id: string, isRead: boolean): Promise<ActionResult> {
  const session = await requireAdmin("MESSAGES");
  if (!session) return { success: false, error: "Not authorized." };
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const session = await requireAdmin("MESSAGES");
  if (!session) return { success: false, error: "Not authorized." };
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  return { success: true };
}

// ---------------- Users (Super Admin only) ----------------

export async function createAdminUser(data: {
  name: string; email: string; password: string; role: Role; permissions: PermissionKey[];
}): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session || (session.user as any).role !== "SUPER_ADMIN") return { success: false, error: "Only Super Admins can manage users." };

  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing) return { success: false, error: "A user with that email already exists." };

  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      permissions: { create: data.permissions.map((key) => ({ key })) },
    },
  });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateAdminUser(id: string, data: { name: string; role: Role; permissions: PermissionKey[]; isActive: boolean }): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session || (session.user as any).role !== "SUPER_ADMIN") return { success: false, error: "Only Super Admins can manage users." };

  await prisma.$transaction([
    prisma.permission.deleteMany({ where: { userId: id } }),
    prisma.user.update({
      where: { id },
      data: { name: data.name, role: data.role, isActive: data.isActive, permissions: { create: data.permissions.map((key) => ({ key })) } },
    }),
  ]);
  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteAdminUser(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session || (session.user as any).role !== "SUPER_ADMIN") return { success: false, error: "Only Super Admins can manage users." };
  if ((session.user as any).id === id) return { success: false, error: "You can't delete your own account." };

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { success: true };
}

// ---------------- Site settings (CMS) ----------------

export async function updateSiteSettings(entries: Record<string, string>): Promise<ActionResult> {
  const session = await requireAdmin("SETTINGS");
  if (!session) return { success: false, error: "Not authorized." };

  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
