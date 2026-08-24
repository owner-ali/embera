"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import type { OrderStatus, ReservationStatus } from "@prisma/client";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<ActionResult> {
  const session = await requireAdmin("ORDERS");
  if (!session) return { success: false, error: "Not authorized." };

  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/order/${id}`);
  return { success: true };
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<ActionResult> {
  const session = await requireAdmin("RESERVATIONS");
  if (!session) return { success: false, error: "Not authorized." };

  await prisma.reservation.update({ where: { id }, data: { status } });
  revalidatePath("/admin/reservations");
  return { success: true };
}

export async function rescheduleReservation(id: string, date: string, time: string): Promise<ActionResult> {
  const session = await requireAdmin("RESERVATIONS");
  if (!session) return { success: false, error: "Not authorized." };

  await prisma.reservation.update({ where: { id }, data: { date: new Date(date), time, status: "PENDING" } });
  revalidatePath("/admin/reservations");
  return { success: true };
}

export async function reassignReservationTable(id: string, tableId: string): Promise<ActionResult> {
  const session = await requireAdmin("RESERVATIONS");
  if (!session) return { success: false, error: "Not authorized." };

  await prisma.reservation.update({ where: { id }, data: { tableId } });
  revalidatePath("/admin/reservations");
  return { success: true };
}
