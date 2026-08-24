"use server";

import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations/order";
import { generateOrderNumber, TAX_RATE, DELIVERY_FEE } from "@/lib/utils";
import type { CartLine } from "@/types";

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Creates a real order in the database from the client-side cart + checkout form.
 * Prices are recalculated server-side from the DB — never trusted from the client.
 */
export async function createOrder(
  items: CartLine[],
  rawInput: Record<string, string>
): Promise<CreateOrderResult> {
  if (!items || items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  const parsed = checkoutSchema.safeParse(rawInput);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  // Re-validate every dish server-side: availability + authoritative price.
  const dishIds = items.map((i) => i.dishId);
  const dishes = await prisma.dish.findMany({ where: { id: { in: dishIds } } });
  const dishMap = new Map(dishes.map((d) => [d.id, d]));

  for (const item of items) {
    const dish = dishMap.get(item.dishId);
    if (!dish || !dish.isAvailable) {
      return { success: false, error: `"${item.name}" is no longer available. Please update your cart.` };
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const dish = dishMap.get(item.dishId)!;
    return sum + Number(dish.price) * item.quantity;
  }, 0);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const deliveryFee = data.orderType === "DELIVERY" ? DELIVERY_FEE : 0;
  const total = +(subtotal + tax + deliveryFee).toFixed(2);

  // Link to an existing customer record by email, or proceed as guest.
  const customer = await prisma.customer.findUnique({ where: { email: data.email.toLowerCase() } });

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: customer?.id,
      guestName: customer ? undefined : data.fullName,
      guestEmail: customer ? undefined : data.email,
      guestPhone: customer ? undefined : data.phone,
      orderType: data.orderType,
      address: data.address,
      city: data.city,
      notes: data.notes,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "CASH" ? "PENDING" : "PAID",
      status: "PENDING",
      subtotal,
      tax,
      deliveryFee,
      total,
      estimatedTime: new Date(Date.now() + 40 * 60 * 1000),
      items: {
        create: items.map((item) => {
          const dish = dishMap.get(item.dishId)!;
          return {
            dishId: item.dishId,
            quantity: item.quantity,
            unitPrice: dish.price,
            spicyLevel: item.spicyLevel,
            extraCheese: item.extraCheese ?? false,
            extraSauce: item.extraSauce ?? false,
            sideDish: item.sideDish,
            notes: item.notes,
          };
        }),
      },
    },
  });

  if (customer) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { totalSpent: { increment: total } },
    });
  }

  // Notify admins.
  await prisma.notification.create({
    data: {
      type: "ORDER",
      title: "New order received",
      body: `Order ${order.orderNumber} — ${total.toFixed(2)} USD`,
      link: `/admin/orders`,
    },
  });

  return { success: true, orderId: order.id };
}
