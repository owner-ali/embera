"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/lib/actions/admin-misc";
import { toast } from "sonner";

interface Props {
  initial: Record<string, string>;
}

const fields: { key: string; label: string; type?: "text" | "textarea"; group: string }[] = [
  { key: "restaurantName", label: "Restaurant Name", group: "Brand" },
  { key: "tagline", label: "Tagline", group: "Brand" },
  { key: "heroHeading", label: "Hero Heading", group: "Homepage" },
  { key: "heroSubtitle", label: "Hero Subtitle", group: "Homepage" },
  { key: "aboutText", label: "About Text", type: "textarea", group: "Homepage" },
  { key: "phone", label: "Phone", group: "Contact" },
  { key: "email", label: "Email", group: "Contact" },
  { key: "address", label: "Address", group: "Contact" },
  { key: "openingHours", label: "Opening Hours", group: "Contact" },
  { key: "instagram", label: "Instagram URL", group: "Social" },
  { key: "facebook", label: "Facebook URL", group: "Social" },
  { key: "seoTitle", label: "SEO Title", group: "SEO" },
  { key: "seoDescription", label: "SEO Description", type: "textarea", group: "SEO" },
  { key: "ogImage", label: "OG Image URL", group: "SEO" },
];

export function SettingsForm({ initial }: Props) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [submitting, setSubmitting] = useState(false);

  const groups = Array.from(new Set(fields.map((f) => f.group)));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await updateSiteSettings(values);
    setSubmitting(false);
    if (!result.success) { toast.error(result.error ?? "Failed to save"); return; }
    toast.success("Settings saved — live on the site now");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {groups.map((group) => (
        <div key={group} className="rounded-2xl bg-char p-6">
          <h2 className="mb-5 font-mono text-xs uppercase tracking-wider text-smoke">{group}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.filter((f) => f.group === group).map((f) => (
              <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none"
                  />
                ) : (
                  <input
                    value={values[f.key] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-ink px-4 py-2.5 text-sm text-bone focus:border-ember-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="submit" disabled={submitting} className="btn-ember disabled:opacity-60">
        {submitting ? "Saving…" : "Save All Settings"}
      </button>
    </form>
  );
}
