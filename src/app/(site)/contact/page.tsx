"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";
import { sendContactMessage } from "@/lib/actions/contact";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
    const result = await sendContactMessage(raw);
    setSubmitting(false);
    if (!result.success) {
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }
    setSent(true);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="section-heading mb-8">Let&apos;s talk.</h1>

          <ul className="space-y-5 text-bone-muted">
            <li className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 text-ember-400" /> 214 Ember Lane, New York, NY 10012</li>
            <li className="flex items-center gap-3"><Phone size={18} className="text-ember-400" /> +1 (212) 555-0148</li>
            <li className="flex items-center gap-3"><Mail size={18} className="text-ember-400" /> reservations@embera.com</li>
            <li className="flex items-center gap-3"><Clock size={18} className="text-ember-400" /> Mon–Thu 5pm–11pm · Fri–Sun 12pm–1am</li>
          </ul>

          <div className="mt-6 flex gap-3">
            <a href="#" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-bone/70 hover:border-gold hover:text-gold"><MessageCircle size={17} /></a>
            <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-bone/70 hover:border-gold hover:text-gold"><Instagram size={17} /></a>
            <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-bone/70 hover:border-gold hover:text-gold"><Facebook size={17} /></a>
          </div>

          <div className="mt-8 aspect-video overflow-hidden rounded-2xl">
            <iframe
              title="EMBERA location"
              className="h-full w-full grayscale invert-[0.9]"
              loading="lazy"
              src="https://www.google.com/maps?q=New+York,NY&output=embed"
            />
          </div>
        </div>

        <div>
          {sent ? (
            <div className="glass-panel flex h-full flex-col items-center justify-center rounded-2xl p-12 text-center">
              <p className="font-display text-2xl text-bone">Message sent.</p>
              <p className="mt-2 text-bone-muted">We&apos;ll get back to you within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Name" name="name" error={fieldErrors.name} required />
              <Field label="Email" name="email" type="email" error={fieldErrors.email} required />
              <Field label="Phone (optional)" name="phone" error={fieldErrors.phone} />
              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className={cn(
                    "w-full rounded-xl border bg-char px-4 py-3 text-sm text-bone focus:outline-none",
                    fieldErrors.message ? "border-ember-500" : "border-white/10 focus:border-ember-500"
                  )}
                />
                {fieldErrors.message && <p className="mt-1 text-xs text-ember-400">{fieldErrors.message}</p>}
              </div>
              <button type="submit" disabled={submitting} className="btn-ember w-full disabled:opacity-60">
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", error, required }: { label: string; name: string; type?: string; error?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">{label}</label>
      <input
        id={name} name={name} type={type} required={required}
        className={cn(
          "w-full rounded-xl border bg-char px-4 py-3 text-sm text-bone focus:outline-none",
          error ? "border-ember-500" : "border-white/10 focus:border-ember-500"
        )}
      />
      {error && <p className="mt-1 text-xs text-ember-400">{error}</p>}
    </div>
  );
}
