"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";
import { TAX_RATE, DELIVERY_FEE } from "@/lib/utils";

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: Omit<CartLine, "id">) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clear: () => void;
  subtotal: () => number;
  tax: () => number;
  deliveryFee: (orderType: "PICKUP" | "DELIVERY" | "DINE_IN") => number;
  total: (orderType: "PICKUP" | "DELIVERY" | "DINE_IN") => number;
  itemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (item) =>
        set((s) => ({
          items: [
            ...s.items,
            { ...item, id: `${item.dishId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
          ],
          isOpen: true,
        })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      incrementItem: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
        })),
      decrementItem: (id) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      tax: () => +(get().subtotal() * TAX_RATE).toFixed(2),
      deliveryFee: (orderType) => (orderType === "DELIVERY" ? DELIVERY_FEE : 0),
      total: (orderType) =>
        +(get().subtotal() + get().tax() + get().deliveryFee(orderType)).toFixed(2),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "embera-cart" }
  )
);
