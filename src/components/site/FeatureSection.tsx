"use client";

import { motion } from "framer-motion";
import { ChefHat, Leaf, Zap, Sparkles } from "lucide-react";

const features = [
  {
    number: "01",
    icon: ChefHat,
    title: "Chef Crafted",
    description: "Every dish is developed and finished by our head chef before it ever reaches the pass.",
  },
  {
    number: "02",
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Produce sourced daily from regional farms — nothing frozen, nothing held over.",
  },
  {
    number: "03",
    icon: Zap,
    title: "Fast Ordering",
    description: "From browsing the menu to a confirmed order, checkout takes under a minute.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Exceptional Experience",
    description: "An open kitchen, a considered room, and service that remembers your name.",
  },
];

export function FeatureSection() {
  return (
    <section className="bg-ink py-24 md:py-32">
      <div className="container">
        <div className="mb-16 max-w-lg">
          <p className="eyebrow mb-4">Why EMBERA</p>
          <h2 className="section-heading">Built around fire, precision, and hospitality.</h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-char p-8 transition-colors duration-500 hover:bg-char-light"
            >
              <span className="font-mono text-xs text-smoke">{f.number}</span>
              <f.icon
                size={26}
                strokeWidth={1.5}
                className="mb-6 mt-8 text-ember-400 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110"
              />
              <h3 className="font-display text-xl text-bone">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bone-muted">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
