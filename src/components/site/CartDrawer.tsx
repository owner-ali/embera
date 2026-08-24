"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, close, incrementItem, decrementItem, removeItem, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-char shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-display text-xl text-bone">Your Cart</h2>
              <button onClick={close} aria-label="Close cart" className="text-bone/70 hover:text-gold">
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag size={36} className="text-smoke" />
                <p className="text-bone-muted">Your cart is empty.</p>
                <Link href="/menu" onClick={close} className="btn-ember mt-2">
                  Explore Menu
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 border-b border-white/5 py-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-body text-sm font-semibold text-bone">{item.name}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="text-smoke hover:text-ember-400"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        {(item.spicyLevel || item.sideDish || item.extraCheese || item.extraSauce) && (
                          <p className="mt-0.5 text-xs text-smoke">
                            {[item.spicyLevel, item.sideDish, item.extraCheese && "Extra cheese", item.extraSauce && "Extra sauce"]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-white/10 px-2 py-1">
                            <button onClick={() => decrementItem(item.id)} aria-label="Decrease quantity" className="text-bone/70 hover:text-gold">
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center font-mono text-xs">{item.quantity}</span>
                            <button onClick={() => incrementItem(item.id)} aria-label="Increase quantity" className="text-bone/70 hover:text-gold">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-mono text-sm text-gold">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 px-6 py-6">
                  <div className="mb-4 flex items-center justify-between font-body text-sm text-bone-muted">
                    <span>Subtotal</span>
                    <span className="font-mono text-bone">{formatCurrency(subtotal())}</span>
                  </div>
                  <Link href="/checkout" onClick={close} className="btn-ember w-full">
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
