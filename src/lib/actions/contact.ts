"use server";

import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validations/reservation";
import { reviewSchema } from "@/lib/validations/reservation";

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function sendContactMessage(raw: Record<string, string>): Promise<ActionResult> {
  const parsed = contactMessageSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  await prisma.contactMessage.create({ data: parsed.data });
  await prisma.notification.create({
    data: {
      type: "MESSAGE",
      title: "New contact message",
      body: `From ${parsed.data.name}`,
      link: "/admin/messages",
    },
  });

  return { success: true };
}

export async function submitReview(raw: Record<string, string>): Promise<ActionResult> {
  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  await prisma.review.create({
    data: {
      guestName: parsed.data.guestName,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      dishId: parsed.data.dishId || undefined,
      isApproved: false, // Admin moderates before it goes live
    },
  });
  await prisma.notification.create({
    data: { type: "REVIEW", title: "New review submitted", body: `From ${parsed.data.guestName}`, link: "/admin/reviews" },
  });

  return { success: true };
}
