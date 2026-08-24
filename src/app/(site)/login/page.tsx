"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await signIn("customer", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/");
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      setLoading(false);
      return;
    }

    await signIn("customer", { email: payload.email, password: payload.password, redirect: false });
    setLoading(false);
    router.push("/");
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-ink px-6 pt-24">
      <div className="w-full max-w-md">
        <p className="eyebrow mb-3 text-center">Welcome</p>
        <h1 className="mb-8 text-center font-display text-3xl text-bone">
          {mode === "login" ? "Sign in to EMBERA" : "Create your account"}
        </h1>

        <div className="mb-8 flex rounded-full border border-white/10 p-1">
          <button
            onClick={() => setMode("login")}
            className={cn("flex-1 rounded-full py-2.5 text-sm transition-colors", mode === "login" ? "bg-ember-500 text-ink" : "text-bone-muted")}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            className={cn("flex-1 rounded-full py-2.5 text-sm transition-colors", mode === "register" ? "bg-ember-500 text-ink" : "text-bone-muted")}
          >
            Register
          </button>
        </div>

        {error && <p className="mb-4 rounded-lg border border-ember-800 bg-ember-900/30 px-4 py-2.5 text-sm text-ember-300">{error}</p>}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Email" name="email" type="email" required />
            <Field label="Password" name="password" type="password" required />
            <button type="submit" disabled={loading} className="btn-ember w-full disabled:opacity-60">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Field label="Full Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone (optional)" name="phone" />
            <Field label="Password" name="password" type="password" required minLength={8} />
            <button type="submit" disabled={loading} className="btn-ember w-full disabled:opacity-60">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required, minLength }: { label: string; name: string; type?: string; required?: boolean; minLength?: number }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block font-mono text-xs uppercase tracking-wider text-smoke">{label}</label>
      <input
        id={name} name={name} type={type} required={required} minLength={minLength}
        className="w-full rounded-xl border border-white/10 bg-char px-4 py-3 text-sm text-bone focus:border-ember-500 focus:outline-none"
      />
    </div>
  );
}
