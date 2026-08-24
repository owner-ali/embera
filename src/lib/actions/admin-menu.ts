"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { dishSchema, categorySchema } from "@/lib/validations/dish";

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createDish(raw: Record<string, any>): Promise<ActionResult> {
  const session = await requireAdmin("MENU");
  if (!session) return { success: false, error: "Not authorized." };

  const parsed = dishSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const { ingredients, ...data } = parsed.data;

  const existing = await prisma.dish.findUnique({ where: { slug: data.slug } });
  if (existing) return { success: false, error: "A dish with that slug already exists.", fieldErrors: { slug: "Already taken" } };

  await prisma.dish.create({
    data: { ...data, ingredients: { create: ingredients.map((name) => ({ name })) } },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/");
  return { success: true };
}

export async function updateDish(id: string, raw: Record<string, any>): Promise<ActionResult> {
  const session = await requireAdmin("MENU");
  if (!session) return { success: false, error: "Not authorized." };

  const parsed = dishSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const { ingredients, ...data } = parsed.data;

  await prisma.dish.update({
    where: { id },
    data: {
      ...data,
      ingredients: { deleteMany: {}, create: ingredients.map((name) => ({ name })) },
    },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath(`/menu/${data.slug}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteDish(id: string): Promise<ActionResult> {
  const session = await requireAdmin("MENU");
  if (!session) return { success: false, error: "Not authorized." };

  await prisma.dish.delete({ where: { id } });
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}

export async function toggleDishAvailability(id: string, isAvailable: boolean): Promise<ActionResult> {
  const session = await requireAdmin("MENU");
  if (!session) return { success: false, error: "Not authorized." };

  await prisma.dish.update({ where: { id }, data: { isAvailable } });
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}

export async function createCategory(raw: Record<string, any>): Promise<ActionResult> {
  const session = await requireAdmin("MENU");
  if (!session) return { success: false, error: "Not authorized." };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  return { success: true };
}

export async function updateCategory(id: string, raw: Record<string, any>): Promise<ActionResult> {
  const session = await requireAdmin("MENU");
  if (!session) return { success: false, error: "Not authorized." };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const session = await requireAdmin("MENU");
  if (!session) return { success: false, error: "Not authorized." };

  const dishCount = await prisma.dish.count({ where: { categoryId: id } });
  if (dishCount > 0) return { success: false, error: `Move or delete the ${dishCount} dish(es) in this category first.` };

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  return { success: true };
}

export async function reorderCategories(orderedIds: string[]): Promise<ActionResult> {
  const session = await requireAdmin("MENU");
  if (!session) return { success: false, error: "Not authorized." };

  await Promise.all(orderedIds.map((id, i) => prisma.category.update({ where: { id }, data: { sortOrder: i } })));
  revalidatePath("/admin/categories");
  revalidatePath("/menu");
  return { success: true };
}
