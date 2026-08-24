"use server";

import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validations/reservation";

export interface CreateReservationResult {
  success: boolean;
  reservationId?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function createReservation(raw: Record<string, string>): Promise<CreateReservationResult> {
  const parsed = reservationSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;
  const date = new Date(data.date);

  // Find a table that fits the party and is free at this date + time.
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);

  const tables = await prisma.restaurantTable.findMany({
    where: { isActive: true, capacity: { gte: data.guests } },
    orderBy: { capacity: "asc" },
    include: {
      reservations: {
        where: {
          date: { gte: dayStart, lte: dayEnd },
          time: data.time,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      },
    },
  });

  const availableTable = tables.find((t) => t.reservations.length === 0);
  if (!availableTable) {
    return {
      success: false,
      error: "That time is fully booked for your party size. Please choose another time.",
      fieldErrors: { time: "Fully booked" },
    };
  }

  const customer = await prisma.customer.findUnique({ where: { email: data.email.toLowerCase() } });

  const reservation = await prisma.reservation.create({
    data: {
      customerId: customer?.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date,
      time: data.time,
      guests: data.guests,
      specialRequest: data.specialRequest,
      tableId: availableTable.id,
      status: "PENDING",
    },
  });

  await prisma.notification.create({
    data: {
      type: "RESERVATION",
      title: "New reservation request",
      body: `${data.name} · ${data.guests} guests · ${data.time}`,
      link: `/admin/reservations`,
    },
  });

  return { success: true, reservationId: reservation.id };
}
