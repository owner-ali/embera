"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Flame } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await signIn("admin", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials.");
      return;
    }
    router.push(searchParams.get("callbackUrl") ?? "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Flame size={28} className="mb-4 text-ember-500" />
          <p className="font-display text-2xl tracking-[0.15em] text-bone">EMBERA</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest2 text-smoke">Admin Console</p>
        </div>

        {error && <p className="mb-4 rounded-lg border border-ember-800 bg-ember-900/30 px-4 py-2.5 text-center text-sm text-ember-300">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">Email</label>
            <input name="email" type="email" required className="w-full rounded-xl border border-white/10 bg-char px-4 py-3 text-sm text-bone focus:border-ember-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">Password</label>
            <input name="password" type="password" required className="w-full rounded-xl border border-white/10 bg-char px-4 py-3 text-sm text-bone focus:border-ember-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-ember w-full disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center font-mono text-[11px] text-smoke">
          admin@embera.com / Embera@Admin123 (seeded)
        </p>
      </div>
    </div>
  );
}
