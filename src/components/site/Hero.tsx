"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";

const stats = [
  { value: "5K+", label: "Happy Guests" },
  { value: "50+", label: "Signature Dishes" },
  { value: "4.9", label: "Average Rating" },
];

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.09, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const imgX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const imgY = useTransform(sy, [-0.5, 0.5], [-16, 16]);
  const glowX = useTransform(sx, [-0.5, 0.5], ["40%", "60%"]);
  const glowY = useTransform(sy, [-0.5, 0.5], ["40%", "60%"]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      className="noise-overlay relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-24"
    >
      {/* Ambient ember glow that follows the cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-ember-glow"
        style={{ left: glowX, top: glowY, x: "-50%", y: "-50%", width: 900, height: 900 }}
      />

      {/* Floating embers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-ember-400"
            style={{ left: `${(i * 37) % 100}%`, bottom: "-5%" }}
            animate={{ y: [0, -700], opacity: [0, 0.8, 0] }}
            transition={{
              duration: 8 + (i % 5),
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mb-6 flex items-center gap-2"
          >
            <Flame size={14} className="text-ember-400" />
            <span className="eyebrow">Fire-Driven Dining · Est. 2011</span>
          </motion.div>

          <h1 className="font-display text-[13vw] leading-[0.95] text-bone sm:text-6xl md:text-7xl lg:text-[5.2rem]">
            <motion.span custom={1} initial="hidden" animate="show" variants={reveal} className="block">
              Taste the
            </motion.span>
            <motion.span
              custom={2}
              initial="hidden"
              animate="show"
              variants={reveal}
              className="block italic text-ember-400"
            >
              Extraordinary.
            </motion.span>
          </h1>

          <motion.p
            custom={3}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mt-6 max-w-md font-body text-lg text-bone-muted"
          >
            Where fire, flavor and creativity meet.
          </motion.p>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/menu" className="btn-ember group">
              Explore Menu
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/reservations" className="btn-ghost">
              Reserve a Table
            </Link>
          </motion.div>

          <motion.dl
            custom={5}
            initial="hidden"
            animate="show"
            variants={reveal}
            className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-8"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl text-gold md:text-4xl">{s.value}</dd>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-smoke">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* 3D-feeling floating dish image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative mx-auto aspect-square w-full max-w-lg"
          style={{ x: imgX, y: imgY }}
        >
          <div className="absolute inset-0 rounded-full bg-ember-glow blur-2xl" />
          <motion.div
            className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-ember"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80"
              alt="EMBERA signature wood-fired Fire Pizza"
              fill
              priority
              sizes="(min-width: 1024px) 32rem, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="glass-panel absolute -left-8 bottom-8 rounded-2xl px-5 py-4 shadow-card"
          >
            <p className="font-display text-lg text-bone">Fire Pizza</p>
            <p className="font-mono text-xs text-ember-400">★ 4.8 · Signature</p>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="h-8 w-px bg-gradient-to-b from-ember-400 to-transparent"
        />
      </motion.div>
    </section>
  );
}
