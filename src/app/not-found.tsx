import Link from "next/link";
import { Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <Flame size={36} className="mb-6 text-ember-500" />
      <p className="font-mono text-sm uppercase tracking-widest2 text-smoke">404</p>
      <h1 className="mt-3 font-display text-4xl text-bone md:text-5xl">This table isn&apos;t set.</h1>
      <p className="mt-4 max-w-sm text-bone-muted">
        The page you&apos;re looking for doesn&apos;t exist, or has moved.
      </p>
      <Link href="/" className="btn-ember mt-8">Back to EMBERA</Link>
    </div>
  );
}
