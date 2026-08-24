import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EMB-${timestamp}-${random}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Tax rate applied at checkout — kept centralized so it's a single source of truth. */
export const TAX_RATE = 0.08;
export const DELIVERY_FEE = 4.99;

/**
 * Resolves the site's public base URL safely. Never trusts an env var
 * blindly — a var that's merely present but empty, whitespace, or malformed
 * (e.g. left as stray quotes in a dashboard field) would otherwise crash
 * `new URL(...)` at build time. Falls back to Vercel's auto-provided
 * deployment URL, then localhost for local dev.
 */
export function getSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      // eslint-disable-next-line no-new
      new URL(candidate);
      return candidate;
    } catch {
      // Not a valid URL — ignore and try the next candidate.
    }
  }

  return "http://localhost:3000";
}
