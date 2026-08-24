"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, incrementItem, decrementItem, removeItem, subtotal, tax, deliveryFee } = useCart();
  const sub = subtotal();
  const taxAmt = tax();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-ink px-6 pt-24 text-center">
        <ShoppingBag size={40} className="mb-4 text-smoke" />
        <h1 className="font-display text-3xl text-bone">Your cart is empty</h1>
        <p className="mt-2 text-bone-muted">Add a few signature dishes to get started.</p>
        <Link href="/menu" className="btn-ember mt-8">Explore Menu</Link>
      </div>
    );
  }

  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container">
        <h1 className="section-heading mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <ul className="lg:col-span-2">
            {items.map((item) => (
              <li key={item.id} className="flex gap-5 border-b border-white/10 py-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg text-bone">{item.name}</p>
                      {(item.spicyLevel || item.sideDish || item.extraCheese || item.extraSauce) && (
                        <p className="mt-1 text-xs text-smoke">
                          {[item.spicyLevel, item.sideDish, item.extraCheese && "Extra cheese", item.extraSauce && "Extra sauce"]
                            .filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {item.notes && <p className="mt-1 text-xs italic text-smoke">&ldquo;{item.notes}&rdquo;</p>}
                    </div>
                    <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="text-smoke hover:text-ember-400">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-3 rounded-full border border-white/10 px-3 py-1.5">
                      <button onClick={() => decrementItem(item.id)} aria-label="Decrease quantity" className="text-bone/70 hover:text-gold"><Minus size={14} /></button>
                      <span className="w-5 text-center font-mono text-sm">{item.quantity}</span>
                      <button onClick={() => incrementItem(item.id)} aria-label="Increase quantity" className="text-bone/70 hover:text-gold"><Plus size={14} /></button>
                    </div>
                    <span className="font-mono text-gold">{formatCurrency(item.unitPrice * item.quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="glass-panel h-fit rounded-2xl p-7">
            <h2 className="mb-5 font-display text-xl text-bone">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-bone-muted">
                <span>Subtotal</span><span className="font-mono text-bone">{formatCurrency(sub)}</span>
              </div>
              <div className="flex justify-between text-bone-muted">
                <span>Tax (8%)</span><span className="font-mono text-bone">{formatCurrency(taxAmt)}</span>
              </div>
              <div className="flex justify-between text-bone-muted">
                <span>Delivery fee</span><span className="font-mono text-bone">Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-5 flex justify-between border-t border-white/10 pt-5 font-display text-xl text-bone">
              <span>Total</span><span>{formatCurrency(sub + taxAmt)}</span>
            </div>
            <Link href="/checkout" className="btn-ember mt-6 w-full group">
              Proceed to Checkout <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
