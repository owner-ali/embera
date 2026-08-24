import { z } from "zod";

export const cartItemCustomizationSchema = z.object({
  dishId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(20),
  spicyLevel: z.enum(["mild", "medium", "hot", "extra-hot"]).optional(),
  extraCheese: z.boolean().default(false),
  extraSauce: z.boolean().default(false),
  sideDish: z.string().optional(),
  notes: z.string().max(200).optional(),
});

export type CartItemCustomizationInput = z.infer<typeof cartItemCustomizationSchema>;

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  address: z.string().max(200).optional(),
  city: z.string().max(80).optional(),
  orderType: z.enum(["PICKUP", "DELIVERY", "DINE_IN"]),
  notes: z.string().max(300).optional(),
  paymentMethod: z.enum(["CASH", "CARD"]),
}).superRefine((data, ctx) => {
  if (data.orderType === "DELIVERY" && (!data.address || !data.city)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Address and city are required for delivery orders",
      path: ["address"],
    });
  }
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED",
  ]),
});
