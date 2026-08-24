import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number").max(20),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), "Pick a valid date"),
  time: z.string().min(1, "Pick a time"),
  guests: z.coerce.number().int().min(1, "At least 1 guest").max(20, "For 20+ guests, call us directly"),
  specialRequest: z.string().max(300).optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Enter a valid email"),
  phone: z.string().max(20).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const reviewSchema = z.object({
  guestName: z.string().min(2).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10, "Tell us a bit more").max(500),
  dishId: z.string().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
