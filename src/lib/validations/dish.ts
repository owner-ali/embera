import { z } from "zod";

export const dishSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and hyphens only"),
  description: z.string().min(10, "Description must be at least 10 characters").max(600),
  price: z.coerce.number().positive("Price must be greater than 0"),
  imageUrl: z.string().url("Must be a valid image URL"),
  gallery: z.array(z.string().url()).default([]),
  calories: z.coerce.number().int().positive().optional(),
  allergens: z.array(z.string()).default([]),
  ingredients: z.array(z.string()).default([]),
  isVegetarian: z.boolean().default(false),
  isSpicy: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
});

export type DishInput = z.infer<typeof dishSchema>;

export const categorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  description: z.string().max(300).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;
