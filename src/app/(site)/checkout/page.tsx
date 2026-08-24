"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { createOrder } from "@/lib/actions/orders";
import { toast } from "sonner";

const orderTypes = [
  { value: "DELIVERY", label: "Delivery" },
  { value: "PICKUP", label: "Pickup" },
  { value: "DINE_IN", label: "Dine-in" },
] as const;

const paymentMethods = [
  { value: "CASH", label: "Cash on Delivery" },
  { value: "CARD", label: "Card Payment" },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, deliveryFee, clear } = useCart();
  const [orderType, setOrderType] = useState<(typeof orderTypes)[number]["value"]>("DELIVERY");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]["value"]>("CARD");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const sub = subtotal();
  const taxAmt = tax();
  const delivery = deliveryFee(orderType);
  const total = sub + taxAmt + delivery;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
    raw.orderType = orderType;
    raw.paymentMethod = paymentMethod;

    const result = await createOrder(items, raw);
    setSubmitting(false);

    if (!result.success) {
      setFieldErrors(result.fieldErrors ?? {});
      toast.error(result.error ?? "Something went wrong.");
      return;
    }

    clear();
    toast.success("Order placed! Redirecting to tracking…");
    router.push(`/order/${result.orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-ink pt-24 text-center">
        <div>
          <p className="font-display text-2xl text-bone">Your cart is empty.</p>
          <p className="mt-2 text-bone-muted">Add something delicious before checking out.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container">
        <h1 className="section-heading mb-12">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <fieldset>
              <legend className="mb-4 font-mono text-xs uppercase tracking-wider text-smoke">Order Type</legend>
              <div className="flex flex-wrap gap-3">
                {orderTypes.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => setOrderType(t.value)}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-sm transition-colors",
                      orderType === t.value ? "border-ember-500 bg-ember-500 text-ink" : "border-white/10 text-bone-muted hover:border-white/30"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Full Name" name="fullName" error={fieldErrors.fullName} required />
              <Field label="Email" name="email" type="email" error={fieldErrors.email} required />
              <Field label="Phone" name="phone" error={fieldErrors.phone} required />
              {orderType === "DELIVERY" && (
                <>
                  <Field label="Address" name="address" error={fieldErrors.address} required />
                  <Field label="City" name="city" error={fieldErrors.city} required />
                </>
              )}
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">Notes (optional)</label>
              <textarea
                name="notes"
                rows={3}
                placeholder="Allergies, delivery instructions, anything else…"
                className="w-full rounded-xl border border-white/10 bg-char px-4 py-3 text-sm text-bone placeholder:text-smoke focus:border-ember-500 focus:outline-none"
              />
            </div>

            <fieldset>
              <legend className="mb-4 font-mono text-xs uppercase tracking-wider text-smoke">Payment</legend>
              <div className="flex flex-wrap gap-3">
                {paymentMethods.map((m) => (
                  <button
                    type="button"
                    key={m.value}
                    onClick={() => setPaymentMethod(m.value)}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-sm transition-colors",
                      paymentMethod === m.value ? "border-ember-500 bg-ember-500 text-ink" : "border-white/10 text-bone-muted hover:border-white/30"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-smoke">
                Card payments are processed securely — EMBERA never stores raw card details.
              </p>
            </fieldset>
          </div>

          <div className="glass-panel h-fit rounded-2xl p-7">
            <h2 className="mb-5 font-display text-xl text-bone">Order Summary</h2>
            <ul className="mb-5 space-y-2 border-b border-white/10 pb-5 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-bone-muted">
                  <span>{item.quantity}× {item.name}</span>
                  <span className="font-mono text-bone">{formatCurrency(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-bone-muted"><span>Subtotal</span><span className="font-mono text-bone">{formatCurrency(sub)}</span></div>
              <div className="flex justify-between text-bone-muted"><span>Tax</span><span className="font-mono text-bone">{formatCurrency(taxAmt)}</span></div>
              <div className="flex justify-between text-bone-muted"><span>Delivery</span><span className="font-mono text-bone">{delivery > 0 ? formatCurrency(delivery) : "Free"}</span></div>
            </div>
            <div className="mt-5 flex justify-between border-t border-white/10 pt-5 font-display text-xl text-bone">
              <span>Total</span><span>{formatCurrency(total)}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="btn-ember mt-6 w-full disabled:opacity-60"
            >
              {submitting ? "Placing order…" : "Place Order"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", error, required,
}: { label: string; name: string; type?: string; error?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className={cn(
          "w-full rounded-xl border bg-char px-4 py-3 text-sm text-bone focus:outline-none",
          error ? "border-ember-500" : "border-white/10 focus:border-ember-500"
        )}
      />
      {error && <p className="mt-1 text-xs text-ember-400">{error}</p>}
    </div>
  );
}
