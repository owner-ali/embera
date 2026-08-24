"use client";

import { useEffect } from "react";
import { Flame } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <Flame size={36} className="mb-6 text-ember-500" />
      <p className="font-mono text-sm uppercase tracking-widest2 text-smoke">Something went wrong</p>
      <h1 className="mt-3 font-display text-4xl text-bone">The kitchen hit a snag.</h1>
      <p className="mt-4 max-w-sm text-bone-muted">
        Try again, or head back to the homepage.
      </p>
      <button onClick={reset} className="btn-ember mt-8">Try Again</button>
    </div>
  );
}
