import type { Metadata } from "next";
import Image from "next/image";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";

export const metadata: Metadata = { title: "About" };

const stats = [
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Signature Dishes" },
  { value: 5, suffix: "K+", label: "Guests" },
  { value: 20, suffix: "+", label: "Awards" },
];

const pillars = [
  {
    title: "Our Story",
    body: "EMBERA began with a single wood-fired oven and a belief that a plate could feel like a moment. Fifteen years later, that same fire still anchors every dish we send out.",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
  },
  {
    title: "Our Chef",
    body: "Trained across three continents, our head chef builds every menu around what fire does best — char, smoke, and depth you can't fake.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&q=80",
  },
  {
    title: "Our Philosophy",
    body: "Fewer ingredients, better sourced, cooked with intention. We'd rather perfect ten dishes than offer forty.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80",
  },
  {
    title: "Our Ingredients",
    body: "Produce arrives daily from regional farms we've worked with for over a decade. Nothing frozen, nothing held over.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container mb-20 max-w-2xl">
        <p className="eyebrow mb-4">About EMBERA</p>
        <h1 className="section-heading">Fifteen years of cooking over open flame.</h1>
      </div>

      <div className="container mb-24 grid grid-cols-2 gap-6 border-y border-white/10 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-4xl text-gold md:text-5xl">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-smoke">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="container space-y-24">
        {pillars.map((p, i) => (
          <div
            key={p.title}
            className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <Image src={p.image} alt={p.title} fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
            </div>
            <div>
              <p className="eyebrow mb-4">{`0${i + 1}`}</p>
              <h2 className="font-display text-3xl text-bone md:text-4xl">{p.title}</h2>
              <p className="mt-4 max-w-md leading-relaxed text-bone-muted">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
