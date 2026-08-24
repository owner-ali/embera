"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { createReservation } from "@/lib/actions/reservations";

const times = ["12:00", "12:30", "13:00", "13:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

export default function ReservationsPage() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ name: string; date: string; time: string; guests: string } | null>(null);
  const [time, setTime] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
    raw.time = time;

    const result = await createReservation(raw);
    setSubmitting(false);

    if (!result.success) {
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }
    setSuccess({ name: raw.name, date: raw.date, time: raw.time, guests: raw.guests });
  }

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-ink px-6 pt-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <CalendarCheck size={40} className="mx-auto mb-5 text-ember-400" />
          <h1 className="font-display text-3xl text-bone">Request received, {success.name.split(" ")[0]}.</h1>
          <p className="mt-3 max-w-md text-bone-muted">
            We&apos;ll confirm your table for {success.guests} guests on {success.date} at {success.time} within the hour by email.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container max-w-xl">
        <p className="eyebrow mb-4 text-center">Reservations</p>
        <h1 className="section-heading mb-10 text-center">Book Your Table</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Name" name="name" error={fieldErrors.name} required />
            <Field label="Email" name="email" type="email" error={fieldErrors.email} required />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Phone" name="phone" error={fieldErrors.phone} required />
            <Field label="Date" name="date" type="date" error={fieldErrors.date} required min={new Date().toISOString().split("T")[0]} />
            <Field label="Guests" name="guests" type="number" defaultValue="2" min={1} max={20} error={fieldErrors.guests} required />
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">Time</label>
            <div className="flex flex-wrap gap-2">
              {times.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    time === t ? "border-ember-500 bg-ember-500 text-ink" : "border-white/10 text-bone-muted hover:border-white/30"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            {fieldErrors.time && <p className="mt-2 text-xs text-ember-400">{fieldErrors.time}</p>}
          </div>

          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">Special Request (optional)</label>
            <textarea
              name="specialRequest"
              rows={3}
              placeholder="Anniversary, allergies, seating preference…"
              className="w-full rounded-xl border border-white/10 bg-char px-4 py-3 text-sm text-bone placeholder:text-smoke focus:border-ember-500 focus:outline-none"
            />
          </div>

          <button type="submit" disabled={submitting || !time} className="btn-ember w-full disabled:opacity-50">
            {submitting ? "Checking availability…" : "Request Reservation"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", error, required, ...rest
}: { label: string; name: string; type?: string; error?: string; required?: boolean; [key: string]: any }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">{label}</label>
      <input
        id={name} name={name} type={type} required={required} {...rest}
        className={cn(
          "w-full rounded-xl border bg-char px-4 py-3 text-sm text-bone focus:outline-none",
          error ? "border-ember-500" : "border-white/10 focus:border-ember-500"
        )}
      />
      {error && <p className="mt-1 text-xs text-ember-400">{error}</p>}
    </div>
  );
}
